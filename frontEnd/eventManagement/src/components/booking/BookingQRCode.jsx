import React from 'react';
import QRCode from 'react-qr-code';

const BookingQRCode = ({ booking, size = 80 }) => {
  // Convert to URL format for ticket viewing
  const ticketUrl = `${window.location.origin}/ticket/${booking.bookingId}`;
  
  return (
    <div className="flex flex-col items-center p-2">
      <QRCode
        size={size}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={ticketUrl}
        viewBox={`0 0 ${size} ${size}`}
      />
      <p className="text-xs text-gray-500 mt-1 text-center">Scan for ticket</p>
    </div>
  );
};

export default BookingQRCode;
