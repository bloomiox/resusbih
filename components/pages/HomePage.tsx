import React from 'react';
import { Page, Course } from '../../types';
import { useData } from '../../contexts/DataContext';
import CourseCard from '../CourseCard';

interface PageSetterProps {
  setCurrentPage: (page: Page) => void;
}

interface HeroSectionProps extends PageSetterProps {
  heroTitle: string;
  heroSubtitle: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ setCurrentPage, heroTitle, heroSubtitle }) => (
  <section
    className="relative bg-cover bg-center text-white py-32 md:py-48"
    style={{ backgroundImage: 'url(https://www.aspenmedical.ae/wp-content/uploads/2024/02/BLS-Left.jpg)' }}
    aria-labelledby="hero-title"
  >
    <div className="absolute inset-0 bg-brand-blue bg-opacity-60"></div>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <h1 id="hero-title" className="text-4xl md:text-6xl font-black mb-4 tracking-tight">{heroTitle}</h1>
      <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto">
        {heroSubtitle}
      </p>
      <button
        onClick={() => setCurrentPage(Page.Courses)}
        className="bg-brand-blue hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
      >
        Pogledajte naše kurseve
      </button>
    </div>
  </section>
);

interface MissionSectionProps {
  aboutSection: string;
}

const MissionSection: React.FC<MissionSectionProps> = ({ aboutSection }) => (
  <section className="py-16 bg-brand-white" aria-labelledby="mission-title">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 id="mission-title" className="text-3xl md:text-4xl font-bold text-brand-blue mb-4">Naša Misija</h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        {aboutSection}
      </p>
    </div>
  </section>
);

interface FeaturedCoursesProps extends PageSetterProps {
  courses: Course[];
}

const FeaturedCoursesSection: React.FC<FeaturedCoursesProps> = ({ setCurrentPage, courses }) => (
  <section className="py-16 bg-brand-gray" aria-labelledby="featured-courses-title">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 id="featured-courses-title" className="text-3xl md:text-4xl font-bold text-brand-blue mb-8 text-center">Izdvojeni Kursevi</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      <div className="text-center mt-12">
        <button
          onClick={() => setCurrentPage(Page.Courses)}
          className="bg-brand-blue hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
        >
          Svi kursevi
        </button>
      </div>
    </div>
  </section>
);

const CallToActionSection: React.FC<PageSetterProps> = ({ setCurrentPage }) => (
  <section className="bg-brand-blue text-white" aria-labelledby="cta-title">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h2 id="cta-title" className="text-3xl font-bold mb-4">Postanite član</h2>
      <p className="text-lg max-w-2xl mx-auto mb-8">
        Pridružite se našoj zajednici stručnjaka i entuzijasta. Kao član, dobivate pristup ekskluzivnim materijalima, popuste na kurseve i priliku za umrežavanje.
      </p>
      <button
        onClick={() => setCurrentPage(Page.Contact)}
        className="bg-brand-white text-brand-blue hover:bg-blue-700 font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
      >
        Kontaktirajte nas za članstvo
      </button>
    </div>
  </section>
);


const HomePage: React.FC<PageSetterProps> = ({ setCurrentPage }) => {
  const { courses, pageContent } = useData();
  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="animate-fade-in">
      <HeroSection 
        setCurrentPage={setCurrentPage} 
        heroTitle={pageContent.home.heroTitle}
        heroSubtitle={pageContent.home.heroSubtitle}
      />
      <MissionSection aboutSection={pageContent.home.aboutSection} />
      <FeaturedCoursesSection setCurrentPage={setCurrentPage} courses={featuredCourses} />
      <CallToActionSection setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default HomePage;