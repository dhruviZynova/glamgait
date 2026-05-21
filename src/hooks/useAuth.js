import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, signup } from "../api/user";
import { useUser } from "../Context/UserContext";
import { addToCart } from "../api/cart";
import { addToWishlist } from "../api/wishlist";
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
          await Promise.all(
            localCart.map((item) =>
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
        } catch (err) {
          console.error("Local cart sync failed:", err);
        }
      }

      if (localWishlist.length > 0) {
        try {
          await Promise.all(
            localWishlist.map((item) =>
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
        } catch (err) {
          console.error("Local wishlist sync failed:", err);
        }
      }

      return res;
    },
    onSuccess: (data) => {
      toast.success(data.description || "Logged in successfully!");
      // Reset and invalidate all queries
      queryClient.clear();
      queryClient.invalidateQueries();
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

export function useLogout() {
  const queryClient = useQueryClient();
  const { logout } = useUser();

  return () => {
    logout();
    queryClient.clear();
    toast.success("Logged out successfully");
  };
}
