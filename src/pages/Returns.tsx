
import React from "react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const Returns = () => {
  return (
    <>
      <Helmet>
        <title>Returns Policy | Luvstickers</title>
      </Helmet>
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-3xl font-bold text-center mb-10">Returns Policy</h1>
          
          <div className="max-w-3xl mx-auto">
            <section className="mb-8">
              <p className="text-lg text-center mb-8">
                We want you to be completely satisfied with your purchase. If you're not, 
                we're here to help.
              </p>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-2">30-Day Return Policy</h2>
                <p>
                  We offer a 30-day return policy for most products. If you're not completely 
                  satisfied with your purchase, you can return it within 30 days of delivery for 
                  a full refund of the product price.
                </p>
                <div className="mt-4">
                  <Button asChild>
                    <a href="/contact">Contact Support</a>
                  </Button>
                </div>
              </div>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Return Process</h2>
              <ol className="space-y-4 list-decimal list-inside">
                <li className="pl-2">
                  <span className="font-medium">Contact our customer service team</span>
                  <p className="ml-6 text-gray-600">
                    Email us at returns@Luvstickers.com or use our contact form to request a return.
                    Please include your order number and reason for return.
                  </p>
                </li>
                <li className="pl-2">
                  <span className="font-medium">Receive return authorization</span>
                  <p className="ml-6 text-gray-600">
                    We'll review your request and send you return instructions along with a return 
                    authorization number within 1-2 business days.
                  </p>
                </li>
                <li className="pl-2">
                  <span className="font-medium">Package your return</span>
                  <p className="ml-6 text-gray-600">
                    Carefully package the unused items in their original packaging if possible.
                    Include your return authorization number inside the package.
                  </p>
                </li>
                <li className="pl-2">
                  <span className="font-medium">Ship your return</span>
                  <p className="ml-6 text-gray-600">
                    Send your package to our returns department using a tracked shipping method.
                    Return shipping costs are the responsibility of the customer unless the return
                    is due to our error.
                  </p>
                </li>
                <li className="pl-2">
                  <span className="font-medium">Refund processing</span>
                  <p className="ml-6 text-gray-600">
                    Once we receive and inspect your return, we'll process your refund within 
                    5-7 business days. Refunds will be issued to the original payment method.
                  </p>
                </li>
              </ol>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Return Conditions & Exceptions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Custom-Designed Products</AccordionTrigger>
                  <AccordionContent>
                    Custom-designed stickers and products created to your specifications can only 
                    be returned if there is a manufacturing defect. Design errors, spelling mistakes, 
                    or color variations that match the digital proof sent to you prior to production 
                    are not eligible for returns.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Product Condition Requirements</AccordionTrigger>
                  <AccordionContent>
                    All returned items must be unused and in their original condition. Stickers that 
                    have been applied or partially applied cannot be returned. Products must be returned 
                    with all original packaging and accessories.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Sale & Clearance Items</AccordionTrigger>
                  <AccordionContent>
                    Items purchased on clearance or marked as final sale are not eligible for returns 
                    unless they arrive damaged or defective.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>Defective or Damaged Products</AccordionTrigger>
                  <AccordionContent>
                    If you receive damaged or defective products, please contact us within 7 days of 
                    receipt. We may request photos of the damaged items and packaging. Shipping costs 
                    for returning defective items will be reimbursed.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>Bulk Orders</AccordionTrigger>
                  <AccordionContent>
                    For bulk orders (over 100 units), special return conditions may apply. Please 
                    contact our customer service team to discuss the specific circumstances of your return.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How long does it take to process my refund?</AccordionTrigger>
                  <AccordionContent>
                    Once we receive your return, we'll inspect the items and process your refund within 
                    5-7 business days. After processing, it may take an additional 3-5 business days for 
                    the refund to appear in your account, depending on your payment provider.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I exchange an item instead of returning it?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we offer exchanges for items of equal or greater value. If the exchange item costs 
                    more, you'll need to pay the difference. Contact our support team to arrange an exchange.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Do I have to pay for return shipping?</AccordionTrigger>
                  <AccordionContent>
                    Customers are responsible for return shipping costs unless the return is due to our error 
                    (such as sending the wrong item or a defective product). We recommend using a tracked 
                    shipping method for all returns.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>What if I received the wrong item?</AccordionTrigger>
                  <AccordionContent>
                    If you received an incorrect item, please contact us immediately. We'll arrange for the 
                    return of the wrong item and send you the correct one as quickly as possible at no 
                    additional cost to you.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
            
            <div className="mt-10 text-center">
              <p className="mb-4">
                Have questions about our return policy or need to start a return?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild variant="default">
                  <a href="/contact">Contact Support</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/faq">View FAQ</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Returns;
