
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
      question: "What types of stickers do you offer?",
      answer: "At Luvstickers, we provide a variety of sticker types! You can choose from front adhesive stickers, holographic stickers, cut-to-shape stickers, square stickers, rectangle stickers, circle stickers, and die-cut stickers. Each type is designed for different uses, whether for branding, packaging, or just for fun!"
    },
    {
      question: "How do I order stickers from your website?",
      answer: "Ordering stickers from Luvstickers is super easy! Just browse our catalog, pick the type of sticker you want, and customize it with your design. Once you're happy, simply follow the checkout process to place your order. If you need any help, feel free to call us!"
    },
    {
      question: "Are your stickers waterproof?",
      answer: "Yes! Many of our stickers are made from durable vinyl, which makes them waterproof and weatherproof. This means you can use them indoors or outdoors without worrying about them getting damaged by water!"
    },
    {
      question: "Can I use my own design for the stickers?",
      answer: "Absolutely! We love it when customers bring their own designs. You can upload your artwork during the order process, and we'll make sure your custom stickers come out just as you imagined!"
    },
    {
      question: "What can I use stickers for?",
      answer: "Stickers can be used for a variety of purposes! You can use them for branding your business, personal projects, labeling items, decorating your laptop, or even just for fun at parties. The possibilities are endless!"
    },
    {
      question: "How do I make sure my design looks good on stickers?",
      answer: "To ensure your design looks great on stickers, you should use high-resolution images and make sure your colors are vibrant. Our design guidelines on the website can help you create the best possible artwork. If you're unsure, don't hesitate to ask for advice!"
    },
    {
      question: "What if I have a question about my order?",
      answer: "If you have any questions regarding your order, you can easily contact our customer service. You can call us at +1 801-783-4566 or email us, and we'll be happy to assist you with any concerns you have!"
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping times can vary depending on where you are. Typically, once your order is completed, it will be shipped out quickly. You will receive a tracking number so you can keep an eye on your package as it makes its way to you!"
    },
    {
      question: "Do you offer refunds or exchanges?",
      answer: "Yes, we strive for customer satisfaction! If there is an issue with your order, such as a printing error or if the stickers were damaged during shipping, please reach out to us, and we will work to resolve it through refunds or exchanges!"
    },
    {
      question: "Can I order stickers in bulk?",
      answer: "Yes! We offer bulk ordering options for customers who need a large quantity of stickers. This is great for businesses or events where you need a lot of stickers. Just contact us for a quote!"
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
