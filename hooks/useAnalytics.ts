import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    analyticsService.trackPageView(location.pathname);
  }, [location.pathname]);

  return {
    trackCourseView: analyticsService.trackCourseView.bind(analyticsService),
    trackNewsView: analyticsService.trackNewsView.bind(analyticsService),
    trackRegistrationStep: analyticsService.trackRegistrationStep.bind(analyticsService),
  };
};