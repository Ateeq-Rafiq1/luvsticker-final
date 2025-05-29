
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Trash2, CreditCard, ShoppingCart } from "lucide-react";

// Sample cart items (in a real app, this would come from context or state management)
const initialCartItems = [
  
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  
  // Calculate shipping (simplified)
  const shipping = subtotal > 75 ? 0 : 4.99;
  
  // Calculate total
  const total = subtotal - discount + shipping;

  // Remove item from cart
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  // Update item quantity
  const updateQuantity = (id: number, newQuantity: number) => {
    // Minimum quantity check
    if (newQuantity < 10) {
      toast.error("Minimum quantity is 10");
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "first10") {
      setDiscount(subtotal * 0.1);
      setIsPromoApplied(true);
      toast.success("Promo code applied: 10% off!");
    } else if (promoCode.toLowerCase() === "freeship") {
      setDiscount(shipping);
      setIsPromoApplied(true);
      toast.success("Promo code applied: Free shipping!");
    } else {
      toast.error("Invalid promo code");
    }
  };

  return (
    <>
      <Helmet>
        <title>Shopping Cart - Luvstickers</title>
        <meta name="description" content="View and manage your items in the cart. Review your custom stickers before checkout." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Cart</h1>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    {/* Cart Header */}
                    <div className="hidden md:grid md:grid-cols-12 text-sm font-medium text-gray-500 mb-4">
                      <div className="md:col-span-6">Product</div>
                      <div className="md:col-span-2 text-center">Price</div>
                      <div className="md:col-span-2 text-center">Quantity</div>
                      <div className="md:col-span-2 text-right">Total</div>
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="border-b pb-4">
                          <div className="grid md:grid-cols-12 gap-4 items-center">
                            {/* Product Info */}
                            <div className="md:col-span-6">
                              <div className="flex items-center">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-16 h-16 object-cover rounded mr-4"
                                />
                                <div>
                                  <h3 className="font-medium">{item.name}</h3>
                                  <div className="text-sm text-gray-500 space-y-1">
                                    <p>Material: {item.material}</p>
                                    <p>Shape: {item.shape}</p>
                                    <p>Size: {item.size}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Price */}
                            <div className="md:col-span-2 md:text-center">
                              <div className="flex items-center justify-between md:block">
                                <span className="md:hidden text-sm text-gray-500">Price:</span>
                                <span>${item.price.toFixed(2)}</span>
                              </div>
                            </div>
                            
                            {/* Quantity */}
                            <div className="md:col-span-2 md:text-center">
                              <div className="flex items-center justify-between md:justify-center">
                                <span className="md:hidden text-sm text-gray-500">Quantity:</span>
                                <div className="flex">
                                  <Input 
                                    type="number" 
                                    value={item.quantity} 
                                    min={10}
                                    className="w-16 text-center"
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {/* Total & Remove */}
                            <div className="md:col-span-2 md:text-right">
                              <div className="flex justify-between items-center md:block">
                                <div className="flex md:justify-end">
                                  <span className="md:hidden text-sm text-gray-500">Total:</span>
                                  <span className="md:block font-medium">${item.price.toFixed(2)}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => removeItem(item.id)}
                                  className="text-gray-500 hover:text-red-500"
                                  title="Remove item"
                                >
                                  <Trash2 size={18} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Continue Shopping Button */}
                    <div className="mt-6">
                      <Button variant="outline" asChild>
                        <Link to="/catalog">
                          <ShoppingCart size={16} className="mr-2" />
                          Continue Shopping
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Promo Code */}
                    <div className="mt-6">
                      <label className="block text-sm mb-2">Promo Code</label>
                      <div className="flex gap-2">
                        <Input
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter code"
                          disabled={isPromoApplied}
                        />
                        <Button 
                          variant="outline" 
                          onClick={applyPromoCode}
                          disabled={!promoCode || isPromoApplied}
                        >
                          Apply
                        </Button>
                      </div>
                      {isPromoApplied && (
                        <p className="text-green-600 text-sm mt-1">
                          Promo code applied!
                        </p>
                      )}
                    </div>
                    
                    {/* Checkout Button */}
                    <div className="mt-6">
                      <Button className="w-full" asChild>
                        <Link to="/checkout">
                          <CreditCard size={16} className="mr-2" />
                          Proceed to Checkout
                        </Link>
                      </Button>
                    </div>
                    
                    {/* Secure Checkout Notice */}
                    <div className="mt-4 flex justify-center items-center text-xs text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Secure Checkout
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="flex justify-center mb-6">
                  <ShoppingCart size={64} className="text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">
                  Looks like you haven't added any stickers to your cart yet.
                </p>
                <Button asChild>
                  <Link to="/catalog">
                    Browse Stickers
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Cart;
