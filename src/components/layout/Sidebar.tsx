import ArticleIcon from '@mui/icons-material/Article'
import HomeIcon from '@mui/icons-material/Home'
import ScienceIcon from '@mui/icons-material/Science'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { NavLink } from 'react-router-dom'

const DRAWER_WIDTH = 240

const navItems = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'Samples', path: '/samples', icon: <ScienceIcon /> },
  { label: 'News', path: '/news', icon: <ArticleIcon /> },
]

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

const drawerPaperSx = {
  width: DRAWER_WIDTH,
  boxSizing: 'border-box',
  top: 64,
  height: 'calc(100% - 64px)',
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const drawerContent = (
    <>
      <Typography
        variant='overline'
        sx={{ px: 2, pt: 2, pb: 1, color: 'text.secondary', letterSpacing: 2 }}
      >
        Navigation
      </Typography>
      <List>
        {navItems.map(({ label, path, icon }) => (
          <ListItem key={path} disablePadding>
            <ListItemButton
              component={NavLink}
              to={path}
              end={path === '/'}
              onClick={isMobile ? onClose : undefined}
              sx={{
                '&.active': {
                  backgroundColor: 'primary.dark',
                  '& .MuiListItemIcon-root': { color: 'secondary.main' },
                  '& .MuiListItemText-primary': { color: 'secondary.main', fontWeight: 600 },
                },
                '&:hover': { backgroundColor: 'action.hover' },
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  )

  if (isMobile) {
    return (
      <Drawer
        variant='temporary'
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': drawerPaperSx }}
      >
        {drawerContent}
      </Drawer>
    )
  }

  return (
    <Drawer
      variant='permanent'
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': drawerPaperSx,
      }}
    >
      {drawerContent}
    </Drawer>
  )
}
