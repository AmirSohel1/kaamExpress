// src/pages/customer/WorkerProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWorkerProfilePublic } from "../../api/workers";
import {
  StarIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  TruckIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";

const WorkerProfile = () => {
  const { workerId } = useParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const data = await fetchWorkerProfilePublic(workerId);
        setWorker(data);
      } catch (err) {
        setError("Failed to load worker profile");
      } finally {
        setLoading(false);
      }
    };
    fetchWorker();
  }, [workerId]);

  const calculateAverageRating = () => {
    if (!worker.ratings || worker.ratings.length === 0) return 0;
    const sum = worker.ratings.reduce((acc, rating) => acc + rating.stars, 0);
    return (sum / worker.ratings.length).toFixed(1);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading profile...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-xl shadow-lg">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-[var(--accent)] text-gray-900 font-medium rounded-lg hover:bg-[var(--accent-dark)] transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  if (!worker) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-12">
      {/* Header with back button */}
      <div className="container mx-auto px-4 py-6">
        <button
          className="flex items-center text-[var(--accent)] font-medium hover:text-[var(--accent-dark)] transition mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>
      </div>

      <div className="container mx-auto px-4">
        {/* Profile Card */}
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8 animate-fade-in-up">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 sm:p-8 relative">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {worker.user?.name?.charAt(0) || "W"}
              </div>

              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {worker.user?.name}
                </h1>
                <p className="text-gray-400 mb-3">{worker.user?.email}</p>

                <div className="flex flex-wrap items-center gap-4">
                  {worker.ratings && worker.ratings.length > 0 && (
                    <div className="flex items-center bg-gray-700 px-3 py-1 rounded-full">
                      <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                      <span className="text-white font-medium">
                        {calculateAverageRating()}
                      </span>
                      <span className="text-gray-400 ml-1">
                        ({worker.ratings.length})
                      </span>
                    </div>
                  )}

                  <div className="flex items-center text-gray-300">
                    <BriefcaseIcon className="h-5 w-5 text-[var(--accent)] mr-1" />
                    <span>{worker.experience} years experience</span>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <CurrencyRupeeIcon className="h-5 w-5 text-[var(--accent)] mr-1" />
                    <span>₹{worker.dailyRate}/day</span>
                  </div>
                </div>
              </div>

              <div className="self-center mt-4 sm:mt-0">
                <button
                  className="px-6 py-3 bg-[var(--accent)] text-gray-900 font-semibold rounded-lg hover:bg-[var(--accent-dark)] transition shadow-md flex items-center"
                  onClick={() => navigate(`/customer/book/${worker._id}`)}
                >
                  <BriefcaseIcon className="h-5 w-5 mr-2" />
                  Book Now
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Skills & Services */}
              <div className="bg-gray-700 p-5 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-600 flex items-center">
                  <BriefcaseIcon className="h-5 w-5 text-[var(--accent)] mr-2" />
                  Skills & Services
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {worker.primarySkill && (
                    <div>
                      <p className="text-gray-400 text-sm">Primary Skill</p>
                      <p className="text-white font-medium">
                        {worker.primarySkill}
                      </p>
                    </div>
                  )}

                  {worker.secondarySkills &&
                    worker.secondarySkills.length > 0 && (
                      <div>
                        <p className="text-gray-400 text-sm">
                          Secondary Skills
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {worker.secondarySkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {worker.customSkills && worker.customSkills.length > 0 && (
                    <div className="sm:col-span-2">
                      <p className="text-gray-400 text-sm">Additional Skills</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {worker.customSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {worker.services && worker.services.length > 0 && (
                    <div className="sm:col-span-2">
                      <p className="text-gray-400 text-sm">Services Offered</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {worker.services.map((service, idx) => (
                          <span
                            key={idx}
                            className="bg-[var(--accent)] bg-opacity-20 text-[var(--accent)] px-3 py-1 rounded-full text-sm"
                          >
                            {service.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div className="bg-gray-700 p-5 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-600 flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 text-[var(--accent)] mr-2" />
                  Availability
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Work Days</p>
                    <p className="text-white">
                      {worker.workDays?.length > 0
                        ? worker.workDays.join(", ")
                        : "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Shifts</p>
                    <p className="text-white">
                      {worker.availableShifts?.length > 0
                        ? worker.availableShifts.join(", ")
                        : "Not specified"}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-gray-400 text-sm">Current Status</p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        worker.availability
                          ? "bg-green-900 text-green-300"
                          : "bg-red-900 text-red-300"
                      }`}
                    >
                      {worker.availability
                        ? "Available for work"
                        : "Not currently available"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              {worker.certifications?.length > 0 && (
                <div className="bg-gray-700 p-5 rounded-xl shadow-sm">
                  <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-600 flex items-center">
                    <AcademicCapIcon className="h-5 w-5 text-[var(--accent)] mr-2" />
                    Certifications
                  </h2>

                  <div className="space-y-4">
                    {worker.certifications.map((c, idx) => (
                      <div key={idx} className="bg-gray-600 p-4 rounded-lg">
                        <h3 className="text-white font-medium">{c.name}</h3>
                        <p className="text-gray-400 text-sm">
                          Issued by {c.issuedBy} in {c.year}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Location */}
              <div className="bg-gray-700 p-5 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-600 flex items-center">
                  <MapPinIcon className="h-5 w-5 text-[var(--accent)] mr-2" />
                  Location & Travel
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Work Area</p>
                    <p className="text-white">
                      {worker.workingAvailableAddress?.street &&
                        `${worker.workingAvailableAddress.street}, `}
                      {worker.workingAvailableAddress?.city &&
                        `${worker.workingAvailableAddress.city}, `}
                      {worker.workingAvailableAddress?.state &&
                        `${worker.workingAvailableAddress.state}, `}
                      {worker.workingAvailableAddress?.zip &&
                        `${worker.workingAvailableAddress.zip}`}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Travel Distance</p>
                      <p className="text-white flex items-center">
                        <TruckIcon className="h-5 w-5 text-[var(--accent)] mr-1" />
                        Up to {worker.distanceWillingToTravel} km
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm">Transport Mode</p>
                      <p className="text-white">{worker.transportMode}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Previous Jobs */}
              {worker.previousJobs?.length > 0 && (
                <div className="bg-gray-700 p-5 rounded-xl shadow-sm">
                  <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-600 flex items-center">
                    <BriefcaseIcon className="h-5 w-5 text-[var(--accent)] mr-2" />
                    Work Experience
                  </h2>

                  <div className="space-y-4">
                    {worker.previousJobs.map((job, idx) => (
                      <div key={idx} className="bg-gray-600 p-4 rounded-lg">
                        <h3 className="text-white font-medium">
                          {job.role} at {job.company}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2">
                          {job.duration}
                        </p>
                        <p className="text-gray-300">{job.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ratings & Reviews */}
              <div className="bg-gray-700 p-5 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-600 flex items-center">
                  <StarIcon className="h-5 w-5 text-[var(--accent)] mr-2" />
                  Ratings & Reviews
                </h2>

                <div className="space-y-4">
                  {worker.ratings && worker.ratings.length > 0 ? (
                    worker.ratings.map((r, idx) => (
                      <div key={idx} className="bg-gray-600 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, starIdx) => (
                              <StarIcon
                                key={starIdx}
                                className={`h-5 w-5 ${
                                  starIdx < r.stars
                                    ? "text-yellow-400"
                                    : "text-gray-500"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-white font-medium">
                            {r.stars}.0
                          </span>
                        </div>
                        <p className="text-gray-300 mb-2">{r.comment}</p>
                        <p className="text-gray-400 text-sm">
                          - {r.customer?.name || "Anonymous Customer"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No ratings yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
