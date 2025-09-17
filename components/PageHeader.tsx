import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="bg-brand-blue text-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
        <p className="text-lg mt-4 max-w-3xl mx-auto">
          {subtitle}
        </p>
      </div>
    </header>
  );
};

export default PageHeader;
