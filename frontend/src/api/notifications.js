import api from "./api";

// Helper to map backend notification type → frontend icon key
const getIconFromType = (type) => {
  switch (type) {
    case "booking":
      return "bell"; // <FaBell />
    case "completed":
      return "checkcircle"; // <FaCheckCircle />
    case "reminder":
      return "clock"; // <FaRegClock />
    default:
      return "bell";
  }
};

export const fetchNotifications = async () => {
  const res = await api.get("/notifications");

  // Normalize backend response to frontend shape
  return res.data.map((n) => ({
    id: n._id, // map MongoDB _id → id
    message: n.message,
    read: n.read,
    time: new Date(n.createdAt).toLocaleString(), // convert timestamp
    icon: getIconFromType(n.type),
  }));
};

export const markNotificationsRead = async (ids) => {
  await api.put("/notifications/read", { ids });
};

export const deleteNotifications = async (ids) => {
  await api.delete("/notifications", { data: { ids } });
};
