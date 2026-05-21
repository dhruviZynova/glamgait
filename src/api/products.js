import axiosInstance from "../Axios/axios";

export const getProducts = async (params = {}) => {
  const res = await axiosInstance.get("/getproducts", { params });
  return res.data;
};

export const getProductBySlug = async (slug) => {
  const res = await axiosInstance.get(`/getproductbyname/${slug}`);
  return res.data;
};

export const getLatestArrivals = async () => {
  const res = await axiosInstance.get("/getlatestarrivals");
  return res.data;
};

export const getReviewsSummaryForMultiple = async (p_ids) => {
  const res = await axiosInstance.post("/getreviewsformultiple", { p_ids });
  return res.data;
};
