export interface NewsArticle {
  article_id: string
  title: string
  link: string
  keywords: string[] | null
  creator: string[] | null
  video_url: string | null
  description: string | null
  // Full article content — may be null on the free plan
  content: string | null
  // Format: "YYYY-MM-DD HH:mm:ss"
  pubDate: string
  pubDateTZ: string
  image_url: string | null
  source_id: string
  source_priority: number
  source_name: string | null
  source_url: string
  source_icon: string | null
  // Full language name, e.g. "english", "french"
  language: string
  // Full country names, e.g. ["united states", "united kingdom"]
  country: string[]
  category: string[]
  ai_tag: string | null
  sentiment: string | null
  sentiment_stats: string | null
  ai_region: string | null
  ai_org: string | null
  duplicate: boolean
}

export interface NewsQueryParams {
  // Full-text search
  q?: string
  // 2-letter ISO country code, e.g. "us", "gb"
  country?: string
  // Pagination cursor — value of nextPage from previous response
  page?: string
}

export interface NewsApiResponse {
  status: 'success' | 'error'
  totalResults: number
  results: NewsArticle[]
  // Cursor for the next page — pass as `page` param in the next request
  nextPage: string | null
}
