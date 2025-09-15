import React from "react";
import {
  FaStar,
  FaMapMarkerAlt,
  FaBriefcase,
  FaUserCircle,
} from "react-icons/fa"; // Added icons for more visual context

const WorkerCard = ({ worker, onBook, onNavigate }) => {
  // Destructure worker properties with default values for robustness
  const {
    user = {},
    skills = [],
    experience = 0,
    availability = false,
    rating = 0, // Assume a rating property exists, default to 0
    location = "N/A", // Assume a location property
    profilePic = null, // Assume a profile picture URL
  } = worker;

  const workerName = user.name || "Unnamed Worker";
  const displaySkills =
    Array.isArray(skills) && skills.length > 0
      ? skills.slice(0, 3).join(", ") + (skills.length > 3 ? "..." : "") // Show max 3 skills
      : "No skills listed";

  return (
    <div
      className="bg-secondary rounded-2xl p-6 shadow-xl flex flex-col items-center text-center gap-4 transition-all duration-300 ease-in-out
                 hover:bg-card hover:shadow-2xl hover:scale-103 cursor-pointer group" // Added group for advanced hover effects
      onClick={onNavigate}
    >
      {/* Profile Picture */}
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-accent-dark group-hover:border-accent transition-colors duration-300">
        {profilePic ? (
          <img
            src={profilePic}
            alt={`${workerName}'s profile`}
            className="w-full h-full object-cover"
          />
        ) : (
          <FaUserCircle className="w-full h-full text-gray-500 bg-gray-700 p-1" />
        )}
        {/* Availability Indicator */}
        <span
          className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-secondary
                      ${
                        availability ? "bg-green-500" : "bg-red-500"
                      } transform translate-x-1 translate-y-1`}
          title={availability ? "Available" : "Unavailable"}
        ></span>
      </div>

      {/* Worker Name */}
      <h3 className="font-bold text-xl text-white group-hover:text-teal-400 transition-colors duration-300">
        {workerName}
      </h3>

      {/* Rating */}
      <div className="flex items-center text-yellow-400 text-sm">
        <FaStar className="mr-1" />
        <span>{rating > 0 ? rating.toFixed(1) : "N/A"}</span>
        {rating > 0 && (
          <span className="text-gray-400 ml-1">
            ({(Math.random() * 100).toFixed(0)} reviews)
          </span>
        )}{" "}
        {/* Dummy review count */}
      </div>

      {/* Skills */}
      <div className="flex items-center justify-center text-gray-300 text-sm italic">
        <FaBriefcase className="mr-2 text-teal-400" />
        <span className="font-medium">{displaySkills}</span>
      </div>

      {/* Experience & Location */}
      <div className="flex justify-around w-full text-gray-400 text-sm mt-2">
        <div className="flex items-center">
          <span className="font-semibold text-white mr-1">
            {experience ?? 0}
          </span>{" "}
          yrs Exp.
        </div>
        <div className="flex items-center">
          <FaMapMarkerAlt className="mr-1 text-blue-400" />
          {location}
        </div>
      </div>

      {/* Book Button */}
      <button
        className={`mt-6 w-full px-4 py-3 font-semibold rounded-xl text-lg transition-all duration-300 ease-in-out
    ${
      availability
        ? "bg-teal-500 text-gray-900 hover:bg-teal-400 hover:shadow-md"
        : "bg-gray-600 text-gray-300 cursor-not-allowed opacity-70"
    }`}
        onClick={(e) => {
          e.stopPropagation(); // Prevent card's onClick from firing
          if (availability) onBook(worker.id); // Pass worker ID to onBook
        }}
        disabled={!availability}
      >
        {availability ? "Book Now" : "Unavailable"}
      </button>
    </div>
  );
};

export default WorkerCard;
