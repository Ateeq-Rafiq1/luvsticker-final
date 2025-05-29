import { Helmet } from "react-helmet-async";
import { useState, useRef, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  ArrowRight, 
  Circle, 
  Square,
  Image,
  PaintRoller
} from "lucide-react";

const materialOptions = [
  { id: "vinyl", name: "Vinyl", color: "#ffffff", price: 1 },
  { id: "holographic", name: "Holographic", color: "linear-gradient(135deg, #f6d365 0%, #fda085 25%, #f6d365 50%, #fda085 75%, #f6d365 100%)", price: 1.5 },
  { id: "transparent", name: "Transparent", color: "rgba(255, 255, 255, 0.4)", price: 1.2 },
  { id: "glitter", name: "Glitter", color: "linear-gradient(135deg, #FFD700 0%, #f6d365 100%)", price: 1.7 },
  { id: "mirror", name: "Mirror", color: "linear-gradient(135deg, #e6e6e6 0%, #ffffff 100%)", price: 1.8 },
];

const shapeOptions = [
  { id: "custom", name: "Die Cut", icon: <Image size={24} /> },
  { id: "circle", name: "Circle", icon: <Circle size={24} /> },
  { id: "square", name: "Square", icon: <Square size={24} /> },
];

const sizeOptions = [
  { id: "small", name: "2\" × 2\"", displaySize: "2 × 2 inches", priceMultiplier: 1 },
  { id: "medium", name: "3\" × 3\"", displaySize: "3 × 3 inches", priceMultiplier: 1.5 },
  { id: "large", name: "4\" × 4\"", displaySize: "4 × 4 inches", priceMultiplier: 2 },
  { id: "custom", name: "Custom Size", displaySize: "Custom", priceMultiplier: 1 },
];

