// src/hooks/useInterestStocks.js
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchInterestStocks } from "../api/interest";

export function useInterestStocks({
  enabled = true,
  staleTime = 1000 * 60 * 5,
} = {}) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["interestStocks"],
    queryFn: fetchInterestStocks,
    enabled,
    staleTime,
    initialData: () => queryClient.getQueryData(["interestStocks"]),
  });
}
