import React from "react";
import { FaBell } from "react-icons/fa";

const NavbarNotifications = ({
  notifList,
  unreadCount,
  showNotif,
  setShowNotif,
  notifRef,
  NotificationDropdown,
}) => (
  <div className="relative flex-shrink-0 min-w-0" ref={notifRef}>
    <button
      className="relative focus:outline-none p-1"
      onClick={() => setShowNotif((v) => !v)}
      aria-label="Show notifications"
    >
      <FaBell className="text-lg text-[var(--accent)]" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center h-3 w-3 rounded-full bg-[var(--accent)] text-[9px] font-bold text-black border border-[var(--card)]">
          {unreadCount}
        </span>
      )}
    </button>
    <NotificationDropdown
      notifications={notifList}
      show={showNotif}
      onClose={() => setShowNotif(false)}
    />
  </div>
);

export default NavbarNotifications;
