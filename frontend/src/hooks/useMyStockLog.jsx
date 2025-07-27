import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMyStockLogs } from "../api/mystock";

export const useMyStockLog = (stockId, enabled = false) => {
  const queryClient = useQueryClient();

  const {
    data: stockLogs = [],
    isLoading,
    isError,
    refetch,
    setQueryData = (updater) => {
      const prev = queryClient.getQueryData(["stockLogs", stockId]) || [];
      queryClient.setQueryData(["stockLogs", stockId], updater(prev));
    },
  } = useQuery({
    queryKey: ["stockLogs", stockId],
    queryFn: () => fetchMyStockLogs(stockId),
    enabled, // false일 경우 refetch 필요
  });

  return {
    stockLogs,
    isLoading,
    isError,
    refetch,
    setQueryData,
  };
};
