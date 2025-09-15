import React from "react";
import { FaStar } from "react-icons/fa";
import clsx from "clsx";

const WorkerTable = ({ workers = [], onRowClick, onStatus }) => {
  const getAverageRating = (ratings) => {
    if (!Array.isArray(ratings) || ratings.length === 0) return "N/A";
    const total = ratings.reduce((sum, r) => sum + (r.rating || 0), 0);
    return (total / ratings.length).toFixed(1);
  };

  return (
    <div className="overflow-x-auto rounded-2xl shadow bg-[var(--card)] border border-[var(--accent)]/10 animate-fade-in-up">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Email
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Jobs
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Rating
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Joined
            </th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {workers.map((w) => (
            <tr
              key={w._id}
              className="hover:bg-[var(--secondary)] transition-colors duration-200 cursor-pointer animate-fade-in-up"
              onClick={() => onRowClick(w)}
            >
              <td className="px-4 py-3 whitespace-nowrap font-semibold text-white">
                {w.user?.name || "N/A"}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-400">
                {w.user?.email || "N/A"}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span
                  className={clsx(
                    "px-2 py-1 rounded-full text-xs font-semibold",
                    w.status === "Approved"
                      ? "bg-green-900 text-green-300"
                      : w.status === "Pending"
                      ? "bg-yellow-900 text-yellow-300"
                      : "bg-red-900 text-red-300"
                  )}
                >
                  {w.status || "Pending"}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-white">
                {Array.isArray(w.jobs) ? w.jobs.length : 0}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-yellow-300 flex items-center gap-1">
                <FaStar className="text-yellow-400 text-xs" />
                {getAverageRating(w.ratings)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-400">
                {w.createdAt
                  ? new Date(w.createdAt).toLocaleDateString()
                  : "N/A"}
              </td>
              <td
                className="px-4 py-3 whitespace-nowrap flex gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="px-2 py-1 rounded bg-green-700 text-white font-semibold hover:bg-green-600 disabled:opacity-50 text-xs"
                  disabled={w.status === "Approved"}
                  onClick={() => onStatus(w._id, "Approved")}
                >
                  Approve
                </button>
                <button
                  className="px-2 py-1 rounded bg-red-700 text-white font-semibold hover:bg-red-600 disabled:opacity-50 text-xs"
                  disabled={w.status === "Rejected"}
                  onClick={() => onStatus(w._id, "Rejected")}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkerTable;
