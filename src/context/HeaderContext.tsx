import { createContext, useCallback, useContext, useState } from 'react'

interface HeaderContextValue {
  pageTitle: string
  contextSuffix: string
  setHeader: (title: string, suffix: string) => void
}

const HeaderContext = createContext<HeaderContextValue | null>(null)

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [pageTitle, setPageTitle] = useState('Home')
  const [contextSuffix, setContextSuffix] = useState('')

  const setHeader = useCallback((title: string, suffix: string) => {
    setPageTitle(title)
    setContextSuffix(suffix)
  }, [])

  return (
    <HeaderContext value={{ pageTitle, contextSuffix, setHeader }}>
      {children}
    </HeaderContext>
  )
}

export function useHeader() {
  const ctx = useContext(HeaderContext)
  if (!ctx) throw new Error('useHeader must be used within HeaderProvider')
  return ctx
}
