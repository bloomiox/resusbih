import React, { useState } from 'react';
import { Course } from '../../types';
import { useData } from '../../contexts/DataContext';

const CoursesManager: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useData();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audience: '',
    imageUrl: '',
    duration: '',
    certification: '',
    topics: [''],
    registrationEnabled: false,
  });

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      audience: course.audience,
      imageUrl: course.imageUrl,
      duration: course.details.duration,
      certification: course.details.certification,
      topics: course.details.topics,
      registrationEnabled: course.registrationEnabled,
    });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      audience: '',
      imageUrl: '',
      duration: '',
      certification: '',
      topics: [''],
      registrationEnabled: false,
    });
    setIsCreating(true);
  };

  const handleSave = () => {
    const courseData = {
      title: formData.title,
      description: formData.description,
      audience: formData.audience,
      imageUrl: formData.imageUrl,
      registrationEnabled: formData.registrationEnabled,
      details: {
        duration: formData.duration,
        certification: formData.certification,
        topics: formData.topics.filter(topic => topic.trim() !== ''),
      },
    };

    if (editingCourse) {
      updateCourse(editingCourse.id, courseData);
    } else {
      addCourse(courseData);
    }
    setEditingCourse(null);
    setIsCreating(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Jeste li sigurni da želite obrisati ovaj kurs?')) {
      deleteCourse(id);
    }
  };

  const handleCancel = () => {
    setEditingCourse(null);
    setIsCreating(false);
  };

  const addTopic = () => {
    setFormData({ ...formData, topics: [...formData.topics, ''] });
  };

  const removeTopic = (index: number) => {
    setFormData({
      ...formData,
      topics: formData.topics.filter((_, i) => i !== index)
    });
  };

  const updateTopic = (index: number, value: string) => {
    const newTopics = [...formData.topics];
    newTopics[index] = value;
    setFormData({ ...formData, topics: newTopics });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upravljanje kursevima</h2>
          <p className="text-gray-600">Dodajte, uredite i upravljajte kursevima koje nudite</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-brand-blue hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Dodaj novi kurs</span>
        </button>
      </div>

      {(editingCourse || isCreating) && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-brand-blue">
            {editingCourse ? 'Uredi kurs' : 'Novi kurs'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Naslov kursa</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Opis</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ciljna grupa</label>
              <input
                type="text"
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">URL slike</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Trajanje</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Certifikacija</label>
              <input
                type="text"
                value={formData.certification}
                onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="registrationEnabled"
                  checked={formData.registrationEnabled}
                  onChange={(e) => setFormData({ ...formData, registrationEnabled: e.target.checked })}
                  className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                />
                <label htmlFor="registrationEnabled" className="text-sm font-medium text-gray-700">
                  Omogući registraciju za ovaj kurs
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Kada je omogućeno, korisnici mogu da se registruju za kurs sa sajta. Onemogućite za informativne kurseve.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Teme kursa</label>
              {formData.topics.map((topic, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => updateTopic(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Unesite temu"
                  />
                  <button
                    onClick={() => removeTopic(index)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded"
                  >
                    -
                  </button>
                </div>
              ))}
              <button
                onClick={addTopic}
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
              >
                + Dodaj temu
              </button>
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
          {courses.map((course) => (
            <li key={course.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${course.registrationEnabled
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {course.registrationEnabled ? 'Registracija omogućena' : 'Samo informativno'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{course.description}</p>
                  <p className="text-sm text-brand-blue font-medium mt-1">
                    Trajanje: {course.details.duration} | {course.audience}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-lg text-sm transition-colors duration-200"
                  >
                    Uredi
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
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

export default CoursesManager;