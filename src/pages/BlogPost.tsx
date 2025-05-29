
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { mockBlogPosts } from '@/data/blogData';
import { Calendar, Clock, User, ArrowLeft, Tag, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import NotFound from './NotFound';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = mockBlogPosts.find(p => p.slug === slug && p.status === 'published');

  if (!post) {
    return <NotFound />;
  }

  const relatedPosts = mockBlogPosts
    .filter(p => p.status === 'published' && p.id !== post.id)
    .slice(0, 3);

  return (
    <Layout>
      <Helmet>
        <title>{post.seo.metaTitle}</title>
        <meta name="description" content={post.seo.metaDescription} />
        <meta name="keywords" content={post.seo.keywords.join(', ')} />
        {post.seo.canonicalUrl && <link rel="canonical" href={post.seo.canonicalUrl} />}
        
        {/* Open Graph tags */}
        <meta property="og:title" content={post.seo.ogTitle || post.title} />
        <meta property="og:description" content={post.seo.ogDescription || post.excerpt} />
        <meta property="og:image" content={post.seo.ogImage || post.featuredImage} />
        <meta property="og:type" content="article" />
        <meta property="article:author" content={post.author} />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:modified_time" content={post.updatedAt} />
        {post.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content={post.seo.twitterCard || 'summary_large_image'} />
        <meta name="twitter:title" content={post.seo.twitterTitle || post.title} />
        <meta name="twitter:description" content={post.seo.twitterDescription || post.excerpt} />
        <meta name="twitter:image" content={post.seo.twitterImage || post.featuredImage} />
        
        {/* JSON-LD structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.featuredImage,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Luvstickers"
            },
            "datePublished": post.publishedAt,
            "dateModified": post.updatedAt,
            "keywords": post.tags.join(', ')
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Back to blog */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-istickers-orange hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="max-w-4xl mx-auto">
            {/* Main Content */}
            <article className="bg-white rounded-xl shadow-sm overflow-hidden mb-16">
              {/* Featured Image */}
              {post.featuredImage && (
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-8">
                {/* Article Header */}
                <header className="mb-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-istickers-orange/10 text-istickers-orange hover:bg-istickers-orange/20">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                    {post.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-istickers-orange rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{post.author}</p>
                        <p className="text-sm text-gray-500">Author</p>
                      </div>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span>{post.readingTime} min read</span>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-xl border-l-4 border-istickers-orange">
                    <p className="text-lg text-gray-700 leading-relaxed italic">
                      {post.excerpt}
                    </p>
                  </div>
                </header>

                {/* Social Share */}
                <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                  <Share2 className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Share this article:</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Facebook</Button>
                    <Button variant="outline" size="sm">Twitter</Button>
                    <Button variant="outline" size="sm">LinkedIn</Button>
                  </div>
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-a:text-istickers-orange">
                  <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }} />
                </div>

                {/* Article Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Found this helpful?</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4 mr-2" />
                        Like
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Articles</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Card key={relatedPost.id} className="group hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-0">
                        <Link to={`/blog/${relatedPost.slug}`}>
                          {relatedPost.featuredImage && (
                            <div className="aspect-video overflow-hidden rounded-t-lg">
                              <img 
                                src={relatedPost.featuredImage} 
                                alt={relatedPost.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="p-6">
                            <div className="flex flex-wrap gap-2 mb-3">
                              {relatedPost.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <h3 className="font-semibold text-lg mb-2 group-hover:text-istickers-orange transition-colors line-clamp-2">
                              {relatedPost.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {relatedPost.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{relatedPost.author}</span>
                              <span>{relatedPost.readingTime} min read</span>
                            </div>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-istickers-orange to-orange-600 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Create Your Custom Stickers?</h3>
                <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
                  Start designing your unique stickers today with our easy-to-use design tools and premium materials.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/catalog">
                    <Button size="lg" variant="secondary">
                      Browse Catalog
                    </Button>
                  </Link>
                  
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
