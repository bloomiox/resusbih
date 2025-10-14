# Database Setup for Gallery Images

## 🚨 Required: Add Gallery Images Column to Database

The gallery images feature requires a new column in your Supabase database.

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** in the left sidebar

### Step 2: Run the Migration
Copy and paste this SQL command in the SQL Editor:

```sql
-- Add gallery_images column to news_articles table
ALTER TABLE news_articles 
ADD COLUMN IF NOT EXISTS gallery_images TEXT[];

-- Update existing records to have empty array for gallery_images
UPDATE news_articles 
SET gallery_images = '{}' 
WHERE gallery_images IS NULL;
```

### Step 3: Execute the Query
1. Click **"Run"** to execute the SQL
2. You should see a success message

### Step 4: Verify the Column
1. Go to **Table Editor** in Supabase
2. Select the `news_articles` table
3. Verify that the `gallery_images` column exists with type `text[]`

## ✅ After Running the Migration

1. **Restart your development server**: `pnpm run dev`
2. **Test the gallery upload** in Admin Panel > Novosti
3. **Check that gallery images appear** when viewing news articles

## 🔍 Troubleshooting

### If you get permission errors:
- Make sure you're logged in as the database owner
- Check that your user has ALTER TABLE permissions

### If the column already exists:
- The `IF NOT EXISTS` clause will prevent errors
- You can safely run the migration multiple times

### If gallery images still don't show:
1. Check browser console for errors
2. Verify the column was created successfully
3. Try creating a new news article with gallery images