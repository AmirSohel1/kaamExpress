import React from "react";
import {
  FaUser,
  FaUserTie,
  FaTools,
  FaCalendarAlt,
  FaRupeeSign,
} from "react-icons/fa";

const BookingMobileCard = ({
  booking,
  onView,
  onContact,
  statusColors,
  statusLabels,
}) => {
  const b = booking;

  // Defensive data extraction
  const customerName = b.customer?.name || "Unknown";
  const workerName = b.worker?.name || "Unknown";
  const serviceName =
    typeof b.service === "string" ? b.service : b.service?.name || "Unknown";
  const amount = b.amount || b.price || 0;
  const dateStr = b.date ? new Date(b.date).toLocaleDateString() : "N/A";

  return (
    <div
      className="bg-[var(--secondary)] rounded-2xl shadow p-4 cursor-pointer hover:bg-[var(--card)] transition-colors duration-200 animate-fade-in-up"
      onClick={() => onView(b)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="font-bold text-white text-base">
          Booking #{b._id || b.id}
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
            statusColors[b.status] || "bg-gray-600 text-gray-200"
          }`}
        >
          {statusLabels[b.status] || b.status || "Pending"}
        </span>
      </div>

      {/* Details */}
      <div className="flex items-center gap-2 mb-2">
        <FaUser className="text-[var(--accent)]" />
        <span className="text-white text-sm">Customer: {customerName}</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <FaUserTie className="text-[var(--accent)]" />
        <span className="text-white text-sm">Worker: {workerName}</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <FaTools className="text-[var(--accent)]" />
        <span className="text-white text-sm">Service: {serviceName}</span>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs mb-4">
        <div className="flex items-center gap-1 text-green-300 font-bold">
          <FaRupeeSign />
          {amount.toLocaleString()}
        </div>
        <div className="flex items-center gap-1 text-white">
          <FaCalendarAlt className="text-[var(--accent)]" />
          <span>{dateStr}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        className="flex flex-wrap gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="px-3 py-2 rounded bg-gray-700 text-white font-semibold hover:bg-gray-600 transition text-xs flex-1"
          onClick={() => onView(b)}
        >
          View Details
        </button>
        <button
          className="px-3 py-2 rounded bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition text-xs flex-1"
          onClick={() => onContact(b)}
        >
          Contact
        </button>
      </div>
    </div>
  );
};

export default BookingMobileCard;
