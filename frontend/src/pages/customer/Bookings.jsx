import React, { useEffect, useState } from "react";
import {
  FaRegClock,
  FaCheckCircle,
  FaRegDotCircle,
  FaTimes,
} from "react-icons/fa";
import { fetchBookings } from "../../api/bookings";

const statusStyles = {
  "In-progress": "bg-blue-900 text-blue-300",
  Pending: "bg-yellow-900 text-yellow-300",
  Completed: "bg-green-900 text-green-300",
};

const statusIcon = {
  "In-progress": <FaRegDotCircle className="inline mr-1" />,
  Pending: <FaRegClock className="inline mr-1" />,
  Completed: <FaCheckCircle className="inline mr-1" />,
};

const Bookings = () => {
  const [modal, setModal] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchBookings();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };
    loadBookings();
  }, []);

  const handleView = (booking) => setModal({ type: "view", booking });
  const handleCancel = (booking) => setModal({ type: "cancel", booking });
  const closeModal = () => setModal(null);
  const confirmCancel = () => {
    setBookings((prev) => prev.filter((b) => b._id !== modal.booking._id));
    setModal(null);
  };

  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white animate-fade-in-up">
            My Bookings
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Manage your active service bookings
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-full bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent-hover)] transition-all shadow-md text-sm animate-pulse-slow"
          onClick={() => {
            const csv = [
              ["Service", "Worker", "Date", "Location", "Status"],
              ...bookings.map((b) => [
                b.service?.name || "N/A",
                b.worker?.name || "Unassigned",
                formatDate(b.date),
                b.location,
                b.status,
              ]),
            ]
              .map((row) => `"${row.join('","')}"`)
              .join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "customer_bookings.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export Bookings
        </button>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {bookings.length > 0 ? (
          bookings.map((b) => (
            <div
              key={b._id}
              className="bg-[var(--card)] rounded-2xl shadow-lg p-4 flex flex-col gap-3 hover:scale-[1.02] hover:shadow-xl transition-transform duration-300"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white text-base">
                  {b.service?.name || "Unknown Service"}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                    statusStyles[b.status] || "bg-gray-800 text-gray-300"
                  }`}
                >
                  {statusIcon[b.status]}
                  {b.status}
                </span>
              </div>
              <div className="text-gray-200 text-sm">
                Worker: {b.worker?.name || "Unassigned"}
              </div>
              <div className="text-gray-400 text-xs">
                {formatDate(b.date)} - {b.location}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  className="flex-1 px-4 py-2 rounded-lg bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent-hover)] transition shadow"
                  onClick={() => handleView(b)}
                >
                  View Details
                </button>
                {b.status === "Pending" ? (
                  <button
                    className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition shadow-md"
                    onClick={() => handleCancel(b)}
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    className="flex-1 px-2 py-1 rounded-full bg-gray-700 text-gray-400 text-xs font-semibold cursor-not-allowed flex items-center justify-center"
                    disabled
                  >
                    <FaTimes className="mr-1" />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-8">
            You have no active bookings.
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block w-full overflow-x-auto rounded-2xl shadow-lg bg-[var(--card)]">
        <table className="min-w-full border-collapse">
          <thead className="bg-[var(--primary)] text-gray-400 text-sm">
            <tr>
              {[
                "SERVICE",
                "WORKER",
                "DATE",
                "LOCATION",
                "STATUS",
                "ACTIONS",
              ].map((title) => (
                <th key={title} className="py-4 px-6 text-left font-medium">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <tr
                  key={b._id}
                  className="border-b border-gray-700 hover:bg-[var(--secondary)] transition"
                >
                  <td className="py-4 px-6 text-white font-semibold">
                    {b.service?.name || "Unknown Service"}
                  </td>
                  <td className="py-4 px-6 text-gray-200">
                    {b.worker?.name || "Unassigned"}
                  </td>
                  <td className="py-4 px-6 text-gray-400">
                    {formatDate(b.date)}
                  </td>
                  <td className="py-4 px-6 text-gray-400">{b.location}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                        statusStyles[b.status] || "bg-gray-800 text-gray-300"
                      }`}
                    >
                      {statusIcon[b.status]}
                      {b.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 flex gap-2">
                    <button
                      className="px-4 py-1 rounded-lg bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent-hover)] transition shadow"
                      onClick={() => handleView(b)}
                    >
                      View
                    </button>
                    {b.status === "Pending" ? (
                      <button
                        className="px-4 py-1 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 shadow-md transition"
                        onClick={() => handleCancel(b)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        className="px-2 py-1 rounded-full bg-gray-700 text-gray-400 text-xs font-semibold cursor-not-allowed flex items-center"
                        disabled
                      >
                        <FaTimes className="mr-1" />
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-400">
                  You have no active bookings.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 animate-fade-in-up">
          <div className="bg-[var(--card)] rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md relative animate-fade-in-up">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-[var(--accent)] text-2xl transition"
              onClick={closeModal}
            >
              <FaTimes />
            </button>
            {modal.type === "view" ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
                <div className="space-y-2 text-sm text-gray-200">
                  <div>
                    <span className="font-semibold text-gray-300">
                      Service:
                    </span>{" "}
                    {modal.booking.service?.name}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-300">Worker:</span>{" "}
                    {modal.booking.worker?.name || "Unassigned"}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-300">Date:</span>{" "}
                    {formatDate(modal.booking.date)}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-300">
                      Location:
                    </span>{" "}
                    {modal.booking.location}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-300">Status:</span>{" "}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        statusStyles[modal.booking.status]
                      }`}
                    >
                      {modal.booking.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-300">
                      Booking ID:
                    </span>{" "}
                    {modal.booking._id}
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4 text-red-400">
                  Cancel Booking
                </h2>
                <p className="mb-6 text-sm text-gray-300">
                  Are you sure you want to cancel{" "}
                  <span className="font-semibold">
                    {modal.booking.service?.name}
                  </span>{" "}
                  with{" "}
                  <span className="font-semibold">
                    {modal.booking.worker?.name || "Unassigned"}
                  </span>
                  ?
                </p>
                <div className="flex gap-4 justify-end">
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 font-semibold hover:bg-gray-600 transition text-sm"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 shadow-md transition text-sm"
                    onClick={confirmCancel}
                  >
                    Confirm Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
