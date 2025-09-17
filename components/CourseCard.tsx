
import React, { useState } from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl">
      <img className="h-56 w-full object-cover" src={course.imageUrl} alt={course.title} />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-brand-blue mb-2">{course.title}</h3>
        <p className="text-sm text-gray-500 font-semibold mb-3">ZA: {course.audience}</p>
        <p className="text-gray-700 flex-grow">{course.description}</p>
        
        {/* Expanded Details Section */}
        <div 
          className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 mt-4' : 'max-h-0'}`}
        >
          <div className="border-t pt-4">
            <p className="font-semibold text-gray-800"><strong>Trajanje:</strong> {course.details.duration}</p>
            <p className="font-semibold text-gray-800 mt-1"><strong>Certifikat:</strong> {course.details.certification}</p>
            <h4 className="font-bold text-brand-blue mt-3 mb-1">Teme koje pokrivamo:</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {course.details.topics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </div>
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-6 bg-brand-blue hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded-lg self-start transition-colors"
          aria-expanded={isExpanded}
          aria-controls={`course-details-${course.id}`}
        >
          {isExpanded ? 'Zatvori' : 'Saznaj više'}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
