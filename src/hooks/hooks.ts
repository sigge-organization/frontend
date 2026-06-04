import { useQuery } from "@tanstack/react-query";
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
