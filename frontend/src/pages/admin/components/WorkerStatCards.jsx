import React from "react";

const WorkerStatCards = ({ workers = [] }) => {
  // Safely compute counts
  const totalWorkers = workers.length;
  const approved = workers.filter((w) => w.status === "Approved").length;
  const pending = workers.filter((w) => w.status === "Pending").length;
  const rejected = workers.filter((w) => w.status === "Rejected").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-fade-in-up">
      {/* Total Workers */}
      <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-6 flex flex-col items-center shadow border border-[var(--accent)]/10 min-w-0 animate-fade-in-up">
        <div className="text-2xl sm:text-3xl font-bold text-white animate-pulse-slow">
          {totalWorkers}
        </div>
        <div className="text-gray-400 text-sm sm:text-base mt-1 text-center">
          Total Workers
        </div>
      </div>

      {/* Approved */}
      <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-6 flex flex-col items-center shadow border border-[var(--accent)]/10 min-w-0 animate-fade-in-up">
        <div className="text-2xl sm:text-3xl font-bold text-green-400 animate-pulse-slow">
          {approved}
        </div>
        <div className="text-gray-400 text-sm sm:text-base mt-1 text-center">
          Approved
        </div>
      </div>

      {/* Pending */}
      <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-6 flex flex-col items-center shadow border border-[var(--accent)]/10 min-w-0 animate-fade-in-up">
        <div className="text-2xl sm:text-3xl font-bold text-yellow-300 animate-pulse-slow">
          {pending}
        </div>
        <div className="text-gray-400 text-sm sm:text-base mt-1 text-center">
          Pending
        </div>
      </div>

      {/* Rejected */}
      <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-6 flex flex-col items-center shadow border border-[var(--accent)]/10 min-w-0 animate-fade-in-up">
        <div className="text-2xl sm:text-3xl font-bold text-red-400 animate-pulse-slow">
          {rejected}
        </div>
        <div className="text-gray-400 text-sm sm:text-base mt-1 text-center">
          Rejected
        </div>
      </div>
    </div>
  );
};

export default WorkerStatCards;
