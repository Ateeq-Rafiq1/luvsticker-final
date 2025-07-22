
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import ArtworkUploadSection from "@/components/ArtworkUploadSection";
import InquiryModal from "@/components/InquiryModal";
import { Link } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [quantity, setQuantity] = useState(1000);
  const [customWidth, setCustomWidth] = useState<number>();
  const [customHeight, setCustomHeight] = useState<number>();
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [artworkViaEmail, setArtworkViaEmail] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            image_url,
            alt_text,
            image_type,
            display_order
          ),
          product_sizes (
            id,
            size_name,
            width,
            height,
            is_custom,
            display_order
          )
        `)
        .eq('id', id)
        .single();
      
      if (data) {
        data.product_images = data.product_images?.sort((a: any, b: any) => 
          (a.display_order || 0) - (b.display_order || 0)
        );
        data.product_sizes = data.product_sizes?.sort((a: any, b: any) => 
          (a.display_order || 0) - (b.display_order || 0)
        );
      }
      
      return data;
    }
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ['related-products', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select(`
          id,
          name,
          feature_image_url,
          product_images (
            image_url,
            image_type
          )
        `)
        .eq('is_active', true)
        .neq('id', id)
        .limit(3);
      
      return data || [];
    }
  });

  const handleSizeChange = (sizeId: string) => {
    const size = product?.product_sizes?.find((s: any) => s.id === sizeId);
    setSelectedSize(size);
    
    if (size?.is_custom) {
      setCustomWidth(size.width);
      setCustomHeight(size.height);
    } else {
      setCustomWidth(undefined);
      setCustomHeight(undefined);
    }
  };

  const handleInquirySubmit = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive"
      });
      return;
    }

    if (quantity < 1000) {
      toast({
        title: "Minimum quantity is 1000 units",
        variant: "destructive"
      });
      return;
    }

    setIsInquiryModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-300 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = product.feature_image_url || 
                   product.product_images?.find((img: any) => img.image_type === 'feature')?.image_url ||
                   product.product_images?.[0]?.image_url;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg shadow-sm overflow-hidden">
              {mainImage ? (
                <img 
                  src={mainImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>
            {product.product_images && product.product_images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.product_images.slice(1, 5).map((image: any, index: number) => (
                  <div key={index} className="aspect-square bg-white rounded-lg shadow-sm overflow-hidden">
                    <img 
                      src={image.image_url} 
                      alt={image.alt_text || `${product.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              {product.description && (
                <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
              )}
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <div>
                <Label className="text-lg font-semibold">Select Size</Label>
                <Select onValueChange={handleSizeChange}>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Choose a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.product_sizes?.map((size: any) => (
                      <SelectItem key={size.id} value={size.id}>
                        {size.size_name}
                        {size.width && size.height && ` (${size.width}" × ${size.height}")`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedSize?.is_custom && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Custom Width (inches)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={customWidth || ''}
                      onChange={(e) => setCustomWidth(parseFloat(e.target.value))}
                      placeholder="Width"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Custom Height (inches)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={customHeight || ''}
                      onChange={(e) => setCustomHeight(parseFloat(e.target.value))}
                      placeholder="Height"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selection */}
            <div>
              <Label className="text-lg font-semibold">Quantity</Label>
              <div className="mt-2">
                <Input
                  type="number"
                  min="1000"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1000)}
                  className="w-48"
                />
                <p className="text-sm text-gray-600 mt-1">Minimum order: 1,000 units</p>
              </div>
            </div>

            {/* Artwork Upload */}
            <ArtworkUploadSection
              onArtworkChange={setArtworkFile}
              onEmailOptionChange={setArtworkViaEmail}
              onNext={handleInquirySubmit}
              selectedFile={artworkFile}
              emailOption={artworkViaEmail}
              buttonText="Inquire Now"
            />
          </div>
        </div>

        {/* Product Description Section */}
        {product.description && (
          <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
            <div className="prose max-w-none text-gray-600">
              <p className="text-lg leading-relaxed">{product.description}</p>
            </div>
          </div>
        )}

        {/* Order Process */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: "1", title: "Choose Your Custom Product", desc: "Select size, quantity, and specifications" },
              { step: "2", title: "Fill the Form", desc: "Provide your contact details and requirements" },
              { step: "3", title: "Place Inquiry", desc: "Submit your request for a custom quote" },
              { step: "4", title: "Production", desc: "We'll manufacture your custom order" },
              { step: "5", title: "Shipping", desc: "Fast delivery to your location" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct: any) => {
                const relatedImage = relatedProduct.feature_image_url || 
                                   relatedProduct.product_images?.find((img: any) => img.image_type === 'feature')?.image_url ||
                                   relatedProduct.product_images?.[0]?.image_url;
                
                return (
                  <Card key={relatedProduct.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      {relatedImage ? (
                        <img 
                          src={relatedImage} 
                          alt={relatedProduct.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{relatedProduct.name}</h3>
                      <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                        <Link to={`/product/${relatedProduct.id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        productData={{
          productId: product.id,
          productName: product.name,
          sizeId: selectedSize?.id || '',
          sizeName: selectedSize?.size_name || '',
          quantity,
          customWidth,
          customHeight,
          artworkFile: artworkFile || undefined,
          artworkViaEmail
        }}
      />
    </div>
  );
};

export default ProductDetail;
