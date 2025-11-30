import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getHistories,
  getQueriesByHistory,
  updateVisibility,
  updateTitle,
  deleteHistory,
} from "@/services/history";
import { getToken } from "./use-auth";

// Query key factory
export const historyKeys = {
  all: ["history"] as const,
  lists: () => [...historyKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...historyKeys.lists(), filters] as const,
  details: () => [...historyKeys.all, "detail"] as const,
  detail: (id: string) => [...historyKeys.details(), id] as const,
};

/**
 * Hook to fetch all chat histories
 */
export function useHistories() {
  const token = getToken();

  return useQuery({
    queryKey: historyKeys.list(),
    queryFn: async () => {
      if (!token) {
        throw new Error("No token found");
      }
      const response = await getHistories(token);
      return response.data;
    },
    enabled: !!token,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch a specific chat history by URL
 */
export function useHistoryByUrl(historyUrl: string | null) {
  const token = getToken();

  return useQuery({
    queryKey: historyKeys.detail(historyUrl || ""),
    queryFn: async () => {
      if (!token || !historyUrl) {
        throw new Error("No token or history URL found");
      }
      const response = await getQueriesByHistory(token, historyUrl);
      return response.data;
    },
    enabled: !!token && !!historyUrl,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to update history visibility (mutation)
 */
export function useUpdateVisibility() {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: async ({
      id,
      visibility,
    }: {
      id: string;
      visibility: "public" | "private";
    }) => {
      if (!token) {
        throw new Error("No token found");
      }
      const response = await updateVisibility(id, token, visibility);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.all });
    },
  });
}

/**
 * Hook to update history title (mutation)
 */
export function useUpdateTitle() {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      if (!token) {
        throw new Error("No token found");
      }
      const response = await updateTitle(id, title, token);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.all });
    },
  });
}

/**
 * Hook to delete history (mutation)
 */
export function useDeleteHistory() {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!token) {
        throw new Error("No token found");
      }
      const response = await deleteHistory(id, token);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.all });
    },
  });
}
