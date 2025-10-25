import api from "./api";

// API service for reviews
export const fetchReviewsByWorker = async (workerId) => {
  const res = await api.get(`/review/worker/${workerId}`);
  return res.data;
};
export const fetchReviews = async () => {
  const res = await api.get("/review/all");
  // console.log(res.data);
  return res.data;
};
export const createReview = async (data) => {
  const res = await api.post("/review/create", data);
  return res.data;
};
// Add more review-related API calls as needed
