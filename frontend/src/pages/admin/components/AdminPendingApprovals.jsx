import React from "react";
import Avatar from "react-avatar";

const AdminPendingApprovals = ({
  pendingApprovals,
  onOpenModal,
  onApprove,
  onReject,
}) => {
  return (
    <div className="bg-[var(--secondary)] rounded-2xl p-6 shadow flex flex-col">
      <span className="text-lg font-semibold mb-4">
        Pending Worker Approvals
      </span>

      {pendingApprovals.length === 0 ? (
        <div className="text-gray-400 text-center py-4">
          No pending approvals.
        </div>
      ) : (
        pendingApprovals.map((worker, index) => (
          <div
            key={worker.name + worker.category + index}
            className="flex justify-between items-center bg-[var(--card)] rounded-lg p-4 mb-3 cursor-pointer hover:bg-[var(--accent)]/10 transition"
            onClick={() => onOpenModal(worker)}
          >
            {/* Worker Info */}
            <div className="flex items-center gap-3">
              <Avatar
                name={worker.name}
                size="40"
                round
                color="#06b6d4"
                fgColor="#fff"
              />
              <div className="truncate">
                <div className="font-bold text-base text-[var(--accent)] truncate">
                  {worker.name}
                </div>
                <div className="text-gray-400 text-xs truncate">
                  {worker.category}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                className="px-4 py-1 rounded bg-green-700 text-white font-semibold hover:bg-green-600 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove(worker);
                }}
              >
                Approve
              </button>
              <button
                className="px-4 py-1 rounded bg-red-700 text-white font-semibold hover:bg-red-600 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  onReject(worker);
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminPendingApprovals;
