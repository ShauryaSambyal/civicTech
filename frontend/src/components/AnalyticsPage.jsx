import React from 'react';
import { CATEGORIES } from './constants';

export default function AnalyticsPage({ issues }) {
  const categoryStats = CATEGORIES.map(cat => ({
    ...cat,
    count: issues.filter(i => i.category === cat.id).length
  }));

  const statusStats = [
    { status: 'reported', label: 'Reported', count: issues.filter(i => i.status === 'reported').length, color: 'bg-orange-500' },
    { status: 'in-progress', label: 'In Progress', count: issues.filter(i => i.status === 'in-progress').length, color: 'bg-blue-500' },
    { status: 'resolved', label: 'Resolved', count: issues.filter(i => i.status === 'resolved').length, color: 'bg-green-500' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Analytics Dashboard</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Issues by Category</h3>
          <div className="space-y-4">
            {categoryStats.map(cat => (
              <div key={cat.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{cat.icon} {cat.name}</span>
                  <span className="text-sm font-bold text-gray-800">{cat.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${cat.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${(cat.count / (issues.length || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Issues by Status</h3>
          <div className="space-y-4">
            {statusStats.map(stat => (
              <div key={stat.status}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                  <span className="text-sm font-bold text-gray-800">{stat.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${stat.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${(stat.count / (issues.length || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{issues.length}</p>
            <p className="text-sm opacity-90">Total Issues</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{issues.length ? Math.round((issues.filter(i => i.status === 'resolved').length / issues.length) * 100) : 0}%</p>
            <p className="text-sm opacity-90">Resolution Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{issues.length ? Math.max(...issues.map(i => i.upvotes)) : 0}</p>
            <p className="text-sm opacity-90">Most Upvoted</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{new Set(issues.map(i => i.reportedBy)).size}</p>
            <p className="text-sm opacity-90">Active Citizens</p>
          </div>
        </div>
      </div>
    </div>
  );
}
