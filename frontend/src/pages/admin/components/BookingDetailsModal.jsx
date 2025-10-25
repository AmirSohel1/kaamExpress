import React from "react";
import { motion } from "framer-motion";
import {
  FaRupeeSign,
  FaCopy,
  FaPhone,
  FaWhatsapp,
  FaCalendar,
  FaMapMarkerAlt,
} from "react-icons/fa";

const BookingDetailsModal = ({
  modal,
  onClose,
  statusColors,
  statusLabels,
  onStatusUpdate,
}) => {
  if (!modal) return null;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  const handleCall = (phone, name) => {
    if (phone) {
      window.open(`tel:${phone}`);
    } else {
      alert(`Phone number not available for ${name}`);
    }
  };

  const handleWhatsApp = (phone, name) => {
    if (phone) {
      window.open(
        `https://wa.me/${phone}?text=Hello ${name}, regarding your booking #${modal._id}`
      );
    } else {
      alert(`WhatsApp number not available for ${name}`);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-[var(--secondary)] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Booking Details</h3>
          <button
            className="text-gray-400 hover:text-white text-2xl transition"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-4">
            <div className="bg-[var(--card)] rounded-xl p-4">
              <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                📋 Basic Information
              </h4>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Booking ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-sm">
                      #{modal._id?.slice(-8)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(modal._id, "Booking ID")}
                      className="text-gray-400 hover:text-white transition"
                    >
                      <FaCopy className="text-xs" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      statusColors[modal.status] || "bg-gray-600 text-gray-200"
                    }`}
                  >
                    {statusLabels[modal.status] || modal.status}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Payment:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      modal.isPaid || modal.paymentStatus === "Paid"
                        ? "bg-green-900 text-green-300"
                        : "bg-yellow-900 text-yellow-300"
                    }`}
                  >
                    {modal.isPaid || modal.paymentStatus === "Paid"
                      ? "Paid"
                      : "Unpaid"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white font-bold flex items-center gap-1">
                    <FaRupeeSign />
                    {modal.finalAmount
                      ? modal.finalAmount.toLocaleString()
                      : "0"}
                  </span>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-[var(--card)] rounded-xl p-4">
              <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                🛠️ Service Details
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400">Service:</span>
                  <span className="text-white ml-2">
                    {typeof modal.service === "object"
                      ? modal.service?.name
                      : modal.service}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white ml-2">
                    {modal.duration} minutes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Location */}
          <div className="space-y-4">
            {/* Customer Info */}
            <div className="bg-[var(--card)] rounded-xl p-4">
              <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                👤 Customer Information
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white ml-2 font-medium">
                    {modal.customer?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Contact:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white">{modal.customer?.phone}</span>
                    <button
                      onClick={() =>
                        handleCall(modal.customer?.phone, modal.customer?.name)
                      }
                      className="text-blue-400 hover:text-blue-300 transition"
                    >
                      <FaPhone />
                    </button>
                    <button
                      onClick={() =>
                        handleWhatsApp(
                          modal.customer?.phone,
                          modal.customer?.name
                        )
                      }
                      className="text-green-400 hover:text-green-300 transition"
                    >
                      <FaWhatsapp />
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white ml-2">
                    {modal.customer?.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Worker Info */}
            <div className="bg-[var(--card)] rounded-xl p-4">
              <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                👷 Worker Information
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white ml-2 font-medium">
                    {modal.worker?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Contact:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white">{modal.worker?.phone}</span>
                    <button
                      onClick={() =>
                        handleCall(modal.worker?.phone, modal.worker?.name)
                      }
                      className="text-blue-400 hover:text-blue-300 transition"
                    >
                      <FaPhone />
                    </button>
                    <button
                      onClick={() =>
                        handleWhatsApp(modal.worker?.phone, modal.worker?.name)
                      }
                      className="text-green-400 hover:text-green-300 transition"
                    >
                      <FaWhatsapp />
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white ml-2">{modal.worker?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule & Location */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div className="bg-[var(--card)] rounded-xl p-4">
            <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <FaCalendar className="text-[var(--accent)]" />
              Schedule
            </h4>
            <div className="space-y-2">
              <div>
                <span className="text-gray-400">Date:</span>
                <span className="text-white ml-2">
                  {modal.date
                    ? new Date(modal.date).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Time:</span>
                <span className="text-white ml-2">
                  {modal.time || "Not set"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-xl p-4">
            <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-400" />
              Location
            </h4>
            <div className="space-y-2">
              <div className="text-white text-sm">
                {modal.location?.street || "Address not specified"}
              </div>
              <div className="text-gray-400 text-xs">
                {[
                  modal.location?.city,
                  modal.location?.state,
                  modal.location?.zip,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {(modal.customerNotes || modal.workerNotes) && (
          <div className="mt-4 space-y-3">
            {modal.customerNotes && (
              <div className="bg-[var(--card)] rounded-xl p-4">
                <h4 className="font-semibold text-gray-300 mb-2">
                  Customer Notes
                </h4>
                <p className="text-white text-sm">{modal.customerNotes}</p>
              </div>
            )}
            {modal.workerNotes && (
              <div className="bg-[var(--card)] rounded-xl p-4">
                <h4 className="font-semibold text-gray-300 mb-2">
                  Worker Notes
                </h4>
                <p className="text-white text-sm">{modal.workerNotes}</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-end mt-6 pt-4 border-t border-gray-700">
          <button
            className="px-4 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
            onClick={onClose}
          >
            Close
          </button>
          {modal.status !== "completed" && modal.status !== "cancelled" && (
            <button
              className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-500 transition"
              onClick={() => onStatusUpdate(modal, "completed")}
            >
              Mark Complete
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingDetailsModal;
