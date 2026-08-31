import { Link } from 'react-router-dom'
import { revealClass, useReveal } from '../../hooks/useReveal'
import { POSTS } from './posts'

function PostRow({ post }) {
  const [ref, visible] = useReveal()
  return (
    <article
      ref={ref}
      className={revealClass(
        visible,
        'group flex flex-col gap-stack-sm border-t border-whisper py-stack-lg transition-colors duration-500 hover:bg-surface-container-lowest/50',
      )}
    >
      <div className="mb-2 flex items-center gap-4 text-mono-sm font-mono-sm text-secondary">
        <time dateTime={post.date}>{post.dateLabel}</time>
        <span className="h-1 w-1 rounded-full bg-outline-variant" />
        <span>{post.readTime}</span>
      </div>
      <Link to={`/blog/${post.slug}`} className="block">
        <h2 className="relative inline-block text-headline-md font-headline-md text-on-background transition-colors duration-300 group-hover:text-tertiary">
          {post.title}
        </h2>
      </Link>
      <p className="mt-2 max-w-3xl text-body-md font-body-md leading-relaxed text-on-surface-variant">
        {post.excerpt}
      </p>
      <div className="mt-4 flex gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded border border-whisper bg-surface-container-lowest px-2 py-1 text-mono-sm font-mono-sm text-secondary">
            {tag}
          </span>
        ))}
      </div>
    </article>
  )
}

const SORTED_POSTS = [...POSTS].sort((a, b) => new Date(b.date) - new Date(a.date))

export function BlogList() {
  return (
    <div className="mx-auto w-full max-w-5xl px-canvas-margin-mobile py-section-gap md:px-canvas-margin">
      <header className="mb-section-gap">
        <h1 className="text-display-lg-mobile font-display-lg-mobile tracking-tight text-on-background md:text-display-lg md:font-display-lg">
          Writing &amp; Insights
        </h1>
        <p className="mt-stack-md max-w-2xl text-body-lg font-body-lg text-secondary">
          Thoughts, architecture patterns, and technical explorations in the React Native and mobile engineering
          ecosystem.
        </p>
      </header>
      <section className="flex flex-col">
        {SORTED_POSTS.map((post) => (
          <PostRow key={post.slug} post={post} />
        ))}
      </section>
    </div>
  )
}
