import React from "react";
import { Link } from "react-router-dom";
import {
  FaHardHat,
  FaPlug,
  FaPaintRoller,
  FaBroom,
  FaCar,
  FaLeaf,
} from "react-icons/fa";

// Worker Categories Data
const workerCategories = [
  {
    id: 1,
    name: "Plumbers",
    icon: <FaPlug />,
    description:
      "Expert plumbers for all your leaks, clogs, and installations.",
    link: "/category/plumbers",
  },
  {
    id: 2,
    name: "Electricians",
    icon: <FaHardHat />,
    description:
      "Certified electricians for wiring, repairs, and new installations.",
    link: "/category/electricians",
  },
  {
    id: 3,
    name: "Painters",
    icon: <FaPaintRoller />,
    description:
      "Professional painters for homes, offices, and commercial spaces.",
    link: "/category/painters",
  },
  {
    id: 4,
    name: "Cleaners",
    icon: <FaBroom />,
    description: "Reliable cleaners for sparkling homes and spotless offices.",
    link: "/category/cleaners",
  },
  {
    id: 5,
    name: "Drivers",
    icon: <FaCar />,
    description:
      "Experienced drivers for personal, commercial, and delivery needs.",
    link: "/category/drivers",
  },
  {
    id: 6,
    name: "Gardeners",
    icon: <FaLeaf />,
    description:
      "Skilled gardeners for lawn care, landscaping, and plant maintenance.",
    link: "/category/gardeners",
  },
];

export default function WorkerShowcase() {
  return (
    <section
      className="w-full min-h-[calc(100vh-4rem)] h-full overflow-y-auto px-4 sm:px-6 md:px-8 py-12 md:py-20 bg-[var(--primary)] text-white"
      id="worker-showcase"
    >
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 text-[var(--accent)] animate-fade-in-up">
          Explore Our <span className="text-white">Top Categories</span>
        </h2>
        <p className="text-gray-400 text-center text-sm sm:text-lg mb-12 animate-fade-in-up delay-200">
          Find skilled and verified professionals across multiple service
          categories.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {workerCategories.map((category, index) => (
            <Link
              to={category.link}
              key={category.id}
              className="group flex flex-col items-center p-6 bg-[var(--card)] rounded-2xl shadow-lg border border-[var(--accent)]/20 hover:border-[var(--accent)] transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 100 + 100}ms` }}
            >
              {/* Icon */}
              <div className="mb-4 p-4 rounded-full bg-[var(--secondary)] group-hover:bg-[var(--accent)] transition-colors duration-300">
                {React.cloneElement(category.icon, {
                  className:
                    "text-4xl text-[var(--accent)] group-hover:text-[var(--primary)] transition-colors duration-300",
                })}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors duration-300">
                {category.name}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-center text-sm group-hover:text-gray-300 transition-colors duration-300">
                {category.description}
              </p>

              {/* CTA */}
              <span className="mt-4 text-[var(--accent)] font-semibold group-hover:underline transition-all duration-300">
                View {category.name} →
              </span>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in-up delay-700">
          <p className="text-lg text-gray-400 mb-6">
            Can't find what you're looking for? Browse all categories.
          </p>
          <Link
            to="/categories"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[var(--accent)] text-[var(--primary)] font-semibold shadow-lg hover:bg-[var(--accent)]/90 transition-all duration-300 transform hover:scale-105"
          >
            See All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
