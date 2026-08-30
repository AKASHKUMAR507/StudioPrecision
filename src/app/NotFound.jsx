import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-stack-md px-canvas-margin-mobile py-section-gap text-center">
      <span className="text-mono-label font-mono-label text-tertiary">404</span>
      <h1 className="text-headline-md font-headline-md text-on-background">Page not found</h1>
      <Link to="/" className="text-mono-label font-mono-label text-tertiary underline underline-offset-4">
        Back to home
      </Link>
    </div>
  )
}
