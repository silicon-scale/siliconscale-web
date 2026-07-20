'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { OptimizedImage } from '@/components/OptimizedImage'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { CountUpNumber } from '@/components/ui/CountUpNumber'
import ScrollReveal from '@/components/ui/ScrollReveal'
import FinalCTA from '@/components/FinalCTA'
import { WorkProjectCard, WorkProjectCardStyles } from '@/components/work/WorkProjectCard'
import { PROJECT_SCREENSHOT_CONTAIN_CLASS } from '@/components/work/ProjectScreenshotContainment'
import { getProjectBySlug, PROJECTS, projectHasCaseStudy, type Project, type ProjectResult } from '@/data/projects'
import { trackEvent } from '@/utils/analytics'
import { observeScrollRevealOnce } from '@/utils/sharedScrollRevealObserver'
import { cn } from '@/lib/utils'

const INTRO_BODY_FALLBACK = [
  'PLACEHOLDER — intro paragraph 1 needed for case study overview.',
  'PLACEHOLDER — intro paragraph 2 needed for case study overview.',
]

const LINK_PATTERN = /(\[[^\]]+\]\([^)]+\))/g
const LINK_PARSE = /^\[([^\]]+)\]\(([^)]+)\)$/

function renderRichText(text: string): ReactNode {
  const segments = text.split(LINK_PATTERN).filter(Boolean)
  if (segments.length === 1 && !LINK_PARSE.test(segments[0])) {
    return text
  }

  return segments.map((segment, i) => {
    const match = segment.match(LINK_PARSE)
    if (!match) return <span key={i}>{segment}</span>
    const [, label, href] = match
    const external = /^https?:\/\//i.test(href)
    return (
      <a
        key={i}
        href={href}
        className="cs-inline-link"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {label}
      </a>
    )
  })
}

function RevealBlock({
  children,
  className,
  delay = 0,
  staggerIndex,
}: {
  children: ReactNode
  className?: string
  delay?: number
  staggerIndex?: number
}) {
  return (
    <ScrollReveal className={className} delay={delay} staggerIndex={staggerIndex}>
      {children}
    </ScrollReveal>
  )
}

function ImageGrid({
  images,
  altPrefix,
  className,
  columns = 2,
}: {
  images: string[]
  altPrefix: string
  className?: string
  columns?: 2 | 'gallery'
}) {
  if (images.length === 0) return null

  return (
    <div
      className={cn(
        columns === 2 ? 'cs-image-row' : 'cs-solution-gallery',
        className,
      )}
    >
      {images.map((src, i) => (
        <div key={`${src}-${i}`} className={cn('cs-image-cell', PROJECT_SCREENSHOT_CONTAIN_CLASS)}>
          <OptimizedImage
            src={src}
            alt={`${altPrefix} ${i + 1}`}
            width={1200}
            height={800}
            className="cs-image-cell-img"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ))}
    </div>
  )
}

function introHeadlineFor(project: Project) {
  return project.introHeadline ?? project.tagline ?? project.title
}

function introBodyFor(project: Project) {
  return project.introBody?.length ? project.introBody : INTRO_BODY_FALLBACK
}

function heroImageFor(project: Project) {
  return project.heroImage ?? project.image
}

function challengeImagesFor(project: Project) {
  if (project.challengeImages && project.challengeImages.length >= 2) {
    return project.challengeImages.slice(0, 2)
  }
  return project.gallery.slice(0, 2)
}

function resultsHeadingFor(project: Project) {
  return project.resultsHeading ?? 'Measurable business impact'
}

function otherProjects(currentSlug: string, limit = 6) {
  return PROJECTS.filter((p) => p.slug !== currentSlug && projectHasCaseStudy(p)).slice(0, limit)
}

function splitResultsHeading(heading: string) {
  const words = heading.trim().split(/\s+/)
  if (words.length <= 1) {
    return { muted: '', bright: heading }
  }
  return { muted: words[0], bright: words.slice(1).join(' ') }
}

