import React from "react";

const AdminStatCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`rounded-xl p-6 flex items-center gap-4 shadow ${stat.bg} animate-fade-in-up`}
          style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
        >
          <span className="bg-[var(--card)] p-3 rounded-full flex items-center justify-center">
            {stat.icon}
          </span>
          <div className="flex flex-col">
            <div className="text-2xl font-bold text-white animate-pulse-slow">
              {stat.value}
            </div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
            {stat.change && (
              <div
                className={`text-xs mt-1 ${
                  stat.change.startsWith("-")
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {stat.change}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStatCards;
