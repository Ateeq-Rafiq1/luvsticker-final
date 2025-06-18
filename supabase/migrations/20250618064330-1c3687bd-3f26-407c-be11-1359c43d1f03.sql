
-- First, let's see what's in the table and clean it up completely
-- Delete all existing quantity tiers to start fresh
DELETE FROM public.quantity_tiers;

-- Now update the quantity_tiers table structure
-- Remove min_quantity and max_quantity columns if they exist
ALTER TABLE public.quantity_tiers DROP COLUMN IF EXISTS min_quantity;
ALTER TABLE public.quantity_tiers DROP COLUMN IF EXISTS max_quantity;

-- Add a single quantity field
ALTER TABLE public.quantity_tiers ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;

-- Update the constraint to check for positive quantity
ALTER TABLE public.quantity_tiers DROP CONSTRAINT IF EXISTS check_quantity_range;
ALTER TABLE public.quantity_tiers ADD CONSTRAINT check_positive_quantity CHECK (quantity > 0);

-- Add unique constraint to prevent duplicate quantities for the same size
ALTER TABLE public.quantity_tiers ADD CONSTRAINT unique_size_quantity UNIQUE (size_id, quantity);
