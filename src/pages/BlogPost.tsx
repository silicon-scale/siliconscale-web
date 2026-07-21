'use client'

import { marked } from 'marked'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  formatPostDate,
  getPublishedPost,
  getRelatedPosts,
  listPublishedPosts,
} from '@/lib/blog-api'
import { applyBlogPostDocumentSeo } from '@/lib/document-seo'
import { resolveMediaUrl } from '@/lib/media-url'
import type { Post } from '@/types/post'

marked.setOptions({ gfm: true, breaks: true })

function rewriteMarkdownMedia(markdown: string): string {
  return markdown.replace(
    /(!?\[[^\]]*]\()(https?:\/\/[^)\s]+\.private\.blob\.vercel-storage\.com\/[^)\s]+)(\))/g,
    (_match, open: string, url: string, close: string) =>
      `${open}${resolveMediaUrl(url)}${close}`,
  )
}

export default function BlogPost() {
  const { slug = '' } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [related, setRelated] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setNotFound(false)
    setPost(null)
    setRelated([])

    ;(async () => {
      try {
        const [fetched, all] = await Promise.all([
          getPublishedPost(slug),
          listPublishedPosts().catch(() => [] as Post[]),
        ])
        if (cancelled) return
        setPost(fetched)
        setRelated(getRelatedPosts(fetched, all, 3))
      } catch (err) {
        if (cancelled) return
        const status = (err as { status?: number })?.status
        if (status === 404) setNotFound(true)
        else setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [slug])

  useEffect(() => {
    if (!post) return
    return applyBlogPostDocumentSeo(post)
  }, [post])

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      if (scrollable <= 0) {
        setProgress(0)
        return
      }
      const next = Math.min(1, Math.max(0, window.scrollY / scrollable))
      setProgress(next)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [post?.id])

  const html = useMemo(() => {
    if (!post) return ''
    try {
      return marked.parse(rewriteMarkdownMedia(post.content || ''), {
        async: false,
      }) as string
    } catch {
      return '<p>Unable to render this post.</p>'
    }
  }, [post])

  if (loading) {
    return (
      <div className="blog-post-page bg-page text-white">
        <p className="blog-post-status" role="status">
          Loading article…
        </p>
        <BlogPostStyles />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="blog-post-page bg-page text-white">
        <div className="blog-post-shell blog-post-empty">
          <h1 className="blog-post-title">Post not found</h1>
          <p>This article doesn’t exist or isn’t published yet.</p>
          <Link to="/blog" className="blog-post-back">
            ← Back to Blog
          </Link>
        </div>
        <BlogPostStyles />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="blog-post-page bg-page text-white">
        <div className="blog-post-shell blog-post-empty">
          <p className="blog-post-error" role="alert">
            {error || 'Failed to load post'}
          </p>
          <Link to="/blog" className="blog-post-back">
            ← Back to Blog
          </Link>
        </div>
        <BlogPostStyles />
      </div>
    )
  }

  const dateLabel = formatPostDate(post.published_at ?? post.created_at)
  const reading =
    post.reading_time_minutes === 1
      ? '1 min read'
      : `${post.reading_time_minutes} min read`

  return (
    <article className="blog-post-page bg-page text-white" aria-labelledby="blog-post-title">
      <div
        className="blog-reading-progress"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden
      />

      <BlogPostStyles />

      <div className="blog-post-shell">
        <Link to="/blog" className="blog-post-back">
          ← Back to Blog
        </Link>

        <header className="blog-post-header">
          <div className="blog-post-meta">
            {dateLabel ? <span>{dateLabel}</span> : null}
            <span>{reading}</span>
          </div>
          <h1 id="blog-post-title" className="blog-post-title">
            {post.title}
          </h1>
          {post.excerpt ? <p className="blog-post-deck">{post.excerpt}</p> : null}
          {post.tags.length > 0 ? (
            <div className="blog-post-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="blog-post-tag">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        {post.cover_image_url ? (
          <figure className="blog-post-cover">
            <img
              src={resolveMediaUrl(post.cover_image_url)}
              alt=""
              width={1200}
              height={675}
              decoding="async"
            />
          </figure>
        ) : null}

        <div
          className="blog-post-prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {related.length > 0 ? (
          <aside className="blog-post-related" aria-labelledby="related-heading">
            <h2 id="related-heading">Keep reading</h2>
            <ul className="blog-post-related-list">
              {related.map((item) => (
                <li key={item.id}>
                  <Link to={`/blog/${item.slug}`} className="blog-post-related-card">
                    {item.cover_image_url ? (
                      <img
                        src={resolveMediaUrl(item.cover_image_url)}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width={320}
                        height={180}
                      />
                    ) : (
                      <div className="blog-post-related-fallback" aria-hidden>
                        SS
                      </div>
                    )}
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.excerpt}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>
    </article>
  )
}

function BlogPostStyles() {
  return (
    <style>{`
      .blog-post-page {
        position: relative;
        padding: 6.5rem 0 5rem;
        font-family: 'Open Sans', system-ui, sans-serif;
        min-height: 100vh;
      }
      .blog-reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        z-index: 210;
        background: var(--brand-gold);
        transform-origin: 0 50%;
        transform: scaleX(0);
        will-change: transform;
        pointer-events: none;
      }
      @media (prefers-reduced-motion: reduce) {
        .blog-reading-progress {
          will-change: auto;
          transition: none;
        }
      }
      .blog-post-shell {
        max-width: 720px;
        margin-inline: auto;
        padding-inline: 1.15rem;
      }
      @media (min-width: 768px) {
        .blog-post-shell {
          padding-inline: 1.5rem;
        }
      }
      .blog-post-back {
        display: inline-flex;
        min-height: 44px;
        align-items: center;
        margin-bottom: 1.75rem;
        color: rgba(255,255,255,0.5);
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.2s ease;
      }
      .blog-post-back:hover {
        color: rgba(255,255,255,0.85);
      }
      .blog-post-header {
        margin-bottom: 1.75rem;
      }
      .blog-post-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem 0.85rem;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.45);
      }
      .blog-post-meta span + span::before {
        content: '·';
        margin-right: 0.85rem;
        color: rgba(255,255,255,0.28);
      }
      .blog-post-title {
        margin-top: 0.85rem;
        font-family: 'Bagel Fat One', cursive;
        font-size: clamp(1.9rem, 6.5vw, 3.1rem);
        line-height: 1.12;
        letter-spacing: -0.02em;
        color: var(--brand-gold);
      }
      .blog-post-deck {
        margin-top: 1rem;
        font-size: clamp(1.05rem, 2.8vw, 1.2rem);
        line-height: 1.55;
        color: rgba(255,255,255,0.62);
      }
      .blog-post-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        margin-top: 1.15rem;
      }
      .blog-post-tag {
        font-size: 0.7rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.5);
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 999px;
        padding: 0.25rem 0.6rem;
      }
      .blog-post-cover {
        margin: 0 0 2rem;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.08);
        background: rgba(255,255,255,0.03);
      }
      .blog-post-cover img {
        display: block;
        width: 100%;
        height: auto;
        aspect-ratio: 16 / 9;
        object-fit: cover;
      }
      /* Comfortable reading measure (~650–700px) with larger body type */
      .blog-post-prose {
        max-width: 42rem; /* ~672px */
        font-size: 1.125rem; /* 18px mobile */
        line-height: 1.75;
        color: rgba(255,255,255,0.84);
      }
      @media (min-width: 768px) {
        .blog-post-prose {
          font-size: 1.25rem; /* 20px */
          line-height: 1.7;
        }
      }
      @media (max-width: 374px) {
        .blog-post-prose {
          font-size: 1.0625rem;
          line-height: 1.7;
        }
        .blog-post-title {
          font-size: 1.75rem;
        }
      }
      .blog-post-prose > *:first-child { margin-top: 0; }
      .blog-post-prose h1,
      .blog-post-prose h2,
      .blog-post-prose h3,
      .blog-post-prose h4 {
        font-family: 'Bagel Fat One', cursive;
        color: #fff;
        line-height: 1.2;
        margin: 2em 0 0.65em;
        letter-spacing: -0.015em;
      }
      .blog-post-prose h2 { font-size: 1.55em; color: var(--brand-gold); }
      .blog-post-prose h3 { font-size: 1.28em; }
      .blog-post-prose p { margin: 1.15em 0; }
      .blog-post-prose a {
        color: var(--brand-cream);
        text-decoration: underline;
        text-underline-offset: 3px;
      }
      .blog-post-prose strong { color: #fff; font-weight: 600; }
      .blog-post-prose em { font-style: italic; }
      .blog-post-prose ul,
      .blog-post-prose ol {
        margin: 1.1em 0;
        padding-left: 1.35em;
      }
      .blog-post-prose li { margin: 0.4em 0; }
      .blog-post-prose blockquote {
        margin: 1.75em 0;
        padding: 0.35em 0 0.35em 1.1em;
        border-left: 3px solid rgb(var(--brand-gold-rgb) / 0.65);
        color: rgba(255,255,255,0.78);
        font-size: 1.12em;
        line-height: 1.55;
      }
      .blog-post-prose code {
        font-family: 'DM Mono', ui-monospace, monospace;
        font-size: 0.86em;
        background: rgba(255,255,255,0.08);
        padding: 0.12em 0.4em;
        border-radius: 4px;
      }
      .blog-post-prose pre {
        overflow-x: auto;
        margin: 1.5em 0;
        padding: 1em 1.1em;
        border-radius: 8px;
        background: rgba(0,0,0,0.45);
        border: 1px solid rgba(255,255,255,0.08);
        max-width: 100%;
      }
      .blog-post-prose pre code {
        background: none;
        padding: 0;
        font-size: 0.82em;
      }
      .blog-post-prose img {
        display: block;
        max-width: min(100%, 52rem);
        width: 100%;
        height: auto;
        margin: 1.75em auto;
        border-radius: 8px;
      }
      .blog-post-prose figure {
        margin: 1.75em 0;
      }
      .blog-post-prose figcaption {
        margin-top: 0.55rem;
        text-align: center;
        font-size: 0.88em;
        color: rgba(255,255,255,0.45);
        line-height: 1.45;
      }
      .blog-post-prose hr {
        border: 0;
        border-top: 1px solid rgba(255,255,255,0.12);
        margin: 2.5em 0;
      }
      .blog-post-related {
        margin-top: 4rem;
        padding-top: 2.5rem;
        border-top: 1px solid rgba(255,255,255,0.1);
      }
      .blog-post-related h2 {
        font-family: 'Bagel Fat One', cursive;
        font-size: 1.6rem;
        color: var(--brand-gold);
        margin-bottom: 1.25rem;
      }
      .blog-post-related-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 1.25rem;
      }
      @media (min-width: 768px) {
        .blog-post-related-list {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
        }
      }
      .blog-post-related-card {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        text-decoration: none;
        color: inherit;
        border-radius: 8px;
        min-height: 44px;
      }
      .blog-post-related-card img,
      .blog-post-related-fallback {
        width: 100%;
        aspect-ratio: 16 / 10;
        object-fit: cover;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.08);
        background: rgba(255,255,255,0.04);
      }
      .blog-post-related-fallback {
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Bagel Fat One', cursive;
        color: rgba(255,255,255,0.18);
      }
      .blog-post-related-card h3 {
        font-family: 'Bagel Fat One', cursive;
        font-size: 1.05rem;
        line-height: 1.25;
        color: #fff;
      }
      .blog-post-related-card:hover h3 {
        color: var(--brand-gold);
      }
      .blog-post-related-card p {
        margin-top: 0.35rem;
        font-size: 0.88rem;
        line-height: 1.5;
        color: rgba(255,255,255,0.5);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .blog-post-status,
      .blog-post-empty {
        padding: 8rem 1.25rem 4rem;
        text-align: center;
        color: rgba(255,255,255,0.55);
      }
      .blog-post-error {
        color: rgb(252 165 165);
      }
    `}</style>
  )
}
