
import React, { useState, useEffect } from 'react';
import { Page } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { analyticsService } from './services/analyticsService';
import Header from './components/Header';
import Footer from './components/Footer';
import './utils/authDebug'; // Import debug utility
import './utils/cloudinaryTest'; // Import Cloudinary test utility
import './utils/metaTagsTest'; // Import meta tags test utility
import { initializeDefaultMetaTags } from './utils/metaTags';
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import CoursesPage from './components/pages/CoursesPage';
import ContactPage from './components/pages/ContactPage';
import NewsPage from './components/pages/NewsPage';
import LoginPage from './components/pages/LoginPage';
import AdminPage from './components/pages/AdminPage';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const { isAuthenticated } = useAuth();

  // Initialize page based on URL
  useEffect(() => {
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    
    // Map URL paths to pages
    const pathToPage: Record<string, Page> = {
      '/': Page.Home,
      '/about': Page.About,
      '/courses': Page.Courses,
      '/news': Page.News,
      '/contact': Page.Contact,
      '/login': Page.Login,
      '/admin': Page.Admin,
    };

    // Set page based on URL path
    const pageFromPath = pathToPage[path];
    if (pageFromPath) {
      setCurrentPage(pageFromPath);
    } else if (path === '/' && urlParams.has('article')) {
      // Handle root URL with article parameter - redirect to news page
      setCurrentPage(Page.News);
      // Update URL to proper news path
      const articleId = urlParams.get('article');
      const newUrl = `/news?article=${articleId}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  // Track page views
  useEffect(() => {
    const pageMap: Record<Page, string> = {
      [Page.Home]: '/',
      [Page.About]: '/about',
      [Page.Courses]: '/courses',
      [Page.News]: '/news',
      [Page.Contact]: '/contact',
      [Page.Login]: '/login',
      [Page.Admin]: '/admin',
    };

    analyticsService.trackPageView(pageMap[currentPage]);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage setCurrentPage={setCurrentPage} />;
      case Page.About:
        return <AboutPage />;
      case Page.Courses:
        return <CoursesPage />;
      case Page.News:
        return <NewsPage />;
      case Page.Contact:
        return <ContactPage />;
      case Page.Login:
        return <LoginPage setCurrentPage={setCurrentPage} />;
      case Page.Admin:
        return isAuthenticated ? (
          <AdminPage setCurrentPage={setCurrentPage} />
        ) : (
          <LoginPage setCurrentPage={setCurrentPage} />
        );
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  const showHeaderFooter = currentPage !== Page.Login && currentPage !== Page.Admin;

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      {showHeaderFooter && (
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
      <main className={showHeaderFooter ? "flex-grow" : ""}>
        {renderPage()}
      </main>
      {showHeaderFooter && (
        <Footer setCurrentPage={setCurrentPage} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  // Initialize default meta tags
  React.useEffect(() => {
    initializeDefaultMetaTags();
  }, []);

  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
