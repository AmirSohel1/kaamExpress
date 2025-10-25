import React, { useState, useEffect, useMemo } from "react";
import {
  FaFilter,
  FaSearch,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaExclamationTriangle,
  FaCog,
  FaPhone,
  FaEnvelope,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaStar,
  FaEdit,
  FaTrash,
  FaEye,
  FaChevronDown,
  FaChevronUp,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import {
  parseISO,
  isBefore,
  isAfter,
  format,
  differenceInDays,
} from "date-fns";
import { updateJobStatus,createPayment, updatePayment, fetchBookings } from "../../api/";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "Pending", label: "Pending", color: "yellow" },
  { value: "Accepted", label: "Accepted", color: "blue" },
  { value: "In-progress", label: "In Progress", color: "indigo" },
  { value: "Completed", label: "Completed", color: "green" },
  { value: "Rejected", label: "Rejected", color: "red" },
  { value: "Cancelled", label: "Cancelled", color: "gray" },
];

const priorityOptions = [
  { value: "all", label: "All Priority" },
  { value: "high", label: "High", color: "red" },
  { value: "medium", label: "Medium", color: "yellow" },
  { value: "low", label: "Low", color: "green" },
];

const paymentMethods = [
  { value: "Cash", label: "Cash" },
  { value: "Card", label: "Card" },
  { value: "UPI", label: "UPI" },
  { value: "Wallet", label: "Wallet" },
];

