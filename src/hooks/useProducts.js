import { useQuery } from "@tanstack/react-query";
import { getProducts, getProductBySlug, getLatestArrivals, getReviewsSummaryForMultiple } from "../api/products";

export function useProducts(params = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
}

export function useProductDetails(slug) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
}

export function useLatestArrivals() {
  return useQuery({
    queryKey: ["latestArrivals"],
    queryFn: getLatestArrivals,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
}

export function useReviewsSummary(p_ids) {
  return useQuery({
    queryKey: ["reviewsSummary", p_ids],
    queryFn: () => getReviewsSummaryForMultiple(p_ids),
    enabled: Array.isArray(p_ids) && p_ids.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
