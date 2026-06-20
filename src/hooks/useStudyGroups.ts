import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

export enum GroupModality {
  PRESENTIAL = "PRESENTIAL",
  ONLINE = "ONLINE",
  HYBRID = "HYBRID"
}

export interface StudyGroup {
  id: string;
  theme: string;
  university_course?: string;
  description?: string;
  modality: GroupModality;
  created_at: string;
  _count?: {
    members: number;
  };
}

export type CreateStudyGroupDTO = Omit<StudyGroup, 'id' | 'created_at' | '_count'>;
export type UpdateStudyGroupDTO = Partial<CreateStudyGroupDTO>;

export function useStudyGroups() {
  return useQuery<StudyGroup[]>({
    queryKey: ["studyGroups"],
    queryFn: async () => {
      const response = await api.get("/student-groups");
      return response.data;
    },
  });
}

export function useCreateStudyGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateStudyGroupDTO) => {
      const response = await api.post("/student-groups", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyGroups"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyGroups"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyGroups"] });
    },
  });
}