const Jobs = () => {
  // State variables
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "ascending",
  });
  const [modalJob, setModalJob] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedJobs, setSelectedJobs] = useState(new Set());
  const [bulkAction, setBulkAction] = useState("");

  // Fetch jobs data
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const data = await fetchBookings();
        console.log("Fetched bookings:", data.bookings);
        setJobs(data.bookings || []);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  // Calculate job priority based on date and status
  const calculatePriority = (job) => {
    if (!job.date) return "medium";

    const jobDate = parseISO(job.date);
    const today = new Date();
    const daysUntil = differenceInDays(jobDate, today);

    if (daysUntil < 1) return "high";
    if (daysUntil <= 3) return "medium";
    return "low";
  };

  // Enhanced jobs with calculated fields
  const enhancedJobs = useMemo(() => {
    return jobs.map((job) => ({
      ...job,
      priority: calculatePriority(job),
      daysUntil: job.date
        ? differenceInDays(parseISO(job.date), new Date())
        : null,
      isUrgent: calculatePriority(job) === "high",
    }));
  }, [jobs]);

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = enhancedJobs;

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((job) => job.priority === priorityFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter((job) => {
        if (!job.date) return false;
        const jobDate = parseISO(job.date);
        switch (dateFilter) {
          case "today":
            return format(jobDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
          case "week":
            return (
              differenceInDays(jobDate, now) <= 7 &&
              differenceInDays(jobDate, now) >= 0
            );
          case "month":
            return (
              differenceInDays(jobDate, now) <= 30 &&
              differenceInDays(jobDate, now) >= 0
            );
          case "overdue":
            return isBefore(jobDate, now) && job.status !== "Completed";
          default:
            return true;
        }
      });
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((job) => {
        const serviceName = job.service?.name?.toLowerCase() || "";
        const customerName = job.customer?.name?.toLowerCase() || "";
        const customerPhone = job.customer?.phone?.toLowerCase() || "";
        const location = job.location?.street?.toLowerCase() || "";

        return (
          serviceName.includes(searchQuery.toLowerCase()) ||
          customerName.includes(searchQuery.toLowerCase()) ||
          customerPhone.includes(searchQuery.toLowerCase()) ||
          location.includes(searchQuery.toLowerCase())
        );
      });
    }

    // Tab filter
    const now = new Date();
    switch (activeTab) {
      case "upcoming":
        filtered = filtered.filter(
          (job) => job.date && isAfter(parseISO(job.date), now)
        );
        break;
      case "past":
        filtered = filtered.filter(
          (job) => job.date && isBefore(parseISO(job.date), now)
        );
        break;
      case "urgent":
        filtered = filtered.filter((job) => job.isUrgent);
        break;
      default:
        // "all" tab - no additional filtering
        break;
    }

    // Sort
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties and special cases
        if (sortConfig.key === "customer") {
          aValue = a.customer?.name || "";
          bValue = b.customer?.name || "";
        } else if (sortConfig.key === "service") {
          aValue = a.service?.name || "";
          bValue = b.service?.name || "";
        } else if (sortConfig.key === "date") {
          aValue = a.date ? parseISO(a.date) : new Date(0);
          bValue = b.date ? parseISO(b.date) : new Date(0);
        } else if (sortConfig.key === "location") {
          aValue = a.location?.street || "";
          bValue = b.location?.street || "";
        } else if (sortConfig.key === "priority") {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
        }

        if (aValue < bValue)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [
    enhancedJobs,
    statusFilter,
    priorityFilter,
    dateFilter,
    searchQuery,
    activeTab,
    sortConfig,
  ]);

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
      // const res = await updatePayment(modalJob._id, data);
      const res = await createPayment(modalJob._id, data);
      console.log(res);
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

  // Match admin Bookings table theme/colors
  const statusColors = {
    Completed: "bg-green-900 text-green-300 border-green-900",
    "In-progress": "bg-blue-900 text-blue-300 border-blue-900",
    Pending: "bg-yellow-900 text-yellow-300 border-yellow-900",
    Accepted: "bg-blue-900 text-blue-300 border-blue-900",
    Rejected: "bg-red-900 text-red-300 border-red-900",
    Cancelled: "bg-gray-700 text-gray-300 border-gray-700",
  };

  const paymentStatusColors = {
    Paid: "bg-green-900 text-green-300 border-green-900",
    Unpaid: "bg-red-900 text-red-300 border-red-900",
    Partial: "bg-yellow-900 text-yellow-300 border-yellow-900",
  };

  const priorityColors = {
    high: "bg-red-900 text-red-300 border-red-900",
    medium: "bg-yellow-900 text-yellow-300 border-yellow-900",
    low: "bg-green-900 text-green-300 border-green-900",
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key)
      return <FaSort className="inline ml-1 text-gray-400" />;
    return sortConfig.direction === "ascending" ? (
      <FaSortUp className="inline ml-1 text-blue-500" />
    ) : (
      <FaSortDown className="inline ml-1 text-blue-500" />
    );
  };

  const toggleRowExpansion = (jobId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(jobId)) {
      newExpanded.delete(jobId);
    } else {
      newExpanded.add(jobId);
    }
    setExpandedRows(newExpanded);
  };

  const toggleJobSelection = (jobId) => {
    const newSelected = new Set(selectedJobs);
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId);
    } else {
      newSelected.add(jobId);
    }
    setSelectedJobs(newSelected);
  };

  const selectAllJobs = () => {
    if (selectedJobs.size === filteredAndSortedJobs.length) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(filteredAndSortedJobs.map((job) => job._id)));
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedJobs.size === 0) return;

    try {
      // Implement bulk status update
      const updates = Array.from(selectedJobs).map((id) =>
        updateJobStatus(id, { status: bulkAction })
      );

      await Promise.all(updates);

      // Update local state
      setJobs((prev) =>
        prev.map((job) =>
          selectedJobs.has(job._id) ? { ...job, status: bulkAction } : job
        )
      );

      setSelectedJobs(new Set());
      setBulkAction("");
      alert(`Successfully updated ${selectedJobs.size} jobs to ${bulkAction}`);
    } catch (error) {
      console.error("Bulk action failed:", error);
      alert("Failed to perform bulk action. Please try again.");
    }
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
  const urgentJobs = enhancedJobs.filter((job) => job.isUrgent).length;
  const earnings = jobs
    .filter((j) => j.isPaid)
    .reduce((sum, job) => sum + (Number(job.finalAmount) || 0), 0);

  return (
    <div className="min-h-screen  text-gray-100 font-sans">
      {/* Header */}
      <div className="bg-gray-900 shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Job Management</h1>
              <p className="text-sm text-gray-400 mt-1">
                Manage and track all your service jobs in one place
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-700 transition-all"
              >
                <FaFilter className="mr-2" /> Filters{" "}
                {showFilters ? (
                  <FaChevronUp className="ml-1" />
                ) : (
                  <FaChevronDown className="ml-1" />
                )}
              </button>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search jobs, customers, services..."
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                {[
                  {
                    id: "upcoming",
                    label: "Upcoming Jobs",
                    count: upcomingJobs,
                  },
                  { id: "urgent", label: "Urgent", count: urgentJobs },
                  { id: "past", label: "Past Jobs", count: pastJobs },
                  { id: "all", label: "All Jobs", count: totalJobs },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span
                        className={`ml-2 py-0.5 px-2 text-xs rounded-full ${
                          activeTab === tab.id
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedJobs.size > 0 && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm text-blue-700 font-medium">
                  {selectedJobs.size} job{selectedJobs.size !== 1 ? "s" : ""}{" "}
                  selected
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="block w-40 pl-3 pr-10 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Bulk Actions</option>
                  {statusOptions
                    .filter((opt) => opt.value !== "all")
                    .map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        Set as {opt.label}
                      </option>
                    ))}
                </select>
                <button
                  onClick={handleBulkAction}
                  disabled={!bulkAction}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
                <button
                  onClick={() => setSelectedJobs(new Set())}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="bg-white shadow-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  {priorityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="week">Next 7 Days</option>
                  <option value="month">Next 30 Days</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setPriorityFilter("all");
                    setDateFilter("all");
                    setSearchQuery("");
                  }}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
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
                      <div className="text-2xl font-semibold text-gray-900">
                        {totalJobs}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
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
                      <div className="text-2xl font-semibold text-gray-900">
                        {upcomingJobs}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                  <FaExclamationTriangle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Urgent
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {urgentJobs}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
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
                      <div className="text-2xl font-semibold text-gray-900">
                        {completedJobs}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
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
                      <div className="text-2xl font-semibold text-gray-900">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-gray-900 shadow overflow-hidden rounded-xl border border-gray-800">
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
              <table className="min-w-full divide-y divide-gray-800 font-sans">
                <thead className="bg-gray-950">
                  <tr>
                    <th
                      scope="col"
                      className="relative w-12 px-6 sm:w-16 sm:px-8"
                    >
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={
                          selectedJobs.size === filteredAndSortedJobs.length &&
                          filteredAndSortedJobs.length > 0
                        }
                        onChange={selectAllJobs}
                      />
                    </th>
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
                        <FaCalendarAlt className="mr-1" /> Date & Time{" "}
                        {getSortIndicator("date")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("priority")}
                    >
                      <div className="flex items-center">
                        Priority {getSortIndicator("priority")}
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
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Expand</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {filteredAndSortedJobs.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <FaCog className="h-12 w-12 mb-4 opacity-30" />
                          <p className="text-lg font-medium">No jobs found</p>
                          <p className="mt-1 text-sm">
                            {searchQuery ||
                            statusFilter !== "all" ||
                            priorityFilter !== "all" ||
                            dateFilter !== "all"
                              ? "Try adjusting your filters or search terms"
                              : "You don't have any jobs yet"}
                          </p>
                          {(searchQuery ||
                            statusFilter !== "all" ||
                            priorityFilter !== "all" ||
                            dateFilter !== "all") && (
                            <button
                              className="mt-4 text-blue-600 hover:text-blue-500 text-sm font-medium"
                              onClick={() => {
                                setSearchQuery("");
                                setStatusFilter("all");
                                setPriorityFilter("all");
                                setDateFilter("all");
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
                      <React.Fragment key={job._id}>
                        <tr
                          className={`transition-all duration-150 hover:bg-gray-800 cursor-pointer ${
                            expandedRows.has(job._id) ? "bg-blue-950" : ""
                          } ${selectedJobs.has(job._id) ? "bg-blue-900" : ""}`}
                          onClick={() => toggleRowExpansion(job._id)}
                        >
                          <td
                            className="relative w-12 px-6 sm:w-16 sm:px-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={selectedJobs.has(job._id)}
                              onChange={() => toggleJobSelection(job._id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-semibold text-[var(--accent)]">
                                  {job.service?.name}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {job.duration} mins
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-[var(--accent)]">
                              {job.customer?.name}
                            </div>
                            <div className="text-xs text-gray-400 flex items-center">
                              <FaPhone className="mr-1 text-xs" />{" "}
                              {job.customer?.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-[var(--accent)]">
                              {job.date
                                ? format(parseISO(job.date), "MMM dd, yyyy")
                                : "N/A"}
                            </div>
                            <div className="text-xs text-gray-400">
                              {job.time}
                              {job.daysUntil !== null && (
                                <div
                                  className={`text-xs mt-1 ${
                                    job.daysUntil < 0
                                      ? "text-red-400"
                                      : job.daysUntil === 0
                                      ? "text-yellow-400"
                                      : "text-green-400"
                                  }`}
                                >
                                  {job.daysUntil < 0
                                    ? `${Math.abs(job.daysUntil)} days ago`
                                    : job.daysUntil === 0
                                    ? "Today"
                                    : `in ${job.daysUntil} days`}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                                priorityColors[job.priority]
                              } bg-opacity-90`}
                            >
                              {job.priority.charAt(0).toUpperCase() +
                                job.priority.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[var(--accent)]">
                            ₹{job.finalAmount}
                            {job.discount > 0 && (
                              <div className="text-xs text-gray-400 line-through">
                                ₹{job.price}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                                statusColors[job.status]
                              } bg-opacity-90`}
                            >
                              {job.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                                paymentStatusColors[job.paymentStatus]
                              } bg-opacity-90`}
                            >
                              {job.isPaid ? "Paid" : "Unpaid"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModalJob(job);
                                  setSelectedStatus(job.status);
                                }}
                                className="text-[var(--accent)] hover:text-white"
                                title="View Details"
                              >
                                <FaEye />
                              </button>
                              {job.status !== "Completed" &&
                                job.status !== "Cancelled" && (
                                  <select
                                    className="text-xs border-gray-700 rounded-md shadow-sm focus:ring-[var(--accent)] focus:border-[var(--accent)] bg-gray-900 text-gray-300"
                                    value={job.status}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleStatusUpdate(
                                        job._id,
                                        e.target.value
                                      );
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {statusOptions
                                      .filter((o) => o.value !== "all")
                                      .map((opt) => (
                                        <option
                                          key={opt.value}
                                          value={opt.value}
                                        >
                                          {opt.label}
                                        </option>
                                      ))}
                                  </select>
                                )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRowExpansion(job._id);
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {expandedRows.has(job._id) ? (
                                <FaChevronUp />
                              ) : (
                                <FaChevronDown />
                              )}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded Row Details */}
                        {expandedRows.has(job._id) && (
                          <tr className="bg-blue-25">
                            <td colSpan={10} className="px-6 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">
                                    Service Details
                                  </h4>
                                  <p className="text-gray-600">
                                    {job.serviceSnapshot?.description}
                                  </p>
                                  <p className="text-gray-600 mt-1">
                                    Duration: {job.duration} minutes
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">
                                    Location
                                  </h4>
                                  <p className="text-gray-600">
                                    {job.location?.street}
                                  </p>
                                  <p className="text-gray-600">
                                    {job.location?.city}, {job.location?.state}{" "}
                                    {job.location?.zip}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">
                                    Additional Info
                                  </h4>
                                  {job.customerNotes && (
                                    <p className="text-gray-600">
                                      <strong>Customer Notes:</strong>{" "}
                                      {job.customerNotes}
                                    </p>
                                  )}
                                  {job.workerNotes && (
                                    <p className="text-gray-600 mt-1">
                                      <strong>Worker Notes:</strong>{" "}
                                      {job.workerNotes}
                                    </p>
                                  )}
                                  <p className="text-gray-600 mt-1">
                                    <strong>Created:</strong>{" "}
                                    {format(
                                      parseISO(job.createdAt),
                                      "MMM dd, yyyy"
                                    )}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Job Detail Modal - Keep your existing modal implementation */}

      {/* Payment Modal - implemented here to complete flow when marking Completed */}
      {showPaymentModal && modalJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4">
          <div className="relative mt-16 w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Complete Payment</h3>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setModalJob(null);
                  setPaymentMethod("");
                }}
                className="text-gray-400 hover:text-white"
                aria-label="close payment modal"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-4">
              <div className="bg-gray-800 rounded-md p-4 mb-4">
                <div className="text-center text-2xl font-bold text-white">₹{modalJob.finalAmount}</div>
                <div className="text-center text-sm text-gray-400 mt-1">{modalJob.service?.name} — {modalJob.customer?.name}</div>
              </div>

              <label className="block text-sm text-gray-300 mb-2">Payment Method</label>
              <select
                className="block w-full pl-3 pr-10 py-2 mb-4 text-base border border-gray-700 rounded-md bg-gray-900 text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="">Select a payment method</option>
                {paymentMethods.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              {modalJob.billing?.billingNotes && (
                <div className="mb-3 p-3 bg-yellow-50 rounded-md text-yellow-800 border border-yellow-200">
                  <strong>Billing Notes:</strong> {modalJob.billing.billingNotes}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentMethod("");
                  }}
                  className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600"
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

      {/* The existing modals remain the same, just ensure they use the enhanced data */}
    </div>
  );
};

export default Jobs;
