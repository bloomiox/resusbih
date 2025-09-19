-- Temporary script to disable RLS for testing
-- WARNING: This removes security! Only use for testing, then re-enable RLS

-- Disable RLS on all tables
ALTER TABLE news_articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_content DISABLE ROW LEVEL SECURITY;

-- To re-enable later, run:
-- ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;