import React, { useEffect, useState } from "react";
import axiosInstance from "../Axios/axios";
import { ApiURL, userInfo } from "../Variable";
import { Star, ChevronRight, ShoppingBag, CheckCircle, ImagePlus, X, ThumbsUp, ThumbsDown } from "lucide-react";
import toast from "react-hot-toast";

// Extracts up to 2 initials from a full name  e.g. "Dhruv Gajjar" → "DG"
const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";

const ReviewCard = ({ review, displayDate }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(review?.likes || 0);
  const [dislikeCount, setDislikeCount] = useState(review?.dislikes || 0);

  const handleLike = () => {
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
  };

  const handleDislike = () => {
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
  };

  return (
    <div className="border border-[#D3D3D3] rounded-[14px] p-6 sm:p-8 mb-6">
      <div className="flex gap-4 sm:gap-6">
        <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#D9D9D9] flex items-center justify-center text-[#555] text-sm sm:text-base font-semibold select-none">
          {getInitials(review?.reviewer_name)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-[#3D3D3D] font-semibold text-base sm:text-lg font-[oxygen]">
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

          <p className="text-[#949494] text-sm sm:text-base leading-relaxed mb-6 font-[oxygen]">
            {review?.message}
          </p>

          <div className="flex items-center gap-5 text-[#3D3D3D] text-xs sm:text-sm font-medium">
            {/* Thumbs Up */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors ${liked ? "text-black" : "text-[#AEAEAE] hover:text-black"
                }`}
            >
              <ThumbsUp
                size={16}
                className={liked ? "fill-black" : ""}
              />
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>

            {/* Thumbs Down */}
            <button
              onClick={handleDislike}
              className={`flex items-center gap-1.5 transition-colors ${disliked ? "text-black" : "text-[#AEAEAE] hover:text-black"
                }`}
            >
              <ThumbsDown
                size={16}
                className={disliked ? "fill-black" : ""}
              />
              {dislikeCount > 0 && <span>{dislikeCount}</span>}
            </button>

            <span className="text-[#AEAEAE] font-normal">{displayDate(review)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Review = ({ p_id, productName }) => {
  const [selectedStars, setSelectedStars] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [hasOrders, setHasOrders] = useState(null); // null = still loading
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const user = userInfo();

  // ── 1. Fetch reviews for this product ────────────────────────────────────
  const fetchReviews = async () => {
    if (!p_id) return;
    try {
      const res = await axiosInstance.post("/getuserreviews", { p_id });
      if (res.data.status === 1) {
        const data = res.data.data || [];
        setReviews(data);

        // Check if logged-in user already reviewed this product
        if (user?.u_id) {
          const userReview = data.find(
            (r) => String(r.u_id) === String(user.u_id)
          );
          setAlreadyReviewed(!!userReview);
        }
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  // ── 2. Check if logged-in user has ordered THIS specific product ────────
  const checkUserOrders = async () => {
    if (!user?.u_id) {
      setHasOrders(false);
      return;
    }
    try {
      const res = await axiosInstance.get(
        `${ApiURL}/getorder?u_id=${user.u_id}`
      );
      if (
        res.data.status === 1 &&
        Array.isArray(res.data.data)
      ) {
        // Find if any order contains this specific product (by ID or Name)
        const hasBoughtThisProduct = res.data.data.some(order =>
          order.orderItems && order.orderItems.some(item => {
            const itemId = item.p_id || item.product_id || item.pid || item.id || item.productId;
            const idMatch = itemId && String(itemId) === String(p_id);
            // Fallback to name matching if IDs don't match or are missing
            const nameMatch = productName && item.productName &&
              String(item.productName).trim().toLowerCase() === String(productName).trim().toLowerCase();

            return idMatch || nameMatch;
          })
        );
        setHasOrders(hasBoughtThisProduct);
      } else {
        setHasOrders(false);
      }
    } catch (err) {
      console.error("Error checking orders:", err);
      setHasOrders(false);
    }
  };

  useEffect(() => {
    if (p_id) {
      fetchReviews();
      checkUserOrders();
    }
  }, [p_id, user?.u_id]);

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.u_id) {
      toast.error("Please login to submit a review");
      return;
    }
    if (!hasOrders) {
      toast.error("You must place at least one order before writing a review");
      return;
    }
    if (alreadyReviewed) {
      toast.error("You have already reviewed this product");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("u_id", user.u_id);
      formData.append("p_id", p_id);
      formData.append("rating", selectedStars);
      formData.append("message", reviewContent);
      formData.append(
        "reviewer_name",
        user.first_name || user.name || "Anonymous"
      );

      uploadedImages.forEach((file) => {
        if (file instanceof File) formData.append("userReviewImage", file);
      });

      const res = await axiosInstance.post("/adduserreview", formData);
      if (res.data.status === 1) {
        toast.success("Review added successfully!");
        setSelectedStars(5);
        setReviewContent("");
        setUploadedImages([]);
        fetchReviews();
      } else {
        toast.error(res.data.description || "Failed to add review");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
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
            <a href="/login" className="text-black underline font-semibold">
              login
            </a>{" "}
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

    // User has no orders yet
    if (!hasOrders) {
      return (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <ShoppingBag size={36} className="text-[#D3D3D3]" />
          <p className="text-[#949494] font-[oxygen] text-sm sm:text-base">
            You need to place at least one order before you can write a review.
          </p>
        </div>
      );
    }

    // User already reviewed this product
    if (alreadyReviewed) {
      return (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <CheckCircle size={36} className="text-green-500" />
          <p className="text-[#949494] font-[oxygen] text-sm sm:text-base">
            You have already submitted a review for this product. Thank you!
          </p>
        </div>
      );
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
              disabled
              value={user?.first_name || user?.name || "John Doe"}
              className="w-full bg-[#FAFAFA] border border-[#00000026] rounded-full px-6 py-4 text-[#7B7B7B] outline-none focus:border-black transition"
            />
          </div>
          <div className="space-y-2 flex flex-col gap-2">
            <label className="text-[#3D3D3D] text-md font-medium font-[oxygen]">
              Your Email:
            </label>
            <input
              type="email"
              disabled
              value={user?.email || "person@gmail.com"}
              className="w-full bg-[#FAFAFA] border border-[#00000026] rounded-full px-6 py-4 text-[#7B7B7B] outline-none focus:border-black transition"
            />
          </div>
        </div>

        {/* Review text */}
        <div className="space-y-2">
          <textarea
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            placeholder="Write your review..."
            className="w-full bg-[#FAFAFA] border border-[#00000026] rounded-[22px] px-6 py-4 min-h-[150px] text-[#414141] outline-none focus:border-black transition resize-none"
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
                    className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-black transition"
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
                  className="transition-transform hover:scale-110"
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

          <button
            type="submit"
            className="bg-[#000000] text-white px-8 py-3 rounded-full font-[Exo] font-500 text-md flex items-center gap-2 cursor-pointer transition self-end sm:self-auto"
          >
            Post Review <ChevronRight size={20} />
          </button>
        </div>
      </form>
    );
  };

  return (
    <div id="reviews" className="">
      {/* Review List */}
      <div className="mb-12">
        {reviews?.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-[#949494] font-[oxygen] text-lg">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          reviews?.slice(0, visibleCount).map((review, index) => (
            <ReviewCard key={index} review={review} displayDate={displayDate} />
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

      {/* Write a Review Section - Only shown for users who ordered the product and haven't reviewed it yet */}
      {hasOrders && !alreadyReviewed && (
        <div className="border border-[#D3D3D3] rounded-[14px] p-6 sm:p-8 mb-6">
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#D9D9D9] flex items-center justify-center text-[#555] text-sm sm:text-base font-semibold select-none">
              {getInitials(user?.first_name
                ? `${user.first_name} ${user.last_name || ""}`
                : user?.name)}
            </div>
            <div className="flex-1">{renderReviewFormArea()}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
