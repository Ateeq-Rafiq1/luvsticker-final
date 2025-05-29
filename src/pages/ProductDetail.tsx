
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [quantity, setQuantity] = useState(500);
  const [customQuantity, setCustomQuantity] = useState("");
  const [artwork, setArtwork] = useState<File | null>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select(`
          *,
          product_images (*),
          product_sizes (*),
          quantity_tiers (*)
        `)
        .eq('id', id)
        .single();
      
      return data;
    },
    enabled: !!id
  });

  const { data: settings } = useQuery({
    queryKey: ['quantity-settings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['min_quantity', 'max_quantity']);
      
      return data?.reduce((acc, setting) => {
        acc[setting.key] = parseInt(setting.value || '0');
        return acc;
      }, {} as Record<string, number>) || {};
    }
  });

  const handleStartOrder = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive"
      });
      return;
    }

    if (!artwork) {
      toast({
        title: "Please upload your artwork",
        variant: "destructive"
      });
      return;
    }

    const orderData = {
      productId: id,
      sizeId: selectedSize,
      quantity: customQuantity ? parseInt(customQuantity) : quantity,
      customWidth: customWidth ? parseFloat(customWidth) : null,
      customHeight: customHeight ? parseFloat(customHeight) : null,
      artwork
    };

    // Store in sessionStorage and navigate to checkout
    sessionStorage.setItem('orderData', JSON.stringify({
      ...orderData,
      artwork: null // File object can't be stringified
    }));
    
    // Store artwork separately in a way that can be retrieved
    const reader = new FileReader();
    reader.onload = () => {
      sessionStorage.setItem('orderArtwork', reader.result as string);
      navigate('/checkout');
    };
    reader.readAsDataURL(artwork);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-300 aspect-square rounded-lg"></div>
              <div>
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const selectedSizeData = product.product_sizes?.find(s => s.id === selectedSize);
  const isCustomSize = selectedSizeData?.is_custom;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {product.product_images?.map((image, index) => (
              <img
                key={image.id}
                src={image.image_url}
                alt={image.alt_text || product.name}
                className="w-full rounded-lg shadow-lg"
              />
            ))}
          </div>

          {/* Product Details & Configuration */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-gray-600 mt-2">{product.description}</p>
            </div>

            {/* Size Selection */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-lg font-semibold">Choose Size</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {product.product_sizes?.map((size) => (
                    <Button
                      key={size.id}
                      variant={selectedSize === size.id ? "default" : "outline"}
                      className={`p-4 h-auto ${selectedSize === size.id ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                      onClick={() => setSelectedSize(size.id)}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{size.size_name}</div>
                        {!size.is_custom && (
                          <div className="text-sm opacity-75">
                            {size.width}" × {size.height}"
                          </div>
                        )}
                        <div className="text-sm">${size.price_per_unit}/each</div>
                      </div>
                    </Button>
                  ))}
                </div>

                {isCustomSize && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div>
                      <Label htmlFor="width">Width (inches)</Label>
                      <Input
                        id="width"
                        type="number"
                        step="0.1"
                        min="0.5"
                        max="12"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(e.target.value)}
                        placeholder="Width"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (inches)</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        min="0.5"
                        max="12"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(e.target.value)}
                        placeholder="Height"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quantity Selection */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-lg font-semibold">Select Quantity</Label>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {[500, 1000, 1500].map((qty) => (
                    <Button
                      key={qty}
                      variant={quantity === qty && !customQuantity ? "default" : "outline"}
                      className={quantity === qty && !customQuantity ? 'bg-orange-600 hover:bg-orange-700' : ''}
                      onClick={() => {
                        setQuantity(qty);
                        setCustomQuantity("");
                      }}
                    >
                      {qty}
                    </Button>
                  ))}
                </div>
                <div className="mt-4">
                  <Label htmlFor="custom-quantity">Custom Quantity</Label>
                  <Input
                    id="custom-quantity"
                    type="number"
                    min={settings?.min_quantity || 50}
                    max={settings?.max_quantity || 10000}
                    value={customQuantity}
                    onChange={(e) => setCustomQuantity(e.target.value)}
                    placeholder={`${settings?.min_quantity || 50} - ${settings?.max_quantity || 10000}`}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Artwork Upload */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-lg font-semibold">Upload Artwork</Label>
                <div className="mt-3">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> your artwork
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF (MAX. 10MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => setArtwork(e.target.files?.[0] || null)}
                    />
                  </label>
                  {artwork && (
                    <p className="mt-2 text-sm text-green-600">
                      Selected: {artwork.name}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button 
              size="lg" 
              className="w-full bg-orange-600 hover:bg-orange-700"
              onClick={handleStartOrder}
            >
              Start Order
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
