import React, { useEffect, useState } from "react";
import imgicon from "../assets/imgicon.svg";
import axiosInstance from "../Axios/axios";
import { ApiURL, userInfo } from "../Variable";
import { Star, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const ReviewCard = ({ review, displayDate }) => {
  return (
    <div className="border border-[#D3D3D3] rounded-[14px] p-6 sm:p-8 mb-6">
      <div className="flex gap-4 sm:gap-6">
        {/* Avatar Placeholder */}
        <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#D9D9D9]" />

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

          <div className="flex items-center gap-6 text-[#3D3D3D] text-xs sm:text-sm font-medium">
            <button className="hover:underline">Like</button>
            <button className="hover:underline">Reply</button>
            <span className="font-normal">{displayDate(review)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Review = ({ p_id }) => {
  const [selectedStars, setSelectedStars] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const user = userInfo();

  const fetchReviews = async () => {
    if (!p_id) return;
    try {
      const res = await axiosInstance.post("/getuserreviews", { p_id });
      if (res.data.status === 1) {
        setReviews(res.data.data);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    if (p_id) fetchReviews();
  }, [p_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.u_id) {
      toast.error("Please login to submit a review");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("u_id", user.u_id);
      formData.append("p_id", p_id);
      formData.append("rating", selectedStars);
      formData.append("message", reviewContent);
      formData.append("reviewer_name", user.first_name || user.name || "Anonymous");

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

  return (
    <div id="reviews" className="">
      {/* Review List */}
      <div className="mb-12">
        {reviews?.slice(0, visibleCount).map((review, index) => (
          <ReviewCard key={index} review={review} displayDate={displayDate} />
        ))}

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
      <div className="border border-[#D3D3D3] rounded-[14px] p-6 sm:p-8 mb-6">
        <div className="flex gap-6">
          <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#D9D9D9]" />
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 flex flex-col gap-2">
                  <label className="text-[#3D3D3D] text-md font-medium font-[oxygen]">Your Name:</label>
                  <input
                    type="text"
                    disabled
                    value={user?.first_name || user?.name || "John Doe"}
                    className="w-full bg-[#FAFAFA] border border-[#00000026] rounded-full px-6 py-4 text-[#7B7B7B] outline-none focus:border-black transition"
                  />
                </div>
                <div className="space-y-2 flex flex-col gap-2">
                  <label className="text-[#3D3D3D] text-md font-medium font-[oxygen]">Your Email:</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || "person@gmail.com"}
                    className="w-full bg-[#FAFAFA] border border-[#00000026] rounded-full px-6 py-4 text-[#7B7B7B] outline-none focus:border-black transition"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="Write your review..."
                  className="w-full bg-[#FAFAFA] border border-[#00000026] rounded-[22px] px-6 py-4 min-h-[150px] text-[#414141] outline-none focus:border-black transition resize-none"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <span className="text-[#3D3D3D] text-md font-medium font-[oxygen]">Your Ratings:</span>
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
                          className={star <= selectedStars ? "fill-[#7B7B7B] text-[#7B7B7B]" : "text-[#7B7B7B] hover:text-black"}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
