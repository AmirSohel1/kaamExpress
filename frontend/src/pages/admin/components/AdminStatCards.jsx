import React from "react";
import StatCard from "../../../components/service/StatCard";

const AdminStatCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
      {stats.map((stat, i) => (
        <StatCard
          key={stat.label}
          value={stat.value}
          label={stat.label}
          color={stat.color || "text-white"}
          icon={stat.icon}
          change={stat.change}
          className={stat.bg}
        />
      ))}
    </div>
  );
};

export default AdminStatCards;
