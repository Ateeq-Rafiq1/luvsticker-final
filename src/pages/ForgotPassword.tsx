
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft } from 'lucide-react';

import Layout from '@/components/layout/Layout';
import Section from '@/components/layout/Section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';

// Form schema
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword, isLoading } = useAuth();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    const success = await resetPassword(values.email);
    if (success) {
      setSubmitted(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - Luvstickers</title>
        <meta name="description" content="Reset your iStickers account password" />
      </Helmet>

      <Layout>
        <Section variant="white">
          <div className="max-w-md mx-auto">
            <Link to="/login" className="flex items-center text-istickers-orange mb-6 hover:underline">
              <ArrowLeft size={16} className="mr-1" /> Back to Login
            </Link>

            {submitted ? (
              <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
                <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
                <p className="text-gray-600 mb-6">
                  We've sent password reset instructions to your email address.
                  Please check your inbox (and spam folder) for further instructions.
                </p>
                <Button asChild>
                  <Link to="/login">Return to Login</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold">Forgot Your Password?</h1>
                  <p className="text-gray-600 mt-2">
                    Enter your email address and we'll send you instructions to reset your password
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                placeholder="you@example.com"
                                type="email"
                                className="pl-10"
                                disabled={isLoading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                    </Button>
                  </form>
                </Form>
              </>
            )}
          </div>
        </Section>
      </Layout>
    </>
  );
};

export default ForgotPassword;
