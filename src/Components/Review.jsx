import React, { useEffect, useState, useMemo } from "react";
import { ApiURL, userInfo } from "../Variable";
import { Star, ThumbsUp, ThumbsDown, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useReviews, useDeleteReview, useToggleReviewLike } from "../hooks/useReviews";

// ── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name) => {
  if (!name) return "?";
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
};

const getReviewStatus = (review) => {
  if (!review) return null;
  if (
    review.status === "pending" ||
    review.status === "approved" ||
    review.status === "rejected"
  ) {
    return review.status;
  }
  const pub = review.is_published;
  if (pub === undefined || pub == 1 || pub === true || String(pub) === "1")
    return "approved";
  if (pub == 2 || String(pub) === "2" || pub === "rejected") return "rejected";
  return "pending";
};

// ── ReviewCard ────────────────────────────────────────────────────────────────

const ReviewCard = ({
  review,
  displayDate,
  currentUser,
  onDelete,
  onToggleLike,
  isToggling,
}) => {
  const [liked, setLiked] = useState(
    review?.liked || review?.userAction === "like" || false
  );
  const [disliked, setDisliked] = useState(
    review?.disliked || review?.userAction === "dislike" || false
  );
  const [likeCount, setLikeCount] = useState(
    review?.likes ?? review?.like_count ?? 0
  );
  const [dislikeCount, setDislikeCount] = useState(
    review?.dislikes ?? review?.dislike_count ?? 0
  );

  useEffect(() => {
    setLiked(review?.liked || review?.userAction === "like" || false);
    setDisliked(review?.disliked || review?.userAction === "dislike" || false);
    setLikeCount(review?.likes ?? review?.like_count ?? 0);
    setDislikeCount(review?.dislikes ?? review?.dislike_count ?? 0);
  }, [review]);

  const isAuthor =
    currentUser?.u_id &&
    String(review.u_id || review.user_id) === String(currentUser.u_id);

  const getReviewImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `${ApiURL}/assets/UserReviews/${img}`;
  };

  const handleLike = () => {
    if (isAuthor) {
      toast.error("You cannot like your own review.");
      return;
    }
    if (isToggling) return;
    if (!currentUser?.u_id) {
      toast.error("Please login to like reviews");
      return;
    }
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
      if (disliked) {
        setDisliked(false);
        setDislikeCount((c) => c - 1);
      }
    }
    if (onToggleLike) onToggleLike(review.r_id || review.review_id, "like");
  };

  const handleDislike = () => {
    if (isAuthor) {
      toast.error("You cannot dislike your own review.");
      return;
    }
    if (isToggling) return;
    if (!currentUser?.u_id) {
      toast.error("Please login to dislike reviews");
      return;
    }
    if (disliked) {
      setDisliked(false);
      setDislikeCount((c) => c - 1);
    } else {
      setDisliked(true);
      setDislikeCount((c) => c + 1);
      if (liked) {
        setLiked(false);
        setLikeCount((c) => c - 1);
      }
    }
    if (onToggleLike) onToggleLike(review.r_id || review.review_id, "dislike");
  };

  const imageUrls = review?.image_url
    ? review.image_url.split(",").filter(Boolean)
    : [];

  return (
    <div className="border border-[#D3D3D3] rounded-[14px] p-4 md:p-6 relative group">
      <div className="flex gap-4 sm:gap-6">
        <div className="flex-shrink-0 w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-[#D9D9D9] flex items-center justify-center text-[#555] text-sm sm:text-base font-semibold select-none">
          {getInitials(review?.reviewer_name)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-[#3D3D3D] font-semibold text-base sm:text-lg font-[oxygen] capitalize flex items-center gap-2">
              {review?.reviewer_name}
            </h4>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < review?.rating
                      ? "fill-[#7B7B7B] text-[#7B7B7B]"
                      : "text-[#D1D1D1]"
                  }
                />
              ))}
            </div>
          </div>

          <p className="text-[#5C504A] text-sm sm:text-base leading-relaxed mb-4 font-[oxygen]">
            {review?.message}
          </p>

          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {imageUrls.map((img, i) => (
                <img
                  key={i}
                  src={getReviewImageUrl(img)}
                  alt={`Review ${i + 1}`}
                  className="w-10 h-10 object-cover rounded-lg border border-[#eee] hover:opacity-90 cursor-pointer transition-opacity"
                  onClick={() => window.open(getReviewImageUrl(img), "_blank")}
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-5 text-[#3D3D3D] text-xs sm:text-sm font-medium">
            {/* Like */}
            <button
              onClick={handleLike}
              disabled={isAuthor || isToggling}
              title={
                isAuthor
                  ? "You cannot react to your own review"
                  : "Like this review"
              }
              className={`flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${liked ? "text-black" : "text-[#AEAEAE] hover:text-black"
                }`}
            >
              <ThumbsUp
                size={16}
                fill={liked ? "currentColor" : "none"}
                className={isToggling ? "animate-pulse" : ""}
              />
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>

            {/* Dislike */}
            <button
              onClick={handleDislike}
              disabled={isAuthor || isToggling}
              title={
                isAuthor
                  ? "You cannot react to your own review"
                  : "Dislike this review"
              }
              className={`flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${disliked ? "text-black" : "text-[#AEAEAE] hover:text-black"
                }`}
            >
              <ThumbsDown
                size={16}
                fill={disliked ? "currentColor" : "none"}
                className={isToggling ? "animate-pulse" : ""}
              />
              {dislikeCount > 0 && <span>{dislikeCount}</span>}
            </button>

            {/* Delete — owner only */}
            {isAuthor && onDelete && (
              <button
                onClick={() => onDelete(review.r_id || review.review_id)}
                className="p-1.5 rounded-full bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                title="Delete your review"
              >
                <Trash2 size={16} />
              </button>
            )}

            <span className="text-[#AEAEAE] font-normal">
              {displayDate(review)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Review Component ─────────────────────────────────────────────────────

const Review = ({ p_id: propPId, productId, onReviewChange }) => {
  const p_id = propPId || productId;
  const [visibleCount, setVisibleCount] = useState(3);
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [deletingConfirm, setDeletingConfirm] = useState(false);

  const userRaw = userInfo();
  const user = useMemo(() => userRaw, [JSON.stringify(userRaw)]);

  const {
    data: reviews = [],
    isLoading: isLoadingReviews,
    refetch: refetchReviews,
  } = useReviews(p_id, user?.u_id);

  const toggleLikeMutation = useToggleReviewLike(p_id, user?.u_id);
  const deleteReviewMutation = useDeleteReview(p_id);

  const publishedReviews = useMemo(
    () => reviews.filter((r) => getReviewStatus(r) === "approved"),
    [reviews]
  );

  const handleToggleLike = (r_id, action) => {
    if (!user?.u_id) {
      toast.error(`Please login to ${action} reviews`);
      return;
    }
    toggleLikeMutation.mutate({ r_id, action });
  };

  const handleDelete = (reviewId) => {
    setDeletingReviewId(reviewId);
  };

  const confirmDelete = () => {
    if (!deletingReviewId || deletingConfirm) return;
    setDeletingConfirm(true);
    deleteReviewMutation.mutate(deletingReviewId, {
      onSuccess: () => {
        setDeletingReviewId(null);
        if (onReviewChange) onReviewChange();
        refetchReviews();
      },
      onSettled: () => {
        setDeletingConfirm(false);
      },
    });
  };

  const toggleVisible = () => {
    setVisibleCount((prev) =>
      prev === 3 ? publishedReviews.length : 3
    );
  };

  const displayDate = (review) => {
    if (!review.createdAt) return "5m";
    const dateStr = review.custom_created_at || review.createdAt;
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <div id="reviews" className="">
      {/* Review List */}
      <div className="flex flex-col gap-6">
        {isLoadingReviews ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-t-transparent border-[#1C2F2F] rounded-full animate-spin mx-auto" />
          </div>
        ) : publishedReviews.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-[#949494] font-[oxygen] text-lg">
              No reviews yet. Be the first to share your experience!
            </p>
          </div>
        ) : (
          publishedReviews.slice(0, visibleCount).map((review, index) => (
            <ReviewCard
              key={review.r_id || review.review_id || index}
              review={review}
              displayDate={displayDate}
              currentUser={user}
              onDelete={handleDelete}
              onToggleLike={handleToggleLike}
              isToggling={
                toggleLikeMutation.isPending &&
                toggleLikeMutation.variables?.r_id ===
                (review.r_id || review.review_id)
              }
            />
          ))
        )}

        {publishedReviews.length > 3 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={toggleVisible}
              className="text-[#414141] font-semibold border-b border-[#414141] pb-0.5 hover:text-black transition"
            >
              {visibleCount === 3 ? "See more reviews" : "Show less"}
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingReviewId && (
        <div className="fixed inset-0 z-[999] bg-[#00000080] backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#D3D3D3] rounded-[22px] max-w-sm w-full p-6 sm:p-8 shadow-2xl animate-fadeIn relative">
            <button
              onClick={() => setDeletingReviewId(null)}
              className="absolute top-4 right-4 text-[#AEAEAE] hover:text-black transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
                <Trash2 size={24} />
              </div>

              <h3 className="font-[Exo] text-xl font-bold text-[#1C2F2F] mb-2">
                Delete Review?
              </h3>

              <p className="font-[oxygen] text-[#777] text-sm sm:text-base mb-6 leading-relaxed">
                Are you sure you want to delete your review? This action cannot
                be undone.
              </p>

              <div className="flex items-center gap-4 w-full justify-center">
                <button
                  onClick={() => setDeletingReviewId(null)}
                  className="flex-1 max-w-[120px] py-3 rounded-full border border-[#D3D3D3] text-[#3D3D3D] font-semibold font-[oxygen] hover:bg-gray-50 transition cursor-pointer text-center text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingConfirm}
                  className="flex-1 max-w-[120px] py-3 rounded-full bg-[#1C2F2F] text-white font-semibold font-[oxygen] hover:bg-black transition cursor-pointer text-center text-sm disabled:opacity-70"
                >
                  {deletingConfirm ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;