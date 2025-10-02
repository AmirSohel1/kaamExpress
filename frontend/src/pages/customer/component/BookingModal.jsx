import React, { useState } from "react";
import BookingForm from "./BookingForm.jsx";
import { XMarkIcon } from "@heroicons/react/24/outline";

const BookingModal = ({ worker, service, onClose }) => {
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  const handleSuccess = (msg) => {
    setBookingSuccess(msg);
    setBookingError(null);
    // Auto-close after success after a delay
    if (msg && !msg.includes("proceed")) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  const handleError = (msg) => {
    setBookingError(msg);
    setBookingSuccess(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-[var(--secondary)] text-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          onClick={onClose}
          aria-label="Close"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white sticky top-0">
          <h3 className="text-2xl font-bold">
            Book {service?.name || "Service"}
          </h3>
          <div className="flex items-center mt-2">
            <div className="flex-shrink-0">
              {worker.user?.profilePicture ? (
                <img
                  src={worker.user.profilePicture}
                  alt={worker.user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                  {worker.user?.name?.charAt(0) || "W"}
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-indigo-100">
                {worker.user?.name || "Worker"}
              </p>
              <p className="text-xs text-indigo-200">
                {worker.customSkills?.join(", ") || "Skilled Professional"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <BookingForm
            worker={worker}
            service={service}
            onSuccess={handleSuccess}
            onError={handleError}
          />

          {/* Feedback Messages */}
          {bookingSuccess && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {bookingSuccess}
                  </p>
                </div>
              </div>
            </div>
          )}

          {bookingError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    {bookingError}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
