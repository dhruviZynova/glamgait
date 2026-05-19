import React, { useState, useEffect } from "react";
import "../style/CategorySection.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

import axiosInstance from "../Axios/axios";
import { ApiURL, createSlug, getFullImageUrl } from "../Variable";

const CategorySection = () => {
    const [categoryData, setCategoryData] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get(`${ApiURL}/getcategory`);
            if (response?.data?.status) {
                setCategoryData(response?.data?.data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <section
            className="category-section"
        >
            <div className="container">
                <div className="category-header">
                    <h2 className="title">Shop by categories</h2>
                    <p className="subtitle">
                        Explore our curated categories and discover fashion that fits your vibe.
                    </p>
                </div>
                <div className="category-bottom-container">
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
                        {categoryData.length > 0 && categoryData.map((category, index) => {
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
                </div>
            </div>
        </section>
    );
};

export default CategorySection;
