import { HomeIcon, SearchIcon, UserIcon } from '../../utils/style'
import './NavBar.css'

const DEFAULT_ITEMS = [
  { key: 'home', icon: HomeIcon, label: 'Home' },
  { key: 'search', icon: SearchIcon, label: 'Search' },
  { key: 'profile', icon: UserIcon, label: 'Profile' },
]

export function NavBar({ items = DEFAULT_ITEMS, active = 'home', onSelect }) {
  return (
    <nav className="nav-bar">
      {items.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          className={`nav-bar__item${key === active ? ' nav-bar__item--active' : ''}`}
          aria-label={label}
          onClick={() => onSelect?.(key)}
        >
          <Icon />
        </button>
      ))}
    </nav>
  )
}
