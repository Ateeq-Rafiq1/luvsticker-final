
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
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const storedOrderData = sessionStorage.getItem('orderData');
    if (!storedOrderData) {
      navigate('/');
      return;
    }
    setOrderData(JSON.parse(storedOrderData));
  }, [navigate]);

  const handleSubmitOrder = async () => {
    if (!customerName || !customerEmail) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create order in database
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          customer_email: customerEmail,
          customer_name: customerName,
          product_id: orderData.productId,
          size_id: orderData.sizeId,
          quantity: orderData.quantity,
          custom_width: orderData.customWidth,
          custom_height: orderData.customHeight,
          total_amount: 99.99, // Calculate based on actual pricing
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Order submitted successfully!",
        description: `Order number: ${order.order_number}`
      });

      // Clear session storage
      sessionStorage.removeItem('orderData');
      sessionStorage.removeItem('orderArtwork');

      // Navigate to order tracking with order number
      navigate(`/track-order?order=${order.order_number}`);
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
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span>{orderData.quantity}</span>
                </div>
                {orderData.customWidth && orderData.customHeight && (
                  <div className="flex justify-between">
                    <span>Custom Size:</span>
                    <span>{orderData.customWidth}" × {orderData.customHeight}"</span>
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>$99.99</span>
              </div>
              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700" 
                onClick={handleSubmitOrder}
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Order"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
