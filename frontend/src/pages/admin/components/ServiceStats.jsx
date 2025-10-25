import React from "react";

const StatCard = ({ value, label, color, icon, trend }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className="text-2xl opacity-80">{icon}</div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center">
          <span className={`text-xs ${trend.color} font-medium`}>
            {trend.value}
          </span>
        </div>
      )}
    </div>
  );
};

const ServiceStats = ({ services, totalWorkers = 0 }) => {
  const activeCount = services.filter((s) => s.isActive).length;
  const inactiveCount = services.filter((s) => !s.isActive).length;
  const categoriesCount = new Set(services.flatMap((s) => s.categories)).size;

  const stats = [
    {
      value: services.length,
      label: "Total Services",
      color: "text-blue-400",
      icon: "📦",
    },
    {
      value: activeCount,
      label: "Active Services",
      color: "text-green-400",
      icon: "✅",
    },
    {
      value: inactiveCount,
      label: "Inactive Services",
      color: "text-yellow-400",
      icon: "⏸️",
    },
    {
      value: categoriesCount,
      label: "Categories",
      color: "text-purple-400",
      icon: "🏷️",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          value={stat.value}
          label={stat.label}
          color={stat.color}
          icon={stat.icon}
        />
      ))}
    </div>
  );
};

export default ServiceStats;
