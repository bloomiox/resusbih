import React, { useState } from 'react';
import { TeamMember } from '../../types';
import { useData } from '../../contexts/DataContext';

const TeamManager: React.FC = () => {
  const { team: members, addTeamMember, updateTeamMember, deleteTeamMember } = useData();
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    spec: '',
    imageUrl: '',
  });

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      spec: member.spec,
      imageUrl: member.imageUrl,
    });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      spec: '',
      imageUrl: '',
    });
    setIsCreating(true);
  };

  const handleSave = () => {
    if (editingMember) {
      updateTeamMember(editingMember.id, formData);
    } else {
      addTeamMember(formData);
    }
    setEditingMember(null);
    setIsCreating(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Jeste li sigurni da želite ukloniti ovog člana tima?')) {
      deleteTeamMember(id);
    }
  };

  const handleCancel = () => {
    setEditingMember(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upravljanje timom</h2>
          <p className="text-gray-600">Dodajte i uredite članove vašeg tima</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-brand-blue hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Dodaj člana</span>
        </button>
      </div>

      {(editingMember || isCreating) && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-brand-blue">
            {editingMember ? 'Uredi člana tima' : 'Novi član tima'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ime i prezime</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                placeholder="Dr. Ime Prezime"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pozicija</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                placeholder="Predsjednik, Sekretar, Član..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Specijalizacija</label>
              <input
                type="text"
                value={formData.spec}
                onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                placeholder="Specijalista urgentne medicine"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">URL fotografije</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
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
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="aspect-w-3 aspect-h-4">
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-sm text-brand-blue font-medium mb-1">{member.role}</p>
              <p className="text-sm text-gray-600 mb-4">{member.spec}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-lg text-sm transition-colors duration-200"
                >
                  Uredi
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-lg text-sm transition-colors duration-200"
                >
                  Ukloni
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManager;