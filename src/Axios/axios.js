import axios from "axios";
import { ApiURL, userInfo, adminInfo } from "../Variable";
import loaderService from "../utils/loaderService";

const multipartAPIs = [
  "/insertproduct",
  "/updateproduct",
  "/addcategory",
  "/updatecategory",
  "/adddynamicimages",
];

/**
 * Common interceptor setup for both User and Admin instances
 */
const setupInterceptors = (instance, infoGetter, storageKey) => {
  instance.interceptors.request.use(
    (config) => {
      if (!config.skipLoader) loaderService.show();

      // Don't override Authorization if it's already set in the request
      if (!config.headers.Authorization) {
        const data = infoGetter();
        if (data?.token || data?.auth_token) {
          config.headers["Authorization"] = `Bearer ${data.token || data.auth_token}`;
        }
      }

      // Handle Multipart APIs
      if (multipartAPIs.some((api) => config.url.includes(api))) {
        config.headers["Content-Type"] = "multipart/form-data";
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => {
      if (!response.config.skipLoader) loaderService.hide();
      return response;
    },
    (error) => {
      if (!error.config?.skipLoader) loaderService.hide();
      if (error?.response?.data?.status === 403) {
        const currentData = infoGetter();
        if (!currentData) {
          localStorage.removeItem(storageKey);
        }
      }
      return Promise.reject(error);
    }
  );
};

// 1. User Instance (Default for client-side)
export const userAxios = axios.create({ baseURL: ApiURL });
setupInterceptors(userAxios, userInfo, "GlamGait");

// 2. Admin Instance (Specifically for admin panel)
export const adminAxios = axios.create({ baseURL: ApiURL });
setupInterceptors(adminAxios, adminInfo, "GlamGaitAdmin");

// Export userAxios as the default axiosInstance for backward compatibility
const axiosInstance = userAxios;
export default axiosInstance;
