import React from "react";
import { FaHammer, FaWrench, FaClock, FaCheckCircle } from "react-icons/fa";

const features = [
  {
    icon: <FaCheckCircle className="text-teal-400 text-5xl mb-4" />,
    title: "Verified Professionals",
    description:
      "Access a network of thoroughly vetted and skilled workers for peace of mind.",
  },
  {
    icon: <FaClock className="text-teal-400 text-5xl mb-4" />,
    title: "Instant Booking",
    description:
      "Book services on-demand or schedule them at your convenience with a few clicks.",
  },
  {
    icon: <FaWrench className="text-teal-400 text-5xl mb-4" />,
    title: "Wide Range of Services",
    description:
      "From plumbing to painting, find experts for every household and professional need.",
  },
  {
    icon: <FaHammer className="text-teal-400 text-5xl mb-4" />,
    title: "Transparent Pricing",
    description:
      "No hidden fees. Get clear, upfront estimates before you confirm your booking.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-950 to-indigo-950 text-white px-6">
      <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-14 animate-fade-in-up">
        Why Choose <span className="text-teal-400">KaamExpress</span>?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-8 bg-gray-900/80 rounded-2xl shadow-lg border border-gray-700 hover:border-teal-400/50 hover:shadow-teal-500/20 transform hover:scale-105 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 150 + 400}ms` }}
          >
            {feature.icon}
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-base">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
