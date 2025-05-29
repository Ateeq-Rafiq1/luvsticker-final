
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Mail, Clock } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order') || 'STK-20241129-1234';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-green-600">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 text-lg">
              Thank you for your order. We're excited to create your custom stickers!
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">Order #{orderNumber}</h2>
                <p className="text-gray-600 mb-6">
                  Your order has been received and is being processed.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <Mail className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Confirmation Email</h3>
                    <p className="text-gray-600 text-sm">
                      Check your email for order details and tracking information.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <Clock className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Processing Time</h3>
                    <p className="text-gray-600 text-sm">
                      Most orders ship within 1-2 business days.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <Package className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Shipping</h3>
                    <p className="text-gray-600 text-sm">
                      You'll receive tracking info once your order ships.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">What's Next?</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-blue-600 text-xs font-semibold">1</span>
                    </span>
                    We'll review your artwork and prepare your order
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-blue-600 text-xs font-semibold">2</span>
                    </span>
                    Your stickers will be printed with premium materials
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-blue-600 text-xs font-semibold">3</span>
                    </span>
                    Package and ship to your address
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Need Help?</h3>
                <p className="text-gray-600 mb-4">
                  Our customer service team is ready to assist you with any questions.
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Email:</strong> support@stickerstore.com</p>
                  <p><strong>Phone:</strong> 1-800-STICKERS</p>
                  <p><strong>Hours:</strong> Mon-Fri 9AM-6PM EST</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="outline">
              <Link to="/track-order">Track Your Order</Link>
            </Button>
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
