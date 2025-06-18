
-- First, let's modify the quantity_tiers table to link to product_sizes instead of products directly
-- This allows each size to have its own quantity tiers

-- Drop the existing foreign key constraint if it exists
ALTER TABLE public.quantity_tiers DROP CONSTRAINT IF EXISTS quantity_tiers_product_id_fkey;

-- Add a new column to link quantity tiers to specific product sizes
ALTER TABLE public.quantity_tiers 
ADD COLUMN size_id UUID REFERENCES public.product_sizes(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_quantity_tiers_size_id ON public.quantity_tiers(size_id);

-- Add a constraint to ensure we don't have overlapping quantity ranges for the same size
ALTER TABLE public.quantity_tiers 
ADD CONSTRAINT check_quantity_range 
CHECK (min_quantity > 0 AND (max_quantity IS NULL OR max_quantity >= min_quantity));

-- Add a price per unit column for the tier pricing
ALTER TABLE public.quantity_tiers 
ADD COLUMN price_per_unit NUMERIC NOT NULL DEFAULT 0;

-- Update the discount_percentage to have a default value
ALTER TABLE public.quantity_tiers 
ALTER COLUMN discount_percentage SET DEFAULT 0;

-- Add a display order for the tiers
ALTER TABLE public.quantity_tiers 
ADD COLUMN display_order INTEGER DEFAULT 0;
