import React, { useState } from "react";
import {
  FaUser,
  FaUserTie,
  FaTools,
  FaCalendarAlt,
  FaRupeeSign,
  FaEllipsisV,
  FaPhone,
  FaWhatsapp,
} from "react-icons/fa";

const BookingTable = ({
  filtered = [],
  onView = () => {},
  onContact = () => {},
  onStatusUpdate = () => {},
  onCancel = () => {},
  statusColors = {},
  statusLabels = {},
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleContact = (booking, type) => {
    const phone =
      type === "customer" ? booking.customer?.phone : booking.worker?.phone;
    const name =
      type === "customer" ? booking.customer?.name : booking.worker?.name;

    if (phone) {
      if (window.confirm(`Call ${name} at ${phone}?`)) {
        window.open(`tel:${phone}`);
      }
    } else {
      alert(`Phone number not available for ${name}`);
    }
  };

  const getStatusOptions = (currentStatus) => {
    const allStatuses = [
      "pending",
      "in-progress",
      "completed",
      "dispute",
      "cancelled",
    ];
    return allStatuses.filter((status) => status !== currentStatus);
  };

  return (
    <div className="hidden lg:block w-full bg-[var(--secondary)] rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--primary)] text-gray-300">
              {[
                "BOOKING ID",
                "CUSTOMER",
                "WORKER",
                "SERVICE",
                "DATE & TIME",
                "AMOUNT",
                "PAYMENT",
                "STATUS",
                "ACTIONS",
              ].map((header, idx) => (
                <th
                  key={idx}
                  className="py-4 px-4 text-left font-semibold text-xs uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filtered.length > 0 ? (
              filtered.map((b, idx) => (
                <tr
                  key={b._id}
                  className="hover:bg-[var(--card)] transition-colors duration-150 group cursor-pointer"
                  onClick={() => onView(b)}
                >
                  {/* Booking ID */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sky-400 font-mono text-xs bg-sky-400/10 px-2 py-1 rounded">
                        #{b._id?.slice(-8) || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        {b.customer?.name?.charAt(0) || "C"}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {b.customer?.name || "N/A"}
                        </div>
                        <div className="text-gray-400 text-xs flex items-center gap-1 mt-1">
                          <FaPhone className="text-xs" />
                          {b.customer?.phone || "No phone"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Worker */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
                        {b.worker?.name?.charAt(0) || "W"}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {b.worker?.name || "Unassigned"}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {b.worker?.phone || ""}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Service */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <FaTools className="text-orange-400 text-sm" />
                      </div>
                      <span className="text-white font-medium text-sm">
                        {typeof b.service === "object"
                          ? b.service?.name
                          : b.service || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-white text-sm">
                        <FaCalendarAlt className="text-[var(--accent)] text-xs" />
                        {b.date ? new Date(b.date).toLocaleDateString() : "N/A"}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {b.time || "Time not set"}
                      </div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-green-300 font-bold text-sm bg-green-500/10 px-3 py-1 rounded-full">
                      <FaRupeeSign className="text-xs" />
                      {b.finalAmount ? b.finalAmount.toLocaleString() : "0"}
                    </div>
                  </td>

                  {/* Payment Status */}
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        b.isPaid || b.paymentStatus === "Paid"
                          ? "bg-green-900 text-green-300"
                          : "bg-yellow-900 text-yellow-300"
                      }`}
                    >
                      {b.isPaid || b.paymentStatus === "Paid"
                        ? "Paid"
                        : "Unpaid"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        statusColors[b.status] || "bg-gray-600 text-gray-200"
                      }`}
                    >
                      {statusLabels[b.status] || b.status || "Pending"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td
                    className="py-4 px-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(b._id)}
                        className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-gray-300"
                      >
                        <FaEllipsisV className="text-sm" />
                      </button>

                      {activeDropdown === b._id && (
                        <div className="absolute right-0 top-10 z-10 w-48 bg-[var(--card)] border border-gray-600 rounded-lg shadow-lg py-2">
                          <button
                            onClick={() => onView(b)}
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[var(--secondary)] transition"
                          >
                            📋 View Details
                          </button>

                          <div className="border-t border-gray-600 my-1"></div>

                          <button
                            onClick={() => handleContact(b, "customer")}
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[var(--secondary)] transition flex items-center gap-2"
                          >
                            <FaPhone className="text-blue-400" />
                            Call Customer
                          </button>

                          <button
                            onClick={() => handleContact(b, "worker")}
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[var(--secondary)] transition flex items-center gap-2"
                          >
                            <FaUserTie className="text-green-400" />
                            Call Worker
                          </button>

                          <div className="border-t border-gray-600 my-1"></div>

                          <div className="px-3 py-2 text-xs text-gray-400 uppercase tracking-wide">
                            Change Status
                          </div>

                          {getStatusOptions(b.status).map((status) => (
                            <button
                              key={status}
                              onClick={() => onStatusUpdate(b, status)}
                              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[var(--secondary)] transition capitalize"
                            >
                              → {statusLabels[status] || status}
                            </button>
                          ))}

                          {b.status !== "cancelled" && (
                            <>
                              <div className="border-t border-gray-600 my-1"></div>
                              <button
                                onClick={() => onCancel(b)}
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition"
                              >
                                🗑️ Cancel Booking
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-12 text-center">
                  <div className="text-gray-400 text-lg">No bookings found</div>
                  <div className="text-gray-500 text-sm mt-2">
                    Try adjusting your search filters
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;
