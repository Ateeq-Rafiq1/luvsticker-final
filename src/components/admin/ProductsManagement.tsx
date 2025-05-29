
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Eye, Upload, X } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export const ProductsManagement = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Die Cut Stickers",
      price: 3.49,
      stock: 25,
      featuredImage: "/2.png",
      status: "active",
      description: "Custom shapes cut to the outline of your design",
      longDescription: "Our premium die cut stickers are custom-shaped to follow the contours of your design. Made from durable vinyl with a protective coating that makes them waterproof and scratch-resistant.",
      features: [
        "Custom shapes cut to your design",
        "Waterproof and scratch-resistant",
        "Premium vinyl material",
        "Protective coating included"
      ],
      specifications: [
        { name: "Material", value: "Durable vinyl with protective coating" },
        { name: "Waterproof", value: "Yes" },
        { name: "UV Resistant", value: "Yes" },
        { name: "Durability", value: "2-5 years outdoor" }
      ],
      gallery: [
        { image: "/2.png", caption: "Die cut sticker example" },
        { image: "/1.png", caption: "Various shapes available" },
        { image: "/3.png", caption: "High quality finish" }
      ],
      sizes: [
        { name: "Small", dimensions: "2\" x 2\"", priceMultiplier: 0.8 },
        { name: "Medium", dimensions: "3\" x 3\"", priceMultiplier: 1 },
        { name: "Custom", dimensions: "Custom dimensions", priceMultiplier: 1.2 }
      ],
      benefits: [
        { title: "Free Shipping", description: "Get your stickers in just 4 days", icon: "truck" },
        { title: "Online Proof", description: "Review your design before printing", icon: "check-square" },
        { title: "Weatherproof", description: "Durable vinyl that lasts years", icon: "shield" }
      ],
      seo: {
        metaTitle: "Die Cut Stickers - Custom Shapes | Your Brand",
        metaDescription: "Create custom die cut stickers in any shape. Waterproof, durable vinyl with free shipping. Perfect for branding and personal use.",
        keywords: "die cut stickers, custom stickers, waterproof stickers, vinyl stickers",
        slug: "die-cut-stickers"
      },
      videoUrl: "https://www.example.com/videos/die-cut-demo.mp4"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    featuredImage: "",
    status: "draft",
    description: "",
    longDescription: "",
    features: [""],
    specifications: [{ name: "", value: "" }],
    gallery: [{ image: "", caption: "" }],
    sizes: [{ name: "", dimensions: "", priceMultiplier: 1 }],
    benefits: [{ title: "", description: "", icon: "" }],
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      slug: ""
    },
    videoUrl: ""
  });

  const statuses = ["draft", "active", "archived"];

  // Handle search and filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddProduct = () => {
    const price = parseFloat(newProduct.price);
    const stock = parseInt(newProduct.stock);
    
    // Filter out empty arrays and objects
    const features = newProduct.features.filter(feature => feature.trim() !== "");
    const specifications = newProduct.specifications.filter(spec => spec.name.trim() !== "" && spec.value.trim() !== "");
    const gallery = newProduct.gallery.filter(item => item.image.trim() !== "");
    const sizes = newProduct.sizes.filter(size => size.name.trim() !== "" && size.dimensions.trim() !== "");
    const benefits = newProduct.benefits.filter(benefit => benefit.title.trim() !== "" && benefit.description.trim() !== "");
    
    const productToAdd = {
      id: products.length + 1,
      name: newProduct.name,
      price: price,
      stock: stock,
      featuredImage: newProduct.featuredImage || "/placeholder.svg",
      status: newProduct.status,
      description: newProduct.description,
      longDescription: newProduct.longDescription,
      features,
      specifications,
      gallery,
      sizes,
      benefits,
      seo: newProduct.seo,
      videoUrl: newProduct.videoUrl
    };
    
    setProducts([...products, productToAdd]);
    setIsAddDialogOpen(false);
    resetNewProduct();
    
    toast({
      title: "Product added",
      description: `${productToAdd.name} has been added successfully.`,
    });
  };

  const resetNewProduct = () => {
    setNewProduct({
      name: "",
      price: "",
      stock: "",
      featuredImage: "",
      status: "draft",
      description: "",
      longDescription: "",
      features: [""],
      specifications: [{ name: "", value: "" }],
      gallery: [{ image: "", caption: "" }],
      sizes: [{ name: "", dimensions: "", priceMultiplier: 1 }],
      benefits: [{ title: "", description: "", icon: "" }],
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: "",
        slug: ""
      },
      videoUrl: ""
    });
  };

  const handleEditProduct = () => {
    if (!currentProduct) return;
    
    // Filter out empty arrays and objects
    const features = currentProduct.features.filter((feature: string) => feature.trim() !== "");
    const specifications = currentProduct.specifications.filter((spec: any) => 
      spec.name.trim() !== "" && spec.value.trim() !== ""
    );
    const gallery = currentProduct.gallery.filter((item: any) => item.image.trim() !== "");
    const sizes = currentProduct.sizes.filter((size: any) => size.name.trim() !== "" && size.dimensions.trim() !== "");
    const benefits = currentProduct.benefits.filter((benefit: any) => benefit.title.trim() !== "" && benefit.description.trim() !== "");
    
    const updatedProduct = {
      ...currentProduct,
      features,
      specifications,
      gallery,
      sizes,
      benefits
    };
    
    const updatedProducts = products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    
    setProducts(updatedProducts);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Product updated",
      description: `${updatedProduct.name} has been updated successfully.`,
    });
  };

  const handleDeleteProduct = () => {
    if (!currentProduct) return;
    
    const filteredProducts = products.filter((p) => p.id !== currentProduct.id);
    setProducts(filteredProducts);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Product deleted",
      description: `${currentProduct.name} has been deleted.`,
    });
  };

  // Helper functions for managing dynamic arrays
  const addArrayItem = (arrayName: string, defaultItem: any, isNewProduct: boolean) => {
    if (isNewProduct) {
      setNewProduct({
        ...newProduct,
        [arrayName]: [...newProduct[arrayName as keyof typeof newProduct] as any[], defaultItem]
      });
    } else if (currentProduct) {
      setCurrentProduct({
        ...currentProduct,
        [arrayName]: [...currentProduct[arrayName], defaultItem]
      });
    }
  };

  const updateArrayItem = (arrayName: string, index: number, field: string | null, value: any, isNewProduct: boolean) => {
    if (isNewProduct) {
      const updatedArray = [...newProduct[arrayName as keyof typeof newProduct] as any[]];
      if (field) {
        updatedArray[index] = { ...updatedArray[index], [field]: value };
      } else {
        updatedArray[index] = value;
      }
      setNewProduct({
        ...newProduct,
        [arrayName]: updatedArray
      });
    } else if (currentProduct) {
      const updatedArray = [...currentProduct[arrayName]];
      if (field) {
        updatedArray[index] = { ...updatedArray[index], [field]: value };
      } else {
        updatedArray[index] = value;
      }
      setCurrentProduct({
        ...currentProduct,
        [arrayName]: updatedArray
      });
    }
  };

  const removeArrayItem = (arrayName: string, index: number, isNewProduct: boolean) => {
    if (isNewProduct) {
      const updatedArray = (newProduct[arrayName as keyof typeof newProduct] as any[]).filter((_, i) => i !== index);
      setNewProduct({
        ...newProduct,
        [arrayName]: updatedArray.length ? updatedArray : [getDefaultItem(arrayName)]
      });
    } else if (currentProduct) {
      const updatedArray = currentProduct[arrayName].filter((_: any, i: number) => i !== index);
      setCurrentProduct({
        ...currentProduct,
        [arrayName]: updatedArray.length ? updatedArray : [getDefaultItem(arrayName)]
      });
    }
  };

  const getDefaultItem = (arrayName: string) => {
    switch (arrayName) {
      case 'features': return "";
      case 'specifications': return { name: "", value: "" };
      case 'gallery': return { image: "", caption: "" };
      case 'sizes': return { name: "", dimensions: "", priceMultiplier: 1 };
      case 'benefits': return { title: "", description: "", icon: "" };
      default: return {};
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, field: string, isNewProduct: boolean) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a file storage service
      const imageUrl = URL.createObjectURL(file);
      if (isNewProduct) {
        setNewProduct({ ...newProduct, [field]: imageUrl });
      } else if (currentProduct) {
        setCurrentProduct({ ...currentProduct, [field]: imageUrl });
      }
      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Products Catalog</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-2 w-full max-w-sm">
          <Input 
            type="search" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No products found. Try adjusting your search or filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.featuredImage}
                      alt={product.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.status === "active" ? "bg-green-100 text-green-800" :
                      product.status === "draft" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {product.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setCurrentProduct(product);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setCurrentProduct(product);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setCurrentProduct(product);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {currentProduct && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={currentProduct.featuredImage}
                    alt={currentProduct.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">{currentProduct.name}</h2>
                  <p className="text-xl font-bold text-istickers-purple">${currentProduct.price.toFixed(2)}</p>
                  <p className="text-gray-600">{currentProduct.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">Stock: {currentProduct.stock}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      currentProduct.status === "active" ? "bg-green-100 text-green-800" :
                      currentProduct.status === "draft" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {currentProduct.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Product Dialog */}
      {(isAddDialogOpen || isEditDialogOpen) && (
        <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={() => {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          if (isAddDialogOpen) resetNewProduct();
        }}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isAddDialogOpen ? "Add New Product" : "Edit Product"}</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="basic">
              <TabsList className="grid grid-cols-6">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="variants">Variants</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={isAddDialogOpen ? newProduct.name : currentProduct?.name || ""}
                      onChange={(e) => {
                        if (isAddDialogOpen) {
                          setNewProduct({ ...newProduct, name: e.target.value });
                        } else if (currentProduct) {
                          setCurrentProduct({ ...currentProduct, name: e.target.value });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={isAddDialogOpen ? newProduct.price : currentProduct?.price || ""}
                      onChange={(e) => {
                        if (isAddDialogOpen) {
                          setNewProduct({ ...newProduct, price: e.target.value });
                        } else if (currentProduct) {
                          setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={isAddDialogOpen ? newProduct.stock : currentProduct?.stock || ""}
                      onChange={(e) => {
                        if (isAddDialogOpen) {
                          setNewProduct({ ...newProduct, stock: e.target.value });
                        } else if (currentProduct) {
                          setCurrentProduct({ ...currentProduct, stock: parseInt(e.target.value) });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={isAddDialogOpen ? newProduct.status : currentProduct?.status || "draft"}
                      onValueChange={(value) => {
                        if (isAddDialogOpen) {
                          setNewProduct({ ...newProduct, status: value });
                        } else if (currentProduct) {
                          setCurrentProduct({ ...currentProduct, status: value });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>Featured Image</Label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "featuredImage", isAddDialogOpen)}
                      className="hidden"
                      id="featured-image-upload"
                    />
                    <label htmlFor="featured-image-upload">
                      <Button type="button" variant="outline" asChild>
                        <span><Upload className="h-4 w-4 mr-2" />Upload Image</span>
                      </Button>
                    </label>
                    {(isAddDialogOpen ? newProduct.featuredImage : currentProduct?.featuredImage) && (
                      <img 
                        src={isAddDialogOpen ? newProduct.featuredImage : currentProduct?.featuredImage} 
                        alt="Featured" 
                        className="h-16 w-16 object-cover rounded"
                      />
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="content" className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    value={isAddDialogOpen ? newProduct.description : currentProduct?.description || ""}
                    onChange={(e) => {
                      if (isAddDialogOpen) {
                        setNewProduct({ ...newProduct, description: e.target.value });
                      } else if (currentProduct) {
                        setCurrentProduct({ ...currentProduct, description: e.target.value });
                      }
                    }}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="longDescription">Long Description</Label>
                  <Textarea
                    id="longDescription"
                    value={isAddDialogOpen ? newProduct.longDescription : currentProduct?.longDescription || ""}
                    onChange={(e) => {
                      if (isAddDialogOpen) {
                        setNewProduct({ ...newProduct, longDescription: e.target.value });
                      } else if (currentProduct) {
                        setCurrentProduct({ ...currentProduct, longDescription: e.target.value });
                      }
                    }}
                    rows={6}
                  />
                </div>
                <div>
                  <Label htmlFor="videoUrl">Product Video URL</Label>
                  <Input
                    id="videoUrl"
                    value={isAddDialogOpen ? newProduct.videoUrl : currentProduct?.videoUrl || ""}
                    onChange={(e) => {
                      if (isAddDialogOpen) {
                        setNewProduct({ ...newProduct, videoUrl: e.target.value });
                      } else if (currentProduct) {
                        setCurrentProduct({ ...currentProduct, videoUrl: e.target.value });
                      }
                    }}
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-4 pt-4">
                <div>
                  <Label className="text-base font-medium">Product Features</Label>
                  <div className="space-y-2 mt-2">
                    {(isAddDialogOpen ? newProduct.features : currentProduct?.features || [""]).map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={feature}
                          onChange={(e) => updateArrayItem("features", index, null, e.target.value, isAddDialogOpen)}
                          placeholder="Feature description"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayItem("features", index, isAddDialogOpen)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addArrayItem("features", "", isAddDialogOpen)}
                    >
                      <Plus className="h-4 w-4 mr-2" />Add Feature
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Specifications</Label>
                  <div className="space-y-2 mt-2">
                    {(isAddDialogOpen ? newProduct.specifications : currentProduct?.specifications || [{ name: "", value: "" }]).map((spec: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={spec.name}
                          onChange={(e) => updateArrayItem("specifications", index, "name", e.target.value, isAddDialogOpen)}
                          placeholder="Specification name"
                        />
                        <Input
                          value={spec.value}
                          onChange={(e) => updateArrayItem("specifications", index, "value", e.target.value, isAddDialogOpen)}
                          placeholder="Specification value"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayItem("specifications", index, isAddDialogOpen)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addArrayItem("specifications", { name: "", value: "" }, isAddDialogOpen)}
                    >
                      <Plus className="h-4 w-4 mr-2" />Add Specification
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Benefits</Label>
                  <div className="space-y-2 mt-2">
                    {(isAddDialogOpen ? newProduct.benefits : currentProduct?.benefits || [{ title: "", description: "", icon: "" }]).map((benefit: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={benefit.title}
                          onChange={(e) => updateArrayItem("benefits", index, "title", e.target.value, isAddDialogOpen)}
                          placeholder="Benefit title"
                        />
                        <Input
                          value={benefit.description}
                          onChange={(e) => updateArrayItem("benefits", index, "description", e.target.value, isAddDialogOpen)}
                          placeholder="Benefit description"
                        />
                        <Input
                          value={benefit.icon}
                          onChange={(e) => updateArrayItem("benefits", index, "icon", e.target.value, isAddDialogOpen)}
                          placeholder="Icon name"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayItem("benefits", index, isAddDialogOpen)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addArrayItem("benefits", { title: "", description: "", icon: "" }, isAddDialogOpen)}
                    >
                      <Plus className="h-4 w-4 mr-2" />Add Benefit
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4 pt-4">
                <div>
                  <Label className="text-base font-medium">Gallery Images</Label>
                  <div className="space-y-4 mt-2">
                    {(isAddDialogOpen ? newProduct.gallery : currentProduct?.gallery || [{ image: "", caption: "" }]).map((item: any, index: number) => (
                      <div key={index} className="border p-4 rounded-lg">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 space-y-2">
                            <div>
                              <Label>Image</Label>
                              <div className="flex items-center gap-4">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const imageUrl = URL.createObjectURL(file);
                                      updateArrayItem("gallery", index, "image", imageUrl, isAddDialogOpen);
                                    }
                                  }}
                                  className="hidden"
                                  id={`gallery-upload-${index}`}
                                />
                                <label htmlFor={`gallery-upload-${index}`}>
                                  <Button type="button" variant="outline" size="sm" asChild>
                                    <span><Upload className="h-4 w-4 mr-2" />Upload</span>
                                  </Button>
                                </label>
                                {item.image && (
                                  <img src={item.image} alt="Gallery" className="h-16 w-16 object-cover rounded" />
                                )}
                              </div>
                            </div>
                            <div>
                              <Label>Caption</Label>
                              <Input
                                value={item.caption}
                                onChange={(e) => updateArrayItem("gallery", index, "caption", e.target.value, isAddDialogOpen)}
                                placeholder="Image caption"
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeArrayItem("gallery", index, isAddDialogOpen)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addArrayItem("gallery", { image: "", caption: "" }, isAddDialogOpen)}
                    >
                      <Plus className="h-4 w-4 mr-2" />Add Gallery Image
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="variants" className="space-y-4 pt-4">
                <div>
                  <Label className="text-base font-medium">Size Options</Label>
                  <div className="space-y-2 mt-2">
                    {(isAddDialogOpen ? newProduct.sizes : currentProduct?.sizes || [{ name: "", dimensions: "", priceMultiplier: 1 }]).map((size: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={size.name}
                          onChange={(e) => updateArrayItem("sizes", index, "name", e.target.value, isAddDialogOpen)}
                          placeholder="Size name"
                        />
                        <Input
                          value={size.dimensions}
                          onChange={(e) => updateArrayItem("sizes", index, "dimensions", e.target.value, isAddDialogOpen)}
                          placeholder="Dimensions"
                        />
                        <Input
                          type="number"
                          step="0.1"
                          value={size.priceMultiplier}
                          onChange={(e) => updateArrayItem("sizes", index, "priceMultiplier", parseFloat(e.target.value), isAddDialogOpen)}
                          placeholder="Price multiplier"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayItem("sizes", index, isAddDialogOpen)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addArrayItem("sizes", { name: "", dimensions: "", priceMultiplier: 1 }, isAddDialogOpen)}
                    >
                      <Plus className="h-4 w-4 mr-2" />Add Size Option
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={isAddDialogOpen ? newProduct.seo.metaTitle : currentProduct?.seo?.metaTitle || ""}
                    onChange={(e) => {
                      if (isAddDialogOpen) {
                        setNewProduct({
                          ...newProduct,
                          seo: { ...newProduct.seo, metaTitle: e.target.value }
                        });
                      } else if (currentProduct) {
                        setCurrentProduct({
                          ...currentProduct,
                          seo: { ...currentProduct.seo, metaTitle: e.target.value }
                        });
                      }
                    }}
                    placeholder="SEO optimized title"
                  />
                </div>
                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={isAddDialogOpen ? newProduct.seo.metaDescription : currentProduct?.seo?.metaDescription || ""}
                    onChange={(e) => {
                      if (isAddDialogOpen) {
                        setNewProduct({
                          ...newProduct,
                          seo: { ...newProduct.seo, metaDescription: e.target.value }
                        });
                      } else if (currentProduct) {
                        setCurrentProduct({
                          ...currentProduct,
                          seo: { ...currentProduct.seo, metaDescription: e.target.value }
                        });
                      }
                    }}
                    placeholder="SEO meta description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    value={isAddDialogOpen ? newProduct.seo.keywords : currentProduct?.seo?.keywords || ""}
                    onChange={(e) => {
                      if (isAddDialogOpen) {
                        setNewProduct({
                          ...newProduct,
                          seo: { ...newProduct.seo, keywords: e.target.value }
                        });
                      } else if (currentProduct) {
                        setCurrentProduct({
                          ...currentProduct,
                          seo: { ...currentProduct.seo, keywords: e.target.value }
                        });
                      }
                    }}
                    placeholder="Comma separated keywords"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={isAddDialogOpen ? newProduct.seo.slug : currentProduct?.seo?.slug || ""}
                    onChange={(e) => {
                      if (isAddDialogOpen) {
                        setNewProduct({
                          ...newProduct,
                          seo: { ...newProduct.seo, slug: e.target.value }
                        });
                      } else if (currentProduct) {
                        setCurrentProduct({
                          ...currentProduct,
                          seo: { ...currentProduct.seo, slug: e.target.value }
                        });
                      }
                    }}
                    placeholder="product-url-slug"
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
                if (isAddDialogOpen) resetNewProduct();
              }}>
                Cancel
              </Button>
              <Button onClick={isAddDialogOpen ? handleAddProduct : handleEditProduct}>
                {isAddDialogOpen ? "Add Product" : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Product Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          {currentProduct && (
            <div className="py-4">
              <p>
                Are you sure you want to delete "{currentProduct.name}"? This
                action cannot be undone.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
