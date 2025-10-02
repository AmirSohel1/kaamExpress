import React, { useState, useEffect, useCallback } from "react";
import {
  FaStar,
  FaFilter,
  FaTimes,
  FaDownload,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { fetchReviews } from "../../api";

const STAR_OPTIONS = Object.freeze([
  { label: "All", value: 0 },
  { label: "5 Stars", value: 5 },
  { label: "4 Stars", value: 4 },
  { label: "3 Stars", value: 3 },
  { label: "2 Stars", value: 2 },
  { label: "1 Star", value: 1 },
]);

const RATINGS_PER_PAGE = 10;

const Ratings = () => {
  const [filter, setFilter] = useState(0);
  const [modalReview, setModalReview] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchReviews();

        // Transform API response to match frontend format with validation
        const formatted = data.map((item) => ({
          id: item.id || Math.random().toString(36).substr(2, 9), // Ensure unique ID
          customer: item.customer?.name || "Anonymous Customer",
          stars: Math.min(5, Math.max(1, Number(item.rating) || 0)), // Clamp between 1-5
          comment: item.comment || "No comment provided",
          date: item.date
            ? new Date(item.date).toLocaleDateString()
            : "Date not available",
          timestamp: item.date ? new Date(item.date).getTime() : 0, // For sorting
        }));

        // Sort by date (newest first)
        formatted.sort((a, b) => b.timestamp - a.timestamp);

        setRatings(formatted);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load ratings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  // Memoize filtered ratings to avoid recalculating on every render
  const filteredRatings = useCallback(() => {
    let result = ratings;

    // Apply star filter
    if (filter !== 0) {
      result = result.filter((r) => r.stars === filter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.customer.toLowerCase().includes(term) ||
          r.comment.toLowerCase().includes(term)
      );
    }

    return result;
  }, [ratings, filter, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRatings().length / RATINGS_PER_PAGE);
  const startIndex = (currentPage - 1) * RATINGS_PER_PAGE;
  const paginatedRatings = filteredRatings().slice(
    startIndex,
    startIndex + RATINGS_PER_PAGE
  );

  const handleExport = () => {
    try {
      const csv = [
        ["Customer", "Stars", "Comment", "Date"],
        ...filteredRatings().map((r) => [
          `"${r.customer.replace(/"/g, '""')}"`,
          r.stars,
          `"${r.comment.replace(/"/g, '""')}"`,
          `"${r.date}"`,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const date = new Date().toISOString().split("T")[0];
      a.href = url;
      a.download = `worker_reviews_${date}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting CSV:", err);
      alert("Failed to export reviews. Please try again.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400">Loading ratings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-lg text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-400">
            Customer Reviews
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3">
              <FaFilter className="text-blue-400" />
              <select
                className="bg-gray-800 text-gray-100 py-2 focus:outline-none"
                value={filter}
                onChange={(e) => {
                  setFilter(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {STAR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleExport}
              disabled={filteredRatings().length === 0}
            >
              <FaDownload />
              Export
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-gray-400">
          <p>
            Showing {filteredRatings().length} review
            {filteredRatings().length !== 1 ? "s" : ""}
            {filter !== 0 && ` with ${filter} star${filter !== 1 ? "s" : ""}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Mobile-optimized cards */}
        <div className="md:hidden space-y-4">
          {paginatedRatings.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-400 mb-3">No reviews found.</p>
              {(filter !== 0 || searchTerm) && (
                <button
                  onClick={() => {
                    setFilter(0);
                    setSearchTerm("");
                  }}
                  className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-md"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            paginatedRatings.map((r) => (
              <div
                key={r.id}
                className="bg-gray-800 rounded-lg p-4 shadow border border-gray-700 cursor-pointer hover:border-blue-400 transition-colors"
                onClick={() => setModalReview(r)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-white">{r.customer}</span>
                  <span className="text-xs text-gray-400">{r.date}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < r.stars ? "text-yellow-400" : "text-gray-600"
                      }
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-300">
                    {r.stars}/5
                  </span>
                </div>
                <div className="text-gray-300 text-sm italic">
                  {r.comment.length > 100
                    ? `${r.comment.substring(0, 100)}...`
                    : r.comment}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block bg-gray-800 rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-750">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">
                  Customer
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">
                  Rating
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">
                  Comment
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRatings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 px-4 text-center">
                    <p className="text-gray-400 mb-3">No reviews found.</p>
                    {(filter !== 0 || searchTerm) && (
                      <button
                        onClick={() => {
                          setFilter(0);
                          setSearchTerm("");
                        }}
                        className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-md"
                      >
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedRatings.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-gray-700 hover:bg-gray-750 cursor-pointer"
                    onClick={() => setModalReview(r)}
                  >
                    <td className="py-3 px-4 font-medium text-white">
                      {r.customer}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < r.stars ? "text-yellow-400" : "text-gray-600"
                            }
                          />
                        ))}
                        <span className="ml-2 text-gray-300">{r.stars}/5</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300 italic max-w-md truncate">
                      {r.comment.length > 150
                        ? `${r.comment.substring(0, 150)}...`
                        : r.comment}
                    </td>
                    <td className="py-3 px-4 text-gray-400">{r.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <div className="text-sm text-gray-400">
              Showing {startIndex + 1} to{" "}
              {Math.min(
                startIndex + RATINGS_PER_PAGE,
                filteredRatings().length
              )}{" "}
              of {filteredRatings().length} entries
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <FaChevronLeft />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, index, array) => {
                    const showEllipsis =
                      index > 0 && page - array[index - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`w-8 h-8 rounded-md ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-gray-800 hover:bg-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}

        {/* Modal for review details */}
        {modalReview && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
            onClick={() => setModalReview(null)}
          >
            <div
              className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-blue-400">
                  Review Details
                </h3>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={() => setModalReview(null)}
                  aria-label="Close modal"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Customer</p>
                  <p className="text-white">{modalReview.customer}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Date</p>
                  <p className="text-white">{modalReview.date}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Rating</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < modalReview.stars
                              ? "text-yellow-400"
                              : "text-gray-600"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-gray-300">
                      ({modalReview.stars}/5)
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Comment</p>
                  <p className="text-white italic">{modalReview.comment}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ratings;
