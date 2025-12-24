-- Add image_urls column to apartments table
-- This will store array of R2 image URLs for each apartment

ALTER TABLE public.apartments 
ADD COLUMN IF NOT EXISTS image_urls TEXT[];

-- Add comment to explain the column
COMMENT ON COLUMN public.apartments.image_urls IS 'Array of Cloudflare R2 public image URLs - used for apartment galleries';

-- Initialize empty arrays for existing apartments
UPDATE public.apartments 
SET image_urls = ARRAY[]::TEXT[] 
WHERE image_urls IS NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'apartments' AND column_name = 'image_urls';

