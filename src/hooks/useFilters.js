import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../Axios/axios";
import { ApiURL } from "../Variable";

export function useProductFilters(cateName) {
  return useQuery({
    queryKey: ["productFilters", cateName],
    queryFn: async () => {
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

      const categories = await safeGet("/getcategory");
      let categoryId = 2; // Default fallback
      let categoryDisplayName = "All Products";

      if (cateName && cateName !== "All Products") {
        const matched = categories.find(
          (c) => c.cate_name?.toLowerCase() === cateName.toLowerCase()
        );
        if (matched) {
          categoryId = matched.cate_id;
          categoryDisplayName = matched.cate_name;
        } else {
          // If not found in the list, try the direct api lookup as a fallback
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
      }

      // Fetch the rest of the filters in parallel using categoryId
      const [
        colors,
        subcategories,
        fabrics,
        works,
        occasions,
        styles,
        sizes,
      ] = await Promise.all([
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
