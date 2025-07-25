// src/hooks/useAddMyStock.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMyStock } from "../api/mystock";

export function useAddMyStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addMyStock,
    onSuccess: () => {
      queryClient.invalidateQueries(["myStocks"]);
    },
  });
}
