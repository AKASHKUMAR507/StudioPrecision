export function Icon({ name, className = '', filled = false, style, ...rest }) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}`, ...style }}
      aria-hidden="true"
      {...rest}
    >
      {name}
    </span>
  )
}
