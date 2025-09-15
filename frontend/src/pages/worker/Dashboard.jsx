import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaDollarSign,
  FaBriefcase,
  FaCheck,
  FaStar,
  FaUser,
} from "react-icons/fa";
import { getWorkerProfile } from "../../api/workerProfile";
import { getWorkerJobs } from "../../api/workerJobs";
import { getWorkerEarnings } from "../../api/workerEarnings";
import { getWorkerRatings } from "../../api/workerRatings";

const getStatIcon = (icon) => {
  switch (icon) {
    case "dollar":
      return <FaDollarSign className="text-green-400 text-3xl" />;
    case "briefcase":
      return <FaBriefcase className="text-blue-400 text-3xl" />;
    case "check":
      return <FaCheck className="text-yellow-400 text-3xl" />;
    case "star":
      return <FaStar className="text-pink-400 text-3xl" />;
    default:
      return null;
  }
};

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      .catch(() => {
        setError("Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

  // Stats
  const totalEarnings = earnings.reduce((sum, e) => sum + (e.amount || 0), 0);
  const completedJobs = jobs.filter((j) => j.status === "completed").length;
  const pendingJobs = jobs.filter((j) => j.status === "pending").length;
  const avgRating = ratings.length
    ? (
        ratings.reduce((sum, r) => sum + (r.stars || 0), 0) / ratings.length
      ).toFixed(1)
    : "-";

  const statBox = [
    { icon: "dollar", value: `₹${totalEarnings}`, label: "Total Earnings" },
    { icon: "briefcase", value: jobs.length, label: "Total Jobs" },
    { icon: "check", value: completedJobs, label: "Completed" },
    { icon: "star", value: avgRating, label: "Avg. Rating" },
  ];

  if (loading)
    return <div className="text-gray-400 p-8">Loading dashboard...</div>;
  if (error) return <div className="text-red-400 p-8">{error}</div>;

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-full overflow-y-auto px-4 sm:px-6 py-4 animate-fade-in-up">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 animate-fade-in-up">
        Welcome back, {profile?.name || "Worker"}!
      </h1>
      <p className="text-gray-400 text-sm sm:text-base mb-8 animate-fade-in-up">
        Manage your jobs and track your earnings
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 animate-fade-in-up">
        {statBox.map((s, i) => (
          <div
            key={i}
            className="bg-[var(--card)] rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 shadow border border-[var(--accent)]/10 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
          >
            <div className="flex-shrink-0 text-xl sm:text-3xl">
              {getStatIcon(s.icon)}
            </div>
            <div className="text-center sm:text-left">
              <div className="text-xl sm:text-2xl font-bold text-[var(--accent)] animate-pulse-slow">
                {s.value}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Jobs Section */}
      <div className="w-full bg-[var(--secondary)] rounded-2xl shadow mb-8 p-4 sm:p-6 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <span className="text-lg font-semibold text-[var(--accent)]">
            Recent Jobs
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition text-sm"
              onClick={() => {
                const csv = [
                  ["Service", "Customer", "Date", "Status"],
                  ...jobs.map((j) => [
                    j.service,
                    j.customer,
                    j.date || "",
                    j.status,
                  ]),
                ]
                  .map((row) => row.join(","))
                  .join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "worker_jobs.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export Jobs
            </button>
            <button
              className="px-3 py-1 text-cyan-400 text-sm font-semibold hover:underline"
              onClick={() => navigate("/worker/jobs")}
            >
              View All
            </button>
          </div>
        </div>

        {/* Mobile Jobs (Cards) */}
        <div className="md:hidden flex flex-col gap-4">
          {jobs.length > 0 ? (
            jobs.slice(0, 3).map((j, idx) => (
              <div key={idx} className="bg-[var(--card)] rounded-xl p-4 shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-white text-base">
                    {j.service}
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                      j.status === "completed"
                        ? "bg-green-900 text-green-300"
                        : j.status === "pending"
                        ? "bg-yellow-900 text-yellow-300"
                        : "bg-blue-900 text-blue-300"
                    }`}
                  >
                    {j.status}
                  </span>
                </div>
                <div className="text-gray-200 text-sm mb-1">
                  Customer: {j.customer}
                </div>
                <div className="text-gray-400 text-xs mb-1">
                  Date: {j.date || "-"}
                </div>
                <div className="text-cyan-300 font-bold text-sm mt-2">
                  ₹{j.amount || "-"}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-4">
              No jobs to display.
            </div>
          )}
        </div>

        {/* Desktop Jobs (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left text-gray-300 text-sm bg-[var(--primary)]">
                <th className="py-3 px-4 min-w-[120px]">Service</th>
                <th className="py-3 px-4 min-w-[150px]">Customer</th>
                <th className="py-3 px-4 min-w-[100px]">Date</th>
                <th className="py-3 px-4 min-w-[100px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length > 0 ? (
                jobs.slice(0, 5).map((j, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-700 hover:bg-[var(--card)] transition"
                  >
                    <td className="py-3 px-4 font-bold text-sm text-white">
                      {j.service}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-200">
                      {j.customer}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-400">
                      {j.date || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          j.status === "completed"
                            ? "bg-green-900 text-green-300"
                            : j.status === "pending"
                            ? "bg-yellow-900 text-yellow-300"
                            : "bg-blue-900 text-blue-300"
                        }`}
                      >
                        {j.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-400">
                    No jobs to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Reviews Section */}
      <div className="w-full bg-[var(--secondary)] rounded-2xl shadow mb-8 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <span className="text-lg font-semibold text-[var(--accent)]">
            Recent Reviews
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition text-xs"
              onClick={() => {
                const csv = [
                  ["Customer", "Date", "Stars", "Comment"],
                  ...ratings.map((r) => [
                    r.customer,
                    r.date,
                    r.stars,
                    r.comment,
                  ]),
                ]
                  .map((row) => row.join(","))
                  .join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "worker_reviews.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export Reviews
            </button>
            <button
              className="px-3 py-1 text-cyan-400 text-sm font-semibold hover:underline"
              onClick={() => navigate("/worker/ratings")}
            >
              View All
            </button>
          </div>
        </div>

        {/* Mobile Reviews (Cards) */}
        <div className="md:hidden flex flex-col gap-4">
          {ratings.length > 0 ? (
            ratings.slice(0, 3).map((r, idx) => (
              <div key={idx} className="bg-[var(--card)] rounded-xl p-4 shadow">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold text-white text-base">
                    {r.customer}
                  </div>
                  <div className="text-gray-400 text-xs">{r.date}</div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-yellow-400 text-sm ${
                        i < r.stars ? "" : "opacity-30"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-gray-300 text-xs">
                    {r.stars}/5
                  </span>
                </div>
                <div className="text-gray-300 italic text-sm">
                  "{r.comment}"
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-4">
              No reviews to display.
            </div>
          )}
        </div>

        {/* Desktop Reviews (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left text-gray-300 text-sm bg-[var(--primary)]">
                <th className="py-3 px-4 min-w-[150px]">Customer</th>
                <th className="py-3 px-4 min-w-[100px]">Date</th>
                <th className="py-3 px-4 min-w-[120px]">Stars</th>
                <th className="py-3 px-4 min-w-[200px]">Comment</th>
              </tr>
            </thead>
            <tbody>
              {ratings.length > 0 ? (
                ratings.slice(0, 5).map((r, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-700 hover:bg-[var(--card)] transition"
                  >
                    <td className="py-3 px-4 font-bold text-sm text-white">
                      {r.customer}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-400">
                      {r.date}
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-yellow-400 text-sm ${
                              i < r.stars ? "" : "opacity-30"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-gray-300 text-xs">
                          {r.stars}/5
                        </span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300 italic">
                      "{r.comment}"
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-400">
                    No reviews to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Worker Profile Card */}
      <div className="bg-[var(--card)] rounded-2xl p-4 sm:p-6 shadow flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        <div className="w-16 h-16 rounded-full bg-[var(--accent)] flex items-center justify-center text-2xl sm:text-3xl font-bold text-white flex-shrink-0">
          <FaUser />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="font-bold text-lg sm:text-xl">
            {profile?.name || "Worker"}
          </div>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1">
            {profile?.skills?.map((skill, i) => (
              <span
                key={i}
                className="bg-cyan-900 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="text-gray-400 text-xs sm:text-sm mt-2">
            Experience: {profile?.experience || 0} years
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
