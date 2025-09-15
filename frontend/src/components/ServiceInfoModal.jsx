// src/components/ServiceInfoModal.jsx
import React, { useEffect } from "react";
import { FaUsers, FaEye, FaTimes } from "react-icons/fa";

const ServiceInfoModal = ({ service, open, onClose }) => {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open || !service) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
    >
      <div className="bg-[var(--card)] rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative transform transition-transform scale-95 animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400 text-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-full"
          aria-label="Close modal"
        >
          <FaTimes />
        </button>

        {/* Modal content */}
        <div className="flex flex-col items-center text-center gap-4">
          <h2
            id="service-modal-title"
            className="text-2xl sm:text-3xl font-bold text-[var(--accent)]"
          >
            {service.name}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base">{service.desc}</p>

          <div className="flex items-center gap-4 text-green-300 text-sm sm:text-base">
            <FaUsers />
            <span className="font-semibold">{service.workers} workers</span>
          </div>

          <div className="flex items-center gap-2">
            <FaEye className="text-green-400" />
            <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-green-900 text-green-300">
              {service.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-[var(--accent)] text-black rounded-xl font-semibold hover:bg-[var(--accent)]/80 transition shadow-md text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfoModal;
