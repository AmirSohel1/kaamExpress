import React from "react";
import { FaCog, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";

function ProfileDropdown({ profile, onProfile, onHelp, onSignOut }) {
  return (
    <div
      className="fixed top-20 right-8 w-56 sm:w-64 bg-[var(--card)] rounded-xl shadow-lg z-[99999] border border-[var(--accent)]/20"
      style={{ pointerEvents: "auto" }}
    >
      <div className="p-4 border-b border-[var(--accent)]/20">
        <div className="font-semibold text-white">{profile.name}</div>
        <div className="text-xs text-gray-400">{profile.email}</div>
      </div>
      <ul className="divide-y  divide-[var(--accent)]/10">
        <li>
          <button
            className="w-full flex items-center gap-2 px-4 py-3 text-white hover:bg-[var(--secondary)] transition text-left"
            onClick={onProfile}
          >
            <FaCog className="text-lg" /> Profile Settings
          </button>
        </li>
        <li>
          <button
            className="w-full flex items-center gap-2 px-4 py-3 text-white hover:bg-[var(--secondary)] transition text-left"
            onClick={onHelp}
          >
            <FaQuestionCircle className="text-lg" /> Help & Support
          </button>
        </li>
        <li>
          <button
            className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-[var(--secondary)] transition text-left"
            onClick={onSignOut}
          >
            <FaSignOutAlt className="text-lg" />
            <span className="font-semibold">Sign Out</span>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default ProfileDropdown;
