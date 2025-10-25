import React from "react";
import Avatar from "react-avatar";
import {
  FaStar,
  FaEnvelope,
  FaCalendarAlt,
  FaTimes,
  FaMapMarkerAlt,
  FaTools,
  FaBriefcase,
  FaDollarSign,
  FaCar,
  FaHeart,
  FaIdCard,
  FaShieldAlt as FaShield,
  FaClock,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import { IoMdFitness } from "react-icons/io";

const WorkerInfoModal = ({ worker, open, onClose }) => {
  if (!open || worker == null) return null;

  // Helper functions
  const getAverageRating = (ratings) => {
    if (!Array.isArray(ratings) || ratings.length === 0) return "0.0";
    const total = ratings.reduce((sum, r) => sum + (r.rating || 0), 0);
    return (total / ratings.length).toFixed(1);
  };

  const formatAddress = (address) => {
    if (typeof address === "string") return address;
    if (address?.street) return address.street;
    return "Address not specified";
  };

  // Fallback values
  const name = worker.user?.name || worker.name || "N/A";
  const email = worker.user?.email || worker.email || "N/A";
  const phone = worker.user?.phone || worker.phone || "N/A";
  const isActive = worker.user?.isActive;
  const status = worker.verified
    ? "Verified"
    : isActive
    ? "Active"
    : "Inactive";

  // Status colors
  const statusColors = {
    Verified: "bg-green-900 text-green-300",
    Active: "bg-blue-900 text-blue-300",
    Inactive: "bg-gray-700 text-gray-300",
    default: "bg-yellow-900 text-yellow-300",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto relative animate-scale-in">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-600/50 rounded-full p-2 transition-all duration-200 z-10"
          onClick={onClose}
        >
          <FaTimes size={18} />
        </button>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 pb-4 border-b border-gray-700">
          <div className="relative">
            <Avatar
              name={name}
              size="80"
              round
              color="#06b6d4"
              fgColor="#fff"
            />
            <div className="absolute -bottom-1 -right-1 bg-cyan-500 rounded-full p-1 border-2 border-gray-800">
              <FaUser size={12} className="text-white" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-bold text-white text-xl mb-1">{name}</h2>
            <p className="text-gray-300 text-sm flex items-center justify-center sm:justify-start gap-2 mb-2">
              <FaEnvelope className="text-cyan-400" />
              {email}
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  statusColors[status] || statusColors.default
                }`}
              >
                {status}
              </span>
              {worker.verified && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-900 text-purple-300 flex items-center gap-1">
                  <FaShield size={10} /> Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-700/50 rounded-lg p-3 text-center hover:bg-gray-600/50 transition-colors">
            <div className="text-cyan-400 text-sm font-semibold mb-1">
              Experience
            </div>
            <div className="text-white font-bold text-lg">
              {worker.experience || 0} years
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 text-center hover:bg-gray-600/50 transition-colors">
            <div className="text-cyan-400 text-sm font-semibold mb-1">
              Rating
            </div>
            <div className="text-white font-bold text-lg flex items-center justify-center gap-1">
              <FaStar className="text-yellow-400" />
              {getAverageRating(worker.ratings)}
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 text-center hover:bg-gray-600/50 transition-colors">
            <div className="text-cyan-400 text-sm font-semibold mb-1">
              Daily Rate
            </div>
            <div className="text-white font-bold text-lg flex items-center justify-center gap-1">
              <FaDollarSign className="text-green-400" />
              {worker.dailyRate || "N/A"}
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 text-center hover:bg-gray-600/50 transition-colors">
            <div className="text-cyan-400 text-sm font-semibold mb-1">
              Joined
            </div>
            <div className="text-white font-bold text-sm">
              {worker.createdAt
                ? new Date(worker.createdAt).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Skills Section */}
            <div className="bg-gray-700/30 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <FaTools className="text-cyan-400" />
                Skills & Services
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400 text-sm">Primary:</span>
                  <div className="text-white text-sm font-medium mt-1 bg-cyan-900/30 px-3 py-1 rounded">
                    {worker.primarySkill || "Not specified"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Custom Skills:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {worker.customSkills?.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-cyan-900 text-cyan-300 px-2 py-1 rounded-full text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    )) || <span className="text-gray-500 text-xs">None</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Section */}
            <div className="bg-gray-700/30 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <FaClock className="text-green-400" />
                Availability
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400 text-sm">Work Days:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {worker.workDays?.map((day, i) => (
                      <span
                        key={i}
                        className="bg-green-900/30 text-green-300 px-2 py-1 rounded text-xs"
                      >
                        {day}
                      </span>
                    )) || (
                      <span className="text-gray-500 text-xs">
                        Not specified
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Shifts:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {worker.availableShifts?.map((shift, i) => (
                      <span
                        key={i}
                        className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-xs"
                      >
                        {shift}
                      </span>
                    )) || (
                      <span className="text-gray-500 text-xs">
                        Not specified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Location & Transport */}
            <div className="bg-gray-700/30 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-400" />
                Location & Transport
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Address:</span>
                  <span className="text-white">
                    {formatAddress(worker.address)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Transport:</span>
                  <span className="text-white flex items-center gap-1">
                    <FaCar className="text-orange-400" />
                    {worker.transportMode || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Travel Range:</span>
                  <span className="text-white">
                    {worker.distanceWillingToTravel || 0} km
                  </span>
                </div>
              </div>
            </div>

            {/* Health & Safety */}
            <div className="bg-gray-700/30 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <IoMdFitness className="text-purple-400" />
                Health & Safety
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Health Status:</span>
                  <span className="text-white">
                    {worker.healthStatus || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Max Hours/Day:</span>
                  <span className="text-white">
                    {worker.maxHoursPerDay || "N/A"}
                  </span>
                </div>
                {worker.emergencyContacts?.[0] && (
                  <div className="text-sm">
                    <span className="text-gray-400">Emergency Contact:</span>
                    <div className="text-white mt-1">
                      {worker.emergencyContacts[0].name} (
                      {worker.emergencyContacts[0].relation})
                      <div className="text-cyan-400 flex items-center gap-1">
                        <FaPhone size={10} />
                        {worker.emergencyContacts[0].phone}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700">
          <button
            className="flex-1 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={worker.verified}
          >
            <FaShield />
            Approve Worker
          </button>
          <button
            className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={!worker.verified}
          >
            <FaTimes />
            Reject Worker
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerInfoModal;
