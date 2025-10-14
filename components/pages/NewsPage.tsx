import React, { useState } from 'react';
import { NEWS_DATA } from '../../constants';
import { NewsArticle } from '../../types';
import PageHeader from '../PageHeader';

interface ArticleListProps {
  articles: NewsArticle[];
  onSelectArticle: (id: number) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, onSelectArticle }) => (
  <div className="space-y-8 max-w-4xl mx-auto">
    {articles.map(article => (
      <article key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col md:flex-row">
        {article.imageUrl && (
          <div className="md:w-1/3">
            <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover"/>
          </div>
        )}
        <div className="p-8 flex flex-col justify-between md:w-2/3">
          <div>
            <header>
              <h2 className="text-2xl font-bold text-brand-blue mb-2">{article.title}</h2>
              <p className="text-sm text-gray-500 mb-4">Objavljeno: {article.publishDate}</p>
            </header>
            <p className="text-gray-600 mb-6">{article.shortDescription}</p>
          </div>
          <button
            onClick={() => onSelectArticle(article.id)}
            className="bg-brand-red hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors self-start"
            aria-label={`Pročitaj više o ${article.title}`}
          >
            Pročitaj više
          </button>
        </div>
      </article>
    ))}
  </div>
);

interface ArticleDetailProps {
  article: NewsArticle;
  onClose: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onClose }) => (
  <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg max-w-4xl mx-auto animate-fade-in">
    <h2 className="text-3xl font-bold text-brand-blue mb-2">{article.title}</h2>
    <p className="text-sm text-gray-500 mb-6">Objavljeno: {article.publishDate}</p>
    {article.imageUrl && (
      <img src={article.imageUrl} alt={article.title} className="w-full h-auto max-h-96 object-cover rounded-lg mb-8 shadow-md" />
    )}
    <div className="text-gray-700 space-y-4 leading-relaxed">
      {article.fullContent.split('\n\n').map((paragraph, index) => (
        <p key={index}>{paragraph.replace('\n', ' ')}</p>
      ))}
    </div>
    <button
      onClick={onClose}
      className="mt-8 bg-brand-lightblue hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      Natrag na novosti
    </button>
  </div>
);


type SortOrder = 'newest' | 'oldest';

const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('.').map(Number);
  return new Date(year, month - 1, day);
};

const NewsPage: React.FC = () => {
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const handleSelectArticle = (id: number) => {
    setSelectedArticleId(id);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleCloseArticle = () => {
    setSelectedArticleId(null);
  };

  const sortedArticles = [...NEWS_DATA].sort((a, b) => {
    const dateA = parseDate(a.publishDate);
    const dateB = parseDate(b.publishDate);
    if (sortOrder === 'newest') {
      return dateB.getTime() - dateA.getTime();
    } else {
      return dateA.getTime() - dateB.getTime();
    }
  });

  const selectedArticle = selectedArticleId
    ? NEWS_DATA.find((article) => article.id === selectedArticleId)
    : null;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Novosti"
        subtitle="Pratite najnovije vijesti i obavijesti iz našeg udruženja."
      />

      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {selectedArticle ? (
            <ArticleDetail
              article={selectedArticle}
              onClose={handleCloseArticle}
            />
          ) : (
            <>
              <div className="flex justify-end mb-8">
                <div className="flex items-center space-x-4">
                  <span className="font-semibold">Sortiraj po:</span>
                  <button
                    onClick={() => setSortOrder('newest')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      sortOrder === 'newest'
                        ? 'bg-brand-blue text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Najnovije
                  </button>
                  <button
                    onClick={() => setSortOrder('oldest')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      sortOrder === 'oldest'
                        ? 'bg-brand-blue text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Najstarije
                  </button>
                </div>
              </div>
              <ArticleList
                articles={sortedArticles}
                onSelectArticle={handleSelectArticle}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;