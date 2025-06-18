
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
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ArtworkUploadSection from "@/components/ArtworkUploadSection";
import QuantityTierSelector from "@/components/product/QuantityTierSelector";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [sizes, setSizes] = useState<any[]>([]);
  const [quantityTiers, setQuantityTiers] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // State for product configuration
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [tierPrice, setTierPrice] = useState<number | null>(null);
  const [customDimensions, setCustomDimensions] = useState<{ width: number; height: number } | null>(null);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [artworkViaEmail, setArtworkViaEmail] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchSizes();
    }
  }, [id]);

  useEffect(() => {
    if (selectedSize) {
      fetchQuantityTiers();
    }
  }, [selectedSize]);

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
        variant: "destructive",
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
        .order("price_per_unit");

      if (error) throw error;
      setSizes(data || []);
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };

  const fetchQuantityTiers = async () => {
    if (!selectedSize) return;
    
    try {
      const { data, error } = await supabase
        .from("quantity_tiers")
        .select("*")
        .eq("size_id", selectedSize.id)
        .order("quantity");

      if (error) throw error;
      setQuantityTiers(data || []);
    } catch (error) {
      console.error("Error fetching quantity tiers:", error);
    }
  };

  const handleSizeSelect = (size: any) => {
    setSelectedSize(size);
    setQuantity(1);
    setTierPrice(null);
    setCustomDimensions(null);
  };

  const handleQuantityChange = (newQuantity: number, newTierPrice?: number) => {
    setQuantity(newQuantity);
    setTierPrice(newTierPrice || null);
  };

  const handleCustomDimensions = (width: number, height: number) => {
    setCustomDimensions({ width, height });
  };

  const calculateTotal = () => {
    if (!selectedSize) return 0;
    
    let basePrice = tierPrice || selectedSize.price_per_unit;
    if (customDimensions && selectedSize.is_custom) {
      const { width, height } = customDimensions;
      const area = (width * height) / 144; // Convert to square feet
      basePrice = basePrice * area;
    }
    
    return basePrice * quantity;
  };

  const proceedToCheckout = () => {
    // Store checkout data in sessionStorage for the checkout page
    sessionStorage.setItem('orderData', JSON.stringify({
      productId: id,
      productName: product.name,
      sizeId: selectedSize.id,
      sizeName: selectedSize.size_name,
      quantity: quantity,
      customWidth: customDimensions?.width || null,
      customHeight: customDimensions?.height || null,
      total: calculateTotal().toFixed(2),
      artwork_via_email: artworkViaEmail
    }));
    
    // Store artwork file data separately if exists
    if (artworkFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        sessionStorage.setItem('orderArtwork', e.target?.result as string);
        sessionStorage.setItem('orderArtworkName', artworkFile.name);
        navigate('/checkout');
      };
      reader.readAsDataURL(artworkFile);
    } else {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Product not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  const steps = [
    { number: 1, title: "Choose Size & Quantity" },
    { number: 2, title: "Upload Artwork" },
    { number: 3, title: "Review & Checkout" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/products')}
              className="p-0 h-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </div>

          {/* Product Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                {product.feature_image_url && (
                  <img
                    src={product.feature_image_url}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
              </div>
              <div className="md:w-2/3">
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                {product.description && (
                  <p className="text-gray-600 mb-4">{product.description}</p>
                )}
                <div className="text-2xl font-bold text-orange-600">
                  Starting at ${product.base_price}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    currentStep >= step.number
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.number}
                  </div>
                  <div className="ml-2 hidden sm:block">
                    <div className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-orange-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-1 mx-4 ${
                      currentStep > step.number ? 'bg-orange-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="mb-6">
            <CardContent className="p-6">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Select Size</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sizes.map((size) => (
                        <div
                          key={size.id}
                          onClick={() => handleSizeSelect(size)}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedSize?.id === size.id
                              ? 'border-orange-600 bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium">{size.size_name}</div>
                          {size.width && size.height && (
                            <div className="text-sm text-gray-500">
                              {size.width}" × {size.height}"
                            </div>
                          )}
                          <div className="text-lg font-bold text-orange-600 mt-2">
                            ${size.price_per_unit}
                            {size.is_custom && " per sq ft"}
                          </div>
                          {size.is_custom && (
                            <Badge variant="secondary" className="mt-2">
                              Custom Size
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedSize?.is_custom && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Enter Custom Dimensions</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="width">Width (inches)</Label>
                          <Input
                            id="width"
                            type="number"
                            min="1"
                            step="0.1"
                            value={customDimensions?.width || ''}
                            onChange={(e) => handleCustomDimensions(
                              parseFloat(e.target.value) || 0,
                              customDimensions?.height || 0
                            )}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="height">Height (inches)</Label>
                          <Input
                            id="height"
                            type="number"
                            min="1"
                            step="0.1"
                            value={customDimensions?.height || ''}
                            onChange={(e) => handleCustomDimensions(
                              customDimensions?.width || 0,
                              parseFloat(e.target.value) || 0
                            )}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      {customDimensions?.width && customDimensions?.height && (
                        <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                          <div className="text-sm text-gray-600">
                            Area: {((customDimensions.width * customDimensions.height) / 144).toFixed(2)} sq ft
                          </div>
                          <div className="text-lg font-bold text-orange-600">
                            Price: ${((tierPrice || selectedSize.price_per_unit) * ((customDimensions.width * customDimensions.height) / 144)).toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedSize && !selectedSize.is_custom && (
                    <QuantityTierSelector
                      basePricePerUnit={selectedSize.price_per_unit}
                      quantityTiers={quantityTiers}
                      selectedQuantity={quantity}
                      onQuantityChange={handleQuantityChange}
                    />
                  )}

                  {selectedSize && selectedSize.is_custom && (
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-24 mt-1"
                      />
                    </div>
                  )}

                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={!selectedSize || (selectedSize.is_custom && (!customDimensions?.width || !customDimensions?.height))}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
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
                    className="w-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Review Your Order</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Product Details</h4>
                      <div className="text-sm space-y-1">
                        <div>Product: {product.name}</div>
                        <div>Size: {selectedSize?.size_name}</div>
                        {customDimensions && (
                          <div>
                            Dimensions: {customDimensions.width}" × {customDimensions.height}"
                          </div>
                        )}
                        <div>Quantity: {quantity}</div>
                        <div>
                          Price per unit: ${(tierPrice || selectedSize?.price_per_unit || 0).toFixed(2)}
                        </div>
                        <div>
                          Artwork: {artworkViaEmail 
                            ? "Will be sent via email to luvstickers3@gmail.com" 
                            : artworkFile?.name || "No file selected"}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total:</span>
                        <span className="text-2xl font-bold text-orange-600">
                          ${calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={proceedToCheckout}
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
