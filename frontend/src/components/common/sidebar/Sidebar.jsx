// Sidebar.js (Fixed and Enhanced)
import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import Avatar from "react-avatar";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { useContext } from "react";

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const customerSidebar = [
    { label: "Home", icon: "🏠", path: "/customer" },
    { label: "My Bookings", icon: "📅", path: "/customer/bookings" },
    { label: "History", icon: "📋", path: "/customer/history" },
    { label: "Payments", icon: "💳", path: "/customer/payments" },
    { label: "Notifications", icon: "🔔", path: "/customer/notifications" },
  ];

  const workerSidebar = [
    { label: "Dashboard", icon: "📊", path: "/worker" },
    { label: "Profile", icon: "👤", path: "/worker/profile" },
    { label: "Jobs", icon: "💼", path: "/worker/jobs" },
    { label: "Earnings", icon: "💰", path: "/worker/earnings" },
    { label: "Ratings", icon: "⭐", path: "/worker/ratings" },
    { label: "Notifications", icon: "🔔", path: "/worker/notifications" },
  ];

  const adminSidebar = [
    { label: "Dashboard", icon: "📊", path: "/admin" },
    { label: "Workers", icon: "👷", path: "/admin/workers" },
    { label: "Customers", icon: "👥", path: "/admin/customers" },
    { label: "Services", icon: "🛠️", path: "/admin/services" },
    { label: "Bookings", icon: "📅", path: "/admin/bookings" },
    { label: "Disputes", icon: "⚖️", path: "/admin/disputes" },
    { label: "Analytics", icon: "📈", path: "/admin/analytics" },
  ];

  const getSidebarItems = () => {
    if (location.pathname.startsWith("/worker")) return workerSidebar;
    if (location.pathname.startsWith("/admin")) return adminSidebar;
    return customerSidebar;
  };

  const getRole = () => {
    if (location.pathname.startsWith("/worker")) return "Service Professional";
    if (location.pathname.startsWith("/admin")) return "Administrator";
    return "Customer";
  };

  const items = getSidebarItems();
  const role = getRole();

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    if (onClose) onClose();
  };

  return (
    <aside className="h-full w-72 bg-card-dark border-r border-accent/20 flex flex-col justify-between fixed top-0 left-0 z-40 min-h-screen shadow-xl overflow-hidden">
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        {/* Brand and profile section */}
        <div className="px-6 pt-6 pb-4 relative border-b border-accent/10">
          {/* Close button for mobile */}
          {onClose && (
            <button
              className="absolute right-4 top-4 text-gray-400 hover:text-accent transition-colors md:hidden"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar
                name={user?.name || "U"}
                size="48"
                round="50%"
                className="border-2 border-accent/30"
                color="#00bcd4"
                fgColor="#fff"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card-dark"></div>
            </div>
            <div className="flex flex-col items-start overflow-hidden">
              <div className="font-bold text-lg truncate max-w-[140px]">
                {user?.name || "User"}
              </div>
              <div className="text-xs text-accent-light truncate max-w-[140px]">
                {user?.email || "user@example.com"}
              </div>
            </div>
          </div>

          <div className="mt-2">
            <div className="flex items-center bg-secondary/50 rounded-xl px-4 py-2 text-sm font-medium text-accent-light">
              <span className="flex-1">{role}</span>
              {/* <span className="bg-accent/20 text-accent text-xs px-2 py-1 rounded-full">
                PRO
              </span> */}
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex flex-col gap-1 p-4">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 group
                ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-accent to-accent-light text-primary shadow-lg"
                    : "text-gray-300 hover:bg-secondary/50 hover:text-white"
                }`}
            >
              <span className="text-xl transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {location.pathname === item.path && (
                <div className="w-1.5 h-6 bg-white rounded-l-full"></div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Footer section */}
      <div className="p-4 border-t border-accent/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:bg-red-500/20 hover:text-red-300 w-full transition-colors duration-300 group"
        >
          <span className="text-xl">
            <FaSignOutAlt />
          </span>
          <span className="flex-1 text-left">Sign Out</span>
        </button>

        <div className="px-4 py-3 text-xs text-gray-500">
          <div>KaamExpress v2.0</div>
          <div>© 2025 All rights reserved</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
