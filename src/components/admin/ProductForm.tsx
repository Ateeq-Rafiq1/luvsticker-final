
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ProductSize {
  id?: string;
  size_name: string;
  width?: number;
  height?: number;
  price_per_unit: number;
  is_custom: boolean;
  display_order: number;
  tempId?: string;
}

interface ProductImage {
  id?: string;
  image_url: string;
  alt_text: string;
  image_type: 'feature' | 'gallery';
  display_order: number;
  tempId?: string;
  file?: File;
}

interface ProductFormProps {
  product?: any;
  onClose: () => void;
}

const ProductForm = ({ product, onClose }: ProductFormProps) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [featureImageUrl, setFeatureImageUrl] = useState(product?.feature_image_url || "");
  const [sizes, setSizes] = useState<ProductSize[]>(
    product?.product_sizes?.map((size: any, index: number) => ({
      ...size,
      display_order: size.display_order || index,
      tempId: `existing-${size.id}`
    })) || []
  );
  const [images, setImages] = useState<ProductImage[]>(
    product?.product_images?.map((img: any, index: number) => ({
      ...img,
      display_order: img.display_order || index,
      tempId: `existing-${img.id}`
    })) || []
  );

  const addSize = () => {
    const newSize: ProductSize = {
      size_name: "",
      price_per_unit: 0,
      is_custom: false,
      display_order: sizes.length,
      tempId: `temp-${Date.now()}-${Math.random()}`
    };
    setSizes([...sizes, newSize]);
  };

  const removeSize = (index: number) => {
    const updatedSizes = sizes.filter((_, i) => i !== index);
    const reorderedSizes = updatedSizes.map((size, i) => ({ 
      ...size, 
      display_order: i 
    }));
    setSizes(reorderedSizes);
  };

  const updateSize = (index: number, field: keyof ProductSize, value: any) => {
    const updatedSizes = sizes.map((size, i) => {
      if (i === index) {
        return { ...size, [field]: value };
      }
      return size;
    });
    setSizes(updatedSizes);
  };

  const addImage = () => {
    const newImage: ProductImage = {
      image_url: "",
      alt_text: "",
      image_type: 'gallery',
      display_order: images.length,
      tempId: `temp-${Date.now()}-${Math.random()}`
    };
    setImages([...images, newImage]);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const reorderedImages = updatedImages.map((img, i) => ({ 
      ...img, 
      display_order: i 
    }));
    setImages(reorderedImages);
  };

  const updateImage = (index: number, field: keyof ProductImage, value: any) => {
    const updatedImages = images.map((img, i) => {
      if (i === index) {
        return { ...img, [field]: value };
      }
      return img;
    });
    setImages(updatedImages);
  };

  const handleImageUpload = async (index: number, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      
      updateImage(index, 'image_url', data.publicUrl);
      updateImage(index, 'file', undefined);
      
      toast({
        title: "Image uploaded successfully"
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error uploading image",
        variant: "destructive"
      });
    }
  };

  const saveProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      if (product?.id) {
        // Update existing product
        const { error: productError } = await supabase
          .from('products')
          .update({
            name: productData.name,
            description: productData.description,
            is_active: productData.is_active,
            feature_image_url: productData.feature_image_url
          })
          .eq('id', product.id);

        if (productError) throw productError;

        // Handle sizes
        const existingSizes = sizes.filter(s => s.id);
        const newSizes = sizes.filter(s => !s.id);

        // Update existing sizes
        for (const size of existingSizes) {
          const { error } = await supabase
            .from('product_sizes')
            .update({
              size_name: size.size_name,
              width: size.width,
              height: size.height,
              price_per_unit: size.price_per_unit,
              is_custom: size.is_custom,
              display_order: size.display_order
            })
            .eq('id', size.id);
          
          if (error) throw error;
        }

        // Insert new sizes
        if (newSizes.length > 0) {
          const { error } = await supabase
            .from('product_sizes')
            .insert(newSizes.map(size => ({
              product_id: product.id,
              size_name: size.size_name,
              width: size.width,
              height: size.height,
              price_per_unit: size.price_per_unit,
              is_custom: size.is_custom,
              display_order: size.display_order
            })));
          
          if (error) throw error;
        }

        // Handle images similarly
        const existingImages = images.filter(img => img.id);
        const newImages = images.filter(img => !img.id);

        // Update existing images
        for (const image of existingImages) {
          const { error } = await supabase
            .from('product_images')
            .update({
              image_url: image.image_url,
              alt_text: image.alt_text,
              image_type: image.image_type,
              display_order: image.display_order
            })
            .eq('id', image.id);
          
          if (error) throw error;
        }

        // Insert new images
        if (newImages.length > 0) {
          const { error } = await supabase
            .from('product_images')
            .insert(newImages.map(img => ({
              product_id: product.id,
              image_url: img.image_url,
              alt_text: img.alt_text,
              image_type: img.image_type,
              display_order: img.display_order
            })));
          
          if (error) throw error;
        }

        return product.id;
      } else {
        // Create new product
        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert({
            name: productData.name,
            description: productData.description,
            is_active: productData.is_active,
            feature_image_url: productData.feature_image_url
          })
          .select()
          .single();

        if (productError) throw productError;

        // Insert sizes
        if (sizes.length > 0) {
          const { error } = await supabase
            .from('product_sizes')
            .insert(sizes.map(size => ({
              product_id: newProduct.id,
              size_name: size.size_name,
              width: size.width,
              height: size.height,
              price_per_unit: size.price_per_unit,
              is_custom: size.is_custom,
              display_order: size.display_order
            })));
          
          if (error) throw error;
        }

        // Insert images
        if (images.length > 0) {
          const { error } = await supabase
            .from('product_images')
            .insert(images.map(img => ({
              product_id: newProduct.id,
              image_url: img.image_url,
              alt_text: img.alt_text,
              image_type: img.image_type,
              display_order: img.display_order
            })));
          
          if (error) throw error;
        }

        return newProduct.id;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({
        title: product?.id ? "Product updated successfully" : "Product created successfully"
      });
      onClose();
    },
    onError: (error) => {
      console.error('Error saving product:', error);
      toast({
        title: "Error saving product",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Product name is required",
        variant: "destructive"
      });
      return;
    }

    if (sizes.length === 0) {
      toast({
        title: "At least one size is required",
        variant: "destructive"
      });
      return;
    }

    // Validate sizes
    for (const size of sizes) {
      if (!size.size_name.trim()) {
        toast({
          title: "All sizes must have a name",
          variant: "destructive"
        });
        return;
      }
      if (size.price_per_unit <= 0) {
        toast({
          title: "All sizes must have a valid price",
          variant: "destructive"
        });
        return;
      }
    }

    saveProductMutation.mutate({
      name,
      description,
      is_active: isActive,
      feature_image_url: featureImageUrl
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Basic Product Information */}
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Product Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter detailed product description"
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="feature-image">Feature Image URL</Label>
            <Input
              id="feature-image"
              value={featureImageUrl}
              onChange={(e) => setFeatureImageUrl(e.target.value)}
              placeholder="Enter feature image URL"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="is-active">Product is active</Label>
          </div>
        </CardContent>
      </Card>

      {/* Product Sizes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Product Sizes</CardTitle>
            <Button type="button" onClick={addSize} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Size
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sizes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No sizes added yet</p>
          ) : (
            <div className="space-y-4">
              {sizes.map((size, index) => (
                <div key={size.tempId || size.id} className="border p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Size {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSize(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label>Size Name *</Label>
                      <Input
                        value={size.size_name}
                        onChange={(e) => updateSize(index, 'size_name', e.target.value)}
                        placeholder="e.g., Small, Large"
                      />
                    </div>
                    
                    <div>
                      <Label>Width (inches)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={size.width || ''}
                        onChange={(e) => updateSize(index, 'width', parseFloat(e.target.value) || null)}
                        placeholder="Width"
                      />
                    </div>
                    
                    <div>
                      <Label>Height (inches)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={size.height || ''}
                        onChange={(e) => updateSize(index, 'height', parseFloat(e.target.value) || null)}
                        placeholder="Height"
                      />
                    </div>
                    
                    <div>
                      <Label>Price per Unit *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={size.price_per_unit}
                        onChange={(e) => updateSize(index, 'price_per_unit', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center space-x-2">
                    <Switch
                      checked={size.is_custom}
                      onCheckedChange={(checked) => updateSize(index, 'is_custom', checked)}
                    />
                    <Label>Allow custom dimensions</Label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Images */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Product Images</CardTitle>
            <Button type="button" onClick={addImage} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No images added yet</p>
          ) : (
            <div className="space-y-4">
              {images.map((image, index) => (
                <div key={image.tempId || image.id} className="border p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Image {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Image URL</Label>
                      <Input
                        value={image.image_url}
                        onChange={(e) => updateImage(index, 'image_url', e.target.value)}
                        placeholder="Enter image URL"
                      />
                    </div>
                    
                    <div>
                      <Label>Alt Text</Label>
                      <Input
                        value={image.alt_text}
                        onChange={(e) => updateImage(index, 'alt_text', e.target.value)}
                        placeholder="Image description"
                      />
                    </div>
                    
                    <div>
                      <Label>Image Type</Label>
                      <select
                        value={image.image_type}
                        onChange={(e) => updateImage(index, 'image_type', e.target.value)}
                        className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md"
                      >
                        <option value="gallery">Gallery</option>
                        <option value="feature">Feature</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label>Upload Image File</Label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateImage(index, 'file', file);
                          handleImageUpload(index, file);
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={saveProductMutation.isPending}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {saveProductMutation.isPending ? "Saving..." : (product?.id ? "Update Product" : "Create Product")}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
