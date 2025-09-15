import React from "react";

const BookingStatCards = ({ bookings = [], totalRevenue = 0 }) => {
  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length,
      color: "text-[var(--accent)]",
    },
    {
      label: "Completed",
      value: bookings.filter((b) => b.status === "completed").length,
      color: "text-green-400",
    },
    {
      label: "In Progress",
      value: bookings.filter((b) => b.status === "in-progress").length,
      color: "text-blue-300",
    },
    {
      label: "Disputes",
      value: bookings.filter((b) => b.status === "dispute").length,
      color: "text-red-400",
    },
    {
      label: "Total Revenue",
      value: `₹${Number(totalRevenue).toLocaleString()}`,
      color: "text-pink-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 animate-fade-in-up">
      {stats.map((card, i) => (
        <div
          key={i}
          className="rounded-xl p-4 sm:p-6 bg-[var(--secondary)] flex flex-col items-center justify-center shadow border border-[var(--accent)]/10 animate-fade-in-up"
          style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
        >
          <div
            className={`text-2xl font-bold ${card.color} animate-pulse-slow`}
          >
            {card.value}
          </div>
          <div className="text-gray-400 text-sm mt-1 text-center">
            {card.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingStatCards;
