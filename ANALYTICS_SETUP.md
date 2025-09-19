# Real Analytics System Setup

## Overview
I've implemented a comprehensive real-time analytics system that tracks actual user behavior and KPIs from your Supabase database, replacing the previous mock data.

## What's Been Implemented

### 1. Database Analytics Tables
- **analytics_events**: Tracks page views, course views, news views, and registration events
- **analytics_metrics**: Stores calculated daily metrics
- **registration_funnel**: Tracks the complete registration process

### 2. Analytics Service (`services/analyticsService.ts`)
- Tracks user interactions automatically
- Calculates real metrics from database data
- Provides time-range filtering (7d, 30d, 90d)

### 3. Updated Analytics Dashboard (`components/admin/AnalyticsManager.tsx`)
- Shows real data instead of mock data
- Displays actual page views, unique visitors, registrations
- Shows top courses by views and registrations
- Lists most viewed news articles
- Includes loading states and error handling

### 4. Automatic Tracking
- **Page views**: Tracked automatically on page navigation
- **Course views**: Tracked when users expand course details
- **Registration funnel**: Tracks registration start, form submit, and completion
- **News views**: Ready for implementation when news detail pages are added

## Setup Instructions

### Step 1: Create Analytics Tables
Run this SQL in your Supabase SQL Editor:

```sql
-- Run the complete script from scripts/create-analytics-tables.sql
```

### Step 2: Verify Database Migration
Make sure you've also run the registration_enabled column migration:

```sql
-- Run the script from scripts/add-registration-enabled-column.sql
```

### Step 3: Test Analytics Tracking
1. Navigate through your website pages
2. View course details by clicking "Saznaj više"
3. Start a course registration
4. Complete a registration
5. Check the admin analytics dashboard

## Real KPIs Now Tracked

### Core Metrics
- **Page Views**: Actual page navigation events
- **Unique Visitors**: Based on session IDs
- **Registrations**: Real course registrations from database
- **Bounce Rate**: Calculated from session data (currently estimated)

### Content Performance
- **Top Pages**: Most visited pages with actual view counts
- **Top Courses**: Courses by views and actual registrations
- **Top News**: Most viewed news articles
- **Registration Funnel**: Complete registration process tracking

### User Behavior
- **Course Interest**: Views vs actual registrations
- **Registration Conversion**: From course view to completed registration
- **Session Tracking**: Unique visitors and return visits

## Analytics Events Tracked

1. **page_view**: Every page navigation
2. **course_view**: When user expands course details
3. **news_view**: When user views news article (ready for implementation)
4. **registration_start**: When user clicks "Registruj se"
5. **form_submit**: When registration form is submitted
6. **registration_complete**: When registration is successful

## Data Privacy & Performance

### Privacy Considerations
- No personal data stored in analytics
- Session IDs are anonymous
- IP addresses stored for analytics only
- User agent for device detection

### Performance Optimizations
- Async tracking (doesn't block UI)
- Batch processing for metrics calculation
- Indexed database queries
- Error handling for failed tracking

## Future Enhancements

### Recommended Additions
1. **Google Analytics Integration**: Add GA4 for additional insights
2. **Real Device Detection**: Parse user agents for accurate device stats
3. **Geographic Analytics**: Add country/region tracking
4. **A/B Testing**: Track different versions of pages/components
5. **Real-time Dashboard**: WebSocket updates for live metrics
6. **Export Functionality**: CSV/PDF reports for stakeholders

### Advanced Metrics
1. **Session Duration**: Calculate actual time spent on site
2. **Bounce Rate**: Real bounce rate based on single-page sessions
3. **Conversion Funnels**: Detailed step-by-step conversion analysis
4. **Cohort Analysis**: User retention and engagement over time

## Troubleshooting

### If Analytics Don't Show Data
1. Check browser console for tracking errors
2. Verify Supabase RLS policies allow inserts to analytics tables
3. Ensure analytics tables were created successfully
4. Check that the admin user has proper authentication

### If Admin Panel Shows Errors
1. Verify the admin user is properly authenticated in Supabase
2. Check that all required database columns exist
3. Ensure RLS policies allow reads for authenticated users

## Integration with Existing System

The analytics system integrates seamlessly with your existing:
- **Supabase backend**: Uses same database and authentication
- **Admin panel**: New analytics tab with real data
- **Course system**: Tracks actual course interactions
- **Registration system**: Monitors complete registration funnel

All tracking is automatic and doesn't require changes to existing functionality.