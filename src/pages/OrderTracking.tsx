
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || "");

  const { data: order, isLoading, refetch } = useQuery({
    queryKey: ['order', orderNumber],
    queryFn: async () => {
      if (!orderNumber) return null;
      
      const { data } = await supabase
        .from('orders')
        .select(`
          *,
          products (name),
          product_sizes (size_name, width, height)
        `)
        .eq('order_number', orderNumber)
        .single();
      
      return data;
    },
    enabled: !!orderNumber
  });

  const handleSearch = () => {
    if (orderNumber) {
      refetch();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'in_production': return 'bg-purple-500';
      case 'shipped': return 'bg-green-500';
      case 'delivered': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter Order Number</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="order-number">Order Number</Label>
                <Input
                  id="order-number"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="STK-20250129-1234"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} className="bg-orange-600 hover:bg-orange-700">
                  Track Order
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-pulse">Searching for your order...</div>
            </CardContent>
          </Card>
        )}

        {order && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Order #{order.order_number}</span>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Product Details</h3>
                  <p>Product: {order.products?.name}</p>
                  <p>Size: {order.product_sizes?.size_name}</p>
                  <p>Quantity: {order.quantity}</p>
                  {order.custom_width && order.custom_height && (
                    <p>Custom Size: {order.custom_width}" × {order.custom_height}"</p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <p>Name: {order.customer_name}</p>
                  <p>Email: {order.customer_email}</p>
                  <p>Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
                  <p>Total: ${order.total_amount}</p>
                </div>
              </div>
              
              {order.tracking_number && (
                <div>
                  <h3 className="font-semibold mb-2">Tracking Information</h3>
                  <p>Tracking Number: {order.tracking_number}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {orderNumber && !isLoading && !order && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">No order found with that number.</p>
              <p className="text-sm text-gray-500">Please check your order number and try again.</p>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderTracking;
