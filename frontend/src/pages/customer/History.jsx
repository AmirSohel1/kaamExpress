import React, { useState, useEffect, useContext } from "react";
import { FaStar, FaCheckCircle, FaRegEdit, FaTimes } from "react-icons/fa";
import { fetchBookings } from "../../api/bookings";
import { AuthContext } from "../../contexts/AuthContext.jsx";

const History = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      try {
        const bookings = await fetchBookings();
        // Only completed bookings for this customer
        const completed = bookings.filter(
          (b) =>
            b.status === "Completed" && b.customer && b.customer._id === user.id
        );
        setReviews(
          completed.map((b) => ({
            id: b._id,
            service: b.service?.name || "",
            worker: b.worker?.user?.name || b.worker?.name || "",
            date: b.date ? new Date(b.date).toLocaleDateString() : "",
            rating: b.review?.rating || 0,
            review: b.review?.comment || "",
          }))
        );
      } catch (err) {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    if (user && user.id) loadBookings();
  }, [user]);
  const [modal, setModal] = useState(null); // { id, rating, review }

  const openModal = (r) => setModal({ ...r });
  const closeModal = () => setModal(null);
  const handleRating = (idx) => {
    setModal((prev) => ({ ...prev, rating: idx + 1 }));
  };
  const handleReviewChange = (e) => {
    setModal((prev) => ({ ...prev, review: e.target.value }));
  };
  const saveReview = () => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === modal.id
          ? { ...r, rating: modal.rating, review: modal.review }
          : r
      )
    );
    closeModal();
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-8">Loading history...</div>
    );
  }
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-full overflow-y-auto px-4 sm:px-6 py-4 flex flex-col">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8">
        Service History
      </h1>
      <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-8">
        View your completed services and leave reviews
      </p>

      {/* Action bar for mobile and desktop */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-[var(--card)] rounded-2xl p-4 shadow-lg mb-4">
        <span className="text-lg font-semibold text-[var(--accent)] mb-2 sm:mb-0">
          Service History
        </span>
        <button
          className="px-4 py-2 rounded-lg bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition text-sm shadow"
          onClick={() => {
            const csv = [
              ["Service", "Worker", "Date", "Rating", "Review"],
              ...reviews.map((r) => [
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
            a.download = "customer_history.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export History
        </button>
      </div>

      {/* Mobile-optimized cards (hidden on md and up) */}
      <div className="md:hidden flex flex-col gap-4">
        {reviews.length > 0 ? (
          reviews.map((r) => (
            <div
              key={r.id}
              className="bg-[var(--card)] rounded-2xl shadow-lg p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-white text-base">
                  {r.service}
                </span>
                <span className="text-gray-400 text-sm">{r.date}</span>
              </div>
              <div className="text-gray-200 text-sm mb-2">
                Worker: {r.worker}
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-yellow-400 text-sm ${
                      i < r.rating ? "" : "opacity-30"
                    }`}
                  />
                ))}
                <span className="ml-1 text-gray-300 text-xs">
                  {r.rating || 0}/5
                </span>
              </div>
              <div className="text-gray-300 italic text-sm mb-4">
                {r.review || (
                  <span className="text-gray-500">No review yet</span>
                )}
              </div>
              <button
                className="w-full px-4 py-2 rounded-lg bg-[var(--accent)] text-black text-sm font-semibold hover:bg-[var(--accent)]/80 transition shadow"
                onClick={() => openModal(r)}
              >
                <div className="flex items-center justify-center gap-2">
                  <FaRegEdit /> Update Review
                </div>
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-8">
            No completed services to show.
          </div>
        )}
      </div>

      {/* Desktop table (hidden on sm and down) */}
      <div className="hidden md:block w-full bg-[var(--card)] rounded-2xl shadow-lg mb-8 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left bg-[var(--primary)] text-gray-400 text-sm">
              <th className="py-4 px-6 min-w-[120px]">SERVICE</th>
              <th className="py-4 px-6 min-w-[150px]">WORKER</th>
              <th className="py-4 px-6 min-w-[120px]">DATE</th>
              <th className="py-4 px-6 min-w-[150px]">RATING</th>
              <th className="py-4 px-6 min-w-[200px]">REVIEW</th>
              <th className="py-4 px-6 min-w-[180px]">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-gray-700 hover:bg-[var(--secondary)] transition"
                >
                  <td className="py-4 px-6 font-semibold text-sm text-white">
                    {r.service}
                  </td>
                  <td className="py-4 px-6 text-gray-200 text-sm">
                    {r.worker}
                  </td>
                  <td className="py-4 px-6 text-gray-400 text-sm">{r.date}</td>
                  <td className="py-4 px-6">
                    <span className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-yellow-400 text-base ${
                            i < r.rating ? "" : "opacity-30"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-gray-300 text-xs">
                        {r.rating || 0}/5
                      </span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-300 italic text-sm">
                    {r.review || (
                      <span className="text-gray-500">No review yet</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      className="px-4 py-1 rounded-lg bg-[var(--accent)] text-black text-sm font-semibold hover:bg-[var(--accent)]/80 transition shadow flex items-center gap-2 justify-center"
                      onClick={() => openModal(r)}
                    >
                      <FaRegEdit /> Update Review
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-400">
                  No completed services to show.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for updating review */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-[var(--card)] rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-accent text-2xl"
              onClick={closeModal}
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold mb-4">Update Review</h2>
            <div className="mb-4">
              <span className="font-semibold">Your Rating</span>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    className="focus:outline-none"
                    onClick={() => handleRating(i)}
                  >
                    <FaStar
                      className={`text-yellow-400 text-xl ${
                        i < modal.rating ? "" : "opacity-30"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <span className="font-semibold">Your Review</span>
              <textarea
                className="w-full mt-1 px-3 py-2 rounded bg-[var(--secondary)] text-white border border-gray-700 focus:outline-none resize-none"
                rows={3}
                value={modal.review}
                onChange={handleReviewChange}
                placeholder="Write your review..."
              />
            </div>
            <div className="flex gap-4 justify-end">
              <button
                className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 font-semibold hover:bg-gray-600 transition text-sm"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-[var(--accent)] text-black font-semibold hover:bg-cyan-700 shadow-md transition text-sm"
                onClick={saveReview}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
