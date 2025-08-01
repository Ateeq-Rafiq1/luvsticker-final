import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ProductFormModal from "@/components/admin/ProductFormModal";

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      console.log('Fetching products...');
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_sizes (
            *
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      console.log('Products fetched:', data);
      
      // Sort product sizes by display_order
      const productsWithSortedSizes = data?.map(product => ({
        ...product,
        product_sizes: product.product_sizes?.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
      })) || [];
      
      return productsWithSortedSizes;
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({
        title: "Product deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const toggleProductStatus = useMutation({
    mutationFn: async ({ productId, isActive }: { productId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !isActive })
        .eq('id', productId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({
        title: "Product status updated"
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating product status",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product? This will also delete all associated sizes and images.')) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-300 h-64 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
            </div>
            <Button 
              className="bg-orange-600 hover:bg-orange-700"
              onClick={handleAddProduct}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={product.is_active ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => toggleProductStatus.mutate({ 
                          productId: product.id, 
                          isActive: product.is_active 
                        })}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Base Price:</span>
                      <span className="flex items-center">
                        <DollarSign className="w-3 h-3" />
                        {product.base_price}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Sizes Available:</span>
                      <span>{product.product_sizes?.length || 0}</span>
                    </div>
                  </div>

                  {product.product_sizes && product.product_sizes.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Available Sizes:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.product_sizes.slice(0, 3).map((size: any) => (
                          <Badge key={size.id} variant="outline" className="text-xs">
                            {size.size_name} (${size.price_per_unit})
                          </Badge>
                        ))}
                        {product.product_sizes.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{product.product_sizes.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Created: {new Date(product.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={deleteProductMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first product.</p>
            <Button 
              onClick={handleAddProduct}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        )}
      </div>

      <ProductFormModal 
        isOpen={showModal}
        onClose={handleCloseModal}
        product={editingProduct}
      />
    </div>
  );
};

export default AdminProducts;
