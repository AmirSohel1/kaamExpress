import React, { useState } from "react";
import BookingForm from "./BookingForm.jsx";

const BookingModal = ({ worker, service, onClose }) => {
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[var(--secondary)] rounded-2xl p-8 shadow-lg w-full max-w-lg relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-white transition"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        {/* Modal Header */}
        <h3 className="text-2xl font-bold text-white mb-2">
          Book {worker.user?.name || "Worker"}
        </h3>
        <p className="text-gray-400 mb-6">
          Skills: {worker.skills?.join(", ") || "N/A"}
        </p>

        {/* Booking Form */}
        <BookingForm
          worker={worker}
          service={service}
          onSuccess={(msg) => {
            setBookingSuccess(msg);
            setBookingError(null);
          }}
          onError={(msg) => {
            setBookingError(msg);
            setBookingSuccess(null);
          }}
        />

        {/* Feedback Messages */}
        {bookingSuccess && (
          <div className="text-green-400 mt-4 font-semibold">
            {bookingSuccess}
          </div>
        )}
        {bookingError && (
          <div className="text-red-400 mt-4 font-semibold">{bookingError}</div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
