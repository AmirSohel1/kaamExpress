import React from "react";

const BookingServiceDistribution = ({ serviceCounts = {}, bookings = [] }) => {
  const totalBookings = bookings.length || 1; // prevent division by zero

  return (
    <div className="bg-[var(--secondary)] rounded-2xl p-6 shadow animate-fade-in-up">
      <span className="text-lg font-semibold mb-4 block">
        Service Distribution
      </span>
      {Object.keys(serviceCounts).length === 0 ? (
        <div className="text-gray-400 text-center py-4">
          No service data available.
        </div>
      ) : (
        <ul className="space-y-3 animate-fade-in-up">
          {Object.entries(serviceCounts).map(([service, count], idx) => (
            <li
              key={service}
              className="flex items-center justify-between animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.07 + 0.2}s` }}
            >
              <span className="text-white">{service}</span>
              <div className="flex-1 mx-4 h-2 rounded bg-gray-700">
                <div
                  className="h-2 rounded bg-[var(--accent)]"
                  style={{ width: `${(count / totalBookings) * 100}%` }}
                ></div>
              </div>
              <span className="text-gray-300">
                {count} booking{count !== 1 ? "s" : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingServiceDistribution;
