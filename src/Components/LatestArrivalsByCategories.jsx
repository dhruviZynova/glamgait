import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../Axios/axios";
import { ApiURL } from "../Variable";
import "../style/LatestArrivalsByCategories.css";

const LatestArrivalsByCategories = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const createSlug = (name) => {
        if (!name) return "";
        return name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    useEffect(() => {
        const fetchLatestArrivals = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`${ApiURL}/getlatestarrivals`);
                console.log("Latest Arrivals Response:", response.data);
                if (response.data.status === 1) {
                    setProducts(response.data.data || []);
                }
            } catch (error) {
                console.error("Error fetching latest arrivals:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestArrivals();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 bg-[#F3F0ED]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#02382A]"></div>
            </div>
        );
    }

    // If no products, we can return null or a message
    if (products.length === 0) {
        return null;
    }

    return (
        <section className="latest-arrivals-section">
            <div className="container">
                <div className="latest-arrivals-header">
                    <h2 className="title">Latest Arrivals By Categories</h2>
                    <p className="subtitle">
                        Explore our curated categories and discover fashion that fits your vibe.
                    </p>
                </div>

                <div className="grid-container">
                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 pb-8">
                        {products.map((product) => {
                            const discountPercentage =
                                product?.original_price && product?.original_price > product?.price
                                    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                                    : 0;

                            const productSlug = product.slug || createSlug(product.name) || product.p_id;

                            return (
                                <Link
                                    to={`/product/${productSlug}`}
                                    key={product.p_id}
                                    style={{ textDecoration: "none", color: "inherit" }}
                                >
                                    <div className="arrival-card">
                                        <div className="card-image-wrapper">
                                            <span className="off-badge">{discountPercentage > 0 ? `${discountPercentage}% OFF` : ''}</span>
                                            <img
                                                src={`${ApiURL}/assets/Products/${product?.productcolors?.[0]?.productimages?.[0]?.image_url || ''}`}
                                                alt={product.name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/placeholder.png"; // Fallback image if needed
                                                }}
                                            />
                                        </div>
                                        <div className="card-info">
                                            <div className="info-header">
                                                <h3 className="product-name">{product.name}</h3>
                                                <div className="product-price">
                                                    {product.original_price > product.price && (
                                                        <span className="original-price">₹{product.original_price}</span>
                                                    )}
                                                    <span>₹{product.price}</span>
                                                </div>
                                            </div>
                                            <p className="category-tag">
                                                {product.category?.cate_name || product?.productcolors?.[0]?.color?.color_name || "Style"}
                                            </p>
                                            <div className="color-swatches">
                                                {product.productcolors?.slice(0, 4).map((color) => (
                                                    <div
                                                        key={color.pcolor_id}
                                                        className="swatch"
                                                        style={{ backgroundColor: color.color?.color_code }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LatestArrivalsByCategories;
