import React, { useState } from 'react';

const CreateBookingForm = ({ isOpen, onClose, onSubmit, events = [] }) => {
  const [formData, setFormData] = useState({
    eventId: '',
    seats: [{ seatNumber: '', row: '', section: '', price: 0 }],
    attendeeInfo: {
      name: '',
      email: '',
      phone: '',
      specialRequirements: ''
    },
    paymentMethod: 'card'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSeatChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      seats: prev.seats.map((seat, i) => 
        i === index ? { ...seat, [field]: value } : seat
      )
    }));
  };

  const addSeat = () => {
    setFormData(prev => ({
      ...prev,
      seats: [...prev.seats, { seatNumber: '', row: '', section: '', price: 0 }]
    }));
  };

  const removeSeat = (index) => {
    if (formData.seats.length > 1) {
      setFormData(prev => ({
        ...prev,
        seats: prev.seats.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotal = () => {
    return formData.seats.reduce((total, seat) => total + (parseFloat(seat.price) || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const bookingData = {
        ...formData,
        totalAmount: calculateTotal()
      };
      await onSubmit(bookingData);
      onClose();
      // Reset form
      setFormData({
        eventId: '',
        seats: [{ seatNumber: '', row: '', section: '', price: 0 }],
        attendeeInfo: {
          name: '',
          email: '',
          phone: '',
          specialRequirements: ''
        },
        paymentMethod: 'card'
      });
    } catch (error) {
      console.error('Booking creation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Booking</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Event Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Event *
            </label>
            <select
              value={formData.eventId}
              onChange={(e) => handleInputChange('eventId', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose an event...</option>
              {events.map(event => (
                <option key={event._id} value={event._id}>
                  {event.name} - {new Date(event.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {/* Attendee Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Attendee Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.attendeeInfo.name}
                  onChange={(e) => handleInputChange('attendeeInfo.name', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.attendeeInfo.email}
                  onChange={(e) => handleInputChange('attendeeInfo.email', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.attendeeInfo.phone}
                  onChange={(e) => handleInputChange('attendeeInfo.phone', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="mobile">Mobile Payment</option>
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requirements
              </label>
              <textarea
                value={formData.attendeeInfo.specialRequirements}
                onChange={(e) => handleInputChange('attendeeInfo.specialRequirements', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any special requirements or notes..."
              />
            </div>
          </div>

          {/* Seats */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Seat Selection</h3>
              <button
                type="button"
                onClick={addSeat}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Seat
              </button>
            </div>
            
            {formData.seats.map((seat, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 rounded-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seat Number *
                  </label>
                  <input
                    type="text"
                    value={seat.seatNumber}
                    onChange={(e) => handleSeatChange(index, 'seatNumber', e.target.value)}
                    required
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Row
                  </label>
                  <input
                    type="text"
                    value={seat.row}
                    onChange={(e) => handleSeatChange(index, 'row', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section
                  </label>
                  <input
                    type="text"
                    value={seat.section}
                    onChange={(e) => handleSeatChange(index, 'section', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (LKR) *
                  </label>
                  <input
                    type="number"
                    value={seat.price}
                    onChange={(e) => handleSeatChange(index, 'price', e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  {formData.seats.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSeat(index)}
                      className="w-full px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-gray-50 rounded-md p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Total Amount:</span>
              <span className="text-xl font-bold text-blue-600">
                LKR {calculateTotal().toLocaleString()}
              </span>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBookingForm;
