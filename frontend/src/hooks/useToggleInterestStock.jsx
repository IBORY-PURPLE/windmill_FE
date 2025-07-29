import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleInterestStock } from "../api/interest";
import { toast } from "react-toastify";

export function useToggleInterestStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stockId, isAlreadyInterested }) =>
      toggleInterestStock(stockId, isAlreadyInterested),

    // 1. 요청 전에 낙관적 업데이트 수행
    onMutate: async ({ stockId, isAlreadyInterested }) => {
      if (isAlreadyInterested) {
        toast.info("관심취소");
      } else {
        toast.info("관심등록!");
      }
      await queryClient.cancelQueries(["interestStocks"]);

      const previousInterest = queryClient.getQueryData(["interestStocks"]);

      queryClient.setQueryData(["interestStocks"], (old) => {
        if (!old) return [];
        return isAlreadyInterested
          ? old.filter((id) => id !== stockId)
          : [...old, stockId];
      });

      return { previousInterest };
    },

    // 2. 실패하면 롤백
    onError: (_error, _variables, context) => {
      if (context?.previousInterest) {
        queryClient.setQueryData(["interestStocks"], context.previousInterest);
      }
    },

    // 3. 성공/실패 관계없이 서버 응답 동기화
    onSettled: () => {
      queryClient.invalidateQueries(["interestStocks"]);
    },
  });
}
