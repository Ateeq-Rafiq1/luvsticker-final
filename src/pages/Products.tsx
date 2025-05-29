
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Products = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['all-products'],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            image_url,
            alt_text,
            image_type
          ),
          product_sizes (
            price_per_unit
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
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
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Products</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our full range of high-quality custom stickers. From vinyl decals to 
              specialty materials, we have everything you need to bring your designs to life.
            </p>
          </div>

          {products?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products available at the moment.</p>
              <p className="text-gray-500">Please check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products?.map((product) => {
                // Find feature image or fall back to first gallery image or null
                const featureImage = product.feature_image_url || 
                                     product.product_images?.find((img: any) => img.image_type === 'feature')?.image_url ||
                                     product.product_images?.[0]?.image_url;
                
                return (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow group border-0 bg-white">
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      {featureImage ? (
                        <img
                          src={featureImage}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                            <p className="text-sm">No Image</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-orange-600">
                            From ${Math.min(...(product.product_sizes?.map(s => s.price_per_unit) || [0]))}
                          </span>
                          <p className="text-xs text-gray-500">per piece</p>
                        </div>
                        <Button asChild className="bg-orange-600 hover:bg-orange-700">
                          <Link to={`/product/${product.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Can't Find What You're Looking For?</h2>
              <p className="text-gray-600 mb-6">
                We offer custom solutions for unique requirements. Contact us to discuss your specific needs.
              </p>
              <Button asChild className="bg-orange-600 hover:bg-orange-700">
                <Link to="/contact">Get Custom Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
