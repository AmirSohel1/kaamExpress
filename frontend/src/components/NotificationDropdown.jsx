import React from "react";
import {
  FaBell,
  FaCheckCircle,
  FaRegClock,
  FaUser,
  FaExclamationTriangle,
} from "react-icons/fa";

// Map notification type to icon and color
const notifTypeIcon = {
  booking: <FaBell className="text-[var(--accent)]" />,
  dispute: <FaExclamationTriangle className="text-yellow-400" />,
  worker: <FaUser className="text-cyan-400" />,
  status: <FaCheckCircle className="text-green-400" />,
  payment: <FaCheckCircle className="text-cyan-400" />,
  job: <FaBell className="text-[var(--accent)]" />,
  rating: <FaCheckCircle className="text-yellow-400" />,
};

export default function NotificationDropdown({
  notifications = [],
  show,
  onClose,
}) {
  return (
    show && (
      <div className="absolute right-0 mt-2 w-80 bg-[var(--card)] rounded-xl shadow-lg z-50 border border-[var(--accent)]/20">
        <div className="p-4 border-b border-[var(--accent)]/20 font-semibold text-[var(--accent)] flex items-center gap-2">
          <FaBell className="text-lg" /> Notifications
        </div>
        <ul className="max-h-64 overflow-y-auto divide-y divide-[var(--accent)]/10">
          {notifications.length === 0 && (
            <li className="p-4 text-gray-400 text-sm">No notifications</li>
          )}
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`p-4 flex items-center gap-3 ${
                !n.read ? "bg-[var(--secondary)]/80" : ""
              }`}
            >
              <span className="text-xl">
                {notifTypeIcon[n.type] || <FaBell />}
              </span>
              <span className="flex-1 text-sm text-white">{n.message}</span>
              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] inline-block"></span>
              )}
            </li>
          ))}
        </ul>
      </div>
    )
  );
}
