
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productData: {
    productId: string;
    productName: string;
    sizeId: string;
    sizeName: string;
    quantity: number;
    customWidth?: number;
    customHeight?: number;
    artworkFile?: File;
    artworkViaEmail?: boolean;
  };
}

const InquiryModal = ({ isOpen, onClose, productData }: InquiryModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    zipCode: "",
    additionalInfo: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Generate unique order number for inquiry
      const orderNumber = `INQ-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // Upload artwork if exists
      let artworkUrl = null;
      if (productData.artworkFile) {
        const fileExt = productData.artworkFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('artwork-uploads')
          .upload(fileName, productData.artworkFile);

        if (uploadError) {
          console.error('Error uploading artwork:', uploadError);
        } else {
          const { data } = supabase.storage.from('artwork-uploads').getPublicUrl(fileName);
          artworkUrl = data.publicUrl;
        }
      }
      
      // Create inquiry in orders table
      const { error } = await supabase
        .from('orders')
        .insert({
          customer_email: formData.email,
          customer_name: formData.name,
          delivery_address: `Phone: ${formData.phone}${formData.city ? `, City: ${formData.city}` : ''}${formData.zipCode ? `, ZIP: ${formData.zipCode}` : ''}`,
          delivery_city: formData.city || '',
          delivery_postal_code: formData.zipCode || '',
          product_id: productData.productId,
          size_id: productData.sizeId,
          quantity: productData.quantity,
          custom_width: productData.customWidth,
          custom_height: productData.customHeight,
          total_amount: 0, // No pricing for inquiries
          artwork_url: artworkUrl,
          artwork_via_email: productData.artworkViaEmail || false,
          status: 'inquiry',
          order_number: orderNumber,
          delivery_state: formData.additionalInfo // Store additional info in state field
        });

      if (error) throw error;

      toast({
        title: "Inquiry Submitted Successfully!",
        description: "We'll contact you soon with a custom quote."
      });

      // Clear form and close modal
      setFormData({
        name: "",
        email: "",
        phone: "",
        city: "",
        zipCode: "",
        additionalInfo: ""
      });
      onClose();

    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast({
        title: "Error submitting inquiry",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-orange-600">
            Request Quote for {productData.productName}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-sm">Your Selection:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Product: {productData.productName}</div>
              <div>Size: {productData.sizeName}</div>
              <div>Quantity: {productData.quantity.toLocaleString()} units</div>
              {productData.customWidth && productData.customHeight && (
                <div>Custom Size: {productData.customWidth}" × {productData.customHeight}"</div>
              )}
              <div>Artwork: {productData.artworkViaEmail ? "Will be sent via email" : (productData.artworkFile?.name || "Not uploaded")}</div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="City"
                />
              </div>
              
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="ZIP Code"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                placeholder="Any specific requirements, timeline, or questions..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InquiryModal;
