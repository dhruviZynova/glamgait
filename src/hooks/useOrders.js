import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, createOrder, cancelOrder, returnOrder } from "../api/orders";
import { useUser } from "../Context/UserContext";
import { getGuestId } from "../utils/guest";
import toast from "react-hot-toast";

export function useOrders() {
  const { user } = useUser();
  const isLoggedIn = !!user?.u_id;
  const guestId = getGuestId();

  return useQuery({
    queryKey: ["orders", user?.u_id || "guest"],
    queryFn: async () => {
      const params = isLoggedIn ? { u_id: user.u_id } : { guest_id: guestId };
      const res = await getOrders(params);
      if (res.status === 1) {
        return res.data || [];
      }
      return [];
    },
    staleTime: 0,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData) => {
      const res = await createOrder(orderData);
      if (res.status !== 1) {
        throw new Error(res.message || "Failed to create order");
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await cancelOrder(payload);
      if (res.status !== 1) {
        throw new Error(res.message || "Failed to cancel order");
      }
      return res;
    },
    onSuccess: () => {
      toast.success("Order cancelled successfully!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to cancel order");
    },
  });
}

export function useReturnOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await returnOrder(payload);
      if (res.status !== 1) {
        throw new Error(res.message || "Failed to submit return request");
      }
      return res;
    },
    onSuccess: () => {
      toast.success("Return request submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit return request");
    },
  });
}
