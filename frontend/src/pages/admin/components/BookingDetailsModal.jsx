// src/components/BookingDetailsModal.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaRupeeSign, FaCopy } from "react-icons/fa";

const BookingDetailsModal = ({
  modal,
  onClose,
  statusColors,
  statusLabels,
}) => {
  if (!modal) return null;

  const copyBookingID = () => {
    const id = modal._id || modal.id;
    if (!id) return;
    navigator.clipboard.writeText(id);
    alert(`Booking ID #${id} copied to clipboard!`);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in-up"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[var(--secondary)] rounded-2xl p-8 w-full max-w-md shadow-xl relative animate-fade-in-up"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Title */}
        <h3 className="text-xl font-bold mb-4 text-white">Booking Details</h3>

        {/* Booking Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-300">Booking ID:</span>
            <span className="text-white">#{modal._id || modal.id}</span>
            <button
              className="ml-auto text-gray-400 hover:text-white text-xs flex items-center gap-1"
              onClick={copyBookingID}
            >
              <FaCopy /> Copy
            </button>
          </div>

          <div>
            <span className="font-semibold text-gray-300">Customer:</span>{" "}
            <span className="text-white">{modal.customer?.name || "N/A"}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-300">Worker:</span>{" "}
            <span className="text-white">
              {modal.worker?.name || "Unassigned"}
            </span>
          </div>

          <div>
            <span className="font-semibold text-gray-300">Service:</span>{" "}
            <span className="text-white">
              {typeof modal.service === "object"
                ? modal.service?.name
                : modal.service || "N/A"}
            </span>
          </div>

          <div>
            <span className="font-semibold text-gray-300">Date:</span>{" "}
            <span className="text-white">
              {modal.date ? new Date(modal.date).toLocaleDateString() : "N/A"}
            </span>
          </div>

          <div>
            <span className="font-semibold text-gray-300">Amount:</span>{" "}
            <span className="text-white flex items-center gap-1">
              <FaRupeeSign />
              {modal.price ? modal.price.toLocaleString() : "0"}
            </span>
          </div>

          <div>
            <span className="font-semibold text-gray-300">Status:</span>{" "}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                statusColors[modal.status] || "bg-gray-600 text-gray-200"
              }`}
            >
              {statusLabels[modal.status] || modal.status || "Pending"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 rounded-md bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingDetailsModal;
