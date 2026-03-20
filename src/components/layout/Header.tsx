import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useHeader } from '@context/HeaderContext'

export default function Header() {
  const { pageTitle, contextSuffix } = useHeader()

  const title = contextSuffix ? `${pageTitle} – ${contextSuffix}` : pageTitle

  return (
    <AppBar position='fixed' elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant='h6' component='h1' sx={{ fontWeight: 600, letterSpacing: 0.5 }}>
          GeoLab
        </Typography>
        <Typography
          variant='h6'
          sx={{ ml: 2, color: 'text.secondary', fontWeight: 400 }}
        >
          /
        </Typography>
        <Typography variant='h6' sx={{ ml: 2, fontWeight: 500 }}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
