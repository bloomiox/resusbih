import React, { useState } from 'react';
import { CourseParticipant } from '../../types';
import { PARTICIPANTS_DATA, COURSES_DATA } from '../../constants';
import ParticipantForm from './ParticipantForm';
import CertificateGenerator from './CertificateGenerator';

const CRMManager: React.FC = () => {
  const [participants, setParticipants] = useState<CourseParticipant[]>(PARTICIPANTS_DATA);
  const [editingParticipant, setEditingParticipant] = useState<CourseParticipant | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<CourseParticipant | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'registered' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (participant: CourseParticipant) => {
    setEditingParticipant(participant);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingParticipant(null);
    setIsCreating(true);
  };

  const handleSave = (participantData: Omit<CourseParticipant, 'id'>) => {
    if (editingParticipant) {
      setParticipants(participants.map(p => 
        p.id === editingParticipant.id 
          ? { ...participantData, id: editingParticipant.id }
          : p
      ));
    } else {
      const newParticipant: CourseParticipant = {
        ...participantData,
        id: Math.max(...participants.map(p => p.id)) + 1,
      };
      setParticipants([...participants, newParticipant]);
    }
    setEditingParticipant(null);
    setIsCreating(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Jeste li sigurni da želite obrisati ovog polaznika?')) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  const handleCancel = () => {
    setEditingParticipant(null);
    setIsCreating(false);
  };

  const handleGenerateCertificate = (participant: CourseParticipant) => {
    setSelectedParticipant(participant);
    setShowCertificate(true);
  };

  const handleMarkCompleted = (id: number) => {
    setParticipants(participants.map(p => 
      p.id === id 
        ? { 
            ...p, 
            status: 'completed' as const,
            completionDate: new Date().toISOString().split('T')[0],
            certificateNumber: `RESUSBIH-${new Date().getFullYear()}-${String(Math.max(...participants.map(p => parseInt(p.certificateNumber?.split('-')[2] || '0'))) + 1).padStart(3, '0')}`
          }
        : p
    ));
  };

  const handleIssueCertificate = (id: number) => {
    setParticipants(participants.map(p => 
      p.id === id 
        ? { ...p, certificateIssued: true }
        : p
    ));
  };

  const filteredParticipants = participants.filter(participant => {
    const matchesStatus = filterStatus === 'all' || participant.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      participant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'registered': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Završeno';
      case 'registered': return 'Registrovan';
      case 'cancelled': return 'Otkazano';
      default: return status;
    }
  };

  const stats = {
    total: participants.length,
    completed: participants.filter(p => p.status === 'completed').length,
    registered: participants.filter(p => p.status === 'registered').length,
    certificatesIssued: participants.filter(p => p.certificateIssued).length,
  };

  if (showCertificate && selectedParticipant) {
    return (
      <CertificateGenerator
        participant={selectedParticipant}
        onClose={() => {
          setShowCertificate(false);
          setSelectedParticipant(null);
        }}
        onCertificateIssued={() => handleIssueCertificate(selectedParticipant.id)}
      />
    );
  }

  if (editingParticipant || isCreating) {
    return (
      <ParticipantForm
        participant={editingParticipant}
        courses={COURSES_DATA}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">CRM - Upravljanje polaznicima</h2>
          <p className="text-gray-600">Upravljajte registracijama, kontaktima i certifikatima polaznika</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-brand-blue hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Dodaj polaznika</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ukupno polaznika</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-2">
              <span className="text-blue-600 text-xl">👥</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Završeni kursevi</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
            <div className="bg-green-100 rounded-full p-2">
              <span className="text-green-600 text-xl">✅</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktivne registracije</p>
              <p className="text-2xl font-bold text-gray-900">{stats.registered}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-2">
              <span className="text-yellow-600 text-xl">📝</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Izdani certifikati</p>
              <p className="text-2xl font-bold text-gray-900">{stats.certificatesIssued}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-2">
              <span className="text-purple-600 text-xl">🏆</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-2">
            {(['all', 'registered', 'completed', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
                  filterStatus === status
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'Svi' : getStatusText(status)}
              </button>
            ))}
          </div>
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Pretraži po imenu, email-u ili kursu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Polaznik
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontakt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kurs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certifikat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcije
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredParticipants.map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {participant.firstName} {participant.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{participant.profession}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{participant.email}</div>
                    <div className="text-sm text-gray-500">{participant.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{participant.courseName}</div>
                    <div className="text-sm text-gray-500">
                      Registracija: {new Date(participant.registrationDate).toLocaleDateString('hr-HR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(participant.status)}`}>
                      {getStatusText(participant.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {participant.certificateNumber ? (
                      <div>
                        <div className="text-sm text-gray-900">{participant.certificateNumber}</div>
                        <div className={`text-xs ${participant.certificateIssued ? 'text-green-600' : 'text-orange-600'}`}>
                          {participant.certificateIssued ? 'Izdan' : 'Čeka izdavanje'}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(participant)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Uredi
                    </button>
                    {participant.status === 'registered' && (
                      <button
                        onClick={() => handleMarkCompleted(participant.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Završi
                      </button>
                    )}
                    {participant.status === 'completed' && (
                      <button
                        onClick={() => handleGenerateCertificate(participant)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Certifikat
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(participant.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Obriši
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CRMManager;