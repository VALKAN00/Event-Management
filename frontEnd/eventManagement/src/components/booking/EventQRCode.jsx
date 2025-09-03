import React from 'react';
import QRCode from 'react-qr-code';

const EventQRCode = ({ event, size = 120 }) => {
  if (!event || !event._id) {
    return null;
  }

  // Generate URL that will navigate to booking-tickets page with event pre-selected
  const bookingUrl = `${window.location.origin}/booking-tickets?event=${event._id}`;
  
  return (
    <div className="flex items-start justify-start gap-5 p-4">
      <div className="bg-white p-3 rounded-lg shadow-sm border">
        <QRCode
          size={size}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={bookingUrl}
          viewBox={`0 0 ${size} ${size}`}
        />
      </div>
      <div className="mt-3 text-start flex flex-col justify-start">
        <p className="text-sm font-medium text-gray-700">Scan QR code for easy</p>
        <p className="text-sm font-medium text-gray-700">Payments</p>
      </div>
    </div>
  );
};

export default EventQRCode;
