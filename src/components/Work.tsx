'use client'

import { memo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { OptimizedImage } from './OptimizedImage'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { PROJECTS, type Project } from '@/data/projects'
import { trackEvent } from '@/utils/analytics'
import { cn } from '@/lib/utils'

function BrowserMockup({
  project,
  priority,
}: {
  project: Project
  priority?: boolean
}) {
  return (
    <div className="work-browser">
      <div className="work-browser-bar" aria-hidden>
        <span className="work-browser-dot" style={{ background: '#ff5f57' }} />
        <span className="work-browser-dot" style={{ background: '#febc2e' }} />
        <span className="work-browser-dot" style={{ background: '#28c840' }} />
      </div>
      <div className="work-browser-shot">
        <OptimizedImage
          src={project.image}
          alt={project.imageAlt}
          width={1600}
          height={900}
          className="h-full w-full object-cover"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
        {project.statOverlay ? (
          <div
            className="work-stat-overlay"
            aria-label={`${project.statOverlay.value} ${project.statOverlay.label}`}
          >
            <p className="work-stat-value">{project.statOverlay.value}</p>
            <p className="work-stat-label">{project.statOverlay.label}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function ProjectRow({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  const imageFirst = index % 2 === 0

  return (
    <ScrollReveal
      as="article"
      staggerIndex={index}
      className={cn('work-row', imageFirst ? 'work-row--image-first' : 'work-row--text-first')}
    >
      <Link
        to={`/work/${project.slug}`}
        className="work-row-link"
        onClick={() => trackEvent('project_click', { project_name: project.id, surface: 'listing' })}
        aria-label={`Open case study: ${project.title}`}
      >
        <div className="work-row-media">
          <BrowserMockup project={project} priority={index === 0} />
        </div>

        <div className="work-row-panel">
          <span className={cn('work-row-tag', project.isSample && 'work-row-tag--sample')}>
            {project.tag}
          </span>
          <h2 className="work-row-title">{project.title}</h2>
          {project.tagline ? <p className="work-row-tagline">{project.tagline}</p> : null}
          <p className="work-row-desc">{project.description}</p>
          <span className="work-row-cta">
            View case study
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </span>
        </div>
      </Link>
    </ScrollReveal>
  )
}

function WorkListing() {
  return (
    <section
      id="work"
      className="work-page relative bg-page text-white"
      aria-labelledby="work-heading"
    >
      <style>{`
        .work-page {
          padding: 7.5rem 0 5rem;
          font-family: 'Sora', system-ui, sans-serif;
        }
        .work-shell {
          position: relative;
          z-index: 1;
          max-width: 1120px;
          margin-inline: auto;
          padding-inline: 1.5rem;
        }
        @media (min-width: 1024px) {
          .work-shell { padding-inline: 2.5rem; }
        }
        .work-header {
          max-width: 40rem;
          margin-bottom: 3.5rem;
        }
        .work-header h1 {
          margin-top: 0.75rem;
          font-size: clamp(2.4rem, 5vw, 3.6rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: #fff;
        }
        .work-header p {
          margin-top: 1rem;
          max-width: 34rem;
          font-size: 0.95rem;
          line-height: 1.65;
          color: rgba(255,255,255,0.62);
        }
        .work-list {
          display: flex;
          flex-direction: column;
          gap: clamp(2.75rem, 6vw, 4.5rem);
        }
        .work-row-link {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          text-decoration: none;
          color: inherit;
          align-items: stretch;
        }
        @media (min-width: 900px) {
          .work-row-link {
            grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
            gap: 2rem;
            align-items: center;
          }
          .work-row--text-first .work-row-media { order: 2; }
          .work-row--text-first .work-row-panel { order: 1; }
        }
        .work-browser {
          border-radius: 16px;
          overflow: hidden;
          background: #141414;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 32px 70px rgba(0,0,0,0.55);
          transition: transform 0.25s ease, border-color 0.25s ease;
        }
        .work-row-link:hover .work-browser {
          transform: translateY(-3px);
          border-color: rgb(var(--brand-gold-rgb) / 0.35);
        }
        .work-browser-bar {
          height: 36px;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0 14px;
          background: #1f1f1f;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .work-browser-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
        }
        .work-browser-shot {
          position: relative;
          aspect-ratio: 16 / 10;
          background: #0a0a0a;
        }
        .work-stat-overlay {
          position: absolute;
          left: 1rem;
          bottom: 1rem;
          max-width: min(15rem, 70%);
          padding: 0.85rem 1rem;
          border-radius: 12px;
          background: rgba(10, 10, 10, 0.88);
          border: 1px solid rgba(255,255,255,0.12);
          pointer-events: none;
        }
        .work-stat-value {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1;
          color: #fff;
        }
        .work-stat-label {
          margin-top: 0.35rem;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
        }
        .work-row-panel {
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(165deg, rgba(255,255,255,0.05), rgba(10,10,10,0.92));
          padding: clamp(1.4rem, 3vw, 2.25rem);
          min-height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .work-row-tag {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          padding: 0.3rem 0.7rem;
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
        }
        .work-row-tag--sample {
          border-color: rgb(var(--brand-gold-rgb) / 0.45);
          background: rgb(var(--brand-gold-rgb) / 0.12);
          color: var(--brand-gold);
        }
        .work-row-title {
          margin-top: 1rem;
          font-size: clamp(1.9rem, 3.5vw, 2.75rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: #fff;
        }
        .work-row-tagline {
          margin-top: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.45;
          color: rgba(255,255,255,0.82);
        }
        .work-row-desc {
          margin-top: 0.65rem;
          font-size: 0.9rem;
          line-height: 1.65;
          color: rgba(255,255,255,0.58);
          max-width: 28rem;
        }
        .work-row-cta {
          margin-top: 1.35rem;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--brand-gold);
        }
        .work-row-link:hover .work-row-cta {
          color: #fff;
        }
        .work-footnote {
          margin-top: 4rem;
          text-align: center;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.5);
        }
        .work-footnote-rule {
          margin: 1rem auto 0;
          height: 1px;
          width: 6rem;
          background: linear-gradient(to right, transparent, rgb(var(--brand-gold-rgb) / 0.35), transparent);
        }
        .work-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 20% 12%, rgb(var(--brand-gold-rgb) / 0.05), transparent 42%),
            radial-gradient(circle at 85% 70%, rgb(var(--brand-gold-rgb) / 0.03), transparent 40%);
        }
      `}</style>

      <div className="work-glow" aria-hidden />

      <div className="work-shell">
        <ScrollReveal className="work-header">
          <SectionEyebrow variant="pillMono">Portfolio</SectionEyebrow>
          <h1 id="work-heading">Results you can measure.</h1>
          <p>
            Every project on this page is live — click through and see it running, not a
            mockup.
          </p>
        </ScrollReveal>

        <div className="work-list">
          {PROJECTS.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} />
          ))}
        </div>

        <ScrollReveal className="work-footnote">
          Sample builds are labeled clearly. Client work is live on the open web.
          <span className="work-footnote-rule" aria-hidden />
        </ScrollReveal>
      </div>
    </section>
  )
}

export default memo(WorkListing)
