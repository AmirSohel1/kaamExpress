import React from "react";

const ServiceFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
  sortBy,
  onSortChange,
  totalServices,
  filteredCount,
}) => {
  return (
    <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-gray-700">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Search Services
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, description, or category..."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <span className="absolute right-3 top-3 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="status">Status</option>
            <option value="date">Date Added</option>
          </select>
        </div>
      </div>

      {/* Category Filter Row */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Categories
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryFilterChange("all")}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              categoryFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryFilterChange(category)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                categoryFilter === category
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
        <span className="text-sm text-gray-400">
          Showing <strong>{filteredCount}</strong> of{" "}
          <strong>{totalServices}</strong> services
        </span>
        {searchTerm || statusFilter !== "all" || categoryFilter !== "all" ? (
          <button
            onClick={() => {
              onSearchChange("");
              onStatusFilterChange("all");
              onCategoryFilterChange("all");
            }}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            Clear all filters
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ServiceFilters;
