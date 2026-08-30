const SOCIAL_LINKS = [
  { label: 'Email', href: 'mailto:hello@example.com' },
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
]

export function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant/30 bg-background pb-24 md:pb-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-stack-lg px-canvas-margin-mobile py-section-gap md:flex-row md:px-canvas-margin">
        <div className="flex flex-col gap-2">
          <span className="text-headline-md font-headline-md tracking-tight text-on-background">Studio Precision</span>
          <span className="text-body-md font-body-md text-secondary">© 2026 React Native Studio</span>
        </div>
        <nav className="flex gap-8">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-mono-label font-mono-label text-secondary underline underline-offset-4 transition-colors duration-300 hover:text-tertiary"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
