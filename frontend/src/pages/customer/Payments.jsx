// src/pages/customer/Payments.jsx
import React, { useEffect, useState } from "react";
import {
  FaDownload,
  FaSpinner,
  FaFilter,
  FaSearch,
  FaFileExport,
} from "react-icons/fa";
import { fetchPayments } from "../../api/payments";

const statusStyles = {
  Paid: "bg-green-900/20 text-green-400 border border-green-600/30",
  Pending: "bg-yellow-900/20 text-yellow-400 border border-yellow-600/30",
  Failed: "bg-red-900/20 text-red-400 border border-red-600/30",
};

const Payments = () => {
  const [customerPayments, setCustomerPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPayments();

        const mapped = data.map((p) => ({
          id: p._id,
          service: p.booking?.serviceName || p.booking?.service || "N/A",
          amount: p.amount,
          date: p.booking?.date
            ? new Date(p.booking.date).toLocaleDateString()
            : "N/A",
          datetime: p.booking?.date ? new Date(p.booking.date) : new Date(),
          status: p.status,
          method: p.method,
          transactionId: p.transactionId,
          customer: p.customer?.name || "N/A",
          worker: p.worker?.name || "N/A",
        }));

        setCustomerPayments(mapped);
        setFilteredPayments(mapped);
      } catch (err) {
        console.error(err);
        setError("Failed to load payments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, []);

  // Filter and sort payments
  useEffect(() => {
    let result = [...customerPayments];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (payment) =>
          payment.service.toLowerCase().includes(term) ||
          payment.transactionId.toLowerCase().includes(term) ||
          payment.worker.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "All") {
      result = result.filter((payment) => payment.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? a.datetime - b.datetime
          : b.datetime - a.datetime;
      } else if (sortBy === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      } else if (sortBy === "status") {
        return sortOrder === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });

    setFilteredPayments(result);
  }, [customerPayments, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 py-12">
        <div className="relative">
          <FaSpinner className="animate-spin text-3xl mb-3 text-[var(--accent)]" />
          <div className="absolute inset-0 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-lg mt-2">Loading your payments...</p>
        <p className="text-sm text-gray-500">This may take a moment</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-6 max-w-md w-full text-center">
          <div className="text-red-400 text-4xl mb-3">⚠️</div>
          <h3 className="text-red-300 font-medium text-lg mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-lg bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/90 transition shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-full overflow-y-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Payment History
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          View and manage all your transactions in one place
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[var(--card)] to-[var(--card)]/80 rounded-2xl p-5 shadow-lg border border-gray-700/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Total Payments</p>
              <p className="text-2xl font-bold text-white mt-1">
                {customerPayments.length}
              </p>
            </div>
            <div className="bg-blue-900/30 p-2 rounded-lg">
              <FaDownload className="text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[var(--card)] to-[var(--card)]/80 rounded-2xl p-5 shadow-lg border border-gray-700/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-white mt-1">
                ₹
                {customerPayments.reduce(
                  (sum, payment) => sum + payment.amount,
                  0
                )}
              </p>
            </div>
            <div className="bg-green-900/30 p-2 rounded-lg">
              <span className="text-green-400 font-bold">₹</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[var(--card)] to-[var(--card)]/80 rounded-2xl p-5 shadow-lg border border-gray-700/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white mt-1">
                {customerPayments.filter((p) => p.status === "Paid").length}
              </p>
            </div>
            <div className="bg-purple-900/30 p-2 rounded-lg">
              <span className="text-purple-400 text-sm font-bold">✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch bg-gradient-to-br from-[var(--card)] to-[var(--card)]/80 rounded-2xl p-4 shadow-lg border border-gray-700/30">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by service, invoice ID or worker..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-[var(--background)] border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-400 text-sm">
          Showing {filteredPayments.length} of {customerPayments.length}{" "}
          payments
        </p>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <FaFilter className="text-xs" />
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="bg-transparent text-white border-none outline-none"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="status">Status</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="p-1 rounded hover:bg-gray-700/30"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredPayments.length > 0 ? (
          filteredPayments.map((p) => (
            <div
              key={p.id}
              className="bg-gradient-to-br from-[var(--card)] to-[var(--card)]/80 rounded-2xl shadow-lg p-5 border border-gray-700/30 hover:border-gray-700/60 transition-all duration-200 hover:shadow-xl"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-semibold text-white text-lg">
                    {p.service}
                  </span>
                  <p className="text-gray-400 text-xs mt-1">
                    Invoice #{p.transactionId}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow ${
                    statusStyles[p.status] || "bg-gray-800 text-gray-300"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-gray-400 text-xs">Amount</p>
                  <p className="text-cyan-300 font-bold text-lg">₹{p.amount}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Date</p>
                  <p className="text-gray-200 text-sm">{p.date}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Worker</p>
                  <p className="text-gray-200 text-sm">{p.worker}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Method</p>
                  <p className="text-gray-200 text-sm">{p.method}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex-1 flex items-center justify-center gap-2 ${
                    p.status === "Paid"
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-black shadow-md"
                  }`}
                  disabled={p.status === "Paid"}
                >
                  {p.status === "Paid" ? "Already Paid" : "Pay Now"}
                </button>
                <button className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm font-semibold hover:bg-[var(--secondary)] transition flex items-center justify-center gap-2 flex-1">
                  <FaDownload /> Invoice
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gradient-to-br from-[var(--card)] to-[var(--card)]/80 rounded-2xl border border-gray-700/30">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-gray-300 font-medium text-lg">
              No payments found
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {searchTerm || statusFilter !== "All"
                ? "Try adjusting your search or filter"
                : "You don't have any payments yet"}
            </p>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block w-full bg-gradient-to-br from-[var(--card)] to-[var(--card)]/80 rounded-2xl shadow-lg overflow-hidden border border-gray-700/30">
        <table className="min-w-full divide-y divide-gray-700/50">
          <thead>
            <tr className="text-left bg-[var(--primary)]/30 text-gray-400 text-sm">
              <th
                className="py-4 px-6 cursor-pointer hover:text-white transition"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-1">
                  DATE {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                </div>
              </th>
              <th className="py-4 px-6">SERVICE & INVOICE</th>
              <th
                className="py-4 px-6 cursor-pointer hover:text-white transition"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center gap-1">
                  AMOUNT{" "}
                  {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                </div>
              </th>
              <th className="py-4 px-6">WORKER</th>
              <th
                className="py-4 px-6 cursor-pointer hover:text-white transition"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1">
                  STATUS{" "}
                  {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                </div>
              </th>
              <th className="py-4 px-6 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/30">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-[var(--secondary)]/20 transition-all duration-150"
                >
                  <td className="py-4 px-6">
                    <div className="text-gray-200 text-sm">{p.date}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-white">{p.service}</div>
                    <div className="text-gray-500 text-xs">
                      #{p.transactionId}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-cyan-300 font-bold">₹{p.amount}</div>
                    <div className="text-gray-500 text-xs">{p.method}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-200 text-sm">{p.worker}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow border ${
                        statusStyles[p.status] || "bg-gray-800 text-gray-300"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2 justify-end">
                      <button
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                          p.status === "Paid"
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-black shadow-md"
                        }`}
                        disabled={p.status === "Paid"}
                      >
                        {p.status === "Paid" ? "Paid" : "Pay Now"}
                      </button>
                      <button className="px-4 py-1.5 rounded-lg border border-gray-600 text-gray-300 text-sm font-semibold hover:bg-[var(--secondary)] transition flex items-center gap-2">
                        <FaDownload /> Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-4xl mb-3">📝</div>
                    <h3 className="text-gray-300 font-medium text-lg">
                      No payments found
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 max-w-md">
                      {searchTerm || statusFilter !== "All"
                        ? "Try adjusting your search or filter criteria"
                        : "You don't have any payments yet. Your payments will appear here once you make transactions."}
                    </p>
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

export default Payments;
