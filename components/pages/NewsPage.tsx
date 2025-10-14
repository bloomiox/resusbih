import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { NewsArticle } from '../../types';
import PageHeader from '../PageHeader';
import ImageGalleryModal from '../ImageGalleryModal';

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
            <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover" />
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

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onClose }) => {
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Combine main image and gallery images for the modal
  const allImages = [
    ...(article.imageUrl ? [article.imageUrl] : []),
    ...(article.galleryImages || [])
  ];

  const handleImageClick = (imageUrl: string) => {
    const imageIndex = allImages.indexOf(imageUrl);
    setSelectedImageIndex(imageIndex);
    setGalleryModalOpen(true);
  };

  const handleMainImageClick = () => {
    if (article.imageUrl) {
      handleImageClick(article.imageUrl);
    }
  };

  return (
    <>
      <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg max-w-4xl mx-auto animate-fade-in">
        <h2 className="text-3xl font-bold text-brand-blue mb-2">{article.title}</h2>
        <p className="text-sm text-gray-500 mb-6">Objavljeno: {article.publishDate}</p>
        
        {/* Main Image */}
        {article.imageUrl && (
          <div className="mb-8">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow" 
              onClick={handleMainImageClick}
            />
            <p className="text-xs text-gray-500 mt-2 text-center">Kliknite na sliku za uvećanje</p>
          </div>
        )}
        
        {/* Article Content */}
        <div className="text-gray-700 space-y-4 leading-relaxed">
          {article.fullContent.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph.replace('\n', ' ')}</p>
          ))}
        </div>
        
        {/* Gallery Images */}
        {article.galleryImages && article.galleryImages.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-brand-blue mb-4">Galerija</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {article.galleryImages.map((imageUrl, index) => (
                <div 
                  key={index} 
                  className="relative group cursor-pointer"
                  onClick={() => handleImageClick(imageUrl)}
                >
                  <img
                    src={imageUrl}
                    alt={`${article.title} - slika ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-all group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center pointer-events-none">
                    <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Kliknite na bilo koju sliku za pregled galerije</p>
          </div>
        )}
        
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

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        images={allImages}
        isOpen={galleryModalOpen}
        onClose={() => setGalleryModalOpen(false)}
        initialIndex={selectedImageIndex}
      />
    </>
  );
};


type SortOption = 'newest' | 'oldest' | 'alphabetical';

const NewsPage: React.FC = () => {
  const { news } = useData();
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const sortedNews = useMemo(() => {
    const newsCopy = [...news];

    switch (sortBy) {
      case 'newest':
        return newsCopy.sort((a, b) => {
          const dateA = new Date(a.publishDate.split('.').reverse().join('-'));
          const dateB = new Date(b.publishDate.split('.').reverse().join('-'));
          return dateB.getTime() - dateA.getTime();
        });
      case 'oldest':
        return newsCopy.sort((a, b) => {
          const dateA = new Date(a.publishDate.split('.').reverse().join('-'));
          const dateB = new Date(b.publishDate.split('.').reverse().join('-'));
          return dateA.getTime() - dateB.getTime();
        });
      case 'alphabetical':
        return newsCopy.sort((a, b) => a.title.localeCompare(b.title, 'hr'));
      default:
        return newsCopy;
    }
  }, [news, sortBy]);

  const handleSelectArticle = (id: number) => {
    setSelectedArticleId(id);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleCloseArticle = () => {
    setSelectedArticleId(null);
  };

  const selectedArticle = selectedArticleId ? news.find(article => article.id === selectedArticleId) : null;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Novosti"
        subtitle="Pratite najnovije vijesti i obavijesti iz našeg udruženja."
      />

      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {selectedArticle ? (
            <ArticleDetail article={selectedArticle} onClose={handleCloseArticle} />
          ) : news.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Trenutno nema dostupnih novosti.</p>
            </div>
          ) : (
            <>
              {/* Sorting Controls */}
              <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">Sortiraj po:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-200"
                  >
                    <option value="newest">Najnovije prvo</option>
                    <option value="oldest">Najstarije prvo</option>
                    <option value="alphabetical">Abecedno (A-Z)</option>
                  </select>
                </div>
                <div className="text-sm text-gray-500">
                  {sortedNews.length} {sortedNews.length === 1 ? 'novost' : sortedNews.length < 5 ? 'novosti' : 'novosti'}
                </div>
              </div>

              <ArticleList articles={sortedNews} onSelectArticle={handleSelectArticle} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;