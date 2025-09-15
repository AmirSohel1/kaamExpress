// src/components/ServiceInfoModal.jsx
import React, { useEffect } from "react";
import { getServiceIcon } from "../../../components/getServiceIcon";
import { useNavigate } from "react-router-dom";

const ServiceInfoModal = ({ service, open, onClose }) => {
  const navigate = useNavigate();

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open || !service) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <section
        className="bg-[var(--secondary)] rounded-2xl p-6 sm:p-8 flex flex-col items-center shadow-lg hover:shadow-2xl transition border border-[var(--accent)]/20 relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400 text-xl"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Service Icon */}
        <div className="mb-4 text-3xl sm:text-5xl text-white">
          {getServiceIcon(service.name)}
        </div>

        {/* Service Name */}
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white text-center">
          {service.name}
        </h2>

        {/* Description */}
        <p className="text-gray-400 text-center mb-4 text-xs sm:text-base">
          {service.description || "No description available"}
        </p>

        {/* Categories and Price */}
        <div className="flex justify-between w-full text-xs sm:text-sm text-gray-400 mb-4">
          <span className="whitespace-nowrap">
            {service.categories?.join(", ") || "No categories"}
          </span>
          <span className="whitespace-nowrap">
            {service.priceRange || "Price not specified"}
          </span>
        </div>

        {/* Status Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
            service.isActive
              ? "bg-green-900 text-green-300"
              : "bg-yellow-900 text-yellow-300"
          }`}
        >
          {service.isActive ? "Active" : "Inactive"}
        </span>

        {/* Submit Button */}
        <button
          className="w-full mt-auto px-4 py-2 rounded-lg bg-[var(--accent)] text-black text-sm sm:text-base font-semibold hover:bg-[var(--accent)]/80 transition shadow-md"
          onClick={() =>
            navigate(`/customer/service/${encodeURIComponent(service._id)}`)
          }
        >
          Submit
        </button>
      </section>
    </div>
  );
};

export default ServiceInfoModal;
