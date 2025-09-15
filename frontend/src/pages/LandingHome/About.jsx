import React from "react";
import { FaCheckCircle, FaStar, FaShieldAlt, FaUsers } from "react-icons/fa";

const About = () => (
  <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center bg-gradient-to-br from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)] px-4 sm:px-6 md:px-8 py-12 md:py-16">
    <div className="max-w-4xl w-full bg-white/10 backdrop-blur-lg border border-[var(--accent)]/20 rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 animate-fadeIn">
      {/* Branding */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-[var(--accent)] text-center">
        About <span className="text-white">KaamExpress</span>
      </h1>

      {/* Intro */}
      <p className="text-gray-200 text-base sm:text-lg leading-relaxed mb-6 text-center">
        KaamExpress is your trusted platform for connecting customers with
        skilled and reliable professionals for all your home and office service
        needs. We are committed to safety, reliability, and professionalism,
        ensuring that every service exceeds expectations.
      </p>

      {/* Mission */}
      <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 text-center">
        Our mission is simple: to make finding and hiring workers effortless. By
        building a community of quality professionals, we give customers peace
        of mind knowing their tasks are in capable hands.
      </p>

      {/* Values */}
      <div className="mt-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-[var(--accent)]">
          Our Values
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-200 text-base">
          {/* Reliability */}
          <li className="flex items-start gap-3 bg-[var(--secondary)]/60 backdrop-blur-md p-4 rounded-xl border border-[var(--accent)]/10 hover:scale-105 transition">
            <FaCheckCircle className="text-[var(--accent)] text-xl flex-shrink-0 mt-1" />
            <div>
              <strong className="text-white">Reliability:</strong> We ensure
              every professional is vetted and trustworthy.
            </div>
          </li>

          {/* Quality */}
          <li className="flex items-start gap-3 bg-[var(--secondary)]/60 backdrop-blur-md p-4 rounded-xl border border-[var(--accent)]/10 hover:scale-105 transition">
            <FaStar className="text-[var(--accent)] text-xl flex-shrink-0 mt-1" />
            <div>
              <strong className="text-white">Quality:</strong> Committed to
              delivering excellence every time.
            </div>
          </li>

          {/* Trust */}
          <li className="flex items-start gap-3 bg-[var(--secondary)]/60 backdrop-blur-md p-4 rounded-xl border border-[var(--accent)]/10 hover:scale-105 transition">
            <FaShieldAlt className="text-[var(--accent)] text-xl flex-shrink-0 mt-1" />
            <div>
              <strong className="text-white">Trust:</strong> Transparent ratings
              and reviews to build lasting trust.
            </div>
          </li>

          {/* Community */}
          <li className="flex items-start gap-3 bg-[var(--secondary)]/60 backdrop-blur-md p-4 rounded-xl border border-[var(--accent)]/10 hover:scale-105 transition">
            <FaUsers className="text-[var(--accent)] text-xl flex-shrink-0 mt-1" />
            <div>
              <strong className="text-white">Community:</strong> Building a
              network of skilled workers and happy customers.
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default About;
