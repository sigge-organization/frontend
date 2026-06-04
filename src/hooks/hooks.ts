import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  course?: string;
  created_at: string;
}

export function useUserProfile() {
  return useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await api.get("/api/auth/me");
      return response.data;
    },
  });
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
  course?: string;
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await api.put("/api/auth/profile", data);
      return response.data;
    },
  });
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const response = await api.put("/api/auth/change-password", data);
      return response.data;
    },
  });
}

export function useVerifyPassword() {
  return useMutation({
    mutationFn: async (currentPassword: string) => {
      const response = await api.post("/api/auth/verify-password", { currentPassword });
      return response.data;
    },
  });
}
