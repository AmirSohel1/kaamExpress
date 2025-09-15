import React from "react";
import Avatar from "react-avatar";
import { FaStar } from "react-icons/fa";

const WorkerMobileCard = ({ worker, onRowClick, onStatus }) => {
  const w = worker;
  const getAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return "N/A";
    const avg = ratings.reduce((acc, r) => acc + r, 0) / ratings.length;
    return avg.toFixed(1);
  };
  return (
    <div
      key={w._id}
      className="md:hidden bg-[var(--secondary)] rounded-2xl shadow p-4 cursor-pointer hover:bg-[var(--card)] transition-colors duration-200 animate-fade-in-up"
      onClick={() => onRowClick(w)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar
            name={w.user?.name}
            size="40"
            round
            color="#06b6d4"
            fgColor="#fff"
          />
          <div>
            <div className="font-bold text-white text-base">{w.user?.name}</div>
            <div className="text-xs font-bold text-gray-400">
              {w.user?.email}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              w.user?.isActive
                ? "bg-green-900 text-green-300"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {w.user?.isActive ? "Active" : "Inactive"}
          </span>
          <div className="flex items-center gap-1 text-sm text-white animate-pulse-slow">
            <FaStar className="text-yellow-400 text-xs" />
            <span className="font-semibold">{getAverageRating(w.ratings)}</span>
          </div>
        </div>
      </div>
      <div className="text-gray-400 text-sm mb-2">Skills:</div>
      <div className="flex flex-wrap gap-2 mb-3">
        {w.skills?.map((s, i) => (
          <span
            key={i}
            className="bg-cyan-900 text-cyan-300 px-2 py-1 rounded-full text-[10px] font-semibold animate-fade-in-up"
          >
            {s}
          </span>
        ))}
      </div>
      <div className="text-gray-400 text-xs text-center">
        Joined: {new Date(w.createdAt).toLocaleDateString()}
      </div>
      <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
        <button
          className="flex-1 px-2 py-2 rounded bg-green-700 text-white font-semibold hover:bg-green-600 disabled:opacity-50 text-xs"
          disabled={w.status === "Approved"}
          onClick={() => onStatus(w._id, "Approved")}
        >
          Approve
        </button>
        <button
          className="flex-1 px-2 py-2 rounded bg-red-700 text-white font-semibold hover:bg-red-600 disabled:opacity-50 text-xs"
          disabled={w.status === "Rejected"}
          onClick={() => onStatus(w._id, "Rejected")}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default WorkerMobileCard;
