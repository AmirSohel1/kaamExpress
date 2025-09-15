import api from "./api";

// Get all earnings for the current worker
export async function getWorkerEarnings() {
  const res = await api.get("/bookings");
  // Only include bookings with a price and status
  return res.data
    .filter((b) => b.price && b.worker && b.status)
    .map((b) => ({
      jobId: b._id,
      amount: b.price,
      status:
        b.status.toLowerCase() === "completed"
          ? b.paid
            ? "Paid"
            : "Pending"
          : "Pending",
      // Optionally add more fields
    }));
}

// Mark earning as paid (admin/worker action)
export async function markEarningPaid(jobId) {
  // This assumes a PATCH/PUT endpoint to update paid status; adjust as needed
  const res = await api.put(`/bookings/${jobId}`, { paid: true });
  return res.data;
}
