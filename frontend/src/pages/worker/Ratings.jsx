import React, { useState, useEffect } from "react";
import { getWorkerRatings } from "../../api/workerRatings";
import { FaStar, FaFilter, FaTimes } from "react-icons/fa";

const starOptions = [
  { label: "All", value: 0 },
  { label: "5 Stars", value: 5 },
  { label: "4 Stars", value: 4 },
  { label: "3 Stars", value: 3 },
  { label: "2 Stars", value: 2 },
  { label: "1 Star", value: 1 },
];

const Ratings = () => {
  const [filter, setFilter] = useState(0);
  const [modalReview, setModalReview] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getWorkerRatings()
      .then((data) => {
        setRatings(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load ratings");
        setLoading(false);
      });
  }, []);

  const filteredRatings =
    filter === 0 ? ratings : ratings.filter((r) => r.stars === filter);

  if (loading)
    return <div className="text-gray-400 p-8">Loading ratings...</div>;
  if (error) return <div className="text-red-400 p-8">{error}</div>;

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-full overflow-y-auto px-4 sm:px-6 py-4 flex flex-col animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 gap-3 animate-fade-in-up">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--accent)] flex-1 animate-fade-in-up">
          Customer Reviews
        </h2>
        <div className="flex items-center gap-2">
          <FaFilter className="text-[var(--accent)]" />
          <select
            className="bg-[var(--secondary)] text-white rounded-xl px-4 py-2 text-sm focus:outline-none border border-[var(--accent)]/10"
            value={filter}
            onChange={(e) => setFilter(Number(e.target.value))}
          >
            {starOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <button
          className="px-4 py-2 rounded-xl bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition shadow text-sm w-full sm:w-auto"
          onClick={() => {
            const csv = [
              ["Customer", "Stars", "Comment"],
              ...filteredRatings.map((r) => [
                `"${r.customer}"`,
                r.stars,
                `"${r.comment}"`,
              ]),
            ]
              .map((row) => row.join(","))
              .join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "worker_reviews.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export Reviews
        </button>
      </div>

      {/* Mobile-optimized cards (hidden on md and up) */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredRatings.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            No reviews found.
          </div>
        ) : (
          filteredRatings.map((r, idx) => (
            <div
              key={idx}
              className="bg-[var(--secondary)] rounded-2xl p-4 shadow-md border border-[var(--accent)]/10"
              onClick={() => setModalReview(r)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold text-sm">
                  {r.customer}
                </span>
                <span className="text-gray-400 text-xs">{r.date}</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-yellow-400 text-sm ${
                      i < r.stars ? "" : "opacity-30"
                    }`}
                  />
                ))}
                <span className="ml-1 text-gray-300 text-xs">{r.stars}/5</span>
              </div>
              <div className="text-gray-300 italic text-sm">"{r.comment}"</div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table (hidden on sm and down) */}
      <div className="hidden md:block w-full bg-[var(--secondary)] rounded-2xl shadow mb-8 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-gray-300 text-sm bg-[var(--primary)]">
              <th className="py-3 px-4 min-w-[150px]">Customer</th>
              <th className="py-3 px-4 min-w-[120px]">Stars</th>
              <th className="py-3 px-4 min-w-[200px]">Comment</th>
            </tr>
          </thead>
          <tbody>
            {filteredRatings.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-400">
                  No reviews found.
                </td>
              </tr>
            ) : (
              filteredRatings.map((r, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-700 hover:bg-[var(--card)] transition cursor-pointer"
                  onClick={() => setModalReview(r)}
                >
                  <td className="py-3 px-4 font-bold text-sm text-white">
                    {r.customer}
                  </td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-yellow-400 text-sm ${
                            i < r.stars ? "" : "opacity-30"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-gray-300 text-xs">
                        {r.stars}/5
                      </span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300 italic">
                    "{r.comment}"
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for review details */}
      {modalReview && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--secondary)] rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-[var(--accent)]"
              onClick={() => setModalReview(null)}
            >
              <FaTimes size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4 text-[var(--accent)]">
              Review Details
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Customer:</span>{" "}
                <span className="text-white">{modalReview.customer}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Rating:</span>
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-yellow-400 ${
                      i < modalReview.stars ? "" : "opacity-30"
                    }`}
                  />
                ))}
              </div>
              <div>
                <span className="font-semibold">Comment:</span>{" "}
                <span className="text-gray-300 italic">
                  {modalReview.comment}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ratings;
