import React, { useState } from 'react';
import { PageContent } from '../../types';
import { useData } from '../../contexts/DataContext';

const PageContentManager: React.FC = () => {
  const { pageContent, updatePageContent } = useData();

  const [editingPage, setEditingPage] = useState<keyof PageContent | null>(null);
  const [tempContent, setTempContent] = useState<any>({});

  const handleEdit = (page: keyof PageContent) => {
    setEditingPage(page);
    setTempContent({ ...pageContent[page] });
  };

  const handleSave = () => {
    if (editingPage) {
      updatePageContent(editingPage, tempContent);
      setEditingPage(null);
      setTempContent({});
    }
  };

  const handleCancel = () => {
    setEditingPage(null);
    setTempContent({});
  };

  const updateTempContent = (key: string, value: string) => {
    setTempContent({
      ...tempContent,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Upravljanje sadržajem stranica</h2>
        <p className="text-gray-600">Uredite sadržaj glavnih stranica vašeg sajta</p>
      </div>

      {/* Home Page Content */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-brand-blue">Početna stranica</h3>
          <button
            onClick={() => handleEdit('home')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Uredi
          </button>
        </div>
        
        {editingPage === 'home' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Glavni naslov</label>
              <input
                type="text"
                value={tempContent.heroTitle || ''}
                onChange={(e) => updateTempContent('heroTitle', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Podnaslov</label>
              <input
                type="text"
                value={tempContent.heroSubtitle || ''}
                onChange={(e) => updateTempContent('heroSubtitle', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">O nama sekcija</label>
              <textarea
                value={tempContent.aboutSection || ''}
                onChange={(e) => updateTempContent('aboutSection', e.target.value)}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Spremi
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Otkaži
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p><strong>Glavni naslov:</strong> {pageContent.home.heroTitle}</p>
            <p><strong>Podnaslov:</strong> {pageContent.home.heroSubtitle}</p>
            <p><strong>O nama sekcija:</strong> {pageContent.home.aboutSection}</p>
          </div>
        )}
      </div>

      {/* About Page Content */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-brand-blue">O nama stranica</h3>
          <button
            onClick={() => handleEdit('about')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Uredi
          </button>
        </div>
        
        {editingPage === 'about' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Naslov</label>
              <input
                type="text"
                value={tempContent.title || ''}
                onChange={(e) => updateTempContent('title', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sadržaj</label>
              <textarea
                value={tempContent.content || ''}
                onChange={(e) => updateTempContent('content', e.target.value)}
                rows={6}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Spremi
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Otkaži
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p><strong>Naslov:</strong> {pageContent.about.title}</p>
            <p><strong>Sadržaj:</strong> {pageContent.about.content}</p>
          </div>
        )}
      </div>

      {/* Contact Page Content */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-brand-blue">Kontakt stranica</h3>
          <button
            onClick={() => handleEdit('contact')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Uredi
          </button>
        </div>
        
        {editingPage === 'contact' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Naslov</label>
              <input
                type="text"
                value={tempContent.title || ''}
                onChange={(e) => updateTempContent('title', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sadržaj</label>
              <textarea
                value={tempContent.content || ''}
                onChange={(e) => updateTempContent('content', e.target.value)}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Spremi
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Otkaži
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p><strong>Naslov:</strong> {pageContent.contact.title}</p>
            <p><strong>Sadržaj:</strong> {pageContent.contact.content}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageContentManager;