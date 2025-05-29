
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Back to Blog Button */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors"
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
            <div className="w-full h-[50vh] md:h-[60vh] relative">
              <img
                src={blog.cover_image_url}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
            
            {/* Overlaid Content */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="text-white">
                  <div className="flex items-center text-sm text-gray-200 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(blog.published_at)}
                    <span className="mx-3">•</span>
                    <Clock className="w-4 h-4 mr-2" />
                    {getReadingTime(blog.content)} min read
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                    {blog.title}
                  </h1>
                  {blog.excerpt && (
                    <p className="text-lg md:text-xl text-gray-200 max-w-3xl">
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header for posts without cover image */}
            {!blog.cover_image_url && (
              <header className="mb-12 text-center">
                <div className="flex items-center justify-center text-sm text-gray-500 mb-6">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(blog.published_at)}
                  <span className="mx-3">•</span>
                  <Clock className="w-4 h-4 mr-2" />
                  {getReadingTime(blog.content)} min read
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  {blog.title}
                </h1>
                {blog.excerpt && (
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    {blog.excerpt}
                  </p>
                )}
                <div className="w-24 h-1 bg-orange-600 mx-auto mt-8"></div>
              </header>
            )}
            
            {/* Article Content */}
            <article 
              className="prose prose-lg prose-gray max-w-none 
                         prose-headings:text-gray-900 prose-headings:font-bold
                         prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                         prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                         prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                         prose-strong:text-gray-900 prose-strong:font-semibold
                         prose-ul:text-gray-700 prose-ol:text-gray-700
                         prose-li:mb-2 prose-li:leading-relaxed
                         prose-blockquote:border-l-4 prose-blockquote:border-orange-600 
                         prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600
                         prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
                         prose-pre:bg-gray-900 prose-pre:text-gray-100
                         prose-img:rounded-lg prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            
            {/* Tags */}
            {blog.meta_tags && blog.meta_tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.meta_tags.map((tag: string, index: number) => (
                    <span 
                      key={index} 
                      className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors"
                    >
                      {tag}
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
