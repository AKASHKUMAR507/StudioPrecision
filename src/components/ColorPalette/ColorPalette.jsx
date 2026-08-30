import './ColorPalette.css'

const SHADES = [900, 700, 500, 300, 100]

export function ColorPalette({ name, hex, cssVar, textColor = '#1c1c1e' }) {
  return (
    <div className="palette-card">
      <div className="palette-card__swatch" style={{ background: hex, color: textColor }}>
        <span className="palette-card__name">{name}</span>
        <span className="palette-card__hex">{hex}</span>
      </div>
      <div className="palette-card__ramp">
        {SHADES.map((shade) => (
          <span
            key={shade}
            className="palette-card__ramp-step"
            style={{ background: `var(--color-${cssVar}-${shade})` }}
          />
        ))}
      </div>
    </div>
  )
}
