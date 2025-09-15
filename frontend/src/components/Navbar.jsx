import React, { useState, useContext, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import ProfileDropdown from "./ProfileDropdown";
import NavbarNotifications from "./NavbarNotifications";
import NavbarProfileButton from "./NavbarProfileButton";
import { FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import NotificationDropdown from "./NotificationDropdown";
import ProfileSettingsModal from "./ProfileSettingsModal";
import HelpSupportModal from "./HelpSupportModal";

// Dummy user fallback
const dummyUser = {
  name: "Amir Khan",
  email: "amir@example.com",
  role: "admin",
};

const notifications = {
  admin: [
    { id: 1, type: "booking", message: "New booking received", read: false },
    {
      id: 2,
      type: "dispute",
      message: "Dispute opened by customer",
      read: false,
    },
    { id: 3, type: "worker", message: "New worker registered", read: true },
  ],
};

const pageTitles = [
  { path: "/customer", title: "Find Services" },
  { path: "/worker", title: "Profile" },
  { path: "/admin", title: "Dashboard" },
  { path: "/admin/bookings", title: "Bookings" },
];

function getPageTitle(pathname) {
  let match = pageTitles.find((p) => pathname === p.path);
  if (!match) match = pageTitles.find((p) => pathname.startsWith(p.path));
  return match ? match.title : "Dashboard";
}

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const pageTitle = getPageTitle(location.pathname);

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const [showNotif, setShowNotif] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const [profile, setProfile] = useState(user || dummyUser);

  // Refs
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const profileButtonRef = useRef(null);
  const profileDropdownRef = useRef(null); // 👈 NEW ref for dropdown

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        !profileButtonRef.current.contains(event.target) &&
        !(
          profileDropdownRef.current &&
          profileDropdownRef.current.contains(event.target)
        ) // 👈 check dropdown too
      ) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Keep profile synced with AuthContext
  useEffect(() => {
    setProfile(user || dummyUser);
  }, [user]);

  const notifList = notifications[profile.role] || [];
  const unreadCount = notifList.filter((n) => !n.read).length;

  // Handle dropdown toggle & position
  const handleProfileClick = () => {
    if (profileButtonRef.current) {
      const rect = profileButtonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
    setShowDropdown((v) => !v);
  };

  return (
    <>
      <nav className="h-14 flex items-center bg-[var(--card)]/90 backdrop-blur-md px-4 text-white border-b border-[var(--accent)]/20 fixed top-0 left-0 right-0 w-full z-50 shadow transition-all duration-300">
        {/* Mobile menu button */}
        <div className="md:hidden mr-2 flex-shrink-0">
          <button
            onClick={onMenuClick}
            className="p-2 rounded hover:bg-[var(--secondary)] transition-all"
          >
            <svg
              className="w-7 h-7"
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
        <div className="flex-1 min-w-0">
          <span className="text-lg sm:text-xl font-bold truncate text-gradient bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] bg-clip-text text-transparent">
            {pageTitle}
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-fit">
          {/* Search bar (hidden on xs) */}
          <div className="relative hidden sm:block flex-shrink transition-all">
            <input
              type="text"
              placeholder="Search..."
              className="bg-[var(--secondary)] rounded-lg px-2 py-1 text-xs text-white focus:outline-none border border-[var(--accent)]/30 w-24 md:w-36 lg:w-48 focus:w-56 transition-all duration-300"
            />
            <FaSearch className="absolute right-2 top-2 text-gray-400 text-xs pointer-events-none" />
          </div>
          {/* Notifications */}
          <NavbarNotifications
            notifList={notifList}
            unreadCount={unreadCount}
            showNotif={showNotif}
            setShowNotif={setShowNotif}
            notifRef={notifRef}
            NotificationDropdown={NotificationDropdown}
          />
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
              zIndex: 99999,
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
              onSignOut={() => {
                logout();
                setShowDropdown(false);
              }}
            />
          </div>,
          document.body
        )}
      {/* Profile Settings Modal */}
      {showProfileModal && (
        <ProfileSettingsModal onClose={() => setShowProfileModal(false)} />
      )}
      {/* Help & Support Modal */}
      {showHelpModal && (
        <HelpSupportModal onClose={() => setShowHelpModal(false)} />
      )}
    </>
  );
};

export default Navbar;
