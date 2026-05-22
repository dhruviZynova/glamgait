import React, { lazy, Suspense, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HomeHero from "../Components/HomeHero";
import axiosInstance from "../Axios/axios";
import { ApiURL, createSlug } from "../Variable";

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

import bgImage from "../assets/images/bgimage3.webp";

// Lightweight placeholder height matching for subcomponents to prevent layout shifts (CLS)
const SectionPlaceholder = ({ height = "h-40" }) => (
  <div className={`w-full ${height} bg-[#F3F0ED] animate-pulse flex items-center justify-center`}>
    <div className="w-8 h-8 border-2 border-[#113d33]/20 border-t-[#113d33] rounded-full animate-spin"></div>
  </div>
);

const HomePage = () => {
  const [firstCategorySlug, setFirstCategorySlug] = useState("");

  useEffect(() => {
    const fetchFirstCategory = async () => {
      try {
        const response = await axiosInstance.get(`${ApiURL}/getcategory`);
        if (response?.data?.status && response?.data?.data && response.data.data.length > 0) {
          const firstCat = response.data.data[0];
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
            style={{ background: "linear-gradient(90deg, rgba(243, 240, 237, 0.7) 0%, rgba(243, 240, 237, 0.3) 50%, rgba(243, 240, 237, 0) 100%)" }}
          ></div>

          {/* Text Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-2 md:px-16 lg:px-24 w-full md:w-2/3 lg:w-1/2">
            <h3 className="text-green-800 text-sm md:text-base font-semibold tracking-widest uppercase mb-2">New Collection</h3>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4" style={{ fontFamily: "serif" }}>
              Modesty is the <br /> New Beauty
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-800 mb-6 md:mb-8 max-w-md font-medium">
              Discover our exclusive range of elegant, comfortable, and beautifully crafted modest wear tailored just for you.
            </p>
            <Link
              to={firstCategorySlug ? `/collections/${firstCategorySlug}` : "/collections/lehengas"}
              className="w-fit px-6 py-3 bg-[#1C2F2F] text-white rounded-lg hover:bg-[#1C2F2F]/80 transition-colors"
            >
              Shop Now
            </Link>
          </div>
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

