'use client'

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { OptimizedImage } from '@/components/OptimizedImage'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { projectHasCaseStudy, type Project } from '@/data/projects'
import { trackEvent } from '@/utils/analytics'
import { cn } from '@/lib/utils'
import { SCROLL_REVEAL_EASE } from '@/lib/scrollReveal'
import { observeScrollRevealOnce } from '@/utils/sharedScrollRevealObserver'
import {
  PROJECT_SCREENSHOT_CONTAIN_CLASS,
  ProjectScreenshotContainmentStyles,
} from '@/components/work/ProjectScreenshotContainment'

function BrowserMockup({
  project,
  priority,
}: {
  project: Project
  priority?: boolean
}) {
  const shotRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const el = shotRef.current
    if (!el) return

    if (prefersReducedMotion) {
      el.classList.add('is-visible')
      return
    }

    const reveal = () => {
      el.classList.add('is-visible', 'is-animating')
      const img = el.querySelector('.work-browser-image')
      if (!img) {
        el.classList.remove('is-animating')
        return
      }
      const onEnd = (event: Event) => {
        if (event.target !== img) return
        el.classList.remove('is-animating')
        img.removeEventListener('transitionend', onEnd)
      }
      img.addEventListener('transitionend', onEnd)
    }

    const rect = el.getBoundingClientRect()
    const alreadyVisible =
      rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.08

    if (alreadyVisible) {
      reveal()
      return
    }

    return observeScrollRevealOnce(el, reveal)
  }, [prefersReducedMotion])

  return (
    <div className="work-browser">
      <div className="work-browser-bar" aria-hidden>
        <span className="work-browser-dot" style={{ background: '#ff5f57' }} />
        <span className="work-browser-dot" style={{ background: '#febc2e' }} />
        <span className="work-browser-dot" style={{ background: '#28c840' }} />
      </div>
      <div ref={shotRef} className={`work-browser-shot work-shot-zoom ${PROJECT_SCREENSHOT_CONTAIN_CLASS}`}>
        <OptimizedImage
          src={project.image}
          alt={project.imageAlt}
          width={1600}
          height={900}
          className="work-browser-image"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          sizes="(max-width: 767px) 100vw, (max-width: 1280px) 65vw, 720px"
          style={{ aspectRatio: 'unset' }}
        />
      </div>
    </div>
  )
}

