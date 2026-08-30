import './Card.css'

export function Card({ label, meta, children, className = '', ...rest }) {
  return (
    <div className={`card ${className}`.trim()} {...rest}>
      {(label || meta) && (
        <div className="card__header">
          {label && <span className="card__label">{label}</span>}
          {meta && <span className="card__meta">{meta}</span>}
        </div>
      )}
      {children && <div className="card__body">{children}</div>}
    </div>
  )
}
