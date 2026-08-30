import './IconButton.css'

export function IconButton({ icon, tone = 'neutral', label, ...rest }) {
  return (
    <button className={`icon-btn icon-btn--${tone}`} aria-label={label} {...rest}>
      {icon}
      {label && <span className="icon-btn__label">{label}</span>}
    </button>
  )
}
