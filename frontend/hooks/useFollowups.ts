import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Followup } from "@/types";

export const useFollowups = () =>
  useQuery<Followup[]>({
    queryKey: ["followups"],
    queryFn: () => api.get("/api/v1/followups").then((r) => r.data),
  });

export const useOverdueFollowups = () =>
  useQuery<Followup[]>({
    queryKey: ["followups", "overdue"],
    queryFn: () =>
      api.get("/api/v1/followups/overdue").then((r) => r.data),
    refetchInterval: 60_000,
  });

export const useUpdateFollowup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: { status?: string; draft_body?: string; due_date?: string };
    }) =>
      api.patch(`/api/v1/followups/${id}`, body).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followups"] });
    },
  });
};