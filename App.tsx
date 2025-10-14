
import React, { useState } from 'react';
import { Page } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import CoursesPage from './components/pages/CoursesPage';
import ContactPage from './components/pages/ContactPage';
import NewsPage from './components/pages/NewsPage';
import AdminPage from './components/pages/AdminPage';
import { NewsArticle } from './types';
import { NEWS_DATA } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [news, setNews] = useState<NewsArticle[]>(NEWS_DATA);

  const handleAddArticle = (article: NewsArticle) => {
    setNews([article, ...news]);
    setCurrentPage(Page.News);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage setCurrentPage={setCurrentPage} />;
      case Page.About:
        return <AboutPage />;
      case Page.Courses:
        return <CoursesPage />;
      case Page.News:
        return <NewsPage news={news} />;
      case Page.Contact:
        return <ContactPage />;
      case Page.Admin:
        return <AdminPage onAddArticle={handleAddArticle} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
