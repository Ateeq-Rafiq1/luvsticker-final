
import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Package, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const trackingId = searchParams.get("tracking") || "N/A";
  const email = searchParams.get("email") || "";
  
  return (
    <>
      <Helmet>
        <title>Order Confirmed - Luvstickers</title>
      </Helmet>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your order. We've sent a confirmation email with all the details.
            </p>
            
            <div className="bg-gradient-to-r from-istickers-orange/10 to-istickers-blue/10 p-6 rounded-lg mb-8">
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-600 mb-1">Your Tracking ID</div>
                <div className="text-3xl font-bold text-istickers-orange mb-2">{trackingId}</div>
                <div className="text-sm text-gray-600">
                  Keep this ID safe - you'll need it to track your order
                </div>
              </div>
            </div>

            {email && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-center">
                <Mail className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm text-blue-800">
                  Confirmation email sent to: <strong>{decodeURIComponent(email)}</strong>
                </span>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              <Button asChild variant="outline" className="flex items-center justify-center gap-2">
                <Link to={`/tracking?order=${trackingId}&email=${email}`}>
                  <Search className="h-4 w-4" />
                  Track Your Order
                </Link>
              </Button>
              
              <Button asChild className="flex items-center justify-center gap-2">
                <Link to="/catalog">
                  <Package className="h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
            
            <div className="space-y-4 text-left">
              <h2 className="font-semibold text-lg">What happens next?</h2>
              <ol className="space-y-3 list-decimal pl-5">
                <li>
                  <span className="font-medium">Order Processing</span>: We'll review your order and prepare it for production (1-2 hours).
                </li>
                <li>
                  <span className="font-medium">Design Review</span>: Our team will check your artwork for quality (if applicable).
                </li>
                <li>
                  <span className="font-medium">Production</span>: Your stickers will be printed and quality checked (2-3 business days).
                </li>
                <li>
                  <span className="font-medium">Shipping</span>: Your order ships with free 4-day delivery.
                </li>
              </ol>
              <p className="text-sm text-gray-600 pt-4">
                <strong>Track your order:</strong> Use your tracking ID <strong>{trackingId}</strong> and email address 
                to check your order status anytime on our tracking page.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button asChild variant="ghost">
              <Link to="/">Return to Homepage</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OrderSuccess;
