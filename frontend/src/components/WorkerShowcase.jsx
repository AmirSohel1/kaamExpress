import React, { useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaStar } from "react-icons/fa";

const demoWorkers = [
  {
    id: 1,
    name: "Rahul Sharma",
    type: "Carpenter",
    location: "Delhi",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Suresh Yadav",
    type: "Plumber",
    location: "Mumbai",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Amit Verma",
    type: "Electrician",
    location: "Bangalore",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Priya Singh",
    type: "Cleaner",
    location: "Delhi",
    rating: 4.6,
  },
  {
    id: 5,
    name: "Ravi Kumar",
    type: "Painter",
    location: "Chennai",
    rating: 4.4,
  },
];

export default function WorkerShowcase() {
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const filtered = demoWorkers.filter(
    (w) =>
      (!type || w.type.toLowerCase().includes(type.toLowerCase())) &&
      (!location || w.location.toLowerCase().includes(location.toLowerCase()))
  );
  return (
    <section className="w-full max-w-4xl mx-auto mt-12 mb-16 bg-[var(--card)] rounded-2xl shadow-lg p-8 border border-[var(--accent)]/20">
      <h2 className="text-2xl font-bold mb-6 text-[var(--accent)] text-center">
        Top Workers
      </h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
        <div className="flex items-center gap-2 bg-[var(--secondary)] rounded px-3 py-2">
          <FaSearch className="text-[var(--accent)]" />
          <input
            className="bg-transparent outline-none text-white"
            placeholder="Type of work (e.g. Plumber)"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-[var(--secondary)] rounded px-3 py-2">
          <FaMapMarkerAlt className="text-[var(--accent)]" />
          <input
            className="bg-transparent outline-none text-white"
            placeholder="Location (e.g. Delhi)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((w) => (
          <div
            key={w.id}
            className="bg-[var(--secondary)] rounded-xl p-5 flex flex-col items-center border border-[var(--accent)]/10 shadow hover:shadow-xl transition"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--accent)] flex items-center justify-center text-black text-2xl font-bold mb-3">
              {w.name[0]}
            </div>
            <div className="font-bold text-lg text-white">{w.name}</div>
            <div className="text-gray-400 text-sm mb-1">{w.type}</div>
            <div className="flex items-center gap-1 text-yellow-400 mb-2">
              <FaStar />{" "}
              <span className="text-white font-semibold">{w.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
              <FaMapMarkerAlt /> {w.location}
            </div>
            <button
              className="mt-2 px-4 py-2 rounded bg-[var(--accent)] text-black font-semibold w-full cursor-not-allowed opacity-60"
              disabled
            >
              View Profile (Login Required)
            </button>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center text-gray-400 mt-8">
          No workers found for your search.
        </div>
      )}
    </section>
  );
}
