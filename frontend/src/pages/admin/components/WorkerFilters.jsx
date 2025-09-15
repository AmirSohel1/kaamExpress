import React from "react";
import { FaSearch } from "react-icons/fa";

const WorkerFilters = ({
  search = "",
  setSearch = () => {},
  statusFilter = "all",
  setStatusFilter = () => {},
  onAddWorker = () => {},
}) => (
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 w-full animate-fade-in-up">
    {/* Search Input */}
    <div className="flex items-center bg-[var(--secondary)] rounded-xl px-4 py-3 flex-1 min-w-[200px] border border-[var(--accent)]/10">
      <FaSearch className="text-[var(--accent)] mr-2 text-base" />
      <input
        type="text"
        placeholder="Search workers..."
        className="bg-transparent outline-none text-white flex-1 text-sm sm:text-base placeholder-gray-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    {/* Status Filter */}
    <select
      className="bg-[var(--secondary)] text-white rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none border border-[var(--accent)]/10 min-w-[150px]"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="all">All Status</option>
      <option value="Approved">Approved</option>
      <option value="Pending">Pending</option>
      <option value="Rejected">Rejected</option>
    </select>

    {/* Add Worker Button */}
    <button
      className="px-4 py-3 rounded-xl bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition text-sm sm:text-base shadow min-w-[120px]"
      onClick={onAddWorker}
    >
      Add Worker
    </button>
  </div>
);

export default WorkerFilters;
