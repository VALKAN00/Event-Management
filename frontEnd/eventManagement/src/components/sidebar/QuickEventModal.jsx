import { useState } from 'react';
import eventsAPI from '../../api/eventsAPI';

export default function QuickEventModal({ isOpen, onClose, onSuccess }) {
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
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const categories = [
    'Live Music', 'EDM Music', 'Innovation', 
    'Food Festivals', 'Sports', 'Art', 'Technology'
  ];

  const currencies = ['LKR', 'USD', 'EUR', 'GBP'];

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Event name is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (formData.description.length > 1000) newErrors.description = 'Description cannot exceed 1000 characters';
    }

    if (step === 2) {
      if (!formData.venue.name.trim()) newErrors.venueName = 'Venue name is required';
      if (!formData.venue.address.trim()) newErrors.venueAddress = 'Venue address is required';
      if (!formData.venue.city.trim()) newErrors.venueCity = 'City is required';
      if (!formData.venue.capacity || formData.venue.capacity < 1) newErrors.venueCapacity = 'Valid capacity is required';
    }

    if (step === 3) {
      if (!formData.date) newErrors.date = 'Event date is required';
      if (!formData.time.start) newErrors.startTime = 'Start time is required';
      if (!formData.time.end) newErrors.endTime = 'End time is required';
      if (!formData.pricing.ticketPrice || formData.pricing.ticketPrice < 0) {
        newErrors.ticketPrice = 'Valid ticket price is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
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

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      // Prepare data for API
      const eventData = {
        ...formData,
        venue: {
          ...formData.venue,
          capacity: parseInt(formData.venue.capacity),
          country: 'Sri Lanka'
        },
        pricing: {
          ...formData.pricing,
          ticketPrice: parseFloat(formData.pricing.ticketPrice)
        }
      };

      // Call the actual API
      const response = await eventsAPI.createEvent(eventData);
      console.log('Event created successfully:', response);
      
      onSuccess?.();
      onClose();
      resetForm();
    } catch {
      setErrors({ submit: 'Failed to create event. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      venue: { name: '', address: '', city: '', capacity: '' },
      date: '',
      time: { start: '', end: '' },
      pricing: { ticketPrice: '', currency: 'LKR' },
      categories: [],
      tags: []
    });
    setCurrentStep(1);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Quick Event Creation</h2>
            <p className="text-gray-400 text-sm">Step {currentStep} of 3</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${currentStep >= 1 ? 'text-blue-400' : 'text-gray-400'}`}>
              Basic Info
            </span>
            <span className={`text-sm ${currentStep >= 2 ? 'text-blue-400' : 'text-gray-400'}`}>
              Venue Details
            </span>
            <span className={`text-sm ${currentStep >= 3 ? 'text-blue-400' : 'text-gray-400'}`}>
              Schedule & Pricing
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter event name"
                maxLength={100}
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                placeholder="Describe your event..."
                maxLength={1000}
              />
              <div className="flex justify-between mt-1">
                {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
                <p className="text-gray-400 text-xs">{formData.description.length}/1000</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categories
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      formData.categories.includes(category)
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#111111] text-gray-400 hover:text-white border border-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <input
                type="text"
                onKeyDown={handleTagInput}
                className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Press Enter to add tags..."
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Venue Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Venue Name *
              </label>
              <input
                type="text"
                name="venue.name"
                value={formData.venue.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter venue name"
              />
              {errors.venueName && <p className="text-red-400 text-sm mt-1">{errors.venueName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Venue Address *
              </label>
              <input
                type="text"
                name="venue.address"
                value={formData.venue.address}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter full address"
              />
              {errors.venueAddress && <p className="text-red-400 text-sm mt-1">{errors.venueAddress}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="venue.city"
                  value={formData.venue.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter city"
                />
                {errors.venueCity && <p className="text-red-400 text-sm mt-1">{errors.venueCity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Venue Capacity *
                </label>
                <input
                  type="number"
                  name="venue.capacity"
                  value={formData.venue.capacity}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Max attendees"
                />
                {errors.venueCapacity && <p className="text-red-400 text-sm mt-1">{errors.venueCapacity}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Schedule & Pricing */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
              {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="time.start"
                  value={formData.time.start}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                {errors.startTime && <p className="text-red-400 text-sm mt-1">{errors.startTime}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  name="time.end"
                  value={formData.time.end}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                {errors.endTime && <p className="text-red-400 text-sm mt-1">{errors.endTime}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ticket Price *
                </label>
                <input
                  type="number"
                  name="pricing.ticketPrice"
                  value={formData.pricing.ticketPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="0.00"
                />
                {errors.ticketPrice && <p className="text-red-400 text-sm mt-1">{errors.ticketPrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  name="pricing.currency"
                  value={formData.pricing.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg mt-6">
            <p className="text-red-300 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Previous
            </button>
          )}
          
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>

          <div className="flex-1" />

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white rounded-xl transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                'Create Event'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
