import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReviews, submitReview, editReview, deleteReview } from "../api/reviews";
import toast from "react-hot-toast";

export function useReviews(p_id) {
  return useQuery({
    queryKey: ["reviews", p_id],
    queryFn: async () => {
      const res = await getReviews(p_id);
      if (res.status === 1) {
        return res.data || [];
      }
      return [];
    },
    enabled: !!p_id,
    staleTime: 0,
  });
}

export function useSubmitReview(p_id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await submitReview(formData);
      if (res.status !== 1) {
        throw new Error(res.description || "Failed to submit review");
      }
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.description || "Review added successfully!");
      queryClient.invalidateQueries({ queryKey: ["reviews", p_id] });
      queryClient.invalidateQueries({ queryKey: ["reviewsSummary"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit review");
    },
  });
}

export function useEditReview(p_id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await editReview(formData);
      if (res.status !== 1) {
        throw new Error(res.description || "Failed to update review");
      }
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.description || "Review updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["reviews", p_id] });
      queryClient.invalidateQueries({ queryKey: ["reviewsSummary"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update review");
    },
  });
}

export function useDeleteReview(p_id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (r_id) => {
      const res = await deleteReview(r_id);
      if (res.status !== 1) {
        throw new Error(res.description || "Failed to delete review");
      }
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.description || "Review deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["reviews", p_id] });
      queryClient.invalidateQueries({ queryKey: ["reviewsSummary"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete review");
    },
  });
}
