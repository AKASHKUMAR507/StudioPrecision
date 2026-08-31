import { Link, Navigate, useParams } from 'react-router-dom'
import { Icon } from '../../components/ui/Icon'
import { ImagePlaceholder } from '../../components/ui/ImagePlaceholder'
import { getProjectBySlug } from './projects'

export function WorkDetail() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)

  if (!project) return <Navigate to="/" replace />

  const next = getProjectBySlug(project.next)

  return (
    <div className="mx-auto w-full max-w-[1440px] px-canvas-margin-mobile pb-section-gap pt-12 md:px-canvas-margin">
      <Link to="/#work" className="group mb-stack-lg inline-flex items-center gap-2 font-headline-md text-headline-md font-bold text-on-surface">
        <Icon name="arrow_back" className="text-tertiary transition-transform group-hover:-translate-x-1" />
        Work
      </Link>

      <section className="mb-section-gap grid grid-cols-12 items-center gap-gutter">
        <div className="col-span-12 flex flex-col gap-stack-md md:col-span-5 md:col-start-2">
          <span className="w-fit rounded border border-whisper bg-surface-container-low px-3 py-1 text-mono-sm font-mono-sm text-on-surface-variant">
            {project.hero.badge}
          </span>
          <h1 className="text-display-lg-mobile font-display-lg-mobile text-on-surface md:text-display-lg md:font-display-lg">
            {project.title}
          </h1>
          <p className="mt-stack-sm max-w-md text-body-lg font-body-lg text-on-surface-variant">
            {project.hero.description}
          </p>
          {project.hero.liveUrl ? (
            <a
              href={project.hero.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-stack-md inline-flex w-fit items-center gap-2 rounded bg-tertiary px-6 py-3 font-mono-label text-mono-label text-on-tertiary transition-colors hover:bg-tertiary/90 active:translate-y-px"
            >
              View Live App
              <Icon name="open_in_new" className="text-[18px]" />
            </a>
          ) : null}
        </div>
        <div className="relative col-span-12 mt-stack-lg md:col-span-6 md:mt-0">
          {project.hero.image ? (
            <img
              src={project.hero.image}
              alt={`${project.title} preview`}
              className="mx-auto w-full max-w-[480px] rounded-2xl border border-whisper shadow-ambient"
            />
          ) : (
            <div className="mx-auto aspect-[9/19] w-full max-w-[320px] overflow-hidden rounded-[3rem] border border-whisper bg-surface-container-lowest p-4 shadow-ambient">
              <ImagePlaceholder label={`${project.title} app screen`} className="h-full w-full rounded-[2.5rem]" />
            </div>
          )}
        </div>
      </section>

      <section className="mb-section-gap grid grid-cols-12 gap-gutter">
        <div className="col-span-12 md:col-span-10 md:col-start-2">
          <h2 className="mb-stack-lg text-headline-md font-headline-md text-on-surface">The Challenge</h2>
        </div>
        <div className="col-span-12 flex flex-col gap-stack-md rounded-2xl border border-whisper bg-surface-container-lowest p-8 shadow-ambient md:col-span-4 md:col-start-2">
          <Icon name="warning" className="text-[32px] text-tertiary" />
          <h3 className="text-body-lg font-body-lg font-bold text-on-surface">{project.challenge.title}</h3>
          <p className="text-body-md font-body-md text-on-surface-variant">{project.challenge.description}</p>
        </div>
        <div className="relative col-span-12 flex flex-col gap-stack-md overflow-hidden rounded-2xl border border-whisper bg-surface-container-lowest p-8 shadow-ambient md:col-span-6">
          <Icon name="lightbulb" className="text-[32px] text-tertiary" />
          <h3 className="text-body-lg font-body-lg font-bold text-on-surface">{project.solution.title}</h3>
          <p className="text-body-md font-body-md text-on-surface-variant">{project.solution.description}</p>
        </div>
      </section>

      {project.modules?.length ? (
        <section className="mb-section-gap grid grid-cols-12 gap-gutter">
          <div className="col-span-12 md:col-span-10 md:col-start-2">
            <h2 className="mb-stack-lg text-headline-md font-headline-md text-on-surface">How It's Built</h2>
          </div>
          <div className="col-span-12 grid grid-cols-1 gap-gutter sm:grid-cols-2 md:col-span-10 md:col-start-2 md:grid-cols-3">
            {project.modules.map((module) => (
              <div
                key={module.name}
                className="flex flex-col gap-stack-sm rounded-2xl border border-whisper bg-surface-container-lowest p-6 shadow-ambient"
              >
                <h3 className="text-body-lg font-body-lg font-bold text-on-surface">{module.name}</h3>
                <p className="text-body-md font-body-md text-on-surface-variant">{module.description}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {project.companionApp ? (
        <section className="mb-section-gap grid grid-cols-12 gap-gutter">
          <div className="col-span-12 flex flex-col gap-stack-md rounded-2xl border border-whisper bg-surface-container-lowest p-8 shadow-ambient md:col-span-10 md:col-start-2">
            <span className="w-fit rounded border border-whisper bg-surface-container-low px-3 py-1 text-mono-sm font-mono-sm text-on-surface-variant">
              COMPANION APP
            </span>
            <h2 className="text-headline-md font-headline-md text-on-surface">{project.companionApp.title}</h2>
            <p className="max-w-3xl text-body-md font-body-md text-on-surface-variant">{project.companionApp.description}</p>
            {project.companionApp.features?.length ? (
              <div className="mt-stack-sm grid grid-cols-1 gap-stack-md border-t border-outline-variant/20 pt-stack-md sm:grid-cols-2 md:grid-cols-3">
                {project.companionApp.features.map((feature) => (
                  <div key={feature.name}>
                    <h3 className="text-body-md font-body-md font-bold text-on-surface">{feature.name}</h3>
                    <p className="mt-1 text-mono-sm font-mono-sm text-on-surface-variant">{feature.description}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="mb-section-gap grid grid-cols-12 gap-gutter">
        <div className="col-span-12 md:col-span-3 md:col-start-2">
          <h2 className="text-headline-md font-headline-md text-on-surface">Tech Stack</h2>
          <p className="mt-stack-sm text-body-md font-body-md text-on-surface-variant">
            Built for cross-platform performance and strict security compliance.
          </p>
        </div>
        <div className="col-span-12 mt-stack-md flex flex-col border-t border-outline-variant/20 md:col-span-7 md:mt-0">
          {project.stack.map((item) => (
            <div
              key={item.name}
              className="group flex items-center justify-between border-b border-outline-variant/20 px-2 py-4 transition-colors hover:bg-surface-container/30"
            >
              <span className="text-body-lg font-body-lg text-on-surface transition-colors group-hover:text-tertiary">
                {item.name}
              </span>
              <span className="text-mono-sm font-mono-sm text-on-surface-variant">{item.role}</span>
            </div>
          ))}
        </div>
      </section>

      {project.screenshots?.length ? (
        <section className="mb-section-gap">
          <div className="mb-stack-lg text-center">
            <h2 className="text-headline-md font-headline-md text-on-surface">In the App</h2>
          </div>
          <div className="flex gap-gutter overflow-x-auto pb-4 md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
            {project.screenshots.map((shot) => (
              <div
                key={shot.src}
                className="w-56 flex-none overflow-hidden rounded-2xl border border-whisper shadow-ambient md:w-full"
              >
                <img src={shot.src} alt={shot.alt} className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {project.metrics?.length ? (
        <section className="mx-auto mb-section-gap max-w-6xl rounded-[2rem] border border-whisper bg-surface-container-lowest p-8 shadow-ambient md:p-12">
          <div className="mb-stack-lg text-center">
            <h2 className="text-headline-md font-headline-md text-on-surface">Key Outcomes</h2>
          </div>
          <div className="grid grid-cols-1 gap-stack-lg divide-y divide-outline-variant/20 text-center md:grid-cols-3 md:divide-x md:divide-y-0">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="flex flex-col items-center justify-center py-4 md:py-0">
                <span className="text-display-lg-mobile font-display-lg-mobile font-bold tracking-tight text-tertiary md:text-display-lg md:font-display-lg">
                  {metric.value}
                </span>
                <span className="mt-2 text-mono-sm font-mono-sm uppercase tracking-widest text-on-surface-variant">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {next ? (
        <section className="mt-section-gap flex flex-col items-center justify-center border-t border-outline-variant/20 pt-stack-lg text-center">
          <span className="mb-stack-sm text-mono-sm font-mono-sm text-on-surface-variant">Next Project</span>
          <Link
            to={`/work/${next.slug}`}
            className="group flex items-center gap-4 text-display-lg-mobile font-display-lg-mobile text-on-surface transition-colors hover:text-tertiary"
          >
            {next.title}
            <Icon name="arrow_forward" className="text-[40px] opacity-0 transition-all group-hover:translate-x-2 group-hover:opacity-100" />
          </Link>
        </section>
      ) : null}
    </div>
  )
}
