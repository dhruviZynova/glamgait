import React, { lazy, Suspense, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HomeHero from "../Components/HomeHero";
import axiosInstance from "../Axios/axios";
import ScrollReveal from "../Components/Ui/ScrollReveal";
import { ApiURL, createSlug } from "../Variable";
import { getCategories as getCachedCategories } from "../utils/dataCache";

// Lazy-loaded components below the fold to keep the initial main bundle light
const CategorySection = lazy(() => import("../Components/CategorySection"));
const BannerSection = lazy(() => import("../Components/BannerSection"));
const LatestArrivalsByCategories = lazy(() => import("../Components/LatestArrivalsByCategories"));
const FashionShowcase = lazy(() => import("../Components/FashionShowcase"));
const CollectionBanner = lazy(() => import("../Components/CollectionBanner"));
const CustomersSay = lazy(() => import("../Components/CustomersSay"));
const HolidayBanner = lazy(() => import("../Components/HolidayBanner"));
const BrandBanner = lazy(() => import("../Components/BrandBanner"));
const FAQSection = lazy(() => import("../Components/FAQSection"));

import bgImage from "../assets/images/bgimage6.png";

// Lightweight placeholder height matching for subcomponents to prevent layout shifts (CLS)
const SectionPlaceholder = ({ height = "h-40" }) => (
  <div className={`w-full ${height} bg-white animate-pulse flex items-center justify-center`}>
    <div className="w-8 h-8 border-2 border-[#113d33]/20 border-t-[#113d33] rounded-full animate-spin"></div>
  </div>
);

const HomePage = () => {
  const [firstCategorySlug, setFirstCategorySlug] = useState("");

  useEffect(() => {
    const fetchFirstCategory = async () => {
      try {
        const data = await getCachedCategories(axiosInstance);
        if (data && data.length > 0) {
          const firstCat = data[0];
          const slug = createSlug(firstCat.cate_name);
          setFirstCategorySlug(slug);
        }
      } catch (err) {
        console.error("Error fetching first category for Shop Now button:", err);
      }
    };
    fetchFirstCategory();
  }, []);

  return (
    <div className="overflow-x-hidden relative">
      <HomeHero />

      <Suspense fallback={<SectionPlaceholder height="h-64" />}>
        <CategorySection />
      </Suspense>

      <Suspense fallback={<SectionPlaceholder height="h-96" />}>
        <BannerSection />
      </Suspense>

      <Suspense fallback={<SectionPlaceholder height="h-[600px]" />}>
        <LatestArrivalsByCategories />
      </Suspense>

      {/* === Category Background Banner Section === */}
      <section className="relative w-full overflow-hidden py-6 md:py-16">
        {/* Background Image */}
        <div
          className="relative w-full h-[480px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[630px] bg-fixed bg-cover bg-top"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ background: "linear-gradient(90deg, rgba(243, 240, 237, 0.7) 0%, rgba(243, 240, 237, 0.4) 50%, rgba(243, 240, 237, 0.1) 100%)" }}
          ></div>

          {/* Text Content */}
          <ScrollReveal
            className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24 w-full md:w-2/3 lg:w-1/2"
            animation="fade-right"
            duration={1000}
          >
            <div className="flex flex-col items-start">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#2C2A29] leading-tight font-serif" style={{ fontFamily: "var(--font-playfair), Playfair Display, serif", fontWeight: 500 }}>
                Designer <br /> Kurtis
              </h2>

              {/* Decorative Divider */}
              <div className="flex items-center w-full max-w-[280px] sm:max-w-[320px] my-5">
                <div className="flex-grow h-px bg-[#2C2A29]/30"></div>
                <svg className="w-8 h-4 mx-3 text-[#2C2A29]/60" viewBox="0 0 32 16" fill="currentColor">
                  <path d="M16 4c0 0-2 2.5-3.5 3.5C11 8.5 9 8 8 8c-1.5 0-3 1-3 2.5 0 1.5 1.5 2 3 2 2.5 0 4.5-2 5.5-3.5.5.8 1.5 1.5 2.5 1.5s2-.7 2.5-1.5c1 1.5 3 3.5 5.5 3.5 1.5 0 3-.5 3-2 0-1.5-1.5-2.5-3-2.5-1 0-3 .5-4.5-.5C18 6.5 16 4 16 4zm0 5.5c-.5 0-1-.5-1-1s.5-1 1-1 1 .5 1 1-.5 1-1 1z" />
                </svg>
                <div className="flex-grow h-px bg-[#2C2A29]/30"></div>
              </div>

              <p className="text-sm sm:text-base md:text-lg text-[#2C2A29]/80 mb-6 md:mb-8 max-w-sm font-medium leading-relaxed">
                Effortless style meets everyday comfort. Explore our collection of designer kurtis.
              </p>

              <Link
                to={firstCategorySlug ? `/collections/${firstCategorySlug}` : "/collections/lehengas"}
                className="w-fit px-8 py-3 bg-[#233B23] text-white text-sm font-medium tracking-widest uppercase hover:bg-[#1C2F2F] transition-all duration-300 rounded-lg"
              >
                Shop Now
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Suspense fallback={<SectionPlaceholder height="h-[500px]" />}>
        <FashionShowcase />
      </Suspense>

      <Suspense fallback={<SectionPlaceholder height="h-[450px]" />}>
        <CollectionBanner />
      </Suspense>

      <Suspense fallback={<SectionPlaceholder height="h-[300px]" />}>
        <CustomersSay />
      </Suspense>

      <Suspense fallback={<SectionPlaceholder height="h-[350px]" />}>
        <HolidayBanner />
      </Suspense>

      <Suspense fallback={<SectionPlaceholder height="h-32" />}>
        <BrandBanner />
      </Suspense>

      <Suspense fallback={<SectionPlaceholder height="h-[400px]" />}>
        <FAQSection />
      </Suspense>
    </div>
  );
};

export default HomePage;

