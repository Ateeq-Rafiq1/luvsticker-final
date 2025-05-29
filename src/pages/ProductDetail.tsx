import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Star, Upload, Truck, CheckSquare, Shield, Palette } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { getStickerById, quantityOptions } from "@/data/stickerData";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(25);
  const [customQuantity, setCustomQuantity] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [customSize, setCustomSize] = useState({ width: "", height: "" });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [orderStep, setOrderStep] = useState(0);
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [useCustomQuantity, setUseCustomQuantity] = useState(false);

  useEffect(() => {
    if (productId) {
      const foundProduct = getStickerById(productId);
      setProduct(foundProduct || null);

      if (foundProduct && foundProduct.sizes.length > 0) {
        setSelectedSize(foundProduct.sizes[1].name); // Default to medium size
      }

      setLoading(false);
    }
  }, [productId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
      toast({
        title: "File uploaded",
        description: `${e.target.files[0].name} has been uploaded.`,
      });
    }
  };

  const getCurrentSizePrice = () => {
    if (!product) return 0;

    // Calculate price based on size
    let sizeMultiplier = 1;
    if (useCustomSize) {
      // Custom size pricing could be more complex, but we'll use a simple formula here
      const width = parseFloat(customSize.width) || 1;
      const height = parseFloat(customSize.height) || 1;
      sizeMultiplier = (width * height) / 10; // Simple area-based pricing
      sizeMultiplier = Math.max(1, sizeMultiplier); // Minimum multiplier of 1
    } else {
      sizeMultiplier = product.sizes.find((s: any) => s.name === selectedSize)?.priceMultiplier || 1;
    }

    // Calculate price based on quantity
    let quantityMultiplier = 1;
    if (useCustomQuantity) {
      const qty = parseInt(customQuantity) || 1;
      // Apply a discount for larger quantities
      if (qty >= 500) quantityMultiplier = 0.6;
      else if (qty >= 250) quantityMultiplier = 0.7;
      else if (qty >= 100) quantityMultiplier = 0.8;
      else if (qty >= 50) quantityMultiplier = 0.9;
      quantityMultiplier *= qty / 25; // Adjust based on our base quantity of 25
    } else {
      quantityMultiplier = quantityOptions.find(q => q.quantity === selectedQuantity)?.priceMultiplier || 1;
    }

    return (product.price * sizeMultiplier * quantityMultiplier).toFixed(2);
  };

  const getDisplayQuantity = () => {
    return useCustomQuantity ? parseInt(customQuantity) || 0 : selectedQuantity;
  };

  const getDisplaySize = () => {
    if (useCustomSize) {
      return `Custom (${customSize.width}" × ${customSize.height}")`;
    }
    return product?.sizes.find((s: any) => s.name === selectedSize)?.dimensions || "";
  };

  const handleAddToCart = () => {
    if (!uploadedFile) {
      toast({
        title: "Artwork required",
        description: "Please upload your artwork before adding to cart.",
        variant: "destructive"
      });
      return;
    }

    if (useCustomQuantity && (!customQuantity || parseInt(customQuantity) <= 0)) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid quantity.",
        variant: "destructive"
      });
      return;
    }

    if (useCustomSize && (!customSize.width || !customSize.height)) {
      toast({
        title: "Invalid size",
        description: "Please enter valid dimensions for your custom size.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Added to cart",
      description: `${getDisplayQuantity()} ${product.name} (${useCustomSize ? 'Custom Size' : selectedSize}) added to your cart.`,
    });

    // Reset order flow
    setOrderStep(0);
  };

  const renderBenefitIcon = (iconName: string) => {
    switch (iconName) {
      case "truck": return <Truck className="h-8 w-8 text-istickers-purple" />;
      case "check-square": return <CheckSquare className="h-8 w-8 text-istickers-purple" />;
      case "shield": return <Shield className="h-8 w-8 text-istickers-purple" />;
      default: return null;
    }
  };

  const goToNextStep = () => {
    // Validate inputs before proceeding
    if (orderStep === 0 && useCustomSize && (!customSize.width || !customSize.height)) {
      toast({
        title: "Invalid size",
        description: "Please enter valid dimensions for your custom size.",
        variant: "destructive"
      });
      return;
    }

    if (orderStep === 1 && useCustomQuantity && (!customQuantity || parseInt(customQuantity) <= 0)) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid quantity.",
        variant: "destructive"
      });
      return;
    }

    if (orderStep < 3) {
      setOrderStep(orderStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (orderStep > 0) {
      setOrderStep(orderStep - 1);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-istickers-orange border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg">Loading product details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-2xl font-bold">Product Not Found</h2>
            <p className="mt-2 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
            <Button asChild className="mt-4">
              <Link to="/catalog">Return to Catalog</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{product.name} - Luvstickers</title>
        <meta name="description" content={product.description} />
      </Helmet>

      {/* Product Hero Section */}
      <div className="bg-istickers-orange text-white py-12">
        <div className="container mx-auto px-4">
          <Link to="/catalog" className="inline-flex items-center text-white/90 hover:text-white transition-colors mb-4">
            <ArrowLeft size={16} className="mr-1" />
            Back to Catalog
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{product.name}</h1>
          <p className="text-xl opacity-90 max-w-2xl">{product.description}</p>
        </div>
      </div>

      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          {/* Product Info Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Product Image */}
              <div className="overflow-hidden">
                <AspectRatio ratio={1 / 1}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
                  />
                </AspectRatio>
              </div>

              {/* Order Section */}
              <div className="p-8 lg:p-12 space-y-6 bg-gray-50">
                <div>
                  <h2 className="text-2xl font-bold mb-3">Order Your {product.name}</h2>
                  <p className="text-xl font-semibold text-istickers-orange mb-4">
                    From ${product.price.toFixed(2)}
                  </p>
                </div>

                {/* Order Form */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="mb-6 flex items-center">
                    <div className={cn(
                      "flex justify-center items-center w-8 h-8 rounded-full text-sm font-bold mr-3",
                      orderStep >= 0 ? "bg-istickers-orange text-white" : "bg-gray-200 text-gray-500"
                    )}>1</div>
                    <h3 className="text-lg font-semibold">Choose Your Size</h3>
                  </div>

                  {orderStep === 0 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        {product.sizes.map((size: any) => (
                          <button
                            key={size.name}
                            type="button"
                            className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${selectedSize === size.name && !useCustomSize
                                ? "bg-istickers-orange text-white border-istickers-orange"
                                : "bg-white text-gray-700 border-gray-200 hover:border-istickers-orange/50"
                              }`}
                            onClick={() => {
                              setSelectedSize(size.name);
                              setUseCustomSize(false);
                            }}
                          >
                            <span className="block font-bold">{size.name}</span>
                            <span className="text-xs opacity-80">{size.dimensions}</span>
                          </button>
                        ))}

                        {/* Custom Size Option */}
                        <button
                          type="button"
                          className={`p-3 border-2 rounded-lg text-sm font-medium transition-all col-span-3 ${useCustomSize
                              ? "bg-istickers-orange text-white border-istickers-orange"
                              : "bg-white text-gray-700 border-gray-200 hover:border-istickers-orange/50"
                            }`}
                          onClick={() => setUseCustomSize(true)}
                        >
                          <span className="block font-bold mb-1">Custom Size</span>
                          <span className="text-xs opacity-80">Specify your own dimensions</span>
                        </button>
                      </div>

                      {/* Custom Size Input Fields */}
                      {useCustomSize && (
                        <div className="p-3 border border-istickers-orange/30 rounded-lg bg-istickers-orange/5">
                          <p className="text-sm font-medium mb-2">Enter your dimensions (inches)</p>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="text-xs text-gray-500">Width</label>
                              <div className="relative">
                                <Input
                                  type="number"
                                  min="0.5"
                                  step="0.1"
                                  placeholder="Width"
                                  value={customSize.width}
                                  onChange={(e) => setCustomSize({ ...customSize, width: e.target.value })}
                                  className="pr-6"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">"</span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <label className="text-xs text-gray-500">Height</label>
                              <div className="relative">
                                <Input
                                  type="number"
                                  min="0.5"
                                  step="0.1"
                                  placeholder="Height"
                                  value={customSize.height}
                                  onChange={(e) => setCustomSize({ ...customSize, height: e.target.value })}
                                  className="pr-6"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">"</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={goToNextStep}
                          className="bg-istickers-orange hover:bg-istickers-orange/90"
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className={cn("mb-6 flex items-center mt-6", orderStep < 1 && "opacity-50")}>
                    <div className={cn(
                      "flex justify-center items-center w-8 h-8 rounded-full text-sm font-bold mr-3",
                      orderStep >= 1 ? "bg-istickers-orange text-white" : "bg-gray-200 text-gray-500"
                    )}>2</div>
                    <h3 className="text-lg font-semibold">Select Quantity</h3>
                  </div>

                  {orderStep === 1 && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-3 gap-3">
                        {quantityOptions.map((qty) => (
                          <button
                            key={qty.quantity}
                            type="button"
                            className={`p-3 border-2 rounded-lg text-center font-medium transition-all ${selectedQuantity === qty.quantity && !useCustomQuantity
                                ? "bg-istickers-orange text-white border-istickers-orange"
                                : "bg-white text-gray-700 border-gray-200 hover:border-istickers-orange/50"
                              }`}
                            onClick={() => {
                              setSelectedQuantity(qty.quantity);
                              setUseCustomQuantity(false);
                            }}
                          >
                            {qty.quantity}
                          </button>
                        ))}

                        {/* Custom Quantity Option */}
                        <button
                          type="button"
                          className={`p-3 border-2 rounded-lg text-center font-medium transition-all col-span-3 ${useCustomQuantity
                              ? "bg-istickers-orange text-white border-istickers-orange"
                              : "bg-white text-gray-700 border-gray-200 hover:border-istickers-orange/50"
                            }`}
                          onClick={() => setUseCustomQuantity(true)}
                        >
                          Custom Quantity
                        </button>
                      </div>

                      {/* Custom Quantity Input */}
                      {useCustomQuantity && (
                        <div className="p-3 border border-istickers-orange/30 rounded-lg bg-istickers-orange/5">
                          <p className="text-sm font-medium mb-2">Enter your desired quantity</p>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Enter quantity"
                            value={customQuantity}
                            onChange={(e) => setCustomQuantity(e.target.value)}
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            * Custom quantities may have different lead times. Our team will contact you to confirm details.
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={goToPrevStep}>
                          Back
                        </Button>
                        <Button
                          onClick={goToNextStep}
                          className="bg-istickers-orange hover:bg-istickers-orange/90"
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className={cn("mb-6 flex items-center mt-6", orderStep < 2 && "opacity-50")}>
                    <div className={cn(
                      "flex justify-center items-center w-8 h-8 rounded-full text-sm font-bold mr-3",
                      orderStep >= 2 ? "bg-istickers-orange text-white" : "bg-gray-200 text-gray-500"
                    )}>3</div>
                    <h3 className="text-lg font-semibold">Upload Artwork</h3>
                  </div>

                  {orderStep === 2 && (
                    <div className="space-y-5">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-istickers-orange/50 transition-colors">
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.svg"
                          id="artwork-upload"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                        <label htmlFor="artwork-upload" className="cursor-pointer block">
                          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-base text-gray-600 font-medium">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            JPG, PNG or SVG (Max 10MB)
                          </p>
                        </label>
                        {uploadedFile && (
                          <div className="mt-3 py-2 px-3 bg-green-50 text-green-700 rounded-md inline-flex items-center">
                            <CheckSquare className="w-4 h-4 mr-2" /> {uploadedFile.name}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={goToPrevStep}>
                          Back
                        </Button>
                        <Button
                          onClick={goToNextStep}
                          className="bg-istickers-orange hover:bg-istickers-orange/90"
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className={cn("mb-6 flex items-center mt-6", orderStep < 3 && "opacity-50")}>
                    <div className={cn(
                      "flex justify-center items-center w-8 h-8 rounded-full text-sm font-bold mr-3",
                      orderStep >= 3 ? "bg-istickers-orange text-white" : "bg-gray-200 text-gray-500"
                    )}>4</div>
                    <h3 className="text-lg font-semibold">Order Summary</h3>
                  </div>

                  {orderStep === 3 && (
                    <div className="space-y-5">
                      <div className="bg-gray-50 p-5 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Product:</span>
                            <span className="font-medium">{product.name}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-600">Size:</span>
                            <span>{getDisplaySize()}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-600">Quantity:</span>
                            <span>{getDisplayQuantity()}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-600">Artwork:</span>
                            <span className="truncate max-w-[200px]">{uploadedFile?.name || "Not uploaded"}</span>
                          </div>

                          <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between text-lg">
                              <span className="font-bold">Total Price:</span>
                              <span className="font-bold text-istickers-orange">
                                ${getCurrentSizePrice()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={goToPrevStep}>
                          Back
                        </Button>
                        <Button
                          onClick={handleAddToCart}
                          className="bg-istickers-orange hover:bg-istickers-orange/90"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <section className="py-12 mb-8">
            <h2 className="text-3xl font-bold mb-10 text-center">Why Choose Our Stickers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {product.benefits.map((benefit: any, index: number) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-md text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-istickers-light mb-5">
                    {renderBenefitIcon(benefit.icon)}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>

          <Separator className="my-12" />

          {/* Video Showcase Section */}
          {product.videoUrl && (
            <section className="py-12 mb-8 bg-white">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="p-8 lg:p-12 flex items-center">
                    <div>
                      <h2 className="text-3xl font-bold mb-6">Precisely cut to the shape of your design</h2>
                      <p className="text-gray-700 text-lg">
                        Upload your logo, drawing, or photo and we'll create a die cut vinyl sticker that's precisely cut to fit your design. Our unique sticker cutting technology allows us to make even the most intricate cut patterns. And, our proof approval process lets you work directly with us to ensure your stickers will look exactly how you want.
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-100 overflow-hidden">
                    <div className="aspect-w-16 aspect-h-9">
                      <video
                        controls
                        className="w-full h-full object-cover"
                        poster={product.image}
                      >
                        <source src={product.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <Separator className="my-12" />

          {/* Gallery Section */}
          <section className="py-12 mb-8">
            <h2 className="text-3xl font-bold mb-4 text-center">Custom shaped stickers</h2>
            <p className="text-gray-700 mb-10 text-center max-w-3xl mx-auto text-lg">
              Each high-quality die cut sticker is printed on thick, durable vinyl with a matte finish—giving your stickers a premium look and feel. Order as few as 10 stickers, or save money when you order in bulk.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {product.gallery.map((item: any, index: number) => (
                <div
                  key={index}
                  className="rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <img
                    src={item.image}
                    alt={item.caption || `${product.name} example ${index + 1}`}
                    className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
                  />
                  {item.caption && (
                    <div className="p-4 text-center font-medium text-gray-700">
                      {item.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <Separator className="my-12" />

          {/* Design Assistance Section - Updated with uploaded image */}
          <section className="py-16 mb-16">
            <div className="relative overflow-hidden bg-gradient-to-br from-istickers-orange via-istickers-orange/90 to-istickers-white rounded-3xl shadow-2xl">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
                <div className="absolute top-32 right-20 w-16 h-16 bg-white/20 rounded-lg rotate-45"></div>
                <div className="absolute bottom-20 left-32 w-12 h-12 bg-white/15 rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-24 h-24 border border-white/30 rounded-full"></div>
              </div>
              
              <div className="relative p-8 lg:p-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="text-white">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                      <Palette className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                      Need a design?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 leading-relaxed">
                      Don't have artwork? No problem! Our expert design team will create stunning, custom designs that perfectly match your vision. Get professional designs tailored to your brand.
                    </p>
                    <Button 
                      asChild 
                      size="lg"
                      className="bg-white text-istickers-orange hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
                    >
                      <Link to="/contact" className="inline-flex items-center">
                        Get your designs
                        <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <div className="transform transition-all duration-300 hover:scale-105">
                      <img
                        src="/design.png"
                        alt="Custom design examples"
                        className="w-full h-auto rounded-2xl shadow-2xl"
                      />
                    </div>
                    
                    {/* Enhanced Decorative elements */}
                    <div className="absolute -top-6 -left-6 w-20 h-20 bg-white/10 rounded-full blur-sm animate-pulse"></div>
                    <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-white/15 rounded-full blur-sm animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 -right-8 w-12 h-12 bg-white/5 rounded-full blur-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Customer Reviews */}
          <section className="py-12">
            <h2 className="text-3xl font-bold mb-10 text-center">Customer Reviews</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {product.reviews.map((review: any) => (
                <Card
                  key={review.id}
                  className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="flex mr-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700 mb-4 italic">{review.comment}</p>
                    <div className="font-semibold text-lg">{review.name}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* CTA Section */}
        <div className="bg-istickers-orange py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Create Your Custom Stickers?</h2>
            <Button
              size="lg"
              className="bg-white text-istickers-orange hover:bg-gray-100 text-lg py-6 px-10"
              onClick={() => setOrderStep(0)}
            >
              <Link to="/catalog">Start Your Order Now</Link>
            </Button>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ProductDetail;
