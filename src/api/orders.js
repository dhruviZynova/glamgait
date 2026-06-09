import axiosInstance from "../Axios/axios";

export const getOrders = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await axiosInstance.get(`/getorder?${query}`);
  return res.data;
};

export const createOrder = async (orderData) => {
  const res = await axiosInstance.post("/createorder", orderData);
  return res.data;
};

export const cancelOrder = async (payload) => {
  const res = await axiosInstance.put("/cancelorder", payload);
  return res.data;
};

export const returnOrder = async (payload) => {
  const res = await axiosInstance.put("/returnorder", payload);
  return res.data;
};
