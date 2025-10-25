import React, { useEffect, useState } from "react";
import {
  FaRegClock,
  FaCheckCircle,
  FaRegDotCircle,
  FaTimes,
  FaDownload,
  FaEye,
  FaTrash,
  FaInfoCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserCog,
  FaPhone,
  FaEnvelope,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaStickyNote,
  FaStar,
  FaEdit,
} from "react-icons/fa";
import { fetchBookings } from "../../api/bookings";

const statusStyles = {
  "In-progress": "bg-blue-100 text-blue-800 border border-blue-300",
  Pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  Completed: "bg-green-100 text-green-800 border border-green-300",
  Cancelled: "bg-red-100 text-red-800 border border-red-300",
};

const statusIcons = {
  "In-progress": <FaRegDotCircle className="inline mr-1 text-blue-500" />,
  Pending: <FaRegClock className="inline mr-1 text-yellow-500" />,
  Completed: <FaCheckCircle className="inline mr-1 text-green-500" />,
  Cancelled: <FaTimes className="inline mr-1 text-red-500" />,
};

const paymentStatusStyles = {
  Paid: "bg-green-100 text-green-800 border border-green-300",
  Unpaid: "bg-red-100 text-red-800 border border-red-300",
  Partial: "bg-yellow-100 text-yellow-800 border border-yellow-300",
};

