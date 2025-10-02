import api from "./api";

// Get ratings for the current worker
export async function getWorkerRatings() {
  const res = await api.get("/workers/me/profile");
  const ratings = res.data.ratings || [];
  //
  console.log(ratings);
  return ratings;
}
