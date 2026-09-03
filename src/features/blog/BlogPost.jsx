import { Highlight, themes } from 'prism-react-renderer'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Icon } from '../../components/ui/Icon'
import { ImagePlaceholder } from '../../components/ui/ImagePlaceholder'
import { SITE } from '../../config/site'
import { getPostBySlug } from './posts'

const EXTENSION_LANGUAGES = {
  tsx: 'tsx',
  ts: 'typescript',
  jsx: 'jsx',
  js: 'javascript',
  mjs: 'javascript',
  kt: 'kotlin',
  kts: 'kotlin',
  swift: 'swift',
  m: 'objectivec',
  mm: 'objectivec',
  cpp: 'cpp',
  cc: 'cpp',
  c: 'c',
  xml: 'markup',
  plist: 'markup',
  yml: 'yaml',
  yaml: 'yaml',
  json: 'json',
  py: 'python',
  sql: 'sql',
  go: 'go',
  md: 'markdown',
}

function detectLanguage(filename = '') {
  const extension = filename.trim().split(/[\s(/]/).pop()?.split('.').pop()?.toLowerCase()
  return EXTENSION_LANGUAGES[extension] || 'plain'
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
}

// Builds a nested table of contents (heading > subheading) from a post's
// body blocks, and returns a matching per-block id list so headings and
// TOC links can be wired to the same anchors.
function buildToc(body) {
  const usedSlugs = new Map()
  const ids = []
  const toc = []
  let currentSection = null

  body.forEach((block, index) => {
    if (block.type !== 'heading' && block.type !== 'subheading') {
      ids.push(null)
      return
    }

    const base = slugify(block.text) || `section-${index}`
    const seen = usedSlugs.get(base) || 0
    usedSlugs.set(base, seen + 1)
    const id = seen === 0 ? base : `${base}-${seen}`
    ids.push(id)

    if (block.type === 'heading') {
      currentSection = { id, text: block.text, children: [] }
      toc.push(currentSection)
    } else if (currentSection) {
      currentSection.children.push({ id, text: block.text })
    } else {
      toc.push({ id, text: block.text, children: [] })
    }
  })

  return { toc, ids }
}

function CodeWindow({ filename, code, lang }) {
  const language = lang || detectLanguage(filename)
  const lines = code.trim().split('\n')
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard access unavailable — silently ignore
    }
  }

  return (
    <div className="my-12 overflow-hidden rounded-xl border border-black/40 shadow-ambient">
      <div className="flex items-center gap-3 bg-[#323233] px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        </div>
        {filename ? (
          <span className="text-mono-sm font-mono-sm text-white/60">{filename}</span>
        ) : null}
        <button
          type="button"
          onClick={handleCopy}
          className="ml-auto flex items-center gap-1.5 rounded px-2 py-1 text-mono-sm font-mono-sm text-white/50 transition-colors hover:bg-white/10 hover:text-white/90"
        >
          <Icon name={copied ? 'check' : 'content_copy'} className="text-[16px]" />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <Highlight theme={themes.vsDark} code={lines.join('\n')} language={language}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <div className="flex bg-[#1e1e1e]">
            <div className="select-none border-r border-white/10 py-4 pl-4 pr-3 text-right text-mono-sm font-mono-sm leading-relaxed text-white/25">
              {tokens.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <pre className="min-w-0 flex-1 overflow-x-auto py-4 pl-4 pr-6 text-mono-sm font-mono-sm leading-relaxed">
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.length === 0
                    ? ' '
                    : line.map((token, key) => <span key={key} {...getTokenProps({ token })} />)}
                </div>
              ))}
            </pre>
          </div>
        )}
      </Highlight>
    </div>
  )
}

