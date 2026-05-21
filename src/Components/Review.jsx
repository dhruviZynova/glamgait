import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../Axios/axios";
import { ApiURL, userInfo } from "../Variable";
import { Star, ChevronRight, ShoppingBag, CheckCircle, ImagePlus, X, ThumbsUp, ThumbsDown, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { ORDER_STATUS } from "../utils/constants";

// Extracts up to 2 initials from a full name  e.g. "Dhruv Gajjar" → "DG"
const getInitials = (name) => {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";
};

const ReviewCard = ({ review, displayDate, currentUser, onEdit }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(review?.likes || 0);
  const [dislikeCount, setDislikeCount] = useState(review?.dislikes || 0);

  const isAuthor = currentUser?.u_id && (
    String(review.u_id || review.user_id) === String(currentUser.u_id) ||
    (review.reviewer_email && review.reviewer_email === currentUser.email) ||
    ((review.reviewer_name || review.name || review.u_name)?.toLowerCase().trim() === (currentUser.name || `${currentUser.first_name} ${currentUser.last_name}`).toLowerCase().trim()) ||
    ((review.reviewer_name || review.name || review.u_name)?.toLowerCase().trim() === currentUser.first_name?.toLowerCase().trim())
  );

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
    <div className="border border-[#D3D3D3] rounded-[14px] p-6 sm:p-8 mb-6 relative group">
      <div className="flex gap-4 sm:gap-6">
        <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#D9D9D9] flex items-center justify-center text-[#555] text-sm sm:text-base font-semibold select-none">
          {getInitials(review?.reviewer_name)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-3">
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
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors ${liked ? "text-black" : "text-[#AEAEAE] hover:text-black"
                }`}
            >
              <ThumbsUp size={16} className={liked ? "fill-black" : ""} />
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>

            <button
              onClick={handleDislike}
              className={`flex items-center gap-1.5 transition-colors ${disliked ? "text-black" : "text-[#AEAEAE] hover:text-black"
                }`}
            >
              <ThumbsDown size={16} className={disliked ? "fill-black" : ""} />
              {dislikeCount > 0 && <span>{dislikeCount}</span>}
            </button>

            {isAuthor && onEdit && (
              <button
                onClick={() => onEdit(review)}
                className="p-1.5 rounded-full bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-200 transition-all"
                title="Edit your review"
              >
                <Pencil size={16} />
              </button>
            )}

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
  const location = useLocation();
  const userRaw = userInfo();
  
  // Memoize user to prevent infinite loops since userInfo() returns a new object on every call
  const user = useMemo(() => userRaw, [JSON.stringify(userRaw)]);

  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    if (user && !isEditing) {
      setReviewerName(user.first_name || user.name || "");
      setReviewerEmail(user.email || "");
    }
  }, [user?.u_id, user?.email, isEditing]);

  // ── 1. Fetch reviews for this product ────────────────────────────────────
  const fetchReviews = useCallback(async () => {
    if (!p_id) return;
    try {
      const res = await axiosInstance.post("/getuserreviews", { p_id });
      if (res.data.status === 1) {
        const data = res.data.data || [];
        setReviews(data);

        // Check if logged-in user already reviewed this product
        if (user?.u_id) {
          const userReview = data.find((r) => {
            const userIdMatch = String(r.u_id || r.user_id) === String(user.u_id);
            const accountNameMatch = (r.reviewer_name || r.name || r.u_name)?.toLowerCase().trim() === (user.name || `${user.first_name} ${user.last_name}`).toLowerCase().trim();
            const firstNameMatch = (r.reviewer_name || r.name || r.u_name)?.toLowerCase().trim() === user.first_name?.toLowerCase().trim();
            const formNameMatch = (r.reviewer_name || r.name || r.u_name)?.toLowerCase().trim() === reviewerName.toLowerCase().trim();
            const emailMatch = (r.reviewer_email || r.email)?.toLowerCase().trim() === (user.email || reviewerEmail).toLowerCase().trim();

            return userIdMatch || accountNameMatch || firstNameMatch || formNameMatch || (emailMatch && (user.email || reviewerEmail));
          });
          setAlreadyReviewed(!!userReview);
        }
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  }, [p_id, user?.u_id, user?.email, reviewerName, reviewerEmail]);

  // ── 2. Check if logged-in user has ordered THIS specific product ────────
  const checkUserOrders = useCallback(async () => {
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
          (parseInt(order.status) === ORDER_STATUS.DELIVERED || order.status_label === "Delivered") &&
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
  }, [user?.u_id, p_id, productName]);

  useEffect(() => {
    if (p_id) {
      fetchReviews();
      checkUserOrders();
    }
  }, [p_id, fetchReviews, checkUserOrders]);

  // ── Submit handler ────────────────────────────────────────────────────────
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

  // ── 3. Submit review (Add or Update) ──────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!p_id) return;

    if (selectedStars === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
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

      const endpoint = isEditing ? "/updateuserreview" : "/adduserreview";
      const res = await axiosInstance.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status === 1) {
        toast.success(isEditing ? "Review updated successfully!" : "Review added successfully!");
        setSelectedStars(5);
        setReviewContent("");
        setUploadedImages([]);
        setIsEditing(false);
        setEditingReviewId(null);
        fetchReviews();
      } else {
        toast.error(res.data.description || "Failed to submit review");
      }
    } catch (err) {
      console.error(err);
      const errMsg =
        err.response?.data?.description ||
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        "An error occurred";
      toast.error(errMsg);
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
              className="w-full bg-[#FAFAFA] border border-[#00000026] rounded-full px-6 py-4 text-[#414141] capitalize outline-none focus:border-black transition"
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
              className="w-full bg-[#FAFAFA] border border-[#00000026] rounded-full px-6 py-4 text-[#414141] outline-none focus:border-black transition"
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

          <div className="flex items-center gap-4">
            {isEditing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-gray-500 font-medium hover:text-red-500 transition-colors"
              >
                Cancel Edit
              </button>
            )}
            <button
              type="submit"
              className="bg-[#000000] text-white px-8 py-3 rounded-full font-[Exo] font-500 text-md flex items-center gap-2 cursor-pointer transition self-end sm:self-auto"
            >
              {isEditing ? "Update Review" : "Post Review"} <ChevronRight size={20} />
            </button>
          </div>
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
            <ReviewCard
              key={index}
              review={review}
              displayDate={displayDate}
              currentUser={user}
              onEdit={handleEdit}
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
        <div id="review-form-section" className="border border-[#D3D3D3] rounded-[14px] p-6 sm:p-8 mb-6">
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
    </div>
  );
};

export default Review;
