
import React, { useState } from 'react';
import { Page } from '../types';
import { NAV_LINKS } from '../constants';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const navLinks = [...NAV_LINKS, { name: 'Admin', page: Page.Admin }];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-brand-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => handleNavClick(Page.Home)}
          >
            <img 
              src="https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/RESUSBIH%20LOGO.png" 
              alt="RESUSBIH Logo" 
              className="h-12 w-auto"
            />
            <span className="ml-3 text-2xl font-black tracking-wider text-brand-blue">
              RESUSBIH
            </span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`text-lg font-semibold transition-colors duration-200 ${
                  currentPage === link.page 
                  ? 'text-brand-lightblue' 
                  : 'text-brand-blue hover:text-brand-lightblue'
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>
          
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-brand-blue focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-brand-white border-t border-gray-200">
          <nav className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`text-lg font-semibold transition-colors duration-200 ${
                  currentPage === link.page 
                  ? 'text-brand-lightblue' 
                  : 'text-brand-blue hover:text-brand-lightblue'
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
