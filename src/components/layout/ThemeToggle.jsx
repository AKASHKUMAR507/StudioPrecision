import { useTheme } from '../../hooks/ThemeContext'
import { Icon } from '../ui/Icon'

export function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`inline-flex items-center justify-center rounded-full p-2 text-on-surface-variant hover:text-tertiary hover:bg-surface-variant/40 transition-colors ${className}`}
    >
      <Icon name={isDark ? 'light_mode' : 'dark_mode'} className="text-[20px]" />
    </button>
  )
}
