// AdminDashboard.js (Corrected and complete)
import React, { useState, useEffect } from "react";
import {
  FaRupeeSign,
  FaExclamationTriangle,
  FaUsers,
  FaClipboardList,
  FaChartBar,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import WorkerApprovalModal from "../../components/WorkerApprovalModal";
import AdminStatCards from "./components/AdminStatCards";
import AdminRecentActivities from "./components/AdminRecentActivities";
import AdminPendingApprovals from "./components/AdminPendingApprovals";
import AdminQuickActions from "./components/AdminQuickActions";

import { fetchDashboardStats } from "../../api/analytics";
import { fetchWorkers } from "../../api/workers";
import { fetchBookings } from "../../api/bookings";
import { fetchDisputes } from "../../api/disputes";

const defaultStats = [
  {
    label: "Total Workers",
    value: 0,
    change: "",
    icon: <FaUsers className="text-2xl text-green-400" />,
    color: "text-green-400",
    bg: "bg-green-900",
  },
  {
    label: "Monthly Revenue",
    value: "₹0",
    change: "",
    icon: <FaRupeeSign className="text-2xl text-purple-400" />,
    color: "text-purple-400",
    bg: "bg-purple-900",
  },
  {
    label: "Open Disputes",
    value: 0,
    change: "",
    icon: <FaExclamationTriangle className="text-2xl text-red-400" />,
    color: "text-red-400",
    bg: "bg-red-900",
  },
];

const defaultRecentActivities = [];
const defaultPendingApprovals = [];

const quickActions = [
  {
    label: "Manage Workers",
    icon: (
      <FaUsers className="text-3xl text-cyan-400 bg-[var(--card)] p-2 rounded-full" />
    ),
    color: "text-cyan-400",
    bg: "bg-[var(--card)]",
    to: "/admin/workers",
  },
  {
    label: "View Bookings",
    icon: (
      <FaClipboardList className="text-3xl text-green-400 bg-[var(--card)] p-2 rounded-full" />
    ),
    color: "text-green-400",
    bg: "bg-[var(--card)]",
    to: "/admin/bookings",
  },
  {
    label: "Handle Disputes",
    icon: (
      <FaExclamationTriangle className="text-3xl text-red-400 bg-[var(--card)] p-2 rounded-full" />
    ),
    color: "text-red-400",
    bg: "bg-[var(--card)]",
    to: "/admin/disputes",
  },
  {
    label: "View Analytics",
    icon: (
      <FaChartBar className="text-3xl text-purple-400 bg-[var(--card)] p-2 rounded-full" />
    ),
    color: "text-purple-400",
    bg: "bg-[var(--card)]",
    to: "/admin/analytics",
  },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(defaultStats);
  const [recentActivities, setRecentActivities] = useState(
    defaultRecentActivities
  );
  const [pendingApprovals, setPendingApprovals] = useState(
    defaultPendingApprovals
  );
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchDashboardStats().catch(() => null),
      fetchWorkers().catch(() => []),
      fetchBookings().catch(() => []),
      fetchDisputes().catch(() => []),
    ])
      .then(([dashboard, workers, bookings, disputes]) => {
        // Stats
        setStats([
          {
            label: "Total Workers",
            value: Array.isArray(workers) ? workers.length : 0,
            change: dashboard?.workerChange || "",
            icon: <FaUsers className="text-2xl text-green-400" />,
            color: "text-green-400",
            bg: "bg-green-900",
          },
          {
            label: "Monthly Revenue",
            value: dashboard?.monthlyRevenue
              ? `₹${dashboard.monthlyRevenue}`
              : "₹0",
            change: dashboard?.revenueChange || "",
            icon: <FaRupeeSign className="text-2xl text-purple-400" />,
            color: "text-purple-400",
            bg: "bg-purple-900",
          },
          {
            label: "Open Disputes",
            value: Array.isArray(disputes)
              ? disputes.filter((d) => d.status !== "resolved").length
              : 0,
            change: dashboard?.disputeChange || "",
            icon: <FaExclamationTriangle className="text-2xl text-red-400" />,
            color: "text-red-400",
            bg: "bg-red-900",
          },
        ]);
        // Recent Activities (example: from dashboard or bookings)
        let activities = [];
        if (dashboard?.recentActivities) {
          activities = dashboard.recentActivities;
        } else if (Array.isArray(bookings)) {
          activities = bookings
            .slice(-5)
            .map(
              (b) =>
                `Booking #${b._id || b.id} by ${b.customer?.name || "Unknown"}`
            );
        }
        setRecentActivities(activities);
        // Pending Approvals (workers with status Pending)
        if (Array.isArray(workers)) {
          setPendingApprovals(
            workers
              .filter((w) => w.status === "Pending")
              .map((w) => ({
                name: w.user?.name || "Unknown",
                category: w.skills?.join(", ") || "",
                _id: w._id,
                full: w,
              }))
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

  const handleOpenModal = (worker) => {
    setSelectedWorker(worker);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedWorker(null);
    // Optionally: show toast or update global state
  };
  const handleApprove = (worker) => {
    setPendingApprovals((prev) => prev.filter((w) => w.name !== worker.name));
    setModalOpen(false);
    setSelectedWorker(null);
    // Optionally: show toast or update global state
  };
  const handleReject = (worker) => {
    setPendingApprovals((prev) => prev.filter((w) => w.name !== worker.name));
    setModalOpen(false);
    setSelectedWorker(null);
    // Optionally: show toast or update global state
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64 text-lg text-gray-400">
        Loading dashboard...
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full flex justify-center items-center h-64 text-lg text-red-400">
        {error}
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[var(--primary)] text-white px-4 pt-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
        <AdminStatCards stats={stats} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <AdminRecentActivities activities={recentActivities} />
          <>
            <AdminPendingApprovals
              pendingApprovals={pendingApprovals}
              onOpenModal={handleOpenModal}
              onApprove={handleApprove}
              onReject={handleReject}
            />
            <WorkerApprovalModal
              worker={selectedWorker}
              open={modalOpen}
              onClose={handleCloseModal}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </>
        </div>
        <AdminQuickActions quickActions={quickActions} onNavigate={navigate} />
        <footer className="text-gray-500 text-xs mt-12 text-center">
          KaamExpress v1.0 © 2025 All rights reserved
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;
