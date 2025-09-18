import React from 'react';
import { useData } from '../../contexts/DataContext';
import CourseCard from '../CourseCard';
import PageHeader from '../PageHeader';

const CoursesPage: React.FC = () => {
  const { courses } = useData();

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Naši Kursevi"
        subtitle="Nudimo širok spektar kurseva, od osnova za laike do naprednih programa za zdravstvene djelatnike. Pronađite kurs koji odgovara vašim potrebama."
      />

      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Trenutno nema dostupnih kurseva.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
