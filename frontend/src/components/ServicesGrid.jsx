// src/components/ServicesGrid.jsx
import React, { useState } from "react";
import ServiceCard from "./ServiceCard";

const ServicesGrid = ({ services }) => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");

  // Filter services based on category
  const filteredServices = services.filter(
    (service) => filter === "all" || service.categories?.includes(filter)
  );

  // Sort services based on selection
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // Default order (popularity/maintain original order)
  });

  // Extract unique categories for filter
  const categories = [
    "all",
    ...new Set(services.flatMap((service) => service.categories || [])),
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Our Services
          </h2>
          <p className="text-gray-400 mt-2">
            Discover our premium service offerings
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Category filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="category-filter" className="text-gray-400 text-sm">
              Category:
            </label>
            <select
              id="category-filter"
              className="bg-[var(--secondary)] border border-[var(--accent)]/30 rounded-lg py-1.5 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-by" className="text-gray-400 text-sm">
              Sort by:
            </label>
            <select
              id="sort-by"
              className="bg-[var(--secondary)] border border-[var(--accent)]/30 rounded-lg py-1.5 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {sortedServices.map((service, index) => (
          <ServiceCard
            key={service._id}
            service={service}
            style={{ animationDelay: `${index * 100}ms` }} // staggered effect
          />
        ))}
      </div>

      {/* Empty state */}
      {sortedServices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-white mb-2">
            No services found
          </h3>
          <p className="text-gray-400">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
};

export default ServicesGrid;
