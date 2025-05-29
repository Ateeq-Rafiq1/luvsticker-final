
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
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
        const initialImage = data.feature_image_url || 
                            data.product_images?.find((img: any) => img.image_type === 'gallery')?.image_url;
        setMainImage(initialImage || '');
      }
      
      return data;
    },
    enabled: !!id
  });

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(50, quantity + change);
    setQuantity(newQuantity);
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 50MB",
        variant: "destructive"
      });
      return;
    }

    setArtwork(file);
    toast({
      title: "Artwork uploaded",
      description: `${file.name} has been selected`
    });
  };

  const calculateTotal = () => {
    const selectedSizeData = product?.product_sizes?.find(s => s.id === selectedSize);
    if (!selectedSizeData) return 0;
    
    const basePrice = parseFloat(selectedSizeData.price_per_unit || '0');
    return (basePrice * quantity).toFixed(2);
  };

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
      quantity,
      customWidth: customWidth ? parseFloat(customWidth) : null,
      customHeight: customHeight ? parseFloat(customHeight) : null,
      total: calculateTotal()
    };

    sessionStorage.setItem('orderData', JSON.stringify(orderData));
    
    const reader = new FileReader();
    reader.onload = () => {
      sessionStorage.setItem('orderArtwork', reader.result as string);
      sessionStorage.setItem('orderArtworkName', artwork.name);
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
    if (currentStep === 3 && !artwork) {
      toast({
        title: "Please upload your artwork",
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

            {/* Enhanced Step Progress Indicator */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      step <= currentStep 
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-110' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step}
                    </div>
                    {step < 4 && (
                      <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-500 ${
                        step < currentStep ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <h2 className="text-2xl font-semibold text-center text-gray-900">
                {stepTitles[currentStep as keyof typeof stepTitles]}
              </h2>
            </div>

            {/* Step Content */}
            <Card className="shadow-lg overflow-hidden">
              <CardContent className="p-8">
                {/* Step 1: Choose Size */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {product.product_sizes?.map((size) => (
                        <Button
                          key={size.id}
                          variant={selectedSize === size.id ? "default" : "outline"}
                          className={`p-4 h-auto border-2 transition-all duration-200 ${
                            selectedSize === size.id 
                              ? 'bg-orange-600 hover:bg-orange-700 border-orange-600 shadow-lg transform scale-105' 
                              : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                          }`}
                          onClick={() => setSelectedSize(size.id)}
                        >
                          <div className="text-center">
                            <div className="font-semibold">{size.size_name}</div>
                            {!size.is_custom && (
                              <div className="text-xs opacity-75 mt-1">
                                {size.width}" × {size.height}"
                              </div>
                            )}
                            <div className="text-sm font-bold mt-2">${size.price_per_unit}/ea</div>
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
                    <div className="text-center">
                      <Label className="text-lg font-semibold mb-4 block">Select Quantity</Label>
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(-100)}
                          className="h-12 w-12"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="text-center">
                          <Input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(50, parseInt(e.target.value) || 0))}
                            className="text-center text-xl font-bold w-32 h-12"
                            min="50"
                          />
                          <div className="text-sm text-gray-500 mt-1">pieces</div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(100)}
                          className="h-12 w-12"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <div className="text-sm text-gray-600 mb-2">Total Price</div>
                      <div className="text-3xl font-bold text-orange-600">${calculateTotal()}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        ${selectedSizeData?.price_per_unit}/each × {quantity} pieces
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Upload Artwork */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Label className="text-lg font-semibold mb-4 block">Upload Your Artwork</Label>
                      {!artwork ? (
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-12 h-12 mb-4 text-gray-400" />
                            <p className="mb-2 text-lg text-gray-600">
                              <span className="font-semibold">Click to upload</span> your artwork
                            </p>
                            <p className="text-sm text-gray-500">PNG, JPG, PDF (MAX. 50MB)</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file);
                            }}
                          />
                        </label>
                      ) : (
                        <div className="space-y-4">
                          <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                            <div className="flex items-center justify-center mb-4">
                              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <Upload className="w-8 h-8 text-green-600" />
                              </div>
                            </div>
                            <p className="text-green-700 font-semibold text-lg">
                              ✓ {artwork.name}
                            </p>
                            <p className="text-green-600 text-sm mt-1">
                              File size: {(artwork.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => setArtwork(null)}
                            className="w-full"
                          >
                            Upload Different File
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Complete Order */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2">Order Summary</h3>
                      <p className="text-gray-600">Please review your order before proceeding</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-medium">Product:</span>
                        <span className="text-right">{product.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-medium">Size:</span>
                        <span className="text-right">{selectedSizeData?.size_name}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-medium">Quantity:</span>
                        <span className="text-right">{quantity} pieces</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-medium">Unit Price:</span>
                        <span className="text-right">${selectedSizeData?.price_per_unit}/each</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-medium">Artwork:</span>
                        <span className="text-right text-sm">{artwork?.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 text-xl font-bold text-orange-600">
                        <span>Total:</span>
                        <span>${calculateTotal()}</span>
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
                  {currentStep < 4 && (
                    <Button
                      onClick={nextStep}
                      className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
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
