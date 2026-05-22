import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../Axios/axios";
import { ApiURL, userInfo } from "../Variable";
import { Star, ChevronRight, ShoppingBag, CheckCircle, ImagePlus, X, ThumbsUp, ThumbsDown, Pencil, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { ORDER_STATUS } from "../utils/constants";
import { useReviews, useSubmitReview, useEditReview, useDeleteReview, useToggleReviewLike } from "../hooks/useReviews";
import { useOrders } from "../hooks/useOrders";


const getInitials = (name) => {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";
};

const ReviewCard = ({ review, displayDate, currentUser, onEdit, onDelete, onToggleLike, isToggling }) => {
  const [liked, setLiked] = useState(review?.liked || review?.userAction === "like" || false);
  const [disliked, setDisliked] = useState(review?.disliked || review?.userAction === "dislike" || false);
  const [likeCount, setLikeCount] = useState(review?.likes ?? review?.like_count ?? 0);
  const [dislikeCount, setDislikeCount] = useState(review?.dislikes ?? review?.dislike_count ?? 0);

  useEffect(() => {
    setLiked(review?.liked || review?.userAction === "like" || false);
    setDisliked(review?.disliked || review?.userAction === "dislike" || false);
    setLikeCount(review?.likes ?? review?.like_count ?? 0);
    setDislikeCount(review?.dislikes ?? review?.dislike_count ?? 0);
  }, [review]);

  const isAuthor = currentUser?.u_id && (
    String(review.u_id || review.user_id) === String(currentUser.u_id)
  );

  const handleLike = () => {
    // ❌ Prevent owner from liking their own review
    if (isAuthor) {
      toast.error("You cannot like your own review.");
      return;
    }
    if (isToggling) return;
    if (!currentUser?.u_id) {
      toast.error("Please login to like reviews");
      return;
    }
    // Optimistic UI updates
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
    if (onToggleLike) {
      onToggleLike(review.r_id || review.review_id, "like");
    }
  };

  const handleDislike = () => {
    // ❌ Prevent owner from disliking their own review
    if (isAuthor) {
      toast.error("You cannot dislike your own review.");
      return;
    }
    if (isToggling) return;
    if (!currentUser?.u_id) {
      toast.error("Please login to dislike reviews");
      return;
    }
    // Optimistic UI updates
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
    if (onToggleLike) {
      onToggleLike(review.r_id || review.review_id, "dislike");
    }
  };

  return (
    <div className="border border-[#D3D3D3] rounded-[14px] p-4 md:p-6 mb-6 relative group">
      <div className="flex gap-4 sm:gap-6">
        <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#D9D9D9] flex items-center justify-center text-[#555] text-sm sm:text-base font-semibold select-none">
          {getInitials(review?.reviewer_name)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-[#3D3D3D] font-semibold text-base sm:text-lg font-[oxygen] capitalize">
              {review?.reviewer_name}
            </h4>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < review?.rating ? "fill-[#7B7B7B] text-[#7B7B7B]" : "text-[#D1D1D1]"}
                />
              ))}
            </div>
          </div>

          <p className="text-[#949494] text-sm sm:text-base leading-relaxed mb-4 font-[oxygen]">
            {review?.message}
          </p>

          {review?.image_url && (
            <div className="flex flex-wrap gap-2 mb-6">
              {review.image_url.split(",").map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Review ${i}`}
                  className="w-10 h-10 object-cover rounded-lg border border-[#eee] hover:opacity-90 cursor-pointer transition-opacity"
                  onClick={() => window.open(img, "_blank")}
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-5 text-[#3D3D3D] text-xs sm:text-sm font-medium">

            {/* ✅ Like Button - Always visible, disabled for owner */}
            <button
              onClick={handleLike}
              disabled={isAuthor || isToggling}
              title={isAuthor ? "You cannot react to your own review" : "Like this review"}
              className={`flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${liked ? "text-black" : "text-[#AEAEAE] hover:text-black"
                }`}
            >
              <ThumbsUp size={16} fill={liked ? "currentColor" : "none"} className={isToggling ? "animate-pulse" : ""} />
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>

            {/* ✅ Dislike Button - Always visible, disabled for owner */}
            <button
              onClick={handleDislike}
              disabled={isAuthor || isToggling}
              title={isAuthor ? "You cannot react to your own review" : "Dislike this review"}
              className={`flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${disliked ? "text-black" : "text-[#AEAEAE] hover:text-black"
                }`}
            >
              <ThumbsDown size={16} fill={disliked ? "currentColor" : "none"} className={isToggling ? "animate-pulse" : ""} />
              {dislikeCount > 0 && <span>{dislikeCount}</span>}
            </button>

            {/* ✅ Edit/Delete - Only visible for owner */}
            {isAuthor && onEdit && (
              <button
                onClick={() => onEdit(review)}
                className="p-1.5 rounded-full bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-200 transition-all cursor-pointer"
                title="Edit your review"
              >
                <Pencil size={16} />
              </button>
            )}

            {isAuthor && onDelete && (
              <button
                onClick={() => onDelete(review.r_id || review.review_id)}
                className="p-1.5 rounded-full bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                title="Delete your review"
              >
                <Trash2 size={16} />
              </button>
            )}

            <span className="text-[#AEAEAE] font-normal">{displayDate(review)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Review = ({ p_id, productName, onReviewChange }) => {
  const [selectedStars, setSelectedStars] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const location = useLocation();
  const userRaw = userInfo();

  // Memoize user to prevent infinite loops since userInfo() returns a new object on every call
  const user = useMemo(() => userRaw, [JSON.stringify(userRaw)]);

  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  // TanStack Queries & Mutations
  const { data: reviews = [], isLoading: isLoadingReviews } = useReviews(p_id);
  const { data: orders = [], isLoading: isLoadingOrders } = useOrders();

  const submitReviewMutation = useSubmitReview(p_id);
  const toggleLikeMutation = useToggleReviewLike(p_id, user?.u_id);
  const editReviewMutation = useEditReview(p_id);
  const deleteReviewMutation = useDeleteReview(p_id);

  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [deletingConfirm, setDeletingConfirm] = useState(false);

  const alreadyReviewed = useMemo(() => {
    if (!user?.u_id) return false;
    return reviews.some((r) => String(r.u_id || r.user_id) === String(user.u_id));
  }, [reviews, user?.u_id]);

  const hasOrders = useMemo(() => {
    if (!user?.u_id) return false;
    if (isLoadingOrders) return null; // null = still loading

    return orders.some(order =>
      (parseInt(order.status) === ORDER_STATUS.DELIVERED || order.status_label === "Delivered") &&
      order.orderItems && order.orderItems.some(item => {
        const itemId = item.p_id || item.product_id || item.pid || item.id || item.productId;
        const idMatch = itemId && String(itemId) === String(p_id);
        const nameMatch = productName && item.productName &&
          String(item.productName).trim().toLowerCase() === String(productName).trim().toLowerCase();

        return idMatch || nameMatch;
      })
    );
  }, [orders, isLoadingOrders, user?.u_id, p_id, productName]);

  useEffect(() => {
    if (user && !isEditing) {
      setReviewerName(user.first_name || user.name || "");
      setReviewerEmail(user.email || "");
    }
  }, [user?.u_id, user?.email, isEditing]);

  // ── Toggle Like handler ──────────────────────────────────────────────────
  const handleToggleLike = (r_id, action) => {
    if (!user?.u_id) {
      toast.error(`Please login to ${action} reviews`);
      return;
    }
    toggleLikeMutation.mutate({ r_id, action });
  };

  const handleEdit = (review) => {
    setIsEditing(true);
    setEditingReviewId(review.r_id || review.review_id);
    setReviewerName(review.reviewer_name || "");
    setReviewerEmail(review.reviewer_email || "");
    setReviewContent(review.message || "");
    setSelectedStars(review.rating || 5);
    setUploadedImages([]);

    // Smooth scroll to form
    const formElement = document.getElementById("review-form-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingReviewId(null);
    setReviewerName(user.first_name || user.name || "");
    setReviewerEmail(user.email || "");
    setReviewContent("");
    setSelectedStars(5);
    setUploadedImages([]);
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
        if (onReviewChange) {
          onReviewChange();
        }
      },
      onSettled: () => {
        setDeletingConfirm(false);
      }
    });
  };

  const submitting = submitReviewMutation.isPending || editReviewMutation.isPending;

  // ── 3. Submit review (Add or Update) ──────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!p_id || submitting) return;

    if (selectedStars === 0) {
      toast.error("Please select a rating");
      return;
    }

    const formData = new FormData();
    if (isEditing) {
      formData.append("r_id", editingReviewId);
    }
    formData.append("p_id", p_id);
    formData.append("rating", selectedStars);
    formData.append("message", reviewContent);
    formData.append("reviewer_name", reviewerName);
    formData.append("reviewer_email", reviewerEmail);

    // Handle images
    uploadedImages.forEach((img) => {
      if (img instanceof File) {
        formData.append("userReviewImage", img);
      }
    });

    const mutation = isEditing ? editReviewMutation : submitReviewMutation;
    mutation.mutate(formData, {
      onSuccess: () => {
        setSelectedStars(5);
        setReviewContent("");
        setUploadedImages([]);
        setIsEditing(false);
        setEditingReviewId(null);
        if (onReviewChange) {
          onReviewChange();
        }
      }
    });
  };

  const toggleVisible = () => {
    if (visibleCount === 3) setVisibleCount(reviews?.length);
    else setVisibleCount(3);
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

  // ── Decide what to render in the "write a review" box ────────────────────
  const renderReviewFormArea = () => {
    // Not logged in
    if (!user?.u_id) {
      return (
        <div className="text-center py-8">
          <p className="text-[#949494] font-[oxygen]">
            Please{" "}
            <Link
              to="/login"
              state={{ from: location.pathname + location.search }}
              className="text-black underline font-semibold"
            >
              login
            </Link>{" "}
            to write a review.
          </p>
        </div>
      );
    }

    // Still loading order status
    if (hasOrders === null) {
      return (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-t-transparent border-[#1C2F2F] rounded-full animate-spin mx-auto" />
        </div>
      );
    }

    if (!hasOrders && !isEditing) {
      return null;
    }

    // User already reviewed this product
    if (alreadyReviewed && !isEditing) {
      return null;
    }

    // Show the review form
    return (
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 flex flex-col gap-2">
            <label className="text-[#3D3D3D] text-md font-medium font-[oxygen]">
              Your Name:
            </label>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-[#FAFAFA] border border-[#00000026] rounded-full px-6 py-4 text-[#414141] capitalize focus:outline-none transition"
            />
          </div>
          <div className="space-y-2 flex flex-col gap-2">
            <label className="text-[#3D3D3D] text-md font-medium font-[oxygen]">
              Your Email:
            </label>
            <input
              type="email"
              value={reviewerEmail}
              onChange={(e) => setReviewerEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-[#FAFAFA] border border-[#00000026] rounded-full px-6 py-4 text-[#414141] focus:outline-none transition"
            />
          </div>
        </div>

        {/* Review text */}
        <div className="space-y-2">
          <textarea
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            placeholder="Write your review..."
            className="w-full bg-[#FAFAFA] border border-[#00000026] rounded-[22px] px-6 py-4 min-h-[150px] text-[#414141] focus:outline-none transition resize-none"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-3">
          <label className="text-[#3D3D3D] text-md font-medium font-[oxygen] block">
            Add Photos (optional)
          </label>

          {/* Drop zone */}
          <label className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-[#00000020] rounded-[16px] px-6 py-5 cursor-pointer transition bg-[#FAFAFA]">
            <ImagePlus size={24} className="text-[#AEAEAE]" />
            <span className="text-sm text-[#949494] font-[oxygen]">
              Click to upload images
            </span>
            <input
              type="file"
              name="userReviewImage"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setUploadedImages((prev) => [...prev, ...files]);
                e.target.value = "";
              }}
            />
          </label>

          {/* Preview thumbnails */}
          {uploadedImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2">
              {uploadedImages.map((file, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#00000015] shadow-sm">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setUploadedImages((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-black transition cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-[#3D3D3D] text-md font-medium font-[oxygen]">
              Your Ratings:
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedStars(star)}
                  className="transition-transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    size={24}
                    className={
                      star <= selectedStars
                        ? "fill-[#7B7B7B] text-[#7B7B7B]"
                        : "text-[#7B7B7B] hover:text-black"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isEditing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-gray-500 font-medium hover:text-red-500 transition-colors cursor-pointer"
              >
                Cancel Edit
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#000000] text-white px-8 py-3 rounded-full font-[Exo] font-500 text-md flex items-center gap-2 cursor-pointer transition self-end sm:self-auto disabled:opacity-70"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? "Posting..." : (isEditing ? "Update Review" : "Post Review")}
              {!submitting && <ChevronRight size={20} />}
            </button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <div id="reviews" className="">
      {/* Review List */}
      <div className="mb-6 md:mb-12">
        {reviews?.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-[#949494] font-[oxygen] text-lg">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          reviews?.slice(0, visibleCount).map((review, index) => (
            <ReviewCard
              key={review.r_id || review.review_id || index}
              review={review}
              displayDate={displayDate}
              currentUser={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleLike={handleToggleLike}
              isToggling={toggleLikeMutation.isPending && toggleLikeMutation.variables?.r_id === (review.r_id || review.review_id)}
            />
          ))
        )}

        {reviews?.length > 3 && (
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

      {/* Write a Review Section */}
      {((!alreadyReviewed && hasOrders !== false) || isEditing || !user?.u_id) && (
        <div id="review-form-section" className="border border-[#D3D3D3] rounded-[14px] p-4 md:p-8 mb-6">
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#D9D9D9] flex items-center justify-center text-[#555] text-sm sm:text-base font-semibold select-none">
              {getInitials(user?.first_name
                ? `${user.first_name}`
                : user?.name)}
            </div>
            <div className="flex-1">
              {isEditing && (
                <div className="mb-6 flex items-center gap-2 text-[#004534] bg-[#00453410] px-4 py-2 rounded-lg w-fit">
                  <Pencil size={16} />
                  <span className="text-sm font-semibold">Editing your review</span>
                </div>
              )}
              {renderReviewFormArea()}
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
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
                Are you sure you want to delete your review? This action cannot be undone.
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
                  className="flex-1 max-w-[120px] py-3 rounded-full bg-[#1C2F2F] text-white font-semibold font-[oxygen] hover:bg-black transition cursor-pointer text-center text-sm"
                >
                  Delete
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