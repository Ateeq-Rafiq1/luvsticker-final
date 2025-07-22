
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle, Truck, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ArtworkUploadSection from "@/components/ArtworkUploadSection";
import InquiryModal from "@/components/InquiryModal";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [sizes, setSizes] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);

  // State for product configuration
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [quantity, setQuantity] = useState(1000); // Minimum 1000
  const [customDimensions, setCustomDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [artworkViaEmail, setArtworkViaEmail] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  // Collapsible state
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isProcessOpen, setIsProcessOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchSizes();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSizes = async () => {
    try {
      const { data, error } = await supabase
        .from("product_sizes")
        .select("*")
        .eq("product_id", id)
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      setSizes(data || []);
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };

  const handleSizeSelect = (size: any) => {
    setSelectedSize(size);
    setCustomDimensions(null);
  };

  const handleCustomDimensions = (width: number, height: number) => {
    setCustomDimensions({ width, height });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1000;
    setQuantity(Math.max(1000, value)); // Enforce minimum of 1000
  };

  const handleInquirySubmit = () => {
    if (!selectedSize || quantity < 1000) {
      toast({
        title: "Please complete your selection",
        description: "Select a size and ensure minimum quantity of 1000",
        variant: "destructive"
      });
      return;
    }

    if (selectedSize.is_custom && (!customDimensions?.width || !customDimensions?.height)) {
      toast({
        title: "Custom dimensions required",
        description: "Please specify width and height for custom size",
        variant: "destructive"
      });
      return;
    }

    setShowInquiryModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Product not found</h2>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/products')} className="bg-orange-600 hover:bg-orange-700">
              Browse Products
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const steps = [
    { number: 1, title: "Size & Quantity", description: "Choose your specifications" },
    { number: 2, title: "Upload Artwork", description: "Add your design" },
    { number: 3, title: "Submit Inquiry", description: "Get your quote" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Navbar />
      <div className="flex-1 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/products')}
              className="p-0 h-auto text-gray-600 hover:text-orange-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Products
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Product Image & Info */}
            <div className="space-y-3">
              <div className="relative">
                {product.feature_image_url && (
                  <div className="relative overflow-hidden rounded-lg bg-white shadow-md">
                    <div className="aspect-square">
                      <img
                        src={product.feature_image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-orange-600 text-white px-2 py-1 text-xs">
                        Premium Quality
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Product Features */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-white rounded-md shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-800">High Quality</p>
                  <p className="text-xs text-gray-500">Premium materials</p>
                </div>
                <div className="text-center p-2 bg-white rounded-md shadow-sm">
                  <Truck className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-800">Fast Shipping</p>
                  <p className="text-xs text-gray-500">Quick turnaround</p>
                </div>
                <div className="text-center p-2 bg-white rounded-md shadow-sm">
                  <Shield className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-800">Guaranteed</p>
                  <p className="text-xs text-gray-500">100% satisfaction</p>
                </div>
              </div>
            </div>

            {/* Product Details & Configuration */}
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="mb-3">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{product.name}</h1>
                  
                  {product.description && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">{product.description}</p>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-orange-600">
                      Custom Quote Available
                    </span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      Professional Service
                    </Badge>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                      <div key={step.number} className="flex items-center flex-1">
                        <div className="flex flex-col items-center text-center">
                          <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all duration-300 ${
                            currentStep >= step.number 
                              ? 'bg-orange-600 text-white shadow-md' 
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {step.number}
                          </div>
                          <div className="mt-1">
                            <div className={`text-xs font-semibold ${
                              currentStep >= step.number ? 'text-orange-600' : 'text-gray-500'
                            }`}>
                              {step.title}
                            </div>
                          </div>
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-300 ${
                            currentStep > step.number ? 'bg-orange-600' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step Content */}
                <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-white">
                  <CardContent className="p-3">
                    {currentStep === 1 && (
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-base font-bold text-gray-900 mb-2">Select Size</h3>
                          <div className="grid grid-cols-1 gap-1.5">
                            {sizes.map((size) => (
                              <div
                                key={size.id}
                                onClick={() => handleSizeSelect(size)}
                                className={`p-2 border-2 rounded-md cursor-pointer transition-all duration-300 ${
                                  selectedSize?.id === size.id
                                    ? 'border-orange-500 bg-orange-50 shadow-sm'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    {size.width && size.height && (
                                      <div className="font-medium text-sm text-gray-900">
                                        {size.width}" × {size.height}"
                                      </div>
                                    )}
                                    {size.is_custom && (
                                      <Badge variant="outline" className="mt-1 text-xs border-orange-200 text-orange-700">
                                        Custom Size
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {selectedSize?.is_custom && (
                          <div className="bg-white p-3 rounded-md border border-orange-200">
                            <h4 className="text-sm font-semibold mb-2 text-gray-900">Custom Dimensions</h4>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label htmlFor="width" className="text-xs font-medium text-gray-700">Width (inches)</Label>
                                <Input
                                  id="width"
                                  type="number"
                                  min="1"
                                  step="0.1"
                                  value={customDimensions?.width || ''}
                                  onChange={(e) => handleCustomDimensions(parseFloat(e.target.value) || 0, customDimensions?.height || 0)}
                                  className="mt-1 h-7 text-sm"
                                  placeholder="Width"
                                />
                              </div>
                              <div>
                                <Label htmlFor="height" className="text-xs font-medium text-gray-700">Height (inches)</Label>
                                <Input
                                  id="height"
                                  type="number"
                                  min="1"
                                  step="0.1"
                                  value={customDimensions?.height || ''}
                                  onChange={(e) => handleCustomDimensions(customDimensions?.width || 0, parseFloat(e.target.value) || 0)}
                                  className="mt-1 h-7 text-sm"
                                  placeholder="Height"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="bg-white p-3 rounded-md border border-gray-200">
                          <Label htmlFor="quantity" className="text-sm font-semibold text-gray-900">Quantity (Minimum: 1,000)</Label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1000"
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="mt-1 h-8 text-sm"
                            placeholder="Enter quantity (min 1000)"
                          />
                          {quantity < 1000 && (
                            <p className="text-xs text-red-500 mt-1">Minimum order quantity is 1,000 units</p>
                          )}
                        </div>

                        <Button
                          onClick={() => setCurrentStep(2)}
                          disabled={!selectedSize || quantity < 1000 || (selectedSize?.is_custom && (!customDimensions?.width || !customDimensions?.height))}
                          className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white py-2 text-sm font-semibold rounded-md shadow-md transition-all duration-300"
                        >
                          Continue to Artwork
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-3">
                        <h3 className="text-base font-bold text-gray-900 mb-3">Upload Your Artwork</h3>
                        <ArtworkUploadSection
                          onArtworkChange={setArtworkFile}
                          onEmailOptionChange={setArtworkViaEmail}
                          onNext={() => setCurrentStep(3)}
                          selectedFile={artworkFile}
                          emailOption={artworkViaEmail}
                        />
                        
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                          className="w-full py-2 text-sm border-2 border-gray-300 hover:border-gray-400 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back to Size Selection
                        </Button>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-3">
                        <h3 className="text-base font-bold text-gray-900 mb-3">Review Your Selection</h3>
                        
                        <div className="space-y-3">
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-md">
                            <h4 className="font-bold text-sm text-gray-900 mb-2">Inquiry Summary</h4>
                            <div className="space-y-1.5 text-sm text-gray-700">
                              <div className="flex justify-between">
                                <span>Product:</span>
                                <span className="font-medium">{product.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Size:</span>
                                <span className="font-medium">{selectedSize?.size_name}</span>
                              </div>
                              {customDimensions && (
                                <div className="flex justify-between">
                                  <span>Dimensions:</span>
                                  <span className="font-medium">
                                    {customDimensions.width}" × {customDimensions.height}"
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span>Quantity:</span>
                                <span className="font-medium">{quantity.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Artwork:</span>
                                <span className="font-medium text-xs">
                                  {artworkViaEmail ? "Will be sent via email" : artworkFile?.name || "Not uploaded"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setCurrentStep(2)}
                            className="flex-1 py-2 text-sm border-2 border-gray-300 hover:border-gray-400"
                          >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                          </Button>
                          <Button
                            onClick={handleInquirySubmit}
                            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 text-sm font-semibold rounded-md shadow-md transition-all duration-300"
                          >
                            Inquire Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Product Information Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {/* Product Description */}
            <Card className="shadow-lg">
              <Collapsible open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-900">📦 Product Description</h3>
                    {isDescriptionOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4 text-gray-600">
                    {product.description || "Detailed product description managed from admin panel."}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Order Process */}
            <Card className="shadow-lg">
              <Collapsible open={isProcessOpen} onOpenChange={setIsProcessOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-900">🔄 Order Process</h3>
                    {isProcessOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4 text-gray-600">
                    <div className="text-center font-medium">
                      Choose Your Custom Product → Fill the Form → Place Inquiry → Production → Shipping
                    </div>
                    <div className="mt-3 text-sm space-y-2">
                      <div>1. Select your product specifications and upload artwork</div>
                      <div>2. Submit inquiry form with your contact details</div>
                      <div>3. Our team will contact you with a custom quote</div>
                      <div>4. Upon approval, we begin production</div>
                      <div>5. Fast shipping and delivery to your location</div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        productData={{
          productId: id!,
          productName: product.name,
          sizeId: selectedSize?.id,
          sizeName: selectedSize?.size_name,
          quantity,
          customWidth: customDimensions?.width,
          customHeight: customDimensions?.height,
          artworkFile: artworkFile || undefined,
          artworkViaEmail
        }}
      />

      <Footer />
    </div>
  );
};

export default ProductDetail;
