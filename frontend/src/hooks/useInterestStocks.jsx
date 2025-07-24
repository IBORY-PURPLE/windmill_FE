// src/hooks/useInterestStocks.js
import { useQuery } from "@tanstack/react-query";
import { fetchInterestStocks } from "../api/interest";

export function useInterestStocks({ enabled = true } = {}) {
  return useQuery({
    queryKey: ["interestStocks"],
    queryFn: fetchInterestStocks,
    enabled,
  });
}
