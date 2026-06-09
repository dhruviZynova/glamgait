import axiosInstance from "../Axios/axios";

export const getWishlist = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await axiosInstance.get(`/getwishlist?${query}`);
  return res.data;
};

export const addToWishlist = async (payload) => {
  const res = await axiosInstance.post("/addtowishlist", payload);
  return res.data;
};

export const removeFromWishlist = async (w_id) => {
  const res = await axiosInstance.post("/removewishlist", { w_id });
  return res.data;
};
