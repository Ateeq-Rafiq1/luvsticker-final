
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [artworkPreview, setArtworkPreview] = useState<string>("");
  const [artworkName, setArtworkName] = useState<string>("");
  
  // Customer and delivery information
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [deliveryState, setDeliveryState] = useState("");
  const [deliveryPostalCode, setDeliveryPostalCode] = useState("");
  const [deliveryCountry, setDeliveryCountry] = useState("United States");

  useEffect(() => {
    const storedOrderData = sessionStorage.getItem('orderData');
    const storedArtwork = sessionStorage.getItem('orderArtwork');
    const storedArtworkName = sessionStorage.getItem('orderArtworkName');
    
    if (!storedOrderData) {
      navigate('/');
      return;
    }
    
    setOrderData(JSON.parse(storedOrderData));
    if (storedArtwork) setArtworkPreview(storedArtwork);
    if (storedArtworkName) setArtworkName(storedArtworkName);
  }, [navigate]);

  // Generate unique order number with timestamp and random component
  const generateOrderNumber = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `STK-${timestamp}-${random}`;
  };

  const handleSubmitOrder = async () => {
    if (!customerName || !customerEmail || !deliveryAddress || !deliveryCity || !deliveryState || !deliveryPostalCode) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Generate unique order number
      const orderNumber = generateOrderNumber();
      
      // Get artwork URL from session storage
      const artworkUrl = sessionStorage.getItem('artworkUrl') || null;
      
      // Create order in database
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          customer_email: customerEmail,
          customer_name: customerName,
          delivery_address: deliveryAddress,
          delivery_city: deliveryCity,
          delivery_state: deliveryState,
          delivery_postal_code: deliveryPostalCode,
          delivery_country: deliveryCountry,
          product_id: orderData.productId,
          size_id: orderData.sizeId,
          quantity: orderData.quantity,
          custom_width: orderData.customWidth,
          custom_height: orderData.customHeight,
          total_amount: parseFloat(orderData.total),
          artwork_url: artworkUrl,
          artwork_via_email: orderData.artwork_via_email,
          status: 'pending',
          order_number: orderNumber
        })
        .select()
        .single();

      if (error) throw error;

      // Store order data for Stripe checkout
      sessionStorage.setItem('pendingOrder', JSON.stringify({
        orderId: order.id,
        orderNumber: order.order_number,
        customerEmail,
        customerName,
        total: orderData.total,
        artworkName
      }));

      // Create Stripe checkout session
      const { data: stripeData, error: stripeError } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: Math.round(parseFloat(orderData.total) * 100), // Convert to cents
          orderId: order.id,
          orderNumber: order.order_number,
          customerEmail,
          customerName
        }
      });

      if (stripeError) throw stripeError;

      // Redirect to Stripe checkout
      if (stripeData?.url) {
        window.location.href = stripeData.url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Error submitting order",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No order data found</h1>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order details below</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
              <CardTitle className="text-xl text-orange-800">Customer & Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">Contact Information</h3>
                <div>
                  <Label htmlFor="name" className="text-base font-medium">Full Name *</Label>
                  <Input 
                    id="name" 
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)} 
                    placeholder="Enter your full name" 
                    className="mt-2 h-12" 
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-base font-medium">Email Address *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={customerEmail} 
                    onChange={(e) => setCustomerEmail(e.target.value)} 
                    placeholder="Enter your email address" 
                    className="mt-2 h-12" 
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Order confirmation and tracking info will be sent to this email
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">Delivery Address</h3>
                <div>
                  <Label htmlFor="address" className="text-base font-medium">Street Address *</Label>
                  <Input 
                    id="address" 
                    value={deliveryAddress} 
                    onChange={(e) => setDeliveryAddress(e.target.value)} 
                    placeholder="Enter street address" 
                    className="mt-2 h-12" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-base font-medium">City *</Label>
                    <Input 
                      id="city" 
                      value={deliveryCity} 
                      onChange={(e) => setDeliveryCity(e.target.value)} 
                      placeholder="City" 
                      className="mt-2 h-12" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-base font-medium">State *</Label>
                    <Input 
                      id="state" 
                      value={deliveryState} 
                      onChange={(e) => setDeliveryState(e.target.value)} 
                      placeholder="State" 
                      className="mt-2 h-12" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode" className="text-base font-medium">Postal Code *</Label>
                    <Input 
                      id="postalCode" 
                      value={deliveryPostalCode} 
                      onChange={(e) => setDeliveryPostalCode(e.target.value)} 
                      placeholder="ZIP/Postal Code" 
                      className="mt-2 h-12" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-base font-medium">Country *</Label>
                    <Input 
                      id="country" 
                      value={deliveryCountry} 
                      onChange={(e) => setDeliveryCountry(e.target.value)} 
                      placeholder="Country" 
                      className="mt-2 h-12" 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
              <CardTitle className="text-xl text-orange-800">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between py-2">
                  <span className="font-medium">Product:</span>
                  <span>{orderData.productName}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Size:</span>
                  <span>{orderData.sizeName}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Quantity:</span>
                  <span>{orderData.quantity} pieces</span>
                </div>
                {orderData.customWidth && orderData.customHeight && (
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Custom Size:</span>
                    <span>{orderData.customWidth}" × {orderData.customHeight}"</span>
                  </div>
                )}
                {artworkName && (
                  <div className="py-2">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">Artwork:</span>
                      <span className="text-sm text-right max-w-48 truncate">{artworkName}</span>
                    </div>
                    {artworkPreview && (
                      <div className="mt-2">
                        <img 
                          src={artworkPreview} 
                          alt="Artwork preview" 
                          className="w-full h-32 object-contain bg-gray-50 rounded-lg border" 
                        />
                      </div>
                    )}
                  </div>
                )}
                {orderData.artwork_via_email && (
                  <div className="py-2">
                    <span className="font-medium">Artwork:</span>
                    <span className="text-sm text-gray-600 ml-2">Will be sent via email to luvstickers3@gmail.com</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex justify-between items-center text-xl font-bold text-orange-600">
                  <span>Total Amount:</span>
                  <span>${orderData.total}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Includes design processing and premium materials
                </p>
              </div>
              
              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700 h-14 text-lg font-semibold" 
                onClick={handleSubmitOrder} 
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Proceed to Payment"}
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                By completing your order, you agree to our terms and conditions
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
