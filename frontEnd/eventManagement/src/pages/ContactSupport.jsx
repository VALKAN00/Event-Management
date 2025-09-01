import { useState } from 'react';

export default function ContactSupport() {
  const [activeTab, setActiveTab] = useState('faq');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const faqData = [
    {
      question: "How do I create an event?",
      answer: "To create an event, navigate to the 'Create Event' page from the sidebar. Fill in all the required details like event name, description, date, time, location, and pricing information. Click 'Create Event' to publish your event."
    },
    {
      question: "How can I manage my bookings?",
      answer: "Go to the 'Booking' section to view all your event bookings. You can see booking details, attendee information, and booking status. Use the filters to search for specific bookings."
    },
    {
      question: "How do I view analytics for my events?",
      answer: "Visit the 'Analytics' page to see comprehensive insights about your events, including attendee demographics, revenue reports, and performance metrics. You can filter data by date ranges and export reports."
    },
    {
      question: "Can I edit an event after creating it?",
      answer: "Yes, you can edit your events through the 'Manage Events' section. Click on any event to modify its details, update pricing, or change the event status."
    },
    {
      question: "How do I manage user accounts?",
      answer: "Administrators can manage user accounts through the 'Manage Users' section. You can view user details, update roles, activate/deactivate accounts, and monitor user activity."
    },
    {
      question: "What payment methods are supported?",
      answer: "We support major credit cards, debit cards, and digital payment methods. Payment processing is secure and encrypted for your safety."
    },
    {
      question: "How do I reset my password?",
      answer: "On the login page, click 'Forgot Password' and enter your email address. You'll receive a password reset link to create a new password."
    },
    {
      question: "Can I cancel or refund a booking?",
      answer: "Booking cancellation and refund policies depend on the event organizer's settings. Contact the event organizer directly or reach out to our support team for assistance."
    }
  ];

  const supportCategories = [
    { value: 'technical', label: 'Technical Issue', icon: '🔧' },
    { value: 'billing', label: 'Billing & Payments', icon: '💳' },
    { value: 'account', label: 'Account Management', icon: '👤' },
    { value: 'events', label: 'Event Management', icon: '📅' },
    { value: 'booking', label: 'Booking Issues', icon: '🎫' },
    { value: 'other', label: 'Other', icon: '💬' }
  ];

  const quickActions = [
    {
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      icon: "📧",
      action: () => setActiveTab('contact'),
      availability: "Response within 24h"
    },
    {
      title: "Phone Support",
      description: "Call our support hotline for urgent issues",
      icon: "📞",
      action: () => setShowPhoneNumber(!showPhoneNumber),
      availability: "Mon-Fri 9AM-6PM",
      phoneNumber: "+20 01231231231"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitStatus('sending');
    setTimeout(() => {
      setSubmitStatus('success');
      setContactForm({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: ''
      });
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-[#111111] m-4 rounded-2xl">
      {/* Header */}
      <div className="mb-8 rounded-lg p-3 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-white mb-2">Contact Support</h1>
          <p className="text-gray-200">
            We're here to help! Find answers to common questions or get in touch with our team.
          </p>
        </div>
        <div className="text-6xl">🎧</div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Help</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <div
              key={index}
              onClick={action.action}
              className="bg-[#2a2a2a] rounded-lg p-4 cursor-pointer hover:bg-[#3a3a3a] transition-colors"
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <h3 className="text-white font-medium mb-1">{action.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{action.description}</p>
              
              {/* Show phone number if it's the phone support card and showPhoneNumber is true */}
              {action.phoneNumber && showPhoneNumber ? (
                <div className="mb-2">
                  <div className="text-green-400 font-semibold text-lg">{action.phoneNumber}</div>
                  <div className="text-gray-400 text-xs">Click to call</div>
                </div>
              ) : null}
              
              <span className="text-blue-400 text-xs">{action.availability}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-[#2a2a2a] p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'faq'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="mr-2">❓</span>
            FAQ
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'contact'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="mr-2">📝</span>
            Contact Us
          </button>
        </div>
      </div>

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Frequently Asked Questions</h2>
          {faqData.map((faq, index) => (
            <div key={index} className="bg-[#2a2a2a] rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left p-4 hover:bg-[#3a3a3a] transition-colors flex justify-between items-center"
              >
                <span className="text-white font-medium">{faq.question}</span>
                <span className={`text-blue-400 transition-transform ${
                  openFaqIndex === index ? 'rotate-180' : ''
                }`}>
                  ▼
                </span>
              </button>
              {openFaqIndex === index && (
                <div className="px-4 pb-4">
                  <div className="border-t border-gray-600 pt-4">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Send us a Message</h2>
          
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-900 text-green-300 border border-green-700 rounded-lg">
              ✅ Your message has been sent successfully! We'll get back to you within 24 hours.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={contactForm.category}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {supportCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of your issue"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={contactForm.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce the problem, and any other relevant information."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitStatus === 'sending'}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {submitStatus === 'sending' ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <span>📧</span>
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Additional Support Info */}
          <div className="mt-8 p-4 bg-[#2a2a2a] rounded-lg">
            <h3 className="text-white font-medium mb-2">💡 Tips for faster support:</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Be specific about the issue you're experiencing</li>
              <li>• Include screenshots if applicable</li>
              <li>• Mention your browser and device type</li>
              <li>• Provide step-by-step details to reproduce the problem</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
