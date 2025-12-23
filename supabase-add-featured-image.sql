-- Add featured_image_url column to apartments table
ALTER TABLE public.apartments 
ADD COLUMN IF NOT EXISTS featured_image_url TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN public.apartments.featured_image_url IS 'URL of the main/featured image for the apartment - used in listings, carousels, and previews';
