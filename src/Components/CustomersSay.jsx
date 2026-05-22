import { useEffect, useState, useCallback } from "react";
import ReviewCard from "./ReviewCard";
import { ApiURL, userInfo } from "../Variable";
import axiosInstance from "../Axios/axios";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";

// import required modules
import { Autoplay } from "swiper/modules";

// High-fidelity luxury styled Error state with retry option
const ErrorFallback = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-8 py-14 bg-red-50/40 border border-red-100 rounded-2xl max-w-lg mx-auto my-4 text-center shadow-sm relative z-10">
    <div className="w-10 h-10 bg-red-100 text-red-700 rounded-full flex items-center justify-center mb-4 text-lg font-bold font-serif">!</div>
    <h3 className="text-gray-900 font-serif text-lg font-bold mb-2">Unable to Load Testimonials</h3>
    <p className="text-gray-600 font-sans text-sm mb-6 max-w-xs leading-relaxed">{message || "We encountered a temporary network issue. Please try again."}</p>
    <button
      onClick={onRetry}
      className="px-6 py-2.5 bg-[#02382A] text-[#fbf9f6] text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-[#034f3b] transition duration-300 shadow-md transform active:scale-95 cursor-pointer"
    >
      Retry Connection
    </button>
  </div>
);

// Premium stylized Empty state
const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-8 py-14 bg-[#F3F0ED]/40 border border-[#F3F0ED] rounded-2xl max-w-lg mx-auto my-4 text-center relative z-10">
    <h3 className="text-gray-900 font-serif text-lg font-bold mb-2">No Reviews Yet</h3>
    <p className="text-gray-600 font-sans text-sm max-w-xs leading-relaxed">{message || "No client testimonials have been posted yet. Check back soon!"}</p>
  </div>
);

// Elegant shimmering skeletons replicating ReviewCard aspects (aspect-[4/4], circular avatar, name, paragraph lines)
const TestimonialSkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full px-4 sm:px-12 relative z-10">
    {[0, 1, 2, 3].map((idx) => (
      <div key={idx} className="relative w-full aspect-[4/4] bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center p-6 shadow-sm overflow-hidden animate-pulse">
        {/* Profile Image Circle Placeholder */}
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 mb-4 animate-pulse" />

        {/* Name Placeholder */}
        <div className="h-5 w-1/3 rounded bg-gray-200 mb-3 animate-pulse" />

        {/* Review Line 1 */}
        <div className="h-3 w-3/4 rounded bg-gray-200 mb-2 animate-pulse" />
        {/* Review Line 2 */}
        <div className="h-3 w-1/2 rounded bg-gray-200 animate-pulse" />
      </div>
    ))}
  </div>
);

const CustomersSay = () => {
  const userData = userInfo();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.post(`${ApiURL}/getalluserreviews`,
        {
          page: 1,
          perPage: 10,
        }
      );

      if (response.data.status === 1) {
        setReviews(response.data.data.reviews || []);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("We couldn't reach the server. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  }, [userData?.auth_token]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <section className="relative py-10 md:py-16 overflow-hidden w-full">
      {/* Title & Description */}
      <div className="text-center max-w-2xl mx-auto mb-8 md:mb-16 relative z-10 px-4">
        <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-['Judson'] font-bold font-700 text-[#000000] mb-4 leading-tight">
          What Customers Saying
        </h2>
        <p className="text-[#767676] font-Poppins font-400 text-base max-w-2xl mx-auto">
          Reviews from People Who Love Fancy
        </p>
      </div>

      {/* Content Render Grid */}
      {loading ? (
        <TestimonialSkeletonGrid />
      ) : error ? (
        <ErrorFallback message={error} onRetry={fetchReviews} />
      ) : reviews.length === 0 ? (
        <EmptyState />
      ) : (
        /* Slider Layout - Edge to Edge */
        <div className="w-full relative z-10">
          <Swiper
            slidesPerView={1}
            spaceBetween={0}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1440: { slidesPerView: 4 },
            }}
            modules={[Autoplay]}
            className="mySwiper testimonial-swiper"
          >
            {reviews.map((item, idx) => (
              <SwiperSlide key={idx}>
                <ReviewCard
                  name={item?.reviewer_name}
                  review={item?.message}
                  image={item?.image}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Decorative Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none z-0">
        <div className="w-full h-full bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      <style>{`
        .testimonial-swiper .swiper-pagination-bullet-active { display: none; }
        .testimonial-swiper .swiper-pagination { display: none; }
      `}</style>
    </section>
  );
};

export default CustomersSay;


