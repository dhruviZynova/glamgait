import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../Axios/axios";
import { userInfo } from "../Variable";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const userRaw = userInfo();
  const user = React.useMemo(() => userRaw, [JSON.stringify(userRaw)]);
  const u_id = user?.u_id;

  const fetchCart = useCallback(async () => {
    try {
      if (!u_id) {
        const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
        setCartItems(localCart);
        setCartCount(localCart.length);
        return;
      }
      const res = await axiosInstance.get(`/getcart?u_id=${u_id}`, { skipLoader: true });
      if (res?.data?.status === 1) {
        const items = res.data.data || [];
        setCartItems(items);
        setCartCount(items.length);

        // Sync to localStorage for persistence across logout
        const mappedItems = items.map(item => ({
          p_id: item.p_id,
          pcolor_id: item.pcolor_id,
          psize_id: item.psize_id || null,
          quantity: Number(item.quantity || 1),
          product_name: item.product_name || item.product?.name,
          price: Number(item.price),
          original_price: Number(item.original_price || item.price),
          image_url: item.image_url || (item.color?.productimages?.[0]?.image_url),
          color_name: item.color_name || item.color?.color_name,
          size_name: item.size_name || item.size?.size_name || null,
          available_stock: item.available_stock || 10
        }));
        localStorage.setItem("localCart", JSON.stringify(mappedItems));
      } else {
        setCartItems([]);
        setCartCount(0);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  }, [u_id]);

  const fetchWishlist = useCallback(async () => {
    try {
      if (!u_id) {
        const localWishlist = JSON.parse(localStorage.getItem("localWishlist") || "[]");
        setWishlistItems(localWishlist);
        setWishlistCount(localWishlist.length);
        return;
      }
      const res = await axiosInstance.get(`/getwishlist?u_id=${u_id}`, { skipLoader: true });
      if (res?.data?.status === 1) {
        const items = res.data.data || [];
        setWishlistItems(items);
        setWishlistCount(items.length);

        // Sync to localStorage for persistence across logout
        const mappedItems = items.map(item => ({
          p_id: item.p_id,
          pcolor_id: item.pcolor_id,
          psize_id: item.psize_id || null,
          product_name: item.product_name || item.product?.name,
          price: Number(item.price),
          original_price: Number(item.original_price || item.price),
          image_url: item.image_url || (item.color?.productimages?.[0]?.image_url),
          color_name: item.color_name || item.color?.color_name,
          size_name: item.size_name || item.size?.size_name || null,
        }));
        localStorage.setItem("localWishlist", JSON.stringify(mappedItems));
      } else {
        setWishlistItems([]);
        setWishlistCount(0);
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  }, [u_id]);

  const refreshAll = useCallback(() => {
    fetchCart();
    fetchWishlist();
  }, [fetchCart, fetchWishlist]);

  useEffect(() => {
    refreshAll();

    // Listen for custom events (backward compatibility)
    window.addEventListener("cartUpdated", fetchCart);
    window.addEventListener("wishlistUpdated", fetchWishlist);

    return () => {
      window.removeEventListener("cartUpdated", fetchCart);
      window.removeEventListener("wishlistUpdated", fetchWishlist);
    };
  }, [refreshAll, fetchCart, fetchWishlist]);

  const value = React.useMemo(() => ({
    cartCount,
    wishlistCount,
    cartItems,
    wishlistItems,
    refreshCart: fetchCart,
    refreshWishlist: fetchWishlist,
    refreshAll,
  }), [cartCount, wishlistCount, cartItems, wishlistItems, fetchCart, fetchWishlist, refreshAll]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
