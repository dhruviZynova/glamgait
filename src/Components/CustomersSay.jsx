import { useEffect, useState } from "react";
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

const CustomersSay = () => {
  const userData = userInfo();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.post(`${ApiURL}/getalluserreviews`, {
        page: 1,
        perPage: 10, // Fetch more for the slider
        headers: {
          Authorization: `Bearer ${userData.auth_token}`,
        }
      });

      if (response.data.status === 1) {
        setReviews(response.data.data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Don't render anything while loading or when there are no reviews
  if (loading || reviews.length === 0) return null;

  return (
    <section className="relative py-8 overflow-hidden w-full">
      {/* Title & Description */}
      <div className="text-center max-w-2xl mx-auto mb-16 relative z-10 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-['Judson'] font-bold font-700 text-[#000000] mb-4 leading-tight">
          What Customers Saying
        </h2>
        <p className="text-[#767676] font-Poppins font-400 text-base max-w-2xl mx-auto">
          Reviews from People Who Love Fancy
        </p>
      </div>

      {/* Slider Layout - Edge to Edge */}
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

