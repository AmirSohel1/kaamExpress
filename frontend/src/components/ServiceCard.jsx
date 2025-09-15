// src/components/ServiceCard.jsx
import React from "react";
import { getServiceIcon } from "./getServiceIcon";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  return (
    <div
      key={service._id}
      className="bg-[var(--secondary)] rounded-2xl p-6 sm:p-8 flex flex-col items-center shadow-lg 
                 hover:shadow-2xl transition-all duration-300 border border-[var(--accent)]/20 
                 hover:border-[var(--accent)] transform hover:-translate-y-1 animate-fade-in-up"
      style={{ animationDelay: `${Math.random() * 200}ms` }} // subtle stagger
    >
      {/* Icon */}
      <div className="mb-4 text-3xl sm:text-5xl text-[var(--accent)]">
        {getServiceIcon(service.name)}
      </div>

      {/* Service Name */}
      <div className="text-xl sm:text-2xl font-bold mb-2 text-white text-center">
        {service.name}
      </div>

      {/* Description */}
      <div className="text-gray-400 text-center mb-4 text-xs sm:text-base">
        {service.description}
      </div>

      {/* Categories & Price */}
      <div className="flex flex-wrap justify-between w-full text-xs sm:text-sm text-gray-400 mb-4 gap-2">
        <span className="whitespace-nowrap">
          {service.categories?.join(", ")}
        </span>
        <span className="whitespace-nowrap">{service.priceRange}</span>
      </div>

      {/* Book Button */}
      <button
        className="w-full mt-auto px-4 py-2 rounded-lg bg-[var(--accent)] text-black text-sm sm:text-base 
                   font-semibold hover:bg-[var(--accent)]/80 transition shadow-md transform hover:scale-105"
        onClick={() =>
          navigate(`/customer/service/${encodeURIComponent(service._id)}`)
        }
      >
        Book Now
      </button>
    </div>
  );
};

export default ServiceCard;
