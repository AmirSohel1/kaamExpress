import React from "react";
import CountUp from "react-countup";

const StatCard = ({ value, label, color = "text-white" }) => (
  <div className="rounded-xl p-4 sm:p-6 bg-[var(--secondary)] flex flex-col items-center shadow border border-[var(--accent)]/10">
    <div className={`text-2xl font-bold ${color}`}>
      <CountUp end={value} duration={1.5} separator="," />
    </div>
    <div className="text-gray-400 text-sm mt-1 text-center">{label}</div>
  </div>
);

const ServiceStats = ({ services, totalWorkers = 0 }) => {
  const activeCount = services.filter((s) => s.isActive).length;
  const inactiveCount = services.filter((s) => !s.isActive).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard
        value={services.length}
        label="Total Services"
        color="text-[var(--accent)]"
      />
      <StatCard
        value={activeCount}
        label="Active Services"
        color="text-green-400"
      />
      <StatCard
        value={inactiveCount}
        label="Inactive Services"
        color="text-yellow-300"
      />
      <StatCard
        value={totalWorkers}
        label="Total Workers"
        color="text-cyan-400"
      />
    </div>
  );
};

export default ServiceStats;
