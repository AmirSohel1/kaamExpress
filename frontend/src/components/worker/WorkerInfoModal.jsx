import React from "react";
import Avatar from "react-avatar";
import { FaStar } from "react-icons/fa";

const WorkerInfoModal = ({ worker, open, onClose }) => {
  console.log("WorkerInfoModal props:", { worker });
  if (!open || !worker) return null;
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
          <Avatar
            name={worker.name}
            size="80"
            round
            color="#06b6d4"
            fgColor="#fff"
          />
          <div className="text-xl font-bold text-[var(--accent)]">
            {worker.name}
          </div>
          <div className="text-sm text-gray-400 mb-2">ID: {worker.id}</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {worker.skills.map((s, i) => (
              <span
                key={i}
                className="bg-cyan-900 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <FaStar className="text-yellow-400" />
            <span className="font-semibold text-white">{worker.rating}</span>
          </div>
          <div className="text-xs text-gray-400 mb-2">
            Joined: {worker.joinDate}
          </div>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-green-900 text-green-300">
            {worker.status}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerInfoModal;
