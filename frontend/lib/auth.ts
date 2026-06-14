export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("jobrover_token");
};

export const setToken = (token: string): void => {
  localStorage.setItem("jobrover_token", token);
};

export const getUser = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("jobrover_user");
  return raw ? JSON.parse(raw) : null;
};

export const setUser = (user: object): void => {
  localStorage.setItem("jobrover_user", JSON.stringify(user));
};

export const clearAuth = (): void => {
  localStorage.removeItem("jobrover_token");
  localStorage.removeItem("jobrover_user");
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};