import { Highlight, themes } from 'prism-react-renderer'
import { useState } from 'react'
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

function BodyBlock({ block }) {
  if (block.type === 'heading') {
    return <h2 className="mb-6 mt-12 text-headline-md font-headline-md text-on-background">{block.text}</h2>
  }
  if (block.type === 'subheading') {
    return <h3 className="mb-3 mt-8 text-body-lg font-headline-md font-bold text-on-background">{block.text}</h3>
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
