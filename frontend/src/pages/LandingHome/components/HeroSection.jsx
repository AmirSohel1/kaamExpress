import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 md:py-32 bg-gradient-to-br from-[var(--primary)] via-gray-900 to-black text-white overflow-hidden">
      {/* Subtle background accent shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[var(--accent)] opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight animate-fade-in-up">
          Find Trusted <span className="text-[var(--accent)]">Workers</span> for
          Any Job, Instantly.
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
          KaamExpress connects you with skilled professionals for carpentry,
          plumbing, electrical, cleaning, painting, AC repair, and more. Book
          services instantly, track your bookings, and manage everything from
          one place.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/signup")}
          className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-[var(--accent)] text-gray-900 text-lg md:text-xl font-bold shadow-xl hover:bg-[var(--accent)]/80 transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-400"
        >
          Get Started <FaArrowRight className="ml-2 animate-bounce-x" />
        </button>
      </div>
    </section>
  );
}
