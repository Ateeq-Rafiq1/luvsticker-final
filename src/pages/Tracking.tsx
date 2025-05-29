import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Truck, Package, Clock, CheckCheck } from "lucide-react";

const trackingSchema = z.object({
  trackingId: z.string().min(1, "Tracking ID is required"),
  email: z.string().email("Please enter a valid email address"),
});

// Mock order data with tracking IDs
const mockOrders = [
  {
    trackingId: "LUV12345678",
    email: "customer@example.com",
    date: "2024-05-08",
    status: "delivered",
    estimatedDelivery: "2024-05-12",
    actualDelivery: "2024-05-10",
    items: [
      { name: "Die Cut Stickers", quantity: 50, price: 24.99 },
      { name: "Circle Stickers", quantity: 25, price: 14.99 },
    ],
    total: 39.98,
    trackingEvents: [
      {
        date: "2024-05-10",
        time: "14:32",
        status: "Delivered",
        location: "Customer's address",
        description: "Package was delivered to recipient",
      },
      {
        date: "2024-05-09",
        time: "09:15",
        status: "Out for delivery",
        location: "Local distribution center",
        description: "Package is out for delivery",
      },
      {
        date: "2024-05-08",
        time: "16:45",
        status: "In transit",
        location: "Regional sorting facility",
        description: "Package has left the regional sorting facility",
      },
      {
        date: "2024-05-07",
        time: "10:22",
        status: "Shipped",
        location: "Shipping facility",
        description: "Package has been shipped",
      },
      {
        date: "2024-05-06",
        time: "15:30",
        status: "Order processed",
        location: "Fulfillment center",
        description: "Your order has been processed and packed",
      },
    ],
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
  },
  {
    trackingId: "LUV87654321",
    email: "customer@example.com",
    date: "2024-05-10",
    status: "in-transit",
    estimatedDelivery: "2024-05-15",
    items: [
      { name: "Square Stickers", quantity: 100, price: 39.99 },
    ],
    total: 39.99,
    trackingEvents: [
      {
        date: "2024-05-12",
        time: "08:45",
        status: "In transit",
        location: "Regional sorting facility",
        description: "Package has left the regional sorting facility",
      },
      {
        date: "2024-05-11",
        time: "16:20",
        status: "Shipped",
        location: "Shipping facility",
        description: "Package has been shipped",
      },
      {
        date: "2024-05-10",
        time: "14:15",
        status: "Order processed",
        location: "Fulfillment center",
        description: "Your order has been processed and packed",
      },
    ],
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
  },
];

