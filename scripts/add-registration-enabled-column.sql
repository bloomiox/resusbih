-- Migration script to add registration_enabled column to courses table
-- Run this if you already have an existing database

-- Add the registration_enabled column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' 
        AND column_name = 'registration_enabled'
    ) THEN
        ALTER TABLE courses ADD COLUMN registration_enabled BOOLEAN DEFAULT true;
        
        -- Update existing courses to have registration enabled by default
        UPDATE courses SET registration_enabled = true WHERE registration_enabled IS NULL;
        
        RAISE NOTICE 'Added registration_enabled column to courses table';
    ELSE
        RAISE NOTICE 'Column registration_enabled already exists in courses table';
    END IF;
END $$;