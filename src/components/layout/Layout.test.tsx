import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { HeaderProvider } from '@context/HeaderContext'
import theme from '../../theme'
import Layout from './Layout'

function renderLayout(initialPath = '/') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <HeaderProvider>
          <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<div>Home page</div>} />
                <Route path='samples' element={<div>Samples page</div>} />
                <Route path='news' element={<div>News page</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </HeaderProvider>
      </ThemeProvider>
    </QueryClientProvider>,
  )
}

describe('Layout', () => {
  it('renders sidebar navigation links', () => {
    renderLayout()
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /samples/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /news/i })).toBeInTheDocument()
  })

  it('renders the GeoLab brand in the header', () => {
    renderLayout()
    expect(screen.getByText('GeoLab')).toBeInTheDocument()
  })

  it('renders outlet content', () => {
    renderLayout('/')
    expect(screen.getByText('Home page')).toBeInTheDocument()
  })

  it('renders samples outlet content when on /samples', () => {
    renderLayout('/samples')
    expect(screen.getByText('Samples page')).toBeInTheDocument()
  })
})
