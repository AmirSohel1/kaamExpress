// src/components/ServiceCard.jsx
import React, { useState } from "react";
import { getServiceIcon } from "./getServiceIcon";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ service, style }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Handle image loading errors
  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
  };

  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Render star ratings
  const renderRating = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating) ? "text-yellow-400" : "text-gray-600"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-400">({service.reviews})</span>
      </div>
    );
  };

  return (
    <div
      className="group bg-[var(--secondary)] rounded-2xl overflow-hidden flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 border border-[var(--accent)]/10 hover:border-[var(--accent)]/30 transform hover:-translate-y-2 animate-fade-in-up"
      style={style}
    >
      {/* Service image with fallback */}
      {service.imageUrl && imageLoaded && !imageError ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={service.imageUrl}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={handleImageError}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--secondary)] to-transparent opacity-70"></div>

          {/* Popular badge */}
          {service.isPopular && (
            <div className="absolute top-4 left-4 bg-[var(--accent)] text-black text-xs font-bold px-2 py-1 rounded-full">
              Popular
            </div>
          )}

          {/* Duration badge */}
          <div className="absolute top-4 right-4 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full">
            {service.duration} min
          </div>
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]/20 flex items-center justify-center">
          <div className="text-5xl text-[var(--accent)] opacity-80">
            {getServiceIcon(service.name)}
          </div>
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        {/* Service header with name and rating */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-[var(--accent)] transition-colors">
            {service.name}
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {formatPrice(service.price)}
            </div>
            <div className="text-xs text-gray-400">starting from</div>
          </div>
        </div>

        {/* Rating */}
        {service.rating && (
          <div className="mb-4">{renderRating(service.rating)}</div>
        )}

        {/* Description */}
        <p className="text-gray-400 mb-4 text-sm line-clamp-3">
          {service.description}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-5">
          {service.categories?.map((category, index) => (
            <span
              key={index}
              className="px-2.5 py-1 bg-[var(--primary)] text-xs text-gray-300 rounded-full border border-[var(--accent)]/20"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Features */}
        {service.features && service.features.length > 0 && (
          <div className="mb-5">
            <h4 className="text-sm font-medium text-white mb-2">Includes:</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              {service.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-4 h-4 text-[var(--accent)] mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottom section with button */}
        <div className="mt-auto pt-4 border-t border-gray-800">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              {service.appointmentsToday}+ bookings today
            </div>
            <button
              className="px-4 py-2 rounded-lg bg-[var(--accent)] text-black text-sm font-semibold hover:bg-[var(--accent)]/90 transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
              onClick={() =>
                navigate(`/customer/service/${encodeURIComponent(service._id)}`)
              }
            >
              <span>Book Now</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
