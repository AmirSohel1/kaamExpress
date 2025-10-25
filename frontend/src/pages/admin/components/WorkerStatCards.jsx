import React from "react";
import StatCard from "../../../components/service/StatCard";

const WorkerStatCards = ({ workers = [] }) => {
  const totalWorkers = workers.length;
  const approved = workers.filter((w) => w.status === "Approved").length;
  const pending = workers.filter((w) => w.status === "Pending").length;
  const rejected = workers.filter((w) => w.status === "Rejected").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-fade-in-up">
      <StatCard value={totalWorkers} label="Total Workers" color="text-white" />
      <StatCard value={approved} label="Approved" color="text-green-400" />
      <StatCard value={pending} label="Pending" color="text-yellow-300" />
      <StatCard value={rejected} label="Rejected" color="text-red-400" />
    </div>
  );
};

export default WorkerStatCards;
