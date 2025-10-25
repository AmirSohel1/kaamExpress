import React from "react";
import {
  FaRupeeSign,
  FaExclamationTriangle,
  FaMoneyBillWave,
} from "react-icons/fa";

const BookingStatCards = ({
  bookings = [],
  totalRevenue = 0,
  paidRevenue = 0,
  unpaidBookings = 0,
}) => {
  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length,
      color: "text-blue-400",
      icon: "📊",
      trend: "+12%",
    },
    {
      label: "Completed",
      value: bookings.filter((b) => b.status === "completed").length,
      color: "text-green-400",
      icon: "✅",
      percentage:
        (
          (bookings.filter((b) => b.status === "completed").length /
            bookings.length) *
          100
        ).toFixed(1) + "%",
    },
    {
      label: "In Progress",
      value: bookings.filter((b) => b.status === "in-progress").length,
      color: "text-yellow-400",
      icon: "🔄",
    },
    {
      label: "Pending",
      value: bookings.filter((b) => b.status === "pending").length,
      color: "text-orange-400",
      icon: "⏳",
    },
    {
      label: "Total Revenue",
      value: `₹${Number(totalRevenue).toLocaleString()}`,
      color: "text-purple-400",
      icon: <FaRupeeSign className="inline" />,
      subValue: `₹${Number(paidRevenue).toLocaleString()} paid`,
    },
    {
      label: "Unpaid Bookings",
      value: unpaidBookings,
      color: "text-red-400",
      icon: <FaExclamationTriangle className="inline" />,
      alert: unpaidBookings > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {stats.map((card, i) => (
        <div
          key={i}
          className="rounded-2xl p-4 bg-gradient-to-br from-[var(--secondary)] to-[var(--card)] border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`text-2xl ${card.color} group-hover:scale-110 transition-transform`}
            >
              {card.icon}
            </div>
            {card.alert && (
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
            )}
          </div>

          <div className={`text-2xl font-bold ${card.color} mb-1`}>
            {card.value}
          </div>

          <div className="text-gray-400 text-sm flex justify-between items-end">
            <span>{card.label}</span>
            {card.percentage && (
              <span className="text-green-400 text-xs font-semibold">
                {card.percentage}
              </span>
            )}
            {card.trend && (
              <span className="text-blue-400 text-xs font-semibold">
                {card.trend}
              </span>
            )}
          </div>

          {card.subValue && (
            <div className="text-gray-500 text-xs mt-2">{card.subValue}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BookingStatCards;
