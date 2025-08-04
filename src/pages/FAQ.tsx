
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "What materials do you use for your stickers?",
      answer: "We use high-quality vinyl materials that are waterproof, fade-resistant, and designed to last for years both indoors and outdoors."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days within the US. Express shipping (1-2 business days) is also available for an additional fee."
    },
    {
      question: "Can I get a custom size for my stickers?",
      answer: "Yes! We offer custom sizing for all our products. Simply select the custom size option when placing your order and specify your dimensions."
    },
    {
      question: "What file formats do you accept for artwork?",
      answer: "We accept PNG, JPG, PDF, and SVG files. For best quality, we recommend high-resolution images (300 DPI or higher)."
    },
    {
      question: "Do you offer bulk discounts?",
      answer: "Yes, we offer quantity discounts starting at 50+ pieces. The more you order, the more you save!"
    },
    {
      question: "Are your stickers removable?",
      answer: "Our standard stickers are permanent, but we also offer removable options. Please specify if you need removable stickers when ordering."
    },
    {
      question: "Can I see a proof before my order is printed?",
      answer: "Yes, we provide digital proofs for all custom orders. You'll receive an email with your proof within 24 hours of placing your order."
    },
    {
      question: "What's your return policy?",
      answer: "We offer a 100% satisfaction guarantee. If you're not happy with your order, contact us within 30 days for a full refund or reprint."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="FAQ - Custom Sticker Questions Answered"
        description="Find answers to common questions about our custom sticker products and services. Get help with materials, shipping, file formats, and more."
        canonicalUrl="https://luvstickers.com/faq"
        keywords="sticker FAQ, custom sticker questions, vinyl sticker help, sticker materials, shipping questions"
        schema={faqSchema}
      />
      
      <Navbar />
      <div className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 text-lg">
              Find answers to common questions about our products and services
            </p>
          </div>

          {/* FAQ Categories */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Quick Navigation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <h3 className="font-semibold text-orange-600">Product Questions</h3>
                <p className="text-sm text-gray-600 mt-1">Materials, sizes, customization</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <h3 className="font-semibold text-orange-600">Order & Shipping</h3>
                <p className="text-sm text-gray-600 mt-1">Processing, delivery, tracking</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <h3 className="font-semibold text-orange-600">Support & Returns</h3>
                <p className="text-sm text-gray-600 mt-1">Policies, guarantees, help</p>
              </div>
            </div>
          </section>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-lg border shadow-sm"
              >
                <AccordionTrigger className="px-6 py-4 text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Related Links Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Still Need Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/contact" className="group bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 hover:bg-orange-50">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-600">Contact Us</h3>
                <p className="text-gray-600 text-sm mb-4">Get personalized help from our support team</p>
                <div className="flex items-center justify-center text-orange-600 font-medium">
                  Contact Support <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              
              <Link to="/products" className="group bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 hover:bg-orange-50">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-600">Browse Products</h3>
                <p className="text-gray-600 text-sm mb-4">Explore our full range of custom stickers</p>
                <div className="flex items-center justify-center text-orange-600 font-medium">
                  View Products <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              
              <Link to="/returns" className="group bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 hover:bg-orange-50">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-600">Return Policy</h3>
                <p className="text-gray-600 text-sm mb-4">Learn about our satisfaction guarantee</p>
                <div className="flex items-center justify-center text-orange-600 font-medium">
                  View Policy <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
