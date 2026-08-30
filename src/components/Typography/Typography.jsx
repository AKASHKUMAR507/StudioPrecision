import './Typography.css'

export function TypeSample({ label, fontName, className }) {
  return (
    <div className="type-sample">
      <div className="type-sample__header">
        <span className="type-sample__label">{label}</span>
        <span className="type-sample__font-name">{fontName}</span>
      </div>
      <div className={`type-sample__preview ${className}`}>Aa</div>
    </div>
  )
}

export function Headline({ as: Tag = 'h2', children, ...rest }) {
  return (
    <Tag className="text-headline" {...rest}>
      {children}
    </Tag>
  )
}

export function Body({ children, ...rest }) {
  return (
    <p className="text-body" {...rest}>
      {children}
    </p>
  )
}

export function Label({ children, ...rest }) {
  return (
    <span className="text-label" {...rest}>
      {children}
    </span>
  )
}
