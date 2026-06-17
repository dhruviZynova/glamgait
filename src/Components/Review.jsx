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

  const avatarTheme = useMemo(() => {
    const themes = [
      { bg: "bg-[#F5F1EE]", text: "text-[#8C7A70]" },
      { bg: "bg-[#EAEFF2]", text: "text-[#5B7B88]" },
      { bg: "bg-[#EBECE1]", text: "text-[#6C755E]" },
      { bg: "bg-[#F5EBEB]", text: "text-[#9E6F6F]" },
      { bg: "bg-[#ECE6F2]", text: "text-[#7B5B94]" },
    ];
    const name = review?.reviewer_name || "";
    if (!name) return themes[0];
    const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
    return themes[code % themes.length];
  }, [review?.reviewer_name]);

  const imageUrls = review?.image_url
    ? review.image_url.split(",").filter(Boolean)
    : [];

  return (
    <div className="bg-white border border-[#E8E0DA] rounded-[16px] p-4 md:p-6 transition-shadow hover:shadow-md relative group">
      <div className="flex gap-4 sm:gap-6">
        <div className={`flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full ${avatarTheme.bg} flex items-center justify-center ${avatarTheme.text} text-sm sm:text-base font-semibold select-none border border-black/5`}>
          {getInitials(review?.reviewer_name)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-[#1E1512] font-semibold text-base sm:text-lg font-[oxygen] capitalize flex items-center gap-2">
              {review?.reviewer_name}
            </h4>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < review?.rating
                      ? "fill-[#FBBF24] text-[#FBBF24]"
                      : "text-[#E5E7EB] fill-[#E5E7EB]"
                  }
                />
              ))}
            </div>
          </div>

          <p className="text-[#5C504A] text-sm sm:text-base leading-relaxed mb-4 font-[oxygen]">
            {review?.message}
          </p>

          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {imageUrls.map((img, i) => (
                <img
                  key={i}
                  src={getReviewImageUrl(img)}
                  alt={`Review ${i + 1}`}
                  className="w-14 h-14 sm:w-20 sm:h-20 object-cover rounded-lg border border-[#E8E0DA] hover:border-[#1E1512] hover:scale-105 transition-all cursor-pointer shadow-sm"
                  onError={(e) => { e.target.style.display = 'none'; }}
                  onClick={() => window.open(getReviewImageUrl(img), "_blank")}
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-5 text-[#5C504A] text-xs sm:text-sm font-medium">
            {/* Like */}
            <button
              onClick={handleLike}
              disabled={isAuthor || isToggling}
              title={
                isAuthor
                  ? "You cannot react to your own review"
                  : "Like this review"
              }
              className={`flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${liked ? "text-[#1E1512] font-semibold" : "text-[#AEAEAE] hover:text-[#1E1512]"
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
              className={`flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${disliked ? "text-[#1E1512] font-semibold" : "text-[#AEAEAE] hover:text-[#1E1512]"
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

  // Calculate review stats
  const stats = useMemo(() => {
    if (publishedReviews.length === 0) {
      return {
        averageRating: "0.0",
        totalRatings: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const total = publishedReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
    const average = (total / publishedReviews.length).toFixed(1);

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    publishedReviews.forEach((r) => {
      const val = Math.round(Number(r.rating || 0));
      if (distribution[val] !== undefined) {
        distribution[val]++;
      }
    });

    return {
      averageRating: average,
      totalRatings: publishedReviews.length,
      distribution
    };
  }, [publishedReviews]);

  return (
    <div id="reviews" className="">
      {/* Rating Summary Card */}
      {publishedReviews.length > 0 && (
        <div className="bg-white border border-[#E8E0DA] rounded-[18px] p-4 md:p-6 max-w-xl mb-8 shadow-sm hover:shadow transition-all duration-300 flex flex-row sm:flex-row gap-8 items-center sm:items-stretch">
          {/* Summary Box */}
          <div className="flex flex-col items-center justify-center sm:border-r border-[#E8E0DA] sm:pr-8 sm:min-w-[160px]">
            <span className="text-3xl md:text-5xl font-bold font-[Oxygen] text-[#1E1512] mb-2">{stats.averageRating}</span>
            <div className="flex gap-1 mb-2">
              {(() => {
                const stars = [];
                const rating = Number(stats.averageRating);
                for (let i = 1; i <= 5; i++) {
                  if (i <= rating) {
                    stars.push(<Star key={i} size={18} className="fill-[#FBBF24] text-[#FBBF24]" />);
                  } else if (i - 0.5 <= rating) {
                    stars.push(
                      <div key={i} className="relative inline-block">
                        <Star size={18} className="text-[#E5E7EB] fill-[#E5E7EB]" />
                        <div className="absolute inset-0 overflow-hidden w-1/2">
                          <Star size={18} className="fill-[#FBBF24] text-[#FBBF24]" />
                        </div>
                      </div>
                    );
                  } else {
                    stars.push(<Star key={i} size={18} className="text-[#E5E7EB] fill-[#E5E7EB]" />);
                  }
                }
                return stars;
              })()}
            </div>
            <span className="text-sm text-[#8C7A70] font-[Oxygen]">{stats.totalRatings} {stats.totalRatings === 1 ? 'rating' : 'ratings'}</span>
          </div>

          {/* Breakdown Bars */}
          <div className="flex-1 w-full flex flex-col justify-center gap-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = stats.distribution[stars];
              const pct = stats.totalRatings > 0 ? (count / stats.totalRatings) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-sm font-[Oxygen] text-[#5C504A]">
                  <span className="w-5 text-right font-medium">{stars}★</span>
                  <div className="flex-1 h-2.5 bg-[#F5F1EE] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FBBF24] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-left text-gray-500 text-xs">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

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