function BodyBlock({ block, id }) {
  if (block.type === 'heading') {
    return (
      <h2 id={id} className="mb-6 mt-12 scroll-mt-28 text-headline-md font-headline-md text-on-background">
        {block.text}
      </h2>
    )
  }
  if (block.type === 'subheading') {
    return (
      <h3 id={id} className="mb-3 mt-8 scroll-mt-28 text-body-lg font-headline-md font-bold text-on-background">
        {block.text}
      </h3>
    )
  }
  if (block.type === 'code') {
    return <CodeWindow filename={block.filename} code={block.code} lang={block.lang} />
  }
  if (block.type === 'list') {
    const ListTag = block.ordered ? 'ol' : 'ul'
    return (
      <ListTag className={`space-y-2 pl-6 text-body-md font-body-md leading-relaxed text-on-background/80 ${block.ordered ? 'list-decimal' : 'list-disc'}`}>
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ListTag>
    )
  }
  if (block.type === 'note') {
    return (
      <div className="rounded-xl border border-tertiary/30 bg-tertiary-container px-6 py-5">
        <p className="mb-1 text-mono-sm font-mono-sm uppercase tracking-wide text-tertiary">{block.label || 'Note'}</p>
        <p className="text-body-md font-body-md leading-relaxed text-on-tertiary-container">{block.text}</p>
      </div>
    )
  }
  if (block.type === 'image') {
    return (
      <figure className="my-10">
        <img
          src={block.src}
          alt={block.alt}
          className="w-full rounded-xl border border-outline-variant/20 shadow-ambient"
          loading="lazy"
        />
        {block.caption ? (
          <figcaption className="mt-3 text-center text-mono-sm font-mono-sm text-secondary">{block.caption}</figcaption>
        ) : null}
      </figure>
    )
  }
  if (block.type === 'table') {
    return (
      <div className="my-8 overflow-x-auto rounded-xl border border-outline-variant/20 shadow-ambient">
        <table className="w-full border-collapse text-body-md">
          <thead>
            <tr className="bg-surface-container-low">
              {block.headers.map((h, i) => (
                <th key={i} className="border-b border-outline-variant/20 px-4 py-3 text-left font-mono-label text-mono-label uppercase tracking-wide text-secondary">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i} className="border-b border-outline-variant/10 last:border-b-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 align-top text-on-background/80">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  return <p className="text-body-md font-body-md leading-relaxed text-on-background/80">{block.text}</p>
}

// Flattens the nested (heading > subheading) toc into a single list carrying
// each item's nesting depth, since the Notion-style minimap renders every
// entry as one dash in document order rather than an indented tree.
function flattenToc(toc) {
  return toc.flatMap((item) => [
    { id: item.id, text: item.text, level: 0 },
    ...item.children.map((child) => ({ id: child.id, text: child.text, level: 1 })),
  ])
}

// A Notion-style document outline: collapsed to short dashes (one per
// heading, day headings a touch longer than questions) so it reads as a
// minimap of the page; hovering the rail expands every dash into its full
// heading text without shifting the page layout.
function TableOfContents({ toc, activeId }) {
  const items = useMemo(() => flattenToc(toc), [toc])

  return (
    <nav
      aria-label="Table of contents"
      className="group/toc fixed right-6 top-1/2 hidden max-h-[70vh] w-64 -translate-y-1/2 overflow-y-auto overflow-x-hidden py-2 lg:block xl:right-10 xl:w-72"
    >
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => {
          const isActive = activeId === item.id
          return (
            <li key={item.id}>
              <a href={`#${item.id}`} title={item.text} className="flex items-center justify-end gap-3 py-px">
                <span
                  className={`max-w-0 truncate text-right text-mono-sm font-mono-sm opacity-0 transition-[max-width,opacity] duration-200 group-hover/toc:max-w-[230px] group-hover/toc:opacity-100 ${
                    isActive ? 'text-tertiary' : 'text-secondary'
                  }`}
                >
                  {item.text}
                </span>
                <span
                  className={`shrink-0 rounded-full transition-all duration-200 ${
                    isActive
                      ? `bg-tertiary ${item.level === 0 ? 'h-[3px] w-8' : 'h-[3px] w-5'}`
                      : `bg-outline-variant ${item.level === 0 ? 'h-[2px] w-7' : 'h-[2px] w-4'}`
                  }`}
                />
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function BlogPost() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) return <Navigate to="/blog" replace />

  // Keyed by slug so navigating between posts (prev/next) remounts this and
  // resets the table-of-contents scroll-spy state instead of carrying the
  // previous post's active heading over.
  return <BlogPostContent key={slug} post={post} />
}

function BlogPostContent({ post }) {
  const articleRef = useRef(null)
  const [activeId, setActiveId] = useState(null)

  const { toc, ids } = useMemo(() => buildToc(post.body), [post])

  useEffect(() => {
    const container = articleRef.current
    if (!container || toc.length === 0) return

    const headingEls = container.querySelectorAll('h2[id], h3[id]')
    if (headingEls.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-112px 0px -70% 0px', threshold: 0 },
    )
    headingEls.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [toc])

  return (
    <div className="mx-auto w-full max-w-4xl px-canvas-margin-mobile py-16 md:max-w-5xl md:px-canvas-margin md:py-24 lg:max-w-[min(60rem,calc(100vw-37rem))] lg:px-0 xl:max-w-[min(66rem,calc(100vw-43rem))]">
      <Link
        to="/blog"
        className="group mb-stack-lg inline-flex items-center gap-2 font-headline-md text-headline-md font-bold text-on-surface"
      >
        <Icon name="arrow_back" className="text-tertiary transition-transform group-hover:-translate-x-1" />
        Blog
      </Link>

      <article ref={articleRef} className="mb-section-gap">
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
            <BodyBlock key={index} block={block} id={ids[index]} />
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
        {post.prevSlug ? <PostLink slug={post.prevSlug} label="Previous Article" /> : <span />}
        {post.nextSlug ? <PostLink slug={post.nextSlug} label="Next Article" align="right" /> : <span />}
      </nav>

      {toc.length > 0 ? <TableOfContents toc={toc} activeId={activeId} /> : null}
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
