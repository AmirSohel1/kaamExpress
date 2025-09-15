import React from "react";
import {
  FaUser,
  FaUserTie,
  FaTools,
  FaCalendarAlt,
  FaRupeeSign,
} from "react-icons/fa";

const BookingTable = ({
  filtered = [],
  onView = () => {},
  onContact = () => {},
  onMarkComplete = () => {},
  onCancel = () => {},
  statusColors = {},
  statusLabels = {},
}) => {
  return (
    <div className="hidden md:block w-full bg-[var(--secondary)] rounded-2xl shadow overflow-x-auto mb-8">
      <table className="min-w-full text-sm table-auto">
        <thead>
          <tr className="text-left bg-[var(--primary)] text-gray-300">
            {[
              "BOOKING ID",
              "CUSTOMER",
              "WORKER",
              "SERVICE",
              "DATE",
              "AMOUNT",
              "STATUS",
              "ACTIONS",
            ].map((header, idx) => (
              <th key={idx} className="py-3 px-4 min-w-[120px]">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((b, idx) => (
              <tr
                key={b._id || b.id || idx}
                className="border-b border-gray-700 hover:bg-[var(--card)] transition cursor-pointer"
                onClick={() => onView(b)}
              >
                {/* Booking ID */}
                <td className="py-4 px-6 text-sky-400 font-bold whitespace-nowrap">
                  #{b._id || b.id}
                </td>

                {/* Customer */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-8 h-8 rounded-full ${
                        b.customer?.color || "bg-gray-600"
                      } flex items-center justify-center text-lg text-white`}
                    >
                      <FaUser />
                    </span>
                    <span className="font-semibold text-white">
                      {b.customer?.name || "N/A"}
                    </span>
                  </div>
                </td>

                {/* Worker */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-8 h-8 rounded-full ${
                        b.worker?.color || "bg-gray-600"
                      } flex items-center justify-center text-lg text-white`}
                    >
                      <FaUserTie />
                    </span>
                    <span className="font-semibold text-white">
                      {b.worker?.name || "Unassigned"}
                    </span>
                  </div>
                </td>

                {/* Service */}
                <td className="py-4 px-6 flex items-center gap-2">
                  <FaTools className="text-gray-400" />
                  <span className="text-white font-medium">
                    {typeof b.service === "object"
                      ? b.service?.name
                      : b.service || "N/A"}
                  </span>
                </td>

                {/* Date */}
                <td className="py-4 px-6 whitespace-nowrap flex items-center gap-2">
                  <FaCalendarAlt className="text-[var(--accent)]" />
                  <span className="text-white font-medium">
                    {b.date ? new Date(b.date).toLocaleDateString() : "N/A"}
                  </span>
                </td>

                {/* Amount */}
                <td className="py-4 px-6 whitespace-nowrap">
                  <span className="flex items-center gap-1 text-green-300 font-bold text-sm">
                    <FaRupeeSign className="inline mr-1" />
                    {b.price ? b.price.toLocaleString() : "0"}
                  </span>
                </td>

                {/* Status */}
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      statusColors[b.status] || "bg-gray-600 text-gray-200"
                    }`}
                  >
                    {statusLabels[b.status] || b.status || "Pending"}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="px-4 py-1 rounded bg-[var(--card)] text-white font-semibold border border-gray-700 hover:bg-[var(--secondary)] transition text-sm"
                      onClick={() => onView(b)}
                    >
                      View Details
                    </button>
                    <button
                      className="px-4 py-1 rounded bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition text-sm"
                      onClick={() => onContact(b)}
                    >
                      Contact
                    </button>
                    <button
                      className="px-4 py-1 rounded bg-blue-900 text-blue-300 font-semibold hover:bg-blue-800 transition text-sm"
                      onClick={() => onMarkComplete(b)}
                    >
                      Mark Complete
                    </button>
                    <button
                      className="px-4 py-1 rounded bg-red-900 text-red-300 font-semibold hover:bg-red-800 transition text-sm"
                      onClick={() => onCancel(b)}
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="py-8 text-center text-gray-400">
                No bookings found matching your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
