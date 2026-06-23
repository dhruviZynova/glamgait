import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, signup } from "../api/user";
import { useUser } from "../Context/UserContext";
import { addToCart, getCart } from "../api/cart";
import { addToWishlist, getWishlist } from "../api/wishlist";
import toast from "react-hot-toast";

export function useLogin() {
  const queryClient = useQueryClient();
  const { refreshUser } = useUser();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await login({ email, password });
      if (res.status !== 1) {
        throw new Error(res.description || "Invalid email or password");
      }
      
      const userData = res.data;
      sessionStorage.setItem("GlamGait", JSON.stringify(userData));
      refreshUser();

      // Sync guest cart & wishlist to database
      const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
      const localWishlist = JSON.parse(localStorage.getItem("localWishlist") || "[]");

      if (localCart.length > 0) {
        try {
          const dbCart = await getCart({ u_id: userData.u_id });
          const dbCartItems = dbCart.status === 1 ? dbCart.data || [] : [];
          
          const itemsToSync = localCart.filter((localItem) => {
            const exists = dbCartItems.some(
              (dbItem) =>
                dbItem.p_id === localItem.p_id &&
                dbItem.pcolor_id === localItem.pcolor_id &&
                (dbItem.psize_id || null) === (localItem.psize_id || null)
            );
            return !exists;
          });

          if (itemsToSync.length > 0) {
            await Promise.all(
              itemsToSync.map((item) =>
                addToCart({
                  p_id: item.p_id,
                  pcolor_id: item.pcolor_id,
                  psize_id: item.psize_id || null,
                  quantity: item.quantity || 1,
                  u_id: userData.u_id,
                  guest_id: null,
                })
              )
            );
          }
          localStorage.removeItem("localCart");
          window.dispatchEvent(new Event("cartUpdated"));
        } catch (err) {
          console.error("Local cart sync failed:", err);
        }
      } else {
        localStorage.removeItem("localCart");
      }

      if (localWishlist.length > 0) {
        try {
          const dbWish = await getWishlist({ u_id: userData.u_id });
          const dbWishItems = dbWish.status === 1 ? dbWish.data || [] : [];

          const itemsToSync = localWishlist.filter((localItem) => {
            const exists = dbWishItems.some(
              (dbItem) =>
                dbItem.p_id === localItem.p_id &&
                dbItem.pcolor_id === localItem.pcolor_id
            );
            return !exists;
          });

          if (itemsToSync.length > 0) {
            await Promise.all(
              itemsToSync.map((item) =>
                addToWishlist({
                  p_id: item.p_id,
                  sc_id: item.sc_id || null,
                  pcolor_id: item.pcolor_id,
                  psize_id: item.psize_id || null,
                  u_id: userData.u_id,
                  guest_id: null,
                })
              )
            );
          }
          localStorage.removeItem("localWishlist");
          window.dispatchEvent(new Event("wishlistUpdated"));
        } catch (err) {
          console.error("Local wishlist sync failed:", err);
        }
      } else {
        localStorage.removeItem("localWishlist");
      }

      return res;
    },
    onSuccess: (data) => {
      toast.success(data.description || "Logged in successfully!");
      // Reset and invalidate all queries
      queryClient.clear();
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      const errMsg = error.response?.data?.description || error.response?.data?.message || error.message || "Invalid email or password";
      toast.error(errMsg);
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: async (formData) => {
      const res = await signup(formData);
      if (res.status !== 1) {
        throw new Error(res.message || "Registration failed");
      }
      return res;
    },
  });
}

