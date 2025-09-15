import React from "react";
import { FaStar } from "react-icons/fa";

const TopWorkers = ({ workers }) => (
  <section className="py-16 bg-[#232b36] text-white">
    <div className="max-w-4xl mx-auto text-center mb-12">
      <h2 className="text-3xl font-bold mb-2">Top Rated Workers</h2>
      <p className="text-gray-400">
        Meet our highly rated and experienced professionals
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      {workers.map((w) => (
        <div
          key={w.id}
          className="bg-[#1a202c] rounded-2xl p-8 flex flex-col items-center shadow-md"
        >
          <div className="w-16 h-16 rounded-full bg-[#2d3748] flex items-center justify-center text-2xl font-bold mb-4">
            {w.name[0]}
          </div>
          <div className="font-semibold text-lg mb-1">{w.name}</div>
          <div className="text-accent text-sm mb-2">{w.category}</div>
          <div className="text-left w-full text-sm mb-2">
            <div>
              Experience:{" "}
              <span className="font-medium">{w.experience} years</span>
            </div>
            <div>
              Rate: <span className="font-medium">₹{w.rate}/hour</span>
            </div>
            <div className="flex items-center gap-1">
              Rating: <FaStar className="text-yellow-400" />{" "}
              <span className="font-medium">{w.rating.toFixed(2)}</span>
            </div>
            <div>
              Location: <span className="font-medium">{w.location}</span>
            </div>
          </div>
          <button className="mt-4 px-6 py-2 rounded bg-accent text-white font-semibold hover:bg-blue-400 transition">
            View Profile
          </button>
        </div>
      ))}
    </div>
  </section>
);

export default TopWorkers;
