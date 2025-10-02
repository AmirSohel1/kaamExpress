import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { getWorkerEarnings, markEarningPaid } from "../../api/workerEarnings";
import {
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaFilter,
  FaDownload,
  FaExclamationTriangle,
  FaMoneyCheckAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaTools,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaFileInvoiceDollar,
} from "react-icons/fa";

// Skeleton loader component
const EarningsSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-3 flex-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
    </div>
  </div>
);

// Earnings card component
const EarningsCard = ({ earning, onViewDetails }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
    <div className="flex flex-col md:flex-row md:justify-between gap-4">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
            ID: {earning.jobId}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
              earning.status === "Paid"
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
            }`}
          >
            {earning.status}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {earning.service?.name || "Service unknown"}
        </h3>

        <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <FaUser className="text-gray-400" size={12} />
            <span>{earning.customer?.name || "Unknown Customer"}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaCalendarAlt className="text-gray-400" size={12} />
            <span>
              {earning.date ? new Date(earning.date).toLocaleDateString() : "-"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt className="text-gray-400" size={12} />
            <span>{earning.location?.city || "Location not specified"}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <div className="text-right">
          <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
            ₹{earning.amount?.toLocaleString() || "0"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Earnings
          </p>
        </div>

        <button
          className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium flex items-center gap-1 transition-colors mt-4"
          onClick={() => onViewDetails(earning)}
          aria-label={`View details for job ${earning.jobId}`}
        >
          <FaInfoCircle size={14} /> Details
        </button>
      </div>
    </div>
  </div>
);

EarningsCard.propTypes = {
  earning: PropTypes.object.isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

// Earnings modal component
const EarningsModal = ({ earning, onClose, onMarkAsPaid }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-lg relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FaTimes size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
            <FaFileInvoiceDollar
              className="text-cyan-600 dark:text-cyan-400"
              size={24}
            />
          </div>
          <h3
            id="modal-title"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            Earning Details
          </h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Job ID" value={earning.jobId} />
            <DetailItem
              label="Status"
              value={earning.status}
              isStatus
              isPaid={earning.status === "Paid"}
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <FaUser size={14} /> Customer Information
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <DetailItem label="Name" value={earning.customer?.name || "-"} />
              <DetailItem
                label="Phone"
                value={earning.customer?.phone || "-"}
              />
              <DetailItem
                label="Email"
                value={earning.customer?.email || "-"}
                colSpan={2}
              />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <FaTools size={14} /> Service Details
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <DetailItem
                label="Service"
                value={earning.service?.name || "-"}
              />
              <DetailItem
                label="Duration"
                value={`${earning.duration || 0} mins`}
              />
              <DetailItem
                label="Date"
                value={
                  earning.date
                    ? new Date(earning.date).toLocaleDateString()
                    : "-"
                }
              />
              <DetailItem label="Time" value={earning.time || "-"} />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <FaMapMarkerAlt size={14} /> Location
            </h4>
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {earning.location?.street || "-"}
                {earning.location?.street && <br />}
                {earning.location?.city || ""}{" "}
                {earning.location?.state ? `, ${earning.location.state}` : ""}
                {earning.location?.zip ? ` ${earning.location.zip}` : ""}
                {earning.location?.country ? <br /> : ""}
                {earning.location?.country || ""}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Financial Details
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <DetailItem
                label="Base Price"
                value={`₹${earning.price?.toLocaleString() || "0"}`}
              />
              <DetailItem
                label="Tax"
                value={`₹${earning.tax?.toLocaleString() || "0"}`}
              />
              <DetailItem
                label="Discount"
                value={`-₹${earning.discount?.toLocaleString() || "0"}`}
              />
              <DetailItem
                label="Final Amount"
                value={`₹${earning.finalAmount?.toLocaleString() || "0"}`}
                highlight
              />
            </div>
          </div>

          {earning.customerNotes && (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Customer Notes
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {earning.customerNotes}
              </p>
            </div>
          )}
        </div>

        {earning.status !== "Paid" && (
          <button
            className="mt-6 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium flex items-center gap-2 w-full justify-center transition-colors"
            onClick={() => onMarkAsPaid(earning.jobId)}
          >
            <FaCheck /> Mark as Paid
          </button>
        )}
      </div>
    </div>
  );
};

// Helper component for detail items
const DetailItem = ({
  label,
  value,
  isStatus,
  isPaid,
  highlight,
  colSpan = 1,
}) => {
  if (isStatus) {
    return (
      <div className={`col-span-${colSpan}`}>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <span
          className={`text-sm font-medium px-2 py-1 rounded-full ${
            isPaid
              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
              : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
          }`}
        >
          {value}
        </span>
      </div>
    );
  }

  return (
    <div className={`col-span-${colSpan}`}>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p
        className={`text-sm font-medium ${
          highlight
            ? "text-cyan-600 dark:text-cyan-400"
            : "text-gray-900 dark:text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

EarningsModal.propTypes = {
  earning: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onMarkAsPaid: PropTypes.func.isRequired,
};

// Custom hook for earnings data
const useEarnings = () => {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEarnings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWorkerEarnings();
      setEarnings(data);
    } catch (err) {
      setError(
        err.message || "Failed to load earnings. Please try again later."
      );
      console.error("Earnings fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  const markAsPaid = async (jobId) => {
    try {
      const updated = await markEarningPaid(jobId);
      setEarnings((prev) => prev.map((e) => (e.jobId === jobId ? updated : e)));
      return { success: true };
    } catch (err) {
      console.error("Mark as paid error:", err);
      return {
        success: false,
        error:
          err.message || "Failed to update payment status. Please try again.",
      };
    }
  };

  return { earnings, loading, error, fetchEarnings, markAsPaid };
};

// Main Earnings component
const Earnings = () => {
  const { earnings, loading, error, markAsPaid } = useEarnings();
  const [modalEarning, setModalEarning] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      5000
    );
  };

  // Calculate statistics
  const totalEarnings = earnings
    .filter((e) => e.status === "Paid")
    .reduce((sum, e) => sum + (e.finalAmount || e.amount || 0), 0);

  const pendingEarnings = earnings
    .filter((e) => e.status === "Pending")
    .reduce((sum, e) => sum + (e.finalAmount || e.amount || 0), 0);

  const paidJobs = earnings.filter((e) => e.status === "Paid").length;
  const pendingJobs = earnings.filter((e) => e.status === "Pending").length;

  // Filter and sort earnings
  const filteredEarnings = earnings
    .filter((earning) => {
      const matchesFilter =
        filter === "all" || earning.status.toLowerCase() === filter;
      const matchesSearch =
        searchTerm === "" ||
        earning.jobId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        earning.customer?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        earning.service?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "amount":
          aValue = a.finalAmount || a.amount || 0;
          bValue = b.finalAmount || b.amount || 0;
          break;
        case "customer":
          aValue = a.customer?.name || "";
          bValue = b.customer?.name || "";
          break;
        case "service":
          aValue = a.service?.name || "";
          bValue = b.service?.name || "";
          break;
        case "date":
        default:
          aValue = a.date ? new Date(a.date) : new Date(0);
          bValue = b.date ? new Date(b.date) : new Date(0);
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleMarkAsPaid = async (jobId) => {
    setActionLoading(true);
    const result = await markAsPaid(jobId);

    if (result.success) {
      showNotification("Earning marked as paid successfully!", "success");
      setModalEarning(null);
    } else {
      showNotification(result.error, "error");
    }
    setActionLoading(false);
  };

  const handleViewDetails = (earning) => {
    setModalEarning(earning);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const exportCSV = () => {
    try {
      const csv = [
        [
          "Job ID",
          "Customer",
          "Service",
          "Amount",
          "Status",
          "Date",
          "Location",
          "Billing",
          "Notes",
        ],
        ...filteredEarnings.map((e) => [
          e.jobId,
          e.customer?.name || "-",
          e.service?.name || "-",
          e.finalAmount || e.amount || 0,
          e.status,
          e.date ? new Date(e.date).toLocaleDateString() : "-",
          e.location ? `${e.location.street}, ${e.location.city}` : "-",
          e.billing?.billingNotes || "-",
          e.customerNotes || "-",
        ]),
      ]
        .map((row) => `"${row.join('","')}"`)
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `worker_earnings_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showNotification("Earnings exported successfully!", "success");
    } catch (err) {
      console.error("Export error:", err);
      showNotification("Failed to export earnings. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            notification.type === "error"
              ? "bg-red-100 border border-red-400 text-red-700"
              : "bg-green-100 border border-green-400 text-green-700"
          }`}
        >
          {notification.type === "error" ? (
            <FaExclamationTriangle />
          ) : (
            <FaCheck />
          )}
          <span>{notification.message}</span>
          <button
            onClick={() =>
              setNotification({ show: false, message: "", type: "" })
            }
            className="ml-4"
            aria-label="Close notification"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FaMoneyCheckAlt className="text-cyan-600" /> Earnings Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your earnings and payment status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Earnings"
          value={`₹${totalEarnings.toLocaleString()}`}
          icon={<FaMoneyCheckAlt className="text-cyan-600" />}
          description={`From ${paidJobs} paid jobs`}
          className="bg-white dark:bg-gray-800 border-l-4 border-cyan-500"
        />
        <StatCard
          title="Pending Earnings"
          value={`₹${pendingEarnings.toLocaleString()}`}
          icon={<FaExclamationTriangle className="text-yellow-500" />}
          description={`From ${pendingJobs} pending jobs`}
          className="bg-white dark:bg-gray-800 border-l-4 border-yellow-500"
        />
        <StatCard
          title="Paid Jobs"
          value={paidJobs}
          icon={<FaCheck className="text-green-500" />}
          description="Completed and paid"
          className="bg-white dark:bg-gray-800 border-l-4 border-green-500"
        />
        <StatCard
          title="Pending Jobs"
          value={pendingJobs}
          icon={<FaFilter className="text-orange-500" />}
          description="Awaiting payment"
          className="bg-white dark:bg-gray-800 border-l-4 border-orange-500"
        />
      </div>

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by job ID, customer, or service..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500 dark:text-gray-400" />
              <select
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full sm:w-auto"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filter earnings by status"
              >
                <option value="all">All Earnings</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Sort by:
              </span>
              <select
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full sm:w-auto"
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                aria-label="Sort earnings"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="customer">Customer</option>
                <option value="service">Service</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg"
                aria-label="Toggle sort order"
              >
                {sortOrder === "asc" ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>

            <button
              onClick={exportCSV}
              disabled={filteredEarnings.length === 0}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 justify-center"
              aria-label="Export earnings to CSV"
            >
              <FaDownload /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Earnings List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {filter === "all"
              ? "All Earnings"
              : filter === "paid"
              ? "Paid Earnings"
              : "Pending Earnings"}
            <span className="text-gray-500 text-sm ml-2">
              ({filteredEarnings.length} jobs)
            </span>
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sorted by {sortBy} ({sortOrder})
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <EarningsSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <FaExclamationTriangle className="text-red-500 text-2xl mx-auto mb-2" />
            <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredEarnings.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white dark:bg-gray-800 rounded-xl p-6 border border-dashed">
            <FaFilter className="text-2xl mx-auto mb-2 opacity-50" />
            <p>No earnings found for the selected criteria.</p>
            {(searchTerm || filter !== "all") && (
              <button
                className="text-cyan-600 dark:text-cyan-400 mt-2"
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEarnings.map((earning) => (
              <EarningsCard
                key={earning.jobId}
                earning={earning}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalEarning && (
        <EarningsModal
          earning={modalEarning}
          onClose={() => setModalEarning(null)}
          onMarkAsPaid={handleMarkAsPaid}
        />
      )}

      {/* Action Loading Overlay */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl flex items-center gap-3 shadow-lg">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-600"></div>
            <span className="text-gray-700 dark:text-gray-300">
              Processing...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Stat card component
const StatCard = ({ title, value, icon, description, className = "" }) => (
  <div className={`rounded-xl p-5 shadow-sm ${className}`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
          {value}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {description}
        </p>
      </div>
      <div className="p-2 bg-opacity-20 rounded-lg">{icon}</div>
    </div>
  </div>
);

Earnings.propTypes = {
  // Add any props if needed in the future
};

export default Earnings;
