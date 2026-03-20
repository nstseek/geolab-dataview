import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from '@components/layout/Layout'
import { HeaderProvider } from '@context/HeaderContext'
import Home from '@pages/Home'
import News from '@pages/News'
import Samples from '@pages/Samples'
import theme from './theme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HeaderProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path='samples' element={<Samples />} />
                <Route path='news' element={<News />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </HeaderProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
