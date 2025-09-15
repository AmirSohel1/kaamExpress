import React from "react";
import {
  FaHammer,
  FaWrench,
  FaBolt,
  FaBroom,
  FaPaintBrush,
  FaSnowflake,
} from "react-icons/fa";

const serviceCategories = [
  {
    icon: <FaHammer />,
    title: "Carpentry",
    desc: "Expert woodwork, furniture repair, and custom builds.",
  },
  {
    icon: <FaWrench />,
    title: "Plumbing",
    desc: "From leaky faucets to major pipe installations, we've got you covered.",
  },
  {
    icon: <FaBolt />,
    title: "Electrical",
    desc: "Professional wiring, appliance installation, and electrical repairs.",
  },
  {
    icon: <FaBroom />,
    title: "Cleaning",
    desc: "Thorough home and office cleaning services tailored to your needs.",
  },
  {
    icon: <FaPaintBrush />,
    title: "Painting",
    desc: "Add a fresh coat of paint to your interior or exterior walls.",
  },
  {
    icon: <FaSnowflake />,
    title: "AC Repair",
    desc: "Certified technicians to repair and service your air conditioners.",
  },
];

const Services = () => (
  <div className="min-h-screen bg-gradient-to-br from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)] px-4 sm:px-6 md:px-8 py-12 md:py-20 flex items-center">
    <div className="max-w-6xl mx-auto w-full animate-fadeIn">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-center text-[var(--accent)]">
        Our <span className="text-white">Services</span>
      </h1>
      <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-12 text-center max-w-3xl mx-auto">
        Explore the wide range of professional services offered by{" "}
        <span className="text-[var(--accent)] font-semibold">KaamExpress</span>.
        We connect you with skilled, vetted, and trustworthy workers for every
        need.
      </p>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {serviceCategories.map((service, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-lg border border-[var(--accent)]/20 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-[0_0_25px_var(--accent)] hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="text-5xl text-[var(--accent)] mb-4">
              {service.icon}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
              {service.title}
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {service.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Services;
