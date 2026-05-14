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

      // 1. CSRF Protection: Automatically read XSRF-TOKEN from cookies and add to header
      const xsrfToken = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];
      if (xsrfToken) {
        config.headers["X-XSRF-TOKEN"] = xsrfToken;
      }

      // 2. Hybrid Auth: Prioritize HttpOnly cookies (via withCredentials) 
      // Fallback to Header only if necessary, ensuring no sensitive data is leaked
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
    async (error) => {
      if (!error.config?.skipLoader) loaderService.hide();
      
      const originalRequest = error.config;

      // Handle Token Expiry (401 Unauthorized)
      if (error?.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        /* 
         * TOKEN REFRESH LOGIC PLACEHOLDER
         * Implementation depends on backend support for /refresh-token
         * 
         * try {
         *   const refreshResponse = await axios.post(`${ApiURL}/refresh-token`, { refreshToken: getRefreshToken() });
         *   const newToken = refreshResponse.data.token;
         *   saveNewToken(newToken);
         *   originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
         *   return instance(originalRequest);
         * } catch (refreshError) {
         *   localStorage.removeItem(storageKey);
         *   window.location.href = '/login';
         * }
         */

        localStorage.removeItem(storageKey);
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      // Handle Forbidden (403)
      if (error?.response?.status === 403 || error?.response?.data?.status === 403) {
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
export const userAxios = axios.create({ 
  baseURL: ApiURL,
  withCredentials: true // Enable sending cookies (HttpOnly) with every request
});
setupInterceptors(userAxios, userInfo, "GlamGait");

// 2. Admin Instance (Specifically for admin panel)
export const adminAxios = axios.create({ 
  baseURL: ApiURL,
  withCredentials: true 
});
setupInterceptors(adminAxios, adminInfo, "GlamGaitAdmin");

// Export userAxios as the default axiosInstance for backward compatibility
const axiosInstance = userAxios;
export default axiosInstance;
