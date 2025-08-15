import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchStockChart } from "../api/stockChart";

export const CHART_PERIODS = [7, 30, 360];

export function useStockChart(stockId, days) {
  return useQuery({
    queryKey: ["stockChart", stockId, days],
    queryFn: () => fetchStockChart({ stockId, days }),
    enabled: Boolean(stockId) && Boolean(days),
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    keepPreviousData: true,
  });
}

export function usePrefetchStockCharts(stockId) {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!stockId) return;
    CHART_PERIODS.forEach((days) => {
      queryClient.prefetchQuery({
        queryKey: ["stockChart", stockId, days],
        queryFn: () => fetchStockChart({ stockId, days }),
        staleTime: 5 * 60 * 1000,
      });
    });
  }, [queryClient, stockId]);
}
