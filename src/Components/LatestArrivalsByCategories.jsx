import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../Axios/axios";
import { ApiURL, createSlug } from "../Variable";
import "../style/LatestArrivalsByCategories.css";
import ProductCardSkeleton from "./ProductCardSkeleton";

// High-fidelity luxury styled Error state with retry option
const ErrorFallback = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center p-8 py-14 bg-red-50/40 border border-red-100 rounded-2xl max-w-lg mx-auto my-4 text-center shadow-sm">
        <div className="w-10 h-10 bg-red-100 text-red-700 rounded-full flex items-center justify-center mb-4 text-lg font-bold font-serif">!</div>
        <h3 className="text-gray-900 font-serif text-lg font-bold mb-2">Unable to Load Latest Arrivals</h3>
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
        <h3 className="text-gray-900 font-serif text-lg font-bold mb-2">Products Not Found</h3>
        <p className="text-gray-600 font-sans text-sm max-w-xs leading-relaxed">{message || "No latest arrivals found. Please check back later."}</p>
    </div>
);

// Animated grid skeleton utilizing pre-existing ProductCardSkeleton
const LatestArrivalsSkeletonGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 pb-8">
        {[0, 1, 2, 3, 4].map((idx) => (
            <ProductCardSkeleton key={idx} />
        ))}
    </div>
);

const LatestArrivalsByCategories = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLatestArrivals = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`${ApiURL}/getlatestarrivals`);
            if (response.data.status === 1) {
                setProducts(response.data.data || []);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching latest arrivals:", error);
            setError("We couldn't reach the server. Please verify your connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLatestArrivals();
    }, []);

    const renderedCategories = React.useMemo(() => {
        return products.map((categoryGroup, groupIdx) => (
            <div key={categoryGroup.category?.cate_id || groupIdx}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 pb-8">
                    {categoryGroup.products?.map((product) => {
                        const discountPercentage =
                            product?.original_price && product?.original_price > product?.price
                                ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                                : 0;

                        const productSlug = product.slug || createSlug(product.name) || product.p_id;

                        let imageUrl = product?.colors?.[0]?.images?.[0]?.image_url || '';
                        if (imageUrl && !imageUrl.startsWith('http')) {
                            imageUrl = `${ApiURL}${imageUrl}`;
                        }

                        return (
                            <div
                                onClick={() => navigate(`/product/${productSlug}`)}
                                key={product.p_id}
                                className="arrival-card-wrapper"
                                style={{ textDecoration: "none", color: "inherit" }}
                            >
                                <div className="arrival-card">
                                    <div className="card-image-wrapper">
                                        <span className="off-badge">{discountPercentage > 0 ? `${discountPercentage}% OFF` : ''}</span>
                                        <img
                                            src={imageUrl}
                                            alt={product.name}
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/placeholder.png"; 
                                            }}
                                        />
                                    </div>
                                    <div className="card-info pt-3">
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
                                            {categoryGroup.category?.cate_name || product?.colors?.[0]?.color_name || "Style"}
                                        </p>
                                        <div className="color-swatches">
                                            {product.colors?.slice(0, 4).map((color) => (
                                                <div
                                                    key={color.color_id || color.color_name}
                                                    className="swatch"
                                                    style={{ backgroundColor: color.color_code }}
                                                    title={color.color_name}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ));
    }, [products, navigate]);

    return (
        <section className="latest-arrivals-section">
            <div className="container">
                <div className="latest-arrivals-header">
                    <h2 className="title">Latest Arrivals By Categories</h2>
                    <p className="subtitle">
                        Explore our curated categories and discover fashion that fits your vibe.
                    </p>
                </div>

                <div className="space-y-12 px-4 sm:px-12">
                    {loading ? (
                        <LatestArrivalsSkeletonGrid />
                    ) : error ? (
                        <ErrorFallback message={error} onRetry={fetchLatestArrivals} />
                    ) : products.length === 0 ? (
                        <EmptyState />
                    ) : (
                        renderedCategories
                    )}
                </div>
            </div>
        </section>
    );
};

export default LatestArrivalsByCategories;

