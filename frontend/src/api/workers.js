import api from "./api";
// Fetch public worker profile by ID (for customers)
export const fetchWorkerProfilePublic = async (workerId) => {
  const res = await api.get(`/workers/public/${workerId}`);
  return res.data;
};
// API service for workers

export const fetchWorkers = async () => {
  const res = await api.get("/workers");
  // console.log(res.data);
  return res.data;
};
export const registerWorker = async (data) => {
  const res = await api.post("/workers", data);
  return res.data;
};
export const updateWorker = async (workerId, data) => {
  const res = await api.put(`/workers/${workerId}`, data);
  return res.data;
};
export const deleteWorker = async (workerId) => {
  const res = await api.delete(`/workers/${workerId}`);
  return res.data;
};
