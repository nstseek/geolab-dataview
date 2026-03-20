import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#546e7a',
      light: '#819ca9',
      dark: '#29434e',
    },
    secondary: {
      main: '#ffb300',
      light: '#ffe54c',
      dark: '#c68400',
    },
    background: {
      default: '#1a2327',
      paper: '#263238',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e2d34',
          borderRight: '1px solid #37474f',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#263238',
          borderBottom: '1px solid #37474f',
        },
      },
    },
  },
})

export default theme
