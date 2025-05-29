
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  return (
    <div className="min-h-screen flex flex-col">
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

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Still have questions? We're here to help!
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
