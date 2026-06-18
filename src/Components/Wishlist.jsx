import { useState } from "react";
import { Loader2, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { getFullImageUrl } from "../Variable";
import wishlistempty from "../assets/wishlistempty.png";
import WishlistSkeleton from "./skeletons/WishlistSkeleton";
import ScrollReveal from "./Ui/ScrollReveal";

import { useWishlist, useRemoveFromWishlist } from "../hooks/useWishlist";
import { useAddToCart } from "../hooks/useCart";

import "../style/ProductCard.css";

const Wishlist = () => {
  const { data: wishlistItems = [], isLoading: loading } = useWishlist();
  const removeWishlistMutation = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();

  // Per-item action loading sets
  const [removingIds, setRemovingIds] = useState(new Set());
  const [movingIds, setMovingIds] = useState(new Set());

  const handleRemove = (w_id) => {
    if (removingIds.has(w_id)) return; // prevent duplicate
    setRemovingIds((prev) => new Set(prev).add(w_id));

    removeWishlistMutation.mutate(w_id, {
      onSettled: () => {
        setRemovingIds((prev) => {
          const n = new Set(prev);
          n.delete(w_id);
          return n;
        });
      },
    });
  };

  const handleMoveToCart = (item) => {
    const key = item.w_id;
    if (movingIds.has(key)) return; // prevent duplicate
    setMovingIds((prev) => new Set(prev).add(key));

    const product = {
      p_id: item.p_id,
      sc_id: item.sc_id || null,
      name: item.product_name,
      price: item.price,
      original_price: item.original_price,
    };
    const selectedColor = {
      pcolor_id: item.pcolor_id,
      productimages: [{ image_url: item.image_url }],
      color: { color_name: item.color_name },
    };
    const selectedSize = item.psize_id
      ? { psize_id: item.psize_id, size: { size_name: item.size_name } }
      : null;
    const quantity = 1;
    const availableStock = item.stock_qty !== undefined ? item.stock_qty : (item.available_stock || 99);

    addToCartMutation.mutate(
      {
        product,
        selectedColor,
        selectedSize,
        quantity,
        availableStock,
      },
      {
        onSuccess: () => {
          // Toast for addition is already handled by useAddToCart hook, now delete from wishlist
          removeWishlistMutation.mutate(item.w_id, {
            onSettled: () => {
              setMovingIds((prev) => {
                const n = new Set(prev);
                n.delete(key);
                return n;
              });
            },
          });
        },
        onError: () => {
          setMovingIds((prev) => {
            const n = new Set(prev);
            n.delete(key);
            return n;
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen px-4 md:px-10 py-12 font-poppins">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <WishlistSkeleton count={4} />
        ) : wishlistItems.length > 0 ? (
          <ScrollReveal animation="fade-up" duration={800}>
            <div className="flex items-baseline justify-between mb-8 border-b pb-4 border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">My Wishlist</h2>
              <span className="text-sm font-medium text-gray-500">
                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 pb-8">
              {wishlistItems.map((item) => {
                const isOutOfStock = item.stock_qty === 0;
                const discountPercentage = item.original_price && item.original_price > item.price
                  ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
                  : 0;

                return (
                  <div
                    key={item.w_id}
                    className="arrival-card group flex flex-col justify-between"
                  >
                    {/* Image and Header */}
                    <div>
                      <div className="card-image-wrapper relative group overflow-hidden">
                        {discountPercentage > 0 && (
                          <span className="off-badge">
                            {discountPercentage}% OFF
                          </span>
                        )}

                        {/* Wishlist Remove Heart Button */}
                        <button
                          onClick={() => handleRemove(item.w_id)}
                          disabled={removingIds.has(item.w_id)}
                          className="wishlist-heart-btn"
                          aria-label="Remove from wishlist"
                        >
                          {removingIds.has(item.w_id) ? (
                            <div className="bg-white/80 backdrop-blur-md rounded-full p-1 shadow-sm">
                              <Loader2 size={16} className="animate-spin text-red-500" />
                            </div>
                          ) : (
                            <Heart
                              size={20}
                              className="wishlist-heart wishlist-active"
                            />
                          )}
                        </button>

                        <img
                          src={getFullImageUrl(item.image_url, "Products")}
                          alt={item.product_name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Stock status overlay */}
                        {item.stock_qty <= 5 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                            {item.stock_qty <= 0 ? (
                              <span className="px-4 py-2 bg-red-600 text-white text-[11px] font-bold rounded-full uppercase tracking-widest shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                Out of Stock
                              </span>
                            ) : (
                              <span className="px-4 py-2 bg-orange-500 text-white text-[11px] font-bold rounded-full uppercase tracking-widest shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                Low Stock ({item.stock_qty})
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Info */}
                      <div className="card-info pt-3">
                        <div className="info-header">
                          <h3 className="product-name">{item.product_name}</h3>
                          <div className="product-price">
                            {item.original_price > item.price && (
                              <span className="original-price">₹{item.original_price}</span>
                            )}
                            <span>₹{item.price}</span>
                          </div>
                        </div>

                        {/* Color swatch and Size tag matching ProductCard aesthetics */}
                        <div className="flex items-center gap-2 mt-2">
                          <div
                            className="swatch active"
                            title={item.color_name}
                            style={{
                              backgroundColor: item.color_code || "#ccc",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Move to Cart action */}
                    <div className="mt-4 px-1 pb-1">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        disabled={isOutOfStock || movingIds.has(item.w_id)}
                        className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 border ${isOutOfStock
                          ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                          : movingIds.has(item.w_id)
                            ? "bg-[#02382A]/5 border-[#02382A]/10 text-[#02382A] cursor-wait"
                            : "bg-transparent border-[#02382A] text-[#02382A] hover:bg-[#02382A] hover:text-white hover:shadow-sm cursor-pointer"
                          }`}
                      >
                        {movingIds.has(item.w_id) && <Loader2 size={13} className="animate-spin" />}
                        {isOutOfStock ? "Unavailable" : "Move To Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal animation="fade-up" duration={800} className="h-screen flex items-center justify-center p-4 w-full">
            <div className="text-center">
              <div className="w-40 h-24 md:w-[300px] md:h-[200px] mx-auto">
                <img
                  src={wishlistempty}
                  alt="Empty Wishlist"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="xl:text-[34px] text-[24px] text-black font-bold mt-5">
                Your Wishlist Is Empty.
              </h1>
              <p className="text-[#807D7E] text-[14px] text-center max-w-md mx-auto mt-2">
                You don’t have any products in the wishlist yet. You will find a
                lot of interesting products on our Shop page.
              </p>
              <div className="text-center bg-[#02382A] text-white px-4 py-1.5 rounded-[8px] w-fit mt-5 mx-auto">
                <Link to="/">Continue Shopping</Link>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
