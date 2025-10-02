import React, { useState, useEffect, useMemo } from "react";
import { updatePayment } from "../../api/payments";
import { getWorkerJobs, updateJobStatus } from "../../api/workerJobs";
import {
  FaFilter,
  FaTimes,
  FaExternalLinkAlt,
  FaSearch,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaUser,
  FaCog,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPhone,
  FaEnvelope,
  FaInfoCircle,
  FaClock,
  FaFileInvoiceDollar,
  FaEdit,
} from "react-icons/fa";
import { format, parseISO, isAfter, isBefore } from "date-fns";

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "In-progress", value: "In-progress" },
  { label: "Accepted", value: "Accepted" },
  { label: "Rejected", value: "Rejected" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

const paymentMethods = [
  { label: "Cash", value: "Cash" },
  { label: "Card", value: "Card" },
  { label: "UPI", value: "UPI" },
  { label: "NetBanking", value: "NetBanking" },
  { label: "Wallet", value: "Wallet" },
  { label: "Other", value: "Other" },
];

const Jobs = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalJob, setModalJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    getWorkerJobs()
      .then((data) => {
        // If API returns { jobs: [...] }, extract jobs array
        if (Array.isArray(data)) {
          setJobs(data);
        } else if (Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        } else {
          setJobs([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load jobs");
        setLoading(false);
      });
  }, []);

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    let result = [...jobs];
    const now = new Date();

    // Filter by tab (upcoming/past/all)
    if (activeTab === "upcoming") {
      result = result.filter(
        (job) => job.date && isAfter(parseISO(job.date), now)
      );
    } else if (activeTab === "past") {
      result = result.filter(
        (job) => job.date && isBefore(parseISO(job.date), now)
      );
    }

    // Filter by status
    if (filter !== "all") {
      result = result.filter((job) => job.status === filter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.service?.name?.toLowerCase().includes(query) ||
          job.customer?.name?.toLowerCase().includes(query) ||
          `${job.location?.street} ${job.location?.city} ${job.location?.state}`
            .toLowerCase()
            .includes(query)
      );
    }

    // Sort jobs
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties
        if (sortConfig.key === "customer") {
          aValue = a.customer?.name || "";
          bValue = b.customer?.name || "";
        }
        if (sortConfig.key === "service") {
          aValue = a.service?.name || "";
          bValue = b.service?.name || "";
        }
        if (sortConfig.key === "location") {
          aValue = `${a.location?.street} ${a.location?.city}` || "";
          bValue = `${b.location?.street} ${b.location?.city}` || "";
        }

        // Handle dates
        if (sortConfig.key === "date" || sortConfig.key === "createdAt") {
          aValue = aValue ? new Date(aValue).getTime() : 0;
          bValue = bValue ? new Date(bValue).getTime() : 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [jobs, filter, searchQuery, sortConfig, activeTab]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const job = jobs.find((j) => j._id === id);

    // If marking as Completed and not paid, open payment modal
    if (newStatus === "Completed" && job && !job.isPaid) {
      setModalJob(job);
      setSelectedStatus(newStatus);
      setShowPaymentModal(true);
      return;
    }

    try {
      await updateJobStatus(id, { status: newStatus });
      setJobs((prev) =>
        prev.map((j) => (j._id === id ? { ...j, status: newStatus } : j))
      );
      setModalJob(null);
    } catch (e) {
      console.error("Failed to update status:", e);
      alert("Failed to update job status. Please try again.");
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }
    const amount = Number(modalJob.finalAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Invalid payment amount. Please check the job price.");
      return;
    }
    setPaymentLoading(true);
    try {
      const data = {
        amount,
        method: paymentMethod,
        transactionId: `TXN${Date.now()}`,
      };
      await updatePayment(modalJob._id, data);
      await updateJobStatus(modalJob._id, { status: "Completed" });

      setJobs((prev) =>
        prev.map((j) =>
          j._id === modalJob._id
            ? { ...j, status: "Completed", isPaid: true }
            : j
        )
      );
      setShowPaymentModal(false);
      setModalJob(null);
      setPaymentMethod("");
    } catch (e) {
      let msg = "Payment failed or job update failed";
      if (e?.response?.data?.error) {
        msg += ": " + e.response.data.error;
      } else if (e?.message) {
        msg += ": " + e.message;
      }
      alert(msg);
      console.error("Payment error:", e);
    } finally {
      setPaymentLoading(false);
    }
  };

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    "In-progress": "bg-blue-100 text-blue-800 border-blue-200",
    Accepted: "bg-indigo-100 text-indigo-800 border-indigo-200",
    Rejected: "bg-red-100 text-red-800 border-red-200",
    Completed: "bg-green-100 text-green-800 border-green-200",
    Cancelled: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const paymentStatusColors = {
    Paid: "bg-green-100 text-green-800 border-green-200",
    Unpaid: "bg-red-100 text-red-800 border-red-200",
    Partial: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  // Stats
  const now = new Date();
  const totalJobs = jobs.length;
  const upcomingJobs = jobs.filter(
    (job) => job.date && isAfter(parseISO(job.date), now)
  ).length;
  const pastJobs = jobs.filter(
    (job) => job.date && isBefore(parseISO(job.date), now)
  ).length;
  const completedJobs = jobs.filter((job) => job.status === "Completed").length;
  const earnings = jobs
    .filter((j) => j.isPaid)
    .reduce((sum, job) => sum + (Number(job.finalAmount) || 0), 0);

  return (
    <div className="min-h-screen bg-[var(--primary)] text-[var(--text-light)]">
      {/* Header */}
      <div className="bg-[var(--card)] shadow-sm border-b border-[var(--accent)]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[var(--accent)]">
              Job Management
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-[var(--card)] border border-[var(--accent)]/30 rounded-xl shadow-sm text-sm font-medium text-[var(--accent)] hover:bg-[var(--secondary)] hover:text-white transition-all"
              >
                <FaFilter className="mr-2" />
                Filters
              </button>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="block w-full pl-10 pr-3 py-2 border border-[var(--accent)]/30 rounded-xl leading-5 bg-[var(--secondary)] text-[var(--text-light)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] sm:text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "upcoming"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Upcoming Jobs
                </button>
                <button
                  onClick={() => setActiveTab("past")}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "past"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Past Jobs
                </button>
                <button
                  onClick={() => setActiveTab("all")}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "all"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  All Jobs
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-[var(--card)] shadow-md border-b border-[var(--accent)]/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Status:
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-[var(--card)] overflow-hidden shadow rounded-xl border border-[var(--accent)]/10">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <FaCalendarAlt className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Jobs
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-500">
                        {totalJobs}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--secondary)] overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <FaClock className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Upcoming
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-500">
                        {upcomingJobs}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--secondary)] overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <FaCheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completed
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-500">
                        {completedJobs}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--secondary)] overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <FaMoneyBillWave className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Earnings
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-500">
                        ₹{earnings.toLocaleString()}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-[var(--card)] shadow overflow-hidden rounded-xl border border-[var(--accent)]/10">
          {/* Loading and Error States */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaExclamationTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      onClick={() => window.location.reload()}
                      className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                    >
                      <span className="sr-only">Dismiss</span>
                      <FaTimes className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Jobs Table */}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[var(--accent)]/10">
                <thead className="bg-[var(--secondary)]">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("service")}
                    >
                      <div className="flex items-center">
                        Service {getSortIndicator("service")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("customer")}
                    >
                      <div className="flex items-center">
                        <FaUser className="mr-1" /> Customer{" "}
                        {getSortIndicator("customer")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-1" /> Date{" "}
                        {getSortIndicator("date")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("location")}
                    >
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-1" /> Location{" "}
                        {getSortIndicator("location")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("finalAmount")}
                    >
                      <div className="flex items-center">
                        <FaMoneyBillWave className="mr-1" /> Amount{" "}
                        {getSortIndicator("finalAmount")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Payment
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[var(--card)] divide-y divide-[var(--accent)]/10">
                  {filteredAndSortedJobs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center justify-center text-[var(--text-muted)]">
                          <FaCog className="h-12 w-12 mb-4 opacity-30" />
                          <p className="text-lg font-medium">No jobs found</p>
                          <p className="mt-1 text-sm">
                            {searchQuery || filter !== "all"
                              ? "Try adjusting your filters or search terms"
                              : "You don't have any jobs yet"}
                          </p>
                          {(searchQuery || filter !== "all") && (
                            <button
                              className="mt-4 text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm font-medium"
                              onClick={() => {
                                setSearchQuery("");
                                setFilter("all");
                              }}
                            >
                              Clear all filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedJobs.map((job) => (
                      <tr
                        key={job._id}
                        className="transition-all duration-150 hover:bg-[var(--accent)]/10 hover:text-[var(--text-light)]"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-[var(--accent)]">
                                {job.service?.name}
                              </div>
                              <div className="text-sm text-[var(--text-muted)]">
                                {job.duration} mins
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[var(--accent)]">
                            {job.customer?.name}
                          </div>
                          <div className="text-sm text-[var(--text-muted)] flex items-center">
                            <FaPhone className="mr-1 text-xs" />{" "}
                            {job.customer?.phone}
                          </div>
                          <div className="text-sm text-[var(--text-muted)] flex items-center">
                            <FaEnvelope className="mr-1 text-xs" />{" "}
                            {job.customer?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[var(--accent)]">
                            {job.date
                              ? format(parseISO(job.date), "MMM dd, yyyy")
                              : "N/A"}
                          </div>
                          <div className="text-sm text-[var(--text-muted)]">
                            {job.time}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-[var(--accent)]">
                            {job.location?.street}
                          </div>
                          <div className="text-sm text-[var(--text-muted)]">
                            {job.location?.city}, {job.location?.state}{" "}
                            {job.location?.zip}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--accent)]">
                          ₹{job.finalAmount}
                          {job.discount > 0 && (
                            <div className="text-xs text-[var(--text-muted)] line-through">
                              ₹{job.price}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                              statusColors[job.status]
                            } bg-opacity-80`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                              paymentStatusColors[job.paymentStatus]
                            } bg-opacity-80`}
                          >
                            {job.paymentStatus}
                          </span>
                          {job.isPaid && (
                            <div className="text-xs text-[var(--text-muted)] mt-1">
                              {job.billing?.billingNotes}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setModalJob(job);
                                setSelectedStatus(job.status);
                              }}
                              className="text-[var(--accent)] hover:text-[var(--accent-hover)]"
                            >
                              <FaExternalLinkAlt />
                            </button>
                            {job.status !== "Completed" &&
                              job.status !== "Cancelled" && (
                                <select
                                  className="text-sm border-[var(--accent)]/30 rounded-md shadow-sm focus:ring-[var(--accent)] focus:border-[var(--accent)] bg-[var(--card)] text-[var(--text-light)]"
                                  value={job.status}
                                  onChange={(e) =>
                                    handleStatusUpdate(job._id, e.target.value)
                                  }
                                >
                                  {statusOptions
                                    .filter((o) => o.value !== "all")
                                    .map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                </select>
                              )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Job Detail Modal */}
      {modalJob && !showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-2xl rounded-2xl bg-[var(--card)] border-[var(--accent)]/20">
            <div className="mt-3">
              <div className="flex justify-between items-center pb-3 border-b border-[var(--accent)]/10">
                <h3 className="text-xl font-medium text-[var(--accent)]">
                  Booking Details
                </h3>
                <button
                  onClick={() => setModalJob(null)}
                  className="text-[var(--text-muted)] hover:text-[var(--accent)]"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-[var(--accent)] mb-2">
                    Service Information
                  </h4>
                  <div className="bg-[var(--secondary)] p-4 rounded-md">
                    <div className="text-lg font-medium text-[var(--accent)]">
                      {modalJob.service?.name}
                    </div>
                    <div className="text-sm text-[var(--text-muted)] mt-1">
                      {modalJob.serviceSnapshot?.description}
                    </div>
                    <div className="mt-3 flex items-center text-sm text-[var(--text-muted)]">
                      <FaClock className="mr-1" /> {modalJob.duration} minutes
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-[var(--accent)] mb-2">
                    Customer Information
                  </h4>
                  <div className="bg-[var(--secondary)] p-4 rounded-md">
                    <div className="text-lg font-medium text-[var(--accent)]">
                      {modalJob.customer?.name}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-[var(--text-muted)]">
                      <FaPhone className="mr-2" /> {modalJob.customer?.phone}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-[var(--text-muted)]">
                      <FaEnvelope className="mr-2" /> {modalJob.customer?.email}
                    </div>
                    {modalJob.customerNotes && (
                      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-100 rounded-md text-sm">
                        <div className="flex items-center text-yellow-800">
                          <FaInfoCircle className="mr-1" /> Customer Notes
                        </div>
                        <p className="mt-1 text-yellow-700">
                          {modalJob.customerNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-[var(--accent)] mb-2">
                    Schedule
                  </h4>
                  <div className="bg-[var(--secondary)] p-4 rounded-md">
                    <div className="flex items-center text-lg text-[var(--accent)]">
                      <FaCalendarAlt className="mr-2 text-blue-500" />
                      {modalJob.date
                        ? format(parseISO(modalJob.date), "EEEE, MMMM do yyyy")
                        : "Not scheduled"}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-[var(--text-muted)]">
                      <FaClock className="mr-2" /> {modalJob.time}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-[var(--accent)] mb-2">
                    Location
                  </h4>
                  <div className="bg-[var(--secondary)] p-4 rounded-md">
                    <div className="text-lg font-medium text-[var(--accent)]">
                      {modalJob.location?.street}
                    </div>
                    <div className="text-sm text-[var(--text-muted)] mt-1">
                      {modalJob.location?.city}, {modalJob.location?.state}{" "}
                      {modalJob.location?.zip}
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">
                      {modalJob.location?.country}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-[var(--accent)] mb-2">
                    Pricing & Payment
                  </h4>
                  <div className="bg-[var(--secondary)] p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--text-muted)]">
                        Base Price:
                      </span>
                      <span className="font-medium text-[var(--accent)]">
                        ₹{modalJob.price}
                      </span>
                    </div>
                    {modalJob.discount > 0 && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[var(--text-muted)]">
                          Discount:
                        </span>
                        <span className="font-medium text-red-600">
                          -₹{modalJob.discount}
                        </span>
                      </div>
                    )}
                    {modalJob.tax > 0 && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[var(--text-muted)]">Tax:</span>
                        <span className="font-medium text-[var(--accent)]">
                          +₹{modalJob.tax}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-[var(--accent)]/10">
                      <span className="text-lg font-medium text-[var(--accent)]">
                        Total Amount:
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        ₹{modalJob.finalAmount}
                      </span>
                    </div>
                    <div className="mt-3">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                          paymentStatusColors[modalJob.paymentStatus]
                        } bg-opacity-80`}
                      >
                        {modalJob.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-[var(--accent)] mb-2">
                    Status & Actions
                  </h4>
                  <div className="bg-[var(--secondary)] p-4 rounded-md">
                    <div className="mb-4">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                          statusColors[modalJob.status]
                        } bg-opacity-80`}
                      >
                        {modalJob.status}
                      </span>
                    </div>

                    {modalJob.status !== "Completed" &&
                      modalJob.status !== "Cancelled" && (
                        <div>
                          <label className="block text-sm font-medium text-[var(--accent)] mb-2">
                            Update Status
                          </label>
                          <select
                            className="block w-full pl-3 pr-10 py-2 text-base border-[var(--accent)]/30 focus:outline-none focus:ring-[var(--accent)] focus:border-[var(--accent)] sm:text-sm rounded-md bg-[var(--card)] text-[var(--text-light)]"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                          >
                            {statusOptions
                              .filter((o) => o.value !== "all")
                              .map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                          </select>
                          <button
                            onClick={() =>
                              handleStatusUpdate(modalJob._id, selectedStatus)
                            }
                            className="mt-3 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Update Status
                          </button>
                        </div>
                      )}

                    {modalJob.workerNotes && (
                      <div className="mt-4 p-2 bg-blue-50 border border-blue-100 rounded-md text-sm">
                        <div className="flex items-center text-blue-800">
                          <FaInfoCircle className="mr-1" /> Worker Notes
                        </div>
                        <p className="mt-1 text-blue-700">
                          {modalJob.workerNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setModalJob(null)}
                  className="px-4 py-2 bg-[var(--secondary)] text-[var(--accent)] rounded-md hover:bg-[var(--accent)] hover:text-white mr-3"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && modalJob && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-md shadow-2xl rounded-2xl bg-[var(--card)] border-[var(--accent)]/20">
            <div className="mt-3">
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  Complete Payment
                </h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mt-4">
                <div className="bg-blue-50 p-4 rounded-md mb-4">
                  <div className="text-center text-lg font-medium text-blue-800">
                    ₹{modalJob.finalAmount}
                  </div>
                  <div className="text-center text-sm text-blue-600 mt-1">
                    {modalJob.service?.name} for {modalJob.customer?.name}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="">Select a payment method</option>
                    {paymentMethods.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>

                {modalJob.billing?.billingNotes && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="text-sm text-yellow-800">
                      <strong>Billing Notes:</strong>{" "}
                      {modalJob.billing.billingNotes}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentMethod("");
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={paymentLoading || !paymentMethod}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentLoading ? "Processing..." : "Confirm Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
