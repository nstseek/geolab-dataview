import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LanguageIcon from '@mui/icons-material/Language'
import SourceIcon from '@mui/icons-material/Source'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import type { NewsArticle } from '@queries/news/types'

interface NewsArticleListProps {
  articles: NewsArticle[]
  isLoading: boolean
  onSelect: (article: NewsArticle) => void
}

function ArticleSkeleton() {
  return (
    <Card variant='outlined'>
      <CardContent>
        <Skeleton variant='text' width='80%' height={28} />
        <Skeleton variant='text' width='50%' height={20} sx={{ mt: 1 }} />
        <Skeleton variant='text' width='100%' height={16} sx={{ mt: 1 }} />
      </CardContent>
    </Card>
  )
}

export default function NewsArticleList({ articles, isLoading, onSelect }: NewsArticleListProps) {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <ArticleSkeleton key={i} />
        ))}
      </Box>
    )
  }

  if (articles.length === 0) {
    return (
      <Typography color='text.secondary' sx={{ mt: 4, textAlign: 'center' }}>
        No articles found. Try adjusting your search or region.
      </Typography>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {articles.slice(0, 10).map((article) => (
        <Card key={article.article_id} variant='outlined'>
          <CardActionArea onClick={() => onSelect(article)}>
            <CardContent>
              <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1, lineHeight: 1.4 }}>
                {article.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', color: 'text.secondary' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <SourceIcon fontSize='small' />
                  <Typography variant='caption'>{article.source_name ?? article.source_id}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarTodayIcon fontSize='small' />
                  <Typography variant='caption'>{dayjs(article.pubDate).format('MMM D, YYYY')}</Typography>
                </Box>
                {article.language && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LanguageIcon fontSize='small' />
                    <Chip label={article.language.charAt(0).toUpperCase() + article.language.slice(1)} size='small' variant='outlined' sx={{ height: 20 }} />
                  </Box>
                )}
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  )
}