function ChallengesIcon() {
  return (
    <svg
      className="cs-section-icon cs-section-icon--challenges"
      viewBox="0 0 72 72"
      fill="none"
      aria-hidden
    >
      <circle cx="36" cy="36" r="6" fill="rgb(var(--brand-gold-rgb))" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <rect
          key={deg}
          x="34"
          y="11"
          width="4"
          height="13"
          rx="2"
          fill="rgb(var(--brand-gold-rgb))"
          opacity="0.88"
          transform={`rotate(${deg} 36 36)`}
        />
      ))}
      <circle cx="36" cy="36" r="14" stroke="rgb(var(--brand-gold-rgb) / 0.35)" strokeWidth="1.5" />
    </svg>
  )
}

function SolutionsIcon() {
  return (
    <svg
      className="cs-section-icon cs-section-icon--solutions"
      viewBox="0 0 72 72"
      fill="none"
      aria-hidden
    >
      <path d="M36 10 L46 26 L62 30 L50 42 L52 58 L36 50 L20 58 L22 42 L10 30 L26 26 Z" fill="#47C2FF" opacity="0.22" />
      <path d="M36 18 L42 28 L54 31 L44 40 L46 52 L36 46 L26 52 L28 40 L18 31 L30 28 Z" fill="#47C2FF" opacity="0.55" />
      <path d="M36 26 L39 32 L46 34 L40 39 L41 46 L36 42 L31 46 L32 39 L26 34 L33 32 Z" fill="#7DD3FC" />
      <path d="M22 54 L28 48 L34 54 L28 60 Z" fill="#6EE7B7" opacity="0.75" />
      <path d="M38 54 L44 48 L50 54 L44 60 Z" fill="#47C2FF" opacity="0.65" />
    </svg>
  )
}

function ResultsBadgeIcon() {
  return (
    <span className="cs-results-badge" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" stroke="rgb(var(--brand-gold-rgb) / 0.45)" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4" fill="rgb(var(--brand-gold-rgb))" />
      </svg>
    </span>
  )
}

function CenteredSectionBand({
  id,
  title,
  icon,
  children,
  images,
}: {
  id: string
  title: string
  icon: ReactNode
  children: ReactNode
  images?: ReactNode
}) {
  return (
    <section className="cs-section-band" aria-labelledby={id}>
      <div className="cs-section-band-inner">
        <RevealBlock>
          <div className="cs-section-center">
            {icon}
            <h2 id={id} className="cs-section-title">
              {title}
            </h2>
            <div className="cs-section-body">{children}</div>
          </div>
        </RevealBlock>
        {images ? <div className="cs-section-media">{images}</div> : null}
      </div>
    </section>
  )
}

