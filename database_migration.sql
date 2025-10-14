-- Add gallery_images column to news_articles table
-- Run this in your Supabase SQL Editor

ALTER TABLE news_articles 
ADD COLUMN IF NOT EXISTS gallery_images TEXT[];

-- Update existing records to have empty array for gallery_images
UPDATE news_articles 
SET gallery_images = '{}' 
WHERE gallery_images IS NULL;

-- Optional: Add a comment to the column
COMMENT ON COLUMN news_articles.gallery_images IS 'Array of gallery image URLs for the news article';