import { Link } from 'react-router-dom'
import { Icon } from '../../components/ui/Icon'
import { ImagePlaceholder } from '../../components/ui/ImagePlaceholder'
import { revealClass, useReveal } from '../../hooks/useReveal'
import { PROJECTS } from '../work/projects'

const SKILLS = ['React Native', 'TypeScript', 'Redux', 'Native Modules', 'CI/CD', 'App Store Submissions', 'Jest']

function HeroSection() {
  const [ref, visible] = useReveal()
  return (
    <section
      ref={ref}
      className={revealClass(
        visible,
        'grid min-h-[430px] grid-cols-1 items-center gap-gutter md:min-h-[500px] md:grid-cols-12',
      )}
    >
      <div className="z-10 flex flex-col items-start gap-stack-lg md:col-span-8">
        <div className="flex flex-col gap-stack-sm">
          <h1 className="text-display-lg-mobile font-display-lg-mobile leading-tight tracking-tight text-on-background md:text-display-lg md:font-display-lg">
            React Native Developer.
          </h1>
          <p className="mt-4 max-w-2xl text-body-lg font-body-lg leading-relaxed text-secondary md:text-headline-md md:font-headline-md">
            Engineering precise, fluid mobile experiences. 3 years shipping technical solutions in Fintech, Health
            Tech, and large-scale Cataloging.
          </p>
        </div>
        <a
          href="#work"
          className="mt-4 inline-flex items-center gap-2 rounded font-mono-label text-mono-label uppercase tracking-wide bg-tertiary px-8 py-4 text-on-tertiary shadow-sm transition-colors hover:bg-tertiary/90"
        >
          View Work
          <Icon name="arrow_downward" className="text-sm" />
        </a>
      </div>
      <div className="relative hidden h-full md:col-span-4 md:block">
        <div className="absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 border-b border-l border-on-surface/10 opacity-50" />
      </div>
    </section>
  )
}

function CompetencySection() {
  const [ref, visible] = useReveal()
  return (
    <section ref={ref} id="about" className={revealClass(visible, 'grid scroll-mt-24 grid-cols-1 gap-gutter md:grid-cols-12')}>
      <div className="md:col-span-4 md:col-start-2">
        <h2 className="mb-stack-md border-b border-on-surface/10 pb-4 text-headline-md font-headline-md text-on-background">
          Core Competency
        </h2>
      </div>
      <div className="flex flex-col gap-stack-md md:col-span-6">
        <p className="text-body-md font-body-md leading-relaxed text-on-surface-variant">
          Focused on bridging the gap between native performance and cross-platform velocity. My approach centers on
          predictable state management, strict typing, and deep integration with native modules when performance
          demands it.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="rounded border border-on-surface/10 bg-surface-container-low px-3 py-1 text-mono-sm font-mono-sm text-on-surface"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }) {
  const [ref, visible] = useReveal()
  const imageFirst = index % 2 === 1

  return (
    <article ref={ref} className={revealClass(visible, 'group grid grid-cols-1 gap-gutter md:grid-cols-12')}>
      <div
        className={`z-10 flex flex-col justify-center gap-stack-md pt-4 md:col-span-5 md:pt-0 ${
          imageFirst ? 'order-2 md:order-2 md:col-start-8' : 'order-2 md:order-1 md:col-start-1'
        }`}
      >
        <div className="mb-2 flex items-center gap-3">
          <span className="text-mono-sm font-mono-sm uppercase tracking-wider text-tertiary">{project.tag}</span>
          <div className="h-px w-8 bg-tertiary/30" />
        </div>
        <h3 className="text-headline-md font-headline-md text-on-background">{project.title}</h3>
        <p className="text-body-md font-body-md leading-relaxed text-secondary">{project.summary}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded bg-surface-container px-2 py-1 text-mono-label font-mono-label text-on-surface-variant">
              {tag}
            </span>
          ))}
        </div>
        <Link
          to={`/work/${project.slug}`}
          className="mt-2 inline-flex w-fit items-center gap-2 text-mono-label font-mono-label text-tertiary underline underline-offset-4"
        >
          View case study
          <Icon name="arrow_forward" className="text-sm" />
        </Link>
      </div>
      <div
        className={`order-1 rounded-xl border border-whisper bg-surface-container-lowest p-2 shadow-ambient transition-transform duration-500 group-hover:-translate-y-2 md:col-span-6 ${
          imageFirst ? 'md:order-1 md:col-start-1' : 'md:order-2 md:col-start-7'
        }`}
      >
        <ImagePlaceholder label={`${project.title} preview`} className="h-64 w-full rounded-lg md:h-80" />
      </div>
    </article>
  )
}

function WorkSection() {
  const [ref, visible] = useReveal()
  return (
    <section ref={ref} id="work" className={revealClass(visible, 'flex scroll-mt-24 flex-col gap-stack-lg')}>
      <div className="mb-8 border-b border-on-surface/10 pb-6">
        <h2 className="text-headline-md font-headline-md text-on-background">Selected Work</h2>
      </div>
      <div className="flex flex-col gap-12 md:gap-16">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}

export function Home() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-section-gap px-canvas-margin-mobile pb-section-gap pt-4 md:px-canvas-margin">
      <HeroSection />
      <CompetencySection />
      <WorkSection />
    </div>
  )
}
