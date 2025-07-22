
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Mail, Phone, MapPin, Package, Calendar } from "lucide-react";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onDownloadArtwork: (artworkUrl: string, orderNumber: string) => void;
}

const OrderDetailModal = ({ isOpen, onClose, order, onDownloadArtwork }: OrderDetailModalProps) => {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'in_production': return 'bg-purple-500';
      case 'shipped': return 'bg-green-500';
      case 'delivered': return 'bg-gray-500';
      case 'inquiry': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Order Details - #{order.order_number}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Status and Basic Info */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className={getStatusColor(order.status)}>
                {order.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <div className="text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {new Date(order.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">${order.total_amount}</div>
              <div className="text-sm text-gray-600">Total Amount</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Customer Information
              </h3>
              <div className="bg-white border rounded-lg p-4 space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{order.customer_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{order.customer_email}</p>
                </div>
                {order.delivery_address && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Info</label>
                    <p className="text-gray-900 text-sm">{order.delivery_address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Delivery Information
              </h3>
              <div className="bg-white border rounded-lg p-4 space-y-3">
                {order.delivery_city || order.delivery_state || order.delivery_postal_code ? (
                  <>
                    {order.delivery_city && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">City</label>
                        <p className="text-gray-900">{order.delivery_city}</p>
                      </div>
                    )}
                    {order.delivery_state && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">State</label>
                        <p className="text-gray-900">{order.delivery_state}</p>
                      </div>
                    )}
                    {order.delivery_postal_code && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">ZIP Code</label>
                        <p className="text-gray-900">{order.delivery_postal_code}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-500">Country</label>
                      <p className="text-gray-900">{order.delivery_country || 'United States'}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 italic">No delivery address provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Product Details
            </h3>
            <div className="bg-white border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Product Name</label>
                  <p className="text-gray-900 font-medium">{order.products?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Size</label>
                  <p className="text-gray-900">
                    {order.product_sizes?.size_name || 'N/A'}
                    {order.product_sizes?.width && order.product_sizes?.height && 
                      ` (${order.product_sizes.width}"×${order.product_sizes.height}")`
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Quantity</label>
                  <p className="text-gray-900 font-medium">{order.quantity?.toLocaleString()} units</p>
                </div>
                {order.custom_width && order.custom_height && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Custom Dimensions</label>
                    <p className="text-gray-900">{order.custom_width}"×{order.custom_height}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Artwork Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Artwork</h3>
            <div className="bg-white border rounded-lg p-4">
              {order.artwork_url ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={order.artwork_url} 
                        alt="Order artwork" 
                        className="w-32 h-32 object-cover rounded-lg border bg-gray-50"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm text-gray-600">Artwork uploaded by customer</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDownloadArtwork(order.artwork_url, order.order_number)}
                        className="flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Original</span>
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <img 
                      src={order.artwork_url} 
                      alt="Order artwork full size" 
                      className="max-w-full max-h-96 object-contain rounded-lg border mx-auto"
                    />
                  </div>
                </div>
              ) : order.artwork_via_email ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Customer will send artwork via email</p>
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-gray-500">No artwork provided</p>
                </div>
              )}
            </div>
          </div>

          {/* Tracking Information */}
          {order.tracking_number && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tracking Information</h3>
              <div className="bg-white border rounded-lg p-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tracking Number</label>
                  <p className="text-gray-900 font-mono">{order.tracking_number}</p>
                </div>
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {order.delivery_state && order.status === 'inquiry' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <div className="bg-white border rounded-lg p-4">
                <p className="text-gray-900">{order.delivery_state}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
