import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWishlist, addToWishlist, removeFromWishlist } from "../api/wishlist";
import { useUser } from "../Context/UserContext";
import { getGuestId } from "../utils/guest";
import toast from "react-hot-toast";

export function useWishlist() {
  const { user } = useUser();
  const isLoggedIn = !!user?.u_id;
  const guestId = getGuestId();

  return useQuery({
    queryKey: ["wishlist", user?.u_id || "guest"],
    queryFn: async () => {
      if (isLoggedIn) {
        const res = await getWishlist({ u_id: user.u_id });
        if (res.status === 1) {
          return res.data || [];
        }
        return [];
      } else {
        // Guest mode fallback
        const localWishlist = JSON.parse(localStorage.getItem("localWishlist") || "[]");
        return localWishlist.map((item, index) => ({
          ...item,
          w_id: `local-${index}`,
        }));
      }
    },
    staleTime: 0,
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const isLoggedIn = !!user?.u_id;

  return useMutation({
    mutationFn: async ({ product, selectedColor, selectedSize, wishlistMap, availableStock }) => {
      const wishlistKey = `${product.p_id}-${selectedColor.pcolor_id}`;
      const wishlistData = wishlistMap[wishlistKey];
      const isWished = !!wishlistData;
      const wishlistId = wishlistData?.w_id || null;

      if (isLoggedIn) {
        if (isWished && wishlistId) {
          const res = await removeFromWishlist(wishlistId);
          if (res.status !== 1) throw new Error(res.description || "Failed to remove from wishlist");
          return { action: "removed", description: "Removed from wishlist" };
        } else {
          const payload = {
            u_id: user.u_id,
            guest_id: null,
            p_id: product.p_id,
            sc_id: product.sc_id || null,
            pcolor_id: selectedColor.pcolor_id,
            psize_id: selectedSize?.psize_id || null,
          };
          const res = await addToWishlist(payload);
          if (res.status !== 1) throw new Error(res.description || "Failed to add to wishlist");
          return { action: "added", description: "Added to wishlist" };
        }
      } else {
        // Guest mode update
        let localWishlist = JSON.parse(localStorage.getItem("localWishlist") || "[]");
        const localPayload = {
          p_id: product.p_id,
          sc_id: product.sc_id || null,
          pcolor_id: selectedColor.pcolor_id,
          psize_id: selectedSize?.psize_id || null,
          product_name: product.name,
          price: product.price,
          original_price: product.original_price,
          image_url: selectedColor.productimages?.[0]?.image_url || "",
          color_name: selectedColor.color?.color_name || "",
          size_name: selectedSize?.size?.size_name || null,
          stock_qty: availableStock,
        };

        const existingIndex = localWishlist.findIndex(
          (item) => item.p_id === product.p_id && item.pcolor_id === localPayload.pcolor_id
        );

        if (isWished || existingIndex !== -1) {
          if (existingIndex !== -1) localWishlist.splice(existingIndex, 1);
          localStorage.setItem("localWishlist", JSON.stringify(localWishlist));
          window.dispatchEvent(new Event("wishlistUpdated"));
          return { action: "removed", description: "Removed from wishlist" };
        } else {
          localWishlist.push(localPayload);
          localStorage.setItem("localWishlist", JSON.stringify(localWishlist));
          window.dispatchEvent(new Event("wishlistUpdated"));
          return { action: "added", description: "Added to wishlist" };
        }
      }
    },
    onSuccess: (data) => {
      toast.success(data.description);
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (err) => {
      toast.error(err.message || "Wishlist action failed");
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const isLoggedIn = !!user?.u_id;

  return useMutation({
    mutationFn: async (w_id) => {
      if (isLoggedIn) {
        const res = await removeFromWishlist(w_id);
        if (res.status !== 1) throw new Error(res.description || "Failed to remove from wishlist");
        return { action: "removed", description: "Removed from wishlist" };
      } else {
        let localWishlist = JSON.parse(localStorage.getItem("localWishlist") || "[]");
        const index = parseInt(w_id.split("-")[1]);
        if (!isNaN(index) && localWishlist[index] !== undefined) {
          localWishlist.splice(index, 1);
          localStorage.setItem("localWishlist", JSON.stringify(localWishlist));
          window.dispatchEvent(new Event("wishlistUpdated"));
          return { action: "removed", description: "Removed from wishlist" };
        }
        throw new Error("Item not found in guest wishlist");
      }
    },
    onSuccess: (data) => {
      toast.success(data.description);
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to remove from wishlist");
    },
  });
}

