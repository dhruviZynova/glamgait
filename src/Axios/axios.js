import axios from "axios";
import { ApiURL, userInfo } from "../Variable";
import loaderService from "../utils/loaderService";

const userData = userInfo();

const axiosInstance = axios.create({
  baseURL: `${ApiURL}`,
  headers: {
    Authorization: `Bearer ${userData?.token || userData?.auth_token}`,
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.skipLoader) loaderService.show();
    // Get fresh user data for each request
    const freshUserData = userInfo();
    config.headers["Authorization"] = `Bearer ${freshUserData?.token || freshUserData?.auth_token}`;

    const multipartAPIs = [
      "/insertproduct",
      "/updateproduct",
      "/addcategory",
      "/updatecategory",
      "/adddynamicimages",
    ];
    if (multipartAPIs.some((api) => config.url.includes(api))) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (!response.config.skipLoader) loaderService.hide();
    return response;
  },
  (error) => {
    if (!error.config?.skipLoader) loaderService.hide();
    console.log("Axios error:", error?.response?.data);
    if (error?.response?.data?.status === 403) {
      console.log("403 error detected, checking if user data exists...");
      const currentUserData = userInfo();
      if (!currentUserData) {
        console.log("No user data found, redirecting to login");
        localStorage.removeItem("GlamGait");
        window.location.href = "/login";
      } else {
        console.log("User data exists but got 403 - possible permission issue");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
