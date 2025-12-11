import React, { useState } from 'react';
import { AlertCircle, MapPin, Camera, X, Upload } from 'lucide-react';
import { CATEGORIES } from './constants';

//I did'nt understand the frontend code at all. please explain this in simple terms do i can understand in a simpler way explaining all the concepts so that i can stay ahead of the present generation trying to understand this code

export default function ReportIssuePage({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
      alert('Issue reported successfully!');
      setFormData({ title: '', description: '', category: '', location: '', image: null });
      setImagePreview(null);
    }, 1500);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            location: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
          });
          alert('Location captured successfully!');
        },
        () => {
          alert('Unable to get location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
            <AlertCircle className="text-blue-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Report an Issue</h2>
          <p className="text-gray-600">Help make your city better by reporting civic issues</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Issue Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief title of the issue"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`p-3 rounded-lg border-2 transition ${
                    formData.category === cat.id
                      ? `${cat.color} text-white border-transparent`
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="text-xs font-medium">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide detailed description of the issue"
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter location or use GPS"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleGetLocation}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <MapPin size={20} />
                <span className="hidden md:inline">GPS</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Photo</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => { setImagePreview(null); setFormData({ ...formData, image: null }); }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer">
                  <Camera className="text-gray-400 mb-3" size={48} />
                  <span className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</span>
                  <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span>Submit Issue Report</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
