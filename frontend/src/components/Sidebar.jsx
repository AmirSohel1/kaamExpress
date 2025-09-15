// Sidebar.js (Corrected and complete)
import React from "react";
import { FaChevronDown } from "react-icons/fa";
import Avatar from "react-avatar";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ items = [], role = "Customer", onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <aside className="h-full w-64 bg-[var(--card)] border-r border-[var(--accent)]/20 flex flex-col justify-between fixed top-0 left-0 z-50 min-h-screen shadow-xl">
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Brand and profile avatar in a row at the top */}
        <div className="flex items-center gap-3 px-6 pt-4 pb-4 relative">
          {/* Close button for mobile */}
          {onClose && (
            <button
              className="absolute right-0 top-0 mt-2 mr-2 text-gray-400 hover:text-[var(--accent)] md:hidden"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              &times;
            </button>
          )}
          <Avatar
            name="K"
            size="48"
            round={true}
            fgColor="#fff"
            color="#00bcd4"
          />
          <div className="flex flex-col items-start">
            <div className="font-bold text-xl leading-tight">KaamExpress</div>
            <div className="text-xs text-gray-400 leading-tight">
              Daily Worker Platform
            </div>
          </div>
        </div>
        <div className="px-6 mb-4">
          <div className="flex items-center bg-[var(--secondary)] rounded px-3 py-2 cursor-pointer text-sm font-medium text-white border border-[var(--accent)]/30">
            {role}
          </div>
        </div>
        <nav className="flex flex-col gap-1 px-2">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                if (onClose) onClose();
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 
        ${
          location.pathname === item.path
            ? "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] text-[var(--primary)] shadow-lg"
            : "text-gray-200 hover:bg-[var(--secondary)] hover:text-[var(--accent)]"
        }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="px-6 py-4 text-xs text-gray-500 border-t border-[var(--accent)]/20">
        KaamExpress v1.0 <br />© 2025 All rights reserved
      </div>
    </aside>
  );
};

export default Sidebar;
