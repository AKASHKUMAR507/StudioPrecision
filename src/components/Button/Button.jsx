import './Button.css'

const VARIANTS = ['primary', 'secondary', 'inverted', 'outlined']

export function Button({ variant = 'primary', children, ...rest }) {
  const className = VARIANTS.includes(variant) ? `btn btn--${variant}` : 'btn btn--primary'
  return (
    <button className={className} {...rest}>
      {children}
    </button>
  )
}
