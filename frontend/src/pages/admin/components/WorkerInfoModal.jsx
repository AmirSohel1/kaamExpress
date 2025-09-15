import React from "react";
import Avatar from "react-avatar";
import { FaStar, FaEnvelope, FaCalendarAlt, FaTimes } from "react-icons/fa";

const WorkerInfoModal = ({ worker, open, onClose }) => {
  // Only show 'No worker data available' if worker is null/undefined
  if (worker == null) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in-up">
        <div className="bg-[var(--card)] rounded-2xl shadow-lg p-6 w-full max-w-md relative animate-fade-in-up flex flex-col items-center">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <FaTimes size={20} />
          </button>
          <div className="text-white text-lg font-semibold mt-8 mb-4">
            No worker data available.
          </div>
        </div>
      </div>
    );
  }
  // Fallbacks for missing user field
  const name = worker.user?.name || worker.name || "N/A";
  const email = worker.user?.email || worker.email || "N/A";
  const isActive = worker.user?.isActive;
  const status = worker.status || (isActive ? "Active" : "Inactive");
  // Ensure getAverageRating is defined
  const getAverageRating = (ratings) => {
    if (!Array.isArray(ratings) || ratings.length === 0) return "N/A";
    const total = ratings.reduce((sum, r) => sum + (r.rating || 0), 0);
    return (total / ratings.length).toFixed(1);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in-up">
      <div className="bg-[var(--card)] rounded-2xl shadow-lg p-6 w-full max-w-md relative animate-fade-in-up">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>
        <div className="flex flex-col items-center gap-3 mb-4">
          <Avatar name={name} size="64" round color="#06b6d4" fgColor="#fff" />
          <div className="font-bold text-white text-lg animate-fade-in-up">
            {name}
          </div>
          <div className="text-xs text-gray-400">{email}</div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              isActive === true
                ? "bg-green-900 text-green-300"
                : isActive === false
                ? "bg-gray-700 text-gray-300"
                : "bg-yellow-900 text-yellow-300"
            } animate-fade-in-up`}
          >
            {status}
          </span>
        </div>
        <div className="flex justify-between mb-4">
          <div className="text-center">
            <div className="text-xs text-gray-400">Jobs</div>
            <div className="font-bold text-white text-lg animate-pulse-slow">
              {worker.jobs}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">Rating</div>
            <div className="font-bold text-yellow-300 text-lg flex items-center justify-center gap-1 animate-pulse-slow">
              <FaStar className="text-yellow-400 text-base" />
              {getAverageRating(worker.ratings)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">Joined</div>
            <div className="font-bold text-white text-lg animate-fade-in-up">
              {new Date(worker.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="text-gray-400 text-xs mb-1">Skills:</div>
          <div className="flex flex-wrap gap-2">
            {worker.skills?.map((s, i) => (
              <span
                key={i}
                className="bg-cyan-900 text-cyan-300 px-2 py-1 rounded-full text-[10px] font-semibold animate-fade-in-up"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="flex-1 px-2 py-2 rounded bg-green-700 text-white font-semibold hover:bg-green-600 disabled:opacity-50 text-xs"
            disabled={worker.status === "Approved"}
            onClick={() => onStatus(worker._id, "Approved")}
          >
            Approve
          </button>
          <button
            className="flex-1 px-2 py-2 rounded bg-red-700 text-white font-semibold hover:bg-red-600 disabled:opacity-50 text-xs"
            disabled={worker.status === "Rejected"}
            onClick={() => onStatus(worker._id, "Rejected")}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerInfoModal;
