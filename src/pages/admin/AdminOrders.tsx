
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Package, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select(`
          *,
          products (name),
          product_sizes (size_name, width, height)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`customer_email.ilike.%${searchTerm}%,customer_name.ilike.%${searchTerm}%,order_number.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }
      
      const { data } = await query;
      return data || [];
    }
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({
        title: "Order status updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating order status",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateTrackingNumberMutation = useMutation({
    mutationFn: async ({ orderId, trackingNumber }: { orderId: string; trackingNumber: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ tracking_number: trackingNumber })
        .eq('id', orderId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({
        title: "Tracking number updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating tracking number",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'in_production': return 'bg-purple-500';
      case 'shipped': return 'bg-green-500';
      case 'delivered': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'processing': return 'default';
      case 'in_production': return 'secondary';
      case 'shipped': return 'default';
      case 'delivered': return 'secondary';
      default: return 'secondary';
    }
  };

  const orderStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'in_production', label: 'In Production' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' }
  ];

  const handleTrackingNumberSubmit = (orderId: string, trackingNumber: string) => {
    if (trackingNumber.trim()) {
      updateTrackingNumberMutation.mutate({ orderId, trackingNumber: trackingNumber.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/admin" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
            </div>
            <div className="text-sm text-gray-600">
              {orders?.length || 0} orders
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="search">Search Orders</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search by email, name, or order number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="status-filter">Filter by Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {orderStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : orders?.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No orders found.</p>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm("")}
                className="mt-2"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {orders?.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Customer Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Customer
                      </h4>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{order.customer_name}</p>
                        <p className="text-sm text-gray-600">{order.customer_email}</p>
                      </div>
                    </div>

                    {/* Product Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        Product
                      </h4>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{order.products?.name}</p>
                        <p className="text-sm text-gray-600">
                          Size: {order.product_sizes?.size_name}
                          {order.product_sizes?.width && order.product_sizes?.height && 
                            ` (${order.product_sizes.width}"×${order.product_sizes.height}")`
                          }
                        </p>
                        {order.custom_width && order.custom_height && (
                          <p className="text-sm text-gray-600">
                            Custom: {order.custom_width}"×{order.custom_height}"
                          </p>
                        )}
                        <p className="text-sm text-gray-600">Qty: {order.quantity}</p>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Order Details</h4>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Amount:</span> ${order.total_amount}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Created:</span> {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Updated:</span> {new Date(order.updated_at).toLocaleDateString()}
                        </p>
                        {order.artwork_url && (
                          <p className="text-sm">
                            <span className="font-medium">Artwork:</span>{" "}
                            <a 
                              href={order.artwork_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-orange-600 hover:text-orange-700 underline"
                            >
                              View File
                            </a>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status & Tracking */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Status & Tracking</h4>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs">Update Status</Label>
                          <Select 
                            value={order.status} 
                            onValueChange={(status) => updateOrderStatusMutation.mutate({ orderId: order.id, status })}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {orderStatuses.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-xs">Tracking Number</Label>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Enter tracking number"
                              defaultValue={order.tracking_number || ""}
                              onBlur={(e) => {
                                if (e.target.value !== (order.tracking_number || "")) {
                                  handleTrackingNumberSubmit(order.id, e.target.value);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleTrackingNumberSubmit(order.id, e.currentTarget.value);
                                }
                              }}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
