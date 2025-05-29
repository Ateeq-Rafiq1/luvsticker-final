
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image_url: string;
  is_published: boolean;
}

interface BlogFormProps {
  onClose: () => void;
  blog?: any;
}

const BlogForm = ({ onClose, blog }: BlogFormProps) => {
  const queryClient = useQueryClient();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BlogFormData>({
    defaultValues: {
      title: blog?.title || "",
      slug: blog?.slug || "",
      content: blog?.content || "",
      excerpt: blog?.excerpt || "",
      cover_image_url: blog?.cover_image_url || "",
      is_published: blog?.is_published ?? false,
    }
  });

  const createBlogMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const blogData = {
        ...data,
        published_at: data.is_published ? new Date().toISOString() : null
      };

      const { error } = await supabase
        .from('blogs')
        .insert(blogData);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast({ title: "Blog post created successfully" });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error creating blog post",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateBlogMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const blogData = {
        ...data,
        published_at: data.is_published && !blog.published_at ? new Date().toISOString() : blog.published_at
      };

      const { error } = await supabase
        .from('blogs')
        .update(blogData)
        .eq('id', blog.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast({ title: "Blog post updated successfully" });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error updating blog post",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: BlogFormData) => {
    if (blog) {
      updateBlogMutation.mutate(data);
    } else {
      createBlogMutation.mutate(data);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!blog) { // Only auto-generate slug for new posts
      setValue('slug', generateSlug(title));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{blog ? 'Edit Blog Post' : 'Add Blog Post'}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register("title", { required: "Title is required" })}
                onChange={handleTitleChange}
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                {...register("slug", { required: "Slug is required" })}
                placeholder="url-friendly-version-of-title"
              />
              {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                {...register("excerpt")}
                placeholder="Brief description of the blog post"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="cover_image_url">Cover Image URL</Label>
              <Input
                id="cover_image_url"
                {...register("cover_image_url")}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                {...register("content", { required: "Content is required" })}
                placeholder="Write your blog content here (HTML supported)"
                rows={10}
              />
              {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_published"
                checked={watch("is_published")}
                onCheckedChange={(checked) => setValue("is_published", checked)}
              />
              <Label htmlFor="is_published">Publish immediately</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createBlogMutation.isPending || updateBlogMutation.isPending}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {createBlogMutation.isPending || updateBlogMutation.isPending 
                  ? "Saving..." 
                  : blog ? "Update Post" : "Create Post"
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogForm;
