import CloseIcon from '@mui/icons-material/Close'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import type { NewsArticle } from '@queries/news/types'

interface NewsArticleDetailProps {
  article: NewsArticle | null
  onClose: () => void
}

export default function NewsArticleDetail({ article, onClose }: NewsArticleDetailProps) {
  if (!article) return null

  return (
    <Modal open onClose={onClose}>
      <Paper
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90vw', md: 640 },
          maxHeight: '80vh',
          overflow: 'auto',
          p: 3,
          outline: 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant='h6' sx={{ flex: 1, pr: 2, lineHeight: 1.4 }}>
            {article.title}
          </Typography>
          <IconButton onClick={onClose} size='small'>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip label={article.source_name ?? article.source_id} size='small' color='primary' />
          <Chip label={article.language.charAt(0).toUpperCase() + article.language.slice(1)} size='small' variant='outlined' />
          <Typography variant='caption' color='text.secondary' sx={{ alignSelf: 'center' }}>
            {dayjs(article.pubDate).format('MMM D, YYYY')}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {article.image_url && (
          <Box
            component='img'
            src={article.image_url}
            alt=''
            sx={{ width: '100%', borderRadius: 1, mb: 2, maxHeight: 240, objectFit: 'cover' }}
          />
        )}

        <Typography variant='body2' color='text.secondary' sx={{ mb: 3, lineHeight: 1.8 }}>
          {article.content ?? article.description ?? 'No description available.'}
        </Typography>

        <Button
          variant='contained'
          endIcon={<OpenInNewIcon />}
          href={article.link}
          target='_blank'
          rel='noopener noreferrer'
          component='a'
        >
          Read full article
        </Button>
      </Paper>
    </Modal>
  )
}
