
-- Create leads table for contact form submissions
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add artwork_via_email column to orders table
ALTER TABLE public.orders 
ADD COLUMN artwork_via_email BOOLEAN DEFAULT false;

-- Add RLS policies for leads table
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy for leads (admin access only for now)
CREATE POLICY "Enable read access for all users" ON public.leads
FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.leads  
FOR INSERT WITH CHECK (true);

-- Add trigger for updated_at on leads table
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