export function WorkProjectCardStyles() {
  return (
    <>
      <ProjectScreenshotContainmentStyles />
      <style>{`
      .work-card {
        overflow: hidden;
        isolation: isolate;
        position: relative;
        z-index: 0;
      }
      .work-list {
        display: flex;
        flex-direction: column;
        gap: clamp(2rem, 6.5vw, 2.5rem);
      }
      .work-card.scroll-reveal.is-visible {
        overflow: hidden;
      }
      @media (max-width: 767px) {
        .work-card-link {
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 12px 32px rgba(0,0,0,0.28);
        }
      }
      @media (min-width: 768px) {
        .work-list {
          gap: 0;
          scroll-snap-type: y proximity;
        }
        .work-card {
          scroll-snap-align: start;
          padding-block: clamp(2rem, 3.5vh, 2.75rem);
        }
        .work-card:first-child {
          padding-top: clamp(1.5rem, 2.5vh, 2rem);
        }
        .work-list--related .work-card {
          padding-block: clamp(1.25rem, 2.5vh, 2rem);
        }
        .work-list--related .work-card:first-child {
          padding-top: clamp(1.25rem, 2.5vh, 2rem);
        }
      }
      .work-card-link {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border-radius: 18px;
        border: none;
        background: #1c1c1c;
        text-decoration: none;
        color: inherit;
        transition: box-shadow 0.25s ease;
      }
        .work-card-link:hover {
          box-shadow: 0 24px 56px rgba(0,0,0,0.38);
        }
        .work-card-link--static {
          cursor: default;
        }
        .work-card-link--static:hover {
          box-shadow: none;
        }
      @media (min-width: 768px) {
        .work-card-link {
          display: grid;
          grid-template-columns: minmax(0, 67fr) minmax(0, 33fr);
          align-items: stretch;
          height: clamp(26rem, 68vh, 38rem);
          max-height: min(68vh, 38rem);
        }
      }
      @media (min-width: 1024px) {
        .work-card-link {
          height: clamp(28rem, 66vh, 40rem);
          max-height: min(66vh, 40rem);
        }
      }
      @media (min-width: 1440px) {
        .work-card-link {
          height: clamp(30rem, 62vh, 42rem);
          max-height: min(62vh, 42rem);
        }
      }
      .work-card-media {
        min-width: 0;
        position: relative;
        padding: clamp(0.85rem, 2vw, 1.15rem);
        overflow: visible;
      }
      .work-card-media-inner {
        position: relative;
        display: flex;
        flex-direction: column;
        min-height: 0;
        flex: 1;
        padding: clamp(1.25rem, 3vw, 2.25rem);
        padding-bottom: clamp(1rem, 2vw, 1.5rem);
        border-radius: 14px;
        background: #f5f5f3;
        overflow: hidden;
      }
      @media (min-width: 768px) {
        .work-card-media {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
          padding: clamp(1rem, 1.8vw, 1.35rem);
          padding-bottom: clamp(1.75rem, 3vw, 2.35rem);
        }
      }
      .work-browser {
        border-radius: 12px;
        overflow: hidden;
        background: #141414;
        border: 1px solid rgba(255,255,255,0.1);
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
        justify-content: flex-start;
      }
      .work-browser-bar {
        height: 34px;
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 0 12px;
        background: #1a1a1a;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        flex-shrink: 0;
      }
      .work-browser-dot {
        width: 10px;
        height: 10px;
        border-radius: 999px;
      }
      .work-browser-shot {
        position: relative;
        width: 100%;
        flex: 0 1 auto;
        aspect-ratio: 16 / 9;
        max-height: 100%;
        background: #0f0f0f;
      }
      .work-browser-image {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: top center;
        transform: scale(1.08) translateZ(0);
        transform-origin: center top;
        transition: transform 750ms ${SCROLL_REVEAL_EASE};
        backface-visibility: hidden;
      }
      .work-shot-zoom.is-visible .work-browser-image {
        transform: scale(1) translateZ(0);
      }
      .work-shot-zoom.is-animating .work-browser-image {
        will-change: transform;
      }
      @media (prefers-reduced-motion: reduce) {
        .work-browser-image {
          transform: none;
          transition: none;
        }
      }
      .work-stat-overlay {
        position: absolute;
        left: calc(clamp(0.85rem, 2vw, 1.15rem) + clamp(1.25rem, 3vw, 2.25rem));
        bottom: clamp(0.65rem, 1.2vw, 0.95rem);
        max-width: min(15rem, 70%);
        padding: 0.85rem 1rem;
        border-radius: 12px;
        background: rgba(10, 10, 10, 0.92);
        border: 1px solid rgba(255,255,255,0.12);
        pointer-events: none;
        z-index: 5;
      }
      @media (min-width: 768px) {
        .work-stat-overlay {
          left: calc(clamp(1rem, 1.8vw, 1.35rem) + clamp(1.25rem, 3vw, 2.25rem));
          bottom: clamp(0.75rem, 1.5vw, 1.1rem);
        }
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
      .work-card-panel {
        display: flex;
        flex-direction: column;
        gap: 0.65rem;
        padding: 1.15rem 1.25rem 1.35rem;
        min-width: 0;
      }
      @media (min-width: 768px) {
        .work-card-panel {
          height: 100%;
          min-height: 0;
          justify-content: flex-start;
          gap: 0;
          padding: clamp(1.5rem, 2.5vw, 2rem) clamp(1.25rem, 2vw, 1.75rem);
        }
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
        font-size: 0.62rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.65);
      }
      @media (min-width: 768px) {
        .work-row-tag { order: 1; }
      }
      .work-row-tag--sample {
        border-color: rgb(var(--brand-gold-rgb) / 0.45);
        background: rgb(var(--brand-gold-rgb) / 0.12);
        color: var(--brand-gold);
      }
      .work-row-title {
        margin-top: 0.15rem;
        font-size: clamp(1.75rem, 7vw, 2rem);
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1.12;
        color: #fff;
      }
      @media (min-width: 768px) {
        .work-row-title {
          order: 2;
          margin-top: 0.85rem;
        }
      }
      .work-row-services {
        font-family: 'DM Mono', monospace;
        font-size: 0.58rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.38);
        line-height: 1.4;
      }
      @media (min-width: 768px) {
        .work-row-services {
          order: 4;
          margin-top: auto;
          padding-top: 1.5rem;
        }
      }
      .work-row-desc {
        margin-top: 0.15rem;
        font-size: 0.84rem;
        line-height: 1.55;
        color: rgba(255,255,255,0.58);
      }
      @media (min-width: 768px) {
        .work-row-desc {
          order: 3;
          margin-top: 0.75rem;
          flex: 1;
        }
      }
      .work-row-cta {
        display: none;
        align-items: center;
        gap: 0.45rem;
        margin-top: 0.35rem;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--brand-gold);
      }
      @media (min-width: 768px) {
        .work-row-cta {
          display: inline-flex;
          order: 5;
          margin-top: 0.85rem;
        }
      }
      .work-card-link:hover .work-row-cta {
        color: #fff;
      }
    `}</style>
    </>
  )
}

export function WorkProjectCard({
  project,
  index,
  priority,
}: {
  project: Project
  index: number
  priority?: boolean
}) {
  const hasCaseStudy = projectHasCaseStudy(project)

  const panel = (
    <>
      <div className="work-card-media">
        <div className="work-card-media-inner">
          <BrowserMockup project={project} priority={priority ?? index === 0} />
        </div>
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

      <div className="work-card-panel">
        <span className={cn('work-row-tag', project.isSample && 'work-row-tag--sample')}>
          {project.tag}
        </span>
        <h2 className="work-row-title">{project.title}</h2>
        <span className="work-row-services">{project.services}</span>
        <p className="work-row-desc">{project.description}</p>
        {hasCaseStudy ? (
          <span className="work-row-cta">
            View case study
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </span>
        ) : null}
      </div>
    </>
  )

  return (
    <ScrollReveal as="article" staggerIndex={index} className="work-card">
      {hasCaseStudy ? (
        <Link
          to={`/work/${project.slug}`}
          className="work-card-link"
          onClick={() => trackEvent('project_click', { project_name: project.id, surface: 'listing' })}
          aria-label={`Open case study: ${project.title}`}
        >
          {panel}
        </Link>
      ) : (
        <div className="work-card-link work-card-link--static" aria-label={project.title}>
          {panel}
        </div>
      )}
    </ScrollReveal>
  )
}
