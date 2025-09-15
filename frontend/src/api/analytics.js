// API service for analytics
import api from "./api";

export const fetchDashboardStats = async () => {
  const res = await api.get("/analytics/dashboard");
  return res.data;
};
