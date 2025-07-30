import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "../api/news";

export function useNews(query) {
  return useQuery({
    queryKey: ["news", query],
    queryFn: () => fetchNews(query),
    enabled: !!query,
  });
}
