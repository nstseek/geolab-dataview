import Box from '@mui/material/Box'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box
        component='a'
        href='#main-content'
        sx={{
          position: 'absolute',
          left: '-9999px',
          p: '8px 16px',
          bgcolor: 'background.paper',
          border: '2px solid',
          borderColor: 'secondary.main',
          borderRadius: 1,
          color: 'text.primary',
          textDecoration: 'none',
          fontWeight: 600,
          '&:focus': {
            position: 'fixed',
            left: '50%',
            top: 8,
            transform: 'translateX(-50%)',
            zIndex: 9999,
          },
        }}
      >
        Skip to main content
      </Box>

      <Header
        sidebarOpen={mobileOpen}
        onMenuClick={() => setMobileOpen((prev) => !prev)}
      />
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box
        id='main-content'
        component='main'
        tabIndex={-1}
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2, md: 3 },
          mt: '64px',
          overflow: 'auto',
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          outline: 'none',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
