import React, { useState } from 'react';
import { NewsArticle } from '../../types';
import { useData } from '../../contexts/DataContext';
import ImageUpload from './ImageUpload';

const NewsManager: React.FC = () => {
  const { news: articles, addNews, updateNews, deleteNews } = useData();
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    publishDate: '',
    shortDescription: '',
    fullContent: '',
    imageUrl: '',
    galleryImages: [] as string[],
  });

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      publishDate: article.publishDate,
      shortDescription: article.shortDescription,
      fullContent: article.fullContent,
      imageUrl: article.imageUrl || '',
      galleryImages: article.galleryImages || [],
    });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      publishDate: new Date().toLocaleDateString('hr-HR'),
      shortDescription: '',
      fullContent: '',
      imageUrl: '',
      galleryImages: [],
    });
    setIsCreating(true);
  };

  const handleSave = () => {
    if (editingArticle) {
      // Update existing article
      updateNews(editingArticle.id, formData);
    } else {
      // Create new article
      addNews(formData);
    }
    setEditingArticle(null);
    setIsCreating(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Jeste li sigurni da želite obrisati ovaj članak?')) {
      deleteNews(id);
    }
  };

  const handleCancel = () => {
    setEditingArticle(null);
    setIsCreating(false);
  };

  const handleMainImageUpload = (imageUrl: string, publicId: string) => {
    setFormData({ ...formData, imageUrl });
  };

  const handleMainImageRemove = (publicId: string) => {
    setFormData({ ...formData, imageUrl: '' });
  };

  const handleGalleryImageUpload = (imageUrl: string, publicId: string) => {
    setFormData({ 
      ...formData, 
      galleryImages: [...formData.galleryImages, imageUrl] 
    });
  };

  const handleGalleryImageRemove = (imageUrl: string) => {
    setFormData({
      ...formData,
      galleryImages: formData.galleryImages.filter(img => img !== imageUrl)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upravljanje novostima</h2>
          <p className="text-gray-600">Dodajte, uredite i upravljajte novostima na sajtu</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-brand-blue hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Dodaj novi članak</span>
        </button>
      </div>

      {(editingArticle || isCreating) && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-brand-blue">
            {editingArticle ? 'Uredi članak' : 'Novi članak'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Naslov</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Datum objave</label>
              <input
                type="text"
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="dd.mm.yyyy."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kratki opis</label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Puni sadržaj</label>
              <textarea
                value={formData.fullContent}
                onChange={(e) => setFormData({ ...formData, fullContent: e.target.value })}
                rows={8}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <ImageUpload
                label="Glavna slika"
                currentImage={formData.imageUrl}
                onUpload={handleMainImageUpload}
                onRemove={handleMainImageRemove}
                folder="news/main"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Galerija slika</label>
              <div className="space-y-4">
                {formData.galleryImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.galleryImages.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleGalleryImageRemove(imageUrl)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <ImageUpload
                  label="Dodaj sliku u galeriju"
                  onUpload={handleGalleryImageUpload}
                  folder="news/gallery"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Spremi
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Otkaži
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm border border-gray-200 overflow-hidden rounded-lg">
        <ul className="divide-y divide-gray-200">
          {articles.map((article) => (
            <li key={article.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                  <p className="text-sm text-brand-blue font-medium">{article.publishDate}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{article.shortDescription}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(article)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-lg text-sm transition-colors duration-200"
                  >
                    Uredi
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-lg text-sm transition-colors duration-200"
                  >
                    Obriši
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NewsManager;