import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

export const MOCK_ISSUES = [
  {
    id: 1,
    title: "Large pothole on Main Road",
    description: "Dangerous pothole causing accidents near City Mall",
    category: "roads",
    status: "reported",
    location: { lat: 13.0827, lng: 80.2707, address: "Main Road, Anna Nagar" },
    image: "https://images.unsplash.com/photo-1564577160324-112d603f750f?w=400",
    upvotes: 45,
    createdAt: "2024-03-10",
    reportedBy: "John Doe"
  },
  {
    id: 2,
    title: "Broken streetlight",
    description: "Street light not working for past 2 weeks",
    category: "electricity",
    status: "in-progress",
    location: { lat: 13.0878, lng: 80.2785, address: "Park Avenue, T Nagar" },
    image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400",
    upvotes: 23,
    createdAt: "2024-03-08",
    reportedBy: "Jane Smith"
  },
  {
    id: 3,
    title: "Garbage pile near school",
    description: "Uncollected garbage causing health issues",
    category: "sanitation",
    status: "resolved",
    location: { lat: 13.0358, lng: 80.2464, address: "School Street, Adyar" },
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400",
    upvotes: 67,
    createdAt: "2024-03-05",
    reportedBy: "Mike Johnson"
  }
];

export const CATEGORIES = [
  { id: 'roads', name: 'Roads & Potholes', icon: '🛣️', color: 'bg-red-500' },
  { id: 'sanitation', name: 'Garbage & Sanitation', icon: '🗑️', color: 'bg-green-500' },
  { id: 'electricity', name: 'Street Lights', icon: '💡', color: 'bg-yellow-500' },
  { id: 'water', name: 'Water Supply', icon: '💧', color: 'bg-blue-500' },
  { id: 'drainage', name: 'Drainage', icon: '🚰', color: 'bg-purple-500' },
  { id: 'other', name: 'Other Issues', icon: '📋', color: 'bg-gray-500' }
];

export const STATUS_CONFIG = {
  reported: { label: 'Reported', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Clock },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700', icon: CheckCircle }
};
