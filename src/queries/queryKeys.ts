import type { NewsQueryParams } from "./news/types";

export const queryKeys = {
  news: (params: NewsQueryParams) => ["news", params] as const,
};
