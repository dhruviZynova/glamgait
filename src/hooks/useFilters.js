import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../Axios/axios";
import { ApiURL } from "../Variable";

export function useProductFilters(cateName) {
  return useQuery({
    queryKey: ["productFilters", cateName],
    queryFn: async () => {
      let categoryId = 2; // Default fallback
      let categoryDisplayName = "All Products";

      // If we have a category name, fetch the category ID first
      if (cateName && cateName !== "All Products") {
        try {
          const res = await axiosInstance.get(`/getcategorybyname/${cateName}`);
          if (res?.data?.status === 1 && res?.data?.data) {
            categoryId = res.data.data.cate_id;
            categoryDisplayName = res.data.data.cate_name || cateName;
          }
        } catch (err) {
          console.error("Error looking up category ID:", err);
        }
      }

      // Safe get helper for filter API requests
      const safeGet = async (url) => {
        try {
          const res = await axiosInstance.get(url);
          return res?.data?.data || [];
        } catch (err) {
          console.warn(`Filter fetch skipped for ${url}:`, err.message);
          return [];
        }
      };

      // Fetch all filter options in parallel
      const [
        categories,
        colors,
        subcategories,
        fabrics,
        works,
        occasions,
        styles,
        sizes,
      ] = await Promise.all([
        safeGet("/getcategory"),
        safeGet("/getcolor"),
        cateName && cateName !== "All Products"
          ? safeGet(`${ApiURL}/getsubcategory/${categoryId}`)
          : Promise.resolve([]),
        safeGet(`${ApiURL}/getfabrics/${categoryId}`),
        safeGet(`${ApiURL}/getworks/${categoryId}`),
        safeGet(`${ApiURL}/getoccasions/${categoryId}`),
        safeGet(`${ApiURL}/getstyles/${categoryId}`),
        safeGet(`${ApiURL}/getsize/${categoryId}`),
      ]);

      return {
        categoryId,
        categoryDisplayName,
        categories,
        colors,
        subcategories,
        fabrics,
        works,
        occasions,
        styles,
        sizes,
      };
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
