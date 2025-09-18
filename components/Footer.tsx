import React from 'react';
import { Page } from '../types';

interface FooterProps {
  setCurrentPage: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  return (
    <footer className="bg-brand-blue text-brand-white mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-bold mb-2">RESUSBIH - Udruženje Resuscitacijski savjet u BiH</h3>
            <p className="text-sm text-gray-300">Znanje koje spašava živote.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Kontakt</h3>
            <p className="text-sm text-gray-300">Adresa: Jablanska 155, Bihać, Bosna i Hercegovina</p>
            <p className="text-sm text-gray-300">Email: office@resusbih.org</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Pratite nas</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              {/* Add social media icons here if needed */}
              <a href="#" className="text-gray-300 hover:text-brand-red transition-colors">Facebook</a>
              <a href="https://www.linkedin.com/company/resusbih" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-brand-red transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
          <p>
            <span 
              onClick={() => setCurrentPage(Page.Login)}
              className="cursor-pointer hover:text-brand-red transition-colors"
              title="Admin Login"
            >
              &copy;
            </span>{' '}
            {new Date().getFullYear()} Udruženje Resuscitacijski savjet u Bosni i Hercegovini. Sva prava pridržana.
            <span 
              onClick={() => setCurrentPage(Page.Login)}
              className="inline-block w-2 h-2 bg-gray-600 rounded-full ml-2 cursor-pointer hover:bg-brand-red transition-colors"
              title="Admin Login"
            ></span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;