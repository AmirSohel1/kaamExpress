import api from "./api";

const getIconFromType = (type) => {
  switch (type) {
    case "booking":
      return "bell";
    case "completed":
      return "checkcircle";
    case "reminder":
      return "clock";
    case "payment":
      return "dollar";
    default:
      return "bell";
  }
};

export const fetchNotifications = async () => {
  const res = await api.get("/notifications");

  return res.data.map((n) => ({
    id: n.id || n._id?.toString(), // ensure unique string key
    message: n.message,
    read: n.read === true || n.status === "read", // normalize to boolean
    time: new Date(n.createdAt).toLocaleString(),
    icon: getIconFromType(n.type),
  }));
};

export const markNotificationsRead = async (ids) => {
  await api.put("/notifications/read", { ids });
};

export const deleteNotifications = async (ids) => {
  await api.delete("/notifications", { data: { ids } });
};
