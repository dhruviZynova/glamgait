import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile, getAddresses, deleteAddress } from "../api/user";
import { useUser } from "../Context/UserContext";
import { getGuestId } from "../utils/guest";
import toast from "react-hot-toast";

export function useProfile() {
  const { user } = useUser();
  const isLoggedIn = !!user?.u_id;

  return useQuery({
    queryKey: ["profile", user?.u_id || "guest"],
    queryFn: async () => {
      if (!isLoggedIn) return null;
      const res = await getUserProfile(user.u_id);
      if (res.status === 1) {
        return res.data;
      }
      return null;
    },
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (payload) => {
      if (!user?.u_id) throw new Error("Not logged in");
      const res = await updateUserProfile(user.u_id, payload);
      if (res.status !== 1) {
        throw new Error(res.description || "Failed to update profile");
      }
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.description || "Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile", user?.u_id] });
    },
  });
}

export function useAddresses() {
  const { user } = useUser();
  const isLoggedIn = !!user?.u_id;
  const guestId = getGuestId();

  return useQuery({
    queryKey: ["addresses", user?.u_id || "guest"],
    queryFn: async () => {
      const payload = isLoggedIn ? { u_id: user.u_id } : { guest_id: guestId };
      const res = await getAddresses(payload);
      if (res.status === 1) {
        return res.data || [];
      }
      return [];
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (add_id) => {
      const res = await deleteAddress(add_id);
      if (res.status !== 1) {
        throw new Error(res.description || "Failed to delete address");
      }
      return res;
    },
    onSuccess: () => {
      toast.success("Address deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["addresses", user?.u_id || "guest"] });
    },
  });
}
