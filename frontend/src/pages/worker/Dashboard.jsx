import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaDollarSign,
  FaBriefcase,
  FaCheck,
  FaStar,
  FaUser,
  FaDownload,
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaExclamationTriangle,
  FaSpinner,
  FaMapMarkerAlt,
  FaTools,
  FaCertificate,
  FaMedal,
  FaIdCard,
  FaCar,
} from "react-icons/fa";
import { format, parseISO, isToday, isAfter } from "date-fns";
import { getWorkerProfile } from "../../api/workerProfile";
import { getWorkerJobs } from "../../api/workerJobs";
import { getWorkerEarnings } from "../../api/workerEarnings";
import { getWorkerRatings } from "../../api/workerRatings";

const StatCard = ({ icon, value, label, trend, loading, currency = "₹" }) => {
  const getIcon = () => {
    switch (icon) {
      case "dollar":
        return <FaDollarSign className="text-green-500 text-xl" />;
      case "briefcase":
        return <FaBriefcase className="text-blue-500 text-xl" />;
      case "check":
        return <FaCheck className="text-yellow-500 text-xl" />;
      case "star":
        return <FaStar className="text-pink-500 text-xl" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    if (!trend) return "text-gray-400";
    return trend > 0 ? "text-green-500" : "text-red-500";
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend > 0 ? "↗" : "↘";
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 flex items-start gap-4 shadow-lg border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group">
      <div className="p-3 bg-gray-700/50 rounded-lg flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        {loading ? (
          <div className="h-7 bg-gray-700 rounded animate-pulse mb-2"></div>
        ) : (
          <div className="text-2xl font-bold text-white truncate">
            {icon === "dollar" ? `${currency}${value.toLocaleString()}` : value}
          </div>
        )}
        {loading ? (
          <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
        ) : (
          <div className="text-gray-400 text-sm font-medium truncate">
            {label}
          </div>
        )}
        {trend !== undefined && !loading && (
          <div
            className={`text-xs mt-2 flex items-center gap-1 ${getTrendColor()}`}
          >
            <span>{getTrendIcon()}</span>
            <span>{Math.abs(trend)}% from last week</span>
          </div>
        )}
      </div>
    </div>
  );
};

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getWorkerProfile(),
      getWorkerJobs(),
      getWorkerEarnings(),
      getWorkerRatings(),
    ])
      .then(([profileData, jobsData, earningsData, ratingsData]) => {
        setProfile(profileData);
        setJobs(jobsData);
        setEarnings(earningsData);
        setRatings(ratingsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard loading error:", err);
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      });
  }, []);

  // Calculate stats with trends (simulated)
  const stats = useMemo(() => {
    const totalEarnings = earnings.reduce((sum, e) => sum + (e.amount || 0), 0);
    const completedJobs = jobs.filter(
      (j) => j.status?.toLowerCase() === "completed"
    ).length;
    const pendingJobs = jobs.filter(
      (j) =>
        j.status?.toLowerCase() === "pending" ||
        j.status?.toLowerCase() === "in-progress"
    ).length;

    const ratingValues = ratings.map((r) => r.stars || 0);
    const avgRating = ratingValues.length
      ? (
          ratingValues.reduce((sum, r) => sum + r, 0) / ratingValues.length
        ).toFixed(1)
      : 0;

    // Simulate trends (in a real app, you'd compare with previous period data)
    const trends = {
      earnings: 12, // +12%
      jobs: 5, // +5%
      completed: 8, // +8%
      rating: -2, // -2%
    };

    return [
      {
        icon: "dollar",
        value: totalEarnings,
        label: "Total Earnings",
        trend: trends.earnings,
      },
      {
        icon: "briefcase",
        value: jobs.length,
        label: "Total Jobs",
        trend: trends.jobs,
      },
      {
        icon: "check",
        value: completedJobs,
        label: "Completed Jobs",
        trend: trends.completed,
      },
      {
        icon: "star",
        value: avgRating,
        label: "Avg. Rating",
        trend: trends.rating,
      },
    ];
  }, [jobs, earnings, ratings]);

  // Filter jobs based on active tab
  const filteredJobs = useMemo(() => {
    const now = new Date();

    switch (activeTab) {
      case "upcoming":
        return jobs
          .filter(
            (job) =>
              job.scheduledDate && isAfter(parseISO(job.scheduledDate), now)
          )
          .slice(0, 5);
      case "pending":
        return jobs
          .filter(
            (job) =>
              job.status?.toLowerCase() === "pending" ||
              job.status?.toLowerCase() === "in-progress"
          )
          .slice(0, 5);
      case "recent":
        return jobs.slice(0, 5);
      default:
        return jobs.slice(0, 5);
    }
  }, [jobs, activeTab]);

  // Get today's schedule
  const todaysSchedule = useMemo(() => {
    return jobs.filter(
      (job) => job.scheduledDate && isToday(parseISO(job.scheduledDate))
    );
  }, [jobs]);

  const exportToCSV = (data, headers, filename) => {
    if (data.length === 0) {
      alert("No data to export");
      return;
    }

    const csv = [
      headers,
      ...data.map((item) =>
        headers.map((header) => {
          // Handle nested properties
          const value = header.key
            .split(".")
            .reduce(
              (obj, key) => (obj && obj[key] !== undefined ? obj[key] : ""),
              item
            );
          return `"${String(value || "").replace(/"/g, '""')}"`;
        })
      ),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "in-progress":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "accepted":
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
      case "rejected":
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gray-900">
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-6 rounded-xl max-w-md text-center">
          <FaExclamationTriangle className="text-3xl mx-auto mb-3" />
          <h3 className="font-bold mb-2">Failed to Load Dashboard</h3>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500/30 hover:bg-red-500/40 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-6 bg-gray-900 text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Welcome back, {profile?.user?.name || profile?.name || "Worker"}!
        </h1>
        <p className="text-gray-400">
          Here's your activity summary{" "}
          {todaysSchedule.length > 0 && (
            <span className="text-blue-400 font-medium">
              - You have {todaysSchedule.length} job(s) today
            </span>
          )}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            trend={stat.trend}
            loading={loading}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Today's Schedule Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 shadow-lg border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <FaClock className="text-blue-400" /> Today's Schedule
            </h2>
            <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">
              {todaysSchedule.length}
            </span>
          </div>

          {todaysSchedule.length > 0 ? (
            <div className="space-y-3">
              {todaysSchedule.map((job, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-colors"
                >
                  <div className="font-medium text-sm truncate">
                    {job.service?.name ||
                      job.serviceSnapshot?.name ||
                      "Unnamed Service"}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <FaClock className="text-xs" />
                      {job.scheduledDate && job.time
                        ? `${format(parseISO(job.scheduledDate), "MMM dd")} • ${
                            job.time
                          }`
                        : "Time not set"}
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </div>
                  {job.location && (
                    <div className="text-xs text-gray-400 mt-1 truncate flex items-center gap-1">
                      <FaMapMarkerAlt className="text-xs" />
                      {job.location.street ||
                        job.location.city ||
                        "Location not specified"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <FaCalendarAlt className="text-2xl mx-auto mb-2 opacity-50" />
              <p>No jobs scheduled for today</p>
            </div>
          )}
        </div>

        {/* Recent Jobs Section */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 shadow-lg border border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <FaBriefcase className="text-blue-400" /> Recent Jobs
            </h2>

            <div className="flex flex-wrap gap-2">
              <div className="flex bg-gray-800 rounded-lg p-1">
                {["upcoming", "pending", "recent"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      activeTab === tab
                        ? "bg-blue-500 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <button
                className="px-3 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-xs flex items-center gap-1"
                onClick={() =>
                  exportToCSV(
                    jobs,
                    [
                      { key: "service.name", label: "Service" },
                      { key: "customer.name", label: "Customer" },
                      { key: "scheduledDate", label: "Date" },
                      { key: "status", label: "Status" },
                      { key: "price", label: "Price" },
                    ],
                    "worker_jobs"
                  )
                }
              >
                <FaDownload size={12} /> Export
              </button>

              <button
                className="px-3 py-1 text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1"
                onClick={() => navigate("/worker/jobs")}
              >
                View All <FaArrowRight size={10} />
              </button>
            </div>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="space-y-3">
              {filteredJobs.map((job, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium truncate group-hover:text-blue-300 transition-colors">
                      {job.service?.name ||
                        job.serviceSnapshot?.name ||
                        "Unnamed Service"}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div className="text-gray-300">
                      <div className="text-xs text-gray-400">Customer</div>
                      {job.customer?.name || "Unknown Customer"}
                    </div>

                    <div className="text-gray-300">
                      <div className="text-xs text-gray-400">Date</div>
                      {job.scheduledDate
                        ? format(parseISO(job.scheduledDate), "MMM dd, yyyy")
                        : "Not scheduled"}
                    </div>

                    <div className="text-gray-300">
                      <div className="text-xs text-gray-400">Amount</div>
                      <span className="text-cyan-300 font-medium">
                        ₹{job.price || job.finalAmount || "0"}
                      </span>
                    </div>
                  </div>

                  {job.location && (
                    <div className="text-xs text-gray-400 mt-2 truncate flex items-center gap-1">
                      <FaMapMarkerAlt className="text-xs" />
                      {job.location.street ||
                        job.location.city ||
                        "Location not specified"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaBriefcase className="text-2xl mx-auto mb-2 opacity-50" />
              <p>No {activeTab} jobs found</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Reviews Section */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 shadow-lg border border-gray-700 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <FaStar className="text-yellow-400" /> Recent Reviews
          </h2>

          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-xs flex items-center gap-1"
              onClick={() =>
                exportToCSV(
                  ratings,
                  [
                    { key: "customer.name", label: "Customer" },
                    { key: "date", label: "Date" },
                    { key: "stars", label: "Rating" },
                    { key: "comment", label: "Comment" },
                  ],
                  "worker_reviews"
                )
              }
            >
              <FaDownload size={12} /> Export
            </button>

            <button
              className="px-3 py-1 text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1"
              onClick={() => navigate("/worker/ratings")}
            >
              View All <FaArrowRight size={10} />
            </button>
          </div>
        </div>

        {ratings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ratings.slice(0, 4).map((rating, index) => (
              <div
                key={index}
                className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-yellow-500/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="font-medium">
                    {rating.customer?.name || "Anonymous"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {rating.date
                      ? format(parseISO(rating.date), "MMM dd, yyyy")
                      : ""}
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-sm ${
                        i < (rating.stars || 0)
                          ? "text-yellow-400"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-400 ml-1">
                    {rating.stars}/5
                  </span>
                </div>

                <div className="text-sm text-gray-300 italic">
                  "{rating.comment || "No comment provided"}"
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FaStar className="text-2xl mx-auto mb-2 opacity-50" />
            <p>No reviews yet</p>
          </div>
        )}
      </div>

      {/* Profile Summary */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 shadow-lg border border-gray-700">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {profile?.user?.name?.charAt(0) || profile?.name?.charAt(0) || "W"}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-bold text-lg mb-1">
              {profile?.user?.name || profile?.name || "Worker"}
            </h3>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-2">
              {profile?.primarySkill && (
                <span className="bg-blue-900/40 text-blue-300 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <FaTools size={10} /> {profile.primarySkill}
                </span>
              )}

              {profile?.experience > 0 && (
                <span className="bg-purple-900/40 text-purple-300 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <FaMedal size={10} /> {profile.experience} yrs experience
                </span>
              )}

              {profile?.verified && (
                <span className="bg-green-900/40 text-green-300 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <FaCertificate size={10} /> Verified
                </span>
              )}

              {profile?.transportMode && (
                <span className="bg-cyan-900/40 text-cyan-300 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <FaCar size={10} /> {profile.transportMode}
                </span>
              )}

              {profile?.dailyRate && (
                <span className="bg-yellow-900/40 text-yellow-300 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <FaDollarSign size={10} /> ₹{profile.dailyRate}/day
                </span>
              )}
            </div>

            <p className="text-gray-400 text-sm">
              {profile?.user?.bio || profile?.bio || "No bio provided"}
            </p>
          </div>

          <button
            onClick={() => navigate("/worker/profile")}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-lg text-sm transition-all shadow-md hover:shadow-blue-500/20"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
