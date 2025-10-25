import React from "react";
import Avatar from "react-avatar";

const WorkerApprovalModal = ({
  worker,
  open,
  onClose,
  onApprove,
  onReject,
}) => {
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
          <div className="text-sm text-gray-400 mb-2">{worker.category}</div>
          <div className="flex gap-4 mt-4">
            <button
              className="px-6 py-2 rounded bg-green-700 text-white font-semibold hover:bg-green-600 transition"
              onClick={() => onApprove(worker)}
            >
              Approve
            </button>
            <button
              className="px-6 py-2 rounded bg-red-700 text-white font-semibold hover:bg-red-600 transition"
              onClick={() => onReject(worker)}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerApprovalModal;
