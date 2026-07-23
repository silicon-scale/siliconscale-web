'use client'

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { BlogTags, blogTagsCss } from '@/components/blog/BlogTags'
import { formatPostDate, listPublishedPosts } from '@/lib/blog-api'
import { resolveMediaUrl } from '@/lib/media-url'
import type { Post } from '@/types/post'

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

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

  return (
    <section className="blog-page relative bg-page text-white" aria-labelledby="blog-heading">
      <style>{`
        .blog-page {
          padding: 7.5rem 0 5rem;
          font-family: 'Open Sans', system-ui, sans-serif;
        }
        .blog-shell {
          max-width: 1120px;
          margin-inline: auto;
          padding-inline: 1.25rem;
        }
        @media (min-width: 768px) {
          .blog-shell { padding-inline: 1.5rem; }
        }
        @media (min-width: 1024px) {
          .blog-shell { padding-inline: 2.5rem; }
        }
        .blog-header {
          max-width: 40rem;
          margin-bottom: clamp(2.5rem, 6vw, 3.75rem);
        }
        .blog-header h1 {
          margin-top: 0.75rem;
          font-family: 'Bagel Fat One', cursive;
          font-size: clamp(2.35rem, 6vw, 3.6rem);
          letter-spacing: -0.02em;
          line-height: 1.05;
          color: var(--brand-gold);
        }
        .blog-header p {
          margin-top: 1rem;
          max-width: 34rem;
          font-size: clamp(0.95rem, 2.2vw, 1.05rem);
          line-height: 1.65;
          color: rgba(255,255,255,0.62);
        }
        .blog-grid {
          display: grid;
          gap: clamp(1.75rem, 4vw, 2.5rem);
        }
        @media (min-width: 768px) {
          .blog-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 2rem 1.75rem;
          }
        }
        @media (min-width: 1440px) {
          .blog-grid {
            gap: 2.5rem 2rem;
          }
        }
        .blog-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          border-radius: 8px;
          outline: none;
          transition: transform 0.22s ease, opacity 0.22s ease;
        }
        .blog-card:hover {
          transform: translateY(-2px);
        }
        .blog-card:focus-visible {
          outline: 2px solid var(--focus-ring, var(--brand-gold));
          outline-offset: 4px;
        }
        @media (prefers-reduced-motion: reduce) {
          .blog-card,
          .blog-card:hover {
            transition: none;
            transform: none;
          }
        }
        .blog-card-media {
          position: relative;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          border-radius: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .blog-card-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .blog-card-media-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          font-family: 'Bagel Fat One', cursive;
          font-size: 1.5rem;
          color: rgba(255,255,255,0.18);
          letter-spacing: 0.04em;
        }
        .blog-card-body {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          padding-top: 1.1rem;
        }
        .blog-card-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.45rem 0.75rem;
          font-size: 0.75rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }
        .blog-card-meta span + span::before {
          content: '·';
          margin-right: 0.75rem;
          color: rgba(255,255,255,0.28);
        }
        .blog-card-title {
          font-family: 'Bagel Fat One', cursive;
          font-size: clamp(1.35rem, 3vw, 1.7rem);
          line-height: 1.2;
          letter-spacing: -0.01em;
          color: #fff;
        }
        .blog-card:hover .blog-card-title {
          color: var(--brand-gold);
        }
        .blog-card-excerpt {
          font-size: 0.95rem;
          line-height: 1.65;
          color: rgba(255,255,255,0.58);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .blog-card-body .blog-tags {
          margin-top: 0.15rem;
        }
        ${blogTagsCss}
        .blog-empty,
        .blog-status,
        .blog-error {
          padding: 3rem 0;
          text-align: center;
          color: rgba(255,255,255,0.55);
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .blog-error {
          color: rgb(252 165 165);
          display: grid;
          gap: 0.75rem;
          justify-items: center;
        }
        .blog-retry {
          min-height: 2.75rem;
          padding: 0 1rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(255,255,255,0.18);
          background: transparent;
          color: rgba(255,255,255,0.85);
          font-size: 0.875rem;
          cursor: pointer;
        }
        .blog-retry:hover {
          border-color: rgba(255,255,255,0.35);
          color: #fff;
        }
      `}</style>

      <div className="blog-shell">
        <ScrollReveal className="blog-header">
          <SectionEyebrow>Journal</SectionEyebrow>
          <h1 id="blog-heading">Blog</h1>
          <p>
            Notes on systems, Shopify builds, and AI agents — written for operators who care
            about how things actually ship.
          </p>
        </ScrollReveal>

        {loading ? (
          <p className="blog-status" role="status">
            Loading posts…
          </p>
        ) : error ? (
          <div className="blog-error" role="alert">
            <p>{error}</p>
            <button
              type="button"
              className="blog-retry"
              onClick={() => setRetryKey((n) => n + 1)}
            >
              Try again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="blog-empty">
            <p>No published posts yet. Check back soon.</p>
          </div>
        ) : (
          <ul className="blog-grid" role="list">
            {posts.map((post, index) => (
              <li key={post.id}>
                <ScrollReveal staggerIndex={Math.min(index, 5)}>
                  <BlogPostCard post={post} />
                </ScrollReveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function BlogPostCard({ post }: { post: Post }) {
  const dateLabel = formatPostDate(post.published_at ?? post.created_at)
  const reading =
    post.reading_time_minutes === 1
      ? '1 min read'
      : `${post.reading_time_minutes} min read`

  return (
    <Link to={`/blog/${post.slug}`} className="blog-card">
      <div className="blog-card-media">
        {post.cover_image_url ? (
          <img
            src={resolveMediaUrl(post.cover_image_url)}
            alt={post.title}
            loading="lazy"
            decoding="async"
            width={640}
            height={400}
          />
        ) : (
          <div className="blog-card-media-fallback" aria-hidden>
            SS
          </div>
        )}
      </div>
      <div className="blog-card-body">
        <div className="blog-card-meta">
          {dateLabel ? <span>{dateLabel}</span> : null}
          <span>{reading}</span>
        </div>
        <h2 className="blog-card-title">{post.title}</h2>
        {post.excerpt ? <p className="blog-card-excerpt">{post.excerpt}</p> : null}
        <BlogTags tags={post.tags} limit={4} />
      </div>
    </Link>
  )
}
