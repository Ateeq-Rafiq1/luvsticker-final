
-- Remove quantity tier related columns from product_sizes table
ALTER TABLE public.product_sizes 
DROP COLUMN IF EXISTS min_quantity,
DROP COLUMN IF EXISTS max_quantity;

-- Drop the entire quantity_tiers table as it's no longer needed
DROP TABLE IF EXISTS public.quantity_tiers;

-- Add description column to products table if it doesn't exist
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS description text;
