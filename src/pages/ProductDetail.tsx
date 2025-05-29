
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentStep, setCurrentStep] = useState(1);
  const [mainImage, setMainImage] = useState<string>("");

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
      
      if (data) {
        // Set initial main image to feature image or first gallery image
        const initialImage = data.feature_image_url || 
                            data.product_images?.find((img: any) => img.image_type === 'gallery')?.image_url;
        setMainImage(initialImage || '');
      }
      
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

    sessionStorage.setItem('orderData', JSON.stringify({
      ...orderData,
      artwork: null
    }));
    
    const reader = new FileReader();
    reader.onload = () => {
      sessionStorage.setItem('orderArtwork', reader.result as string);
      navigate('/checkout');
    };
    reader.readAsDataURL(artwork);
  };

  const nextStep = () => {
    if (currentStep === 1 && !selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
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
      <div className="min-h-screen bg-gray-50">
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
  const galleryImages = product.product_images?.filter((img: any) => img.image_type === 'gallery') || [];

  const stepTitles = {
    1: "Choose Size",
    2: "Select Quantity", 
    3: "Upload Artwork",
    4: "Complete Order"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images Section */}
          <div className="space-y-4">
            {/* Main Feature Image */}
            <div className="aspect-square bg-white rounded-xl shadow-lg overflow-hidden">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                  <div className="text-center">
                    <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No Image Available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {galleryImages.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.feature_image_url && (
                  <button
                    onClick={() => setMainImage(product.feature_image_url)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      mainImage === product.feature_image_url ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={product.feature_image_url}
                      alt="Feature"
                      className="w-full h-full object-cover"
                    />
                  </button>
                )}
                {galleryImages.map((image: any) => (
                  <button
                    key={image.id}
                    onClick={() => setMainImage(image.image_url)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      mainImage === image.image_url ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || 'Gallery image'}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Purchase Flow */}
          <div className="space-y-8">
            {/* Product Info */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Step Progress Indicator */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step <= currentStep ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step}
                    </div>
                    {step < 4 && (
                      <div className={`w-12 h-0.5 mx-2 ${
                        step < currentStep ? 'bg-orange-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <h2 className="text-2xl font-semibold text-center text-gray-900">
                Step {currentStep}: {stepTitles[currentStep as keyof typeof stepTitles]}
              </h2>
            </div>

            {/* Step Content */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                {/* Step 1: Choose Size */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.product_sizes?.map((size) => (
                        <Button
                          key={size.id}
                          variant={selectedSize === size.id ? "default" : "outline"}
                          className={`p-6 h-auto border-2 transition-all ${
                            selectedSize === size.id 
                              ? 'bg-orange-600 hover:bg-orange-700 border-orange-600' 
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                          onClick={() => setSelectedSize(size.id)}
                        >
                          <div className="text-center">
                            <div className="font-semibold text-lg">{size.size_name}</div>
                            {!size.is_custom && (
                              <div className="text-sm opacity-75 mt-1">
                                {size.width}" × {size.height}"
                              </div>
                            )}
                            <div className="text-lg font-bold mt-2">${size.price_per_unit}/each</div>
                          </div>
                        </Button>
                      ))}
                    </div>

                    {isCustomSize && selectedSize && (
                      <div className="grid grid-cols-2 gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div>
                          <Label htmlFor="width" className="text-sm font-medium">Width (inches)</Label>
                          <Input
                            id="width"
                            type="number"
                            step="0.1"
                            min="0.5"
                            max="12"
                            value={customWidth}
                            onChange={(e) => setCustomWidth(e.target.value)}
                            placeholder="Width"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="height" className="text-sm font-medium">Height (inches)</Label>
                          <Input
                            id="height"
                            type="number"
                            step="0.1"
                            min="0.5"
                            max="12"
                            value={customHeight}
                            onChange={(e) => setCustomHeight(e.target.value)}
                            placeholder="Height"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Select Quantity */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      {[500, 1000, 1500].map((qty) => (
                        <Button
                          key={qty}
                          variant={quantity === qty && !customQuantity ? "default" : "outline"}
                          className={`p-6 h-auto border-2 transition-all ${
                            quantity === qty && !customQuantity
                              ? 'bg-orange-600 hover:bg-orange-700 border-orange-600'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                          onClick={() => {
                            setQuantity(qty);
                            setCustomQuantity("");
                          }}
                        >
                          <div className="text-center">
                            <div className="text-2xl font-bold">{qty}</div>
                            <div className="text-sm opacity-75">pieces</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Label htmlFor="custom-quantity" className="text-sm font-medium">Custom Quantity</Label>
                      <Input
                        id="custom-quantity"
                        type="number"
                        min={settings?.min_quantity || 50}
                        max={settings?.max_quantity || 10000}
                        value={customQuantity}
                        onChange={(e) => setCustomQuantity(e.target.value)}
                        placeholder={`${settings?.min_quantity || 50} - ${settings?.max_quantity || 10000}`}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Upload Artwork */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-12 h-12 mb-4 text-gray-400" />
                        <p className="mb-2 text-lg text-gray-600">
                          <span className="font-semibold">Click to upload</span> your artwork
                        </p>
                        <p className="text-sm text-gray-500">PNG, JPG, PDF (MAX. 10MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => setArtwork(e.target.files?.[0] || null)}
                      />
                    </label>
                    {artwork && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 font-medium">
                          ✓ Selected: {artwork.name}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Complete Order */}
                {currentStep === 4 && (
                  <div className="space-y-6 text-center">
                    <div className="p-6 bg-gray-50 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                      <div className="space-y-2 text-left">
                        <div className="flex justify-between">
                          <span>Product:</span>
                          <span className="font-medium">{product.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span className="font-medium">{selectedSizeData?.size_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quantity:</span>
                          <span className="font-medium">{customQuantity || quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Artwork:</span>
                          <span className="font-medium">{artwork?.name}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6"
                      onClick={handleStartOrder}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                )}

                {/* Navigation Buttons */}
                {currentStep < 4 && (
                  <div className="flex justify-between mt-8 pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </Button>
                    <Button
                      onClick={nextStep}
                      className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
