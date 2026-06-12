import React, { useState, useEffect } from "react";
import { X, Star, ImagePlus, Loader2, CheckCircle } from "lucide-react";
import axiosInstance from "../Axios/axios";
import toast from "react-hot-toast";
import { ApiURL } from "../Variable";

const ProductReviewModal = ({ isOpen, onClose, product, user, onReviewSaved, existingReview }) => {
  const [selectedStars, setSelectedStars] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [existingImage, setExistingImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill user details and existing review details whenever modal opens
  useEffect(() => {
    if (isOpen) {
      if (existingReview) {
        setSelectedStars(existingReview.rating || 5);
        setReviewContent(existingReview.message || "");
        setReviewerName(existingReview.reviewer_name || "");
        setReviewerEmail(existingReview.reviewer_email || user?.email || "");
        setExistingImage(existingReview.image_url || null);
      } else if (user) {
        setReviewerName(user.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : user.name || "");
        setReviewerEmail(user.email || "");
        setExistingImage(null);
      }
    }
  }, [isOpen, user, existingReview]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedStars(5);
      setReviewContent("");
      setUploadedImages([]);
      setExistingImage(null);
      setSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const p_id =
    product.p_id ||
    product.product_id ||
    product.pid ||
    product.id ||
    product.productId;

  const productName =
    product.productName ||
    product.product_name ||
    product.name ||
    "this product";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!p_id || submitting) return;

    if (selectedStars === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewContent.trim()) {
      toast.error("Please write your review");
      return;
    }

    setSubmitting(true);
    try {
      const isEditing = !!existingReview;
      const formData = new FormData();
      formData.append("p_id", Number(p_id));
      formData.append("rating", selectedStars);
      formData.append("message", reviewContent.trim());
      formData.append("reviewer_name", reviewerName.trim());
      formData.append("reviewer_email", reviewerEmail.trim());
      if (user?.u_id) {
        formData.append("u_id", user.u_id);
      }
      if (isEditing) {
        formData.append("r_id", existingReview.r_id);
        if (!existingImage && existingReview.image_url) {
          formData.append("delete_image", "true");
        }
      }

      uploadedImages.forEach((img) => {
        if (img instanceof File) {
          formData.append("userReviewImage", img);
        }
      });

      const url = isEditing ? "/updateuserreview" : "/adduserreview";
      const res = await axiosInstance.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.status === 1) {
        // ✅ One-time success toast
        toast.success(isEditing ? "Review updated successfully." : "Review submitted successfully.");
        // ✅ Persist to localStorage so badge survives page refresh
        try {
          const stored = JSON.parse(localStorage.getItem("glamgait_reviewed_pids") || "[]");
          if (!stored.includes(Number(p_id))) {
            stored.push(Number(p_id));
            localStorage.setItem("glamgait_reviewed_pids", JSON.stringify(stored));
          }
        } catch (_) { }
        // ✅ Notify parent → badge shows immediately, modal closes
        if (onReviewSaved) onReviewSaved(p_id);
        onClose();
      } else {
        toast.error(res.data?.description || res.data?.message || "Failed to submit review");
      }
    } catch (err) {
      const msg =
        err.response?.data?.description ||
        err.response?.data?.message ||
        err.message ||
        "Something went wrong";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const removeImage = (idx) =>
    setUploadedImages((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-[#1a1a1a] font-poppins">
              {existingReview ? "Edit Your Review" : "Write a Review"}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 font-poppins capitalize">
              {productName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Star Rating */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#3D3D3D] font-poppins">
                Your Rating <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedStars(star)}
                    className="transition-transform hover:scale-110 cursor-pointer"
                    aria-label={`${star} star`}
                  >
                    <Star
                      size={28}
                      className={
                        star <= selectedStars
                          ? "fill-[#F5A623] text-[#F5A623]"
                          : "text-gray-300 hover:text-[#F5A623]"
                      }
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-500 font-poppins">
                  {selectedStars === 1
                    ? "Poor"
                    : selectedStars === 2
                      ? "Fair"
                      : selectedStars === 3
                        ? "Good"
                        : selectedStars === 4
                          ? "Very Good"
                          : "Excellent"}
                </span>
              </div>
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="review-name" className="text-sm font-medium text-[#3D3D3D] font-poppins">
                  Your Name
                </label>
                <input
                  id="review-name"
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#414141] focus:outline-none transition font-poppins"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="review-email" className="text-sm font-medium text-[#3D3D3D] font-poppins">
                  Your Email
                </label>
                <input
                  id="review-email"
                  type="email"
                  value={reviewerEmail}
                  onChange={(e) => setReviewerEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#414141] focus:outline-none transition font-poppins"
                />
              </div>
            </div>

            {/* Review Text */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="review-message" className="text-sm font-medium text-[#3D3D3D] font-poppins">
                Your Review <span className="text-red-400">*</span>
              </label>
              <textarea
                id="review-message"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#414141] focus:outline-none transition resize-none font-poppins"
              />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#3D3D3D] font-poppins">
                Add Photos{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-200 rounded-xl px-4 py-4 cursor-pointer transition">
                <ImagePlus size={20} className="text-gray-400" />
                <span className="text-sm text-gray-400 font-poppins">Click to upload images</span>
                <input
                  type="file"
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

              {(existingImage || uploadedImages.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {/* Existing Image */}
                  {existingImage && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <img
                        src={existingImage.startsWith("http") ? existingImage : `${ApiURL}/assets/UserReviews/${existingImage}`}
                        alt="existing review"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setExistingImage(null)}
                        className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-black transition cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  )}

                  {/* Uploaded Images */}
                  {uploadedImages.map((file, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-black transition cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#004534] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#003428] transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer font-poppins"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewModal;
