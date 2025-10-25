import React, { useState } from "react";
import { getServiceIcon } from "../getServiceIcon";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ service, style }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Handle image loading errors
  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
  };

  // Format price with currency
  const formatPrice = (priceRange) => {
    if (!priceRange) return "Price not set";

    // Handle price ranges like "₹500-800"
    if (priceRange.includes("-")) {
      const [min, max] = priceRange.replace("₹", "").split("-");
      return `₹${min} - ₹${max}`;
    }

    // Handle single price
    return priceRange;
  };

  // Render star ratings with improved visual
  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-1">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${
                i < fullStars
                  ? "text-yellow-400 fill-current"
                  : hasHalfStar && i === fullStars
                  ? "text-yellow-400 fill-current"
                  : "text-gray-600 fill-gray-600"
              }`}
              viewBox="0 0 20 20"
            >
              {i < fullStars || (hasHalfStar && i === fullStars) ? (
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              ) : (
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              )}
            </svg>
          ))}
        </div>
        <span className="text-sm text-gray-400 ml-1">
          {rating?.toFixed(1) || "0.0"}
        </span>
        {service.reviews && (
          <span className="text-sm text-gray-500">
            ({service.reviews.toLocaleString()})
          </span>
        )}
      </div>
    );
  };

  // Get gradient based on service category
  const getCategoryGradient = (categories) => {
    const gradients = {
      Home: "from-blue-500 to-cyan-500",
      Woodwork: "from-amber-600 to-orange-500",
      Maintenance: "from-green-500 to-emerald-500",
      Electrical: "from-purple-500 to-pink-500",
      Plumbing: "from-sky-500 to-blue-600",
      default: "from-gray-600 to-gray-700",
    };

    const mainCategory = categories?.[0];
    return gradients[mainCategory] || gradients.default;
  };

  return (
    <div
      className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl overflow-hidden flex flex-col h-full shadow-2xl hover:shadow-2xl transition-all duration-500 border border-gray-700/50 hover:border-blue-500/30 transform hover:-translate-y-3 relative"
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          isHovered ? "animate-pulse" : ""
        }`}
      ></div>

      {/* Service image with enhanced fallback */}
      {service.imageUrl && imageLoaded && !imageError ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={service.imageUrl}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={handleImageError}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>

          {/* Popular badge with animation */}
          {service.isPopular && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300 flex items-center gap-1">
              <span className="text-xs">🔥</span>
              Popular
            </div>
          )}

          {/* Duration badge */}
          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20">
            ⏱️ {service.duration || 30} min
          </div>

          {/* Category badge */}
          {service.categories?.[0] && (
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/10">
              {service.categories[0]}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`h-48 bg-gradient-to-br ${getCategoryGradient(
            service.categories
          )} flex items-center justify-center relative overflow-hidden`}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="text-6xl text-white opacity-90 transform group-hover:scale-110 transition-transform duration-500 relative z-10">
            {getServiceIcon(service.name)}
          </div>
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow relative z-10">
        {/* Service header with enhanced layout */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300 truncate">
              {service.name}
            </h3>
            {service.rating && (
              <div className="mt-2">{renderRating(service.rating)}</div>
            )}
          </div>

          {/* <div className="text-right ml-4">
            <div className="font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              {formatPrice(service.priceRange)}
            </div>
            <div className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full mt-1">
              starting from
            </div>
          </div> */}
        </div>

        {/* Description with smooth hover effect */}
        <div className="mb-4 relative">
          <p className="text-gray-400 text-sm leading-relaxed transition-all duration-300 group-hover:text-gray-300 line-clamp-3">
            {service.description}
          </p>
          <div className="absolute bottom-0 right-0 w-8 h-6 bg-gradient-to-l from-gray-800/80 to-transparent group-hover:from-gray-900/80 transition-colors duration-300"></div>
        </div>

        {/* Enhanced categories with color coding */}
        <div className="flex flex-wrap gap-2 mb-5">
          {service.categories?.map((category, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-gray-700/60 backdrop-blur-sm text-xs text-gray-300 rounded-full border border-gray-600/50 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105 cursor-default"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Enhanced features section */}
        {service.features && service.features.length > 0 && (
          <div className="mb-5 bg-gray-800/30 rounded-2xl p-4 border border-gray-700/50">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-blue-400">✨</span>
              What's Included:
            </h4>
            <ul className="text-xs text-gray-400 space-y-2">
              {service.features.slice(0, 3).map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start group/feature hover:text-white transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0 transform group-hover/feature:scale-110 transition-transform duration-200"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
            {service.features.length > 3 && (
              <div className="text-xs text-gray-500 mt-2 text-center">
                +{service.features.length - 3} more features
              </div>
            )}
          </div>
        )}

        {/* Enhanced bottom section */}
        <div className="mt-auto pt-4 border-t border-gray-700/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>{service.appointmentsToday || 12}+ bookings today</span>
            </div>
            <button
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 group/btn relative overflow-hidden"
              onClick={() =>
                navigate(`/customer/service/${encodeURIComponent(service._id)}`)
              }
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>

              <span>Book Now</span>
              <svg
                className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Status indicator */}
      {!service.isActive && (
        <div className="absolute top-6 right-6 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full border border-red-300/50">
          Unavailable
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
