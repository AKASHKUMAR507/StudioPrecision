import './SkeletonLines.css'

const DEFAULT_WIDTHS = ['70%', '85%', '45%']

export function SkeletonLines({ widths = DEFAULT_WIDTHS, accentIndex = 2 }) {
  return (
    <div className="skeleton-lines">
      {widths.map((width, i) => (
        <span
          key={i}
          className={`skeleton-lines__bar${i === accentIndex ? ' skeleton-lines__bar--accent' : ''}`}
          style={{ width }}
        />
      ))}
    </div>
  )
}
