import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaSearch,
  FaEnvelope,
  FaCalendarAlt,
  FaEnvelopeOpenText,
  FaPhone,
  FaMapMarkerAlt,
  FaVenusMars,
  FaCrown,
  FaStar,
  FaIdCard,
} from "react-icons/fa";
import Avatar from "react-avatar";
import CustomerInfoModal from "./components/CustomerInfoModal";
import { fetchCustomers } from "../../api/customers";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchCustomers()
      .then((data) => {
        // console.log(data);
        setCustomers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching customers:", err);
        setError("Failed to load customers. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Safe filtering function
  const filtered = customers.filter((c) => {
    const status = c?.isActive ? "Active" : "Inactive";
    const name = c?.name || "";
    const email = c?.email || "";

    return (
      (statusFilter === "all" || status === statusFilter) &&
      (name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()))
    );
  });

  // Safe sorting for top customers - using createdAt date as engagement metric
  const topCustomers = [...customers]
    .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
    .slice(0, 5);

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleSendMessage = (customer) => {
    console.log(`Sending message to ${customer?.name} at ${customer?.email}`);
    // Implement actual message sending logic here
  };

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate customer stats safely
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c?.isActive).length;
  const verifiedEmails = customers.filter((c) => c?.emailVerified).length;
  const recentCustomers = customers.filter((c) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(c?.createdAt) > thirtyDaysAgo;
  }).length;

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg text-gray-400">Loading customers...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <div className="text-lg text-red-400 mb-2">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[var(--accent)] text-black rounded-xl font-semibold hover:bg-[var(--accent)]/80 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-full overflow-y-auto px-4 sm:px-6 py-4 flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Customer Management
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Manage and interact with your customer base
          </p>
        </div>
        <div className="text-sm text-gray-400">
          Showing {filtered.length} of {totalCustomers} customers
        </div>
      </div>

      {/* Enhanced Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
        <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 sm:p-6 flex flex-col items-center shadow-lg border border-purple-500/20 min-w-0">
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {totalCustomers}
          </div>
          <div className="text-gray-300 text-sm text-center">
            Total Customers
          </div>
          <FaUser className="text-purple-400 mt-2 text-lg" />
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 sm:p-6 flex flex-col items-center shadow-lg border border-green-500/20 min-w-0">
          <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-1">
            {activeCustomers}
          </div>
          <div className="text-gray-300 text-sm text-center">Active Users</div>
          <div className="w-3 h-3 bg-green-400 rounded-full mt-2 animate-pulse"></div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 sm:p-6 flex flex-col items-center shadow-lg border border-blue-500/20 min-w-0">
          <div className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-1">
            {verifiedEmails}
          </div>
          <div className="text-gray-300 text-sm text-center">
            Verified Emails
          </div>
          <FaStar className="text-cyan-400 mt-2 text-lg" />
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 p-4 sm:p-6 flex flex-col items-center shadow-lg border border-orange-500/20 min-w-0">
          <div className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-1">
            {recentCustomers}
          </div>
          <div className="text-gray-300 text-sm text-center">New (30 days)</div>
          <FaCrown className="text-yellow-400 mt-2 text-lg" />
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 w-full">
        <div className="flex items-center bg-gradient-to-r from-[var(--secondary)] to-[var(--secondary)]/80 rounded-2xl px-4 py-3 flex-1 border border-[var(--accent)]/20 shadow-lg">
          <FaSearch className="text-[var(--accent)] mr-3 text-base" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="bg-transparent outline-none text-white flex-1 text-sm placeholder-gray-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-gray-500 hover:text-white transition"
            >
              ✕
            </button>
          )}
        </div>

        <select
          className="bg-gradient-to-r from-[var(--secondary)] to-[var(--secondary)]/80 text-white rounded-2xl px-4 py-3 text-sm focus:outline-none border border-[var(--accent)]/20 shadow-lg min-w-[160px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Mobile customer cards */}
      <div className="lg:hidden grid grid-cols-1 gap-4 mb-8">
        {filtered.length > 0 ? (
          filtered.map((customer) => {
            const status = customer?.isActive ? "Active" : "Inactive";
            const isVerified = customer?.emailVerified;

            return (
              <div
                key={customer?._id}
                className="bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary)]/80 rounded-2xl shadow-lg p-5 cursor-pointer hover:scale-[1.02] transition-all duration-300 border border-[var(--accent)]/10"
                onClick={() => handleRowClick(customer)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar
                        name={customer?.name}
                        size="48"
                        round
                        color={customer?.isActive ? "#10b981" : "#ef4444"}
                        fgColor="#fff"
                      />
                      {isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <FaStar className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-white text-base flex items-center gap-2">
                        {customer?.name}
                        {customer?.gender && (
                          <FaVenusMars
                            className={`text-sm ${
                              customer.gender === "male"
                                ? "text-blue-400"
                                : "text-pink-400"
                            }`}
                          />
                        )}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <FaIdCard className="text-[var(--accent)]" />
                        ID: {customer?._id?.substring(0, 8)}...
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      status === "Active"
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-300 flex items-center gap-3">
                    <FaEnvelope className="text-[var(--accent)] text-xs flex-shrink-0" />
                    <span className="truncate">{customer?.email}</span>
                  </div>

                  {customer?.phone && (
                    <div className="text-sm text-gray-300 flex items-center gap-3">
                      <FaPhone className="text-[var(--accent)] text-xs flex-shrink-0" />
                      <span>{customer.phone}</span>
                    </div>
                  )}

                  {customer?.address?.city && (
                    <div className="text-sm text-gray-300 flex items-center gap-3">
                      <FaMapMarkerAlt className="text-[var(--accent)] text-xs flex-shrink-0" />
                      <span>
                        {customer.address.city}, {customer.address.state}
                      </span>
                    </div>
                  )}

                  <div className="text-sm text-gray-300 flex items-center gap-3">
                    <FaCalendarAlt className="text-[var(--accent)] text-xs flex-shrink-0" />
                    <span>Joined: {formatDate(customer?.createdAt)}</span>
                  </div>
                </div>

                <div
                  className="flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold border border-gray-600 hover:from-gray-500 hover:to-gray-600 transition text-xs"
                    onClick={() => handleRowClick(customer)}
                  >
                    View Details
                  </button>
                  <button
                    className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 text-black font-semibold hover:from-[var(--accent)]/90 hover:to-[var(--accent)]/70 transition text-xs"
                    onClick={() => handleSendMessage(customer)}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <FaEnvelopeOpenText /> Message
                    </div>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <div className="text-gray-400 text-lg mb-2">No customers found</div>
            <div className="text-gray-500 text-sm">
              Try adjusting your search or filters
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout - Top Customers + Table */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-6 mb-8">
        {/* Top Customers Sidebar */}
        <div className="lg:col-span-1 bg-gradient-to-b from-[var(--secondary)] to-[var(--secondary)]/80 rounded-2xl p-6 shadow-lg border border-[var(--accent)]/10 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <FaCrown className="text-yellow-400 text-lg" />
            <span className="text-lg font-semibold text-white">
              Top Customers
            </span>
          </div>
          <div className="space-y-3 flex-1">
            {topCustomers.map((customer, index) => (
              <div
                key={customer?._id}
                className="bg-gradient-to-r from-[var(--card)] to-[var(--card)]/50 rounded-xl p-3 cursor-pointer hover:scale-[1.02] transition-transform duration-200 border border-gray-700/50"
                onClick={() => handleRowClick(customer)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar
                        name={customer?.name}
                        size="36"
                        round
                        color={
                          index === 0
                            ? "#f59e0b"
                            : index === 1
                            ? "#9ca3af"
                            : index === 2
                            ? "#b45309"
                            : "#6b7280"
                        }
                        fgColor="#fff"
                      />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">
                        {customer?.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        Since {formatDate(customer?.createdAt)}
                      </div>
                    </div>
                  </div>
                  {customer?.emailVerified && (
                    <FaStar className="text-blue-400 text-sm" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Customer Table */}
        <div className="lg:col-span-3 bg-gradient-to-b from-[var(--secondary)] to-[var(--secondary)]/80 rounded-2xl shadow-lg border border-[var(--accent)]/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/80 text-gray-300 text-sm">
                  <th className="py-4 px-6 text-left min-w-[200px]">
                    CUSTOMER
                  </th>
                  <th className="py-4 px-6 text-left min-w-[200px]">
                    CONTACT INFO
                  </th>
                  <th className="py-4 px-6 text-left min-w-[120px]">
                    JOIN DATE
                  </th>
                  <th className="py-4 px-6 text-left min-w-[100px]">STATUS</th>
                  <th className="py-4 px-6 text-left min-w-[180px]">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((customer) => {
                    const status = customer?.isActive ? "Active" : "Inactive";
                    const isVerified = customer?.emailVerified;

                    return (
                      <tr
                        key={customer?._id}
                        className="border-b border-gray-700/50 hover:bg-[var(--card)]/50 transition-all duration-200 cursor-pointer group"
                        onClick={() => handleRowClick(customer)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar
                                name={customer?.name}
                                size="40"
                                round
                                color={
                                  customer?.isActive ? "#10b981" : "#ef4444"
                                }
                                fgColor="#fff"
                              />
                              {isVerified && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <FaStar className="text-white text-xs" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm flex items-center gap-2">
                                {customer?.name}
                                {customer?.gender && (
                                  <FaVenusMars
                                    className={`text-xs ${
                                      customer.gender === "male"
                                        ? "text-blue-400"
                                        : "text-pink-400"
                                    }`}
                                  />
                                )}
                              </div>
                              <div className="text-xs text-gray-400 flex items-center gap-1">
                                <FaIdCard className="text-[var(--accent)]" />
                                {customer?._id?.substring(0, 10)}...
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <FaEnvelope className="text-[var(--accent)] text-xs" />
                              <span className="text-white">
                                {customer?.email}
                              </span>
                            </div>
                            {customer?.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <FaPhone className="text-[var(--accent)] text-xs" />
                                <span className="text-gray-300">
                                  {customer.phone}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-sm">
                            <FaCalendarAlt className="text-[var(--accent)]" />
                            <span className="text-white">
                              {formatDate(customer?.createdAt)}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                              status === "Active"
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : "bg-red-500/20 text-red-300 border border-red-500/30"
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                status === "Active"
                                  ? "bg-green-400"
                                  : "bg-red-400"
                              }`}
                            ></div>
                            {status}
                          </span>
                        </td>

                        <td
                          className="py-4 px-6"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex gap-2">
                            <button
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold border border-gray-600 hover:from-gray-500 hover:to-gray-600 transition text-sm flex items-center gap-2"
                              onClick={() => handleRowClick(customer)}
                            >
                              <FaUser className="text-xs" />
                              Details
                            </button>
                            <button
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 text-black font-semibold hover:from-[var(--accent)]/90 hover:to-[var(--accent)]/70 transition text-sm flex items-center gap-2"
                              onClick={() => handleSendMessage(customer)}
                            >
                              <FaEnvelopeOpenText />
                              Message
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="text-4xl">🔍</div>
                        <div className="text-gray-400 text-lg">
                          No customers found
                        </div>
                        <div className="text-gray-500 text-sm">
                          Try adjusting your search criteria
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export Data */}
      {filtered.length > 0 && (
        <div className="flex justify-end mt-6">
          <button
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 text-black font-semibold hover:from-[var(--accent)]/90 hover:to-[var(--accent)]/70 transition flex items-center gap-2 shadow-lg"
            onClick={() => {
              const csv = [
                [
                  "ID",
                  "Name",
                  "Email",
                  "Phone",
                  "Join Date",
                  "Status",
                  "Email Verified",
                ],
                ...filtered.map((c) => [
                  c?._id,
                  c?.name,
                  c?.email,
                  c?.phone || "N/A",
                  formatDate(c?.createdAt),
                  c?.isActive ? "Active" : "Inactive",
                  c?.emailVerified ? "Yes" : "No",
                ]),
              ]
                .map((row) => row.join(","))
                .join("\n");

              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `customers-${
                new Date().toISOString().split("T")[0]
              }.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            📊 Export Data
          </button>
        </div>
      )}

      <CustomerInfoModal
        customer={selectedCustomer}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Customers;
