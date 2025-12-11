import React from 'react';
import { MapPin, User, Clock, X, TrendingUp } from 'lucide-react';
import { CATEGORIES, STATUS_CONFIG } from './constants';

export default function IssueDetailModal({ issue, onClose, onUpvote }) {
  if (!issue) return null;

  const category = CATEGORIES.find(c => c.id === issue.category);
  const statusConfig = STATUS_CONFIG[issue.status];
  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Issue Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition">
            <X size={24} className="text-gray-600 dark:text-gray-200" />
          </button>
        </div>

        <div className="p-4 md:p-6">
          <img src={issue.image} alt={issue.title} className="w-full h-56 md:h-64 object-cover rounded-lg mb-4" />

          <div className="flex items-center gap-3 mb-4">
            <div className={`${category.color} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
              {category.icon} {category.name}
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.color}`}>
              <StatusIcon size={18} />
              <span className="text-sm font-medium">{statusConfig.label}</span>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-3">{issue.title}</h3>
          <p className="text-gray-600 mb-4">{issue.description}</p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={20} />
              <span>{issue.location.address}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <User size={20} />
              <span>Reported by {issue.reportedBy}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={20} />
              <span>Reported on {new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <button
            onClick={() => onUpvote(issue.id)}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition flex items-center justify-center gap-2"
          >
            <TrendingUp size={20} />
            <span>Upvote This Issue ({issue.upvotes})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
