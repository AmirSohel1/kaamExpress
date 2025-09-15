import api from "./api";

// Get all jobs assigned to the current worker
export async function getWorkerJobs() {
  const res = await api.get("/bookings");
  console.log(res.data);
  // Map backend booking to frontend job shape
  return res.data.map((b) => ({
    id: b._id,
    service: b.service?.name || "",
    customer: b.customer?.name || "",
    status: b.status?.toLowerCase() || "pending",
    // Add more fields as needed
  }));
}

// Update job status (worker only allowed to update status/notes)
export async function updateJobStatus(id, status) {
  const res = await axios.put(`/bookings/${id}`, { status });
  console.log(res.data);
  return res.data;
}
