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
  FaClock,
  FaDollarSign,
  FaUser,
  FaTools,
  FaStar,
} from "react-icons/fa";

import {
  fetchNotifications,
  markNotificationsRead,
  deleteNotifications,
} from "../../../api/notifications";

// Main Notification Component
const NotificationCenter = ({ userRole = "customer", theme = "default" }) => {
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'

  // Theme configurations
  const themes = {
    default: {
      primary: "var(--accent)",
      card: "var(--card)",
      secondary: "var(--secondary)",
      text: "white",
    },
    blue: {
      primary: "#3b82f6",
      card: "#1e293b",
      secondary: "#0f172a",
      text: "white",
    },
    green: {
      primary: "#10b981",
      card: "#064e3b",
      secondary: "#022c22",
      text: "white",
    },
  };

  const currentTheme = themes[theme] || themes.default;

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

  const markAllAsRead = async () => {
    const allIds = filteredNotifications.map((n) => n.id);
    try {
      await markNotificationsRead(allIds);
      setNotifications((prev) =>
        prev.map((n) => (allIds.includes(n.id) ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const filteredNotifications =
    filter === "all"
      ? notifications
      : filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.read);

  const getNotificationIcon = (type) => {
    const iconConfig = {
      job: { icon: FaTools, color: "text-blue-400", bg: "bg-blue-500/20" },
      booking: {
        icon: FaCalendarAlt,
        color: "text-green-400",
        bg: "bg-green-500/20",
      },
      completed: {
        icon: FaCheckCircle,
        color: "text-emerald-400",
        bg: "bg-emerald-500/20",
      },
      rating: {
        icon: FaStar,
        color: "text-yellow-400",
        bg: "bg-yellow-500/20",
      },
      reminder: {
        icon: FaClock,
        color: "text-orange-400",
        bg: "bg-orange-500/20",
      },
      payment: {
        icon: FaDollarSign,
        color: "text-purple-400",
        bg: "bg-purple-500/20",
      },
      system: {
        icon: FaInfoCircle,
        color: "text-gray-400",
        bg: "bg-gray-500/20",
      },
      user: { icon: FaUser, color: "text-cyan-400", bg: "bg-cyan-500/20" },
    };

    const config = iconConfig[type] || iconConfig.system;
    const IconComponent = config.icon;

    return (
      <div className={`p-3 rounded-xl ${config.bg}`}>
        <IconComponent className={`text-lg ${config.color}`} />
      </div>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorities = {
      high: { color: "bg-red-500", text: "High" },
      medium: { color: "bg-yellow-500", text: "Medium" },
      low: { color: "bg-blue-500", text: "Low" },
    };

    const priorityConfig = priorities[priority] || priorities.low;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityConfig.color} text-white`}
      >
        {priorityConfig.text}
      </span>
    );
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

  const NotificationSkeleton = () => (
    <div className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-5 border-b border-gray-700">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gray-700 rounded-xl"></div>
            </div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 mx-auto mb-4"
            style={{ borderColor: currentTheme.primary }}
          ></div>
          <p className="text-gray-400">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-8 flex flex-col gap-6 bg-gradient-to-br from-gray-900 to-gray-800"
      style={{ backgroundColor: currentTheme.secondary }}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-4">
          <div
            className="p-3 rounded-2xl"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <FaBell className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Notifications
            </h1>
            <p className="text-gray-400 mt-1">
              {userRole === "customer"
                ? "Stay updated with your bookings"
                : "Manage your work updates"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "list"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Grid
            </button>
          </div>

          <button
            onClick={markAllAsRead}
            disabled={filteredNotifications.length === 0}
            className="px-4 py-2 rounded-xl bg-gray-700 text-white font-medium hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaCheck className="text-sm" />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Stats and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <div
          className="rounded-2xl p-6 shadow-lg border"
          style={{
            backgroundColor: currentTheme.card,
            borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {notifications.length}
              </div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {notifications.filter((n) => !n.read).length}
              </div>
              <div className="text-xs text-gray-400">Unread</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {notifications.filter((n) => n.read).length}
              </div>
              <div className="text-xs text-gray-400">Read</div>
            </div>
          </div>
        </div>

        {/* Filters and Bulk Actions */}
        <div
          className="lg:col-span-2 rounded-2xl p-6 shadow-lg border"
          style={{
            backgroundColor: currentTheme.card,
            borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full">
              <div className="relative flex items-center gap-2">
                <FaFilter className="text-gray-400" />
                <select
                  className="bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 border border-gray-700"
                  style={{ focusRingColor: currentTheme.primary }}
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
                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
                  style={{ focusRingColor: currentTheme.primary }}
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
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-500 transition-all"
                  onClick={markAsRead}
                >
                  <FaEye className="text-sm" />
                  Mark Read
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-500 transition-all"
                  onClick={deleteSelected}
                >
                  <FaTrash className="text-sm" />
                  Delete
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-600 text-gray-300 font-medium hover:bg-gray-500 transition-all"
                  onClick={() => setSelected([])}
                >
                  <FaTimes className="text-sm" />
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List/Grid */}
      <div
        className="rounded-2xl shadow-lg border overflow-hidden"
        style={{
          backgroundColor: currentTheme.card,
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        {filteredNotifications.length > 0 ? (
          viewMode === "list" ? (
            <ul className="divide-y divide-gray-700">
              {filteredNotifications.map((n) => (
                <NotificationListItem
                  key={String(n.id)}
                  notification={n}
                  selected={selected.includes(n.id)}
                  expanded={expandedId === n.id}
                  onToggleSelect={toggleSelect}
                  onToggleExpand={toggleExpand}
                  getNotificationIcon={getNotificationIcon}
                  getPriorityBadge={getPriorityBadge}
                  formatDate={formatDate}
                  themeColor={currentTheme.primary}
                />
              ))}
            </ul>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
              {filteredNotifications.map((n) => (
                <NotificationGridItem
                  key={String(n.id)}
                  notification={n}
                  selected={selected.includes(n.id)}
                  onToggleSelect={toggleSelect}
                  getNotificationIcon={getNotificationIcon}
                  getPriorityBadge={getPriorityBadge}
                  formatDate={formatDate}
                  themeColor={currentTheme.primary}
                />
              ))}
            </div>
          )
        ) : (
          <EmptyState filter={filter} />
        )}
      </div>
    </div>
  );
};

// List View Item Component
const NotificationListItem = ({
  notification: n,
  selected,
  expanded,
  onToggleSelect,
  onToggleExpand,
  getNotificationIcon,
  getPriorityBadge,
  formatDate,
  themeColor,
}) => (
  <li
    className={`p-6 transition-all duration-200 hover:bg-gray-800/30 cursor-pointer ${
      selected ? "bg-[#0e161e] border-l-4" : ""
    } ${n.read ? "opacity-70" : "bg-gray-800/10"}`}
    style={{ borderLeftColor: selected ? themeColor : "transparent" }}
    onClick={() => onToggleSelect(n.id)}
  >
    <div className="flex gap-4">
      <div className="flex-shrink-0 mt-1" onClick={(e) => e.stopPropagation()}>
        {getNotificationIcon(n.type)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <p
                className={`text-base font-semibold ${
                  n.read ? "text-gray-300" : "text-white"
                }`}
              >
                {n.title || n.message}
              </p>
              {n.priority && getPriorityBadge(n.priority)}
            </div>

            <p className="text-sm text-gray-400 mb-2">{n.message}</p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              {n.timestamp && (
                <span className="flex items-center gap-1">
                  <FaClock className="text-xs" />
                  {formatDate(n.timestamp)}
                </span>
              )}
              {n.category && (
                <span className="px-2 py-1 bg-gray-700 rounded-full">
                  {n.category}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4 flex-shrink-0">
            {!n.read && (
              <span
                className="px-2 py-1 rounded-full text-xs font-semibold text-black"
                style={{ backgroundColor: themeColor }}
              >
                New
              </span>
            )}

            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggleSelect(n.id)}
              className="w-5 h-5 rounded border-gray-600 bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
              style={{ focusRingColor: themeColor }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        {n.details && (
          <div className="mt-4">
            <button
              className="text-sm flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(n.id);
              }}
            >
              {expanded ? "Show less" : "Show details"}
              {expanded ? <FaEyeSlash /> : <FaEye />}
            </button>

            {expanded && (
              <div className="mt-3 p-4 bg-gray-800/50 rounded-lg text-sm text-gray-300">
                {n.details}
              </div>
            )}
          </div>
        )}

        {n.actions && (
          <div className="mt-4 flex gap-2">
            {n.actions.map((action, index) => (
              <button
                key={index}
                className="px-3 py-1.5 text-xs rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick && action.onClick(n.id);
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  </li>
);

// Grid View Item Component
const NotificationGridItem = ({
  notification: n,
  selected,
  onToggleSelect,
  getNotificationIcon,
  getPriorityBadge,
  formatDate,
  themeColor,
}) => (
  <div
    className={`rounded-xl p-5 border-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
      selected
        ? "border-gray-500 bg-gray-800/50"
        : "border-gray-700 bg-gray-800/30"
    } ${n.read ? "opacity-70" : "ring-2 ring-opacity-50"}`}
    style={{ ringColor: n.read ? "transparent" : themeColor }}
    onClick={() => onToggleSelect(n.id)}
  >
    <div className="flex items-start justify-between mb-3">
      {getNotificationIcon(n.type)}
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggleSelect(n.id)}
        className="w-5 h-5 rounded border-gray-600 bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
        style={{ focusRingColor: themeColor }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>

    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3
          className={`font-semibold flex-1 ${
            n.read ? "text-gray-300" : "text-white"
          }`}
        >
          {n.title || n.message}
        </h3>
        {!n.read && (
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: themeColor }}
          ></span>
        )}
      </div>

      <p className="text-sm text-gray-400 line-clamp-2">{n.message}</p>

      {n.priority && (
        <div className="flex justify-between items-center">
          {getPriorityBadge(n.priority)}
          <span className="text-xs text-gray-500">
            {formatDate(n.timestamp)}
          </span>
        </div>
      )}

      {n.actions && (
        <div className="flex gap-2 pt-2">
          {n.actions.slice(0, 2).map((action, index) => (
            <button
              key={index}
              className="px-2 py-1 text-xs rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors flex-1 text-center"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick && action.onClick(n.id);
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ filter }) => (
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
        : "You're all caught up! Everything looks clean and organized."}
    </p>
  </div>
);

export default NotificationCenter;

// Usage examples:
// For Customer: <NotificationCenter userRole="customer" theme="blue" />
// For Worker: <NotificationCenter userRole="worker" theme="green" />
