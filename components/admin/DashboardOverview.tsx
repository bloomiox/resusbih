import React from 'react';
import { useData } from '../../contexts/DataContext';

interface DashboardOverviewProps {
  setActiveTab: (tab: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ setActiveTab }) => {
  const { news, courses, team, participants } = useData();
  
  const stats = [
    {
      title: 'Ukupno novosti',
      value: news.length,
      icon: '📰',
      color: 'bg-green-500',
      action: () => setActiveTab('news'),
    },
    {
      title: 'Aktivni kursevi',
      value: courses.length,
      icon: '🎓',
      color: 'bg-purple-500',
      action: () => setActiveTab('courses'),
    },
    {
      title: 'Polaznici',
      value: participants.length,
      icon: '👤',
      color: 'bg-teal-500',
      action: () => setActiveTab('crm'),
    },
    {
      title: 'Članovi tima',
      value: team.length,
      icon: '👥',
      color: 'bg-indigo-500',
      action: () => setActiveTab('team'),
    },
  ];

  const recentNews = news.slice(0, 3);
  const recentCourses = courses.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-brand-blue to-blue-700 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Dobrodošli u Admin Panel</h2>
        <p className="text-blue-100">
          Upravljajte sadržajem vašeg sajta, pratite statistike i održavajte kvalitet informacija.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={stat.action}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-brand-blue transition-colors">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} rounded-full p-3 text-white text-2xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent News */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Najnovije novosti</h3>
            <button
              onClick={() => setActiveTab('news')}
              className="text-brand-blue hover:text-blue-700 text-sm font-medium"
            >
              Prikaži sve →
            </button>
          </div>
          <div className="space-y-3">
            {recentNews.map((news) => (
              <div key={news.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="bg-green-100 rounded-full p-2">
                  <span className="text-green-600">📰</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{news.title}</p>
                  <p className="text-xs text-gray-500">{news.publishDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Popularni kursevi</h3>
            <button
              onClick={() => setActiveTab('courses')}
              className="text-brand-blue hover:text-blue-700 text-sm font-medium"
            >
              Prikaži sve →
            </button>
          </div>
          <div className="space-y-3">
            {recentCourses.map((course) => (
              <div key={course.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="bg-purple-100 rounded-full p-2">
                  <span className="text-purple-600">🎓</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                  <p className="text-xs text-gray-500">{course.details.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Participants */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Novi polaznici</h3>
            <button
              onClick={() => setActiveTab('crm')}
              className="text-brand-blue hover:text-blue-700 text-sm font-medium"
            >
              Prikaži sve →
            </button>
          </div>
          <div className="space-y-3">
            {participants.slice(0, 3).map((participant) => (
              <div key={participant.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="bg-teal-100 rounded-full p-2">
                  <span className="text-teal-600">👤</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {participant.firstName} {participant.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{participant.courseName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Brze akcije</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('news')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-brand-blue hover:bg-blue-50 transition-colors"
          >
            <span className="text-2xl">➕</span>
            <span className="font-medium text-gray-700">Dodaj novost</span>
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-brand-blue hover:bg-blue-50 transition-colors"
          >
            <span className="text-2xl">🎓</span>
            <span className="font-medium text-gray-700">Novi kurs</span>
          </button>
          <button
            onClick={() => setActiveTab('crm')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-brand-blue hover:bg-blue-50 transition-colors"
          >
            <span className="text-2xl">👤</span>
            <span className="font-medium text-gray-700">Dodaj polaznika</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;