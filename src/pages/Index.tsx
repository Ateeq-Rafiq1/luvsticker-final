
import HeroSection from "@/components/HeroSection";
import ProductShowcase from "@/components/ProductShowcase";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Luvstickers",
    "description": "Premium custom sticker design and printing company",
    "url": "https://luvstickers.com",
    "logo": "https://luvstickers.com/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "10972 S GLENDA LANE",
      "addressLocality": "SOUTH JORDAN",
      "addressRegion": "UT",
      "postalCode": "84095-4852",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://facebook.com/luvstickers",
      "https://instagram.com/luvstickers",
      "https://twitter.com/luvstickers"
    ]
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Luvstickers | Custom Sticker Design and Printing"
        description="Design and order premium custom stickers online with Luvstickers. Thousands of people trust us to make kick ass stickers, labels, packaging & more. Free proofs, free worldwide shipping, fast turnaround & 24/7 customer support."
        canonicalUrl="https://luvstickers.com"
        keywords="custom stickers, sticker printing, vinyl stickers, personalized stickers, sticker design, custom labels"
        schema={organizationSchema}
      />
      
      <Navbar />
      <HeroSection />
      <ProductShowcase />
      
      {/* Internal Links Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Explore Luvstickers</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Discover everything we offer to make your custom sticker experience seamless and professional
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link to="/products" className="group bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:bg-orange-50">
              <h3 className="text-xl font-semibold mb-3 group-hover:text-orange-600">Our Products</h3>
              <p className="text-gray-600 mb-4">Browse our full range of custom stickers and labels</p>
              <div className="flex items-center text-orange-600 font-medium">
                View Products <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            
            <Link to="/about" className="group bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:bg-orange-50">
              <h3 className="text-xl font-semibold mb-3 group-hover:text-orange-600">About Us</h3>
              <p className="text-gray-600 mb-4">Learn about our story and commitment to quality</p>
              <div className="flex items-center text-orange-600 font-medium">
                Our Story <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            
            <Link to="/faq" className="group bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:bg-orange-50">
              <h3 className="text-xl font-semibold mb-3 group-hover:text-orange-600">FAQ</h3>
              <p className="text-gray-600 mb-4">Find answers to common questions about our services</p>
              <div className="flex items-center text-orange-600 font-medium">
                Get Answers <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            
            <Link to="/contact" className="group bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:bg-orange-50">
              <h3 className="text-xl font-semibold mb-3 group-hover:text-orange-600">Contact</h3>
              <p className="text-gray-600 mb-4">Get in touch for custom quotes and support</p>
              <div className="flex items-center text-orange-600 font-medium">
                Contact Us <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* Additional Internal Links */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              Looking for more information? Check out our comprehensive resources:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/returns" className="text-orange-600 hover:text-orange-700 underline">
                Returns & Refunds Policy
              </Link>
              <Link to="/track-order" className="text-orange-600 hover:text-orange-700 underline">
                Track Your Order
              </Link>
              <Link to="/blog" className="text-orange-600 hover:text-orange-700 underline">
                Design Tips & Tutorials
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
