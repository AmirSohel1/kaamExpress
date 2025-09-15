import React from "react";
import { FaRupeeSign } from "react-icons/fa";

const BookingRecentList = ({ bookings, statusColors, statusLabels }) => {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-[var(--secondary)] rounded-2xl p-6 shadow text-center text-gray-400">
        No recent bookings.
      </div>
    );
  }

  return (
    <div className="bg-[var(--secondary)] rounded-2xl p-6 shadow animate-fade-in-up">
      <span className="text-lg font-semibold mb-4 block">Recent Bookings</span>
      <ul className="space-y-2 animate-fade-in-up">
        {bookings.map((b, idx) => {
          const serviceName =
            typeof b.service === "string"
              ? b.service
              : b.service?.name || "Unknown Service";
          const customerName = b.customer?.name || "Unknown Customer";
          const workerName = b.worker?.name || "Unknown Worker";
          const amount = b.price || 0;
          const statusClass =
            statusColors[b.status] || "bg-gray-600 text-gray-200";
          const statusLabel = statusLabels[b.status] || b.status || "Pending";

          return (
            <li
              key={b.id || b._id || idx}
              className="flex items-center justify-between bg-[var(--card)] rounded-lg px-4 py-3 animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.07 + 0.2}s` }}
            >
              <div>
                <span className="font-semibold text-white">
                  {serviceName} - {customerName}
                </span>
                <div className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                  Worker: {workerName} •
                  <span className="flex items-center text-green-300 font-semibold gap-1">
                    <FaRupeeSign className="inline" />
                    {amount.toLocaleString()}
                  </span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusClass}`}
              >
                {statusLabel}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BookingRecentList;
