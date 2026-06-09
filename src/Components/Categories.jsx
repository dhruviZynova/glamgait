import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import leftlight from "../assets/leftlight.png";
import rightlight from "../assets/rightlight.png";
import waves from "../assets/waves.png";
import axiosInstance from "../Axios/axios";
import { ApiURL, createSlug } from "../Variable";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/getcategory");
      if (response?.data?.status === 1) {
        setCategories(response.data.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const renderedCategories = React.useMemo(() => {
    return categories?.map((category) => {
      const image = category.cate_image;
      const cate_slug = createSlug(category.cate_name);
      return (
        <div key={category.cate_id} className="hover:scale-105 transition-all duration-300">
          <NavLink
            to={`/collections/${cate_slug}`}
            className="rounded-lg overflow-hidden cursor-pointer flex-shrink-0 xl:flex-shrink xl:min-w-0 xl:basis-1/5"
          >
            <div className="relative pt-[120%] w-42 h-60 md:w-60 md:h-87 z-30">
              <img
                src={`${ApiURL}/assets/Category/${image}`}
                alt={category.cate_name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover hover:brightness-110 transition-all duration-300"
              />
            </div>
            <div className="mt-3 text-center pb-2">
              <span className="text-gray-800 text-base md:text-lg font-semibold capitalize">
                {category.cate_name}
              </span>
            </div>
          </NavLink>
        </div>
      );
    });
  }, [categories]);

  return (
    <section className="relative py-16 px-4 bg-[#F3F0ED] overflow-visible">
      {/* Top title and description */}
      <div className="text-center max-w-4xl mx-auto mb-6 md:mb-12 relative z-10">
        <h2 className="text-[30px] md:text-[34px] xl:text-[34px] font-bold text-gray-800 mb-2">
          Shop By Categories
        </h2>
        <p className="text-[12px] md:text-[16px] text-gray-600">
          Explore our categories and find your style
        </p>
      </div>

      {/* Scroll Buttons - Hidden on xl and above */}
      <div className="hidden lg:flex xl:hidden items-center justify-between max-w-7xl mx-auto mb-4 px-4 pointer-events-none">
        <button
          onClick={() => scroll("left")}
          className="absolute left-10 bottom-5 -translate-y-1/2 z-20 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition pointer-events-auto"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-10 bottom-5 -translate-y-1/2 z-20 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition pointer-events-auto"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Horizontal Scrollable Categories on <xl, Grid on xl+ */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div
          ref={scrollRef}
          className="overflow-x-auto xl:overflow-visible hide-scrollbar scroll-smooth xl:px-0"
        >
          <div className="flex space-x-4 w-max xl:w-auto xl:grid xl:grid-cols-5 xl:gap-5 xl:space-x-0">
            {renderedCategories}
          </div>
        </div>
      </div>

      {/* Decorative top right and most right waves */}
      <div className="absolute h-55 -top-5 -right-5 sm:h-60 sm:right-5 md:h-80 lg:h-100 lg:-top-13 xl:right-30 2xl:right-50 2k:right-100 4k:right-140 -rotate-10 z-0">
        <img
          src={waves}
          alt="Decorative"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="hidden md:block absolute md:h-90 md:-right-25 md:top-60 xl:-right-30 2xl:-right-5 2k:right-40 4k:right-90 z-0 -rotate-25">
        <img
          src={waves}
          alt="Decorative"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Decorative bottom images */}
      <div className=" relative overflow-visible z-10">
        <div className="absolute h-30 -top-5 left-5 sm:-top-10 sm:left-35 sm:h-35 md:h-45 md:left-50 md:-top-12 lg:h-50 xl:h-55 lg:left-50 2xl:left-80 2k:left-120 4k:left-200">
          <img
            src={leftlight}
            alt="Decorative"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="hidden md:block absolute h-40 -right-2 -top-15 sm:h-55 sm:right-5 md:h-60 lg:h-70 lg:right-5 xl:h-80 2xl:right-50 2k:right-100 4k:right-150">
          <img
            src={rightlight}
            alt="Decorative"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Categories;
