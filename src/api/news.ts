import type { NewsApiResponse, NewsQueryParams } from '@queries/news/types'
import apiClient from './client'

// Free API key from https://newsdata.io — set VITE_NEWSDATA_API_KEY in your .env file
const NEWSDATA_API_KEY = import.meta.env.VITE_NEWSDATA_API_KEY as string

export async function getNews(params: NewsQueryParams): Promise<NewsApiResponse> {
  const response = await apiClient.get<NewsApiResponse>('/news', {
    params: {
      apikey: NEWSDATA_API_KEY,
      category: 'environment,science,technology',
      ...params,
    },
  })
  return response.data
}
