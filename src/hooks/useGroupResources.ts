import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

// -- TYPES --
export interface GroupEvent {
  id: string;
  studentGroupId: string;
  title: string;
  date_time_event: string;
  local_or_link_event: string;
}

export interface GroupPost {
  id: string;
  studentGroupId: string;
  content: string;
  post_date: string;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface GroupMaterial {
  id: string;
  studentGroupId: string;
  title: string;
  external_url: string;
  created_at: string;
  uploadedBy: {
    id: string;
    name: string | null;
    email: string;
  };
}

// -- EVENTS HOOKS --
export function useGroupEvents(groupId: string) {
  return useQuery<GroupEvent[]>({
    queryKey: ["groupEvents", groupId],
    queryFn: async () => {
      const response = await api.get(`/student-groups/${groupId}/events`);
      return response.data;
    },
    enabled: !!groupId,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ groupId, data }: { groupId: string; data: Omit<GroupEvent, "id" | "studentGroupId"> }) => {
      const response = await api.post(`/student-groups/${groupId}/events`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groupEvents", variables.groupId] });
    },
  });
}

// -- POSTS HOOKS --
export function useGroupPosts(groupId: string) {
  return useQuery<GroupPost[]>({
    queryKey: ["groupPosts", groupId],
    queryFn: async () => {
      const response = await api.get(`/student-groups/${groupId}/posts`);
      return response.data;
    },
    enabled: !!groupId,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ groupId, content }: { groupId: string; content: string }) => {
      const response = await api.post(`/student-groups/${groupId}/posts`, { content });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groupPosts", variables.groupId] });
    },
  });
}

// -- MATERIALS HOOKS --
export function useGroupMaterials(groupId: string) {
  return useQuery<GroupMaterial[]>({
    queryKey: ["groupMaterials", groupId],
    queryFn: async () => {
      const response = await api.get(`/student-groups/${groupId}/materials`);
      return response.data;
    },
    enabled: !!groupId,
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ groupId, title, external_url }: { groupId: string; title: string; external_url: string }) => {
      const response = await api.post(`/student-groups/${groupId}/materials`, { title, external_url });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groupMaterials", variables.groupId] });
    },
  });
}
