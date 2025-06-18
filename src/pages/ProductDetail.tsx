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
import { ArrowLeft, ArrowRight, Star, CheckCircle, Truck, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ArtworkUploadSection from "@/components/ArtworkUploadSection";
import QuantityTierSelector from "@/components/product/QuantityTierSelector";
const ProductDetail = () => {
  const {
    id
  } = useParams();
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
  const [customDimensions, setCustomDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
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
      const {
        data,
        error
      } = await supabase.from("products").select("*").eq("id", id).single();
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
      const {
        data,
        error
      } = await supabase.from("product_sizes").select("*").eq("product_id", id).order("price_per_unit");
      if (error) throw error;
      setSizes(data || []);
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };
  const fetchQuantityTiers = async () => {
    if (!selectedSize) return;
    try {
      const {
        data,
        error
      } = await supabase.from("quantity_tiers").select("*").eq("size_id", selectedSize.id).order("quantity");
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
    setCustomDimensions({
      width,
      height
    });
  };
  const calculateTotal = () => {
    if (!selectedSize) return 0;
    let basePrice = tierPrice || selectedSize.price_per_unit;
    if (customDimensions && selectedSize.is_custom) {
      const {
        width,
        height
      } = customDimensions;
      const area = width * height / 144; // Convert to square feet
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
      reader.onload = e => {
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
    return <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>;
  }
  if (!product) {
    return <div className="min-h-screen flex flex-col">
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
      </div>;
  }
  const steps = [{
    number: 1,
    title: "Size & Quantity",
    description: "Choose your perfect size"
  }, {
    number: 2,
    title: "Upload Artwork",
    description: "Add your design"
  }, {
    number: 3,
    title: "Review & Order",
    description: "Confirm your order"
  }];
  return <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Navbar />
      <div className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate('/products')} className="p-0 h-auto text-gray-600 hover:text-orange-600 transition-colors group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Products
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Product Image & Info */}
            <div className="space-y-6">
              <div className="relative">
                {product.feature_image_url && <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
                    <img src={product.feature_image_url} alt={product.name} className="w-full h-96 object-cover" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-orange-600 text-white px-3 py-1">
                        Premium Quality
                      </Badge>
                    </div>
                  </div>}
              </div>
              
              {/* Product Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800">High Quality</p>
                  <p className="text-xs text-gray-500">Premium materials</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <Truck className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800">Fast Shipping</p>
                  <p className="text-xs text-gray-500">2-3 business days</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800">Guaranteed</p>
                  <p className="text-xs text-gray-500">100% satisfaction</p>
                </div>
              </div>
            </div>

            {/* Product Details & Configuration */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                  
                  {product.description && <p className="text-gray-600 text-lg leading-relaxed mb-6">{product.description}</p>}
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-orange-600">
                      Starting at ${product.base_price}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ${(product.base_price * 1.3).toFixed(2)}
                    </span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Save 23%
                    </Badge>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    {steps.map((step, index) => <div key={step.number} className="flex items-center flex-1">
                        <div className="flex flex-col items-center text-center">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-full text-sm font-bold transition-all duration-300 ${currentStep >= step.number ? 'bg-orange-600 text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-600'}`}>
                            {step.number}
                          </div>
                          <div className="mt-2">
                            <div className={`text-sm font-semibold ${currentStep >= step.number ? 'text-orange-600' : 'text-gray-500'}`}>
                              {step.title}
                            </div>
                            <div className="text-xs text-gray-400 hidden sm:block">
                              {step.description}
                            </div>
                          </div>
                        </div>
                        {index < steps.length - 1 && <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${currentStep > step.number ? 'bg-orange-600' : 'bg-gray-200'}`} />}
                      </div>)}
                  </div>
                </div>

                {/* Step Content */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
                  <CardContent className="p-8">
                    {currentStep === 1 && <div className="space-y-8">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-6">Select Your Size</h3>
                          <div className="grid grid-cols-1 gap-4">
                            {sizes.map(size => <div key={size.id} onClick={() => handleSizeSelect(size)} className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${selectedSize?.id === size.id ? 'border-orange-500 bg-orange-50 shadow-lg transform scale-[1.02]' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-bold text-lg text-gray-900">{size.size_name}</div>
                                    {size.width && size.height && <div className="text-gray-600 mt-1">
                                        {size.width}" × {size.height}"
                                      </div>}
                                    {size.is_custom && <Badge variant="outline" className="mt-2 border-orange-200 text-orange-700">
                                        Custom Size Available
                                      </Badge>}
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-orange-600">
                                      ${size.price_per_unit}
                                      {size.is_custom && <span className="text-sm"> per sq ft</span>}
                                    </div>
                                  </div>
                                </div>
                              </div>)}
                          </div>
                        </div>

                        {selectedSize?.is_custom && <div className="bg-white p-6 rounded-xl border-2 border-dashed border-orange-200">
                            <h4 className="text-lg font-semibold mb-4 text-gray-900">Custom Dimensions</h4>
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="width" className="text-sm font-medium text-gray-700">Width (inches)</Label>
                                <Input id="width" type="number" min="1" step="0.1" value={customDimensions?.width || ''} onChange={e => handleCustomDimensions(parseFloat(e.target.value) || 0, customDimensions?.height || 0)} className="mt-2 text-lg" placeholder="Enter width" />
                              </div>
                              <div>
                                <Label htmlFor="height" className="text-sm font-medium text-gray-700">Height (inches)</Label>
                                <Input id="height" type="number" min="1" step="0.1" value={customDimensions?.height || ''} onChange={e => handleCustomDimensions(customDimensions?.width || 0, parseFloat(e.target.value) || 0)} className="mt-2 text-lg" placeholder="Enter height" />
                              </div>
                            </div>
                            {customDimensions?.width && customDimensions?.height && <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="text-sm text-gray-600">Total Area</div>
                                    <div className="font-semibold text-gray-900">
                                      {(customDimensions.width * customDimensions.height / 144).toFixed(2)} sq ft
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-gray-600">Price</div>
                                    <div className="text-xl font-bold text-orange-600">
                                      ${((tierPrice || selectedSize.price_per_unit) * (customDimensions.width * customDimensions.height / 144)).toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                              </div>}
                          </div>}

                        {selectedSize && !selectedSize.is_custom && <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <QuantityTierSelector basePricePerUnit={selectedSize.price_per_unit} quantityTiers={quantityTiers} selectedQuantity={quantity} onQuantityChange={handleQuantityChange} />
                          </div>}

                        {selectedSize && selectedSize.is_custom && <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <Label htmlFor="quantity" className="text-lg font-semibold text-gray-900">Quantity</Label>
                            <Input id="quantity" type="number" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} className="w-32 mt-2 text-lg" />
                          </div>}

                        <Button onClick={() => setCurrentStep(2)} disabled={!selectedSize || selectedSize.is_custom && (!customDimensions?.width || !customDimensions?.height)} className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                          Continue to Artwork
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </div>}

                    {currentStep === 2 && <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Upload Your Artwork</h3>
                        <ArtworkUploadSection onArtworkChange={setArtworkFile} onEmailOptionChange={setArtworkViaEmail} onNext={() => setCurrentStep(3)} selectedFile={artworkFile} emailOption={artworkViaEmail} />
                        
                        <Button variant="outline" onClick={() => setCurrentStep(1)} className="w-full py-3 text-lg border-2 border-gray-300 hover:border-gray-400 transition-colors">
                          <ArrowLeft className="w-5 h-5 mr-2" />
                          Back to Size Selection
                        </Button>
                      </div>}

                    {currentStep === 3 && <div className="space-y-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Review Your Order</h3>
                        
                        <div className="space-y-6">
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl">
                            <h4 className="font-bold text-lg text-gray-900 mb-4">Order Summary</h4>
                            <div className="space-y-3 text-gray-700">
                              <div className="flex justify-between">
                                <span>Product:</span>
                                <span className="font-medium">{product.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Size:</span>
                                <span className="font-medium">{selectedSize?.size_name}</span>
                              </div>
                              {customDimensions && <div className="flex justify-between">
                                  <span>Dimensions:</span>
                                  <span className="font-medium">
                                    {customDimensions.width}" × {customDimensions.height}"
                                  </span>
                                </div>}
                              <div className="flex justify-between">
                                <span>Quantity:</span>
                                <span className="font-medium">{quantity}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Price per unit:</span>
                                <span className="font-medium">${(tierPrice || selectedSize?.price_per_unit || 0).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Artwork:</span>
                                <span className="font-medium">
                                  {artworkViaEmail ? "Will be sent via email" : artworkFile?.name || "No file selected"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border-2 border-orange-200">
                            <div className="flex justify-between items-center">
                              <span className="text-xl font-bold text-gray-900">Total Amount:</span>
                              <span className="text-3xl font-bold text-orange-600">
                                ${calculateTotal().toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1 py-3 text-lg border-2 border-gray-300 hover:border-gray-400">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back
                          </Button>
                          <Button onClick={proceedToCheckout} className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                            Complete Order
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Button>
                        </div>
                      </div>}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>;
};
export default ProductDetail;