import React, { useState, useEffect } from "react";
import { getWorkerJobs, updateJobStatus } from "../../api/workerJobs";
import {
  FaFilter,
  FaEdit,
  FaCheck,
  FaTimes,
  FaExternalLinkAlt,
} from "react-icons/fa";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Rejected", value: "rejected" },
];

const Jobs = () => {
  const [filter, setFilter] = useState("all");
  const [modalJob, setModalJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getWorkerJobs()
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load jobs");
        setLoading(false);
      });
  }, []);

  const filteredJobs =
    filter === "all"
      ? jobs
      : jobs.filter((j) => j.status.toLowerCase() === filter);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateJobStatus(id, newStatus);

      setJobs((prev) =>
        prev.map((j) => (j._id === id ? { ...j, status: newStatus } : j))
      );

      setModalJob(null);
    } catch (e) {
      alert("Failed to update job status");
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-full overflow-y-auto px-4 sm:px-6 py-4 flex flex-col animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 gap-3 animate-fade-in-up">
        {loading && <div className="text-gray-400">Loading jobs...</div>}
        {error && <div className="text-red-400">{error}</div>}
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--accent)] flex-1">
          Assigned Jobs
        </h2>
        <div className="flex items-center gap-2">
          <FaFilter className="text-[var(--accent)]" />
          <select
            className="bg-[var(--secondary)] text-white rounded-xl px-4 py-2 text-sm focus:outline-none border border-[var(--accent)]/10"
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
        <button
          className="px-4 py-2 rounded-xl bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition shadow text-sm w-full sm:w-auto"
          onClick={() => {
            const csv = [
              ["Service", "Customer", "Status"],
              ...filteredJobs.map((j) => [j.service, j.customer, j.status]),
            ]
              .map((row) => `"${row.join('","')}"`)
              .join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "worker_jobs.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export Jobs
        </button>
      </div>

      {/* Mobile-optimized cards */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-6 text-gray-400">No jobs found.</div>
        ) : (
          filteredJobs.map((j) => (
            <div
              key={String(j._id)}
              className="bg-[var(--secondary)] rounded-2xl p-4 shadow-md border border-[var(--accent)]/10"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold text-sm">
                  {j.service}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                    j.status === "completed"
                      ? "bg-green-900 text-green-300"
                      : j.status === "pending"
                      ? "bg-yellow-900 text-yellow-300"
                      : j.status === "rejected"
                      ? "bg-red-900 text-red-300"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {j.status.charAt(0).toUpperCase() + j.status.slice(1)}
                </span>
              </div>
              <div className="text-gray-200 text-xs mb-4">
                Customer: {j.customer}
              </div>
              <button
                className="w-full px-3 py-2 rounded-lg bg-[var(--accent)] text-black text-xs font-semibold hover:bg-[var(--accent)]/80 transition flex items-center justify-center gap-1"
                onClick={() => setModalJob(j)}
              >
                <FaExternalLinkAlt /> Details / Update
              </button>
            </div>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block w-full bg-[var(--secondary)] rounded-2xl shadow mb-8 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-gray-300 text-sm bg-[var(--primary)]">
              <th className="py-3 px-4 min-w-[150px]">Service</th>
              <th className="py-3 px-4 min-w-[150px]">Customer</th>
              <th className="py-3 px-4 min-w-[100px]">Status</th>
              <th className="py-3 px-4 min-w-[150px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">
                  No jobs found.
                </td>
              </tr>
            ) : (
              filteredJobs.map((j) => (
                <tr
                  key={String(j._id)}
                  className="border-b border-gray-700 hover:bg-[var(--card)] transition"
                >
                  <td
                    className="py-2 px-4 font-semibold text-sm cursor-pointer hover:underline text-white"
                    onClick={() => setModalJob(j)}
                  >
                    {j.service}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-200">
                    {j.customer}
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        j.status === "completed"
                          ? "bg-green-900 text-green-300"
                          : j.status === "pending"
                          ? "bg-yellow-900 text-yellow-300"
                          : j.status === "rejected"
                          ? "bg-red-900 text-red-300"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {j.status.charAt(0).toUpperCase() + j.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      className="px-3 py-1 rounded-lg bg-[var(--accent)] text-black text-xs font-semibold hover:bg-[var(--accent)]/80 transition"
                      onClick={() => setModalJob(j)}
                    >
                      Details / Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalJob && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--secondary)] rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-[var(--accent)]"
              onClick={() => setModalJob(null)}
            >
              <FaTimes size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4 text-[var(--accent)]">
              Job Details
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Service:</span>{" "}
                <span className="text-white">{modalJob.service}</span>
              </div>
              <div>
                <span className="font-semibold">Customer:</span>{" "}
                <span className="text-white">{modalJob.customer}</span>
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <span className="text-white">
                  {modalJob.status.charAt(0).toUpperCase() +
                    modalJob.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              {modalJob.status === "pending" && (
                <>
                  <button
                    className="flex-1 px-4 py-2 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-600 flex items-center justify-center gap-2 text-sm"
                    onClick={() =>
                      handleStatusUpdate(modalJob._id, "completed")
                    }
                  >
                    <FaCheck /> Mark Completed
                  </button>
                  <button
                    className="flex-1 px-4 py-2 rounded-lg bg-red-700 text-white font-semibold hover:bg-red-600 flex items-center justify-center gap-2 text-sm"
                    onClick={() => handleStatusUpdate(modalJob._id, "rejected")}
                  >
                    <FaTimes /> Reject
                  </button>
                </>
              )}
              {modalJob.status === "completed" && (
                <span className="flex-1 px-4 py-2 rounded-lg bg-green-900 text-green-200 font-semibold flex items-center justify-center gap-2 text-sm">
                  <FaCheck /> Completed
                </span>
              )}
              {modalJob.status === "rejected" && (
                <span className="flex-1 px-4 py-2 rounded-lg bg-red-900 text-red-200 font-semibold flex items-center justify-center gap-2 text-sm">
                  <FaTimes /> Rejected
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
