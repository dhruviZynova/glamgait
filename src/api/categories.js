import axiosInstance from "../Axios/axios";

export const getCategories = async () => {
  const res = await axiosInstance.get("/getcategory");
  return res.data;
};
