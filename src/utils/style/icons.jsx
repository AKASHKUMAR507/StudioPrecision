const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function SearchIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  )
}

export function HomeIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  )
}

export function UserIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  )
}

export function EditIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

export function TagIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M20.6 12.6 12.9 20.3a1.9 1.9 0 0 1-2.7 0L3.7 13.8a1.9 1.9 0 0 1 0-2.7L11.4 3.4A1.9 1.9 0 0 1 12.7 3H19a1 1 0 0 1 1 1v6.3a1.9 1.9 0 0 1-.4.9Z" />
      <circle cx="15.5" cy="8.5" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function TrashIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  )
}

export function WandIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20 16 8" />
      <path d="M14 6l1 3 3 1-3 1-1 3-1-3-3-1 3-1Z" />
      <path d="M19 3v3M20.5 4.5h-3" />
    </svg>
  )
}

export function GridIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}
