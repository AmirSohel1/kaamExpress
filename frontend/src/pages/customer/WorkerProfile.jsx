// src/pages/customer/WorkerProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWorkerProfilePublic } from "../../api/workers";

const WorkerProfile = () => {
  const { workerId } = useParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const data = await fetchWorkerProfilePublic(workerId);
        setWorker(data);
      } catch (err) {
        setError("Failed to load worker profile");
      } finally {
        setLoading(false);
      }
    };
    fetchWorker();
  }, [workerId]);

  if (loading)
    return (
      <div className="text-center text-gray-400 py-8 animate-pulse">
        Loading profile...
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-400 py-8 animate-fade-in">
        {error}
      </div>
    );
  if (!worker) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
      <button
        className="text-[var(--accent)] underline self-start hover:text-[var(--accent-dark)] transition"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      <div className="bg-[var(--secondary)] rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col gap-4 animate-fade-in-up">
        {/* Worker Name */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          {worker.name}
        </h1>

        {/* Basic Info */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-gray-400 text-sm sm:text-base">
          <div>Skills: {worker.skills?.join(", ") || "N/A"}</div>
          <div>Experience: {worker.experience || 0} yrs</div>
          <div>Status: {worker.status || "Unknown"}</div>
        </div>

        {/* Contact & Address */}
        <div className="text-gray-400 text-sm sm:text-base">
          <div>Address: {worker.address || "N/A"}</div>
          <div>Phone: {worker.phone || "N/A"}</div>
          <div>
            Availability:{" "}
            <span
              className={`font-semibold ${
                worker.availability ? "text-green-400" : "text-red-400"
              }`}
            >
              {worker.availability ? "Available" : "Not Available"}
            </span>
          </div>
        </div>

        {/* Ratings */}
        <div>
          <h2 className="text-white font-semibold mb-2">Ratings:</h2>
          <ul className="pl-4 flex flex-col gap-2">
            {worker.ratings && worker.ratings.length > 0 ? (
              worker.ratings.map((r, idx) => (
                <li
                  key={idx}
                  className="text-yellow-400 text-sm sm:text-base bg-[var(--primary)] p-2 rounded-lg shadow-sm"
                >
                  {r.stars}★ - {r.comment}{" "}
                  {r.customer && (
                    <span className="text-gray-400">
                      by {r.customer.name || r.customer}
                    </span>
                  )}
                </li>
              ))
            ) : (
              <li className="text-gray-500">No ratings yet.</li>
            )}
          </ul>
        </div>

        {/* Book Button */}
        <button
          className="mt-4 px-6 py-2 bg-[var(--accent)] text-black rounded-lg font-semibold hover:bg-[var(--accent-dark)] transition shadow-md w-full sm:w-auto self-start"
          onClick={() => navigate(`/customer/book/${worker._id}`)}
        >
          Book This Worker
        </button>
      </div>
    </div>
  );
};

export default WorkerProfile;
