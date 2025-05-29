
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Package, User, Settings, LogIn } from 'lucide-react';

import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

// Profile form schema
const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// Mock orders for demonstration
const mockOrders = [
  {
    id: 'ORD-1234567',
    date: '2025-05-10',
    total: 49.99,
    status: 'Delivered',
    items: [
      { name: 'Die Cut Stickers', quantity: 50 }
    ]
  },
  {
    id: 'ORD-7654321',
    date: '2025-05-05',
    total: 29.99,
    status: 'Processing',
    items: [
      { name: 'Circle Stickers', quantity: 25 }
    ]
  }
];

const Account = () => {
  const { user, updateProfile, logout, isLoading, isAuthenticated } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '',
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setIsUpdating(true);
    await updateProfile({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
    });
    setIsUpdating(false);
  };

  if (!isAuthenticated && !isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="rounded-full bg-gray-100 p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <LogIn className="h-8 w-8 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in or create an account to view your profile and orders
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-istickers-purple"></div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Account - Luvstickers</title>
        <meta name="description" content="Manage your iStickers account, view orders and update profile information" />
      </Helmet>

      <Layout>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-6">My Account</h1>

          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" /> Orders
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>My Orders</CardTitle>
                  <CardDescription>View and track your order history</CardDescription>
                </CardHeader>
                <CardContent>
                  {mockOrders.length > 0 ? (
                    <div className="space-y-6">
                      {mockOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-6">
                          <div className="flex flex-wrap justify-between items-start mb-4">
                            <div>
                              <h3 className="font-medium">Order {order.id}</h3>
                              <p className="text-sm text-gray-500">Placed on {order.date}</p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status}
                              </span>
                              <p className="mt-1 font-medium">${order.total.toFixed(2)}</p>
                            </div>
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Items</h4>
                            <ul className="space-y-2">
                              {order.items.map((item, idx) => (
                                <li key={idx} className="flex justify-between">
                                  <span>{item.name} × {item.quantity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                            <Button variant="outline" asChild size="sm">
                              <Link to={`/tracking?id=${order.id}`}>Track Order</Link>
                            </Button>
                            <Button variant="outline" size="sm">View Details</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="rounded-full bg-gray-100 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Package className="h-6 w-6 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                      <p className="text-gray-500 mb-4">Once you place an order, it will appear here</p>
                      <Button asChild>
                        <Link to="/catalog">Start Shopping</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>My Profile</CardTitle>
                  <CardDescription>Manage your account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} disabled />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number (Optional)</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Email Preferences</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="orderUpdates" className="mr-2" />
                        <label htmlFor="orderUpdates">Order updates</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="promotions" className="mr-2" />
                        <label htmlFor="promotions">Promotions and special offers</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="newsletter" className="mr-2" />
                        <label htmlFor="newsletter">Newsletter</label>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Account Actions</h3>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full sm:w-auto">
                        Change Password
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="w-full sm:w-auto"
                        onClick={logout}
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </>
  );
};

export default Account;
