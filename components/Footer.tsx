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
              <a
                href="https://www.facebook.com/profile.php?id=61582409113860"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-brand-red transition-colors flex items-center space-x-1"
                aria-label="Facebook stranica"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
                <span>Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/resusbih?igsh=bWt1cnd0YjA3MXF3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-brand-red transition-colors flex items-center space-x-1"
                aria-label="Instagram profil"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.017 0C8.396 0 7.929.01 7.102.048 6.273.088 5.718.222 5.238.42a5.893 5.893 0 0 0-2.126 1.384 5.893 5.893 0 0 0-1.384 2.126C1.53 4.41 1.396 4.961 1.356 5.79.318 6.617.308 7.084.308 10.705c0 3.621.01 4.088.048 4.915.04.83.174 1.38.372 1.86.204.48.478.888.93 1.34.452.452.86.726 1.34.93.48.198 1.03.332 1.86.372.827.04 1.294.05 4.915.05s4.088-.01 4.915-.05c.83-.04 1.38-.174 1.86-.372a5.893 5.893 0 0 0 2.126-1.384 5.893 5.893 0 0 0 1.384-2.126c.198-.48.332-1.03.372-1.86.04-.827.05-1.294.05-4.915s-.01-4.088-.05-4.915c-.04-.83-.174-1.38-.372-1.86a5.893 5.893 0 0 0-1.384-2.126A5.893 5.893 0 0 0 19.078.42c-.48-.198-1.03-.332-1.86-.372C16.391.01 15.924 0 12.303 0h-.286zm-.845 2.136h.572c3.559 0 3.983.014 5.39.072.3.014.462.064.57.107.143.056.245.122.352.229.107.107.173.209.229.352.043.108.093.27.107.57.058 1.407.072 1.831.072 5.39s-.014 3.983-.072 5.39c-.014.3-.064.462-.107.57a.942.942 0 0 1-.229.352.942.942 0 0 1-.352.229c-.108.043-.27.093-.57.107-1.407.058-1.831.072-5.39.072s-3.983-.014-5.39-.072c-.3-.014-.462-.064-.57-.107a.942.942 0 0 1-.352-.229.942.942 0 0 1-.229-.352c-.043-.108-.093-.27-.107-.57-.058-1.407-.072-1.831-.072-5.39s.014-3.983.072-5.39c.014-.3.064-.462.107-.57a.942.942 0 0 1 .229-.352.942.942 0 0 1 .352-.229c.108-.043.27-.093.57-.107 1.232-.056 1.708-.069 4.218-.071v.003zm8.385 1.85a1.44 1.44 0 1 1 0 2.88 1.44 1.44 0 0 1 0-2.88zM12.017 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12.017 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" clipRule="evenodd" />
                </svg>
                <span>Instagram</span>
              </a>
              <a
                href="https://www.linkedin.com/company/resusbih"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-brand-red transition-colors flex items-center space-x-1"
                aria-label="LinkedIn stranica"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clipRule="evenodd" />
                </svg>
                <span>LinkedIn</span>
              </a>
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