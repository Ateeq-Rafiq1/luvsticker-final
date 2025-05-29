
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";

const Returns = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Returns & Refunds
            </h1>
            <p className="text-gray-600 text-lg">
              Your satisfaction is our priority. Learn about our return policy.
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                  100% Satisfaction Guarantee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We stand behind the quality of our products. If you're not completely satisfied
                  with your order, we'll make it right with a full refund or replacement.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Eligible for Return
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Defective or damaged products</li>
                    <li>• Wrong item received</li>
                    <li>• Poor print quality</li>
                    <li>• Missing items from order</li>
                    <li>• Color discrepancies</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-red-600">
                    <XCircle className="w-5 h-5 mr-2" />
                    Not Eligible for Return
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Custom orders (unless defective)</li>
                    <li>• Items damaged by customer</li>
                    <li>• Change of mind after approval</li>
                    <li>• Orders over 90 days old</li>
                    <li>• Used or applied stickers</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-6 h-6 mr-2 text-orange-600" />
                  Return Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold text-sm">1</span>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold">Contact Us (Within 30 Days)</h4>
                      <p className="text-gray-600 text-sm">
                        Report any issues within 30 days of receiving your order
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold text-sm">2</span>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold">Send Photos (If Applicable)</h4>
                      <p className="text-gray-600 text-sm">
                        For quality issues, send photos of the problem
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold text-sm">3</span>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold">Get Resolution (1-2 Business Days)</h4>
                      <p className="text-gray-600 text-sm">
                        We'll review and provide a solution quickly
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw className="w-6 h-6 mr-2 text-blue-600" />
                  How to Request a Return
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    To request a return or refund, please contact our customer service team:
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p><strong>Email:</strong> returns@stickerstore.com</p>
                    <p><strong>Phone:</strong> 1-800-STICKERS</p>
                    <p><strong>Include:</strong> Order number, issue description, and photos (if applicable)</p>
                  </div>
                  <p className="text-gray-600">
                    Our team will review your request and respond within 24 hours with next steps.
                    Most issues can be resolved without returning the physical product.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-semibold text-orange-800 mb-2">
                    Questions About Returns?
                  </h3>
                  <p className="text-orange-700 mb-4">
                    Our customer service team is here to help with any return questions.
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Contact Support
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Returns;
