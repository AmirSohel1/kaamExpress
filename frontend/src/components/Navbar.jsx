// Navbar.js (Fixed and Enhanced)
import React, { useState, useContext, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import ProfileDropdown from "./ProfileDropdown";
import NavbarNotifications from "./NavbarNotifications";
import NavbarProfileButton from "./NavbarProfileButton";
import { FaSearch, FaBell, FaCog } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import NotificationDropdown from "./NotificationDropdown";
import ProfileSettingsModal from "./ProfileSettingsModal";
import HelpSupportModal from "./HelpSupportModal";
import { me } from "../api/auth.js";
import UpdatePasswordModal from "./UpdatePasswordModal.jsx";

const Notifications = {
  customer: [
    {
      id: 1,
      text: "Your booking #1234 is confirmed.",
      read: false,
      time: "2 mins ago",
    },
    {
      id: 2,
      text: "Payment of ₹500 received.",
      read: true,
      time: "1 hour ago",
    },
  ],
  worker: [
    {
      id: 1,
      text: "New job assigned: 'Fix bugs in project'",
      read: false,
      time: "10 mins ago",
    },
    {
      id: 2,
      text: "Your profile has been updated.",
      read: true,
      time: "2 days ago",
    },
  ],
  admin: [
    {
      id: 1,
      text: "New user registered: John Doe",
      read: false,
      time: "5 mins ago",
    },
    {
      id: 2,
      text: "Server maintenance scheduled for midnight",
      read: true,
      time: "Yesterday",
    },
  ],
};

const pageTitles = [
  { path: "/customer", title: "Find Services" },
  { path: "/customer/bookings", title: "My Bookings" },
  { path: "/customer/history", title: "Service History" },
  { path: "/customer/payments", title: "Payment Methods" },
  { path: "/customer/notifications", title: "Notifications" },
  { path: "/worker", title: "Worker Dashboard" },
  { path: "/worker/profile", title: "Profile Management" },
  { path: "/worker/jobs", title: "Job Management" },
  { path: "/worker/earnings", title: "Earnings Overview" },
  { path: "/worker/ratings", title: "Ratings & Reviews" },
  { path: "/worker/notifications", title: "Notifications" },
  { path: "/admin", title: "Admin Dashboard" },
  { path: "/admin/workers", title: "Worker Management" },
  { path: "/admin/customers", title: "Customer Management" },
  { path: "/admin/services", title: "Service Catalog" },
  { path: "/admin/bookings", title: "Booking Management" },
  { path: "/admin/disputes", title: "Dispute Resolution" },
  { path: "/admin/analytics", title: "Analytics & Reports" },
];

function getPageTitle(pathname) {
  const match =
    pageTitles.find((p) => pathname === p.path) ||
    pageTitles.find((p) => pathname.startsWith(p.path));
  return match ? match.title : "Dashboard";
}

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const pageTitle = getPageTitle(location.pathname);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [showNotif, setShowNotif] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  const [profile, setProfile] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Refs
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const profileButtonRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (showProfileModal || showHelpModal || showUpdatePasswordModal) return;

      // Profile dropdown
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        !profileButtonRef.current.contains(event.target) &&
        !(
          profileDropdownRef.current &&
          profileDropdownRef.current.contains(event.target)
        )
      ) {
        setShowDropdown(false);
      }

      // Notification dropdown
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }

      // Search bar (for mobile)
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        window.innerWidth < 640
      ) {
        setIsSearchFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileModal, showHelpModal, showUpdatePasswordModal]);

  // Keep profile synced with AuthContext
  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const res = await me();
        setProfile(res);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchMyProfile();
  }, [user]);

  const notifList = Notifications[user.role] || [];
  const unreadCount = notifList.filter((n) => !n.read).length;

  // Handle dropdown toggle & position
  const handleProfileClick = () => {
    if (profileButtonRef.current) {
      const rect = profileButtonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        left: Math.min(rect.left, window.innerWidth - 320), // Ensure it doesn't overflow screen
      });
    }
    setShowDropdown((v) => !v);
    setShowNotif(false); // Close notifications if open
  };

  // Handle notification click
  const handleNotifClick = () => {
    if (notifRef.current) {
      const rect = notifRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
        left: "auto",
      });
    }
    setShowNotif((v) => !v);
    setShowDropdown(false); // Close profile if open
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <>
      <nav className="h-14 flex items-center justify-between bg-card/90 backdrop-blur-xl px-4 text-white border-b border-accent/30 fixed top-0 left-0 right-0 z-50 shadow-lg transition-all duration-500 md:ml-72">
        {/* Mobile menu button */}
        <div className="md:hidden mr-2 flex-shrink-0">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-secondary/50 transition-all duration-300 flex items-center justify-center"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Page title */}
        <div className="flex-1 min-w-0 mr-4">
          <h1 className="text-xl font-bold truncate bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
            {pageTitle}
          </h1>
        </div>

        {/* Search bar - hidden on small mobile, visible on larger screens */}
        <div
          ref={searchRef}
          className={`relative transition-all duration-500 ${
            isSearchFocused ? "flex-1 mx-4" : "hidden sm:block flex-shrink"
          }`}
        >
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search services, workers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => {
                if (window.innerWidth >= 640) setIsSearchFocused(false);
              }}
              className="bg-secondary/70 rounded-xl px-4 py-2 text-sm text-white focus:outline-none border border-accent/40 w-full focus:ring-2 ring-accent/30 transition-all duration-300"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent transition-colors"
            >
              <FaSearch className="text-sm" />
            </button>
          </form>

          {/* Mobile search close button */}
          {isSearchFocused && window.innerWidth < 640 && (
            <button
              onClick={() => setIsSearchFocused(false)}
              className="absolute -left-10 top-1/2 transform -translate-y-1/2 text-white p-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 min-w-fit">
          {/* Settings button */}
          <button
            className="p-2 rounded-lg hover:bg-secondary/50 transition-colors duration-300 text-gray-300 hover:text-white"
            onClick={() => navigate("/settings")}
            aria-label="Settings"
          >
            <FaCog className="text-lg" />
          </button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={handleNotifClick}
              className="p-2 rounded-lg hover:bg-secondary/50 transition-colors duration-300 relative"
              aria-label="Notifications"
            >
              <FaBell className="text-lg" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification dropdown portal */}
            {showNotif &&
              createPortal(
                <div
                  style={{
                    position: "fixed",
                    top: dropdownPos.top,
                    right: dropdownPos.right,
                    zIndex: 10000,
                  }}
                >
                  <NotificationDropdown
                    notifications={notifList}
                    onClose={() => setShowNotif(false)}
                    onMarkAllRead={() => console.log("Mark all as read")}
                  />
                </div>,
                document.body
              )}
          </div>

          {/* Profile Button */}
          <NavbarProfileButton
            profile={profile}
            onClick={handleProfileClick}
            ref={profileButtonRef}
          />
        </div>
      </nav>

      {/* Profile Dropdown Portal */}
      {showDropdown &&
        createPortal(
          <div
            ref={profileDropdownRef}
            style={{
              position: "fixed",
              top: dropdownPos.top,
              left: dropdownPos.left,
              zIndex: 10000,
            }}
          >
            <ProfileDropdown
              profile={profile}
              onProfile={() => {
                setShowProfileModal(true);
                setShowDropdown(false);
              }}
              onHelp={() => {
                setShowHelpModal(true);
                setShowDropdown(false);
              }}
              updatePasswordModal={() => {
                setShowUpdatePasswordModal(true);
                setShowDropdown(false);
              }}
              onSignOut={() => {
                handleLogout();
                setShowDropdown(false);
              }}
            />
          </div>,
          document.body
        )}

      {/* Profile Settings Modal */}
      {showProfileModal && (
        <ProfileSettingsModal
          user={profile}
          onClose={() => setShowProfileModal(false)}
          onSave={(updatedUser) => {
            setProfile(updatedUser);
            setShowProfileModal(false);
          }}
        />
      )}

      {/* Help & Support Modal */}
      {showHelpModal && (
        <HelpSupportModal onClose={() => setShowHelpModal(false)} />
      )}

      {/* Reset Password Modal */}
      {showUpdatePasswordModal && (
        <UpdatePasswordModal
          userEmail={profile.email}
          onClose={() => setShowUpdatePasswordModal(false)}
        />
      )}
    </>
  );
};

export default Navbar;
