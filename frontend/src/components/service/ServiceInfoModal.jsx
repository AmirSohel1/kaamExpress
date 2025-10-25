import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaEye,
  FaTimes,
  FaStar,
  FaClock,
  FaCheck,
  FaMapMarkerAlt,
  FaPhone,
  FaCalendarAlt,
  FaShare,
  FaHeart,
} from "react-icons/fa";
import { getServiceIcon } from "../getServiceIcon";

const ServiceInfoModal = ({ service, open, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Animation handling
  useEffect(() => {
    if (open) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      document.body.style.overflow = "unset";
    }
  }, [open]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && handleClose();
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
  };

  const renderRatingStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? "text-yellow-400 fill-current"
                : "text-gray-600 fill-gray-600"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-300">
          {rating?.toFixed(1) || "0.0"}
        </span>
      </div>
    );
  };

  const formatPrice = (priceRange) => {
    if (!priceRange) return "Price not set";
    return priceRange.includes("-") ? priceRange : `₹${priceRange}`;
  };

  if (!open && !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible
          ? "bg-black/70 backdrop-blur-md animate-fade-in"
          : "bg-black/0 backdrop-blur-0 animate-fade-out"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
      onClick={handleClose}
    >
      <div
        className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl border border-gray-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0 animate-scale-in"
            : "scale-95 opacity-0 translate-y-4 animate-scale-out"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-48 sm:h-56 overflow-hidden">
          {service.imageUrl && imageLoaded && !imageError ? (
            <>
              <img
                src={service.imageUrl}
                alt={service.name}
                className="w-full h-full object-cover transition-transform duration-700"
                onError={handleImageError}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
              <div className="text-6xl text-white opacity-80">
                {getServiceIcon(service.name)}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                isLiked
                  ? "bg-red-500/20 border-red-500/50 text-red-400"
                  : "bg-black/40 border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400"
              }`}
            >
              <FaHeart className={isLiked ? "fill-current" : ""} />
            </button>
            <button className="p-3 rounded-2xl backdrop-blur-sm bg-black/40 border border-white/20 text-white hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300">
              <FaShare />
            </button>
            <button
              onClick={handleClose}
              className="p-3 rounded-2xl backdrop-blur-sm bg-black/40 border border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all duration-300"
            >
              <FaTimes />
            </button>
          </div>

          {/* Service status badge */}
          <div className="absolute bottom-4 left-4">
            <span
              className={`px-4 py-2 rounded-2xl text-sm font-semibold backdrop-blur-sm border ${
                service.isActive
                  ? "bg-green-500/20 text-green-300 border-green-500/50"
                  : "bg-yellow-500/20 text-yellow-300 border-yellow-500/50"
              }`}
            >
              {service.isActive ? "Available Now" : "Temporarily Unavailable"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1
                id="service-modal-title"
                className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2"
              >
                {service.name}
              </h1>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                {service.description ||
                  "Professional service with quality guaranteed"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                {formatPrice(service.priceRange)}
              </div>
              <div className="text-xs text-gray-400 mt-1">starting price</div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 bg-gray-800/30 rounded-2xl border border-gray-700/50">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-blue-400 mb-1">
                <FaUsers className="text-sm" />
                <span className="text-lg font-bold">
                  {service.workers || 5}+
                </span>
              </div>
              <div className="text-xs text-gray-400">Expert Workers</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
                <FaCheck className="text-sm" />
                <span className="text-lg font-bold">
                  {service.completedJobs || 120}+
                </span>
              </div>
              <div className="text-xs text-gray-400">Jobs Done</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-yellow-400 mb-1">
                <FaStar className="text-sm" />
                <span className="text-lg font-bold">
                  {service.rating || 4.5}
                </span>
              </div>
              <div className="text-xs text-gray-400">Rating</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-purple-400 mb-1">
                <FaClock className="text-sm" />
                <span className="text-lg font-bold">
                  {service.duration || 30}
                </span>
              </div>
              <div className="text-xs text-gray-400">Minutes</div>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <span className="text-blue-400">🏷️</span>
              Service Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.categories?.map((category, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-700/50 backdrop-blur-sm text-gray-300 text-sm rounded-xl border border-gray-600/50 hover:border-blue-400/50 transition-all duration-300 cursor-default"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          {service.features && service.features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <span className="text-green-400">✨</span>
                What's Included
              </h3>
              <div className="space-y-2">
                {service.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:border-green-400/30 transition-all duration-200 group"
                  >
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                      <FaCheck className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-gray-300 text-sm group-hover:text-white transition-colors duration-200">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl border border-gray-700/30">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <FaMapMarkerAlt className="text-blue-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Service Area</div>
                <div className="text-sm text-white">Within 15km radius</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl border border-gray-700/30">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <FaCalendarAlt className="text-purple-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Availability</div>
                <div className="text-sm text-white">Mon - Sun, 8AM - 8PM</div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700/50">
            <button className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3 group">
              <FaCalendarAlt />
              <span>Book Appointment</span>
            </button>
            <button className="flex-1 px-6 py-4 bg-gray-700/50 backdrop-blur-sm text-white font-semibold rounded-2xl border border-gray-600 hover:border-gray-500 transition-all duration-300 hover:bg-gray-600/50 flex items-center justify-center gap-3 group">
              <FaPhone />
              <span>Contact Now</span>
            </button>
          </div>

          {/* Quick info footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              ⚡ {service.appointmentsToday || 8} people booked this service
              today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfoModal;
