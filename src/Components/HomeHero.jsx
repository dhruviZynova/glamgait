import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import axiosInstance from "../Axios/axios";
import { getFullImageUrl } from "../Variable";

import image1 from "../assets/images/bgimage5.png";
import image2 from "../assets/images/bgimage7.png";

const defaultSlides = [
  { id: 1, image: image1 },
  { id: 2, image: image2 }
];

const HomeHero = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await axiosInstance.get("/getsliders");
        if (response?.data?.status === 1 && response?.data?.data?.length > 0) {
          const apiSlides = response.data.data.map((item, index) => ({
            id: item.image_id || index,
            image: getFullImageUrl(item.image, "Slider")
          }));
          setSlides(apiSlides);
        } else {
          setSlides(defaultSlides);
        }
      } catch (error) {
        console.error("Error fetching slider images:", error);
        setSlides(defaultSlides);
      }
    };

    fetchSliders();
  }, []);

  if (slides.length === 0) {
    return (
      <section className="w-full h-[30vh] sm:h-[50vh] md:h-[100vh] animate-pulse flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#113d33]/20 border-t-[#113d33] rounded-full animate-spin"></div>
      </section>
    );
  }

  return (
    <section className="w-full h-[30vh] sm:h-[50vh] md:h-[100vh] relative overflow-hidden">
      {slides[0]?.image && <link rel="preload" as="image" href={slides[0].image} fetchPriority="high" />}

      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={slides.length > 1}
        speed={1000}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            <img
              src={slide.image}
              alt="Slider Banner"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HomeHero;
