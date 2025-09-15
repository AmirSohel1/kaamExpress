import React, { useState } from "react";
import {
  FaUser,
  FaUserTie,
  FaRupeeSign,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaExternalLinkAlt,
} from "react-icons/fa";
import DisputeInfoModal from "../../components/DisputeInfoModal";
import { fetchDisputes } from "../../api/disputes";

const statusColors = {
  open: "bg-red-900 text-red-300",
  resolved: "bg-green-900 text-green-300",
};

const statusLabels = {
  open: "Open",
  resolved: "Resolved",
};

const Disputes = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);

  React.useEffect(() => {
    setLoading(true);
    fetchDisputes()
      .then((data) => {
        setDisputes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load disputes");
        setLoading(false);
      });
  }, []);

  const filtered = disputes.filter(
    (d) =>
      (status === "all" || d.status === status) &&
      (d.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        d.worker.name.toLowerCase().includes(search.toLowerCase()) ||
        d.issue.toLowerCase().includes(search.toLowerCase()))
  );

  const totalAmount = disputes.reduce((sum, d) => sum + d.amount, 0);
  const openCount = disputes.filter((d) => d.status === "open").length;
  const resolvedCount = disputes.filter((d) => d.status === "resolved").length;
  const resolutionRate = disputes.length
    ? Math.round((resolvedCount / disputes.length) * 100)
    : 0;

  const handleRowClick = (dispute) => {
    setSelectedDispute(dispute);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDispute(null);
  };
  const handleResolve = (disputeId) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: "resolved" } : d))
    );
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-full px-4 py-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-8">Dispute Resolution</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl p-4 sm:p-6 bg-[var(--secondary)] flex flex-col items-center shadow border border-[var(--accent)]/10">
          <div className="text-2xl font-bold text-[var(--accent)]">
            {disputes.length}
          </div>
          <div className="text-gray-400 text-sm mt-1 text-center">
            Total Disputes
          </div>
        </div>
        <div className="rounded-xl p-4 sm:p-6 bg-[var(--secondary)] flex flex-col items-center shadow border border-[var(--accent)]/10">
          <div className="text-2xl font-bold text-red-400">{openCount}</div>
          <div className="text-gray-400 text-sm mt-1 text-center">
            Open Disputes
          </div>
        </div>
        <div className="rounded-xl p-4 sm:p-6 bg-[var(--secondary)] flex flex-col items-center shadow border border-[var(--accent)]/10">
          <div className="text-2xl font-bold text-green-400">
            {resolvedCount}
          </div>
          <div className="text-gray-400 text-sm mt-1 text-center">Resolved</div>
        </div>
        <div className="rounded-xl p-4 sm:p-6 bg-[var(--secondary)] flex flex-col items-center shadow border border-[var(--accent)]/10">
          <div className="text-2xl font-bold text-pink-300">
            ₹{totalAmount.toLocaleString()}
          </div>
          <div className="text-gray-400 text-sm mt-1 text-center">
            Disputed Amount
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="flex items-center bg-[var(--secondary)] rounded-xl px-4 py-3 flex-1 border border-[var(--accent)]/10">
          <input
            type="text"
            placeholder="Search disputes..."
            className="bg-transparent outline-none text-white flex-1 text-sm placeholder-gray-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="bg-[var(--secondary)] text-white rounded-xl px-4 py-3 text-sm focus:outline-none border border-[var(--accent)]/10 min-w-[150px]"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
        <button
          className="px-4 py-3 rounded-xl bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition text-sm shadow min-w-[120px]"
          onClick={() => {
            const csv = [
              ["ID", "Customer", "Worker", "Issue", "Amount", "Date", "Status"],
              ...filtered.map((d) => [
                d.id,
                d.customer.name,
                d.worker.name,
                d.issue,
                d.amount,
                d.date,
                d.status,
              ]),
            ]
              .map((row) => row.join(","))
              .join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "disputes.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export Report
        </button>
      </div>

      {/* Mobile-optimized cards (hidden on medium screens and up) */}
      <div className="md:hidden flex flex-col gap-4">
        {filtered.length > 0 ? (
          filtered.map((d) => (
            <div
              key={d.id}
              className="bg-[var(--secondary)] rounded-2xl shadow p-4 cursor-pointer hover:bg-[var(--card)] transition-colors duration-200"
              onClick={() => handleRowClick(d)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-white text-base">
                  Dispute #{d.id}
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                    statusColors[d.status]
                  }`}
                >
                  {statusLabels[d.status]}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full ${d.customer.color} flex items-center justify-center text-white text-xs`}
                  >
                    <FaUser />
                  </span>
                  <span className="text-sm text-white">{d.customer.name}</span>
                </div>
                <span className="text-sm text-gray-400">vs</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full ${d.worker.color} flex items-center justify-center text-white text-xs`}
                  >
                    <FaUserTie />
                  </span>
                  <span className="text-sm text-white">{d.worker.name}</span>
                </div>
              </div>
              <div className="text-sm text-gray-400 mb-2">Issue: {d.issue}</div>
              <div className="flex justify-between items-center text-xs mb-4">
                <div className="flex items-center gap-1 text-green-300 font-bold">
                  <FaRupeeSign />
                  {d.amount.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-white">
                  <FaCalendarAlt className="text-[var(--accent)]" />
                  <span>{d.date}</span>
                </div>
              </div>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  className="flex-1 px-3 py-2 rounded bg-gray-700 text-white font-semibold hover:bg-gray-600 transition text-xs"
                  onClick={() => handleRowClick(d)}
                >
                  View
                </button>
                <button
                  className={`flex-1 px-3 py-2 rounded font-semibold text-xs ${
                    d.status === "open"
                      ? "bg-green-900 text-green-300 hover:bg-green-800"
                      : "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={d.status !== "open"}
                  onClick={() => handleResolve(d.id)}
                >
                  Resolve
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-8">
            No disputes found matching your criteria.
          </div>
        )}
      </div>

      {/* Table (hidden on small screens) */}
      <div className="hidden md:block w-full bg-[var(--secondary)] rounded-2xl shadow overflow-x-auto mb-8">
        <table className="min-w-full text-sm table-auto">
          <thead>
            <tr className="text-left bg-[var(--primary)] text-gray-300">
              <th className="py-3 px-4">DISPUTE ID</th>
              <th className="py-3 px-4">CUSTOMER</th>
              <th className="py-3 px-4">WORKER</th>
              <th className="py-3 px-4">ISSUE</th>
              <th className="py-3 px-4">AMOUNT</th>
              <th className="py-3 px-4">DATE</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-gray-700 hover:bg-[var(--card)] transition cursor-pointer"
                  onClick={() => handleRowClick(d)}
                >
                  <td className="py-3 px-4 text-sky-400 font-bold whitespace-nowrap">
                    #{d.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-8 h-8 rounded-full ${d.customer.color} flex items-center justify-center text-white`}
                      >
                        <FaUser />
                      </span>
                      <span className="font-semibold text-white">
                        {d.customer.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-8 h-8 rounded-full ${d.worker.color} flex items-center justify-center text-white`}
                      >
                        <FaUserTie />
                      </span>
                      <span className="font-semibold text-white">
                        {d.worker.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{d.issue}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="flex items-center gap-1 text-green-300 font-bold">
                      <FaRupeeSign />
                      {d.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-[var(--accent)]" />
                      <span className="text-white">{d.date}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        statusColors[d.status]
                      }`}
                    >
                      {statusLabels[d.status]}
                    </span>
                  </td>
                  <td
                    className="py-3 px-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 rounded bg-[var(--card)] text-white font-semibold border border-gray-700 hover:bg-[var(--secondary)] transition text-xs"
                        onClick={() => handleRowClick(d)}
                      >
                        View
                      </button>
                      <button
                        className={`px-3 py-1 rounded font-semibold text-xs ${
                          d.status === "open"
                            ? "bg-green-900 text-green-300 hover:bg-green-800"
                            : "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={d.status !== "open"}
                        onClick={() => handleResolve(d.id)}
                      >
                        Resolve
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-8 text-center text-gray-400">
                  No disputes found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Side Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Open Disputes */}
        <div className="bg-[var(--secondary)] rounded-2xl p-6 shadow">
          <span className="text-lg font-semibold mb-4 block">
            Recent Open Disputes
          </span>
          <ul className="space-y-2">
            {disputes
              .filter((d) => d.status === "open")
              .map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between bg-[var(--card)] rounded-lg px-4 py-3"
                >
                  <div>
                    <span className="font-semibold text-white flex items-center gap-2">
                      <FaExclamationTriangle className="text-red-400" />
                      {d.customer.name} vs {d.worker.name}
                    </span>
                    <div className="text-gray-400 text-sm">{d.issue}</div>
                    <div className="text-green-300 text-xs font-semibold">
                      Amount: ₹{d.amount}
                    </div>
                  </div>
                  <button
                    className="text-sky-400 font-semibold hover:underline"
                    onClick={() => handleRowClick(d)}
                  >
                    View
                  </button>
                </li>
              ))}
          </ul>
        </div>

        {/* Resolution Performance */}
        <div className="bg-[var(--secondary)] rounded-2xl p-6 shadow">
          <span className="text-lg font-semibold mb-4 block">
            Resolution Performance
          </span>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-gray-300">Resolution Rate</span>
            <span className="text-green-300 font-bold">{resolutionRate}%</span>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded mb-4">
            <div
              className="h-3 rounded bg-green-400"
              style={{ width: `${resolutionRate}%` }}
            ></div>
          </div>
          <div className="flex gap-6">
            <div className="flex-1 text-center">
              <div className="text-green-300 font-bold text-lg">
                {resolvedCount}
              </div>
              <div className="text-gray-400 text-xs">Resolved</div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-red-300 font-bold text-lg">{openCount}</div>
              <div className="text-gray-400 text-xs">Pending</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disputes;
