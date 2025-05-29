import React from "react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import Section from "@/components/layout/Section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | Luvstickers</title>
      </Helmet>
      <Layout>
        <Section variant="white">
          <h1 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h1>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg">What materials do you use for your stickers?</AccordionTrigger>
                <AccordionContent>
                  We use premium vinyl material for all our stickers, ensuring they're waterproof, weatherproof, and fade-resistant. 
                  Our stickers can last for years outdoors without losing their vibrant colors or adhesive strength.
                  Visit our <a href="/materials" className="text-istickers-orange hover:underline">Materials page</a> for more detailed information.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg">How long does shipping take?</AccordionTrigger>
                <AccordionContent>
                  Shipping times depend on your location and selected shipping method. Standard shipping typically takes 3-5 
                  business days within the US. Express shipping options are available for faster delivery. 
                  International shipping may take 7-14 business days depending on customs processing.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg">Can I cancel or modify my order?</AccordionTrigger>
                <AccordionContent>
                  Orders can be modified or canceled within 2 hours of placing them. After this window, 
                  we begin processing orders immediately and cannot guarantee cancellation. Please contact 
                  our customer service team as soon as possible if you need to make changes.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg">Do you offer custom sizes or shapes?</AccordionTrigger>
                <AccordionContent>
                  Yes! We can create stickers in custom sizes and shapes based on your design. 
                  Visit our Design Studio page to create your custom sticker, or contact our 
                  support team for special requests that aren't available through our online tool.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg">What is your return policy?</AccordionTrigger>
                <AccordionContent>
                  We accept returns within 30 days of delivery if you're not satisfied with your purchase. 
                  Custom-designed stickers can only be returned if there is a manufacturing defect. 
                  Please see our <a href="/returns" className="text-blue-600 hover:underline">Returns page</a> for complete details.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-lg">How can I track my order?</AccordionTrigger>
                <AccordionContent>
                  Once your order ships, you'll receive a confirmation email with a tracking number. 
                  You can also visit our <a href="/tracking" className="text-blue-600 hover:underline">Order Tracking page</a> and 
                  enter your order number to check the status of your shipment.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-lg">Do you offer bulk discounts?</AccordionTrigger>
                <AccordionContent>
                  Yes, we offer tiered pricing for bulk orders. The more stickers you order, the lower 
                  the per-unit cost. For very large orders, please contact us directly for a custom quote.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-8">
                <AccordionTrigger className="text-lg">How do I care for my stickers?</AccordionTrigger>
                <AccordionContent>
                  Our vinyl stickers are waterproof and UV-resistant, making them suitable for outdoor use. 
                  To maximize longevity, apply to clean, dry surfaces and avoid placing on textured or silicone surfaces. 
                  Stickers can be wiped clean with mild soap and water.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Section>
      </Layout>
    </>
  );
};

export default FAQ;
