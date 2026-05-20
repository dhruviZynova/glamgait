import React, { useState, useEffect } from "react";
import "../style/CategorySection.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

import axiosInstance from "../Axios/axios";
import { ApiURL, createSlug, getFullImageUrl } from "../Variable";

// Elegant loading skeletons matching the aspect-ratio and border-radius of the category cards
const CategorySkeletonGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 py-4 w-full">
        {[0, 1, 2, 3].map((idx) => (
            <div key={idx} className="flex flex-col items-center w-full">
                <div className="w-full aspect-[3/4] rounded-xl bg-gray-200 animate-pulse relative overflow-hidden flex flex-col justify-end p-6">
                    <div className="h-5 w-3/4 rounded bg-gray-300 mx-auto animate-pulse" />
                </div>
            </div>
        ))}
    </div>
);

// High-fidelity luxury styled Error state with retry option
const ErrorFallback = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center p-8 py-14 bg-red-50/40 border border-red-100 rounded-2xl max-w-lg mx-auto my-4 text-center shadow-sm">
        <div className="w-10 h-10 bg-red-100 text-red-700 rounded-full flex items-center justify-center mb-4 text-lg font-bold font-serif">!</div>
        <h3 className="text-gray-900 font-serif text-lg font-bold mb-2">Unable to Load Categories</h3>
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
    <div className="flex flex-col items-center justify-center p-8 py-14 bg-[#F3F0ED]/40 border border-[#F3F0ED] rounded-2xl max-w-lg mx-auto my-4 text-center">
        <svg className="w-10 h-10 text-gray-400 mb-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 className="text-gray-900 font-serif text-lg font-bold mb-2">Categories Not Found</h3>
        <p className="text-gray-600 font-sans text-sm max-w-xs leading-relaxed">{message || "No categories found. Please check back later."}</p>
    </div>
);

const CategorySection = () => {
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`${ApiURL}/getcategory`);
            if (response?.data?.status && response?.data?.data) {
                setCategoryData(response.data.data);
            } else {
                setCategoryData([]);
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
            setError("We couldn't reach the server. Please verify your connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <section className="category-section">
            <div className="container">
                <div className="category-header">
                    <h2 className="title">Shop by categories</h2>
                    <p className="subtitle">
                        Explore our curated categories and discover fashion that fits your vibe.
                    </p>
                </div>
                <div className="category-bottom-container">
                    {loading ? (
                        <CategorySkeletonGrid />
                    ) : error ? (
                        <ErrorFallback message={error} onRetry={fetchCategories} />
                    ) : categoryData.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <Swiper
                            modules={[Pagination, Autoplay]}
                            spaceBetween={20}
                            slidesPerView={1.2}
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            breakpoints={{
                                480: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                    slidesPerGroup: 1
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 30,
                                    slidesPerGroup: 1
                                },
                                1024: {
                                    slidesPerView: 4,
                                    spaceBetween: 30,
                                    slidesPerGroup: 1
                                },
                            }}
                            className="bottom-swiper"
                        >
                            {categoryData.map((category, index) => {
                                const imageUrl = category?.cate_image
                                    ? getFullImageUrl(category.cate_image, "Category")
                                    : "";
                                const cateSlug = createSlug(category?.cate_name);
                                return (
                                    <SwiperSlide key={category?.cate_id || index}>
                                        <Link to={`/collections/${cateSlug}`} className="bottom-card-link">
                                            <div className="bottom-img-wrapper">
                                                <img
                                                    src={imageUrl}
                                                    alt={category?.cate_name}
                                                    className="bottom-img"
                                                    loading="lazy"
                                                />
                                                <div className="category-name-overlay">
                                                    <span>{category?.cate_name}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CategorySection;
