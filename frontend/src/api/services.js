// API service for services

import api from "./api";

export const fetchServices = async () => {
  const res = await api.get("/services");
  // console.log(res.data);
  return res.data;
};

// these functions are for admin to add, update, delete services
export const addService = async (data) => {
  const res = await api.post("/services", data);
  // console.log(res.data);
  return res.data;
};

export const updateService = async (id, data) => {
  const res = await api.put(`/services/${id}`, data);
  // console.log(res.data);
  return res.data;
};
export const deleteService = async (id) => {
  const res = await api.delete(`/services/${id}`);
  // console.log(res.data);
  return res.data;
};
