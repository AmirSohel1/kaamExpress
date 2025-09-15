// src/pages/customer/Notifications.jsx
import React, { useEffect, useState } from "react";
import {
  FaBell,
  FaCheckCircle,
  FaRegClock,
  FaTrashAlt,
  FaCheck,
} from "react-icons/fa";
import {
  fetchNotifications,
  markNotificationsRead,
  deleteNotifications,
} from "../../api/notifications";

// Map normalized `icon` field → actual icon component
const getNotificationIcon = (icon) => {
  switch (icon) {
    case "bell":
      return <FaBell className="text-[var(--accent)]" />;
    case "checkcircle":
      return <FaCheckCircle className="text-green-400" />;
    case "clock":
      return <FaRegClock className="text-gray-400" />;
    default:
      return <FaBell className="text-[var(--accent)]" />;
  }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const allSelected =
    selected.length === notifications.length && notifications.length > 0;

  const handleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );

  const handleSelectAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(notifications.map((n) => n.id));
  };

  const handleMarkRead = async () => {
    try {
      await markNotificationsRead(selected);
      setNotifications((prev) =>
        prev.map((n) => (selected.includes(n.id) ? { ...n, read: true } : n))
      );
      setSelected([]);
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNotifications(selected);
      setNotifications((prev) => prev.filter((n) => !selected.includes(n.id)));
      setSelected([]);
    } catch (err) {
      console.error("Failed to delete notifications:", err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Loading notifications...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-full overflow-y-auto px-4 sm:px-6 py-4 flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-bold">Notifications</h1>
      <p className="text-gray-400 text-sm sm:text-base">
        Stay updated with the latest activities
      </p>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-4 flex-1">
          <button
            className="text-sm text-[var(--accent)] font-semibold hover:underline"
            onClick={handleSelectAll}
          >
            {allSelected ? "Unselect All" : "Select All"}
          </button>
          <span className="text-gray-400 text-sm">
            {selected.length} selected
          </span>
        </div>
        <div className="flex gap-2 sm:gap-3 flex-1 sm:flex-initial">
          <button
            className={`px-3 py-2 rounded-lg border border-[var(--accent)] text-[var(--accent)] text-sm font-semibold flex items-center justify-center gap-2 transition shadow w-full sm:w-auto ${
              selected.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[var(--accent)]/10"
            }`}
            onClick={handleMarkRead}
            disabled={selected.length === 0}
          >
            <FaCheck /> Mark as Read
          </button>
          <button
            className={`px-3 py-2 rounded-lg bg-red-600/80 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition w-full sm:w-auto ${
              selected.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-700"
            }`}
            onClick={handleDelete}
            disabled={selected.length === 0}
          >
            <FaTrashAlt /> Delete
          </button>
          <button
            className="px-3 py-2 rounded-lg bg-[var(--accent)] text-black text-sm font-semibold flex items-center justify-center gap-2 shadow transition hover:bg-[var(--accent)]/80 w-full sm:w-auto"
            onClick={() => {
              const csv = [
                ["Message", "Time", "Read"],
                ...notifications.map((n) => [
                  `"${n.message}"`,
                  `"${n.time}"`,
                  n.read ? "Yes" : "No",
                ]),
              ]
                .map((row) => row.join(","))
                .join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "customer_notifications.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl shadow-lg p-2 sm:p-3 bg-[var(--card)]">
        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`flex flex-col sm:flex-row bg-[var(--secondary)] items-start sm:items-center gap-2 sm:gap-4 rounded-xl px-4 sm:px-5 py-3 sm:py-4 shadow border transition-all ${
                  selected.includes(n.id)
                    ? "border-[var(--accent)]"
                    : "border-transparent"
                }`}
              >
                <div className="flex items-center w-full sm:w-auto">
                  <input
                    type="checkbox"
                    checked={selected.includes(n.id)}
                    onChange={() => handleSelect(n.id)}
                    className="accent-[var(--accent)] w-5 h-5 mr-2 flex-shrink-0"
                  />
                  <span className="text-xl flex-shrink-0 mr-4">
                    {getNotificationIcon(n.icon)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base text-gray-100">
                      {n.message}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                  </div>
                </div>
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)]  flex-shrink-0 hidden sm:block"></span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-400 py-8">
            No new notifications.
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
