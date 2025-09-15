// DashboardLayout.js (Corrected and complete)
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaHistory,
  FaCreditCard,
  FaBell,
  FaUserTie,
  FaWallet,
  FaStar,
  FaUser,
  FaCogs,
  FaChartBar,
  FaExclamationTriangle,
  FaTachometerAlt,
  FaTools,
  FaBriefcase,
} from "react-icons/fa";

const customerSidebar = [
  { label: "Home", icon: <FaHome />, path: "/customer" },
  { label: "My Bookings", icon: <FaCalendarAlt />, path: "/customer/bookings" },
  { label: "History", icon: <FaHistory />, path: "/customer/history" },
  { label: "Payments", icon: <FaCreditCard />, path: "/customer/payments" },
  { label: "Notifications", icon: <FaBell />, path: "/customer/notifications" },
];

const workerSidebar = [
  { label: "Dashboard", icon: <FaTachometerAlt />, path: "/worker" },
  { label: "Profile", icon: <FaUserTie />, path: "/worker/profile" },
  { label: "Jobs", icon: <FaBriefcase />, path: "/worker/jobs" },
  { label: "Earnings", icon: <FaWallet />, path: "/worker/earnings" },
  { label: "Ratings", icon: <FaStar />, path: "/worker/ratings" },
  { label: "Notifications", icon: <FaBell />, path: "/worker/notifications" },
];

const adminSidebar = [
  { label: "Dashboard", icon: <FaTachometerAlt />, path: "/admin" },
  { label: "Workers", icon: <FaUserTie />, path: "/admin/workers" },
  { label: "Customers", icon: <FaUser />, path: "/admin/customers" },
  { label: "Services", icon: <FaTools />, path: "/admin/services" },
  { label: "Bookings", icon: <FaCalendarAlt />, path: "/admin/bookings" },
  {
    label: "Disputes",
    icon: <FaExclamationTriangle />,
    path: "/admin/disputes",
  },
  { label: "Analytics", icon: <FaChartBar />, path: "/admin/analytics" },
];

const getSidebar = (pathname) => {
  if (pathname.startsWith("/worker"))
    return { items: workerSidebar, role: "Worker" };
  if (pathname.startsWith("/admin"))
    return { items: adminSidebar, role: "Admin" };
  return { items: customerSidebar, role: "Customer" };
};

const DashboardLayout = () => {
  const location = useLocation();
  const { items, role } = getSidebar(location.pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-primary text-white flex transition-colors duration-300">
      {/* Sidebar for desktop */}
      <div className="hidden md:block w-64 fixed inset-y-0 left-0 z-50 transition-transform transform hover:scale-105">
        <Sidebar items={items} role={role} />
      </div>

      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-[var(--card)] z-50 transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-2xl`}
      >
        <Sidebar
          items={items}
          role={role}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64 animate-fade-in-up h-screen">
        {/* Fixed Navbar, height 56px (h-14) */}
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        {/* Scrollable main content below Navbar */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ paddingTop: "3.5rem" }}
        >
          <main className="p-2 sm:p-4 md:p-8 bg-[var(--primary)] min-h-[calc(100vh-3.5rem)] transition-all duration-300">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
