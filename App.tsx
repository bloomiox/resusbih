
import React, { useState } from 'react';
import { Page } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
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
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
