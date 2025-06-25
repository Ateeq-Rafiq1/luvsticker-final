
-- Add display_order column to product_sizes table to preserve the order sizes were added
ALTER TABLE public.product_sizes 
ADD COLUMN display_order INTEGER DEFAULT 0;

-- Update existing records to have a display_order based on their current order using a subquery
WITH ordered_sizes AS (
  SELECT id, row_number() OVER (PARTITION BY product_id ORDER BY created_at) as new_order
  FROM public.product_sizes
)
UPDATE public.product_sizes 
SET display_order = ordered_sizes.new_order
FROM ordered_sizes
WHERE public.product_sizes.id = ordered_sizes.id;
