// src/pages/SearchResults.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "../Components/ProductCard";
import axiosInstance from "../Axios/axios";
import ScrollToTop from "../Components/ScrollToTop";
import { userInfo } from "../Variable";
import { getGuestId } from "../utils/guest";

const SearchResults = () => {
  ScrollToTop();

  const [searchParams] = useSearchParams();
  const query = searchParams.get("query")?.trim() || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [wishlistMap, setWishlistMap] = useState({});
  const [reviewsSummary, setReviewsSummary] = useState({});


  useEffect(() => {
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/getallproducts", {
          params: {
            search: query,
            page: currentPage,
            perPage: 20, // or 12, 24 as you prefer
          },
        });

        if (response.data.status === 1) {
          const data = response.data.data;
          setProducts(data.productData || []);
          setTotalResults(data.totalCount || 0);
          setTotalPages(data.totalPages || 1);
        } else {
          setProducts([]);
          setTotalResults(0);
        }
      } catch (error) {
        console.error("Search error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, currentPage]);

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

  useEffect(() => {
    const fetchAllReviewsSummary = async () => {
      if (products.length === 0) return;

      const productIds = products.map(p => p.p_id);

      // Call your existing API for each product — but in parallel
      try {
        const reviewPromises = productIds.map(p_id =>
          axiosInstance.post("/getuserreviews", { p_id })
        );

        const responses = await Promise.all(reviewPromises);

        const summary = {};
        responses.forEach((res, index) => {
          const p_id = productIds[index];
          if (res.data.status === 1 && res.data.data.length > 0) {
            const reviews = res.data.data;
            const avg = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
            summary[p_id] = {
              rating: parseFloat(avg),
              count: reviews.length
            };
          } else {
            summary[p_id] = { rating: null, count: 0 };
          }
        });

        setReviewsSummary(summary);
      } catch (err) {
        console.error("Bulk reviews fetch failed", err);
      }
    };

    fetchAllReviewsSummary();
  }, [products]);

  if (!query) {
    return (
      <div className="min-h-screen bg-[#f3f0ed] flex items-center justify-center">
        <p className="text-xl text-gray-600">Please enter a search term</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f0ed] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Search Results
          </h1>
          <p className="text-xs text-black bg-white inline-block px-8 py-3 rounded-full shadow">
            {query}
          </p>
          <p className="mt-4 text-gray-600">
            {loading
              ? "Searching..."
              : `${totalResults} product${totalResults !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 animate-pulse rounded-lg h-96"
              ></div>
            ))}
          </div>
        )}

        {/* Products */}
        {!loading && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.p_id}
                  product={product}
                  wishlistMap={wishlistMap}
                  onWishlistChange={refreshWishlist}
                  reviewsSummary={reviewsSummary}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg ${currentPage === i + 1
                        ? "bg-black text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">😔</p>
            <p className="text-2xl text-gray-700 mb-4">
              No products found for "<strong>{query}</strong>"
            </p>
            <Link
              to="/shop"
              className="inline-block bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition text-lg"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
