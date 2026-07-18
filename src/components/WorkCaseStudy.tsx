'use client'

import type { ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, CheckCircle2, Flag, Layers } from 'lucide-react'
import { OptimizedImage } from '@/components/OptimizedImage'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { getProjectBySlug, type Project } from '@/data/projects'
import { REVEAL_EASE } from '@/lib/motion'
import { trackEvent } from '@/utils/analytics'

function RevealBlock({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: REVEAL_EASE, delay }}
      layout={false}
    >
      {children}
    </motion.div>
  )
}

function GalleryPanel({
  images,
  alts,
  className,
}: {
  images: string[]
  alts: string[]
  className?: string
}) {
  return (
    <div className={className ?? 'cs-gallery'}>
      {images.map((src, i) => (
        <div key={`${src}-${i}`} className="cs-gallery-item">
          <OptimizedImage
            src={src}
            alt={alts[i] ?? alts[0] ?? 'Project screenshot'}
            width={1200}
            height={800}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ))}
    </div>
  )
}

function CaseStudyBody({ project }: { project: Project }) {
  const visitUrl = project.websiteUrl ?? project.link
  const galleryA = project.gallery.slice(0, 2)
  const galleryB = project.gallery.slice(2, 4)

  return (
    <article className="cs-page bg-page text-white" aria-labelledby="cs-title">
      <style>{`
        .cs-page {
          padding: 7rem 0 5rem;
          font-family: 'Sora', system-ui, sans-serif;
        }
        .cs-shell {
          max-width: 1080px;
          margin-inline: auto;
          padding-inline: 1.5rem;
        }
        @media (min-width: 1024px) {
          .cs-shell { padding-inline: 2rem; }
        }
        .cs-hero {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        @media (min-width: 900px) {
          .cs-hero {
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            gap: 2rem;
          }
        }
        .cs-hero-copy { max-width: 44rem; }
        .cs-tag {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          padding: 0.3rem 0.75rem;
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
        }
        .cs-tag--sample {
          border-color: rgb(var(--brand-gold-rgb) / 0.45);
          background: rgb(var(--brand-gold-rgb) / 0.12);
          color: var(--brand-gold);
        }
        .cs-title {
          margin-top: 1rem;
          font-size: clamp(2.6rem, 6vw, 4.2rem);
          font-weight: 900;
          letter-spacing: -0.035em;
          line-height: 1.02;
          color: #fff;
        }
        .cs-services {
          margin-top: 0.9rem;
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .cs-visit {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          align-self: flex-start;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          padding: 0.75rem 1.15rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #fff;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          white-space: nowrap;
        }
        .cs-visit:hover {
          background: rgb(var(--brand-gold-rgb) / 0.16);
          border-color: rgb(var(--brand-gold-rgb) / 0.45);
          transform: translateY(-1px);
        }
        .cs-divider {
          margin: 2.5rem 0;
          height: 1px;
          background: rgba(255,255,255,0.1);
        }
        .cs-intro {
          display: grid;
          gap: 1.25rem;
        }
        @media (min-width: 800px) {
          .cs-intro {
            grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
            gap: 2.5rem;
            align-items: start;
          }
        }
        .cs-intro-heading {
          font-size: clamp(1.45rem, 2.8vw, 2rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.2;
          color: #fff;
        }
        .cs-intro-body {
          font-size: 0.98rem;
          line-height: 1.75;
          color: rgba(255,255,255,0.62);
        }
        .cs-intro-body p + p { margin-top: 1rem; }
        .cs-gallery-wrap {
          margin-top: 2.75rem;
          border-radius: 22px;
          background: #f4f4f2;
          padding: clamp(1rem, 2.5vw, 1.5rem);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .cs-gallery {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.85rem;
        }
        @media (min-width: 640px) {
          .cs-gallery { grid-template-columns: 1fr 1fr; }
        }
        .cs-gallery-item {
          overflow: hidden;
          border-radius: 14px;
          background: #e8e8e4;
          aspect-ratio: 16 / 11;
        }
        .cs-section {
          margin-top: clamp(3.5rem, 8vw, 5rem);
          display: grid;
          gap: 1.25rem;
        }
        @media (min-width: 800px) {
          .cs-section {
            grid-template-columns: auto minmax(0, 1fr);
            gap: 1.75rem;
            align-items: start;
          }
        }
        .cs-icon {
          width: 3.25rem;
          height: 3.25rem;
          border-radius: 14px;
          display: grid;
          place-items: center;
          border: 1px solid rgb(var(--brand-gold-rgb) / 0.35);
          background: rgb(var(--brand-gold-rgb) / 0.1);
          color: var(--brand-gold);
          flex-shrink: 0;
        }
        .cs-section h2 {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #fff;
        }
        .cs-section-body {
          margin-top: 0.85rem;
          font-size: 0.95rem;
          line-height: 1.75;
          color: rgba(255,255,255,0.62);
        }
        .cs-section-body p + p { margin-top: 0.9rem; }
        .cs-results-head {
          margin-top: clamp(3.5rem, 8vw, 5rem);
          margin-bottom: 1.75rem;
        }
        .cs-results-title {
          margin-top: 0.65rem;
          font-size: clamp(2rem, 4.5vw, 3rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .cs-results-title .muted { color: rgba(255,255,255,0.38); }
        .cs-results-title .bright { color: var(--brand-gold); }
        .cs-results-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .cs-results-grid { grid-template-columns: 1fr 1fr; gap: 1.15rem; }
        }
        .cs-result-card {
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          padding: 1.35rem 1.4rem;
        }
        .cs-result-value {
          font-size: clamp(1.8rem, 3.5vw, 2.4rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1;
          color: #fff;
        }
        .cs-result-label {
          margin-top: 0.45rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--brand-gold);
        }
        .cs-result-desc {
          margin-top: 0.65rem;
          font-size: 0.85rem;
          line-height: 1.55;
          color: rgba(255,255,255,0.55);
        }
        .cs-quote {
          position: relative;
          margin-top: clamp(3.5rem, 8vw, 5rem);
          overflow: hidden;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          padding: clamp(1.75rem, 4vw, 2.75rem);
        }
        .cs-quote-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0);
          background-size: 24px 24px;
          opacity: 0.9;
        }
        .cs-quote-inner { position: relative; z-index: 1; }
        .cs-quote-text {
          font-size: clamp(1.15rem, 2.4vw, 1.65rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.45;
          color: rgba(255,255,255,0.9);
          max-width: 40rem;
        }
        .cs-quote-meta {
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .cs-quote-avatar {
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 999px;
          background: rgb(var(--brand-gold-rgb) / 0.18);
          border: 1px solid rgb(var(--brand-gold-rgb) / 0.35);
          display: grid;
          place-items: center;
          font-weight: 800;
          color: var(--brand-gold);
          overflow: hidden;
          flex-shrink: 0;
        }
        .cs-quote-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cs-quote-name {
          font-weight: 700;
          color: #fff;
        }
        .cs-quote-role {
          margin-top: 0.15rem;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
        }
        .cs-back {
          margin-top: 3.5rem;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
        }
        .cs-back:hover { color: var(--brand-gold); }
      `}</style>

      <div className="cs-shell">
        <RevealBlock>
          <div className="cs-hero">
            <div className="cs-hero-copy">
              <span className={`cs-tag${project.isSample ? ' cs-tag--sample' : ''}`}>
                {project.tag}
              </span>
              <h1 id="cs-title" className="cs-title">
                {project.title}
              </h1>
              <p className="cs-services">{project.services}</p>
            </div>
            {visitUrl ? (
              <a
                href={visitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cs-visit"
                onClick={() =>
                  trackEvent('project_click', { project_name: project.id, surface: 'case_study' })
                }
              >
                Visit website
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            ) : null}
          </div>
        </RevealBlock>

        <div className="cs-divider" />

        <RevealBlock>
          <div className="cs-intro">
            <h2 className="cs-intro-heading">{project.tagline ?? project.title}</h2>
            <div className="cs-intro-body">
              <p>{project.description}</p>
            </div>
          </div>
        </RevealBlock>

        {galleryA.length > 0 ? (
          <RevealBlock delay={0.05}>
            <div className="cs-gallery-wrap">
              <GalleryPanel
                images={galleryA}
                alts={galleryA.map((_, i) => `${project.title} gallery ${i + 1}`)}
              />
            </div>
          </RevealBlock>
        ) : null}

        <RevealBlock>
          <section className="cs-section" aria-labelledby="cs-challenge-heading">
            <div className="cs-icon" aria-hidden>
              <Flag className="h-5 w-5" strokeWidth={2.25} />
            </div>
            <div>
              <h2 id="cs-challenge-heading">{project.challenge.heading}</h2>
              <div className="cs-section-body">
                {project.challenge.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </section>
        </RevealBlock>

        {galleryB.length > 0 ? (
          <RevealBlock delay={0.05}>
            <div className="cs-gallery-wrap">
              <GalleryPanel
                images={galleryB}
                alts={galleryB.map((_, i) => `${project.title} gallery ${i + 3}`)}
              />
            </div>
          </RevealBlock>
        ) : null}

        <RevealBlock>
          <section className="cs-section" aria-labelledby="cs-solution-heading">
            <div className="cs-icon" aria-hidden>
              <Layers className="h-5 w-5" strokeWidth={2.25} />
            </div>
            <div>
              <h2 id="cs-solution-heading">{project.solution.heading}</h2>
              <div className="cs-section-body">
                {project.solution.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </section>
        </RevealBlock>

        <RevealBlock>
          <div className="cs-results-head">
            <SectionEyebrow variant="plain">Results</SectionEyebrow>
            <h2 className="cs-results-title">
              <span className="muted">What </span>
              <span className="bright">changed.</span>
            </h2>
          </div>
          <div className="cs-results-grid">
            {project.results.slice(0, 4).map((r) => (
              <div key={`${r.label}-${r.value}`} className="cs-result-card">
                <p className="cs-result-value">{r.value}</p>
                <p className="cs-result-label">{r.label}</p>
                <p className="cs-result-desc">{r.description}</p>
              </div>
            ))}
          </div>
        </RevealBlock>

        {project.testimonial ? (
          <RevealBlock>
            <figure className="cs-quote">
              <div className="cs-quote-grid" aria-hidden />
              <div className="cs-quote-inner">
                <blockquote className="cs-quote-text">
                  &ldquo;{project.testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="cs-quote-meta">
                  <div className="cs-quote-avatar">
                    {project.testimonial.avatar ? (
                      <img src={project.testimonial.avatar} alt="" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5" aria-hidden />
                    )}
                  </div>
                  <div>
                    <p className="cs-quote-name">{project.testimonial.name}</p>
                    <p className="cs-quote-role">{project.testimonial.role}</p>
                  </div>
                </figcaption>
              </div>
            </figure>
          </RevealBlock>
        ) : null}

        <RevealBlock delay={0.05}>
          <Link to="/work" className="cs-back">
            ← All projects
          </Link>
        </RevealBlock>
      </div>
    </article>
  )
}

export default function WorkCaseStudy() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProjectBySlug(slug) : undefined

  if (!project) {
    return <Navigate to="/work" replace />
  }

  return <CaseStudyBody project={project} />
}
