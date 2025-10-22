import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Page } from '../../types';
import NewsManager from '../admin/NewsManager';
import CoursesManager from '../admin/CoursesManager';
import PageContentManager from '../admin/PageContentManager';
import TeamManager from '../admin/TeamManager';
import AnalyticsManager from '../admin/AnalyticsManager';
import SettingsManager from '../admin/SettingsManager';
import DashboardOverview from '../admin/DashboardOverview';
import CRMManager from '../admin/CRMManager';

interface AdminPageProps {
  setCurrentPage: (page: Page) => void;
}

type AdminTab = 'dashboard' | 'news' | 'courses' | 'content' | 'team' | 'crm' | 'analytics' | 'settings';

const AdminPage: React.FC<AdminPageProps> = ({ setCurrentPage }) => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const handleLogout = () => {
    logout();
    setCurrentPage(Page.Home);
  };

  const tabs = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: '📊', color: 'text-blue-600' },
    { id: 'news' as AdminTab, label: 'Novosti', icon: '📰', color: 'text-green-600' },
    { id: 'courses' as AdminTab, label: 'Kursevi', icon: '🎓', color: 'text-purple-600' },
    { id: 'content' as AdminTab, label: 'Sadržaj stranica', icon: '📝', color: 'text-orange-600' },
    { id: 'team' as AdminTab, label: 'Tim', icon: '👥', color: 'text-indigo-600' },
    { id: 'crm' as AdminTab, label: 'CRM', icon: '👤', color: 'text-teal-600' },
    { id: 'analytics' as AdminTab, label: 'Analitika', icon: '📈', color: 'text-pink-600' },
    { id: 'settings' as AdminTab, label: 'Postavke', icon: '⚙️', color: 'text-gray-600' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview setActiveTab={setActiveTab} />;
      case 'news':
        return <NewsManager />;
      case 'courses':
        return <CoursesManager />;
      case 'content':
        return <PageContentManager />;
      case 'team':
        return <TeamManager />;
      case 'crm':
        return <CRMManager />;
      case 'analytics':
        return <AnalyticsManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <DashboardOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray">
      {/* Header */}
      <div className="bg-brand-blue shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <img
                src="https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/RESUSBIH%20LOGO.png"
                alt="RESUSBIH Logo"
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-3xl font-black text-white tracking-wider">RESUSBIH</h1>
                <p className="text-sm text-blue-200">Admin Panel - Dobrodošli, {user?.email}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setCurrentPage(Page.Home)}
                className="bg-brand-white text-brand-blue hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <span>🌐</span>
                <span>Pregled sajta</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <span>🚪</span>
                <span>Odjava</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${activeTab === tab.id
                  ? 'bg-brand-blue text-white border-brand-blue'
                  : 'text-gray-600 hover:text-brand-blue hover:bg-blue-50'
                  } whitespace-nowrap py-4 px-6 font-semibold text-sm flex items-center space-x-2 border-b-2 border-transparent transition-all duration-200 first:rounded-tl-lg last:rounded-tr-lg`}
              >
                <span className={`text-lg ${activeTab === tab.id ? 'text-white' : tab.color}`}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;