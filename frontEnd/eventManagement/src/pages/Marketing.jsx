import { useState, useEffect } from 'react';

export default function Marketing() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    eventId: '',
    eventName: '',
    marketingMethod: '',
    price: '',
    days: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // For simulation purposes, use fake events instead of API call
      const fakeEvents = [
        {
          _id: '1',
          title: 'Tech Conference 2025',
          date: '2025-12-15',
          location: 'San Francisco, CA',
          description: 'Annual technology conference featuring the latest innovations'
        },
        {
          _id: '2', 
          title: 'Music Festival 2025',
          date: '2025-11-20',
          location: 'Los Angeles, CA',
          description: 'Three-day music festival with top artists'
        },
        {
          _id: '3',
          title: 'Art Exhibition 2025',
          date: '2025-10-10',
          location: 'New York, NY', 
          description: 'Contemporary art exhibition showcasing emerging artists'
        }
      ];
      
      setEvents(fakeEvents);
    } catch {
      setEvents([]); // Set empty array on error
    }
  };

  const marketingMethods = [
    { value: 'social-media', label: 'Social Media Marketing' },
    { value: 'email', label: 'Email Marketing' },
    { value: 'google-ads', label: 'Google Ads' },
    { value: 'facebook-ads', label: 'Facebook Ads' },
    { value: 'instagram-ads', label: 'Instagram Ads' },
    { value: 'influencer', label: 'Influencer Marketing' },
    { value: 'print-media', label: 'Print Media' },
    { value: 'radio', label: 'Radio Advertisement' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update event name when event is selected
    if (name === 'eventId') {
      const selectedEvent = events.find(event => event._id === value);
      setFormData(prev => ({
        ...prev,
        eventName: selectedEvent ? selectedEvent.title : ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.eventId || !formData.marketingMethod || !formData.price || !formData.days) {
      setMessage('Please fill in all fields');
      return;
    }

    if (formData.price <= 0) {
      setMessage('Price must be greater than 0');
      return;
    }

    if (formData.days <= 0) {
      setMessage('Days must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      // Here you would typically send the data to your backend
      
      setMessage('Marketing campaign created successfully!');
      
      // Reset form
      setFormData({
        eventId: '',
        eventName: '',
        marketingMethod: '',
        price: '',
        days: ''
      });
    } catch {
      setMessage('Error creating marketing campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-[#111111] m-4 rounded-2xl">
      {/* Header */}
      <div className="mb-8 rounded-lg p-3 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-white mb-2">Marketing Campaign</h1>
          <p className="text-gray-200">
            Create and manage marketing campaigns for your events
          </p>
        </div>
        <img
          src="/assets/sidebar/cogwheel.png"
          alt="Marketing"
          className="w-20 h-20"
        />
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes('success')
              ? "bg-green-900 text-green-300 border border-green-700"
              : "bg-red-900 text-red-300 border border-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Content */}
      <div className="bg-[#111111] rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Create New Marketing Campaign</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Selection */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Select Event
            </label>
            <select
              name="eventId"
              value={formData.eventId}
              onChange={handleInputChange}
              className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Choose an event...</option>
              {Array.isArray(events) && events.map(event => (
                <option key={event._id} value={event._id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>

          {/* Marketing Method */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Marketing Method
            </label>
            <select
              name="marketingMethod"
              value={formData.marketingMethod}
              onChange={handleInputChange}
              className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Choose marketing method...</option>
              {marketingMethods.map(method => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Budget ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter marketing budget"
                min="1"
                step="0.01"
                className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Days */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Campaign Duration (Days)
              </label>
              <input
                type="number"
                name="days"
                value={formData.days}
                onChange={handleInputChange}
                placeholder="Enter number of days"
                min="1"
                className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Marketing Tips */}
          <div className="bg-[#2a2a2a] p-4 rounded-lg">
            <h3 className="text-white font-medium mb-2">
              Marketing Tips:
            </h3>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Social media campaigns work best with 7-14 day duration</li>
              <li>• Email marketing is cost-effective for existing audiences</li>
              <li>• Influencer marketing requires higher budget but broader reach</li>
              <li>• Google Ads provide immediate visibility and targeting</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Creating Campaign...' : 'Create Marketing Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
