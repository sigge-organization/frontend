import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

export enum GroupModality {
  PRESENTIAL = "PRESENTIAL",
  ONLINE = "ONLINE",
  HYBRID = "HYBRID"
}

export enum GroupRole {
  ADMIN = "ADMIN",
  STUDENT = "STUDENT"
}

export interface StudyGroup {
  id: string;
  theme: string;
  university_course?: string;
  description?: string;
  modality: GroupModality;
  joinCode: string;
  created_at: string;
  _count?: {
    members: number;
  };
  members?: Array<{
    role: GroupRole;
    user: {
      id: string;
      name: string | null;
      email: string;
      course: string | null;
    }
  }>;
  latestActivity?: number | string;
}

export type CreateStudyGroupDTO = Omit<StudyGroup, 'id' | 'created_at' | '_count' | 'joinCode'> & { password?: string };
export type UpdateStudyGroupDTO = Partial<Omit<CreateStudyGroupDTO, 'password'>>;

export interface JoinStudyGroupDTO {
  joinCode: string;
  password?: string;
}

export function useStudyGroups() {
  return useQuery<StudyGroup[]>({
    queryKey: ["studyGroups"],
    queryFn: async () => {
      const response = await api.get("/student-groups");
      return response.data;
    },
  });
}

export function useRecentStudyGroups() {
  return useQuery<StudyGroup[]>({
    queryKey: ["recentStudyGroups"],
    queryFn: async () => {
      const response = await api.get("/student-groups/recent");
      return response.data;
    },
  });
}

export function useStudyGroup(id: string) {
  return useQuery<StudyGroup>({
    queryKey: ["studyGroup", id],
    queryFn: async () => {
      const response = await api.get(`/student-groups/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateStudyGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateStudyGroupDTO) => {
      const response = await api.post("/student-groups", data);
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["studyGroups"] }),
        queryClient.invalidateQueries({ queryKey: ["recentStudyGroups"] })
      ]);
    },
  });
}

export function useUpdateStudyGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateStudyGroupDTO }) => {
      const response = await api.put(`/student-groups/${id}`, data);
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["studyGroups"] }),
        queryClient.invalidateQueries({ queryKey: ["recentStudyGroups"] })
      ]);
    },
  });
}

export function useArchiveStudyGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/student-groups/${id}`);
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["studyGroups"] }),
        queryClient.invalidateQueries({ queryKey: ["recentStudyGroups"] })
      ]);
    },
  });
}

export function useJoinStudyGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: JoinStudyGroupDTO) => {
      const response = await api.post("/student-groups/join", data);
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["studyGroups"] }),
        queryClient.invalidateQueries({ queryKey: ["recentStudyGroups"] })
      ]);
    },
  });
}

export interface WeeklyEvent {
  id: string;
  title: string;
  date_time_event: string;
  local_or_link_event: string;
  group: {
    id: string;
    theme: string;
  };
}

export interface RecentMaterial {
  id: string;
  title: string;
  external_url: string;
  created_at: string;
  group: {
    id: string;
    theme: string;
  };
  uploadedBy: {
    id: string;
    name: string;
  };
}

export function useMyWeeklyEvents() {
  return useQuery<WeeklyEvent[]>({
    queryKey: ["myWeeklyEvents"],
    queryFn: async () => {
      const response = await api.get("/student-groups/my/weekly-events");
      return response.data;
    },
  });
}

export function useMyRecentMaterials() {
  return useQuery<RecentMaterial[]>({
    queryKey: ["myRecentMaterials"],
    queryFn: async () => {
      const response = await api.get("/student-groups/my/recent-materials");
      return response.data;
    },
  });
}
