import React, { useEffect, useState, useCallback, useRef } from "react";
import { X, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { userInfo, ApiURL } from "../Variable";
import axiosInstance from "../Axios/axios";
import toast from "react-hot-toast";
import wishlistempty from "../assets/wishlistempty.png";
import WishlistSkeleton from "./skeletons/WishlistSkeleton";

import { useWishlist, useRemoveFromWishlist } from "../hooks/useWishlist";
import { useAddToCart } from "../hooks/useCart";

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
    <div className="bg-[#f3f0ed] min-h-screen px-2 md:px-10 py-10">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <WishlistSkeleton count={3} />
        ) : wishlistItems.length > 0 ? (
          <div>
            <h2 className="text-2xl font-semibold mb-6">My Wishlist</h2>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                {wishlistItems.map((item) => (
                  <div
                    key={item.w_id}
                    className="bg-white rounded-2xl flex flex-col md:flex-row gap-4 p-4 mb-4 shadow-sm relative"
                  >
                    <button
                      onClick={() => handleRemove(item.w_id)}
                      disabled={removingIds.has(item.w_id)}
                      className="absolute top-3 right-3 text-gray-600 hover:text-black cursor-pointer disabled:opacity-50"
                    >
                      {removingIds.has(item.w_id)
                        ? <Loader2 size={16} className="animate-spin" />
                        : <X size={18} />}
                    </button>

                    <div className="flex items-center justify-center">
                      <img
                        src={`${ApiURL}/assets/Products/${item.image_url}`}
                        alt={item.product_name}
                        className="w-40 h-60 md:w-28 md:h-40 object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex flex-col flex-1 gap-2 justify-center">
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.product_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ₹{item.price.toFixed(2)}{" "}
                          {item.original_price > item.price && (
                            <span className="line-through text-gray-400 text-sm">
                              ₹{item.original_price.toFixed(2)}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          Color: {item.color_name}
                          {item.size_name && ` • Size: ${item.size_name}`}
                        </p>
                        {item.stock_qty === 0 ? (
                          <p className="text-red-600 text-sm font-medium mt-1">
                            Out of Stock
                          </p>
                        ) : item.stock_qty <= 5 ? (
                          <p className="text-orange-600 text-sm font-medium mt-1">
                            Only {item.stock_qty} left
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center md:ml-4">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        disabled={item.stock_qty === 0 || movingIds.has(item.w_id)}
                        className={`border px-3 py-2 text-sm rounded-md transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${item.stock_qty > 0 && !movingIds.has(item.w_id)
                          ? "hover:bg-[#02382A] hover:text-white"
                          : "opacity-60 cursor-not-allowed"
                          }`}
                      >
                        {movingIds.has(item.w_id) && <Loader2 size={14} className="animate-spin" />}
                        {item.stock_qty > 0 ? "MOVE TO CART" : "UNAVAILABLE"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#F3F0ED] h-screen flex items-center justify-center p-4 w-full">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
