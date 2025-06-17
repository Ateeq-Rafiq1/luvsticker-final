import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { X, AlertTriangle } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

interface ProductFormData {
  name: string;
  description: string;
  base_price: number;
  is_active: boolean;
  feature_image_url: string;
}

interface ProductSize {
  id?: string;
  size_name: string;
  width: number | null;
  height: number | null;
  price_per_unit: number;
  is_custom: boolean;
  min_quantity: number;
  max_quantity: number;
  is_active?: boolean;
  has_orders?: boolean;
}

interface ProductFormProps {
  onClose: () => void;
  product?: any;
}

const ProductForm = ({ onClose, product }: ProductFormProps) => {
  const queryClient = useQueryClient();
  const [sizes, setSizes] = useState<ProductSize[]>(
    product?.product_sizes || [{ 
      size_name: "", 
      width: null, 
      height: null, 
      price_per_unit: 0, 
      is_custom: false,
      min_quantity: 1,
      max_quantity: 100,
      is_active: true
    }]
  );
  const [galleryImages, setGalleryImages] = useState<string[]>(
    product?.product_images?.filter((img: any) => img.image_type === 'gallery').map((img: any) => img.image_url) || []
  );

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      base_price: product?.base_price || 0,
      is_active: product?.is_active ?? true,
      feature_image_url: product?.feature_image_url || "",
    }
  });

  // Check which sizes have orders (for edit mode)
  const checkSizeOrders = async (sizeIds: string[]) => {
    if (sizeIds.length === 0) return {};
    
    const { data: ordersWithSizes } = await supabase
      .from('orders')
      .select('size_id')
      .in('size_id', sizeIds);
    
    const sizesWithOrders = new Set(ordersWithSizes?.map(order => order.size_id) || []);
    return Object.fromEntries(sizeIds.map(id => [id, sizesWithOrders.has(id)]));
  };

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      // Insert product
      const { data: productData, error } = await supabase
        .from('products')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      
      // Insert sizes
      if (sizes.length > 0) {
        const sizesWithProductId = sizes.map(size => ({
          size_name: size.size_name,
          width: size.width,
          height: size.height,
          price_per_unit: size.price_per_unit,
          is_custom: size.is_custom,
          min_quantity: size.min_quantity,
          max_quantity: size.max_quantity,
          product_id: productData.id
        }));
        
        const { error: sizesError } = await supabase
          .from('product_sizes')
          .insert(sizesWithProductId);
        
        if (sizesError) throw sizesError;
      }
      
      // Insert gallery images
      if (galleryImages.length > 0) {
        const galleryImagesData = galleryImages.map((url, index) => ({
          product_id: productData.id,
          image_url: url,
          image_type: 'gallery',
          display_order: index
        }));
        
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(galleryImagesData);
        
        if (imagesError) throw imagesError;
      }
      
      return productData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: "Product created successfully" });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error creating product",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      // Update product
      const { error } = await supabase
        .from('products')
        .update(data)
        .eq('id', product.id);
      
      if (error) throw error;
      
      // Get existing sizes
      const { data: existingSizes } = await supabase
        .from('product_sizes')
        .select('id, size_name, width, height, price_per_unit, is_custom, min_quantity, max_quantity')
        .eq('product_id', product.id);
      
      // Check which existing sizes have orders
      const existingSizeIds = existingSizes?.map(size => size.id) || [];
      const sizesWithOrders = await checkSizeOrders(existingSizeIds);
      
      // Categorize sizes
      const sizesToUpdate: any[] = [];
      const sizesToInsert: any[] = [];
      const sizesToDelete: string[] = [];
      
      // Process current form sizes
      sizes.forEach(formSize => {
        if (formSize.id && existingSizes?.find(es => es.id === formSize.id)) {
          // Existing size - update it
          sizesToUpdate.push({
            id: formSize.id,
            size_name: formSize.size_name,
            width: formSize.width,
            height: formSize.height,
            price_per_unit: formSize.price_per_unit,
            is_custom: formSize.is_custom,
            min_quantity: formSize.min_quantity,
            max_quantity: formSize.max_quantity
          });
        } else {
          // New size - insert it
          sizesToInsert.push({
            size_name: formSize.size_name,
            width: formSize.width,
            height: formSize.height,
            price_per_unit: formSize.price_per_unit,
            is_custom: formSize.is_custom,
            min_quantity: formSize.min_quantity,
            max_quantity: formSize.max_quantity,
            product_id: product.id
          });
        }
      });
      
      // Find sizes to delete (existing sizes not in current form)
      const currentSizeIds = sizes.filter(s => s.id).map(s => s.id);
      existingSizes?.forEach(existingSize => {
        if (!currentSizeIds.includes(existingSize.id)) {
          if (!sizesWithOrders[existingSize.id]) {
            sizesToDelete.push(existingSize.id);
          } else {
            // Size has orders, show warning but don't delete
            toast({
              title: "Warning",
              description: `Size "${existingSize.size_name}" has existing orders and cannot be deleted.`,
              variant: "destructive"
            });
          }
        }
      });
      
      // Execute updates
      for (const sizeUpdate of sizesToUpdate) {
        const { error: updateError } = await supabase
          .from('product_sizes')
          .update(sizeUpdate)
          .eq('id', sizeUpdate.id);
        
        if (updateError) throw updateError;
      }
      
      // Execute inserts
      if (sizesToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('product_sizes')
          .insert(sizesToInsert);
        
        if (insertError) throw insertError;
      }
      
      // Execute deletes (only for sizes without orders)
      if (sizesToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('product_sizes')
          .delete()
          .in('id', sizesToDelete);
        
        if (deleteError) throw deleteError;
      }

      // Handle gallery images
      // Delete existing gallery images
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', product.id)
        .eq('image_type', 'gallery');
      
      // Insert new gallery images
      if (galleryImages.length > 0) {
        const galleryImagesData = galleryImages.map((url, index) => ({
          product_id: product.id,
          image_url: url,
          image_type: 'gallery',
          display_order: index
        }));
        
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(galleryImagesData);
        
        if (imagesError) throw imagesError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: "Product updated successfully" });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error updating product",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: ProductFormData) => {
    if (product) {
      updateProductMutation.mutate(data);
    } else {
      createProductMutation.mutate(data);
    }
  };

  const addSize = () => {
    setSizes([...sizes, { 
      size_name: "", 
      width: null, 
      height: null, 
      price_per_unit: 0, 
      is_custom: false,
      min_quantity: 1,
      max_quantity: 100,
      is_active: true
    }]);
  };

  const removeSize = (index: number) => {
    const sizeToRemove = sizes[index];
    
    // If it's an existing size with an ID, we'll handle it in the update mutation
    // For now, just remove it from the form state
    setSizes(sizes.filter((_, i) => i !== index));
    
    // Show warning if removing an existing size
    if (sizeToRemove.id && product) {
      toast({
        title: "Size removed from form",
        description: "The size will be checked for existing orders when you save. If it has orders, it won't be deleted.",
      });
    }
  };

  const updateSize = (index: number, field: keyof ProductSize, value: any) => {
    const updatedSizes = [...sizes];
    updatedSizes[index] = { ...updatedSizes[index], [field]: value };
    setSizes(updatedSizes);
  };

  const handleFeatureImageUploaded = (url: string) => {
    setValue('feature_image_url', url);
  };

  const handleGalleryImageUploaded = (url: string) => {
    setGalleryImages([...galleryImages, url]);
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGalleryImages(galleryImages.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{product ? 'Edit Product' : 'Add Product'}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    className="mt-1"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    className="mt-1"
                    rows={5}
                  />
                </div>

                <div>
                  <Label htmlFor="base_price">Base Price ($)</Label>
                  <Input
                    id="base_price"
                    type="number"
                    step="0.01"
                    {...register("base_price", { 
                      required: "Base price is required",
                      min: { value: 0, message: "Price must be positive" }
                    })}
                    className="mt-1"
                  />
                  {errors.base_price && <p className="text-red-500 text-sm">{errors.base_price.message}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={watch("is_active")}
                    onCheckedChange={(checked) => setValue("is_active", checked)}
                  />
                  <Label htmlFor="is_active">Product is active</Label>
                </div>
              </div>
              
              <div className="space-y-6">
                <ImageUpload
                  bucket="products"
                  path={product ? `${product.id}` : "temp"}
                  label="Feature Image"
                  currentImage={watch("feature_image_url")}
                  onImageUploaded={handleFeatureImageUploaded}
                  onImageRemoved={() => setValue('feature_image_url', '')}
                />
                
                <div>
                  <Label>Gallery Images</Label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {galleryImages.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={imageUrl} 
                          alt={`Gallery ${index + 1}`} 
                          className="h-24 w-full object-cover rounded-md border" 
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                          onClick={() => removeGalleryImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <ImageUpload
                      bucket="products"
                      path={product ? `${product.id}/gallery` : "temp/gallery"}
                      label=""
                      onImageUploaded={handleGalleryImageUploaded}
                      className="h-24 flex items-center justify-center"
                      multiple={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Product Sizes</Label>
                <Button type="button" onClick={addSize} variant="outline" size="sm">
                  Add Size
                </Button>
              </div>
              
              <div className="space-y-4">
                {sizes.map((size, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">Size {index + 1}</h4>
                        {size.id && size.has_orders && (
                          <div className="flex items-center gap-1 text-amber-600 text-xs">
                            <AlertTriangle className="w-3 h-3" />
                            Has orders
                          </div>
                        )}
                      </div>
                      {sizes.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSize(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Size Name</Label>
                        <Input
                          value={size.size_name}
                          onChange={(e) => updateSize(index, 'size_name', e.target.value)}
                          placeholder="e.g., 2x2 inch"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Price per Unit ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={size.price_per_unit}
                          onChange={(e) => updateSize(index, 'price_per_unit', parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Width (inches)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={size.width || ''}
                          onChange={(e) => updateSize(index, 'width', e.target.value ? parseFloat(e.target.value) : null)}
                          disabled={size.is_custom}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Height (inches)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={size.height || ''}
                          onChange={(e) => updateSize(index, 'height', e.target.value ? parseFloat(e.target.value) : null)}
                          disabled={size.is_custom}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Min Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={size.min_quantity}
                          onChange={(e) => updateSize(index, 'min_quantity', parseInt(e.target.value) || 1)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Max Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={size.max_quantity}
                          onChange={(e) => updateSize(index, 'max_quantity', parseInt(e.target.value) || 100)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch
                        checked={size.is_custom}
                        onCheckedChange={(checked) => updateSize(index, 'is_custom', checked)}
                      />
                      <Label>Custom size (user-defined dimensions)</Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createProductMutation.isPending || updateProductMutation.isPending}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {createProductMutation.isPending || updateProductMutation.isPending 
                  ? "Saving..." 
                  : product ? "Update Product" : "Create Product"
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
