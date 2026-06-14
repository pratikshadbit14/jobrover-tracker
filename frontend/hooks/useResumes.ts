import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Resume } from "@/types";

export const useResumes = () =>
  useQuery<Resume[]>({
    queryKey: ["resumes"],
    queryFn: () => api.get("/api/v1/resumes").then((r) => r.data),
  });

export const useCreateResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { label: string; raw_text: string; file_url?: string }) =>
      api.post("/api/v1/resumes", body).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
};

export const useSetDefaultResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.patch(`/api/v1/resumes/${id}/set-default`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/resumes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
};