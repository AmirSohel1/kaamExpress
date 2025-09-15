import React from "react";
import { FaSearch } from "react-icons/fa";

const BookingFilters = ({
  search,
  setSearch,
  status,
  setStatus,
  service,
  setService,
  serviceOptions,
  onExport,
}) => {
  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setService("all");
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 animate-fade-in-up">
      {/* Search Input */}
      <div className="flex items-center bg-[var(--secondary)] rounded-xl px-4 py-3 flex-1 border border-[var(--accent)]/10">
        <FaSearch className="text-gray-400 mr-2 text-base" />
        <input
          type="text"
          placeholder="Search bookings..."
          className="bg-transparent outline-none text-white flex-1 text-sm placeholder-gray-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Status Filter */}
      <select
        className="bg-[var(--secondary)] text-white rounded-xl px-4 py-3 text-sm focus:outline-none border border-[var(--accent)]/10 min-w-[150px]"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="all">All Status</option>
        <option value="completed">Completed</option>
        <option value="in-progress">In Progress</option>
        <option value="dispute">Dispute</option>
      </select>

      {/* Service Filter */}
      <select
        className="bg-[var(--secondary)] text-white rounded-xl px-4 py-3 text-sm focus:outline-none border border-[var(--accent)]/10 min-w-[150px]"
        value={service}
        onChange={(e) => setService(e.target.value)}
      >
        <option value="all">All Services</option>
        {serviceOptions.map((s, idx) => {
          const key = typeof s === "string" ? s : s?._id || idx;
          const label = typeof s === "string" ? s : s?.name || "Unknown";
          return (
            <option key={`${key}-${idx}`} value={label}>
              {label}
            </option>
          );
        })}
      </select>

      {/* Action Buttons */}
      <div className="flex gap-2 sm:gap-3">
        <button
          className="px-4 py-3 rounded-xl bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition text-sm shadow min-w-[120px]"
          onClick={onExport}
        >
          Export Data
        </button>
        <button
          className="px-4 py-3 rounded-xl bg-gray-700 text-white font-semibold hover:bg-gray-600 transition text-sm shadow min-w-[120px]"
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default BookingFilters;
