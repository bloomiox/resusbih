import React, { useState, useEffect } from 'react';
import { CourseParticipant, Course } from '../../types';

interface ParticipantFormProps {
  participant: CourseParticipant | null;
  courses: Course[];
  onSave: (participant: Omit<CourseParticipant, 'id'>) => void;
  onCancel: () => void;
}

const ParticipantForm: React.FC<ParticipantFormProps> = ({
  participant,
  courses,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    profession: '',
    courseId: 0,
    courseName: '',
    registrationDate: new Date().toISOString().split('T')[0],
    completionDate: '',
    certificateIssued: false,
    certificateNumber: '',
    status: 'registered' as const,
    notes: '',
  });

  useEffect(() => {
    if (participant) {
      setFormData({
        firstName: participant.firstName,
        lastName: participant.lastName,
        email: participant.email,
        phone: participant.phone,
        address: participant.address,
        dateOfBirth: participant.dateOfBirth,
        profession: participant.profession,
        courseId: participant.courseId,
        courseName: participant.courseName,
        registrationDate: participant.registrationDate,
        completionDate: participant.completionDate || '',
        certificateIssued: participant.certificateIssued,
        certificateNumber: participant.certificateNumber || '',
        status: participant.status,
        notes: participant.notes || '',
      });
    }
  }, [participant]);

  const handleCourseChange = (courseId: number) => {
    const selectedCourse = courses.find(c => c.id === courseId);
    setFormData({
      ...formData,
      courseId,
      courseName: selectedCourse?.title || '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const professions = [
    'Liječnik',
    'Medicinska sestra',
    'Medicinski tehničar',
    'Pedijatar',
    'Kardiolog',
    'Anesteziolog',
    'Hitna pomoć',
    'Paramedic',
    'Fizioterapeut',
    'Student medicine',
    'Ostalo'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {participant ? 'Uredi polaznika' : 'Novi polaznik'}
          </h2>
          <p className="text-gray-600">Unesite podatke o polazniku kursa</p>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <span className="text-2xl">✕</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-brand-blue mb-4">Lični podaci</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ime *</label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              placeholder="Unesite ime"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prezime *</label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              placeholder="Unesite prezime"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              placeholder="ime@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              placeholder="+387 XX XXX XXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Datum rođenja</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profesija</label>
            <select
              value={formData.profession}
              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value="">Odaberite profesiju</option>
              {professions.map((profession) => (
                <option key={profession} value={profession}>
                  {profession}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Adresa</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              placeholder="Ulica, grad, država"
            />
          </div>

          {/* Course Information */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-semibold text-brand-blue mb-4">Informacije o kursu</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kurs *</label>
            <select
              required
              value={formData.courseId}
              onChange={(e) => handleCourseChange(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value={0}>Odaberite kurs</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} {course.registrationEnabled ? '✅' : '📋'}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              ✅ = Registracija omogućena | 📋 = Samo informativno
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Datum registracije</label>
            <input
              type="date"
              value={formData.registrationDate}
              onChange={(e) => setFormData({ ...formData, registrationDate: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value="registered">Registrovan</option>
              <option value="completed">Završeno</option>
              <option value="cancelled">Otkazano</option>
            </select>
          </div>

          {formData.status === 'completed' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Datum završetka</label>
              <input
                type="date"
                value={formData.completionDate}
                onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              />
            </div>
          )}

          {formData.status === 'completed' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Broj certifikata</label>
              <input
                type="text"
                value={formData.certificateNumber}
                onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                placeholder="RESUSBIH-2025-XXX"
              />
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Napomene</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              placeholder="Dodatne napomene o polazniku..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Otkaži
          </button>
          <button
            type="submit"
            className="bg-brand-blue hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
          >
            {participant ? 'Ažuriraj' : 'Dodaj'} polaznika
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParticipantForm;