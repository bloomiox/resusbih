import React, { useState, useEffect } from 'react';
import { analyticsService, AnalyticsMetrics, TIME_RANGES } from '../../services/analyticsService';

const AnalyticsManager: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, [timeRange]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getMetrics(timeRange);
      setMetrics(data);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Greška pri učitavanju analitike');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Učitavanje analitike...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <span className="text-red-500 text-xl mr-3">⚠️</span>
          <div>
            <h3 className="text-red-800 font-medium">Greška</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
        <button
          onClick={loadMetrics}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          Pokušaj ponovo
        </button>
      </div>
    );
  }

  if (!metrics) return null;

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
              <p className="text-3xl font-bold text-gray-900">{metrics.pageViews.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <span className="text-blue-600 text-2xl">👁️</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-gray-500 text-sm">Zadnjih {TIME_RANGES[timeRange].label}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jedinstveni posjetioci</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.uniqueVisitors.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <span className="text-green-600 text-2xl">👥</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-gray-500 text-sm">Zadnjih {TIME_RANGES[timeRange].label}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Registracije</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.registrations}</p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <span className="text-orange-600 text-2xl">📝</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-gray-500 text-sm">Zadnjih {TIME_RANGES[timeRange].label}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.bounceRate}%</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <span className="text-purple-600 text-2xl">📊</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-gray-500 text-sm">Prosječno</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Najpopularnije stranice</h3>
          <div className="space-y-3">
            {metrics.topPages.length > 0 ? (
              metrics.topPages.map((page, index) => (
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
                        style={{ width: `${Math.min(page.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Nema podataka za odabrani period</p>
            )}
          </div>
        </div>

        {/* Device Stats */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Uređaji korisnika</h3>
          <div className="space-y-4">
            {metrics.deviceStats.map((device, index) => (
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
            {metrics.topNews.length > 0 ? (
              metrics.topNews.map((news, index) => (
                <div key={index} className="p-3 hover:bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 truncate">{news.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{news.views} pregleda</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Nema podataka za odabrani period</p>
            )}
          </div>
        </div>

        {/* Course Interest */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interes za kurseve</h3>
          <div className="space-y-3">
            {metrics.topCourses.length > 0 ? (
              metrics.topCourses.map((course, index) => (
                <div key={index} className="p-3 hover:bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{course.views} pregleda</span>
                    <span className="text-xs text-blue-600">{course.registrations} registracija</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Nema podataka za odabrani period</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsManager;