import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import eventsAPI from '../api/eventsAPI';

export default function CreateEvent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    venue: {
      name: '',
      address: '',
      city: '',
      capacity: ''
    },
    date: '',
    time: {
      start: '',
      end: ''
    },
    pricing: {
      ticketPrice: '',
      currency: 'LKR'
    },
    categories: [],
    tags: '',
    images: []
  });

  const categories = [
    'Live Music',
    'EDM Music', 
    'Innovation',
    'Food Festivals',
    'Sports',
    'Art',
    'Technology'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Event name is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Event description is required');
      }
      if (!formData.venue.name.trim()) {
        throw new Error('Venue name is required');
      }
      if (!formData.venue.address.trim()) {
        throw new Error('Venue address is required');
      }
      if (!formData.venue.city.trim()) {
        throw new Error('City is required');
      }
      if (!formData.venue.capacity || parseInt(formData.venue.capacity) < 1) {
        throw new Error('Venue capacity must be at least 1');
      }
      if (!formData.date) {
        throw new Error('Event date is required');
      }
      if (!formData.time.start) {
        throw new Error('Start time is required');
      }
      if (!formData.time.end) {
        throw new Error('End time is required');
      }
      if (!formData.pricing.ticketPrice || parseFloat(formData.pricing.ticketPrice) < 0) {
        throw new Error('Ticket price must be a positive number');
      }
      if (formData.categories.length === 0) {
        throw new Error('Please select at least one category');
      }

      // Validate user is logged in
      if (!user || (!user.id && !user._id)) {
        throw new Error('You must be logged in to create an event');
      }

      // Validate date is in the future (backend requires this)
      const eventDate = new Date(formData.date);
      const now = new Date();
      
      // Reset time components for accurate date comparison
      eventDate.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
      
      if (eventDate <= now) {
        throw new Error('Event date must be in the future');
      }

      // Validate time format (HH:MM)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(formData.time.start)) {
        throw new Error('Start time must be in HH:MM format');
      }
      if (!timeRegex.test(formData.time.end)) {
        throw new Error('End time must be in HH:MM format');
      }

      // Prepare the data for submission
      const eventData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        venue: {
          name: formData.venue.name.trim(),
          address: formData.venue.address.trim(),
          city: formData.venue.city.trim(),
          capacity: parseInt(formData.venue.capacity)
        },
        date: formData.date, // Keep as YYYY-MM-DD format
        time: {
          start: formData.time.start,
          end: formData.time.end
        },
        pricing: {
          ticketPrice: parseFloat(formData.pricing.ticketPrice),
          currency: formData.pricing.currency
        },
        categories: formData.categories,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        organizer: user?.id || user?._id, // Add organizer ID (handle both id and _id)
        status: 'upcoming', // Set default status
        seatConfiguration: {
          totalSeats: parseInt(formData.venue.capacity),
          availableSeats: parseInt(formData.venue.capacity),
          bookedSeats: 0,
          reservedSeats: 0
        }
      };

      console.log('Submitting event data:', eventData); // Debug log
      console.log('User object:', user); // Debug log
      console.log('Form data before submission:', formData); // Debug log
      console.log('Event date validation:', {
        formDataDate: formData.date,
        eventDate: eventDate,
        now: now,
        isValid: eventDate > now
      });

      const response = await eventsAPI.createEvent(eventData);
      console.log('Create event response:', response); // Debug log
      
      // Check if event was created successfully
      if (response.success || response.data || response._id) {
        // Success - redirect to manage events
        navigate('/manage-events', { 
          state: { 
            message: 'Event created successfully!', 
            type: 'success' 
          } 
        });
      } else {
        throw new Error('Event creation failed');
      }
    } catch (err) {
      console.error('Error creating event:', err);
      
      // Handle specific API errors
      if (err.message && err.message.includes('Validation')) {
        setError('Please check all required fields and try again');
      } else if (err.message && err.message.includes('authorization')) {
        setError('You need to be logged in to create events');
      } else {
        setError(err.message || 'Failed to create event');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/manage-events');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
            </div>
            <div className="text-sm text-gray-500">
              Organizer: {user?.name || 'Unknown'}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter event name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your event"
                />
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Date & Time</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // Tomorrow
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="time.start"
                  value={formData.time.start}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  name="time.end"
                  value={formData.time.end}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Venue Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Venue Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Name *
                </label>
                <input
                  type="text"
                  name="venue.name"
                  value={formData.venue.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter venue name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="venue.city"
                  value={formData.venue.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter city"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="venue.address"
                  value={formData.venue.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity *
                </label>
                <input
                  type="number"
                  name="venue.capacity"
                  value={formData.venue.capacity}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Maximum attendees"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Price *
                </label>
                <input
                  type="number"
                  name="pricing.ticketPrice"
                  value={formData.pricing.ticketPrice}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  name="pricing.currency"
                  value={formData.pricing.currency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LKR">LKR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Categories *</h2>
            <p className="text-sm text-gray-600 mb-4">Select at least one category for your event</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((category) => (
                <label
                  key={category}
                  className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg border-2 transition-colors ${
                    formData.categories.includes(category)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">{category}</span>
                </label>
              ))}
            </div>
            
            {formData.categories.length === 0 && (
              <p className="text-red-600 text-sm mt-2">Please select at least one category</p>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags (Optional)</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="music, festival, outdoor (comma separated)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple tags with commas
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
