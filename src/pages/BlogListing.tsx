
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Blog</h1>
            <p className="text-gray-600 text-lg mb-8">Latest updates, news, and insights</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
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
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Blog</h1>
          <p className="text-gray-600 text-lg mb-8">Latest updates, news, and insights</p>
          
          {blogs?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No blog posts found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs?.map((blog) => (
                <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow group border-0">
                  <Link to={`/blog/${blog.slug}`} className="block">
                    {blog.cover_image_url && (
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={blog.cover_image_url}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="text-sm text-gray-500 mb-2">
                        {formatDate(blog.published_at)}
                      </div>
                      <h2 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {blog.title}
                      </h2>
                      {blog.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                      )}
                      <div className="flex items-center">
                        <span className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center">
                          Read More
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                      {blog.meta_tags && blog.meta_tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {blog.meta_tags.slice(0, 2).map((tag: string, index: number) => (
                            <span key={index} className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                          {blog.meta_tags.length > 2 && (
                            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
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
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogListing;
