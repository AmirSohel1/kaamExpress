import api from "./api";

// Get all jobs assigned to the current worker
export async function getWorkerJobs() {
  const res = await api.get("/bookings");
  console.log("Fetched jobs:", res.data); // Debug log
  return res.data.bookings || [];
}

// Update job status (worker only allowed to update status/notes)
export async function updateJobStatus(id, status) {
  const res = await api.put(`/bookings/${id}`, status);
  // console.log(res.data);
  return res.data;
}
