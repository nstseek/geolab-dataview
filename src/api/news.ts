import type { NewsApiResponse, NewsQueryParams } from "@queries/news/types";
import apiClient from "./client";

export async function getNews(
  params: NewsQueryParams,
): Promise<NewsApiResponse> {
  const response = await apiClient.get<NewsApiResponse>("/news", { params });
  return response.data;
}
