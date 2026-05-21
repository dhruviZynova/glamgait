import ProductCard from "./ProductCard"; // Make sure this exists
import axiosInstance from "../Axios/axios";
import { useEffect, useState, useCallback } from "react";
import { userInfo } from "../Variable";
import { getGuestId } from "../utils/guest";

const ReletedProduct = ({ cate_name, currentProductId, cate_id }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [wishlistMap, setWishlistMap] = useState({});
  const [reviewsSummary, setReviewsSummary] = useState({});

  const fetchProducts = useCallback(async () => {
    if (!cate_id) return;
    try {
      // Use /getallproducts with cate_id filter — same proven endpoint as AllProducts.jsx
      const response = await axiosInstance.get("/getallproducts", {
        params: {
          cate_id,
          page: 1,
          limit: 20,
          sort_by: "name_asc",
        },
      });

      // /getallproducts uses productData (not products)
      const allProducts = response?.data?.data?.productData || [];

      // Filter out current product only if there are other products available
      const othersOnly = allProducts.filter(
        (item) => String(item.p_id) !== String(currentProductId)
      );

      // If filtering leaves nothing, show all (fallback); otherwise show up to 5 others
      const filteredProducts = (othersOnly.length > 0 ? othersOnly : allProducts).slice(0, 5);

      setRelatedProducts(filteredProducts);


      // Fetch reviews immediately after getting products
      if (filteredProducts.length > 0) {
        const productIds = filteredProducts.map((p) => p.p_id);

        try {
          const res = await axiosInstance.post("/getreviewsformultiple", {
            p_ids: productIds,
          });

          if (res.data.status === 1) {
            const data = res.data.data || {};
            const summary = {};

            Object.keys(data).forEach((p_id) => {
              const item = data[p_id];
              summary[p_id] = {
                rating: item.average_rating || 0,
                count: item.total_reviews || 0,
              };
            });

            setReviewsSummary(summary);
          }
        } catch (err) {
          console.error("Reviews fetch failed", err);
        }
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  }, [cate_id, currentProductId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  return (
    <>
      {relatedProducts?.length > 0 && (
        <section className="px-4 py-6 md:py-16 md:px-10 lg:px-20">
          {/* Section Title */}
          <div className="text-start mb-8">
            <h2 className="text-[30px] md:text-[34px] xl:text-[34px] font-700 font-[oxygen] text-[#3D3D3D] mb-2">
              Similar Products
            </h2>
          </div>

          {/* Product Grid */}
          <div className="">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 pb-8">
              {relatedProducts?.map((product) => (
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
      )}
    </>
  );
};

export default ReletedProduct;
