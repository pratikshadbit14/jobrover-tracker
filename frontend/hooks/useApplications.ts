import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Application } from "@/types";

export const useApplications = (filters?: {
  status?: string;
  source?: string;
}) =>
  useQuery<Application[]>({
    queryKey: ["applications", filters],
    queryFn: () =>
      api
        .get("/api/v1/applications", { params: filters })
        .then((r) => r.data),
  });

export const useApplication = (id: string) =>
  useQuery<Application>({
    queryKey: ["application", id],
    queryFn: () =>
      api.get(`/api/v1/applications/${id}`).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Application>) =>
      api.post("/api/v1/applications", body).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

export const useUpdateApplication = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Application>) =>
      api.patch(`/api/v1/applications/${id}`, body).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["application", id] });
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/api/v1/applications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

export const useStatusHistory = (id: string) =>
  useQuery({
    queryKey: ["history", id],
    queryFn: () =>
      api.get(`/api/v1/applications/${id}/history`).then((r) => r.data),
    enabled: !!id,
  });

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/api/v1/applications/${id}`, { status }).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["followups"] });
    },
  });
};

export const useInterviews = (applicationId: string) =>
  useQuery({
    queryKey: ["interviews", applicationId],
    queryFn: () =>
      api.get(`/api/v1/applications/${applicationId}/interviews`).then((r) => r.data),
    enabled: !!applicationId,
  });

export const useCreateInterview = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      round_type: string;
      scheduled_at?: string;
      interviewer?: string;
      prep_notes?: string;
    }) =>
      api
        .post(`/api/v1/applications/${applicationId}/interviews`, body)
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews", applicationId] });
    },
  });
};

export const useUpdateInterview = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: { outcome?: string; feedback?: string; completed_at?: string; scheduled_at?: string };
    }) => api.patch(`/api/v1/interviews/${id}`, body).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews", applicationId] });
    },
  });
};

export const useDeleteInterview = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/interviews/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews", applicationId] });
    },
  });
};