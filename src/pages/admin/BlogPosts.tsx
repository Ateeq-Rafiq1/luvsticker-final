
import React, { useState } from 'react';
import { Layout } from '@/components/admin/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Eye, Calendar, User, Upload, X } from 'lucide-react';
import { mockBlogPosts } from '@/data/blogData';
import { BlogPost } from '@/types/blog';
import { useToast } from '@/hooks/use-toast';

const BlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    status: 'draft' as 'draft' | 'published',
    featuredImage: '',
    tags: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      canonicalUrl: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      twitterCard: 'summary_large_image' as 'summary' | 'summary_large_image',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: ''
    }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setUploadedImage(imageUrl);
        setFormData({...formData, featuredImage: imageUrl});
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setFormData({...formData, featuredImage: ''});
  };

  const handleCreatePost = () => {
    setIsEditing(false);
    setUploadedImage(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: '',
      status: 'draft',
      featuredImage: '',
      tags: '',
      seo: {
        metaTitle: '',
        metaDescription: '',
        keywords: '',
        canonicalUrl: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        twitterCard: 'summary_large_image',
        twitterTitle: '',
        twitterDescription: '',
        twitterImage: ''
      }
    });
    setIsDialogOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setIsEditing(true);
    setSelectedPost(post);
    setUploadedImage(post.featuredImage || null);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      status: post.status,
      featuredImage: post.featuredImage || '',
      tags: post.tags.join(', '),
      seo: {
        metaTitle: post.seo.metaTitle,
        metaDescription: post.seo.metaDescription,
        keywords: post.seo.keywords.join(', '),
        canonicalUrl: post.seo.canonicalUrl || '',
        ogTitle: post.seo.ogTitle || '',
        ogDescription: post.seo.ogDescription || '',
        ogImage: post.seo.ogImage || '',
        twitterCard: post.seo.twitterCard || 'summary_large_image',
        twitterTitle: post.seo.twitterTitle || '',
        twitterDescription: post.seo.twitterDescription || '',
        twitterImage: post.seo.twitterImage || ''
      }
    });
    setIsDialogOpen(true);
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter(post => post.id !== id));
    toast({
      title: "Post deleted",
      description: "The blog post has been successfully deleted.",
    });
  };

  const handleSavePost = () => {
    const now = new Date().toISOString();
    const newPost: BlogPost = {
      id: isEditing ? selectedPost!.id : Date.now().toString(),
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: formData.excerpt,
      content: formData.content,
      author: formData.author,
      status: formData.status,
      featuredImage: formData.featuredImage || undefined,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      publishedAt: isEditing ? selectedPost!.publishedAt : now,
      updatedAt: now,
      seo: {
        metaTitle: formData.seo.metaTitle,
        metaDescription: formData.seo.metaDescription,
        keywords: formData.seo.keywords.split(',').map(k => k.trim()).filter(Boolean),
        canonicalUrl: formData.seo.canonicalUrl || undefined,
        ogTitle: formData.seo.ogTitle || undefined,
        ogDescription: formData.seo.ogDescription || undefined,
        ogImage: formData.seo.ogImage || undefined,
        twitterCard: formData.seo.twitterCard,
        twitterTitle: formData.seo.twitterTitle || undefined,
        twitterDescription: formData.seo.twitterDescription || undefined,
        twitterImage: formData.seo.twitterImage || undefined
      },
      readingTime: Math.ceil(formData.content.split(' ').length / 200)
    };

    if (isEditing) {
      setPosts(posts.map(post => post.id === selectedPost!.id ? newPost : post));
      toast({
        title: "Post updated",
        description: "The blog post has been successfully updated.",
      });
    } else {
      setPosts([...posts, newPost]);
      toast({
        title: "Post created",
        description: "The blog post has been successfully created.",
      });
    }

    setIsDialogOpen(false);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <Button onClick={handleCreatePost}>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditPost(post)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Post' : 'Create New Post'}</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Enter post title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      placeholder="post-url-slug"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({...formData, author: e.target.value})}
                      placeholder="Author name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: 'draft' | 'published') => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="featuredImage">Featured Image</Label>
                  <div className="space-y-4">
                    {uploadedImage ? (
                      <div className="relative">
                        <img 
                          src={uploadedImage} 
                          alt="Featured" 
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label htmlFor="imageUpload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              Upload a featured image
                            </span>
                            <input
                              id="imageUpload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="design, stickers, tutorial"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    placeholder="Brief description of the post"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Write your blog post content here..."
                    rows={10}
                  />
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={formData.seo.metaTitle}
                    onChange={(e) => setFormData({...formData, seo: {...formData.seo, metaTitle: e.target.value}})}
                    placeholder="SEO optimized title (60 characters max)"
                  />
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.seo.metaDescription}
                    onChange={(e) => setFormData({...formData, seo: {...formData.seo, metaDescription: e.target.value}})}
                    placeholder="SEO description (160 characters max)"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="keywords">SEO Keywords (comma separated)</Label>
                  <Input
                    id="keywords"
                    value={formData.seo.keywords}
                    onChange={(e) => setFormData({...formData, seo: {...formData.seo, keywords: e.target.value}})}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <div>
                  <Label htmlFor="canonicalUrl">Canonical URL (optional)</Label>
                  <Input
                    id="canonicalUrl"
                    value={formData.seo.canonicalUrl}
                    onChange={(e) => setFormData({...formData, seo: {...formData.seo, canonicalUrl: e.target.value}})}
                    placeholder="https://example.com/canonical-url"
                  />
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-semibold">Open Graph (Facebook)</h4>
                  <div>
                    <Label htmlFor="ogTitle">OG Title</Label>
                    <Input
                      id="ogTitle"
                      value={formData.seo.ogTitle}
                      onChange={(e) => setFormData({...formData, seo: {...formData.seo, ogTitle: e.target.value}})}
                      placeholder="Facebook share title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ogDescription">OG Description</Label>
                    <Textarea
                      id="ogDescription"
                      value={formData.seo.ogDescription}
                      onChange={(e) => setFormData({...formData, seo: {...formData.seo, ogDescription: e.target.value}})}
                      placeholder="Facebook share description"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ogImage">OG Image URL</Label>
                    <Input
                      id="ogImage"
                      value={formData.seo.ogImage}
                      onChange={(e) => setFormData({...formData, seo: {...formData.seo, ogImage: e.target.value}})}
                      placeholder="https://example.com/og-image.jpg"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Twitter</h4>
                  <div>
                    <Label htmlFor="twitterCard">Twitter Card Type</Label>
                    <Select 
                      value={formData.seo.twitterCard} 
                      onValueChange={(value: 'summary' | 'summary_large_image') => 
                        setFormData({...formData, seo: {...formData.seo, twitterCard: value}})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Summary</SelectItem>
                        <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="twitterTitle">Twitter Title</Label>
                    <Input
                      id="twitterTitle"
                      value={formData.seo.twitterTitle}
                      onChange={(e) => setFormData({...formData, seo: {...formData.seo, twitterTitle: e.target.value}})}
                      placeholder="Twitter share title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitterDescription">Twitter Description</Label>
                    <Textarea
                      id="twitterDescription"
                      value={formData.seo.twitterDescription}
                      onChange={(e) => setFormData({...formData, seo: {...formData.seo, twitterDescription: e.target.value}})}
                      placeholder="Twitter share description"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitterImage">Twitter Image URL</Label>
                    <Input
                      id="twitterImage"
                      value={formData.seo.twitterImage}
                      onChange={(e) => setFormData({...formData, seo: {...formData.seo, twitterImage: e.target.value}})}
                      placeholder="https://example.com/twitter-image.jpg"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePost}>
                {isEditing ? 'Update Post' : 'Create Post'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default BlogPosts;
