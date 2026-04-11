import React, { useState, useEffect } from "react";
import "../style/CategorySection.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

import bgPattern from "../assets/images/transprantbg1.png";
import frame from "../assets/images/frame1.png";
import model from "../assets/images/categorie1.png";
// import c1 from "../assets/images/c1.png";
// import c2 from "../assets/images/c2.png";
// import c3 from "../assets/images/c3.png";

import axiosInstance from "../Axios/axios";
import { ApiURL } from "../Variable";

const CategorySection = () => {
    // const bottomImages = [c1, c2, c3, c1];
    const [categoryData, setCategoryData] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get(`${ApiURL}/getcategory`);
            console.log("category response", response.data);
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
        // style={{ backgroundImage: `url(${bgPattern})` }}
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
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 30,
                            },
                        }}
                        className="bottom-swiper"
                    >
                        {categoryData.length > 0 && categoryData.map((category, index) => (
                            <SwiperSlide key={category?.cate_id || index}>
                                <div className="bottom-img-wrapper">
                                    <img
                                        src={`${ApiURL}/assets/Category/${category?.cate_image}`}
                                        alt={category?.cate_name}
                                        className="bottom-img"
                                    />
                                    <div className="category-name-overlay">
                                        <span>{category?.cate_name}</span>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default CategorySection;
