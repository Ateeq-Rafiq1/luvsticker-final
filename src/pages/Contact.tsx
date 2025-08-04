
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) {
        throw error;
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. We'll get back to you soon."
      });
    } catch (error) {
      console.error("Error sending contact form:", error);
      toast({
        title: "Error sending message",
        description: "Please try again later or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Luvstickers",
    "description": "Custom sticker design and printing company",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "10972 S GLENDA LANE",
      "addressLocality": "SOUTH JORDAN",
      "addressRegion": "UT",
      "postalCode": "84095-4852",
      "addressCountry": "US"
    },
    "openingHours": [
      "Mo-Fr 09:00-18:00",
      "Sa 10:00-16:00"
    ],
    "url": "https://luvstickers.com",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Contact Us - Custom Sticker Support"
        description="Get in touch with our team for any questions or support. Contact Luvstickers for custom sticker quotes, product information, and customer service."
        canonicalUrl="https://luvstickers.com/contact"
        keywords="contact luvstickers, custom sticker support, sticker quotes, customer service"
        schema={localBusinessSchema}
      />
      
      <Navbar />
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-gray-600 text-lg">
              Get in touch with our team for any questions or support
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                      Our Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">10972 S GLENDA LANE<br />SOUTH JORDAN, UT 84095-4852</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-orange-600" />
                      Business Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Monday - Friday: 9AM - 6PM EST<br />
                      Saturday: 10AM - 4PM EST<br />
                      Sunday: Closed
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Quick Links */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                <div className="space-y-3">
                  <Link to="/faq" className="group flex items-center text-gray-600 hover:text-orange-600 transition-colors">
                    <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    Frequently Asked Questions
                  </Link>
                  <Link to="/returns" className="group flex items-center text-gray-600 hover:text-orange-600 transition-colors">
                    <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    Returns & Refunds
                  </Link>
                  <Link to="/products" className="group flex items-center text-gray-600 hover:text-orange-600 transition-colors">
                    <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    View Our Products
                  </Link>
                  <Link to="/about" className="group flex items-center text-gray-600 hover:text-orange-600 transition-colors">
                    <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    About Luvstickers
                  </Link>
                </div>
              </section>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <h2>Send us a Message</h2>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange} 
                          required 
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          required 
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input 
                        id="subject" 
                        name="subject" 
                        value={formData.subject} 
                        onChange={handleInputChange} 
                        required 
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        rows={6} 
                        value={formData.message} 
                        onChange={handleInputChange} 
                        required 
                        disabled={isSubmitting}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-orange-600 hover:bg-orange-700" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Support Options */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Other Ways to Reach Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Need a Quote?</h3>
                <p className="text-gray-600 mb-6">
                  Browse our products and get instant quotes for your custom sticker needs
                </p>
                <Button asChild className="bg-orange-600 hover:bg-orange-700">
                  <Link to="/products">Browse Products</Link>
                </Button>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Have Questions?</h3>
                <p className="text-gray-600 mb-6">
                  Check our FAQ section for quick answers to common questions
                </p>
                <Button asChild variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                  <Link to="/faq">View FAQ</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
