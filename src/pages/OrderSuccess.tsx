
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Mail, Clock, Download, Eye } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order');
  const sessionId = searchParams.get('session_id');
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      if (orderNumber && sessionId) {
        try {
          // Update order status to paid
          await supabase
            .from('orders')
            .update({ status: 'paid' })
            .eq('order_number', orderNumber)
            .eq('stripe_session_id', sessionId);

          // Get order details for email
          const { data: order } = await supabase
            .from('orders')
            .select(`
              *,
              products (name),
              product_sizes (size_name)
            `)
            .eq('order_number', orderNumber)
            .single();

          if (order) {
            // Get artwork name from session storage if available
            const pendingOrder = sessionStorage.getItem('pendingOrder');
            let artworkName = '';
            if (pendingOrder) {
              const orderData = JSON.parse(pendingOrder);
              artworkName = orderData.artworkName || '';
            }
            
            // Send confirmation emails
            await supabase.functions.invoke('send-order-confirmation', {
              body: {
                customerEmail: order.customer_email,
                customerName: order.customer_name,
                orderNumber: order.order_number,
                orderDetails: {
                  productName: order.products?.name || 'Custom Stickers',
                  quantity: order.quantity,
                  total: order.total_amount.toString(),
                  size: order.product_sizes?.size_name || 'Custom Size',
                  artworkName: artworkName || undefined
                }
              }
            });

            // Clear session storage
            sessionStorage.removeItem('orderData');
            sessionStorage.removeItem('orderArtwork');
            sessionStorage.removeItem('orderArtworkName');
            sessionStorage.removeItem('pendingOrder');
          }
        } catch (error) {
          console.error('Error processing payment success:', error);
        }
      }
      setIsProcessing(false);
    };

    processPaymentSuccess();
  }, [orderNumber, sessionId]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing your order...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-green-600">
              Payment Successful!
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Thank you for your order! We're excited to create your custom stickers and bring your design to life.
            </p>
          </div>

          <Card className="mb-8 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 mb-6">
                  <h2 className="text-2xl font-semibold mb-2 text-orange-800">
                    Order #{orderNumber || 'Processing...'}
                  </h2>
                  <p className="text-orange-700">
                    Your payment has been processed and order confirmed
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="flex justify-center mb-4">
                      <Mail className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2 text-blue-800">Confirmation Email</h3>
                    <p className="text-blue-700 text-sm">
                      Check your email for detailed order information and tracking updates.
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-orange-50 rounded-lg">
                    <div className="flex justify-center mb-4">
                      <Clock className="w-10 h-10 text-orange-600" />
                    </div>
                    <h3 className="font-semibold mb-2 text-orange-800">Processing Time</h3>
                    <p className="text-orange-700 text-sm">
                      Most orders are processed and ship within 1-2 business days.
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="flex justify-center mb-4">
                      <Package className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2 text-green-800">Shipping & Tracking</h3>
                    <p className="text-green-700 text-sm">
                      You'll receive tracking information once your order ships.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-lg">What happens next?</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-orange-600 text-sm font-semibold">1</span>
                    </span>
                    <div>
                      <p className="font-medium">Artwork Review</p>
                      <p className="text-gray-600 text-sm">Our design team reviews your artwork for print quality</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-orange-600 text-sm font-semibold">2</span>
                    </span>
                    <div>
                      <p className="font-medium">Premium Printing</p>
                      <p className="text-gray-600 text-sm">Your stickers are printed using high-quality materials</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-orange-600 text-sm font-semibold">3</span>
                    </span>
                    <div>
                      <p className="font-medium">Quality Check & Ship</p>
                      <p className="text-gray-600 text-sm">Final quality inspection before careful packaging and shipping</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-lg">Need Help?</h3>
                <p className="text-gray-600 mb-4">
                  Our customer service team is ready to assist you with any questions about your order.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <span><strong>Email:</strong> support@luvstickers.com</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-gray-500">📞</span>
                    <span><strong>Phone:</strong> 1-800-STICKERS</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <span><strong>Hours:</strong> Mon-Fri 9AM-6PM EST</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Quick Actions:</p>
                  <div className="flex flex-col gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/track-order" className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Track Order Status
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/contact" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Contact Support
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="outline" size="lg">
              <Link to="/track-order">Track Your Order</Link>
            </Button>
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
