import axiosInstance from "../Axios/axios";

export const getCart = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await axiosInstance.get(`/getcart?${query}`);
  return res.data;
};

export const addToCart = async (payload) => {
  const res = await axiosInstance.post("/createcart", payload);
  return res.data;
};

export const updateCartQty = async (payload) => {
  const res = await axiosInstance.post("/updatecart", payload);
  return res.data;
};

export const removeFromCart = async (cart_id) => {
  const res = await axiosInstance.post("/removecart", { cart_id });
  return res.data;
};
