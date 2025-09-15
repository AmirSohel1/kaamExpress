import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHandshake } from "react-icons/fa";

export default function CallToActionSection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 text-white text-center px-6">
      <div className="max-w-4xl mx-auto">
        {/* Icon */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-teal-500/30 rounded-full blur-3xl animate-pulse"></div>
          <FaHandshake className="relative text-teal-400 text-7xl mx-auto animate-bounce" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 animate-fade-in-up">
          Ready to <span className="text-teal-400">Get Your Work Done</span>?
        </h2>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-gray-300 mb-10 animate-fade-in-up delay-200">
          Join <span className="text-teal-400 font-semibold">KaamExpress</span>{" "}
          today and enjoy hassle-free service booking. From quick fixes to major
          projects, we’ve got you covered with trusted professionals.
        </p>

        {/* CTA Button */}
        <button
          className="px-10 py-4 rounded-full bg-teal-500 text-gray-900 text-lg md:text-xl font-bold shadow-lg hover:bg-teal-400 hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-400"
          onClick={() => navigate("/signup")}
        >
          Find a Worker Now!
        </button>
      </div>
    </section>
  );
}
