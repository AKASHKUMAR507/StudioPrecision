import { Link, Navigate, useParams } from 'react-router-dom'
import { Icon } from '../../components/ui/Icon'
import { ImagePlaceholder } from '../../components/ui/ImagePlaceholder'
import { SITE } from '../../config/site'
import { getPostBySlug } from './posts'

function BodyBlock({ block }) {
  if (block.type === 'heading') {
    return <h2 className="mb-6 mt-12 text-headline-md font-headline-md text-on-background">{block.text}</h2>
  }
  if (block.type === 'code') {
    return (
      <div className="my-12 overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low shadow-ambient">
        <div className="flex items-center border-b border-outline-variant/20 bg-surface-container-lowest px-4 py-3">
          <span className="text-mono-sm font-mono-sm text-secondary">{block.filename}</span>
        </div>
        <pre className="overflow-x-auto p-6">
          <code className="text-mono-sm font-mono-sm leading-relaxed text-on-surface-variant">{block.code}</code>
        </pre>
      </div>
    )
  }
  return <p className="text-body-md font-body-md leading-relaxed text-on-background/80">{block.text}</p>
}

export function BlogPost() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) return <Navigate to="/blog" replace />

  return (
    <div className="mx-auto w-full max-w-4xl px-canvas-margin-mobile py-16 md:px-canvas-margin md:py-24">
      <Link
        to="/blog"
        className="group mb-stack-lg inline-flex items-center gap-2 font-headline-md text-headline-md font-bold text-on-surface"
      >
        <Icon name="arrow_back" className="text-tertiary transition-transform group-hover:-translate-x-1" />
        Blog
      </Link>

      <article className="mb-section-gap">
        <header className="mb-12">
          <div className="mb-6">
            <span className="inline-flex items-center rounded border border-outline-variant/20 bg-surface-container-low px-3 py-1 text-mono-sm font-mono-sm text-on-surface-variant">
              {post.tags[0]}
            </span>
          </div>
          <h1 className="mb-8 text-display-lg-mobile font-display-lg-mobile tracking-tight text-on-background md:text-display-lg md:font-display-lg">
            {post.title}
          </h1>
          <div className="flex items-center gap-6 border-b border-outline-variant/30 py-4 text-mono-label font-mono-label text-secondary">
            <time dateTime={post.date}>{post.dateLabel}</time>
            <span className="h-1 w-1 rounded-full bg-outline-variant" />
            <span>{post.readTime}</span>
          </div>
        </header>

        <div className="space-y-8">
          {post.body.map((block, index) => (
            <BodyBlock key={index} block={block} />
          ))}
        </div>

        <div className="mt-20 flex flex-col items-start gap-6 border-t border-outline-variant/30 pt-8 md:flex-row md:items-center">
          {SITE.author.avatarSrc ? (
            <img
              src={SITE.author.avatarSrc}
              alt={SITE.author.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <ImagePlaceholder label="Author portrait" icon="person" className="h-16 w-16 rounded-full" />
          )}
          <div>
            <h3 className="text-body-lg font-headline-md font-medium text-on-background">
              Written by {SITE.author.name}
            </h3>
            <p className="mt-1 text-body-md font-body-md text-secondary">{SITE.author.title}</p>
          </div>
        </div>
      </article>

      <nav className="grid grid-cols-1 gap-8 border-t border-outline-variant/20 pt-12 md:grid-cols-2">
        {post.prevSlug ? (
          <PostLink slug={post.prevSlug} label="Previous Article" />
        ) : (
          <span />
        )}
        {post.nextSlug ? (
          <PostLink slug={post.nextSlug} label="Next Article" align="right" />
        ) : (
          <span />
        )}
      </nav>
    </div>
  )
}

function PostLink({ slug, label, align }) {
  const target = getPostBySlug(slug)
  if (!target) return null
  return (
    <Link
      to={`/blog/${slug}`}
      className={`group flex flex-col gap-2 rounded-xl border border-outline-variant/10 bg-surface p-6 transition-colors duration-300 hover:bg-surface-container-low ${
        align === 'right' ? 'items-start text-left md:items-end md:text-right' : ''
      }`}
    >
      <span className="text-mono-label font-mono-label text-secondary transition-colors group-hover:text-tertiary">
        {label}
      </span>
      <span className="text-body-lg font-headline-md text-on-background">{target.title}</span>
    </Link>
  )
}
