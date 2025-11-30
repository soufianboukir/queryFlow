import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ask } from "@/services/ask";
import { getToken } from "./use-auth";
import { historyKeys } from "./use-history";

/**
 * Hook to ask a question (mutation)
 * @returns Mutation object with mutate function and loading/error states
 */
export function useAskQuestion() {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: async ({
      question,
      historyUrl,
    }: {
      question: string;
      historyUrl?: string;
    }) => {
      if (!token) {
        throw new Error("No token found");
      }

      const queryParams = new URLSearchParams({ question });
      if (historyUrl) {
        queryParams.append("history_url", historyUrl);
      }

      const response = await ask(token, queryParams.toString());
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate history queries to refetch updated data
      if (data.history_id || data.url) {
        queryClient.invalidateQueries({ queryKey: historyKeys.all });
      }
    },
  });
}
