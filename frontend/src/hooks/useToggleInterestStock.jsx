// src/hooks/useToggleInterestStock.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleInterestStock } from "../api/interest";

export function useToggleInterestStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stockId, isAlreadyInterested }) =>
      toggleInterestStock(stockId, isAlreadyInterested),
    onSuccess: () => {
      queryClient.invalidateQueries(["interestStocks"]); // 관심 종목 목록을 갱신
    },
  });
}
