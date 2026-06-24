import { useEffect, useState, useCallback } from "react";
import ReviewCard from "./ReviewCard";
import { ApiURL, userInfo } from "../Variable";
import axiosInstance from "../Axios/axios";
import ScrollReveal from "./Ui/ScrollReveal";
import frame2 from "../assets/images/frame2.png";

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
  <div className="flex flex-col items-center justify-center p-8 py-14 border border-[#F3F0ED] rounded-2xl max-w-lg mx-auto my-4 text-center relative z-10">
    <h3 className="text-gray-900 font-serif text-lg font-bold mb-2">No Reviews Yet</h3>
    <p className="text-gray-600 font-sans text-sm max-w-xs leading-relaxed">{message || "No client testimonials have been posted yet. Check back soon!"}</p>
  </div>
);

// Elegant shimmering skeletons replicating ReviewCard aspects (aspect-[4/4], arch frame image, circular avatar, name, paragraph lines)
const TestimonialSkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full relative z-10">
    {[0, 1, 2, 3].map((idx) => (
      <div key={idx} className="relative w-full aspect-[4/4] overflow-hidden animate-pulse">
        {/* Arch Frame Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={frame2}
            alt="Arch Frame"
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
          <div className="relative flex flex-col items-center w-full max-w-sm">
            {/* Image Placeholder */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 mb-4 border-4 border-gray-100" />
            
            {/* Product Name Placeholder */}
            <div className="h-3 w-1/2 rounded bg-gray-200 mb-3" />
            
            {/* Rating Stars Placeholder */}
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-gray-200" />
              ))}
            </div>

            {/* Review Message Placeholder */}
            <div className="h-3 w-3/4 rounded bg-gray-200 mb-2" />
            <div className="h-3 w-1/2 rounded bg-gray-200 mb-3" />

            {/* Reviewer Name Placeholder */}
            <div className="h-3.5 w-1/4 rounded bg-gray-300" />
          </div>
        </div>
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

  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/getproducts`);
      if (res.data.status === 1) {
        setProducts(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
    fetchProducts();
  }, [fetchReviews, fetchProducts]);

  const getProductForReview = (p_id) => {
    return products.find(p => String(p.p_id) === String(p_id));
  };

  return (
    <section className="relative py-10 md:py-16 overflow-hidden w-full">

      {/* Title & Description */}
      <ScrollReveal animation="fade-up" duration={800}>
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-16 relative z-10 px-4">
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-['Judson'] font-bold font-700 text-[#000000] mb-4 leading-tight">
            What Customers Saying
          </h2>
          <p className="text-[#767676] font-Poppins font-400 text-base max-w-2xl mx-auto">
            Reviews from People Who Love Fancy
          </p>
        </div>
      </ScrollReveal>

      {/* Content Render Grid / Carousel */}
      <ScrollReveal animation="scale-up" duration={1000} delay={150}>
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
              loop={reviews.length > 4}
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
              className="mySwiper testimonial-swiper py-4"
            >
              {reviews.map((item, idx) => {
                const product = getProductForReview(item.p_id);
                return (
                  <SwiperSlide key={idx}>
                    <ReviewCard
                      name={item?.reviewer_name}
                      review={item?.message}
                      rating={item?.rating || 5}
                      product={product}
                      fallbackProductName={item?.product_name}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}
      </ScrollReveal>

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


