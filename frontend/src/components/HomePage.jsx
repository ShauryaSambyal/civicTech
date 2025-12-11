import React, { useState } from 'react';
import { MapPin, TrendingUp, CheckCircle, Clock, AlertCircle, Search } from 'lucide-react';
import { CATEGORIES, STATUS_CONFIG } from './constants';

export default function HomePage({ issues, setSelectedIssue }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || issue.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Issues</p>
              <p className="text-3xl font-bold mt-1">{issues.length}</p>
            </div>
            <AlertCircle size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Pending</p>
              <p className="text-3xl font-bold mt-1">{issues.filter(i => i.status === 'reported').length}</p>
            </div>
            <Clock size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">In Progress</p>
              <p className="text-3xl font-bold mt-1">{issues.filter(i => i.status === 'in-progress').length}</p>
            </div>
            <TrendingUp size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Resolved</p>
              <p className="text-3xl font-bold mt-1">{issues.filter(i => i.status === 'resolved').length}</p>
            </div>
            <CheckCircle size={40} className="opacity-80" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="reported">Reported</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIssues.map(issue => {
          const category = CATEGORIES.find(c => c.id === issue.category);
          const statusConfig = STATUS_CONFIG[issue.status];
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={issue.id}
              onClick={() => setSelectedIssue(issue)}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={issue.image}
                  alt={issue.title}
                  className="w-full h-48 object-cover"
                />
                <div className={`absolute top-3 right-3 ${category.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                  {category.icon} {category.name}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-2">{issue.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{issue.description}</p>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <MapPin size={16} />
                  <span className="line-clamp-1">{issue.location.address}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.color}`}>
                    <StatusIcon size={16} />
                    <span className="text-sm font-medium">{statusConfig.label}</span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-600">
                    <TrendingUp size={18} />
                    <span className="font-semibold">{issue.upvotes}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
