import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReviews, submitReview, editReview, deleteReview, toggleReviewLike } from "../api/reviews";
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

export function useToggleReviewLike(p_id, currentUserId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ r_id, action }) => {
      const res = await toggleReviewLike({ r_id, action });
      if (res.status !== 1) {
        throw new Error(res.description || "Failed to toggle review like status");
      }
      return res;
    },
    onMutate: async ({ r_id, action }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["reviews", p_id] });

      // Snapshot the previous value
      const previousReviews = queryClient.getQueryData(["reviews", p_id]);

      // Optimistically update to the new value
      queryClient.setQueryData(["reviews", p_id], (old) => {
        if (!Array.isArray(old)) return [];
        return old.map((review) => {
          if (String(review.r_id || review.review_id) !== String(r_id)) {
            return review;
          }

          // Parse current state
          let likedUsers = Array.isArray(review.likedByUsers) ? review.likedByUsers : [];
          let dislikedUsers = Array.isArray(review.dislikedByUsers) ? review.dislikedByUsers : [];
          const userIdNum = parseInt(currentUserId);

          const isAlreadyLiked = likedUsers.includes(userIdNum);
          const isAlreadyDisliked = dislikedUsers.includes(userIdNum);

          if (action === "like") {
            if (isAlreadyLiked) {
              likedUsers = likedUsers.filter(id => id !== userIdNum);
            } else {
              likedUsers = [...likedUsers, userIdNum];
              dislikedUsers = dislikedUsers.filter(id => id !== userIdNum);
            }
          } else if (action === "dislike") {
            if (isAlreadyDisliked) {
              dislikedUsers = dislikedUsers.filter(id => id !== userIdNum);
            } else {
              dislikedUsers = [...dislikedUsers, userIdNum];
              likedUsers = likedUsers.filter(id => id !== userIdNum);
            }
          }

          const likesCount = likedUsers.length;
          const dislikesCount = dislikedUsers.length;
          const liked = likedUsers.includes(userIdNum);
          const disliked = dislikedUsers.includes(userIdNum);

          return {
            ...review,
            likesCount,
            dislikesCount,
            likedByUsers: likedUsers,
            dislikedByUsers: dislikedUsers,
            liked,
            disliked,
            likes: likesCount,
            dislikes: dislikesCount,
            like_count: likesCount,
            dislike_count: dislikesCount,
            userAction: liked ? "like" : (disliked ? "dislike" : null),
          };
        });
      });

      // Return a context object with the snapshotted value
      return { previousReviews };
    },
    onError: (err, newVariables, context) => {
      // Rollback to previous reviews state
      if (context?.previousReviews) {
        queryClient.setQueryData(["reviews", p_id], context.previousReviews);
      }
      toast.error(err.message || "Failed to toggle review like status");
    },
    onSettled: () => {
      // Always refetch or invalidate to ensure we have the correct data from the server
      queryClient.invalidateQueries({ queryKey: ["reviews", p_id] });
    },
  });
}
