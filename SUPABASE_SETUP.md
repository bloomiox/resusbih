# Supabase Setup Guide

## Database Setup

1. **Go to your Supabase project**: https://hywmnhwrzebubmnimdow.supabase.co

2. **Navigate to SQL Editor** in the Supabase dashboard

3. **Run the initialization script**: Copy and paste the contents of `scripts/init-database.sql` into the SQL editor and execute it.

This will create all the necessary tables:
- `news_articles` - For managing news/blog posts
- `courses` - For course information
- `team_members` - For team member profiles
- `participants` - For course registrations and CRM
- `page_content` - For dynamic page content

## Environment Variables

The Supabase configuration is already set up in `lib/supabase.ts` with your project credentials:
- Project URL: `https://hywmnhwrzebubmnimdow.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Row Level Security (RLS)

The database is configured with Row Level Security policies:
- **Public read access** for all tables (website visitors can view content)
- **Authenticated write access** for admin operations (news, courses, team management)
- **Public insert access** for participant registrations (course sign-ups)

## Authentication

For admin access, you'll need to set up authentication in Supabase:
1. Go to Authentication > Users in your Supabase dashboard
2. Create a user with email: `office@resusbih.org`
3. The admin login will authenticate against Supabase Auth

## Features

✅ **Real-time data synchronization**
✅ **Automatic backups and scaling**
✅ **Row-level security**
✅ **RESTful API**
✅ **Real-time subscriptions** (can be added later)
✅ **File storage** (for images, can be added later)

## Installation

Run the following command to install the Supabase client:

```bash
npm install @supabase/supabase-js
```

## Usage

The application now uses Supabase for all data operations:
- All CRUD operations go through Supabase
- Real-time updates between admin panel and website
- Persistent data storage
- Scalable infrastructure

## Next Steps

1. Run the SQL initialization script in your Supabase dashboard
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Test the admin panel and course registration functionality

The application will now persist all data to your Supabase database!