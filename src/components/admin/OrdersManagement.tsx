
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Truck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export const OrdersManagement = () => {
  const [orders, setOrders] = useState([

    {
      id: "ORD-2024-005",
      customer: "Charlie Brown",
      email: "charlie.brown@example.com",
      date: "2024-05-10",
      total: 45.00,
      status: "cancelled",
      items: [
        { id: 9, name: "Custom Shape Stickers", price: 15.00, quantity: 3 },
      ],
      shippingAddress: {
        street: "202 Elm St",
        city: "Anycity",
        state: "FL",
        zip: "34567",
        country: "USA",
      },
      trackingInfo: {
        carrier: "",
        trackingNumber: "",
        estimatedDelivery: "",
        updates: [
          {
            date: "2024-05-10",
            time: "16:45",
            status: "Order cancelled by customer",
            location: "System",
          },
        ],
      },
    },
  ]);

  const [isViewOrderDialogOpen, setIsViewOrderDialogOpen] = useState(false);
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const statusColors: Record<string, string> = {
    pending: "bg-orange-100 text-orange-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    return (
      <span
        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus };
        
        // Add tracking update if status changed to shipped
        if (newStatus === "shipped" && order.status !== "shipped") {
          const now = new Date();
          const date = now.toISOString().split("T")[0];
          const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
          
          updatedOrder.trackingInfo.updates = [
            ...updatedOrder.trackingInfo.updates,
            {
              date,
              time,
              status: "Order shipped",
              location: "Warehouse",
            },
          ];
          
          updatedOrder.trackingInfo.carrier = "USPS";
          updatedOrder.trackingInfo.trackingNumber = "9400" + Math.floor(Math.random() * 10000000000000).toString();
          updatedOrder.trackingInfo.estimatedDelivery = new Date(
            now.getTime() + 7 * 24 * 60 * 60 * 1000
          ).toISOString().split("T")[0];
        }
        
        return updatedOrder;
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
    if (currentOrder && currentOrder.id === orderId) {
      const updatedOrder = updatedOrders.find((o) => o.id === orderId);
      setCurrentOrder(updatedOrder);
    }
    
    toast({
      title: "Order status updated",
      description: `Order ${orderId} status changed to ${newStatus}.`,
    });
  };

  const addTrackingUpdate = (orderId: string, update: any) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          trackingInfo: {
            ...order.trackingInfo,
            updates: [...order.trackingInfo.updates, update],
          },
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
    if (currentOrder && currentOrder.id === orderId) {
      const updatedOrder = updatedOrders.find((o) => o.id === orderId);
      setCurrentOrder(updatedOrder);
    }
    
    toast({
      title: "Tracking update added",
      description: `New tracking update added for order ${orderId}.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Orders Management</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input 
            type="search" 
            placeholder="Search by order ID or customer..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" size="icon" onClick={() => {}}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="status-filter">Filter by status:</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger id="status-filter" className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <div>{order.customer}</div>
                    <div className="text-sm text-gray-500">{order.email}</div>
                  </div>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentOrder(order);
                      setIsViewOrderDialogOpen(true);
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" /> Details
                  </Button>
                  {(order.status === "shipped" || order.status === "delivered") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentOrder(order);
                        setIsTrackingDialogOpen(true);
                      }}
                    >
                      <Truck className="mr-2 h-4 w-4" /> Track
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No orders found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isViewOrderDialogOpen} onOpenChange={setIsViewOrderDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {currentOrder && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{currentOrder.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    Placed on {currentOrder.date}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-right">
                    Status: {getStatusBadge(currentOrder.status)}
                  </div>
                  <Select
                    value={currentOrder.status}
                    onValueChange={(value) =>
                      updateOrderStatus(currentOrder.id, value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Name:</span>{" "}
                        {currentOrder.customer}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        {currentOrder.email}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div>{currentOrder.shippingAddress.street}</div>
                      <div>
                        {currentOrder.shippingAddress.city},{" "}
                        {currentOrder.shippingAddress.state}{" "}
                        {currentOrder.shippingAddress.zip}
                      </div>
                      <div>{currentOrder.shippingAddress.country}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentOrder.items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">
                            ${item.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">
                          Total:
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          ${currentOrder.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {currentOrder.status !== "pending" &&
                currentOrder.status !== "cancelled" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tracking Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {currentOrder.status === "processing" ? (
                        <div className="text-center py-4 text-muted-foreground">
                          Tracking information will be available once the order
                          is shipped.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="font-medium">Carrier:</span>{" "}
                              {currentOrder.trackingInfo.carrier}
                            </div>
                            <div>
                              <span className="font-medium">
                                Tracking Number:
                              </span>{" "}
                              {currentOrder.trackingInfo.trackingNumber}
                            </div>
                            {currentOrder.trackingInfo.estimatedDelivery && (
                              <div>
                                <span className="font-medium">
                                  Estimated Delivery:
                                </span>{" "}
                                {currentOrder.trackingInfo.estimatedDelivery}
                              </div>
                            )}
                          </div>
                          {currentOrder.trackingInfo.updates.length > 0 && (
                            <div className="border-t pt-4">
                              <h4 className="font-medium mb-2">
                                Tracking Updates
                              </h4>
                              <div className="space-y-2">
                                {currentOrder.trackingInfo.updates.map(
                                  (update: any, index: number) => (
                                    <div
                                      key={index}
                                      className="flex items-start space-x-4 text-sm"
                                    >
                                      <div className="min-w-[120px]">
                                        {update.date} {update.time}
                                      </div>
                                      <div>
                                        <div className="font-medium">
                                          {update.status}
                                        </div>
                                        <div className="text-muted-foreground">
                                          {update.location}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOrderDialogOpen(false)}>
              Close
            </Button>
            {currentOrder && currentOrder.status === "shipped" && (
              <Button 
                onClick={() => {
                  setIsViewOrderDialogOpen(false);
                  setIsTrackingDialogOpen(true);
                }}
              >
                Manage Tracking
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tracking Management Dialog */}
      <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Tracking Management</DialogTitle>
          </DialogHeader>
          {currentOrder && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-lg">{currentOrder.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentOrder.customer} • {currentOrder.date}
                  </p>
                </div>
                <Badge variant="outline">{currentOrder.status}</Badge>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Tracking Details</CardTitle>
                  <CardDescription>
                    Current shipping information and status updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="block text-sm font-medium mb-1">
                        Carrier
                      </Label>
                      <Input
                        value={currentOrder.trackingInfo.carrier}
                        onChange={(e) => {
                          const updatedOrder = {
                            ...currentOrder,
                            trackingInfo: {
                              ...currentOrder.trackingInfo,
                              carrier: e.target.value,
                            },
                          };
                          setCurrentOrder(updatedOrder);
                        }}
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium mb-1">
                        Tracking Number
                      </Label>
                      <Input
                        value={currentOrder.trackingInfo.trackingNumber}
                        onChange={(e) => {
                          const updatedOrder = {
                            ...currentOrder,
                            trackingInfo: {
                              ...currentOrder.trackingInfo,
                              trackingNumber: e.target.value,
                            },
                          };
                          setCurrentOrder(updatedOrder);
                        }}
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium mb-1">
                        Estimated Delivery
                      </Label>
                      <Input
                        type="date"
                        value={currentOrder.trackingInfo.estimatedDelivery}
                        onChange={(e) => {
                          const updatedOrder = {
                            ...currentOrder,
                            trackingInfo: {
                              ...currentOrder.trackingInfo,
                              estimatedDelivery: e.target.value,
                            },
                          };
                          setCurrentOrder(updatedOrder);
                        }}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      const updatedOrders = orders.map((order) => {
                        if (order.id === currentOrder.id) {
                          return {
                            ...order,
                            trackingInfo: currentOrder.trackingInfo,
                          };
                        }
                        return order;
                      });
                      setOrders(updatedOrders);
                      toast({
                        title: "Tracking details updated",
                        description: "Shipping information has been updated.",
                      });
                    }}
                    className="mb-6"
                  >
                    Save Tracking Details
                  </Button>

                  <Tabs defaultValue="updates">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="updates">Tracking Updates</TabsTrigger>
                      <TabsTrigger value="add">Add Update</TabsTrigger>
                    </TabsList>
                    <TabsContent value="updates" className="space-y-4">
                      {currentOrder.trackingInfo.updates.length > 0 ? (
                        <div className="space-y-4 max-h-[300px] overflow-y-auto p-2">
                          {currentOrder.trackingInfo.updates.map(
                            (update: any, index: number) => (
                              <Card key={index}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-medium">
                                        {update.status}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        {update.location}
                                      </p>
                                    </div>
                                    <div className="text-right text-sm">
                                      <div>{update.date}</div>
                                      <div>{update.time}</div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          No tracking updates available yet
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="add" className="space-y-4">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const newUpdate = {
                            date: formData.get("date") as string,
                            time: formData.get("time") as string,
                            status: formData.get("status") as string,
                            location: formData.get("location") as string,
                          };

                          addTrackingUpdate(currentOrder.id, newUpdate);
                          (e.target as HTMLFormElement).reset();
                        }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="date">Date</Label>
                            <Input
                              id="date"
                              name="date"
                              type="date"
                              defaultValue={new Date()
                                .toISOString()
                                .split("T")[0]}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="time">Time</Label>
                            <Input
                              id="time"
                              name="time"
                              type="time"
                              defaultValue={`${new Date().getHours()}:${String(
                                new Date().getMinutes()
                              ).padStart(2, "0")}`}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" defaultValue="In transit">
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Order received">
                                  Order received
                                </SelectItem>
                                <SelectItem value="Processing">
                                  Processing
                                </SelectItem>
                                <SelectItem value="Order shipped">
                                  Order shipped
                                </SelectItem>
                                <SelectItem value="In transit">
                                  In transit
                                </SelectItem>
                                <SelectItem value="Out for delivery">
                                  Out for delivery
                                </SelectItem>
                                <SelectItem value="Delivered">
                                  Delivered
                                </SelectItem>
                                <SelectItem value="Delayed">Delayed</SelectItem>
                                <SelectItem value="Exception">
                                  Exception
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              name="location"
                              placeholder="e.g. Distribution Center"
                              required
                            />
                          </div>
                        </div>
                        <Button type="submit" className="w-full">
                          Add Tracking Update
                        </Button>
                      </form>

                      {currentOrder.status !== "delivered" && (
                        <div className="pt-4 border-t">
                          <h4 className="font-medium mb-2">Quick Actions</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                const now = new Date();
                                const date = now.toISOString().split("T")[0];
                                const time = `${now.getHours()}:${String(
                                  now.getMinutes()
                                ).padStart(2, "0")}`;

                                const newUpdate = {
                                  date,
                                  time,
                                  status: "Out for delivery",
                                  location: "Local Delivery Facility",
                                };

                                addTrackingUpdate(currentOrder.id, newUpdate);
                              }}
                            >
                              Mark as Out for Delivery
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                const now = new Date();
                                const date = now.toISOString().split("T")[0];
                                const time = `${now.getHours()}:${String(
                                  now.getMinutes()
                                ).padStart(2, "0")}`;

                                const newUpdate = {
                                  date,
                                  time,
                                  status: "Delivered",
                                  location: "Customer Address",
                                };

                                addTrackingUpdate(currentOrder.id, newUpdate);
                                updateOrderStatus(currentOrder.id, "delivered");
                              }}
                            >
                              Mark as Delivered
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTrackingDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
