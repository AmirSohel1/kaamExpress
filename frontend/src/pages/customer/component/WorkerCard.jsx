import React, { useState } from "react";
import {
  FaStar,
  FaMapMarkerAlt,
  FaBriefcase,
  FaUserCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaRupeeSign,
  FaCar,
  FaInfoCircle,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";

const WorkerCard = ({ worker, onBook, onNavigate }) => {
  const {
    user = {},
    customSkills = [],
    primarySkill = "",
    experience = 0,
    availability = false,
    ratings = [],
    address = "N/A",
    dailyRate = 0,
    availableShifts = [],
    workDays = [],
    transportMode = "N/A",
    verified = false,
    profilePic = null,
  } = worker;

  const [imageError, setImageError] = useState(false);

  const workerName = user.name || "Unnamed Worker";
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + (r.stars || 0), 0) / ratings.length
      : 0;

  // Calculate rating percentages for visual display
  const ratingPercent = (avgRating / 5) * 100;

  // Format skills for display
  const displaySkills = primarySkill || customSkills.slice(0, 3).join(", ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl flex flex-col gap-5
                 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 cursor-pointer group border border-gray-700"
      onClick={onNavigate}
    >
      {/* Premium/Verified Badge */}
      {verified && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10 flex items-center gap-1">
          <FaCheckCircle size={10} /> VERIFIED
        </div>
      )}

      {/* Availability Badge */}
      <div
        className={`absolute -top-2 left-4 text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10 ${
          availability ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}
      >
        {availability ? "AVAILABLE" : "UNAVAILABLE"}
      </div>

      <div className="flex flex-col items-center text-center gap-4">
        {/* Profile Picture */}
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-transparent group-hover:border-blue-500 transition-all duration-300 p-1 bg-gradient-to-r from-blue-400 to-purple-500">
          {profilePic && !imageError ? (
            <img
              src={profilePic}
              alt={`${workerName}'s profile`}
              className="w-full h-full object-cover rounded-full"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center">
              <FaUserCircle className="w-16 h-16 text-gray-500" />
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="font-bold text-xl text-white mt-2 flex items-center gap-2">
          {workerName}
          {verified ? (
            <FaCheckCircle className="text-blue-400" title="Verified Worker" />
          ) : (
            <FaTimesCircle className="text-gray-500" title="Not Verified" />
          )}
        </h3>

        {/* Rating with visual meter */}
        <div className="w-full">
          <div className="flex items-center justify-center text-yellow-400 text-sm mb-1">
            <FaStar className="mr-1" />
            <span className="font-semibold">
              {avgRating > 0 ? avgRating.toFixed(1) : "No ratings"}
            </span>
            {ratings.length > 0 && (
              <span className="text-gray-400 ml-1">({ratings.length})</span>
            )}
          </div>

          {/* Rating visualization */}
          {avgRating > 0 && (
            <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
              <div
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full"
                style={{ width: `${ratingPercent}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Skills with tooltip for more */}
        <div className="relative flex items-center justify-center text-gray-300 text-sm">
          <FaBriefcase className="mr-2 text-blue-400" />
          <span className="truncate max-w-[180px]" title={displaySkills}>
            {displaySkills || "No skills listed"}
          </span>
          {customSkills.length > 3 && (
            <div className="group/tooltip relative">
              <FaInfoCircle className="ml-1 text-gray-500 cursor-help" />
              <div className="absolute hidden group-hover/tooltip:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-xs text-white rounded shadow-lg z-10">
                <p className="font-semibold">All Skills:</p>
                <p>{customSkills.join(", ")}</p>
              </div>
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 w-full text-sm mt-2">
          {/* Experience */}
          <div className="bg-gray-700 bg-opacity-50 rounded-lg p-2 flex flex-col items-center">
            <div className="text-blue-400 font-semibold">{experience}+</div>
            <div className="text-gray-400 text-xs">Years</div>
          </div>

          {/* Daily Rate */}
          <div className="bg-gray-700 bg-opacity-50 rounded-lg p-2 flex flex-col items-center">
            <div className="flex items-center text-green-400 font-semibold">
              <FaRupeeSign size={10} className="mr-1" />
              {dailyRate}
            </div>
            <div className="text-gray-400 text-xs">Per day</div>
          </div>

          {/* Location */}
          <div className="bg-gray-700 bg-opacity-50 rounded-lg p-2 flex flex-col items-center col-span-2">
            <div className="flex items-center text-gray-300 text-xs">
              <FaMapMarkerAlt className="mr-1 text-red-400" />
              <span className="truncate max-w-[140px]">
                {worker.workingAvailableAddress?.city || address}
              </span>
            </div>
          </div>
        </div>

        {/* Shifts & Days */}
        <div className="text-gray-400 text-xs flex flex-col gap-1 w-full">
          <div className="flex items-center justify-center">
            <FaClock className="mr-1 text-blue-400" />
            <span>{availableShifts.join(", ") || "Flexible shifts"}</span>
          </div>
          <div className="text-gray-500 text-xs">
            {workDays.join(", ") || "Flexible days"}
          </div>
        </div>

        {/* Transport */}
        <div className="flex items-center text-gray-400 text-xs">
          <FaCar className="mr-1 text-teal-400" />
          {transportMode}
        </div>
      </div>

      {/* View Profile Button */}
      <div className="flex items-center justify-between mt-4 text-xs text-blue-400">
        <button
          className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate();
          }}
        >
          View full profile <FaArrowRight className="ml-1" />
        </button>
      </div>

      {/* Book Button */}
      <motion.button
        whileHover={{ scale: availability ? 1.03 : 1 }}
        whileTap={{ scale: availability ? 0.98 : 1 }}
        className={`mt-4 w-full px-4 py-3 font-semibold rounded-xl text-white transition-all duration-300
          flex items-center justify-center gap-2 ${
            availability
              ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        onClick={(e) => {
          e.stopPropagation();
          if (availability) onBook();
        }}
        disabled={!availability}
      >
        {availability ? (
          <>
            <span>Book Now</span>
            <FaArrowRight />
          </>
        ) : (
          "Currently Unavailable"
        )}
      </motion.button>
    </motion.div>
  );
};

export default WorkerCard;
