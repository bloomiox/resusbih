import React, { useState } from 'react';
import { NEWS_DATA, COURSES_DATA } from '../../constants';

const AnalyticsManager: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Mock analytics data - in real app this would come from analytics service
  const analyticsData = {
    pageViews: {
      '7d': 1250,
      '30d': 5420,
      '90d': 18750,
    },
    uniqueVisitors: {
      '7d': 890,
      '30d': 3210,
      '90d': 12400,
    },
    bounceRate: {
      '7d': 32.5,
      '30d': 28.7,
      '90d': 31.2,
    },
    avgSessionDuration: {
      '7d': '2:45',
      '30d': '3:12',
      '90d': '2:58',
    },
  };

  const topPages = [
    { page: 'Početna', views: 2150, percentage: 35.2 },
    { page: 'Kursevi', views: 1890, percentage: 31.0 },
    { page: 'Novosti', views: 1240, percentage: 20.3 },
    { page: 'O nama', views: 520, percentage: 8.5 },
    { page: 'Kontakt', views: 310, percentage: 5.0 },
  ];

  const topNews = NEWS_DATA.slice(0, 5).map((news, index) => ({
    title: news.title,
    views: Math.floor(Math.random() * 500) + 100,
    engagement: Math.floor(Math.random() * 30) + 10,
  }));

  const topCourses = COURSES_DATA.map((course, index) => ({
    title: course.title,
    interest: Math.floor(Math.random() * 200) + 50,
    inquiries: Math.floor(Math.random() * 20) + 5,
  }));

  const deviceStats = [
    { device: 'Desktop', percentage: 45.2, color: 'bg-blue-500' },
    { device: 'Mobile', percentage: 38.7, color: 'bg-green-500' },
    { device: 'Tablet', percentage: 16.1, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analitika sajta</h2>
          <p className="text-gray-600">Pratite performanse i angažman korisnika</p>
        </div>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
                timeRange === range
                  ? 'bg-brand-blue text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {range === '7d' ? '7 dana' : range === '30d' ? '30 dana' : '90 dana'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pregledi stranica</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.pageViews[timeRange].toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <span className="text-blue-600 text-2xl">👁️</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-green-600 text-sm font-medium">+12.5%</span>
            <span className="text-gray-500 text-sm ml-1">vs prethodni period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jedinstveni posjetioci</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.uniqueVisitors[timeRange].toLocaleString()}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <span className="text-green-600 text-2xl">👥</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-green-600 text-sm font-medium">+8.2%</span>
            <span className="text-gray-500 text-sm ml-1">vs prethodni period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.bounceRate[timeRange]}%</p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <span className="text-orange-600 text-2xl">📊</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-red-600 text-sm font-medium">-2.1%</span>
            <span className="text-gray-500 text-sm ml-1">vs prethodni period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Prosječno vrijeme</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.avgSessionDuration[timeRange]}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <span className="text-purple-600 text-2xl">⏱️</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-green-600 text-sm font-medium">+5.7%</span>
            <span className="text-gray-500 text-sm ml-1">vs prethodni period</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Najpopularnije stranice</h3>
          <div className="space-y-3">
            {topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span className="text-sm font-medium text-gray-900">{page.page}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{page.views.toLocaleString()}</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-brand-blue h-2 rounded-full"
                      style={{ width: `${page.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Stats */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Uređaji korisnika</h3>
          <div className="space-y-4">
            {deviceStats.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{device.device}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`${device.color} h-2 rounded-full`}
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{device.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top News */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Najpopularnije novosti</h3>
          <div className="space-y-3">
            {topNews.map((news, index) => (
              <div key={index} className="p-3 hover:bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 truncate">{news.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{news.views} pregleda</span>
                  <span className="text-xs text-green-600">{news.engagement}% angažman</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Interest */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interes za kurseve</h3>
          <div className="space-y-3">
            {topCourses.map((course, index) => (
              <div key={index} className="p-3 hover:bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{course.interest} pregleda</span>
                  <span className="text-xs text-blue-600">{course.inquiries} upita</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsManager;