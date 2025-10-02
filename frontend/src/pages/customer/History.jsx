import React, { useState, useEffect, useContext } from "react";
import {
  FaStar,
  FaCheckCircle,
  FaRegEdit,
  FaTimes,
  FaSpinner,
  FaFileExport,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { fetchBookings } from "../../api/bookings";
import { createReview } from "../../api/review";
import { AuthContext } from "../../contexts/AuthContext.jsx";

const History = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      try {
        const bookings = await fetchBookings();
        // Only completed bookings for this customer
        const completed = bookings.bookings.filter(
          (b) =>
            b.status === "Completed" && b.customer && b.customer._id === user.id
        );

        const reviewsData = completed.map((b) => ({
          id: b._id,
          service: b.service?.name || "",
          worker: b.worker?.user?.name || b.worker?.name || "",
          date: b.date ? new Date(b.date).toLocaleDateString() : "",
          datetime: b.date ? new Date(b.date) : new Date(),
          rating: b.review?.rating || 0,
          review: b.review?.comment || "",
          hasReview: !!b.review?.rating,
        }));

        setReviews(reviewsData);
        setFilteredReviews(reviewsData);
      } catch (err) {
        console.error("Failed to load bookings:", err);
        setReviews([]);
        setFilteredReviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) loadBookings();
  }, [user]);

  // Filter and sort reviews
  useEffect(() => {
    let result = [...reviews];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (review) =>
          review.service.toLowerCase().includes(term) ||
          review.worker.toLowerCase().includes(term) ||
          review.review.toLowerCase().includes(term)
      );
    }

    // Apply rating filter
    if (ratingFilter !== "All") {
      const ratingValue = parseInt(ratingFilter);
      result = result.filter((review) => review.rating === ratingValue);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? a.datetime - b.datetime
          : b.datetime - a.datetime;
      } else if (sortBy === "rating") {
        return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating;
      } else if (sortBy === "service") {
        return sortOrder === "asc"
          ? a.service.localeCompare(b.service)
          : b.service.localeCompare(a.service);
      }
      return 0;
    });

    setFilteredReviews(result);
  }, [reviews, searchTerm, ratingFilter, sortBy, sortOrder]);

  const openModal = (r) => setModal({ ...r });
  const closeModal = () => setModal(null);

  const handleRating = (idx) => {
    setModal((prev) => ({ ...prev, rating: idx + 1 }));
  };

  const handleReviewChange = (e) => {
    setModal((prev) => ({ ...prev, review: e.target.value }));
  };

  const saveReview = async () => {
    try {
      await createReview({
        bookingId: modal.id,
        rating: modal.rating,
        comment: modal.review,
      });

      setReviews((prev) =>
        prev.map((r) =>
          r.id === modal.id
            ? {
                ...r,
                rating: modal.rating,
                review: modal.review,
                hasReview: true,
              }
            : r
        )
      );

      closeModal();
    } catch (err) {
      console.error("Failed to save review:", err);
      alert("Failed to save review. Please try again.");
    }
  };

  const handleExport = () => {
    const csv = [
      ["Service", "Worker", "Date", "Rating", "Review"],
      ...filteredReviews.map((r) => [
        r.service,
        r.worker,
        r.date,
        r.rating,
        r.review,
      ]),
    ]
      .map((row) => `"${row.join('","')}"`)
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `service_history_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12">
        <div className="relative">
          <FaSpinner className="animate-spin text-3xl mb-3 text-[var(--accent)]" />
          <div className="absolute inset-0 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-lg text-gray-300 mt-2">
          Loading your service history...
        </p>
        <p className="text-sm text-gray-500">This may take a moment</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-full overflow-y-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Service History
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Review your completed services and share your experience
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[var(--card)] to-[var(--card)]/80 rounded-2xl p-5 shadow-lg border border-gray-700/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Total Services</p>
              <p className="text-2xl font-bold text-white mt-1">
                {reviews.length}
              </p>
            </div>
            <div className="bg-blue-900/30 p-2 rounded-lg">
              <span className="text-blue-400 text-sm font-bold">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[var(--card)] to-[var(--card)]/80 rounded-2xl p-5 shadow-lg border border-gray-700/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Average Rating</p>
              <p className="text-2xl font-bold text-white mt-1">
                {reviews.length > 0
                  ? (
                      reviews.reduce((sum, review) => sum + review.rating, 0) /
                      reviews.length
                    ).toFixed(1)
                  : "0.0"}
              </p>
            </div>
            <div className="bg-amber-900/30 p-2 rounded-lg">
              <FaStar className="text-amber-400 text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[var(--card)] to-[var(--card)]/80 rounded-2xl p-5 shadow-lg border border-gray-700/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Reviews Given</p>
              <p className="text-2xl font-bold text-white mt-1">
                {reviews.filter((r) => r.hasReview).length}
              </p>
            </div>
            <div className="bg-purple-900/30 p-2 rounded-lg">
              <FaRegEdit className="text-purple-400 text-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch bg-gradient-to-br from-[var(--card)] to-[var(--card)]/80 rounded-2xl p-4 shadow-lg border border-gray-700/30">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search services, workers, or reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2.5 bg-[var(--background)] border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
            >
              <option value="All">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
              <option value="0">Not Rated</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-black font-semibold transition flex items-center gap-2 shadow-md"
        >
          <FaFileExport /> Export
        </button>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-400 text-sm">
          Showing {filteredReviews.length} of {reviews.length} services
        </p>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <FaFilter className="text-xs" />
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="bg-transparent text-white border-none outline-none"
          >
            <option value="date">Date</option>
            <option value="rating">Rating</option>
            <option value="service">Service</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="p-1 rounded hover:bg-gray-700/30"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((r) => (
            <div
              key={r.id}
              className="bg-gradient-to-br from-[var(--card)] to-[var(--card)]/80 rounded-2xl shadow-lg p-5 border border-gray-700/30 hover:border-gray-700/60 transition-all duration-200 hover:shadow-xl"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-semibold text-white text-lg">
                    {r.service}
                  </span>
                  <p className="text-gray-400 text-xs mt-1">{r.date}</p>
                </div>
                <div className="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded-full">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-sm ${
                        i < r.rating ? "text-amber-400" : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-xs">Service Professional</p>
                <p className="text-gray-200 text-sm font-medium">{r.worker}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-xs">Your Review</p>
                <p className="text-gray-300 text-sm mt-1">
                  {r.review || (
                    <span className="text-gray-500 italic">No review yet</span>
                  )}
                </p>
              </div>

              {!r.hasReview && (
                <button
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-black font-semibold transition flex items-center justify-center gap-2 shadow-md"
                  onClick={() => openModal(r)}
                >
                  <FaRegEdit /> Write a Review
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gradient-to-br from-[var(--card)] to-[var(--card)]/80 rounded-2xl border border-gray-700/30">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-gray-300 font-medium text-lg">
              No services found
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {searchTerm || ratingFilter !== "All"
                ? "Try adjusting your search or filter"
                : "You don't have any completed services yet"}
            </p>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block w-full bg-gradient-to-br from-[var(--card)] to-[var(--card)]/80 rounded-2xl shadow-lg overflow-hidden border border-gray-700/30">
        <table className="min-w-full divide-y divide-gray-700/50">
          <thead>
            <tr className="text-left bg-[var(--primary)]/30 text-gray-400 text-sm">
              <th
                className="py-4 px-6 cursor-pointer hover:text-white transition"
                onClick={() => handleSort("service")}
              >
                <div className="flex items-center gap-1">
                  SERVICE{" "}
                  {sortBy === "service" && (sortOrder === "asc" ? "↑" : "↓")}
                </div>
              </th>
              <th className="py-4 px-6">WORKER</th>
              <th
                className="py-4 px-6 cursor-pointer hover:text-white transition"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-1">
                  DATE {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                </div>
              </th>
              <th
                className="py-4 px-6 cursor-pointer hover:text-white transition"
                onClick={() => handleSort("rating")}
              >
                <div className="flex items-center gap-1">
                  RATING{" "}
                  {sortBy === "rating" && (sortOrder === "asc" ? "↑" : "↓")}
                </div>
              </th>
              <th className="py-4 px-6">REVIEW</th>
              <th className="py-4 px-6 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/30">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-[var(--secondary)]/20 transition-all duration-150"
                >
                  <td className="py-4 px-6">
                    <div className="font-semibold text-white">{r.service}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-200">{r.worker}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-400 text-sm">{r.date}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-base ${
                            i < r.rating ? "text-amber-400" : "text-gray-600"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-gray-300 text-xs">
                        {r.rating}/5
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-300 text-sm max-w-xs truncate">
                      {r.review || (
                        <span className="text-gray-500 italic">
                          No review yet
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end">
                      {!r.hasReview ? (
                        <button
                          className="px-4 py-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-black font-semibold transition flex items-center gap-2 shadow-md"
                          onClick={() => openModal(r)}
                        >
                          <FaRegEdit /> Review
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg bg-green-900/30 text-green-400 text-sm flex items-center gap-1">
                          <FaCheckCircle /> Reviewed
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-4xl mb-3">📝</div>
                    <h3 className="text-gray-300 font-medium text-lg">
                      No services found
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 max-w-md">
                      {searchTerm || ratingFilter !== "All"
                        ? "Try adjusting your search or filter criteria"
                        : "You don't have any completed services yet. Your service history will appear here once you complete bookings."}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[var(--card)] to-[var(--card)]/90 rounded-2xl shadow-2xl p-6 w-full max-w-md relative border border-gray-700/50">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl transition-colors"
              onClick={closeModal}
              aria-label="Close"
            >
              <FaTimes />
            </button>

            <h2 className="text-2xl font-bold text-white mb-2">
              Share Your Experience
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              How was your service with {modal.worker}?
            </p>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-300">
                  Rate your experience
                </span>
                <span className="text-amber-400 font-semibold">
                  {modal.rating}/5
                </span>
              </div>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    className="focus:outline-none transform hover:scale-110 transition-transform"
                    onClick={() => handleRating(i)}
                  >
                    <FaStar
                      className={`text-2xl ${
                        i < modal.rating ? "text-amber-400" : "text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-medium text-gray-300 mb-2">
                Your review
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-xl bg-[var(--background)] text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 resize-none transition-all"
                rows={4}
                value={modal.review}
                onChange={handleReviewChange}
                placeholder="Share details about your experience with this service..."
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                className="px-5 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium transition-colors"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-black font-semibold shadow-md transition-colors"
                onClick={saveReview}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
