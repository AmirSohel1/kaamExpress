import React, { useEffect, useState } from "react";
import {
  FaBell,
  FaCheck,
  FaTrash,
  FaTimes,
  FaFilter,
  FaDownload,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  fetchNotifications,
  markNotificationsRead,
  deleteNotifications,
} from "../../api/notifications";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selected.length === filteredNotifications.length) {
      setSelected([]);
    } else {
      setSelected(filteredNotifications.map((n) => n.id));
    }
  };

  const markAsRead = async () => {
    if (selected.length === 0) return;
    try {
      await markNotificationsRead(selected);
      setNotifications((prev) =>
        prev.map((n) => (selected.includes(n.id) ? { ...n, read: true } : n))
      );
      setSelected([]);
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  const deleteSelected = async () => {
    if (selected.length === 0) return;
    try {
      await deleteNotifications(selected);
      setNotifications((prev) => prev.filter((n) => !selected.includes(n.id)));
      setSelected([]);
    } catch (err) {
      console.error("Failed to delete notifications", err);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredNotifications =
    filter === "all"
      ? notifications
      : filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.read);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "job":
      case "booking":
        return <FaBell className="text-blue-400" />;
      case "completed":
      case "rating":
        return <FaCheckCircle className="text-green-400" />;
      case "reminder":
        return <FaCalendarAlt className="text-yellow-400" />;
      case "payment":
        return <FaExclamationCircle className="text-purple-400" />;
      default:
        return <FaInfoCircle className="text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const exportToCSV = () => {
    const csv = [
      ["Message", "Read", "Date"],
      ...filteredNotifications.map((n) => [
        `"${n.message}"`,
        n.read ? "Yes" : "No",
        n.timestamp ? formatDate(n.timestamp) : "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notifications.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-8 flex flex-col gap-6 bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-[var(--accent)] rounded-xl">
              <FaBell className="text-xl text-black" />
            </div>
            Notifications
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your notifications and stay updated
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          onClick={exportToCSV}
        >
          <FaDownload className="text-sm" />
          Export
        </button>
      </div>

      {/* Filters and Bulk Actions */}
      <div className="bg-[var(--card)] rounded-2xl p-4 shadow-lg border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full">
            <div className="relative flex items-center gap-2">
              <FaFilter className="text-[var(--accent)]" />
              <select
                className="bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] border border-gray-700"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  selected.length > 0 &&
                  selected.length === filteredNotifications.length
                }
                onChange={selectAll}
                className="accent-[var(--accent)] w-5 h-5"
              />
              <span className="text-sm text-gray-300">
                {selected.length > 0
                  ? `${selected.length} selected`
                  : "Select all"}
              </span>
            </div>
          </div>

          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-700 text-white font-medium hover:bg-green-600 transition-all"
                onClick={markAsRead}
              >
                <FaEye className="text-sm" />
                Mark Read
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all"
                onClick={deleteSelected}
              >
                <FaTrash className="text-sm" />
                Delete
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-700 text-gray-300 font-medium hover:bg-gray-600 transition-all"
                onClick={() => setSelected([])}
              >
                <FaTimes className="text-sm" />
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl shadow-lg bg-[var(--card)] border border-gray-700 overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <ul className="divide-y divide-gray-700">
            {filteredNotifications.map((n) => (
              <li
                key={String(n.id)}
                className={`p-5 transition-all duration-200 hover:bg-gray-800/30 ${
                  selected.includes(n.id)
                    ? "bg-[#0e161e] border-l-4 border-l-[var(--accent)]"
                    : ""
                } ${n.read ? "opacity-80" : "bg-gray-800/20"}`}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="p-2.5 rounded-xl bg-gray-800">
                      {getNotificationIcon(n.type)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            n.read ? "text-gray-300" : "text-white"
                          }`}
                        >
                          {n.message}
                        </p>
                        {n.timestamp && (
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDate(n.timestamp)}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 ml-4">
                        {!n.read && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--accent)] text-black">
                            New
                          </span>
                        )}

                        <input
                          type="checkbox"
                          checked={selected.includes(n.id)}
                          onChange={() => toggleSelect(n.id)}
                          className="accent-[var(--accent)] w-5 h-5 flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    {n.details && (
                      <div className="mt-3">
                        <button
                          className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1"
                          onClick={() => toggleExpand(n.id)}
                        >
                          {expandedId === n.id ? "Show less" : "Show details"}
                        </button>

                        {expandedId === n.id && (
                          <div className="mt-2 p-3 bg-gray-800/50 rounded-lg text-sm text-gray-300">
                            {n.details}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gray-800 rounded-full">
                <FaBell className="text-3xl text-gray-500" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-1">
              No notifications found
            </h3>
            <p className="text-gray-500">
              {filter !== "all"
                ? `No ${filter} notifications at the moment`
                : "You're all caught up!"}
            </p>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-[var(--card)] rounded-2xl p-4 shadow-lg border border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-800/30 rounded-xl">
            <div className="text-2xl font-bold text-white">
              {notifications.length}
            </div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
          <div className="text-center p-3 bg-gray-800/30 rounded-xl">
            <div className="text-2xl font-bold text-white">
              {notifications.filter((n) => !n.read).length}
            </div>
            <div className="text-xs text-gray-400">Unread</div>
          </div>
          <div className="text-center p-3 bg-gray-800/30 rounded-xl">
            <div className="text-2xl font-bold text-white">
              {notifications.filter((n) => n.read).length}
            </div>
            <div className="text-xs text-gray-400">Read</div>
          </div>
          <div className="text-center p-3 bg-gray-800/30 rounded-xl">
            <div className="text-2xl font-bold text-white">
              {notifications.filter((n) => n.type === "booking").length}
            </div>
            <div className="text-xs text-gray-400">Bookings</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
