// Create a new booking
// API service for bookings

import api from "./api";
export const createBooking = async (bookingData) => {
  const res = await api.post("/bookings", bookingData);
  return res.data;
};
export const fetchBookings = async () => {
  const res = await api.get("/bookings");
  // console.log(res.data);
  return res.data;
};

export const fetchBookingById = async (id) => {
  const res = await api.get(`/bookings/${id}`);
  return res.data;
};
export const deleteBookingById = async (id) => {
  const res = await api.delete(`/bookings/${id}`);
  return res.data;
};
export const updateBookingById = async (id, data) => {
  const res = await api.put(`/bookings/${id}`, data);
  return res.data;
};
export const fetchBookingsById = async (id) => {
  const res = await api.get(`/bookings/${id}`);
  return res.data; // this is same as fetchBookingById
};
