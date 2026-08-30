import { Icon } from '../../components/ui/Icon'
import { ImagePlaceholder } from '../../components/ui/ImagePlaceholder'
import { SITE } from '../../config/site'
import { revealClass, useReveal } from '../../hooks/useReveal'

const ARSENAL = [
  {
    icon: 'terminal',
    title: 'Languages & Native',
    items: ['JavaScript', 'TypeScript', 'Java', 'Kotlin', 'Swift'],
  },
  {
    icon: 'widgets',
    title: 'Mobile Frameworks',
    items: ['React Native', 'New Architecture', 'React.js', 'Redux', 'Zustand'],
  },
  {
    icon: 'architecture',
    title: 'Backend, Cloud & Tools',
    items: ['Firebase', 'MongoDB', 'Sentry.io', 'CI/CD', 'Git & GitHub'],
  },
]

const EXPERIENCE = [
  {
    period: 'Jan 2025 — Present',
    role: 'Software Developer',
    company: 'Plugseal Innovation Services Pvt Ltd',
    description:
      'Leading end-to-end development of Seeds, a micro-lending loan management app with a three-role approval workflow (Regional Officer, Branch Manager, Branch Credit Manager). Integrated OCR, Equifax CIBIL scoring, PennyDrop bank verification, and Google Maps geolocation into a reusable form-validation framework, with Firebase App Distribution and Sentry.io monitoring for QA and error tracking.',
  },
  {
    period: 'Jun 2023 — Dec 2024',
    role: 'Software Developer',
    company: 'WorldRef Technology',
    description:
      'Engineered and launched mobile apps on the Play Store and App Store, growing engagement by 25% and reaching a 4.9-star rating. Reduced app size by 80%, built a reusable component library on a TypeScript-based MVC architecture, and integrated Sentry, Zustand, and AsyncStorage — cutting bug resolution time by 60% and boosting data-handling efficiency by 50%.',
  },
  {
    period: 'Jan 2023 — Jun 2023',
    role: 'React Native Developer Intern',
    company: 'Mobiloitte',
    description:
      'Designed accessible UIs and built a reusable React Native component library, cutting development time by 40%. Integrated REST APIs with Axios for seamless front-end/back-end data communication.',
  },
]

function Hero() {
  const [ref, visible] = useReveal()
  return (
    <section ref={ref} className={revealClass(visible, 'mb-section-gap grid grid-cols-1 items-center gap-gutter md:grid-cols-12')}>
      <div className="order-2 space-y-stack-lg md:order-1 md:col-span-7">
        <h1 className="text-display-lg-mobile font-display-lg-mobile leading-tight text-on-surface md:text-display-lg md:font-display-lg">
          Engineering native experiences with precision and intent.
        </h1>
        <p className="max-w-2xl text-body-lg font-body-lg text-on-surface-variant">
          I'm a React Native developer with 3+ years building and shipping production mobile apps in fintech and
          consumer domains, with working exposure to native Android (Kotlin/Java) and iOS (Swift/Objective-C), React
          Native's New Architecture (Fabric/TurboModules), and CI/CD pipelines. I bridge the gap between elegant
          design and rigorous engineering.
        </p>
        <div className="flex gap-stack-md pt-4">
          <a
            href={SITE.resumeUrl}
            download
            className="rounded-full bg-tertiary px-8 py-3 font-mono-label text-mono-label text-on-tertiary transition-colors hover:bg-tertiary/90 active:translate-y-px"
          >
            Download CV
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="rounded-full border border-outline px-8 py-3 font-mono-label text-mono-label text-on-surface transition-colors hover:bg-surface-variant"
          >
            Contact
          </a>
        </div>
      </div>
      <div className="order-1 md:order-2 md:col-span-5">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl shadow-ambient">
          {SITE.author.portraitSrc ? (
            <img
              src={SITE.author.portraitSrc}
              alt={SITE.author.name}
              className="h-full w-full object-cover object-[center_20%]"
            />
          ) : (
            <ImagePlaceholder label="Professional headshot" icon="person" className="h-full w-full" />
          )}
        </div>
      </div>
    </section>
  )
}

function TechArsenal() {
  const [ref, visible] = useReveal()
  return (
    <section ref={ref} className={revealClass(visible, 'mb-section-gap')}>
      <h2 className="mb-stack-lg text-headline-md font-headline-md text-on-surface">Technical Arsenal</h2>
      <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
        {ARSENAL.map((group) => (
          <div
            key={group.title}
            className="flex flex-col gap-stack-md rounded-xl border border-whisper bg-surface-container-lowest p-8 shadow-ambient"
          >
            <Icon name={group.icon} filled className="text-4xl text-tertiary" />
            <h3 className="font-mono-label text-mono-label uppercase tracking-widest text-on-surface">
              {group.title}
            </h3>
            <div className="mt-auto flex flex-wrap gap-stack-sm">
              {group.items.map((item) => (
                <span key={item} className="rounded bg-surface-container-high px-3 py-1 text-mono-sm font-mono-sm text-on-surface">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Journey() {
  const [ref, visible] = useReveal()
  return (
    <section ref={ref} className={revealClass(visible, 'mb-section-gap max-w-4xl')}>
      <h2 className="mb-stack-lg text-headline-md font-headline-md text-on-surface">Professional Journey</h2>
      <div>
        {EXPERIENCE.map((entry, index) => (
          <div
            key={entry.role}
            className={`group flex flex-col gap-stack-md border-t border-outline-variant/20 py-stack-lg md:flex-row md:gap-gutter ${
              index === EXPERIENCE.length - 1 ? 'border-b' : ''
            }`}
          >
            <div className="pt-1 md:w-1/4">
              <span className="text-mono-sm font-mono-sm text-on-surface-variant">{entry.period}</span>
            </div>
            <div className="md:w-3/4">
              <h3 className="text-body-lg font-body-lg font-bold text-on-surface transition-colors group-hover:text-tertiary">
                {entry.role}
              </h3>
              <p className="mb-stack-sm text-mono-sm font-mono-sm text-tertiary">{entry.company}</p>
              <p className="text-body-md font-body-md text-on-surface-variant">{entry.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function About() {
  return (
    <div className="mx-auto w-full max-w-7xl px-canvas-margin-mobile pb-section-gap pt-12 md:px-canvas-margin">
      <Hero />
      <TechArsenal />
      <Journey />
    </div>
  )
}
