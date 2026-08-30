import { NavLink } from 'react-router-dom'
import { Icon } from '../ui/Icon'

const TABS = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/#work', label: 'Work', icon: 'grid_view' },
  { to: '/blog', label: 'Blog', icon: 'article' },
  { to: '/about', label: 'About', icon: 'person' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-outline-variant/20 bg-surface-container-lowest/80 px-4 py-3 shadow-lg backdrop-blur-md md:hidden">
      {TABS.map((tab) => (
        <NavLink
          key={tab.label}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center rounded-full px-4 py-1 text-mono-sm font-mono-sm transition-all duration-150 ${
              isActive
                ? 'scale-95 bg-tertiary-container text-tertiary'
                : 'text-on-surface-variant hover:bg-surface-variant/50'
            }`
          }
        >
          <Icon name={tab.icon} className="mb-1" />
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
