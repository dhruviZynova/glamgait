import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, addToCart, updateCartQty, removeFromCart } from "../api/cart";
import { useUser } from "../Context/UserContext";
import toast from "react-hot-toast";

export function useCart() {
  const { user } = useUser();
  const isLoggedIn = !!user?.u_id;

  return useQuery({
    queryKey: ["cart", user?.u_id || "guest"],
    queryFn: async () => {
      if (isLoggedIn) {
        const res = await getCart({ u_id: user.u_id });
        if (res.status === 1) {
          return res.data || [];
        }
        return [];
      } else {
        const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
        return localCart.map((item, index) => ({
          ...item,
          cart_id: `local-${index}`,
        }));
      }
    },
    staleTime: 0, // Cart data changes frequently, keep fresh
    refetchOnWindowFocus: true,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const isLoggedIn = !!user?.u_id;

  return useMutation({
    mutationFn: async ({ product, selectedColor, selectedSize, quantity, availableStock }) => {
      if (isLoggedIn) {
        const payload = {
          u_id: user.u_id,
          guest_id: null,
          p_id: product.p_id,
          pcolor_id: selectedColor.pcolor_id,
          psize_id: selectedSize?.psize_id || null,
          quantity,
        };
        const res = await addToCart(payload);
        if (res.status !== 1) {
          throw new Error(res.description || "Failed to add to cart");
        }
        return res;
      } else {
        const cartItems = JSON.parse(localStorage.getItem("localCart") || "[]");
        const existingItemIndex = cartItems.findIndex(
          (item) =>
            item.p_id === product.p_id &&
            item.pcolor_id === selectedColor.pcolor_id &&
            item.psize_id === (selectedSize?.psize_id || null)
        );

        if (existingItemIndex !== -1) {
          cartItems[existingItemIndex].quantity += quantity;
        } else {
          cartItems.push({
            p_id: product.p_id,
            pcolor_id: selectedColor.pcolor_id,
            psize_id: selectedSize?.psize_id || null,
            quantity,
            product_name: product.name,
            price: product.price,
            original_price: product.original_price,
            image_url: selectedColor.productimages?.[0]?.image_url || "",
            color_name: selectedColor.color?.color_name || "",
            size_name: selectedSize?.size?.size_name || null,
            available_stock: availableStock,
          });
        }
        localStorage.setItem("localCart", JSON.stringify(cartItems));
        window.dispatchEvent(new Event("cartUpdated"));
        return { status: 1, description: "Added to cart!" };
      }
    },
    onSuccess: (data) => {
      toast.success(data.description || "Added to cart!");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add to cart");
    },
  });
}

export function useUpdateCartQty() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const isLoggedIn = !!user?.u_id;

  return useMutation({
    mutationFn: async ({ cart_id, quantity }) => {
      if (isLoggedIn) {
        const res = await updateCartQty({ cart_id, quantity });
        if (res.status !== 1) {
          throw new Error(res.description || "Failed to update quantity");
        }
        return res;
      } else {
        const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
        const index = parseInt(cart_id.split("-")[1]);
        if (localCart[index]) {
          localCart[index].quantity = quantity;
          localStorage.setItem("localCart", JSON.stringify(localCart));
          window.dispatchEvent(new Event("cartUpdated"));
          return { status: 1 };
        }
        throw new Error("Item not found in local cart");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update quantity");
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const isLoggedIn = !!user?.u_id;

  return useMutation({
    mutationFn: async (cart_id) => {
      if (isLoggedIn) {
        const res = await removeFromCart(cart_id);
        if (res.status !== 1) {
          throw new Error(res.description || "Failed to remove item");
        }
        return res;
      } else {
        const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
        const index = parseInt(cart_id.split("-")[1]);
        localCart.splice(index, 1);
        localStorage.setItem("localCart", JSON.stringify(localCart));
        window.dispatchEvent(new Event("cartUpdated"));
        return { status: 1 };
      }
    },
    onSuccess: () => {
      toast.success("Removed from cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to remove item");
    },
  });
}
