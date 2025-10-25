// API service for payments
import api from "./api";

export const fetchPayments = async () => {
  const res = await api.get("/payments/");
  // console.log("Response from /payments:", res.data);
  // console.log("Response from /payments/admin:", res.data);
  return res.data;
};

export const fetchPaymentById = async (id) => {
  const res = await api.get(`/payments/${id}`);
  return res.data;
};

export const createPayment = async (id, data) => {
  const res = await api.post(`/payments/${id}`, data);
  return res.data;
};

export const updatePayment = async (id, data) => {
  const res = await api.put(`/payments/${id}`, data);
  console.log(res.data);
  return res.data;
};

export const deletePayment = async (id) => {
  const res = await api.delete(`/payments/${id}`);
  return res.data;
};
