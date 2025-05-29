
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, Facebook, Twitter, Linkedin, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const BlogDetail = () => {
  const { slug } = useParams();

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();
      
      return data;
    },
    enabled: !!slug
  });

  const { data: relatedBlogs } = useQuery({
    queryKey: ['related-blogs', blog?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .neq('id', blog?.id)
        .order('published_at', { ascending: false })
        .limit(3);
      
      return data || [];
    },
    enabled: !!blog?.id
  });

  const shareUrl = window.location.href;
  const shareTitle = blog?.title || '';

  const handleShare = async (platform: string) => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(shareTitle);
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast({ title: "Link copied to clipboard!" });
        } catch (err) {
          toast({ title: "Failed to copy link", variant: "destructive" });
        }
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-64 bg-gray-300 rounded mb-6"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
            <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
            <Link 
              to="/blog" 
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      {/* Back to Blog Button */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      <div className="flex-1">
        {/* Hero Section with Cover Image */}
        {blog.cover_image_url && (
          <div className="relative">
            <div className="w-full h-[50vh] md:h-[65vh] relative">
              <img
                src={blog.cover_image_url}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            </div>
            
            {/* Overlaid Content */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="text-white">
                  <div className="flex items-center text-sm text-gray-200 mb-6">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(blog.published_at)}
                    <span className="mx-3">•</span>
                    <Clock className="w-4 h-4 mr-2" />
                    {getReadingTime(blog.content)} min read
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 text-shadow-lg">
                    {blog.title}
                  </h1>
                  {blog.excerpt && (
                    <p className="text-xl md:text-2xl text-gray-100 max-w-4xl leading-relaxed">
                      {blog.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Content Section */}
        <div className="bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Header for posts without cover image */}
            {!blog.cover_image_url && (
              <header className="mb-16 text-center">
                <div className="flex items-center justify-center text-sm text-gray-500 mb-8">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(blog.published_at)}
                  <span className="mx-3">•</span>
                  <Clock className="w-4 h-4 mr-2" />
                  {getReadingTime(blog.content)} min read
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-8">
                  {blog.title}
                </h1>
                {blog.excerpt && (
                  <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                    {blog.excerpt}
                  </p>
                )}
                <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mt-10 rounded-full"></div>
              </header>
            )}
            
            {/* Share Section */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-8 mb-12">
              <div className="text-sm text-gray-500">
                Share this article
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('facebook')}
                  className="hover:bg-blue-50 hover:border-blue-200"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('twitter')}
                  className="hover:bg-blue-50 hover:border-blue-200"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('linkedin')}
                  className="hover:bg-blue-50 hover:border-blue-200"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('copy')}
                  className="hover:bg-gray-50 hover:border-gray-300"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Article Content */}
            <article 
              className="prose prose-xl prose-gray max-w-none 
                         prose-headings:text-gray-900 prose-headings:font-black prose-headings:tracking-tight
                         prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-12 prose-h1:text-orange-900
                         prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:text-gray-800 prose-h2:border-b prose-h2:border-orange-100 prose-h2:pb-3
                         prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-gray-800
                         prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6 prose-h4:text-gray-700
                         prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-8 prose-p:text-lg prose-p:font-medium
                         prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline prose-a:font-semibold prose-a:decoration-2 prose-a:underline-offset-2
                         prose-strong:text-gray-900 prose-strong:font-bold
                         prose-ul:text-gray-700 prose-ol:text-gray-700 prose-ul:text-lg prose-ol:text-lg
                         prose-li:mb-3 prose-li:leading-relaxed prose-li:font-medium
                         prose-blockquote:border-l-4 prose-blockquote:border-orange-500 
                         prose-blockquote:pl-8 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:bg-orange-50 prose-blockquote:py-4 prose-blockquote:rounded-r-lg
                         prose-code:bg-orange-100 prose-code:px-3 prose-code:py-1 prose-code:rounded prose-code:text-orange-800 prose-code:font-semibold
                         prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-6
                         prose-img:rounded-xl prose-img:shadow-2xl prose-img:border prose-img:border-gray-200"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            
            {/* Tags */}
            {blog.meta_tags && blog.meta_tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Tags</h3>
                <div className="flex flex-wrap gap-3">
                  {blog.meta_tags.map((tag: string, index: number) => (
                    <span 
                      key={index} 
                      className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 px-6 py-3 rounded-full text-sm font-semibold hover:from-orange-200 hover:to-orange-300 transition-all duration-200 shadow-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Posts Section */}
        {relatedBlogs && relatedBlogs.length > 0 && (
          <div className="bg-gray-50 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Articles</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover more insights and stories from our blog
                </p>
                <div className="w-24 h-1 bg-orange-600 mx-auto mt-4"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedBlogs.map((relatedBlog) => (
                  <Card key={relatedBlog.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-0 bg-white hover:-translate-y-1">
                    <Link to={`/blog/${relatedBlog.slug}`} className="block h-full">
                      {relatedBlog.cover_image_url && (
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={relatedBlog.cover_image_url}
                            alt={relatedBlog.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                      )}
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(relatedBlog.published_at)}
                        </div>
                        <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors flex-grow">
                          {relatedBlog.title}
                        </h3>
                        {relatedBlog.excerpt && (
                          <p className="text-gray-600 mb-4 line-clamp-3 text-sm flex-grow">
                            {relatedBlog.excerpt}
                          </p>
                        )}
                        <div className="flex items-center text-orange-600 hover:text-orange-700 font-medium text-sm mt-auto">
                          Read Article
                          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Link
                  to="/blog"
                  className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                >
                  View All Articles
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default BlogDetail;
