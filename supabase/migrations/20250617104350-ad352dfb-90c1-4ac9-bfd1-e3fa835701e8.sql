
-- Add min_quantity and max_quantity columns to product_sizes table
ALTER TABLE public.product_sizes 
ADD COLUMN min_quantity integer DEFAULT 1,
ADD COLUMN max_quantity integer DEFAULT 100;

-- Update existing records to have default values
UPDATE public.product_sizes 
SET min_quantity = 1, max_quantity = 100 
WHERE min_quantity IS NULL OR max_quantity IS NULL;

-- Add constraints to ensure logical quantity limits
ALTER TABLE public.product_sizes 
ADD CONSTRAINT check_quantity_limits 
CHECK (min_quantity > 0 AND max_quantity >= min_quantity);
