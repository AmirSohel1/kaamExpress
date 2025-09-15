import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaSearch,
  FaEnvelope,
  FaCalendarAlt,
  FaEnvelopeOpenText,
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
        setCustomers(data);
        setLoading(false);
        // console.log(data);
      })
      .catch(() => {
        setError("Failed to load customers");
        setLoading(false);
      });
  }, []);

  const filtered = customers.filter((c) => {
    const status = c.user?.isActive ? "Active" : "Inactive";
    return (
      (statusFilter === "all" || status === statusFilter) &&
      ((c.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.user?.email || "").toLowerCase().includes(search.toLowerCase()))
    );
  });

  const handleRowClick = (customer) => {
    // console.log(customer);
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleSendMessage = (customer) => {
    console.log(
      `Sending message to ${customer.user?.name} at ${customer.user?.email}`
    );
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64 text-lg text-gray-400">
        Loading customers...
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full flex justify-center items-center h-64 text-lg text-red-400">
        {error}
      </div>
    );
  }

  // Top customers by bookings
  const topCustomers = [...customers]
    .sort((a, b) => b.bookings.length - a.bookings.length)
    .slice(0, 5);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-full overflow-y-auto px-4 sm:px-6 py-4 flex flex-col animate-fade-in-up">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8">
        Customer Management
      </h2>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 w-full">
        <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-6 flex flex-col items-center shadow border border-[var(--accent)]/10 min-w-0">
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {customers.length}
          </div>
          <div className="text-gray-400 text-sm mt-1 text-center">
            Total Customers
          </div>
        </div>
        <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-6 flex flex-col items-center shadow border border-[var(--accent)]/10 min-w-0">
          <div className="text-2xl sm:text-3xl font-bold text-green-400">
            {customers.filter((c) => c.user?.isActive).length}
          </div>
          <div className="text-gray-400 text-sm mt-1 text-center">
            Active Users
          </div>
        </div>
        <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-6 flex flex-col items-center shadow border border-[var(--accent)]/10 min-w-0">
          <div className="text-2xl sm:text-3xl font-bold text-yellow-300">
            {customers.reduce((sum, c) => sum + c.bookings.length, 0)}
          </div>
          <div className="text-gray-400 text-sm mt-1 text-center">
            Total Bookings
          </div>
        </div>
        <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-6 flex flex-col items-center shadow border border-[var(--accent)]/10 min-w-0">
          <div className="text-2xl sm:text-3xl font-bold text-cyan-400">
            {customers.length > 0
              ? Math.round(
                  customers.reduce((sum, c) => sum + c.bookings.length, 0) /
                    customers.length
                )
              : 0}
          </div>
          <div className="text-gray-400 text-sm mt-1 text-center">
            Avg per Customer
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 w-full">
        <div className="flex items-center bg-[var(--secondary)] rounded-xl px-4 py-3 flex-1 border border-[var(--accent)]/10">
          <FaSearch className="text-[var(--accent)] mr-2 text-base" />
          <input
            type="text"
            placeholder="Search customers..."
            className="bg-transparent outline-none text-white flex-1 text-sm placeholder-gray-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="bg-[var(--secondary)] text-white rounded-xl px-4 py-3 text-sm focus:outline-none border border-[var(--accent)]/10 min-w-[150px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Mobile customer cards */}
      <div className="md:hidden grid grid-cols-1 gap-4 mb-8">
        {filtered.length > 0 ? (
          filtered.map((c) => {
            const status = c.user?.isActive ? "Active" : "Inactive";
            return (
              <div
                key={c._id}
                className="bg-[var(--secondary)] rounded-2xl shadow p-4 cursor-pointer hover:bg-[var(--card)] transition-colors duration-200"
                onClick={() => handleRowClick(c)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={c.user?.name}
                      size="40"
                      round
                      color="#a21caf"
                      fgColor="#fff"
                    />
                    <div>
                      <div className="font-bold text-white text-base">
                        {c.user?.name}
                      </div>
                      <div className="text-xs text-gray-400">ID: {c._id}</div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      status === "Active"
                        ? "bg-green-900 text-green-300"
                        : "bg-red-900 text-red-300"
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <FaEnvelope className="text-[var(--accent)] text-xs" />
                  <span>{c.user?.email}</span>
                </div>
                <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="text-[var(--accent)] text-xs" />
                  <span>
                    Joined: {new Date(c.user?.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                  <FaCalendarAlt className="text-[var(--accent)] text-xs" />
                  <span>Bookings: {c.bookings.length}</span>
                </div>
                <div
                  className="flex flex-col sm:flex-row gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="px-4 py-2 rounded bg-[var(--card)] text-white font-semibold border border-gray-700 hover:bg-[var(--secondary)] transition text-xs flex-1"
                    onClick={() => handleRowClick(c)}
                  >
                    View Details
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition text-xs flex-1"
                    onClick={() => handleSendMessage(c)}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <FaEnvelopeOpenText /> Send Message
                    </div>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-400 py-8">
            No customers found.
          </div>
        )}
      </div>

      {/* Top Customers + Desktop Table */}
      <div className="hidden md:grid md:grid-cols-4 gap-6 mb-8">
        {/* Top Customers */}
        <div className="md:col-span-1 bg-[var(--secondary)] rounded-2xl p-6 shadow flex flex-col">
          <span className="text-lg font-semibold mb-4">Top Customers</span>
          <ul className="space-y-2">
            {topCustomers.map((c, i) => (
              <li
                key={c._id}
                className="flex items-center justify-between bg-[var(--card)] rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-lg text-white">
                    <FaUser />
                  </span>
                  <div>
                    <div className="font-bold text-white">{c.user?.name}</div>
                    <div className="text-xs text-gray-400">
                      {c.bookings.length} bookings
                    </div>
                  </div>
                </div>
                <span className="text-purple-300 font-bold">#{i + 1}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Table */}
        <div className="md:col-span-3 bg-[var(--secondary)] rounded-2xl shadow overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left bg-[var(--primary)] text-gray-300 text-sm">
                <th className="py-3 px-4 min-w-[150px]">CUSTOMER</th>
                <th className="py-3 px-4 min-w-[180px]">EMAIL</th>
                <th className="py-3 px-4 min-w-[100px]">TOTAL BOOKINGS</th>
                <th className="py-3 px-4 min-w-[120px]">JOIN DATE</th>
                <th className="py-3 px-4 min-w-[100px]">STATUS</th>
                <th className="py-3 px-4 min-w-[150px]">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((c) => {
                  const status = c.user?.isActive ? "Active" : "Inactive";
                  return (
                    <tr
                      key={c._id}
                      className="border-b border-gray-700 hover:bg-[var(--card)] transition cursor-pointer"
                      onClick={() => handleRowClick(c)}
                    >
                      <td className="py-3 px-4 flex items-center gap-3 whitespace-nowrap">
                        <Avatar
                          name={c.user?.name}
                          size="32"
                          round
                          color="#a21caf"
                          fgColor="#fff"
                        />
                        <div>
                          <div className="font-bold text-white text-sm">
                            {c.user?.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: {c._id}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-[var(--accent)] text-sm" />
                          <span className="text-white text-sm">
                            {c.user?.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{c.bookings.length}</td>
                      <td className="py-3 px-4 flex items-center gap-2 whitespace-nowrap">
                        <FaCalendarAlt className="text-[var(--accent)] text-sm" />
                        <span className="text-white text-sm">
                          {new Date(c.user?.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                            status === "Active"
                              ? "bg-green-900 text-green-300"
                              : "bg-red-900 text-red-300"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td
                        className="py-3 px-4 flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="px-4 py-1 rounded bg-[var(--card)] text-white font-semibold border border-gray-700 hover:bg-[var(--secondary)] transition text-sm"
                          onClick={() => handleRowClick(c)}
                        >
                          View Details
                        </button>
                        <button
                          className="px-4 py-1 rounded bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition text-sm"
                          onClick={() => handleSendMessage(c)}
                        >
                          Send Message
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">
                    No customers found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Data */}
      <div className="flex justify-end">
        <button
          className="px-6 py-2 rounded bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition"
          onClick={() => {
            const csv = [
              ["ID", "Name", "Email", "Bookings", "Join Date", "Status"],
              ...filtered.map((c) => [
                c._id,
                c.user?.name,
                c.user?.email,
                c.bookings.length,
                new Date(c.user?.createdAt).toLocaleDateString(),
                c.user?.isActive ? "Active" : "Inactive",
              ]),
            ]
              .map((row) => row.join(","))
              .join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "customers.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export Data
        </button>
      </div>

      <CustomerInfoModal
        customer={selectedCustomer}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Customers;
