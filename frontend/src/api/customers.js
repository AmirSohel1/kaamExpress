// Fetch customer by userId
export const fetchCustomerByUserId = async (userId) => {
  const res = await api.get(`/customers/user/${userId}`);
  return res.data;
};
// API service for customers

import api from "./api";

export const fetchCustomers = async () => {
  const res = await api.get("/customers");
  // console.log(res.data);
  return res.data;
};
// Add more customer-related API calls as needed
export const fetchCustomerById = async (id) => {
  const res = await api.get(`/customers/${id}`);
  return res.data;
};
// Add more customer-related API calls as needed
