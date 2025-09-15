// API service for disputes
import api from "./api";

export const fetchDisputes = async () => {
  const res = await api.get("/disputes");
  return res.data;
};

export const fetchDisputeById = async (id) => {
  const res = await api.get(`/disputes/${id}`);
  return res.data;
};

export const createDispute = async (data) => {
  const res = await api.post("/disputes", data);
  return res.data;
};

export const updateDispute = async (id, data) => {
  const res = await api.put(`/disputes/${id}`, data);
  return res.data;
};

export const deleteDispute = async (id) => {
  const res = await api.delete(`/disputes/${id}`);
  return res.data;
};
