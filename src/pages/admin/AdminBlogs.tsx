
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminBlogs = () => {
  const queryClient = useQueryClient();

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      
      return data || [];
    }
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (blogId: string) => {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blogId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast({
        title: "Blog post deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting blog post",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleDeleteBlog = (blogId: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      deleteBlogMutation.mutate(blogId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/admin" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Manage Blog</h1>
            </div>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Blog Post
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : blogs?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No blog posts found.</p>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Blog Post
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs?.map((blog) => (
              <Card key={blog.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{blog.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant={blog.is_published ? "default" : "secondary"}>
                        {blog.is_published ? "Published" : "Draft"}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteBlog(blog.id)}
                        disabled={deleteBlogMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold mb-1">Slug</h4>
                      <p className="text-sm text-gray-600">{blog.slug}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Created</h4>
                      <p className="text-sm text-gray-600">{new Date(blog.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Published</h4>
                      <p className="text-sm text-gray-600">
                        {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : 'Not published'}
                      </p>
                    </div>
                  </div>
                  {blog.excerpt && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{blog.excerpt}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlogs;
