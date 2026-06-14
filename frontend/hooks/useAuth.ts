"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { setToken, setUser, clearAuth, getToken } from "@/lib/auth";
import { User } from "@/types";

export const useMe = () =>
  useQuery<User>({
    queryKey: ["me"],
    queryFn: () => api.get("/api/v1/auth/me").then((r) => r.data),
    enabled: !!getToken(),
    retry: false,
  });

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      api.post("/api/v1/auth/login", body).then((r) => r.data),
    onSuccess: async (data) => {
      setToken(data.access_token);
      const user = await api
        .get("/api/v1/auth/me")
        .then((r) => r.data);
      setUser(user);
      queryClient.setQueryData(["me"], user);
      router.push("/dashboard");
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (body: {
      email: string;
      password: string;
      full_name: string;
      current_title?: string;
    }) => api.post("/api/v1/auth/register", body).then((r) => r.data),
    onSuccess: () => {
      router.push("/login");
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    clearAuth();
    queryClient.clear();
    router.push("/login");
  };
};