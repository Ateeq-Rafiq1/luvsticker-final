
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
import { X } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

interface ProductFormData {
  name: string;
  description: string;
  base_price: number;
  is_active: boolean;
  feature_image_url: string;
}

interface ProductSize {
  size_name: string;
  width: number | null;
  height: number | null;
  price_per_unit: number;
  is_custom: boolean;
}

interface ProductFormProps {
  onClose: () => void;
  product?: any;
}

const ProductForm = ({ onClose, product }: ProductFormProps) => {
  const queryClient = useQueryClient();
  const [sizes, setSizes] = useState<ProductSize[]>(
    product?.product_sizes || [{ size_name: "", width: null, height: null, price_per_unit: 0, is_custom: false }]
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
          ...size,
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
      
      // Delete existing sizes and insert new ones
      await supabase
        .from('product_sizes')
        .delete()
        .eq('product_id', product.id);
      
      if (sizes.length > 0) {
        const sizesWithProductId = sizes.map(size => ({
          ...size,
          product_id: product.id
        }));
        
        const { error: sizesError } = await supabase
          .from('product_sizes')
          .insert(sizesWithProductId);
        
        if (sizesError) throw sizesError;
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
    setSizes([...sizes, { size_name: "", width: null, height: null, price_per_unit: 0, is_custom: false }]);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
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
                      <h4 className="font-medium">Size {index + 1}</h4>
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
