import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

import image1 from "../assets/images/bgimage5.png";
import image2 from "../assets/images/ramadan_fashion_hero_banner.webp";

const slides = [
  {
    id: 1,
    image: image1,
    subtitle: "Kundrat Signature",
    title: "The Timeless \n Heritage Saree",
    description: "Experience the allure of hand-woven luxury. Crafted with premium silk and intricate zari embroidery, our signature sarees are designed for your most celebrated moments.",
    align: "left",
    textColor: "text-gray-900",
    subColor: "text-gray-600",
    descColor: "text-gray-800",
    btnPrimary: "bg-gray-900 text-white hover:bg-gray-800 border-gray-900",
    btnSecondary: "bg-transparent border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white",
    btnPrimaryText: "Shop Sarees",
    btnSecondaryText: "Our Heritage",
    bgClass: "bg-[75%_center] md:bg-center",
    gradient: "linear-gradient(90deg, rgba(252, 249, 245, 0.95) 0%, rgba(252, 249, 245, 0.5) 50%, rgba(252, 249, 245, 0) 100%)"
  },
  {
    id: 2,
    image: image2,
    subtitle: "Modest Luxury",
    title: "Elegance in \n Modest Wear",
    description: "Discover a refined collection of designer abayas and modest gowns. Flowing silhouettes tailored in premium, breathable fabrics, embellished with delicate gold artistry.",
    align: "right",
    textColor: "text-white",
    subColor: "text-amber-200 font-medium",
    descColor: "text-gray-200",
    btnPrimary: "bg-amber-500 text-gray-950 hover:bg-amber-400 border-amber-500",
    btnSecondary: "bg-transparent border-white text-white hover:bg-white hover:text-gray-950",
    btnPrimaryText: "Shop Modest Wear",
    btnSecondaryText: "Explore Styles",
    bgClass: "bg-[28%_top] md:bg-top",
    gradient: "linear-gradient(270deg, rgba(24, 18, 15, 0.95) 0%, rgba(24, 18, 15, 0.5) 50%, rgba(24, 18, 15, 0) 100%)"
  }
];

const HomeHero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full relative h-[60vh] md:h-[85vh]">
      {/* React 19 Preload Link - hoisted automatically to document <head> for LCP optimization */}
      <link rel="preload" as="image" href={image1} fetchPriority="high" />

      {/* Fixed Backgrounds Rendered Outside Swiper so bg-fixed works perfectly like the About page */}
      {slides.map((slide, index) => (
        <div
          key={`bg-${slide.id}`}
          className={`absolute inset-0 bg-cover ${slide.bgClass} bg-fixed transition-opacity duration-1000 ease-in-out ${index === activeIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
            }`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          {/* Dynamic Light/Dark luxury overlay tailored to the image */}
          <div className="absolute inset-0" style={{ background: slide.gradient }}></div>
        </div>
      ))}

      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        speed={1000}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-full relative z-10"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className={`w-full h-full relative flex items-center ${slide.align === 'right' ? 'justify-end' : 'justify-start'}`}>
              {/* Hero Content */}
              <div className="relative z-10 px-6 md:px-16 lg:px-24 w-full">
                <div className={`max-w-xl text-left ${slide.align === 'right' ? 'ml-auto' : 'mr-auto'}`}>
                  <span className={`block text-sm md:text-base font-semibold tracking-widest uppercase mb-3 ${slide.subColor}`}>
                    {slide.subtitle}
                  </span>
                  <h1 className={`text-2xl md:text-6xl font-serif mb-2 md:mb-6 leading-tight whitespace-pre-line ${slide.textColor}`}>
                    {slide.title}
                  </h1>
                  <p className={`text-sm md:text-lg mb-4 md:mb-8 leading-relaxed ${slide.descColor}`}>
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HomeHero;
