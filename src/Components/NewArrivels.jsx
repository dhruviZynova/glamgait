// NewArrivels.jsx
import React, { useState, useEffect, useCallback } from "react";
import ProductCard from "./ProductCard";
import axiosInstance from "../Axios/axios";
import { ApiURL, userInfo } from "../Variable";
import { getGuestId } from "../utils/guest";

const NewArrivels = () => {
  const [activeTab, setActiveTab] = useState("newArrivals");
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSeller, setBestSeller] = useState([]);
  const [wishlistMap, setWishlistMap] = useState({});
  const [reviewsSummary, setReviewsSummary] = useState({}); // ← Add this state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [newArrivalsRes, bestSellerRes] = await Promise.all([
          axiosInstance.get(`${ApiURL}/getproducts`, { limit: 8 }),
          axiosInstance.get(`${ApiURL}/getproducts`, { limit: 8 }),
        ]);
        setNewArrivals(newArrivalsRes.data.data || []);
        setBestSeller(bestSellerRes.data.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const currentProducts =
    activeTab === "newArrivals" ? newArrivals : bestSeller;

  useEffect(() => {
    const fetchWishlist = async () => {
      const user = userInfo();
      const identifier = user?.u_id || getGuestId();

      try {
        const query = user?.u_id
          ? `u_id=${identifier}`
          : `guest_id=${identifier}`;

        const res = await axiosInstance.get(`/getwishlist?${query}`);

        if (res.data.status === 1) {
          const items = res.data.data || [];

          // Create fast lookup map: "p_id-pcolor_id" → true
          const map = {};
          items.forEach((item) => {
            const key = `${item.p_id}-${item.pcolor_id}`;
            map[key] = {
              wished: true,
              w_id: item.w_id, // optional: for remove
            };
          });

          setWishlistMap(map);
        }
      } catch (err) {
        console.error("Wishlist fetch failed", err);
      }
    };

    fetchWishlist();
  }, []);

  const refreshWishlist = async () => {
    const user = userInfo();
    const identifier = user?.u_id || getGuestId();
    try {
      const query = user?.u_id
        ? `u_id=${identifier}`
        : `guest_id=${identifier}`;

      const res = await axiosInstance.get(`/getwishlist?${query}`);

      if (res.data.status === 1) {
        const items = res.data.data || [];
        const map = {};
        items.forEach((item) => {
          const key = `${item.p_id}-${item.pcolor_id}`;
          map[key] = {
            wished: true,
            w_id: item.w_id,
          };
        });
        setWishlistMap(map); // ← Yeh update karega sab ProductCards ko
      }
    } catch (err) {
      console.error("Wishlist refresh failed", err);
    }
  };

  const fetchAllReviewsSummary = useCallback(async () => {
    if (currentProducts.length === 0) return;

    const productIds = currentProducts.map(p => p.p_id);

    try {
      const res = await axiosInstance.post("/getreviewsformultiple", {
        p_ids: productIds
      });

      if (res.data.status === 1) {
        const data = res.data.data || {};
        const summary = {};

        Object.keys(data).forEach(p_id => {
          const item = data[p_id];
          summary[p_id] = {
            rating: item.average_rating,
            count: item.total_reviews
          };
        });

        setReviewsSummary(summary);
      }
    } catch (err) {
      console.error("Reviews fetch failed", err);
    }
  }, [currentProducts]);

  useEffect(() => {
    fetchAllReviewsSummary();
  }, [fetchAllReviewsSummary]);

  return (
    <section className="relative sm:pt-0 md:pt-16 md:px-4 bg-[#F3F0ED] overflow-hidden">
      {/* Title and Description */}
      <div className="text-center max-w-4xl mx-auto mb-8 relative z-20">
        <h2 className="text-[30px] md:text-[34px] xl:text-[34px] font-bold text-gray-800 mb-2">
          {activeTab === "newArrivals" ? "New Arrivals" : "Best Sellers"}
        </h2>
        <p className="text-[12px] md:text-[16px] text-gray-600">
          {activeTab === "newArrivals"
            ? "Step into the season with our latest collection of trendsetting styles, bold colors, and effortless fits."
            : "Discover the most-loved pieces that everyone’s raving about. Timeless styles, trusted by thousands."}
        </p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-center space-x-4 md:mb-12 mb-6 relative z-20">
        <button
          onClick={() => setActiveTab("bestSeller")}
          className={`px-6 py-2 rounded-[10px] text-gray-800 text-[14px] lg:text-[16px]  transition ${activeTab === "bestSeller"
            ? "bg-[#02382A] text-white"
            : "bg-white shadow"
            }`}
        >
          BEST SELLER
        </button>
        <button
          onClick={() => setActiveTab("newArrivals")}
          className={`px-6 py-2 rounded-[10px] text-gray-800 text-[14px] lg:text-[16px] transition ${activeTab === "newArrivals"
            ? "bg-[#02382A] text-white"
            : "bg-white shadow"
            }`}
        >
          NEW ARRIVALS
        </button>
      </div>
      <div className="max-w-7xl mx-auto relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 pb-8 px-4">
          {currentProducts?.map((product) => (
            <div key={product.p_id}>
              <ProductCard
                product={product}
                wishlistMap={wishlistMap}
                onWishlistChange={refreshWishlist}
                reviewsSummary={reviewsSummary}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivels;
