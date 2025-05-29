import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowRight } from "lucide-react";

const BlogListing = () => {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      
      return data || [];
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get featured post (most recent)
  const featuredPost = blogs?.[0];
  const otherPosts = blogs?.slice(1) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
            </div>
            
            {/* Featured post skeleton */}
            <div className="mb-16 animate-pulse">
              <div className="bg-gray-300 h-80 rounded-2xl mb-6"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
              <p className="text-xl text-orange-100 max-w-2xl mx-auto">
                Latest updates, design tips, and insights from the world of custom stickers
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {blogs?.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Blog Posts Yet</h2>
                <p className="text-gray-600 mb-8">We're working on some great content. Check back soon!</p>
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Back to Home
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            ) : (
              <>
                {/* Featured Post */}
                {featuredPost && (
                  <div className="mb-16">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Post</h2>
                      <div className="w-24 h-1 bg-orange-600 mx-auto"></div>
                    </div>
                    
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow group border-0 bg-white">
                      <Link to={`/blog/${featuredPost.slug}`} className="block">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                          {featuredPost.cover_image_url && (
                            <div className="aspect-video lg:aspect-square relative overflow-hidden">
                              <img
                                src={featuredPost.cover_image_url}
                                alt={featuredPost.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                          )}
                          <div className="p-8 lg:p-12 flex flex-col justify-center">
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                              <Calendar className="w-4 h-4 mr-2" />
                              {formatDate(featuredPost.published_at)}
                            </div>
                            <h3 className="text-2xl lg:text-3xl font-bold mb-4 group-hover:text-orange-600 transition-colors">
                              {featuredPost.title}
                            </h3>
                            {featuredPost.excerpt && (
                              <p className="text-gray-600 mb-6 line-clamp-3">{featuredPost.excerpt}</p>
                            )}
                            <div className="flex items-center text-orange-600 hover:text-orange-700 font-semibold">
                              Read Full Article
                              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </div>
                            {featuredPost.meta_tags && featuredPost.meta_tags.length > 0 && (
                              <div className="mt-6 flex flex-wrap gap-2">
                                {featuredPost.meta_tags.slice(0, 3).map((tag: string, index: number) => (
                                  <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </Card>
                  </div>
                )}

                {/* Other Posts */}
                {otherPosts.length > 0 && (
                  <div>
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">Latest Articles</h2>
                      <div className="w-24 h-1 bg-orange-600 mx-auto"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {otherPosts.map((blog) => (
                        <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-0 bg-white hover:-translate-y-1">
                          <Link to={`/blog/${blog.slug}`} className="block">
                            {blog.cover_image_url && (
                              <div className="aspect-video relative overflow-hidden">
                                <img
                                  src={blog.cover_image_url}
                                  alt={blog.title}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                              </div>
                            )}
                            <CardContent className="p-6">
                              <div className="flex items-center text-sm text-gray-500 mb-3">
                                <Calendar className="w-4 h-4 mr-2" />
                                {formatDate(blog.published_at)}
                              </div>
                              <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                {blog.title}
                              </h3>
                              {blog.excerpt && (
                                <p className="text-gray-600 mb-4 line-clamp-3 text-sm">{blog.excerpt}</p>
                              )}
                              <div className="flex items-center text-orange-600 hover:text-orange-700 font-medium text-sm">
                                Read More
                                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                              </div>
                              {blog.meta_tags && blog.meta_tags.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-1">
                                  {blog.meta_tags.slice(0, 2).map((tag: string, index: number) => (
                                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                      {tag}
                                    </span>
                                  ))}
                                  {blog.meta_tags.length > 2 && (
                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                      +{blog.meta_tags.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Link>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogListing;