const Tracking = () => {
  const [searchParams] = useSearchParams();
  const initialTrackingId = searchParams.get("order") || searchParams.get("tracking") || "";
  const initialEmail = searchParams.get("email") || "";
  const [foundOrder, setFoundOrder] = useState<any>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const form = useForm<z.infer<typeof trackingSchema>>({
    resolver: zodResolver(trackingSchema),
    defaultValues: {
      trackingId: initialTrackingId,
      email: decodeURIComponent(initialEmail),
    },
  });

  const onSubmit = (values: z.infer<typeof trackingSchema>) => {
    const order = mockOrders.find(
      (o) =>
        o.trackingId.toLowerCase() === values.trackingId.toLowerCase() &&
        o.email.toLowerCase() === values.email.toLowerCase()
    );
    
    setFoundOrder(order || null);
    setSearchAttempted(true);
  };

  // Auto-search if both values are provided in URL
  React.useEffect(() => {
    if (initialTrackingId && initialEmail && !searchAttempted) {
      onSubmit({
        trackingId: initialTrackingId,
        email: decodeURIComponent(initialEmail),
      });
    }
  }, [initialTrackingId, initialEmail, searchAttempted]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCheck className="h-8 w-8 text-green-500" />;
      case "out-for-delivery":
        return <Truck className="h-8 w-8 text-blue-500" />;
      case "in-transit":
        return <Truck className="h-8 w-8 text-blue-500" />;
      case "shipped":
        return <Package className="h-8 w-8 text-purple-500" />;
      default:
        return <Clock className="h-8 w-8 text-orange-500" />;
    }
  };

  const getStepClasses = (currentStep: number, stepNumber: number) => {
    const baseClasses = "flex items-center";
    if (stepNumber < currentStep) {
      return `${baseClasses} text-green-600`;
    } else if (stepNumber === currentStep) {
      return `${baseClasses} text-blue-600 font-medium`;
    } else {
      return `${baseClasses} text-gray-400`;
    }
  };

  const getCurrentStep = (status: string) => {
    switch (status) {
      case "delivered":
        return 5;
      case "out-for-delivery":
        return 4;
      case "in-transit":
        return 3;
      case "shipped":
        return 2;
      default:
        return 1;
    }
  };

  return (
    <>
      <Helmet>
        <title>Track Your Order - Luvstickers</title>
      </Helmet>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Track Your Order</h1>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="trackingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tracking ID</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., LUV12345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full md:w-auto">
                  Track Order
                </Button>
              </form>
            </Form>
          </div>

          {searchAttempted && !foundOrder && (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Order Not Found</h2>
              <p className="text-gray-600 mb-4">
                We couldn't find an order with the provided tracking ID and email address. Please check your information and try again.
              </p>
              <p className="text-sm text-gray-500">
                For demo purposes, try tracking ID "LUV12345678" or "LUV87654321" with email "customer@example.com"
              </p>
            </div>
          )}

          {foundOrder && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Tracking ID: {foundOrder.trackingId}</h2>
                <div className="flex items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      foundOrder.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {foundOrder.status.charAt(0).toUpperCase() + foundOrder.status.slice(1).replace("-", " ")}
                  </span>
                </div>
              </div>

              {/* Tracking Progress */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Shipping Status</h3>
                <div className="relative">
                  <div className="flex items-center justify-between mb-8">
                    <div className={getStepClasses(getCurrentStep(foundOrder.status), 1)}>
                      <div className="rounded-full border-2 border-current p-1">
                        <CheckCircle className={`h-5 w-5 ${getCurrentStep(foundOrder.status) >= 1 ? "text-current" : "text-gray-300"}`} />
                      </div>
                      <span className="ml-2 text-sm">Ordered</span>
                    </div>
                    <div className={getStepClasses(getCurrentStep(foundOrder.status), 2)}>
                      <div className="rounded-full border-2 border-current p-1">
                        <Package className={`h-5 w-5 ${getCurrentStep(foundOrder.status) >= 2 ? "text-current" : "text-gray-300"}`} />
                      </div>
                      <span className="ml-2 text-sm">Shipped</span>
                    </div>
                    <div className={getStepClasses(getCurrentStep(foundOrder.status), 3)}>
                      <div className="rounded-full border-2 border-current p-1">
                        <Truck className={`h-5 w-5 ${getCurrentStep(foundOrder.status) >= 3 ? "text-current" : "text-gray-300"}`} />
                      </div>
                      <span className="ml-2 text-sm">In Transit</span>
                    </div>
                    <div className={getStepClasses(getCurrentStep(foundOrder.status), 4)}>
                      <div className="rounded-full border-2 border-current p-1">
                        <Truck className={`h-5 w-5 ${getCurrentStep(foundOrder.status) >= 4 ? "text-current" : "text-gray-300"}`} />
                      </div>
                      <span className="ml-2 text-sm">Out for Delivery</span>
                    </div>
                    <div className={getStepClasses(getCurrentStep(foundOrder.status), 5)}>
                      <div className="rounded-full border-2 border-current p-1">
                        <CheckCheck className={`h-5 w-5 ${getCurrentStep(foundOrder.status) >= 5 ? "text-current" : "text-gray-300"}`} />
                      </div>
                      <span className="ml-2 text-sm">Delivered</span>
                    </div>
                  </div>
                  
                  {/* Progress line */}
                  <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200" style={{ zIndex: -1 }}></div>
                  <div 
                    className="absolute top-5 left-0 h-0.5 bg-green-600" 
                    style={{ 
                      zIndex: -1, 
                      width: `${(getCurrentStep(foundOrder.status) - 1) * 25}%` 
                    }}
                  ></div>
                </div>

                {/* Delivery info */}
                <div className="bg-gray-50 p-4 rounded-md mt-4">
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div className="mb-2 md:mb-0">
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-medium">{foundOrder.date}</p>
                    </div>
                    <div className="mb-2 md:mb-0">
                      <p className="text-sm text-gray-600">Estimated Delivery</p>
                      <p className="font-medium">{foundOrder.estimatedDelivery}</p>
                    </div>
                    {foundOrder.actualDelivery && (
                      <div>
                        <p className="text-sm text-gray-600">Actual Delivery</p>
                        <p className="font-medium">{foundOrder.actualDelivery}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tracking Events */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Tracking History</h3>
                <div className="space-y-4">
                  {foundOrder.trackingEvents.map((event: any, index: number) => (
                    <div key={index} className="relative pl-8 pb-4">
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-0">
                        <div className={`h-4 w-4 rounded-full ${index === 0 ? "bg-green-500" : "bg-gray-200"}`}></div>
                        {index < foundOrder.trackingEvents.length - 1 && (
                          <div className="absolute top-4 bottom-0 left-1.5 w-px bg-gray-200"></div>
                        )}
                      </div>
                      
                      <div className="mb-1">
                        <span className="font-medium">{event.status}</span>
                        <span className="text-gray-500 text-sm ml-2">
                          {event.date} {event.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{event.location}</p>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator className="my-6" />

              {/* Order Details */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Order Details</h3>
                <div className="space-y-2">
                  {foundOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between py-2 border-b">
                      <div>
                        <p>{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 font-medium">
                    <p>Total</p>
                    <p>${foundOrder.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p>{foundOrder.shippingAddress.name}</p>
                  <p>{foundOrder.shippingAddress.street}</p>
                  <p>
                    {foundOrder.shippingAddress.city}, {foundOrder.shippingAddress.state} {foundOrder.shippingAddress.zipCode}
                  </p>
                  <p>{foundOrder.shippingAddress.country}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Tracking;
