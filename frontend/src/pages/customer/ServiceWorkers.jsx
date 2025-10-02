// src/pages/customer/ServiceWorkers.jsx
import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import WorkerCard from "./component/WorkerCard";
import BookingModal from "./component/BookingModal";
import {
  FiFilter,
  FiX,
  FiChevronLeft,
  FiStar,
  FiClock,
  FiDollarSign,
  FiAlertCircle,
} from "react-icons/fi";

const ServiceWorkers = () => {
  const { serviceId } = useParams();
  const { user } = useContext(AuthContext);
  const [service, setService] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating"); // rating | experience | rate
  const [sortOrder, setSortOrder] = useState("desc"); // asc | desc
  const navigate = useNavigate();

  // filter state
  const [filters, setFilters] = useState({
    availability: "all", // all | available | unavailable
    minExperience: "",
    maxRate: "",
    minRating: 0,
  });

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/workers/service/${serviceId}`);
        console.log(res.data);
        setService(res.data.service);
        setWorkers(res.data.workers);
        setFilteredWorkers(res.data.workers);
      } catch (err) {
        setError("Failed to load workers. Please try again later.");
        console.error("Error fetching workers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, [serviceId]);

  // Calculate worker rating
  const calculateRating = useCallback((worker) => {
    return worker.ratings?.length > 0
      ? worker.ratings.reduce((s, r) => s + r.stars, 0) / worker.ratings.length
      : 0;
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...workers];

    // Apply filters
    if (filters.availability !== "all") {
      result = result.filter((w) =>
        filters.availability === "available" ? w.availability : !w.availability
      );
    }

    if (filters.minExperience) {
      result = result.filter((w) => w.experience >= filters.minExperience);
    }

    if (filters.maxRate) {
      result = result.filter((w) => (w.dailyRate || 0) <= filters.maxRate);
    }

    result = result.filter((w) => {
      const rating = calculateRating(w);
      return (
        rating >= filters.minRating || (filters.minRating === 0 && rating === 0)
      );
    });

    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case "rating":
          valueA = calculateRating(a);
          valueB = calculateRating(b);
          break;
        case "experience":
          valueA = a.experience;
          valueB = b.experience;
          break;
        case "rate":
          valueA = a.dailyRate || 0;
          valueB = b.dailyRate || 0;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });

    setFilteredWorkers(result);
  }, [filters, workers, sortBy, sortOrder, calculateRating]);

  const resetFilters = () => {
    setFilters({
      availability: "all",
      minExperience: "",
      maxRate: "",
      minRating: 0,
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.availability !== "all" ||
      filters.minExperience !== "" ||
      filters.maxRate !== "" ||
      filters.minRating !== 0
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-2"
      >
        <FiChevronLeft className="mr-1" /> Back
      </button>

      {/* Page title */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          {service
            ? `Available Workers for ${service.name}`
            : "Available Workers"}
        </h2>
        {service && (
          <p className="text-gray-300 text-sm sm:text-base max-w-3xl">
            {service.description}
          </p>
        )}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-secondary p-4 rounded-xl shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-gray-300 text-sm">
            {filteredWorkers.length}{" "}
            {filteredWorkers.length === 1 ? "worker" : "workers"} available
          </span>
          {hasActiveFilters() && (
            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
              Filters applied
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-gray-300 text-sm">
              Sort by:
            </label>
            <select
              id="sort"
              className="bg-card text-white px-3 py-2 rounded-lg text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rating">Rating</option>
              <option value="experience">Experience</option>
              <option value="rate">Rate</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="bg-card p-2 rounded-lg hover:bg-blue-900 transition-colors"
              aria-label={`Sort ${
                sortOrder === "asc" ? "descending" : "ascending"
              }`}
            >
              {sortOrder === "asc" ? "A→Z" : "Z→A"}
            </button>
          </div>

          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-card text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors"
          >
            <FiFilter size={16} />
            Filters
            {hasActiveFilters() && (
              <span className="bg-blue-500 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                !
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Filter Panel */}
      {showFilters && (
        <div className="bg-secondary p-5 rounded-xl shadow-lg animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Filter Workers</h3>
            <div className="flex items-center gap-3">
              {hasActiveFilters() && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  <FiX size={14} /> Clear all
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close filters"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Availability */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Availability
              </label>
              <select
                className="bg-card text-white px-3 py-2 rounded-lg w-full"
                value={filters.availability}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, availability: e.target.value }))
                }
              >
                <option value="all">All Workers</option>
                <option value="available">Available Only</option>
                <option value="unavailable">Unavailable Only</option>
              </select>
            </div>

            {/* Min Experience */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Min Experience (years)
              </label>
              <input
                type="number"
                min="0"
                className="bg-card text-white px-3 py-2 rounded-lg w-full"
                placeholder="e.g. 2"
                value={filters.minExperience}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    minExperience: Number(e.target.value) || "",
                  }))
                }
              />
            </div>

            {/* Max Rate */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Max Daily Rate ($)
              </label>
              <input
                type="number"
                min="0"
                className="bg-card text-white px-3 py-2 rounded-lg w-full"
                placeholder="e.g. 100"
                value={filters.maxRate}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    maxRate: e.target.value ? Number(e.target.value) : "",
                  }))
                }
              />
            </div>

            {/* Min Rating */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Minimum Rating
              </label>
              <select
                className="bg-card text-white px-3 py-2 rounded-lg w-full"
                value={filters.minRating}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    minRating: Number(e.target.value),
                  }))
                }
              >
                <option value={0}>Any Rating</option>
                <option value={3}>3★ & above</option>
                <option value={4}>4★ & above</option>
                <option value={4.5}>4.5★ & above</option>
                <option value={5}>5★ Only</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Loading / Error / Empty States */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center space-x-2">
            <div className="animate-bounce h-3 w-3 bg-blue-500 rounded-full"></div>
            <div
              className="animate-bounce h-3 w-3 bg-blue-500 rounded-full"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="animate-bounce h-3 w-3 bg-blue-500 rounded-full"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
          <p className="text-gray-400 mt-4">Loading available workers...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-secondary rounded-xl">
          <FiAlertCircle className="inline-block text-red-400 text-4xl mb-3" />
          <p className="text-red-400 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filteredWorkers.length === 0 ? (
        <div className="text-center py-12 bg-secondary rounded-xl">
          <div className="text-gray-400 text-6xl mb-3">🔍</div>
          <h3 className="text-white text-xl font-medium mb-2">
            No workers found
          </h3>
          <p className="text-gray-400 max-w-md mx-auto">
            {hasActiveFilters()
              ? "Try adjusting your filters to see more results."
              : "There are currently no workers available for this service."}
          </p>
          {hasActiveFilters() && (
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((worker) => (
            <WorkerCard
              key={worker._id}
              worker={worker}
              onBook={() => {
                setSelectedWorker(worker);
                setShowModal(true);
              }}
              onNavigate={() => navigate(`/customer/worker/${worker._id}`)}
            />
          ))}
        </div>
      )}

      {/* Stats footer */}
      {!loading && !error && workers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <FiStar className="text-yellow-400" />
              <span>
                Average rating:{" "}
                {(
                  workers.reduce(
                    (total, worker) => total + calculateRating(worker),
                    0
                  ) / workers.length
                ).toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FiClock className="text-blue-400" />
              <span>
                Avg. experience:{" "}
                {(
                  workers.reduce(
                    (total, worker) => total + (worker.experience || 0),
                    0
                  ) / workers.length
                ).toFixed(1)}{" "}
                years
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FiDollarSign className="text-green-400" />
              <span>
                Avg. daily rate: $
                {(
                  workers.reduce(
                    (total, worker) => total + (worker.dailyRate || 0),
                    0
                  ) / workers.length
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showModal && selectedWorker && (
        <BookingModal
          worker={selectedWorker}
          service={service}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ServiceWorkers;
