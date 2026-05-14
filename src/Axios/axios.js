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

const publicAPIs = [
  "/getannouncements",
  "/getcategory",
  "/getsubcategory",
  "/getfabrics",
  "/getworks",
  "/getoccasions",
  "/getstyles",
  "/getsize",
  "/getalluserreviews",
  "/getproducts",
  "/getproductdetails",
];

// Normalize ApiURL: Remove trailing slash if present to prevent double-slashes in requests
const normalizedApiURL = ApiURL?.endsWith("/") ? ApiURL.slice(0, -1) : ApiURL;

/**
 * Common interceptor setup for both User and Admin instances
 */
const setupInterceptors = (instance, infoGetter, storageKey) => {
  instance.interceptors.request.use(
    (config) => {
      if (!config.skipLoader) loaderService.show();

      // Ensure URL is normalized if it's relative
      if (config.url && !config.url.startsWith("http")) {
        config.url = config.url.startsWith("/") ? config.url : `/${config.url}`;
      }

      // 1. CSRF Protection
      const xsrfToken = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];
      if (xsrfToken) {
        config.headers["X-XSRF-TOKEN"] = xsrfToken;
      }

      // 2. Auth Header: Only add for non-public routes OR if manually provided
      const isPublic = publicAPIs.some(api => config.url.includes(api));

      if (!config.headers.Authorization && !isPublic) {
        const data = infoGetter();
        const token = data?.token || data?.auth_token;
        if (token && String(token).trim() !== "" && String(token) !== "undefined" && String(token) !== "null") {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }

      // Handle Multipart APIs
      if (config.url && multipartAPIs.some((api) => config.url.includes(api))) {
        config.headers["Content-Type"] = "multipart/form-data";
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => {
      loaderService.hide();
      return response;
    },
    (error) => {
      loaderService.hide();

      // Handle Token Expiry (401 Unauthorized)
      if (error?.response?.status === 401) {
        localStorage.removeItem(storageKey);
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      return Promise.reject(error);
    }
  );
};

// Create User Instance
export const userAxios = axios.create({
  baseURL: normalizedApiURL,
  withCredentials: true
});

// Create Admin Instance
export const adminAxios = axios.create({
  baseURL: normalizedApiURL,
  withCredentials: true
});

// Apply Interceptors
setupInterceptors(userAxios, userInfo, "GlamGait");
setupInterceptors(adminAxios, adminInfo, "GlamGaitAdmin");

// Standard headers - Move Content-Type to specific methods to avoid 400 on GET/DELETE
const commonHeaders = {
  "Accept": "application/json",
};

[userAxios, adminAxios].forEach(instance => {
  Object.assign(instance.defaults.headers.common, commonHeaders);
  instance.defaults.headers.post["Content-Type"] = "application/json";
  instance.defaults.headers.put["Content-Type"] = "application/json";
  instance.defaults.headers.patch["Content-Type"] = "application/json";
});

const axiosInstance = userAxios;
export default axiosInstance;
