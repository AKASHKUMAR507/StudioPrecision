import { Icon } from './Icon'

export function ImagePlaceholder({ label, icon = 'image', className = '' }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex items-center justify-center bg-surface-variant/60 text-on-surface-variant ${className}`}
    >
      <Icon name={icon} className="text-4xl opacity-50" />
    </div>
  )
}
