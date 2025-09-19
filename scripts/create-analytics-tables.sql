-- Create analytics tables for tracking real user interactions

-- Page views and user interactions tracking
CREATE TABLE IF NOT EXISTS analytics_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL, -- 'page_view', 'course_view', 'news_view', 'registration_start', 'registration_complete'
    page_path VARCHAR(255),
    referrer VARCHAR(255),
    user_agent TEXT,
    ip_address INET,
    session_id VARCHAR(100),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    metadata JSONB, -- Additional event data (course_id, news_id, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Website performance metrics
CREATE TABLE IF NOT EXISTS analytics_metrics (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC NOT NULL,
    metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(metric_name, metric_date)
);

-- Course registration funnel tracking
CREATE TABLE IF NOT EXISTS registration_funnel (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    step VARCHAR(50) NOT NULL, -- 'course_view', 'registration_start', 'form_submit', 'registration_complete'
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_date ON analytics_events(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_page_date ON analytics_events(page_path, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_name_date ON analytics_metrics(metric_name, metric_date);
CREATE INDEX IF NOT EXISTS idx_registration_funnel_course ON registration_funnel(course_id, step);
CREATE INDEX IF NOT EXISTS idx_registration_funnel_session ON registration_funnel(session_id);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_funnel ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics (allow inserts from anyone, reads only for authenticated users)
CREATE POLICY "Enable insert for all users" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for authenticated users only" ON analytics_events FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users only" ON analytics_metrics FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable read for authenticated users only" ON analytics_metrics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON analytics_metrics FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for all users" ON registration_funnel FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for authenticated users only" ON registration_funnel FOR SELECT USING (auth.role() = 'authenticated');

-- Function to calculate daily metrics
CREATE OR REPLACE FUNCTION calculate_daily_metrics(target_date DATE DEFAULT CURRENT_DATE)
RETURNS void AS $$
BEGIN
    -- Page views
    INSERT INTO analytics_metrics (metric_name, metric_value, metric_date, metadata)
    VALUES (
        'daily_page_views',
        (SELECT COUNT(*) FROM analytics_events 
         WHERE event_type = 'page_view' 
         AND DATE(created_at) = target_date),
        target_date,
        '{"description": "Total page views for the day"}'::jsonb
    ) ON CONFLICT (metric_name, metric_date) 
    DO UPDATE SET 
        metric_value = EXCLUDED.metric_value,
        created_at = NOW();

    -- Unique visitors (by session_id)
    INSERT INTO analytics_metrics (metric_name, metric_value, metric_date, metadata)
    VALUES (
        'daily_unique_visitors',
        (SELECT COUNT(DISTINCT session_id) FROM analytics_events 
         WHERE DATE(created_at) = target_date),
        target_date,
        '{"description": "Unique visitors for the day"}'::jsonb
    ) ON CONFLICT (metric_name, metric_date) 
    DO UPDATE SET 
        metric_value = EXCLUDED.metric_value,
        created_at = NOW();

    -- Course registrations
    INSERT INTO analytics_metrics (metric_name, metric_value, metric_date, metadata)
    VALUES (
        'daily_registrations',
        (SELECT COUNT(*) FROM participants 
         WHERE DATE(registration_date::date) = target_date),
        target_date,
        '{"description": "Course registrations for the day"}'::jsonb
    ) ON CONFLICT (metric_name, metric_date) 
    DO UPDATE SET 
        metric_value = EXCLUDED.metric_value,
        created_at = NOW();

    -- Most viewed courses
    INSERT INTO analytics_metrics (metric_name, metric_value, metric_date, metadata)
    VALUES (
        'top_course_views',
        0, -- Placeholder value
        target_date,
        (SELECT jsonb_build_object(
            'description', 'Most viewed courses',
            'courses', jsonb_agg(
                jsonb_build_object(
                    'course_id', (metadata->>'course_id')::int,
                    'views', view_count
                )
            )
        ) FROM (
            SELECT 
                metadata->>'course_id' as course_id,
                COUNT(*) as view_count
            FROM analytics_events 
            WHERE event_type = 'course_view' 
            AND DATE(created_at) = target_date
            AND metadata->>'course_id' IS NOT NULL
            GROUP BY metadata->>'course_id'
            ORDER BY view_count DESC
            LIMIT 5
        ) top_courses)
    ) ON CONFLICT (metric_name, metric_date) 
    DO UPDATE SET 
        metadata = EXCLUDED.metadata,
        created_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically calculate metrics daily
CREATE OR REPLACE FUNCTION trigger_calculate_metrics()
RETURNS trigger AS $$
BEGIN
    -- Calculate metrics for the current date
    PERFORM calculate_daily_metrics(CURRENT_DATE);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on analytics_events to update metrics
CREATE TRIGGER update_daily_metrics
    AFTER INSERT ON analytics_events
    FOR EACH STATEMENT
    EXECUTE FUNCTION trigger_calculate_metrics();