const Bookings = () => {
  const [modal, setModal] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const data = await fetchBookings();
        // console.log(data);
        setBookings(data.bookings);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
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

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  const formatAddress = (location) => {
    if (!location) return "No address provided";
    return `${location.street}, ${location.city}, ${location.state}, ${location.zip}, ${location.country}`;
  };

  // Filter and search functionality
  const filteredBookings = bookings.filter((booking) => {
    const matchesFilter = filter === "All" || booking.status === filter;
    const matchesSearch =
      booking.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.worker?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatAddress(booking.location)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] px-2 sm:px-4 py-4 flex flex-col gap-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-x-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            My Bookings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your active service bookings
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search by service, worker, or location..."
              className="w-full px-4 py-3 pl-10 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", "Pending", "In-progress", "Completed", "Cancelled"].map(
              (status) => (
                <button
                  key={status}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === status
                      ? "bg-[var(--accent)] text-white shadow-md"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Total Bookings
            </p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {bookings.length}
            </h3>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <FaCalendarAlt className="text-blue-500 text-xl" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Pending</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {bookings.filter((b) => b.status === "Pending").length}
            </h3>
          </div>
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <FaRegClock className="text-yellow-500 text-xl" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              In Progress
            </p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {bookings.filter((b) => b.status === "In-progress").length}
            </h3>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <FaRegDotCircle className="text-blue-500 text-xl" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Completed
            </p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {bookings.filter((b) => b.status === "Completed").length}
            </h3>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
            <FaCheckCircle className="text-green-500 text-xl" />
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((b) => (
            <div
              key={b._id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 flex flex-col gap-4 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-[var(--accent)]"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                  {b.service?.name || "Unknown Service"}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                    statusStyles[b.status] ||
                    "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {statusIcons[b.status]}
                  {b.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <FaUserCog className="text-[var(--accent)]" />
                  <span>{b.worker?.name || "Unassigned"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <FaCalendarAlt className="text-[var(--accent)]" />
                  <span>{formatDate(b.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <FaRegClock className="text-[var(--accent)]" />
                  <span>{formatTime(b.time)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <FaMoneyBillWave className="text-[var(--accent)]" />
                  <span>${b.finalAmount}</span>
                </div>
                <div className="col-span-2 flex items-start gap-2 text-gray-600 dark:text-gray-300">
                  <FaMapMarkerAlt className="text-[var(--accent)] mt-1" />
                  <span className="flex-1 text-sm">
                    {formatAddress(b.location)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                  onClick={() => handleView(b)}
                >
                  <FaEye className="text-sm" />
                  Details
                </button>
                {b.status === "Pending" ? (
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all"
                    onClick={() => handleCancel(b)}
                  >
                    <FaTrash className="text-sm" />
                    Cancel
                  </button>
                ) : (
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-600 font-medium cursor-not-allowed"
                    disabled
                  >
                    <FaTimes className="text-sm" />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                <FaInfoCircle className="text-3xl text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
              No bookings found
            </h3>
            <p className="text-gray-500">
              {searchTerm || filter !== "All"
                ? "Try adjusting your search or filter criteria"
                : "You don't have any bookings yet"}
            </p>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block w-full overflow-x-auto rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <table className="w-full border-collapse min-w-[900px]">
          <thead className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-sm">
            <tr>
              {[
                "SERVICE",
                "WORKER",
                "DATE & TIME",
                "LOCATION",
                "AMOUNT",
                "STATUS",
                "PAYMENT",
                "ACTIONS",
              ].map((title) => (
                <th key={title} className="py-5 px-6 text-left font-semibold">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b) => (
                <tr
                  key={b._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                >
                  <td className="py-5 px-6">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {b.service?.name || "Unknown Service"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {b.serviceSnapshot?.description}
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="text-gray-900 dark:text-white">
                      {b.worker?.name || "Unassigned"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {b.worker?.phone}
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="text-gray-900 dark:text-white">
                      {formatDate(b.date)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(b.time)}
                    </div>
                  </td>
                  <td className="py-5 px-6 text-gray-600 dark:text-gray-400 max-w-sm">
                    <div className="truncate">{formatAddress(b.location)}</div>
                  </td>
                  <td className="py-5 px-6 text-gray-900 dark:text-white font-medium">
                    ${b.finalAmount}
                  </td>
                  <td className="py-5 px-6">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                        statusStyles[b.status] ||
                        "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {statusIcons[b.status]}
                      {b.status}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        paymentStatusStyles[b.paymentStatus] ||
                        "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {b.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex gap-3">
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                        onClick={() => handleView(b)}
                      >
                        <FaEye className="text-sm" />
                        View
                      </button>
                      {b.status === "Pending" ? (
                        <button
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-200"
                          onClick={() => handleCancel(b)}
                        >
                          <FaTrash className="text-sm" />
                          Cancel
                        </button>
                      ) : (
                        <button
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-600 font-medium cursor-not-allowed"
                          disabled
                        >
                          <FaTimes className="text-sm" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                      <FaInfoCircle className="text-2xl text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                      No bookings found
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm || filter !== "All"
                        ? "Try adjusting your search or filter criteria"
                        : "You don't have any bookings yet"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      {modal && modal.type === "view" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl relative animate-scale-in max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-5 right-5 text-gray-400 hover:text-[var(--accent)] text-xl transition-transform hover:rotate-90 z-10"
              onClick={closeModal}
            >
              <FaTimes />
            </button>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Booking Details
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${
                  statusStyles[modal.booking.status] ||
                  "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {statusIcons[modal.booking.status]}
                {modal.booking.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Information */}
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaInfoCircle className="text-[var(--accent)]" />
                  Service Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Service
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {modal.booking.service?.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Description
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {modal.booking.serviceSnapshot?.description ||
                        "No description available"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Duration
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {modal.booking.duration} minutes
                    </div>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaCalendarAlt className="text-[var(--accent)]" />
                  Date & Time
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Date
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatDate(modal.booking.date)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Time
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatTime(modal.booking.time)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Worker Information */}
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaUserCog className="text-[var(--accent)]" />
                  Worker Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Name
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {modal.booking.worker?.name || "Unassigned"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Contact
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <FaPhone className="text-sm" />
                      {modal.booking.worker?.phone || "N/A"}
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2 mt-1">
                      <FaEnvelope className="text-sm" />
                      {modal.booking.worker?.email || "N/A"}
                    </div>
                  </div>
                  {modal.booking.workerNotes && (
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Worker Notes
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {modal.booking.workerNotes}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[var(--accent)]" />
                  Location
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Address
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatAddress(modal.booking.location)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaMoneyBillWave className="text-[var(--accent)]" />
                  Payment Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Amount
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      ${modal.booking.finalAmount}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Payment Status
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        paymentStatusStyles[modal.booking.paymentStatus] ||
                        "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {modal.booking.paymentStatus}
                    </span>
                  </div>
                  {modal.booking.billing?.invoiceNumber && (
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Invoice Number
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <FaFileInvoiceDollar className="text-sm" />
                        {modal.booking.billing.invoiceNumber}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Notes */}
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaStickyNote className="text-[var(--accent)]" />
                  Additional Notes
                </h3>
                <div className="space-y-3">
                  {modal.booking.customerNotes && (
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Your Notes
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {modal.booking.customerNotes}
                      </div>
                    </div>
                  )}
                  {modal.booking.billing?.billingNotes && (
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Billing Notes
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {modal.booking.billing.billingNotes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Booking ID
              </div>
              <div className="font-mono text-sm text-gray-700 dark:text-gray-300">
                {modal.booking._id}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-dark)] transition-colors flex items-center gap-2"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Modal */}
      {modal && modal.type === "cancel" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative animate-scale-in">
            <button
              className="absolute top-5 right-5 text-gray-400 hover:text-[var(--accent)] text-xl transition-transform hover:rotate-90"
              onClick={closeModal}
            >
              <FaTimes />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-red-500 flex items-center gap-2">
              <FaTimes />
              Cancel Booking
            </h2>

            <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-xl mb-6">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Are you sure you want to cancel{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {modal.booking.service?.name}
                </span>{" "}
                with{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {modal.booking.worker?.name || "Unassigned"}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={closeModal}
              >
                Go Back
              </button>
              <button
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                onClick={confirmCancel}
              >
                <FaTrash className="text-sm" />
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
