import React, { useEffect, useState } from "react";
import { FaBell, FaCheck, FaTrash, FaTimes, FaFilter } from "react-icons/fa";
import {
  fetchNotifications,
  markNotificationsRead,
  deleteNotifications,
} from "../../api/notifications";

import Notification from "../../components/common/notification/Notification";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
        console.log("Fetched notifications:", data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    loadNotifications();
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
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

  const filteredNotifications =
    filter === "all"
      ? notifications
      : filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.read);

  const getIconFromType = (type) => {
    switch (type) {
      case "job":
      case "booking":
        return "bell";
      case "completed":
      case "rating":
        return "checkcircle";
      case "reminder":
        return "clock";
      case "payment":
        return "dollar";
      default:
        return "bell";
    }
  };

  return (
    // <div className="w-full min-h-[calc(100vh-4rem)] h-full overflow-y-auto px-4 sm:px-6 py-4 flex flex-col">
    //   {/* Header */}
    //   <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-4 gap-3">
    //     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
    //       <h2 className="text-xl sm:text-2xl font-bold text-[var(--accent)] flex items-center gap-2">
    //         <FaBell /> Notifications
    //       </h2>
    //       <div className="flex items-center gap-2">
    //         <FaFilter className="text-[var(--accent)]" />
    //         <select
    //           className="bg-[var(--secondary)] text-white rounded-xl px-4 py-2 text-sm focus:outline-none border border-[var(--accent)]/10"
    //           value={filter}
    //           onChange={(e) => setFilter(e.target.value)}
    //         >
    //           <option value="all">All</option>
    //           <option value="unread">Unread</option>
    //           <option value="read">Read</option>
    //         </select>
    //       </div>
    //     </div>

    //   </div>

    //   {/* Bulk actions */}
    //   {selected.length > 0 && (
    //     <div className="flex flex-wrap gap-2 mb-4">
    //       <button
    //         className="px-3 py-1 rounded-lg bg-green-700 text-white text-xs font-semibold hover:bg-green-600 flex items-center gap-1"
    //         onClick={markAsRead}
    //       >
    //         <FaCheck /> Mark as Read
    //       </button>
    //       <button
    //         className="px-3 py-1 rounded-lg bg-red-700 text-white text-xs font-semibold hover:bg-red-600 flex items-center gap-1"
    //         onClick={deleteSelected}
    //       >
    //         <FaTrash /> Delete
    //       </button>
    //       <button
    //         className="px-3 py-1 rounded-lg bg-[var(--card)] text-white text-xs font-semibold hover:bg-[var(--secondary)] border border-gray-700 flex items-center gap-1"
    //         onClick={() => setSelected([])}
    //       >
    //         <FaTimes /> Cancel
    //       </button>
    //     </div>
    //   )}

    //   {/* Notifications list */}
    //   <div className="rounded-2xl shadow-lg p-2 sm:p-3 bg-[var(--card)]">
    //     <ul className="space-y-4">
    //       {filteredNotifications.length > 0 ? (
    //         filteredNotifications.map((n) => (
    //           <li
    //             key={String(n.id)}
    //             className={`flex items-center gap-2 sm:gap-4 rounded-xl px-4 sm:px-5 py-3 sm:py-4 shadow border transition-all cursor-pointer ${
    //               selected.includes(n.id)
    //                 ? "border-[var(--accent)] bg-[#0e161e]"
    //                 : n.read
    //                 ? "opacity-60"
    //                 : "border-transparent bg-[var(--secondary)]"
    //             }`}
    //             onClick={() => toggleSelect(n.id)}
    //           >
    //             <input
    //               type="checkbox"
    //               checked={selected.includes(n.id)}
    //               onChange={() => toggleSelect(n.id)}
    //               className="accent-[var(--accent)] w-5 h-5 flex-shrink-0"
    //               onClick={(e) => e.stopPropagation()}
    //             />
    //             <div className="flex-1">
    //               <div className="text-sm sm:text-base text-gray-100">
    //                 {n.message}
    //               </div>
    //             </div>
    //             <div className="flex items-center gap-2 flex-shrink-0">
    //               {n.read ? (
    //                 <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-700 text-gray-300">
    //                   Read
    //                 </span>
    //               ) : (
    //                 <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--accent)] text-black">
    //                   Unread
    //                 </span>
    //               )}
    //             </div>
    //           </li>
    //         ))
    //       ) : (
    //         <div className="text-center text-gray-400 py-8">
    //           No notifications.
    //         </div>
    //       )}
    //     </ul>
    //   </div>
    // </div>
    <Notification userRole="worker" theme="blue" />
  );
};

export default Notifications;
