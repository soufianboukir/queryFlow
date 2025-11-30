import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/services/auth";
import { User } from "@/types/user";

// Helper function to get token from cookies
export const getToken = (): string | null => {
  if (typeof document === "undefined") return null;
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1] || null
  );
};

// Query key factory
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "currentUser"] as const,
};

/**
 * Hook to fetch current authenticated user
 * @returns Query result with user data, loading state, and error
 */
export function useCurrentUser() {
  const token = getToken();

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      if (!token) {
        throw new Error("No token found");
      }
      const response = await getCurrentUser(token);
      return response.data as User;
    },
    enabled: !!token, // Only run query if token exists
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}
