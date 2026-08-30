import { createContext, useContext } from 'react'

export const ThemeContext = createContext(null)
export const THEME_STORAGE_KEY = 'sp-theme'

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
