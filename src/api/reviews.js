import axiosInstance from "../Axios/axios";

export const getReviews = async (p_id) => {
  const res = await axiosInstance.post("/getuserreviews", { p_id });
  return res.data;
};

export const submitReview = async (formData) => {
  const res = await axiosInstance.post("/adduserreview", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const editReview = async (formData) => {
  const res = await axiosInstance.post("/updateuserreview", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteReview = async (r_id) => {
  const res = await axiosInstance.delete(`/deleteuserreview/${r_id}`);
  return res.data;
};
