import React from "react";
import {
  FaUser,
  FaUserTie,
  FaRupeeSign,
  FaCalendarAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

const DisputeInfoModal = ({ dispute, open, onClose }) => {
  if (!open || !dispute) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <div className="flex flex-col items-center gap-4">
          <span className="text-2xl font-bold text-[var(--accent)] flex items-center gap-2">
            <FaExclamationTriangle className="text-red-400" />
            Dispute #{dispute.id}
          </span>
          <div className="flex items-center gap-2">
            <FaUser className="text-purple-400" />
            <span className="font-semibold text-white">
              {dispute.customer.name}
            </span>
            <span className="text-gray-400">vs</span>
            <FaUserTie className="text-cyan-400" />
            <span className="font-semibold text-white">
              {dispute.worker.name}
            </span>
          </div>
          <div className="text-gray-400 text-sm mb-2">{dispute.issue}</div>
          <div className="flex items-center gap-2 text-green-300 mb-2">
            <FaRupeeSign />
            <span className="font-semibold">{dispute.amount}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <FaCalendarAlt className="text-[var(--accent)]" />
            <span className="text-xs text-gray-400">{dispute.date}</span>
          </div>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-green-900 text-green-300 capitalize">
            {dispute.status}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeInfoModal;
