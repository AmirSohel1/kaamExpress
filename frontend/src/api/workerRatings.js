import api from "./api";

// Get ratings for the current worker
export async function getWorkerRatings() {
  const res = await api.get("/workers/me/profile");
  const ratings = res.data.ratings || [];
  // Map to frontend shape
  return ratings.map((r) => ({
    customer: r.customer?.name || r.customer || "",
    stars: r.stars,
    comment: r.comment,
    date: r.date ? new Date(r.date).toLocaleDateString() : "",
  }));
}
