
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
            <a href="/blog" className="text-orange-600 hover:text-orange-700 font-medium">
              Return to Blog
            </a>
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        {blog.cover_image_url && (
          <div className="w-full h-[40vh] md:h-[50vh] relative">
            <img
              src={blog.cover_image_url}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{blog.title}</h1>
                <div className="text-gray-200">
                  Published on {formatDate(blog.published_at)}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!blog.cover_image_url && (
            <>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{blog.title}</h1>
              <div className="text-gray-600 mb-6">
                Published on {formatDate(blog.published_at)}
              </div>
            </>
          )}
          
          {blog.excerpt && (
            <div className="text-xl text-gray-600 mb-8 border-l-4 border-orange-600 pl-4 italic">
              {blog.excerpt}
            </div>
          )}
          
          <article 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          
          {blog.meta_tags && blog.meta_tags.length > 0 && (
            <div className="mt-8 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {blog.meta_tags.map((tag: string, index: number) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetail;
