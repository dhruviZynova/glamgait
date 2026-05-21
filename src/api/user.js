import axiosInstance from "../Axios/axios";

export const login = async (payload) => {
  const res = await axiosInstance.post("/userlogin", payload);
  return res.data;
};

export const signup = async (payload) => {
  const res = await axiosInstance.post("/userregister", payload);
  return res.data;
};

export const getUserProfile = async (u_id) => {
  const res = await axiosInstance.get(`/user/${u_id}`);
  return res.data;
};

export const updateUserProfile = async (u_id, payload) => {
  const res = await axiosInstance.put(`/user/${u_id}`, payload);
  return res.data;
};

export const getAddresses = async (payload) => {
  const res = await axiosInstance.post("/getaddress", payload);
  return res.data;
};

export const deleteAddress = async (add_id) => {
  const res = await axiosInstance.delete(`/deleteaddress/${add_id}`);
  return res.data;
};
