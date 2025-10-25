// DashboardLayout.js (Fixed and Enhanced)
import React, { useState, useEffect } from "react";
import Navbar from "../components/common/navbar/Navbar";
import Sidebar from "../components/common/sidebar/Sidebar";
import { Outlet, useLocation } from "react-router-dom";

const DashboardLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Auto-close sidebar when switching from mobile to desktop
      if (!mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary text-white flex transition-all duration-500">
      {/* Sidebar for desktop with proper z-index */}
      <div className="hidden md:block w-72 fixed inset-y-0 left-0 z-30 transition-all duration-500">
        <Sidebar />
      </div>

      {/* Backdrop for mobile sidebar */}
      <div
        className={`fixed inset-0 bg-black z-40 md:hidden transition-opacity duration-500 ${
          sidebarOpen
            ? "opacity-60 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar for mobile with proper z-index */}
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-card-dark z-40 transform transition-transform duration-500 md:hidden shadow-2xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-72">
        {/* Fixed Navbar with higher z-index than sidebar */}
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto mt-14">
          <main className="relative p-2 sm:p-4 lg:p-6 bg-gradient-to-b from-primary/10 to-primary/5 min-h-[calc(100vh-3.5rem)] transition-all duration-500 overflow-x-auto">
            <div className="w-full max-w-6xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
