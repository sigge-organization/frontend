import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

// -- TYPES --
export interface GroupEvent {
  id: string;
  studentGroupId: string;
  title: string;
  date_time_event: string;
  local_or_link_event: string;
  createdBy?: {
    id: string;
    name: string | null;
    email: string;
  };
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
      queryClient.invalidateQueries({ queryKey: ["myAllEvents"] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ groupId, eventId, data }: { groupId: string; eventId: string; data: Partial<Omit<GroupEvent, "id" | "studentGroupId">> }) => {
      const response = await api.put(`/student-groups/${groupId}/events/${eventId}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groupEvents", variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ["myAllEvents"] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ groupId, eventId }: { groupId: string; eventId: string }) => {
      await api.delete(`/student-groups/${groupId}/events/${eventId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groupEvents", variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ["myAllEvents"] });
    },
  });
}

export function useMyAllEvents() {
  // Retorna eventos + info do grupo
  return useQuery<(GroupEvent & { group: { id: string; theme: string } })[]>({
    queryKey: ["myAllEvents"],
    queryFn: async () => {
      const response = await api.get(`/student-groups/my/all-events`);
      return response.data;
    },
  });
}

// -- POSTS HOOKS --
export function useGroupPosts(groupId: string) {
  return useInfiniteQuery({
    queryKey: ["groupPosts", groupId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get(`/student-groups/${groupId}/posts?page=${pageParam}&limit=20`);
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
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
  return useInfiniteQuery({
    queryKey: ["groupMaterials", groupId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get(`/student-groups/${groupId}/materials?page=${pageParam}&limit=20`);
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: GroupMaterial[], allPages) => {
      return lastPage.length === 20 ? allPages.length + 1 : undefined;
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
      queryClient.invalidateQueries({ queryKey: ["myAllMaterials"] });
    },
  });
}

export function useUpdateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ groupId, materialId, title, external_url }: { groupId: string; materialId: string; title?: string; external_url?: string }) => {
      const response = await api.put(`/student-groups/${groupId}/materials/${materialId}`, { title, external_url });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groupMaterials", variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ["myAllMaterials"] });
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ groupId, materialId }: { groupId: string; materialId: string }) => {
      await api.delete(`/student-groups/${groupId}/materials/${materialId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groupMaterials", variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ["myAllMaterials"] });
    },
  });
}

export function useMyAllMaterials() {
  return useQuery<(GroupMaterial & { group: { id: string; theme: string } })[]>({
    queryKey: ["myAllMaterials"],
    queryFn: async () => {
      const response = await api.get(`/student-groups/my/all-materials`);
      return response.data;
    },
  });
}