function CaseStudyResults({
  heading,
  results,
}: {
  heading: string
  results: ProjectResult[]
}) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [statsInView, setStatsInView] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { muted, bright } = splitResultsHeading(heading)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return

    if (prefersReducedMotion) {
      setStatsInView(true)
      return
    }

    return observeScrollRevealOnce(el, () => setStatsInView(true))
  }, [prefersReducedMotion])

  return (
    <section className="cs-results-band" aria-labelledby="cs-results-heading">
      <div className="cs-results-band-inner">
        <RevealBlock>
          <div className="cs-results-header">
            <SectionEyebrow variant="pillMono" className="cs-results-eyebrow">
              Results
            </SectionEyebrow>
            <div className="cs-results-heading-row">
              <h2 id="cs-results-heading" className="cs-results-heading-split">
                {muted ? <span className="cs-results-muted">{muted}</span> : null}
                {muted ? ' ' : null}
                <span className="cs-results-bright">{bright}</span>
              </h2>
              <ResultsBadgeIcon />
            </div>
          </div>
        </RevealBlock>

        <div ref={gridRef} className="cs-results-grid">
          {results.slice(0, 4).map((result, index) => (
            <article
              key={`${result.label}-${result.value}`}
              className="cs-result-card"
              data-index={index}
            >
              <CountUpNumber
                value={result.value}
                animate={statsInView}
                durationMs={2000}
                className="cs-result-value font-bagel leading-none tracking-tight text-white"
                style={{ fontSize: 'clamp(2.75rem, 6vw, 5rem)' }}
              />
              <p className="cs-result-label">{result.label}</p>
              <p className="cs-result-desc">{result.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function CaseStudyBody({ project }: { project: Project }) {
  const visitUrl = project.websiteUrl ?? project.link
  const introHeadline = introHeadlineFor(project)
  const introBody = introBodyFor(project)
  const heroImage = heroImageFor(project)
  const challengeImages = challengeImagesFor(project)
  const resultsHeading = resultsHeadingFor(project)
  const related = otherProjects(project.slug)

  return (
    <>
      <article className="cs-page bg-page text-white" aria-labelledby="cs-title">
        <style>{`
          .cs-page {
            padding: 7.5rem 0 0;
            font-family: 'Sora', system-ui, sans-serif;
            position: relative;
            z-index: 0;
            isolation: isolate;
          }
          .cs-shell {
            max-width: 1080px;
            margin-inline: auto;
            padding-inline: 1.5rem;
          }
          @media (min-width: 1024px) {
            .cs-shell { padding-inline: 2rem; }
          }

          /* 1 — Header */
          .cs-header {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
          }
          @media (min-width: 900px) {
            .cs-header {
              flex-direction: row;
              align-items: flex-start;
              justify-content: space-between;
              gap: 2rem;
            }
          }
          .cs-header-copy { max-width: 44rem; }
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
            border: none;
            border-radius: 8px;
            background: #fff;
            padding: 0.7rem 1.15rem;
            font-size: 0.68rem;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #0a0a0a;
            text-decoration: none;
            transition: background 0.2s ease, color 0.2s ease;
            white-space: nowrap;
          }
          .cs-visit:hover {
            background: rgba(255,255,255,0.92);
            color: #0a0a0a;
          }

          /* Header ↔ intro divider (matches border-white/10 sitewide) */
          .cs-header-divider {
            margin: clamp(2rem, 4vw, 3rem) 0;
            border: 0;
            border-top: 1px solid rgba(255,255,255,0.1);
          }

          /* 2 — Intro */
          .cs-intro {
            display: grid;
            gap: 1.25rem;
          }
          @media (min-width: 800px) {
            .cs-intro {
              grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
              gap: 2.5rem;
              align-items: start;
            }
          }
          .cs-intro-headline {
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

          /* 3 — Hero image */
          .cs-hero-outer {
            margin-top: clamp(2.5rem, 5vw, 3.5rem);
            border-radius: 20px;
          }
          .cs-hero-image {
            overflow: hidden;
            border-radius: inherit;
            background: #141414;
            border: 1px solid rgba(255,255,255,0.08);
            aspect-ratio: 16 / 9;
          }
          .cs-hero-image img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top center;
          }

          /* 4 & 5 — Centered section bands */
          .cs-section-band {
            padding: clamp(4rem, 10vw, 10rem) clamp(1.5rem, 4vw, 2.5rem);
            background: #1c1c1c;
          }
          .cs-section-band + .cs-section-band {
            border-top: 1px solid rgba(255,255,255,0.04);
          }
          .cs-section-band-inner {
            max-width: 1080px;
            margin-inline: auto;
          }
          .cs-section-center {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .cs-section-icon {
            width: clamp(3.25rem, 7vw, 4.5rem);
            height: clamp(3.25rem, 7vw, 4.5rem);
            margin-bottom: 1.35rem;
            flex-shrink: 0;
          }
          .cs-section-title {
            font-size: clamp(1.75rem, 3.5vw, 2.35rem);
            font-weight: 800;
            letter-spacing: -0.03em;
            color: #fff;
          }
          .cs-section-body {
            margin-top: 1.15rem;
            max-width: 46rem;
            font-size: 0.98rem;
            line-height: 1.8;
            color: rgba(255,255,255,0.62);
          }
          .cs-section-body p + p { margin-top: 1rem; }
          .cs-inline-link {
            color: var(--brand-gold);
            text-decoration: underline;
            text-underline-offset: 3px;
            transition: color 0.2s;
          }
          .cs-inline-link:hover { color: #fff; }
          .cs-section-media {
            margin-top: clamp(2rem, 4vw, 3rem);
          }

          /* Image rows */
          .cs-image-row {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0.85rem;
          }
          @media (min-width: 640px) {
            .cs-image-row { grid-template-columns: 1fr 1fr; }
          }
          .cs-solution-gallery {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0.85rem;
          }
          @media (min-width: 640px) {
            .cs-solution-gallery { grid-template-columns: 1fr 1fr; }
          }
          .cs-image-cell {
            overflow: hidden;
            border-radius: 14px;
            background: #141414;
            border: 1px solid rgba(255,255,255,0.08);
            aspect-ratio: 16 / 11;
          }
          .cs-image-cell-img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          /* 6 — Results band */
          .cs-results-band {
            padding: clamp(4rem, 10vw, 10rem) clamp(1.5rem, 4vw, 2.5rem);
            background: #181818;
            border-top: 1px solid rgba(255,255,255,0.04);
          }
          .cs-results-band-inner {
            max-width: 1080px;
            margin-inline: auto;
          }
          .cs-results-header {
            text-align: left;
            max-width: 40rem;
          }
          .cs-results-eyebrow {
            margin-bottom: 0.85rem;
          }
          .cs-results-heading-row {
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          .cs-results-heading-split {
            font-size: clamp(2rem, 4.5vw, 3.25rem);
            font-weight: 900;
            letter-spacing: -0.03em;
            line-height: 1.08;
          }
          .cs-results-muted {
            color: rgba(255,255,255,0.38);
            font-weight: 800;
          }
          .cs-results-bright {
            color: #fff;
            font-weight: 900;
          }
          .cs-results-badge {
            display: grid;
            place-items: center;
            width: 2.75rem;
            height: 2.75rem;
            flex-shrink: 0;
          }
          .cs-results-badge svg {
            width: 100%;
            height: 100%;
          }
          .cs-results-grid {
            margin-top: clamp(2rem, 4vw, 3rem);
            display: grid;
            grid-template-columns: 1fr;
            gap: 0;
            border-top: 1px solid rgba(255,255,255,0.08);
          }
          @media (min-width: 768px) {
            .cs-results-grid {
              grid-template-columns: 1fr 1fr;
            }
          }
          .cs-result-card {
            padding: clamp(1.75rem, 3vw, 2.5rem) clamp(1.25rem, 2vw, 1.75rem);
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          @media (min-width: 768px) {
            .cs-result-card {
              padding: clamp(2rem, 3.5vw, 2.75rem) clamp(1.5rem, 2.5vw, 2rem);
            }
            .cs-result-card:nth-child(odd) {
              border-right: 1px solid rgba(255,255,255,0.08);
            }
            .cs-result-card:nth-child(n + 3) {
              border-bottom: none;
            }
          }
          .cs-result-label {
            margin-top: 0.85rem;
            font-size: clamp(1rem, 1.8vw, 1.15rem);
            font-weight: 600;
            letter-spacing: -0.01em;
            color: rgba(255,255,255,0.92);
          }
          .cs-result-desc {
            margin-top: 0.65rem;
            max-width: 22rem;
            font-size: 0.85rem;
            line-height: 1.6;
            color: rgba(255,255,255,0.52);
          }

          /* 7 — Testimonial */
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

          /* 8 — Related projects */
          .cs-related {
            margin-top: clamp(4rem, 9vw, 6rem);
            padding-bottom: 2rem;
          }
          .cs-related-title {
            margin-bottom: 0.5rem;
            font-size: clamp(1.75rem, 3.5vw, 2.25rem);
            font-weight: 900;
            letter-spacing: -0.03em;
            color: #fff;
          }
          .cs-related-shell {
            max-width: 1120px;
            margin-inline: auto;
            padding-inline: 1.5rem;
          }
          @media (min-width: 1024px) {
            .cs-related-shell { padding-inline: 2.5rem; }
          }
          .work-list {
            display: flex;
            flex-direction: column;
            gap: 0;
          }
        `}</style>

        <WorkProjectCardStyles />

        <div className="cs-shell">
          {/* 1 — Header */}
          <RevealBlock>
            <header className="cs-header">
              <div className="cs-header-copy">
                <span className={cn('cs-tag', project.isSample && 'cs-tag--sample')}>
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
                  className="cs-visit rounded-button"
                  onClick={() =>
                    trackEvent('project_click', { project_name: project.id, surface: 'case_study' })
                  }
                >
                  Visit website
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              ) : null}
            </header>
          </RevealBlock>

          <div className="cs-header-divider" role="separator" aria-hidden />

          {/* 2 — Intro */}
          <RevealBlock>
            <section className="cs-intro" aria-labelledby="cs-intro-headline">
              <h2 id="cs-intro-headline" className="cs-intro-headline">
                {introHeadline}
              </h2>
              <div className="cs-intro-body">
                {introBody.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          </RevealBlock>

          {/* 3 — Hero showcase */}
          <div className={cn('cs-hero-outer', PROJECT_SCREENSHOT_CONTAIN_CLASS)}>
            <RevealBlock delay={0.05}>
              <div className={cn('cs-hero-image', PROJECT_SCREENSHOT_CONTAIN_CLASS)}>
                <OptimizedImage
                  src={heroImage}
                  alt={project.imageAlt}
                  width={1600}
                  height={900}
                  loading="eager"
                  decoding="async"
                  sizes="(max-width: 1080px) 100vw, 1080px"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </RevealBlock>
          </div>
        </div>

        {/* 4 — Challenges */}
        <CenteredSectionBand
          id="cs-challenges-heading"
          title="Challenges"
          icon={<ChallengesIcon />}
          images={
            <ImageGrid
              images={challengeImages}
              altPrefix={`${project.title} challenge`}
              columns={2}
            />
          }
        >
          {project.challenge.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </CenteredSectionBand>

        {/* 5 — Solutions */}
        <CenteredSectionBand
          id="cs-solutions-heading"
          title="Solutions"
          icon={<SolutionsIcon />}
          images={
            project.gallery.length > 0 ? (
              <ImageGrid
                images={project.gallery.slice(2)}
                altPrefix={`${project.title} solution`}
                columns="gallery"
              />
            ) : undefined
          }
        >
          {project.solution.body.map((paragraph) => (
            <p key={paragraph}>{renderRichText(paragraph)}</p>
          ))}
        </CenteredSectionBand>

        {/* 6 — Results */}
        <CaseStudyResults heading={resultsHeading} results={project.results} />

        <div className="cs-shell">
          {/* 7 — Testimonial (conditional) */}
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
        </div>

        {/* 8 — Other projects */}
        {related.length > 0 ? (
          <section className="cs-related" aria-labelledby="cs-related-heading">
            <div className="cs-related-shell">
              <RevealBlock>
                <h2 id="cs-related-heading" className="cs-related-title">
                  You may also like
                </h2>
              </RevealBlock>
              <div className="work-list work-list--related">
                {related.map((item, index) => (
                  <WorkProjectCard key={item.id} project={item} index={index} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </article>

      {/* 9 — CTA band */}
      <FinalCTA />
    </>
  )
}

export default function WorkCaseStudy() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProjectBySlug(slug) : undefined

  if (!project || !projectHasCaseStudy(project)) {
    return <Navigate to="/work" replace />
  }

  return <CaseStudyBody project={project} />
}
