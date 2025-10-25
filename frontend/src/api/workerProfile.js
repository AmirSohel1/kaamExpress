import api from "./api";

// Get current worker profile
export async function getWorkerProfile() {
  const res = await api.get("/workers/me/profile");
  // console.log(res.data);
  return res.data;
}

// Update current worker profile
export async function updateWorkerProfile(id, data) {
  const res = await api.put(`/workers/${id}`, data);
  return res.data;
}

export async function verifyWorker(id) {
  const res = await api.put(`/workers/verifyWorker/${id}`);
  return res.data;
}
export async function RejectWorker(id) {
  const res = await api.put(`/workers/rejectWorker/${id}`);
  return res.data;
}
