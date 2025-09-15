import React, { useEffect, useState } from "react";
import { FaUser, FaUsers, FaBriefcase, FaDollarSign } from "react-icons/fa";
import { fetchDashboardStats } from "../../api/analytics";

// Helper functions for icons
const getStatIcon = (icon) => {
  switch (icon) {
    case "users":
      return <FaUsers />;
    case "user":
      return <FaUser />;
    case "jobs":
      return <FaBriefcase />;
    case "revenue":
      return <FaDollarSign />;
    default:
      return null;
  }
};

const getInsightIcon = (icon) => {
  switch (icon) {
    case "users":
      return <FaUsers />;
    case "jobs":
      return <FaBriefcase />;
    case "revenue":
      return <FaDollarSign />;
    default:
      return null;
  }
};

// Custom hook to fetch dashboard data
const useDashboardData = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats()
      .then((data) => {
        setDashboard(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load analytics");
        setLoading(false);
      });
  }, []);

  return { dashboard, loading, error };
};

// Simple CSV export function
const exportCSV = (rows, filename) => {
  const csv = rows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// Placeholder Chart Components
const ChartLine = ({ data, labels }) => {
  // Implement your line chart here
  return <div>Line Chart Placeholder</div>;
};
const ChartBar = ({ data, labels }) => {
  // Implement your bar chart here
  return <div>Bar Chart Placeholder</div>;
};
const ChartPie = ({ data }) => {
  // Implement your pie chart here
  return <div>Pie Chart Placeholder</div>;
};

const Analytics = () => {
  const { dashboard, loading, error } = useDashboardData();

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div className="text-red-400">{error}</div>;
  if (!dashboard) return null;

  // Destructure backend data
  const {
    stats,
    bookingsGrowth,
    revenueGrowth,
    months,
    serviceDist,
    workerStatus,
    PlatformInsights,
  } = dashboard;

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-full px-4 sm:px-6 py-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-2">Analytics</h2>
      <h3 className="text-lg sm:text-xl font-semibold mb-8">
        Analytics Dashboard
      </h3>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats?.map((s, i) => (
          <div
            key={i}
            className="rounded-xl p-4 sm:p-6 bg-[var(--secondary)] flex flex-col items-center shadow border border-[var(--accent)]/10"
          >
            <div className="text-2xl font-bold text-[var(--accent)] flex items-center gap-2">
              {getStatIcon(s.icon)}
              {s.value}
            </div>
            <div className="text-gray-400 text-sm mt-1 text-center">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Bookings Growth Chart */}
        <div className="bg-[var(--secondary)] rounded-2xl p-4 sm:p-6 shadow">
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold text-base sm:text-lg">
              Monthly Bookings Growth
            </div>
            <button
              className="px-3 py-1 rounded bg-[var(--accent)] text-black text-xs"
              onClick={() =>
                exportCSV(
                  [
                    ["Month", ...months],
                    ["Bookings", ...bookingsGrowth],
                  ],
                  "bookings_growth.csv"
                )
              }
            >
              Export
            </button>
          </div>
          <ChartLine data={bookingsGrowth} labels={months} />
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-[var(--secondary)] rounded-2xl p-4 sm:p-6 shadow">
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold text-base sm:text-lg">
              Monthly Revenue
            </div>
            <button
              className="px-3 py-1 rounded bg-[var(--accent)] text-black text-xs"
              onClick={() =>
                exportCSV(
                  [
                    ["Month", ...months],
                    ["Revenue", ...revenueGrowth],
                  ],
                  "revenue_growth.csv"
                )
              }
            >
              Export
            </button>
          </div>
          <ChartBar data={revenueGrowth} labels={months} />
        </div>
      </div>

      {/* Pie Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Service Distribution */}
        <div className="bg-[var(--secondary)] rounded-2xl p-4 sm:p-6 shadow text-center">
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold text-base sm:text-lg">
              Service Distribution
            </div>
            <button
              className="px-3 py-1 rounded bg-[var(--accent)] text-black text-xs"
              onClick={() =>
                exportCSV(
                  [
                    ["Service", "Count"],
                    ...serviceDist.map((s) => [s.label, s.value]),
                  ],
                  "service_distribution.csv"
                )
              }
            >
              Export
            </button>
          </div>
          <ChartPie data={serviceDist} />
        </div>

        {/* Worker Status */}
        <div className="bg-[var(--secondary)] rounded-2xl p-4 sm:p-6 shadow text-center">
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold text-base sm:text-lg">
              Worker Status
            </div>
            <button
              className="px-3 py-1 rounded bg-[var(--accent)] text-black text-xs"
              onClick={() =>
                exportCSV(
                  [
                    ["Status", "Count"],
                    ...workerStatus.map((s) => [s.label, s.value]),
                  ],
                  "worker_status.csv"
                )
              }
            >
              Export
            </button>
          </div>
          <ChartPie data={workerStatus} />
        </div>
      </div>

      {/* Platform Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {PlatformInsights?.map((ins, i) => (
          <div
            key={i}
            className="bg-[var(--secondary)] rounded-2xl p-4 sm:p-6 shadow flex flex-col items-center text-center border border-[var(--accent)]/10"
          >
            <div className="text-2xl mb-2 text-[var(--accent)]">
              {getInsightIcon(ins.icon)}
            </div>
            <div className="font-bold text-lg mb-1">{ins.label}</div>
            <div className="text-gray-400 text-xs">{ins.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
