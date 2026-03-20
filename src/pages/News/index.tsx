import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import { useDeferredValue, useEffect, useState } from 'react'
import { useHeader } from '@context/HeaderContext'
import { useNewsQuery } from '@queries/news/useNewsQuery'
import type { NewsArticle } from '@queries/news/types'
import NewsArticleDetail from './NewsArticleDetail'
import NewsArticleList from './NewsArticleList'
import NewsToolbar from './NewsToolbar'

const COUNTRIES: Record<string, string> = {
  us: 'United States', gb: 'United Kingdom', de: 'Germany', fr: 'France',
  au: 'Australia', ca: 'Canada', jp: 'Japan', br: 'Brazil', in: 'India',
}

export default function News() {
  const { setHeader } = useHeader()
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('')
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)

  const deferredSearch = useDeferredValue(search)

  const { data, isLoading, isError } = useNewsQuery({
    q: deferredSearch || undefined,
    country: country || undefined,
  })

  useEffect(() => {
    const regionLabel = country ? COUNTRIES[country] ?? country : ''
    const articleTitle = selectedArticle?.title ?? ''
    const parts = [regionLabel, articleTitle].filter(Boolean)
    setHeader('News', parts.join(' – '))
  }, [setHeader, country, selectedArticle])

  return (
    <Box>
      <NewsToolbar
        search={search}
        onSearchChange={setSearch}
        country={country}
        onCountryChange={setCountry}
      />

      {isError && (
        <Alert severity='error' sx={{ mb: 2 }}>
          Failed to load news. Check that the API key in src/api/news.ts is set correctly.
        </Alert>
      )}

      <NewsArticleList
        articles={data?.results ?? []}
        isLoading={isLoading}
        onSelect={setSelectedArticle}
      />

      <NewsArticleDetail
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </Box>
  )
}
