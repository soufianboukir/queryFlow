import { api } from "@/config/api";

// Oauth with google
export const login = async () => {
  const response = await api.get(`/api/auth/google`);

  return response;
};

// fetch current user
export const getCurrentUser = async (token: string) => {
  const response = await api.get(`/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("hhhhhh");
  return response;
};

export const logout = async () => {
  await api.post("/api/auth/logout");
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "/";
};
