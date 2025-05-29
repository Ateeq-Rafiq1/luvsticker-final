
import React from "react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { Truck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ShippingInfo = () => {
  return (
    <>
      <Helmet>
        <title>Shipping Information | Luvstickers</title>
      </Helmet>
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center mb-12">
            <Truck className="w-16 h-16 mx-auto text-istickers-primary mb-4" />
            <h1 className="text-3xl font-bold">Shipping Information</h1>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-12">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Shipping Methods</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipping Method</TableHead>
                      <TableHead>Delivery Time</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Standard Shipping</TableCell>
                      <TableCell>3-5 business days</TableCell>
                      <TableCell className="text-right">$4.99</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Express Shipping</TableCell>
                      <TableCell>1-2 business days</TableCell>
                      <TableCell className="text-right">$9.99</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Next Day Air</TableCell>
                      <TableCell>Next business day</TableCell>
                      <TableCell className="text-right">$19.99</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">International Standard</TableCell>
                      <TableCell>7-14 business days</TableCell>
                      <TableCell className="text-right">$14.99</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                * Free standard shipping on orders over $30 within the continental US.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Processing Times</h2>
              <p className="mb-4">
                Your order will be processed within 1-2 business days. Custom designs or bulk orders may require
                additional processing time. Processing begins once payment is confirmed.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-lg mb-2">Order Timeline:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Order placed and payment confirmed</li>
                  <li>Order processing begins (1-2 business days)</li>
                  <li>Production and quality control (for custom designs)</li>
                  <li>Order ships (you'll receive tracking information)</li>
                  <li>Delivery according to selected shipping method</li>
                </ol>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Tracking Your Order</h2>
              <p className="mb-4">
                Once your order ships, you'll receive a confirmation email with tracking information.
                You can also track your order anytime by visiting our 
                <a href="/tracking" className="text-blue-600 hover:underline mx-1">Order Tracking page</a>
                and entering your order number.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-lg mb-2">Need Help With Tracking?</h3>
                <p>
                  If you haven't received tracking information within 3 business days or have any questions
                  about your shipment, please <a href="/contact" className="text-blue-600 hover:underline">contact our support team</a>.
                </p>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">International Shipping</h2>
              <p className="mb-4">
                We ship to most countries worldwide. International customers are responsible for any customs
                duties, taxes, or fees imposed by their country's regulations. These fees are not included in
                the shipping cost and will be collected by the delivery carrier.
              </p>
              <p>
                International shipping times may vary based on customs processing. Please allow 7-14 business days
                for international deliveries.
              </p>
            </section>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ShippingInfo;
