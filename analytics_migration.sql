-- Analytics Tables Migration
-- Run this in your Supabase SQL Editor if you want to add the missing columns

-- Add missing columns to analytics_events table
ALTER TABLE analytics_events 
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS referrer TEXT;

-- Create registration_funnel table if it doesn't exist
CREATE TABLE IF NOT EXISTS registration_funnel (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  course_id INTEGER NOT NULL,
  step TEXT NOT NULL CHECK (step IN ('course_view', 'registration_start', 'form_submit', 'registration_complete')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_registration_funnel_course_id ON registration_funnel(course_id);
CREATE INDEX IF NOT EXISTS idx_registration_funnel_session_id ON registration_funnel(session_id);

-- Optional: Add metadata column if you want to store additional data
-- ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS metadata JSONB;
-- ALTER TABLE registration_funnel ADD COLUMN IF NOT EXISTS metadata JSONB;