const DesignStudio = () => {
  const [step, setStep] = useState(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState(materialOptions[0]);
  const [selectedShape, setSelectedShape] = useState(shapeOptions[0]);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]);
  const [quantity, setQuantity] = useState(10);
  const [customWidth, setCustomWidth] = useState(2);
  const [customHeight, setCustomHeight] = useState(2);
  const [price, setPrice] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  // Initialize price calculation
  useEffect(() => {
    calculatePrice();
  }, [selectedMaterial, selectedSize, quantity, customWidth, customHeight]);
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPG, PNG, or SVG)");
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      // Create an image element to draw on canvas
      const img = new window.Image();
      img.onload = () => {
        imageRef.current = img;
        renderPreview();
        setStep(2);
      };
      img.src = event.target?.result as string;
      setPreviewImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Render preview to canvas
  const renderPreview = () => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvasCtxRef.current = ctx;
    
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas dimensions based on image and aspect ratio
    const img = imageRef.current;
    const aspectRatio = img.width / img.height;
    
    // Use a fixed canvas size for preview
    canvas.width = 300;
    canvas.height = 300 / aspectRatio;
    
    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Apply shape
    if (selectedShape.id === "circle") {
      ctx.globalCompositeOperation = "destination-in";
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    } else if (selectedShape.id === "square") {
      const size = Math.min(canvas.width, canvas.height);
      ctx.globalCompositeOperation = "destination-in";
      ctx.beginPath();
      ctx.rect((canvas.width - size) / 2, (canvas.height - size) / 2, size, size);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }
  };
  
  // Update preview when options change
  useEffect(() => {
    if (step >= 2) {
      renderPreview();
    }
  }, [selectedShape, selectedMaterial, selectedSize]);
  
  // Calculate price based on selected options
  const calculatePrice = () => {
    let basePrice = 3.49; // Base price for a sticker
    
    // Apply material multiplier
    basePrice *= selectedMaterial.price;
    
    // Apply size multiplier
    if (selectedSize.id === "custom") {
      // Custom size price
      const area = customWidth * customHeight;
      const standardArea = 4; // 2x2 inches
      const areaMultiplier = area / standardArea;
      basePrice *= Math.max(1, areaMultiplier);
    } else {
      basePrice *= selectedSize.priceMultiplier;
    }
    
    // Apply quantity discount
    let quantityDiscount = 1;
    if (quantity >= 100) quantityDiscount = 0.7;
    else if (quantity >= 50) quantityDiscount = 0.8;
    else if (quantity >= 25) quantityDiscount = 0.9;
    
    // Calculate final price
    const finalPrice = basePrice * quantity * quantityDiscount;
    setPrice(finalPrice);
  };
  
  // Format price to display
  const formatPrice = (price: number) => {
    return "$" + price.toFixed(2);
  };
  
  // Add to cart
  const addToCart = () => {
    toast.success("Stickers added to cart!");
    // Here you would typically add the item to a cart state or context
  };

  return (
    <>
      <Helmet>
        <title>Design Studio - Luvstickers</title>
        <meta name="description" content="Create your perfect custom stickers. Upload your design, choose material, shape, size, and quantity. Preview your stickers before you order." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="bg-istickers-light py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Design Your Custom Stickers</h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Upload your artwork, customize the size, shape, and material, and preview your stickers in real-time.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Step Indicator */}
          <div className="mb-12">
            <div className="flex justify-between items-center max-w-2xl mx-auto">
              <div className={`flex flex-col items-center ${step >= 1 ? "text-istickers-purple" : "text-gray-400"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-istickers-purple text-white" : "border-2 border-gray-300"}`}>
                  1
                </div>
                <span className="mt-2 text-sm">Upload</span>
              </div>
              
              <div className={`flex-1 h-1 mx-2 ${step >= 2 ? "bg-istickers-purple" : "bg-gray-300"}`}></div>
              
              <div className={`flex flex-col items-center ${step >= 2 ? "text-istickers-purple" : "text-gray-400"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-istickers-purple text-white" : "border-2 border-gray-300"}`}>
                  2
                </div>
                <span className="mt-2 text-sm">Customize</span>
              </div>
              
              <div className={`flex-1 h-1 mx-2 ${step >= 3 ? "bg-istickers-purple" : "bg-gray-300"}`}></div>
              
              <div className={`flex flex-col items-center ${step >= 3 ? "text-istickers-purple" : "text-gray-400"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-istickers-purple text-white" : "border-2 border-gray-300"}`}>
                  3
                </div>
                <span className="mt-2 text-sm">Order</span>
              </div>
            </div>
          </div>

          {/* Step 1: Upload Design */}
          {step === 1 && (
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Upload Your Design</h2>
                    <p className="text-gray-600 mb-6">
                      Upload your artwork in JPG, PNG, or SVG format. For best results,
                      use high-resolution images and ensure your design is finalized before uploading.
                    </p>
                    
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 hover:border-istickers-purple transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <Image size={48} className="text-gray-400" />
                        <div className="text-center">
                          <p className="text-sm text-gray-600">
                            Drag and drop your file here, or <span className="text-istickers-purple font-semibold">browse</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Supported formats: JPG, PNG, SVG (Max 5MB)
                          </p>
                        </div>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept=".jpg,.jpeg,.png,.svg"
                        onChange={handleFileUpload}
                      />
                    </div>
                    
                    <Button disabled={true} variant="outline" className="w-full sm:w-auto">
                      Continue with Sample Design
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Customize Design */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Options Panel */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6 space-y-6">
                    {/* Material Selection */}
                    <div>
                      <h3 className="font-medium mb-3 flex items-center">
                        <PaintRoller size={16} className="mr-2" /> Material
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                        {materialOptions.map((material) => (
                          <div 
                            key={material.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              selectedMaterial.id === material.id ? 
                              "border-istickers-purple bg-istickers-light" : 
                              "border-gray-200 hover:border-istickers-lavender"
                            }`}
                            onClick={() => setSelectedMaterial(material)}
                          >
                            <div className="flex items-center">
                              <div 
                                className="w-10 h-10 rounded mr-3" 
                                style={{
                                  background: material.color,
                                  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)"
                                }}
                              ></div>
                              <div>
                                <div className="font-medium">{material.name}</div>
                                <div className="text-xs text-gray-500">
                                  {material.id === "holographic" ? "Rainbow effect" : 
                                   material.id === "transparent" ? "Clear finish" : 
                                   material.id === "glitter" ? "Sparkly finish" : 
                                   material.id === "mirror" ? "Reflective surface" : 
                                   "Matte finish"}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Shape Selection */}
                    <div>
                      <h3 className="font-medium mb-3">Shape</h3>
                      <div className="flex flex-wrap gap-2">
                        {shapeOptions.map((shape) => (
                          <Button
                            key={shape.id}
                            variant={selectedShape.id === shape.id ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setSelectedShape(shape)}
                          >
                            {shape.icon}
                            <span className="ml-2">{shape.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Size Selection */}
                    <div>
                      <h3 className="font-medium mb-3">Size</h3>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {sizeOptions.map((size) => (
                          <Button
                            key={size.id}
                            variant={selectedSize.id === size.id ? "default" : "outline"}
                            onClick={() => setSelectedSize(size)}
                          >
                            {size.name}
                          </Button>
                        ))}
                      </div>
                      
                      {/* Custom Size Controls */}
                      {selectedSize.id === "custom" && (
                        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                          <div>
                            <label className="block text-sm mb-1">Width (inches)</label>
                            <div className="flex items-center gap-2">
                              <Slider
                                value={[customWidth]}
                                min={1}
                                max={12}
                                step={0.25}
                                onValueChange={(value) => setCustomWidth(value[0])}
                              />
                              <Input 
                                type="number" 
                                value={customWidth} 
                                min={1}
                                max={12}
                                step={0.25}
                                className="w-16"
                                onChange={(e) => setCustomWidth(Number(e.target.value))}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm mb-1">Height (inches)</label>
                            <div className="flex items-center gap-2">
                              <Slider
                                value={[customHeight]}
                                min={1}
                                max={12}
                                step={0.25}
                                onValueChange={(value) => setCustomHeight(value[0])}
                              />
                              <Input 
                                type="number" 
                                value={customHeight} 
                                min={1}
                                max={12}
                                step={0.25}
                                className="w-16"
                                onChange={(e) => setCustomHeight(Number(e.target.value))}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    {/* Quantity Selection */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <h3 className="font-medium">Quantity</h3>
                        <span className="text-sm text-gray-500">Min: 10</span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Slider
                            value={[quantity]}
                            min={10}
                            max={1000}
                            step={5}
                            onValueChange={(value) => setQuantity(value[0])}
                          />
                          <Input 
                            type="number" 
                            value={quantity} 
                            min={10}
                            className="w-20"
                            onChange={(e) => setQuantity(Number(e.target.value))}
                          />
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {[10, 25, 50, 100, 250, 500].map((qty) => (
                            <Button
                              key={qty}
                              variant="outline"
                              size="sm"
                              onClick={() => setQuantity(qty)}
                              className="flex-1"
                            >
                              {qty}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                          <span>Discount applied for orders of 25+</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t">
                      <Button 
                        className="w-full"
                        onClick={() => setStep(3)}
                      >
                        Continue to Order <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Preview Area */}
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardContent className="p-6 flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-4">Preview Your Sticker</h2>
                    
                    <div 
                      className="w-full h-80 flex items-center justify-center mb-6 rounded-lg" 
                      style={{
                        background: selectedMaterial.id === "transparent" ? 
                          "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CiAgPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjFmMWYxIj48L3JlY3Q+CiAgPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmMWYxZjEiPjwvcmVjdD4KPC9zdmc+Cg==')" :
                          selectedMaterial.color
                      }}
                    >
                      <canvas ref={canvasRef} className="max-w-full max-h-full" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 w-full max-w-md text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-500">Material:</span>
                        <span className="font-medium">{selectedMaterial.name}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500">Shape:</span>
                        <span className="font-medium">{selectedShape.name}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500">Size:</span>
                        <span className="font-medium">
                          {selectedSize.id === "custom" ? 
                            `${customWidth}" × ${customHeight}"` : 
                            selectedSize.displaySize}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500">Quantity:</span>
                        <span className="font-medium">{quantity} stickers</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Price Estimate</h3>
                        <p className="text-sm text-gray-500">Based on your selections</p>
                      </div>
                      <div className="mt-4 sm:mt-0 text-right">
                        <div className="text-3xl font-bold text-istickers-purple">{formatPrice(price)}</div>
                        <div className="text-sm text-gray-500">${(price / quantity).toFixed(2)} per sticker</div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button variant="outline" onClick={() => setStep(1)} className="mr-2">
                        Upload Different Design
                      </Button>
                      
                      <Button disabled={true}>
                        Save Design
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 3: Order Summary */}
          {step === 3 && (
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <div className="flex flex-col sm:flex-row gap-6 mb-6">
                    {/* Order Preview */}
                    <div className="sm:w-1/3">
                      <div className="border rounded-lg overflow-hidden mb-3">
                        <canvas ref={canvasRef} className="w-full" />
                      </div>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => setStep(2)}>
                        Edit Design
                      </Button>
                    </div>
                    
                    {/* Order Summary */}
                    <div className="sm:w-2/3">
                      <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                      
                      <div className="space-y-3 mb-6">
                        <div className="grid grid-cols-2">
                          <span className="text-gray-500">Product:</span>
                          <span>Custom {selectedShape.name} Stickers</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-gray-500">Material:</span>
                          <span>{selectedMaterial.name}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-gray-500">Size:</span>
                          <span>
                            {selectedSize.id === "custom" ? 
                              `${customWidth}" × ${customHeight}"` : 
                              selectedSize.displaySize}
                          </span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-gray-500">Quantity:</span>
                          <span>{quantity} stickers</span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between mb-2">
                          <span>Subtotal:</span>
                          <span>{formatPrice(price)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>Shipping:</span>
                          <span className="text-gray-500">Calculated at checkout</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span>{formatPrice(price)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-6">
                    <Button className="px-8" onClick={addToCart}>
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DesignStudio;
