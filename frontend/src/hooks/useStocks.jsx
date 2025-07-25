import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllStocks } from "../api/stocks";

export function useStocks({ enabled = true, staleTime = 1000 * 60 * 5 } = {}) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["stocks"],
    queryFn: fetchAllStocks,
    enabled,
    staleTime,
    initialData: () => queryClient.getQueryData(["stocks"]),
  });
}
