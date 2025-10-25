import React from "react";
import CountUp from "react-countup";

/**
 * Generic StatCard for displaying a value, label, icon, and optional change indicator.
 * Props:
 * - value: number|string
 * - label: string
 * - color: Tailwind color class (default: text-white)
 * - icon: React element (optional)
 * - change: string (optional, e.g. '+5%', '-2%')
 * - className: string (optional)
 */
const StatCard = ({
  value,
  label,
  color = "text-white",
  icon,
  change,
  className = "",
}) => (
  <div
    className={`rounded-xl p-4 sm:p-6 bg-[var(--card)] flex items-center gap-4 shadow border border-[var(--accent)]/10 min-w-0 animate-fade-in-up ${className}`}
  >
    {icon && (
      <span className="bg-[var(--card)] p-3 rounded-full flex items-center justify-center">
        {icon}
      </span>
    )}
    <div className="flex flex-col">
      <div className={`text-2xl font-bold ${color} animate-pulse-slow`}>
        {typeof value === "number" ? (
          <CountUp end={value} duration={1.5} separator="," />
        ) : (
          value
        )}
      </div>
      <div className="text-gray-400 text-sm mt-1 text-center">{label}</div>
      {change && (
        <div
          className={`text-xs mt-1 ${
            change.startsWith("-") ? "text-red-400" : "text-green-400"
          }`}
        >
          {change}
        </div>
      )}
    </div>
  </div>
);

export default StatCard;
