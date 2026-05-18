import React from "react";
import CustomersSay from "../Components/CustomersSay";
import HomeHero from "../Components/HomeHero";
import CategorySection from "../Components/CategorySection";
import BannerSection from "../Components/BannerSection";
import LatestArrivalsByCategories from "../Components/LatestArrivalsByCategories";
import CollectionBanner from "../Components/CollectionBanner";
import FashionShowcase from "../Components/FashionShowcase";
import HolidayBanner from "../Components/HolidayBanner";
import BrandBanner from "../Components/BrandBanner";
import FAQSection from "../Components/FAQSection";

import bgImage from "../assets/images/bgimage3.png";

const HomePage = () => {
  return (
    <div className="overflow-x-hidden relative">
      {/* <Hero /> */}
      <HomeHero />

      {/* <Categories /> */}
      <CategorySection />

      <BannerSection />

      <LatestArrivalsByCategories />

      {/* === Category Section === */}
      <section className="relative w-full overflow-hidden py-6 md:py-16">
        {/* Background Image */}
        <div
          className="relative w-full h-[280px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[630px] bg-fixed bg-cover bg-top"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ background: "linear-gradient(90deg, rgba(243, 240, 237, 0.7) 0%, rgba(243, 240, 237, 0.3) 50%, rgba(243, 240, 237, 0) 100%)" }}
          ></div>

          {/* Text Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-10 w-full md:w-2/3 lg:w-1/2">
            <h3 className="text-green-800 text-sm md:text-base font-semibold tracking-widest uppercase mb-2">New Collection</h3>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4" style={{ fontFamily: "serif" }}>
              Modesty is the <br /> New Beauty
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-800 mb-6 md:mb-8 max-w-md font-medium">
              Discover our exclusive range of elegant, comfortable, and beautifully crafted modest wear tailored just for you.
            </p>
            <div>
              <button className="px-8 py-3 bg-[#113d33] rounded-full text-white text-sm md:text-base font-medium hover:bg-[#0d2e26] transition duration-300 shadow-md">
                Explore Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* === Fashion Showcase Section === */}
      <FashionShowcase />

      {/* === Collection Banner Section === */}
      <CollectionBanner />

      {/* === Customers Say Section === */}
      <CustomersSay />

      {/* === Holiday Banner Section === */}
      <HolidayBanner />

      {/* === Brand Banner Section === */}
      <BrandBanner />

      {/* === FAQ Section === */}
      <FAQSection />

    </div>
  );
};

export default HomePage;
