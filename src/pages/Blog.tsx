'use client'

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Layers, Search } from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { ScrollRevealGroup } from '@/components/ui/ScrollRevealGroup'
import { PageHero } from '@/components/ui/PageHero'
import { listPublishedPosts } from '@/lib/blog-api'
import {
  formatJournalDate,
  formatRelativeTime,
  JOURNAL_AUTHOR,
  matchesJournalSearch,
  splitFeaturedAndArchive,
} from '@/lib/blog-journal'
import { resolveMediaUrl } from '@/lib/media-url'
import { FOCUS_RING } from '@/lib/focus'
import type { Post } from '@/types/post'

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    listPublishedPosts()
      .then((data) => {
        if (!cancelled) setPosts(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load posts')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [retryKey])

  const { featured, archive } = useMemo(() => splitFeaturedAndArchive(posts), [posts])

  const searching = query.trim().length > 0

  const visibleArchive = useMemo(() => {
    if (!searching) return archive
    return posts.filter((post) => matchesJournalSearch(post, query))
  }, [archive, posts, query, searching])

  return (
    <section className="journal-page relative bg-page text-white" aria-labelledby="blog-heading">
      <JournalStyles />

      <PageHero className="pt-[7.5rem]">
        <div className="journal-shell">
          <ScrollReveal className="journal-header">
            <p className="journal-eyebrow">Editorial</p>
            <h1 id="blog-heading" className="journal-title">
              The journal
            </h1>
            <p className="journal-lede">
              Engineering notes, product thinking, and lessons from building digital experiences.
            </p>
          </ScrollReveal>
        </div>
      </PageHero>

      <div className="journal-shell">
        {loading ? (
          <p className="journal-status" role="status">
            Loading posts…
          </p>
        ) : error ? (
          <div className="journal-error" role="alert">
            <p>{error}</p>
            <button
              type="button"
              className="journal-retry"
              onClick={() => setRetryKey((n) => n + 1)}
            >
              Try again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="journal-empty">
            <p>No published posts yet. Check back soon.</p>
          </div>
        ) : (
          <>
            {!searching && featured ? <FeaturedArticle post={featured} /> : null}

            <div className="journal-archive">
              <div className="journal-archive-bar">
                <ScrollReveal className="journal-archive-heading-wrap">
                  <h2 className="journal-archive-heading">
                    {searching ? 'Search results' : 'From the archive'}
                  </h2>
                </ScrollReveal>
                <ScrollReveal delay={0.06} className="journal-search-wrap">
                  <label htmlFor="journal-search" className="sr-only">
                    Search articles
                  </label>
                  <div className="journal-search">
                    <Search className="journal-search-icon" size={16} aria-hidden />
                    <input
                      id="journal-search"
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by title or topic..."
                      autoComplete="off"
                      className={FOCUS_RING}
                    />
                  </div>
                </ScrollReveal>
              </div>

              {visibleArchive.length === 0 ? (
                searching ? (
                  <p className="journal-empty journal-empty--inline">
                    No articles match “{query.trim()}”.
                  </p>
                ) : null
              ) : (
                <ul className="journal-grid" role="list">
                  {visibleArchive.map((post, index) => (
                    <li key={post.id}>
                      <ScrollReveal staggerIndex={Math.min(index, 5)}>
                        <ArchiveCard post={post} />
                      </ScrollReveal>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function FeaturedArticle({ post }: { post: Post }) {
  const dateLabel = formatJournalDate(post.published_at ?? post.created_at)
  const category = post.tags[0]?.trim() || 'Cover story'
  const reading =
    post.reading_time_minutes === 1
      ? '1 min read'
      : `${post.reading_time_minutes} min read`

  return (
    <Link to={`/blog/${post.slug}`} className={`journal-featured ${FOCUS_RING}`}>
      <div className="journal-featured-media">
        {post.cover_image_url ? (
          <img
            src={resolveMediaUrl(post.cover_image_url)}
            alt=""
            loading="eager"
            decoding="async"
            width={1400}
            height={900}
          />
        ) : (
          <div className="journal-featured-fallback" aria-hidden>
            SS
          </div>
        )}
      </div>

      {/* Each piece stagger-reveals on first view via one shared IO (CSS
          transform/opacity only — no per-frame JS, cheap even on low-end
          devices) instead of the whole card fading in as a single block. */}
      <ScrollRevealGroup className="journal-featured-copy">
        <span className="journal-cover-pill scroll-reveal-item">{category}</span>
        <h2 className="journal-featured-title scroll-reveal-item">{post.title}</h2>
        {post.excerpt ? (
          <p className="journal-featured-excerpt scroll-reveal-item">{post.excerpt}</p>
        ) : null}
        <div className="journal-featured-meta scroll-reveal-item">
          <AuthorMark />
          <span className="journal-meta-sep" aria-hidden>
            ·
          </span>
          {dateLabel ? <time dateTime={post.published_at ?? post.created_at}>{dateLabel}</time> : null}
          <span className="journal-meta-sep" aria-hidden>
            ·
          </span>
          <span>{reading}</span>
        </div>
      </ScrollRevealGroup>
    </Link>
  )
}

function ArchiveCard({ post }: { post: Post }) {
  const relativeTime = formatRelativeTime(post.published_at ?? post.created_at)
  const category = post.tags[0]?.trim()

  return (
    <Link to={`/blog/${post.slug}`} className={`journal-card ${FOCUS_RING}`}>
      <div className="journal-card-media">
        {post.cover_image_url ? (
          <img
            src={resolveMediaUrl(post.cover_image_url)}
            alt=""
            loading="lazy"
            decoding="async"
            width={720}
            height={480}
          />
        ) : (
          <div className="journal-card-fallback" aria-hidden>
            <div className="journal-card-fallback-grid" />
            <Layers size={32} strokeWidth={1.25} className="journal-card-fallback-icon" />
          </div>
        )}
        {category ? <span className="journal-card-tag">{category}</span> : null}
      </div>
      <div className="journal-card-body">
        {relativeTime ? (
          <span className="journal-card-time">
            <Clock size={13} strokeWidth={1.75} aria-hidden />
            <time dateTime={post.published_at ?? post.created_at}>{relativeTime}</time>
          </span>
        ) : null}
        <h3 className="journal-card-title">{post.title}</h3>
        {post.excerpt ? <p className="journal-card-excerpt">{post.excerpt}</p> : null}
      </div>
    </Link>
  )
}

function AuthorMark() {
  return (
    <span className="journal-author">
      <span className="journal-author-avatar" aria-hidden>
        {JOURNAL_AUTHOR.initials}
      </span>
      <span className="journal-author-name">{JOURNAL_AUTHOR.name}</span>
    </span>
  )
}

function JournalStyles() {
  return (
    <style>{`
      .journal-page {
        padding: 0 0 5.5rem;
        font-family: 'Open Sans', system-ui, sans-serif;
      }
      .journal-shell {
        max-width: 1180px;
        margin-inline: auto;
        padding-inline: 1.25rem;
      }
      @media (min-width: 768px) {
        .journal-shell { padding-inline: 1.75rem; }
      }
      @media (min-width: 1024px) {
        .journal-shell { padding-inline: 2.5rem; }
      }

      .journal-header {
        max-width: 38rem;
        margin-bottom: clamp(2.75rem, 7vw, 4.25rem);
      }
      .journal-eyebrow {
        margin: 0;
        font-family: 'DM Mono', ui-monospace, monospace;
        font-size: 0.7rem;
        font-weight: 400;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: var(--text-subtle);
      }
      .journal-title {
        margin: 0.85rem 0 0;
        font-family: 'Instrument Serif', Georgia, 'Times New Roman', serif;
        font-weight: 400;
        font-size: clamp(3rem, 8vw, 4.75rem);
        line-height: 1.02;
        letter-spacing: -0.02em;
        color: #fff;
      }
      .journal-lede {
        margin: 1.15rem 0 0;
        max-width: 32rem;
        font-size: clamp(0.95rem, 2vw, 1.05rem);
        line-height: 1.65;
        color: var(--text-muted);
      }

      /* ── Featured cover — the image IS the card, full-bleed; copy sits
         directly on top of it (no box/blur), readable via a plain gradient
         scrim behind it instead. ── */
      .journal-featured {
        display: block;
        position: relative;
        overflow: hidden;
        height: clamp(340px, 48vw, 560px);
        margin-bottom: clamp(3.5rem, 8vw, 5.5rem);
        border-radius: 28px;
        text-decoration: none;
        color: inherit;
        background: #f1f1f1;
        border: 1px solid rgba(0,0,0,0.06);
        box-shadow: 0 30px 70px rgba(0,0,0,0.35);
        transition: border-color 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .journal-featured:hover {
        border-color: rgba(0,0,0,0.14);
      }
      .journal-featured-media {
        position: absolute;
        inset: 0;
        overflow: hidden;
        background: #f1f1f1;
      }
      /* Plain dark gradient scrim (no blur) behind the copy — keeps the
         text legible over whatever the cover photo looks like without a
         visible frosted-glass box. */
      .journal-featured-media::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.32) 38%, transparent 68%);
        pointer-events: none;
      }
      .journal-featured-media img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transform: scale(1);
        transition:
          transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
          filter 0.5s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .journal-featured:hover .journal-featured-media img {
        transform: scale(1.02);
        filter: brightness(1.04);
      }
      .journal-featured-fallback {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-family: 'Instrument Serif', Georgia, serif;
        font-size: 2rem;
        color: rgba(0,0,0,0.15);
        letter-spacing: 0.06em;
        background: #f1f1f1;
      }
      .journal-featured-copy {
        position: absolute;
        left: clamp(1.75rem, 4vw, 2.75rem);
        right: clamp(1.75rem, 4vw, 2.75rem);
        bottom: clamp(1.5rem, 3.5vw, 2.5rem);
        z-index: 2;
        max-width: 34rem;
      }
      .journal-cover-pill {
        display: inline-flex;
        align-items: center;
        padding: 0.35rem 0.75rem;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.22);
        background: rgba(255,255,255,0.12);
        font-family: 'DM Mono', ui-monospace, monospace;
        font-size: 0.65rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.85);
      }
      .journal-featured-title {
        margin: 0.85rem 0 0;
        font-family: 'Instrument Serif', Georgia, 'Times New Roman', serif;
        font-weight: 400;
        font-size: clamp(1.6rem, 3.4vw, 2.4rem);
        line-height: 1.14;
        letter-spacing: -0.015em;
        color: #fff;
        transition: color 0.35s ease;
      }
      .journal-featured:hover .journal-featured-title {
        color: rgb(var(--brand-gold-rgb) / 1);
      }
      .journal-featured-excerpt {
        margin: 0.6rem 0 0;
        font-size: 0.9rem;
        line-height: 1.6;
        color: rgba(255,255,255,0.75);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .journal-featured-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.45rem;
        margin-top: 1rem;
        font-size: 0.8rem;
        color: rgba(255,255,255,0.65);
      }
      .journal-meta-sep {
        color: rgba(255,255,255,0.35);
      }

      /* ── Archive bar + search ── */
      .journal-archive {
        padding-top: 0.25rem;
      }
      .journal-archive-bar {
        display: flex;
        flex-direction: column;
        gap: 1.15rem;
        margin-bottom: clamp(1.75rem, 4vw, 2.5rem);
      }
      .journal-archive-heading-wrap { order: 2; }
      .journal-search-wrap { order: 1; width: 100%; }
      @media (min-width: 768px) {
        .journal-archive-bar {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .journal-archive-heading-wrap { order: 0; }
        .journal-search-wrap { order: 0; width: auto; }
      }
      .journal-archive-heading {
        margin: 0;
        font-family: 'Instrument Serif', Georgia, 'Times New Roman', serif;
        font-weight: 400;
        font-size: clamp(1.65rem, 3.5vw, 2.15rem);
        letter-spacing: -0.015em;
        line-height: 1.15;
        color: #fff;
      }
      .journal-search {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        width: 100%;
        max-width: none;
        margin-left: 0;
        padding: 0.7rem 1.05rem;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.035);
        transition: border-color 0.25s ease, background 0.25s ease;
      }
      @media (min-width: 768px) {
        .journal-search {
          max-width: 22rem;
          margin-left: auto;
        }
      }
      .journal-search:focus-within {
        border-color: rgba(255,255,255,0.22);
        background: rgba(255,255,255,0.05);
      }
      .journal-search-icon {
        flex-shrink: 0;
        color: rgba(255,255,255,0.4);
      }
      .journal-search input {
        width: 100%;
        border: 0;
        outline: none;
        background: transparent;
        color: rgba(255,255,255,0.88);
        font-family: 'Open Sans', system-ui, sans-serif;
        font-size: 0.875rem;
        line-height: 1.4;
      }
      .journal-search input::placeholder {
        color: rgba(255,255,255,0.38);
      }
      .journal-search input:focus {
        outline: none;
      }
      .journal-search input:focus-visible {
        outline: none;
      }

      /* ── Archive grid ── */
      .journal-grid {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: 1fr;
        gap: clamp(2rem, 5vw, 2.75rem) 1.5rem;
      }
      @media (min-width: 640px) {
        .journal-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (min-width: 1024px) {
        .journal-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 2.75rem 1.75rem;
        }
      }

      .journal-card {
        display: flex;
        flex-direction: column;
        height: 100%;
        text-decoration: none;
        color: inherit;
        border-radius: 12px;
        transition: opacity 0.35s ease;
      }
      .journal-card-media {
        position: relative;
        aspect-ratio: 3 / 2;
        overflow: hidden;
        border-radius: 14px;
        background: #141414;
        border: 1px solid rgba(255,255,255,0.07);
        transition: border-color 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .journal-card:hover .journal-card-media {
        border-color: rgba(255,255,255,0.14);
      }
      .journal-card-media img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transform: scale(1);
        transition:
          transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
          filter 0.45s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .journal-card:hover .journal-card-media img {
        transform: scale(1.02);
        filter: brightness(1.05);
      }
      /* Category pill floating over the top-right corner of the thumbnail. */
      .journal-card-tag {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        z-index: 1;
        display: inline-flex;
        align-items: center;
        padding: 0.3rem 0.65rem;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(10,10,10,0.65);
        backdrop-filter: blur(6px);
        font-family: 'DM Mono', ui-monospace, monospace;
        font-size: 0.6rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.75);
      }
      /* Fallback for posts without a cover image — dot grid + mark instead
         of a flat placeholder block. */
      .journal-card-fallback {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        min-height: 12rem;
        overflow: hidden;
        background: #141414;
      }
      .journal-card-fallback-grid {
        position: absolute;
        inset: 0;
        opacity: 0.5;
        background-image:
          linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px);
        background-size: 22px 22px;
        mask-image: radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 65%, transparent 100%);
        -webkit-mask-image: radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 65%, transparent 100%);
      }
      .journal-card-fallback-icon {
        position: relative;
        color: rgba(255,255,255,0.22);
      }
      .journal-card-body {
        display: flex;
        flex-direction: column;
        gap: 0.55rem;
        padding-top: 1.05rem;
        flex: 1;
      }
      .journal-card-time {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        font-family: 'DM Mono', ui-monospace, monospace;
        font-size: 0.7rem;
        letter-spacing: 0.06em;
        color: var(--text-subtle);
      }
      .journal-card-time svg {
        flex-shrink: 0;
        opacity: 0.7;
      }
      .journal-card-title {
        margin: 0;
        font-family: 'Instrument Serif', Georgia, 'Times New Roman', serif;
        font-weight: 400;
        font-size: clamp(1.25rem, 2.4vw, 1.45rem);
        line-height: 1.25;
        letter-spacing: -0.01em;
        color: #fff;
        transition: color 0.35s ease;
      }
      .journal-card:hover .journal-card-title {
        color: rgb(var(--brand-gold-rgb) / 0.95);
      }
      .journal-card-excerpt {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.6;
        color: var(--text-muted);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .journal-author {
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
      }
      .journal-author-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.55rem;
        height: 1.55rem;
        border-radius: 999px;
        background: rgb(var(--brand-gold-rgb) / 0.18);
        border: 1px solid rgb(var(--brand-gold-rgb) / 0.35);
        color: var(--brand-gold);
        font-family: 'DM Mono', ui-monospace, monospace;
        font-size: 0.55rem;
        letter-spacing: 0.04em;
      }
      .journal-author-name {
        font-size: 0.82rem;
        color: rgba(255,255,255,0.75);
      }

      .journal-empty,
      .journal-status,
      .journal-error {
        padding: 3rem 0;
        text-align: center;
        color: rgba(255,255,255,0.55);
        font-size: 0.95rem;
        line-height: 1.6;
      }
      .journal-empty--inline {
        padding: 2rem 0 1rem;
        text-align: left;
      }
      .journal-error {
        color: rgb(252 165 165);
        display: grid;
        gap: 0.75rem;
        justify-items: center;
      }
      .journal-retry {
        min-height: 2.75rem;
        padding: 0 1rem;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.18);
        background: transparent;
        color: rgba(255,255,255,0.85);
        font-size: 0.875rem;
        cursor: pointer;
      }
      .journal-retry:hover {
        border-color: rgba(255,255,255,0.35);
        color: #fff;
      }

      @media (prefers-reduced-motion: reduce) {
        .journal-featured,
        .journal-featured-media img,
        .journal-featured-title,
        .journal-card-media,
        .journal-card-media img,
        .journal-card-title,
        .journal-search {
          transition: none !important;
        }
        .journal-featured:hover .journal-featured-media img,
        .journal-card:hover .journal-card-media img {
          transform: none;
          filter: none;
        }
      }
    `}</style>
  )
}
