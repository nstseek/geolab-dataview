import { useQuery } from "@tanstack/react-query";
import { getNews } from "@api/news";
import { queryKeys } from "@queries/queryKeys";
import type { NewsQueryParams } from "./types";

export function useNewsQuery(params: NewsQueryParams) {
  return useQuery({
    queryKey: queryKeys.news(params),
    queryFn: () => getNews(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}
