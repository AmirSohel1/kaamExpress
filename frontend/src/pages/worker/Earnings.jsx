import React, { useState, useEffect } from "react";
import { getWorkerEarnings, markEarningPaid } from "../../api/workerEarnings";
import { FaCheck, FaTimes, FaInfoCircle, FaFilter } from "react-icons/fa";

const Earnings = () => {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalEarning, setModalEarning] = useState(null);
  const [filter, setFilter] = useState("all");

  const total = earnings.reduce((sum, e) => sum + e.amount, 0);

  const markAsPaid = async (jobId) => {
    try {
      await markEarningPaid(jobId);
      setEarnings((prev) =>
        prev.map((e) => (e.jobId === jobId ? { ...e, status: "Paid" } : e))
      );
      setModalEarning(null);
    } catch (e) {
      alert("Failed to mark as paid");
    }
  };
  useEffect(() => {
    setLoading(true);
    getWorkerEarnings()
      .then((data) => {
        setEarnings(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load earnings");
        setLoading(false);
      });
  }, []);

  const filteredEarnings =
    filter === "all"
      ? earnings
      : earnings.filter((e) => e.status.toLowerCase() === filter);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-full overflow-y-auto px-4 sm:px-6 py-4 flex flex-col animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 gap-3 animate-fade-in-up">
        {loading && <div className="text-gray-400">Loading earnings...</div>}
        {error && <div className="text-red-400">{error}</div>}
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--accent)] flex-1">
          Earnings
        </h2>
        <div className="flex items-center gap-2">
          <FaFilter className="text-[var(--accent)]" />
          <select
            className="bg-[var(--secondary)] text-white rounded-xl px-4 py-2 text-sm focus:outline-none border border-[var(--accent)]/10"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <button
          className="px-4 py-2 rounded-xl bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition shadow text-sm w-full sm:w-auto"
          onClick={() => {
            const csv = [
              ["Job ID", "Amount", "Status"],
              ...filteredEarnings.map((e) => [e.jobId, e.amount, e.status]),
            ]
              .map((row) => `"${row.join('","')}"`)
              .join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "worker_earnings.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export Earnings
        </button>
      </div>

      <div className="mb-6 bg-[var(--secondary)] rounded-2xl p-4 sm:p-6 shadow flex items-center gap-4 border border-[var(--accent)]/10">
        <div className="text-2xl sm:text-3xl font-bold text-[var(--accent)]">
          ₹{total}
        </div>
        <div className="text-gray-400 text-sm sm:text-base">Total Earnings</div>
      </div>

      {/* Mobile-optimized cards (hidden on md and up) */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredEarnings.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            No earnings found.
          </div>
        ) : (
          filteredEarnings.map((e) => (
            <div
              key={e.jobId}
              className="bg-[var(--secondary)] rounded-2xl p-4 shadow-md border border-[var(--accent)]/10"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold text-sm">
                  Job ID: {e.jobId}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                    e.status === "Paid"
                      ? "bg-green-900 text-green-300"
                      : "bg-yellow-900 text-yellow-300"
                  }`}
                >
                  {e.status}
                </span>
              </div>
              <div className="text-cyan-300 font-bold text-lg mb-4">
                ₹{e.amount}
              </div>
              <button
                className="w-full px-3 py-2 rounded-lg bg-[var(--accent)] text-black text-xs font-semibold hover:bg-[var(--accent)]/80 transition flex items-center justify-center gap-1"
                onClick={() => setModalEarning(e)}
              >
                <FaInfoCircle /> Details
              </button>
            </div>
          ))
        )}
      </div>

      {/* Desktop table (hidden on sm and down) */}
      <div className="hidden md:block w-full bg-[var(--secondary)] rounded-2xl shadow mb-8 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-gray-300 text-sm bg-[var(--primary)]">
              <th className="py-3 px-4 min-w-[100px]">Job ID</th>
              <th className="py-3 px-4 min-w-[120px]">Amount</th>
              <th className="py-3 px-4 min-w-[100px]">Status</th>
              <th className="py-3 px-4 min-w-[100px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEarnings.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">
                  No earnings found.
                </td>
              </tr>
            ) : (
              filteredEarnings.map((e) => (
                <tr
                  key={e.jobId}
                  className="border-b border-gray-700 hover:bg-[var(--card)] transition"
                >
                  <td
                    className="py-2 px-4 font-semibold text-sm cursor-pointer hover:underline text-white"
                    onClick={() => setModalEarning(e)}
                  >
                    {e.jobId}
                  </td>
                  <td className="py-2 px-4 text-sm text-cyan-300 font-bold">
                    ₹{e.amount}
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        e.status === "Paid"
                          ? "bg-green-900 text-green-300"
                          : "bg-yellow-900 text-yellow-300"
                      }`}
                    >
                      {e.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <button
                      className="px-3 py-1 rounded-lg bg-[var(--accent)] text-black text-xs font-semibold hover:bg-[var(--accent)]/80 transition flex items-center gap-1"
                      onClick={() => setModalEarning(e)}
                    >
                      <FaInfoCircle /> Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for earning details and actions */}
      {modalEarning && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--secondary)] rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-[var(--accent)]"
              onClick={() => setModalEarning(null)}
            >
              <FaTimes size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4 text-[var(--accent)]">
              Earning Details
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Job ID:</span>{" "}
                {modalEarning.jobId}
              </div>
              <div>
                <span className="font-semibold">Amount:</span> ₹
                {modalEarning.amount}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                {modalEarning.status}
              </div>
            </div>
            {modalEarning.status !== "Paid" && (
              <button
                className="mt-4 px-4 py-2 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-600 flex items-center gap-2 text-sm"
                onClick={() => markAsPaid(modalEarning.jobId)}
              >
                <FaCheck /> Mark as Paid
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Earnings;
