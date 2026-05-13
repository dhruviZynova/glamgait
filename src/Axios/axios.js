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

    // Don't override Authorization if it's already set in the request
    if (!config.headers.Authorization) {
      // Check if we're on an admin route and use admin token
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      if (isAdminRoute) {
        const adminData = localStorage.getItem("GlamGaitAdmin");
        const parsedAdminData = adminData ? JSON.parse(adminData) : null;
        const adminToken = parsedAdminData?.token || parsedAdminData?.auth_token;
        config.headers["Authorization"] = `Bearer ${adminToken}`;
      } else {
        const freshUserData = userInfo();
        config.headers["Authorization"] = `Bearer ${freshUserData?.token || freshUserData?.auth_token}`;
      }
    }

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
        // window.location.href = "/login";
      } else {
        console.log("User data exists but got 403 - possible permission issue");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
