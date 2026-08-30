import { Link, NavLink } from 'react-router-dom'
import { SITE } from '../../config/site'
import { ThemeToggle } from './ThemeToggle'

const NAV_LINKS = [
  { to: '/#work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
]

export function Header() {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b border-outline-variant/30 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-canvas-margin-mobile py-6 md:px-canvas-margin">
        <Link to="/" className="text-body-lg font-headline-md font-bold tracking-tight text-on-background">
          {SITE.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `text-body-md font-body-md transition-colors duration-300 ${
                  isActive ? 'text-tertiary font-medium' : 'text-secondary hover:text-tertiary'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${SITE.email}`}
            className="hidden rounded font-mono-label text-mono-label bg-tertiary px-6 py-2 text-on-tertiary transition-colors hover:bg-tertiary/90 md:inline-flex"
          >
            Hire Me
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
