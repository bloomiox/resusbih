import { supabase } from '../lib/supabase';

export interface AnalyticsEvent {
  event_type: 'page_view' | 'course_view' | 'news_view' | 'registration_start' | 'registration_complete';
  page_path?: string;
  referrer?: string;
  session_id: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsMetrics {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: string;
  registrations: number;
  topPages: Array<{ page: string; views: number; percentage: number }>;
  topCourses: Array<{ id: number; title: string; views: number; registrations: number }>;
  topNews: Array<{ id: number; title: string; views: number }>;
  deviceStats: Array<{ device: string; percentage: number; color: string }>;
}

export interface TimeRange {
  days: number;
  label: string;
}

export const TIME_RANGES: Record<string, TimeRange> = {
  '7d': { days: 7, label: '7 dana' },
  '30d': { days: 30, label: '30 dana' },
  '90d': { days: 90, label: '90 dana' },
};

class AnalyticsService {
  // Generate or get session ID
  getSessionId(): string {
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // Track an event
  async trackEvent(event: Omit<AnalyticsEvent, 'session_id'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          ...event,
          session_id: this.getSessionId(),
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
        });

      if (error) {
        console.error('Analytics tracking error:', error);
      }
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  }

  // Track page view
  async trackPageView(pagePath: string, metadata?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      event_type: 'page_view',
      page_path: pagePath,
      metadata,
    });
  }

  // Track course view
  async trackCourseView(courseId: number, courseTitle: string): Promise<void> {
    await this.trackEvent({
      event_type: 'course_view',
      page_path: `/courses/${courseId}`,
      metadata: { course_id: courseId, course_title: courseTitle },
    });
  }

  // Track news view
  async trackNewsView(newsId: number, newsTitle: string): Promise<void> {
    await this.trackEvent({
      event_type: 'news_view',
      page_path: `/news/${newsId}`,
      metadata: { news_id: newsId, news_title: newsTitle },
    });
  }

  // Track registration funnel
  async trackRegistrationStep(
    courseId: number,
    step: 'course_view' | 'registration_start' | 'form_submit' | 'registration_complete',
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('registration_funnel')
        .insert({
          session_id: this.getSessionId(),
          course_id: courseId,
          step,
          metadata,
        });

      if (error) {
        console.error('Registration funnel tracking error:', error);
      }
    } catch (error) {
      console.error('Registration funnel tracking failed:', error);
    }
  } 
 // Get analytics metrics for a time range
  async getMetrics(timeRange: string = '30d'): Promise<AnalyticsMetrics> {
    const range = TIME_RANGES[timeRange];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - range.days);

    try {
      // Get basic metrics from database
      const [
        pageViewsResult,
        uniqueVisitorsResult,
        registrationsResult,
        topPagesResult,
        topCoursesResult,
        topNewsResult,
        participantsResult,
        coursesResult,
        newsResult,
      ] = await Promise.all([
        // Page views
        supabase
          .from('analytics_events')
          .select('id')
          .eq('event_type', 'page_view')
          .gte('created_at', startDate.toISOString()),

        // Unique visitors
        supabase
          .from('analytics_events')
          .select('session_id')
          .gte('created_at', startDate.toISOString()),

        // Registrations
        supabase
          .from('participants')
          .select('id')
          .gte('registration_date', startDate.toISOString().split('T')[0]),

        // Top pages
        supabase
          .from('analytics_events')
          .select('page_path')
          .eq('event_type', 'page_view')
          .gte('created_at', startDate.toISOString()),

        // Top courses (by views)
        supabase
          .from('analytics_events')
          .select('metadata')
          .eq('event_type', 'course_view')
          .gte('created_at', startDate.toISOString()),

        // Top news (by views)
        supabase
          .from('analytics_events')
          .select('metadata')
          .eq('event_type', 'news_view')
          .gte('created_at', startDate.toISOString()),

        // Get all participants for course registration stats
        supabase
          .from('participants')
          .select('course_id, course_name')
          .gte('registration_date', startDate.toISOString().split('T')[0]),

        // Get all courses
        supabase.from('courses').select('id, title'),

        // Get all news
        supabase.from('news_articles').select('id, title'),
      ]);    
  // Calculate metrics
      const pageViews = pageViewsResult.data?.length || 0;
      const uniqueVisitors = new Set(uniqueVisitorsResult.data?.map(v => v.session_id)).size;
      const registrations = registrationsResult.data?.length || 0;

      // Calculate top pages
      const pageViewCounts: Record<string, number> = {};
      topPagesResult.data?.forEach(event => {
        if (event.page_path) {
          pageViewCounts[event.page_path] = (pageViewCounts[event.page_path] || 0) + 1;
        }
      });

      const topPages = Object.entries(pageViewCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([page, views]) => ({
          page: this.formatPageName(page),
          views,
          percentage: pageViews > 0 ? (views / pageViews) * 100 : 0,
        }));

      // Calculate top courses
      const courseViewCounts: Record<number, number> = {};
      topCoursesResult.data?.forEach(event => {
        const courseId = event.metadata?.course_id;
        if (courseId) {
          courseViewCounts[courseId] = (courseViewCounts[courseId] || 0) + 1;
        }
      });

      const courseRegistrationCounts: Record<number, number> = {};
      participantsResult.data?.forEach(participant => {
        const courseId = participant.course_id;
        courseRegistrationCounts[courseId] = (courseRegistrationCounts[courseId] || 0) + 1;
      });

      const topCourses = Object.entries(courseViewCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([courseIdStr, views]) => {
          const courseId = parseInt(courseIdStr);
          const course = coursesResult.data?.find(c => c.id === courseId);
          return {
            id: courseId,
            title: course?.title || 'Unknown Course',
            views,
            registrations: courseRegistrationCounts[courseId] || 0,
          };
        });

      // Calculate top news
      const newsViewCounts: Record<number, number> = {};
      topNewsResult.data?.forEach(event => {
        const newsId = event.metadata?.news_id;
        if (newsId) {
          newsViewCounts[newsId] = (newsViewCounts[newsId] || 0) + 1;
        }
      });

      const topNews = Object.entries(newsViewCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([newsIdStr, views]) => {
          const newsId = parseInt(newsIdStr);
          const news = newsResult.data?.find(n => n.id === newsId);
          return {
            id: newsId,
            title: news?.title || 'Unknown News',
            views,
          };
        }); 
     // Mock device stats (would need user agent parsing for real data)
      const deviceStats = [
        { device: 'Desktop', percentage: 45.2, color: 'bg-blue-500' },
        { device: 'Mobile', percentage: 38.7, color: 'bg-green-500' },
        { device: 'Tablet', percentage: 16.1, color: 'bg-purple-500' },
      ];

      return {
        pageViews,
        uniqueVisitors,
        bounceRate: 28.7, // Would need session analysis for real bounce rate
        avgSessionDuration: '3:12', // Would need session timing for real duration
        registrations,
        topPages,
        topCourses,
        topNews,
        deviceStats,
      };
    } catch (error) {
      console.error('Error fetching analytics metrics:', error);
      // Return default/empty metrics on error
      return {
        pageViews: 0,
        uniqueVisitors: 0,
        bounceRate: 0,
        avgSessionDuration: '0:00',
        registrations: 0,
        topPages: [],
        topCourses: [],
        topNews: [],
        deviceStats: [],
      };
    }
  }

  private formatPageName(path: string): string {
    const pathMap: Record<string, string> = {
      '/': 'Početna',
      '/courses': 'Kursevi',
      '/news': 'Novosti',
      '/about': 'O nama',
      '/contact': 'Kontakt',
      '/admin': 'Admin Panel',
    };

    return pathMap[path] || path;
  }
}

export const analyticsService = new AnalyticsService();