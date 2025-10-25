import api from "./api";

/**
 * Fetch all bookings for the current worker
 * Returns an array of earnings with standardized fields:
 * - jobId
 * - amount
 * - status ("Paid" or "Pending")
 * - customer, service, date, location, billing, notes
 */
export async function getWorkerEarnings() {
  try {
    const res = await api.get("/bookings");
    const bookings = res.data.bookings;
    // Filter out invalid bookings
    // console.log("Fetched bookings:", bookings);
    return bookings;
  } catch (error) {
    console.error("Error fetching worker earnings:", error);
    throw new Error("Failed to fetch earnings");
  }
}

/**
 * Mark a specific booking as paid
 * @param {string} jobId
 * @returns updated booking
 */
export async function markEarningPaid(jobId) {
  try {
    const res = await api.put(`/bookings/${jobId}`, { isPaid: true });
    const b = res.data;

    // Return standardized object for frontend
    return {
      jobId: b._id,
      amount: b.price,
      status: b.isPaid ? "Paid" : "Pending",
      customer: b.customer || {},
      service: b.service || {},
      date: b.date,
      location: b.location || "-",
      billing: b.billing || "-",
      notes: b.notes || "",
    };
  } catch (error) {
    console.error("Error marking earning as paid:", error);
    throw new Error("Failed to mark as paid");
  }
}
