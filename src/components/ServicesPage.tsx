'use client'

import React, { memo, useCallback, useEffect, useState } from 'react'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import { ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useReveal } from '@/context/RevealContext'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { SecondaryCta } from '@/components/ui/SecondaryCta'
import { ToolPhysicsPlayground } from '@/components/ToolPhysicsPlayground'

type ServiceCard = {
  id: string
  title: string
  eyebrow: string
  description: string
  chips: string[]
  cta: string
  accent: string
  bg: string
  /** gradientId must be unique per render (badge vs watermark). */
  icon: (gradientId: string) => React.ReactNode
  locked?: boolean
}

const SERVICE_CARDS: ServiceCard[] = [
  {
    id: 'development',
    eyebrow: 'OUR SERVICES',
    title: 'Custom Systems Development',
    chips: ['Internal Tools', 'Dashboards', 'Customer Platforms', 'APIs', 'Automation'],
    description:
      "The software that runs your day-to-day — built to replace the spreadsheets and manual steps eating your team's time.",
    cta: 'Talk about your system',
    accent: '#b6f56a',
    bg: 'linear-gradient(135deg, rgb(38, 60, 22), rgb(10, 10, 10))',
    icon: (gid) => (
      <svg width="86" height="86" viewBox="0 0 86 86" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#b6f56a" />
            <stop offset="1" stopColor="#35f2c2" />
          </linearGradient>
        </defs>
        <circle cx="43" cy="43" r="40" fill={`url(#${gid})`} opacity="0.98" />
        <path
          d="M29 34l-9 9 9 9M57 34l9 9-9 9"
          stroke="var(--brand-ink)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
      </svg>
    ),
  },
  {
    id: 'shopify-headless',
    eyebrow: 'OUR SERVICES',
    title: 'Headless Shopify Development',
    chips: ['Storefront API', 'Custom Frontend', 'Performance', 'Checkout', 'Migrations'],
    description:
      "A store that's actually yours — not a theme everyone else is also using. Built fast, built to convert.",
    cta: 'Talk about your store',
    accent: '#7dd3fc',
    bg: 'linear-gradient(135deg, rgb(12, 42, 78), rgb(10, 10, 10))',
    icon: (gid) => (
      <svg width="86" height="86" viewBox="0 0 86 86" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#6ee7ff" />
            <stop offset="1" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
        <circle cx="43" cy="43" r="40" fill={`url(#${gid})`} opacity="0.98" />
        <path
          d="M28 36h30l-2 22H30l-2-22Z"
          stroke="var(--brand-ink)"
          strokeWidth="4.5"
          strokeLinejoin="round"
          fill="none"
          opacity="0.9"
        />
        <path
          d="M34 36V30a9 9 0 0 1 18 0v6"
          stroke="var(--brand-ink)"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
      </svg>
    ),
  },
  {
    id: 'ai-agents',
    eyebrow: 'OUR SERVICES',
    title: 'AI Agents & Automation',
    chips: ['Lead Qualification', 'Customer Support', 'Workflows', 'Internal Tools', 'Chat'],
    description:
      'AI that does the job, not a demo. Built around a real workflow in your business, not a generic chatbot.',
    cta: 'Talk about your AI needs',
    accent: '#fbbf24',
    bg: 'linear-gradient(135deg, rgb(74, 52, 12), rgb(10, 10, 10))',
    icon: (gid) => (
      <svg width="86" height="86" viewBox="0 0 86 86" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fde68a" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <circle cx="43" cy="43" r="40" fill={`url(#${gid})`} opacity="0.98" />
        <path
          d="M43 26c6.3 0 11.5 5.2 11.5 11.5S49.3 49 43 49s-11.5-5.2-11.5-11.5S36.7 26 43 26Z"
          fill="var(--brand-ink)"
          opacity="0.9"
        />
        <path
          d="M30 61c3.2-7.2 9-10.8 13-10.8S52.8 53.8 56 61"
          stroke="var(--brand-ink)"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    ),
  },
  {
    id: 'integrations',
    eyebrow: 'OUR SERVICES',
    title: 'Integrations',
    chips: ['CRM', 'Payments', 'AI Services', 'Third-Party APIs', 'Data Sync'],
    description:
      'Your tools, talking to each other. No more copy-pasting between systems that should already be connected.',
    cta: 'Talk about your stack',
    accent: '#d6a6ff',
    bg: 'linear-gradient(135deg, rgb(52, 28, 72), rgb(10, 10, 10))',
    icon: (gid) => (
      <svg width="86" height="86" viewBox="0 0 86 86" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#ff9bd6" />
            <stop offset="1" stopColor="#c6a0ff" />
          </linearGradient>
        </defs>
        <circle cx="43" cy="43" r="40" fill={`url(#${gid})`} opacity="0.98" />
        <circle cx="30" cy="36" r="7" fill="var(--brand-ink)" opacity="0.9" />
        <circle cx="56" cy="36" r="7" fill="var(--brand-ink)" opacity="0.9" />
        <circle cx="43" cy="56" r="7" fill="var(--brand-ink)" opacity="0.9" />
        <path
          d="M36 40l4 10M50 40l-4 10M37 36h12"
          stroke="var(--brand-ink)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    ),
  },
  {
    id: 'maintenance',
    eyebrow: 'OUR SERVICES',
    title: 'Website Maintenance',
    chips: ['Updates', 'Monitoring', 'Bug Fixes', 'Uptime', 'Security'],
    description:
      'A live site needs upkeep. We handle it so you find out about a problem from us, not from a customer.',
    cta: 'Talk about ongoing support',
    accent: '#fb7185',
    bg: 'linear-gradient(135deg, rgb(72, 24, 36), rgb(10, 10, 10))',
    icon: (gid) => (
      <svg width="86" height="86" viewBox="0 0 86 86" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fda4af" />
            <stop offset="1" stopColor="#fb7185" />
          </linearGradient>
        </defs>
        <circle cx="43" cy="43" r="40" fill={`url(#${gid})`} opacity="0.98" />
        <path
          d="M43 24l18 8v14c0 12-8 22-18 26-10-4-18-14-18-26V32l18-8Z"
          stroke="var(--brand-ink)"
          strokeWidth="4.5"
          strokeLinejoin="round"
          fill="none"
          opacity="0.9"
        />
        <path
          d="M35 44l6 6 12-12"
          stroke="var(--brand-ink)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
      </svg>
    ),
  },
  {
    id: 'ops-setup',
    eyebrow: 'OUR SERVICES',
    title: 'Digital Business Setup',
    chips: ['Domain & Hosting', 'ClickUp', 'Google Workspace', 'Email', 'Ops Setup'],
    description:
      "Standing up the operational side of a digital business — so you're running things, not researching how to set them up.",
    cta: 'Talk about getting set up',
    accent: '#67e8f9',
    bg: 'linear-gradient(135deg, rgb(14, 56, 64), rgb(10, 10, 10))',
    icon: (gid) => (
      <svg width="86" height="86" viewBox="0 0 86 86" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#a5f3fc" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <circle cx="43" cy="43" r="40" fill={`url(#${gid})`} opacity="0.98" />
        <rect
          x="26"
          y="30"
          width="34"
          height="26"
          rx="4"
          stroke="var(--brand-ink)"
          strokeWidth="4.5"
          fill="none"
          opacity="0.9"
        />
        <path
          d="M34 56h18M43 56v6"
          stroke="var(--brand-ink)"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    ),
  },
  {
    id: 'branding',
    eyebrow: 'COMING SOON',
    title: 'Branding & Identity',
    chips: [],
    description: 'Coming soon.',
    cta: '',
    locked: true,
    accent: '#a3a3a3',
    bg: 'linear-gradient(135deg, rgb(40, 40, 40), rgb(10, 10, 10))',
    icon: (gid) => (
      <svg width="86" height="86" viewBox="0 0 86 86" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#d4d4d4" />
            <stop offset="1" stopColor="#737373" />
          </linearGradient>
        </defs>
        <circle cx="43" cy="43" r="40" fill={`url(#${gid})`} opacity="0.98" />
        <path
          d="M43 20c8.8 0 16.7 3.6 22.4 9.4L43 43V20Z"
          fill="var(--brand-ink)"
          opacity="0.88"
        />
        <path
          d="M66.4 29.4c5.8 5.8 9.4 13.7 9.4 22.6H43l23.4-22.6Z"
          fill="var(--brand-ink)"
          opacity="0.88"
        />
        <path
          d="M75.8 52c0 8.9-3.6 16.8-9.4 22.6L43 52h32.8Z"
          fill="var(--brand-ink)"
          opacity="0.88"
        />
        <path
          d="M66.4 74.6C60.7 80.4 52.8 84 44 84V52l22.4 22.6Z"
          fill="var(--brand-ink)"
          opacity="0.88"
        />
      </svg>
    ),
  },
]

const CARD_COUNT = SERVICE_CARDS.length
const TITLE_DESKTOP: React.CSSProperties = {
  fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
  letterSpacing: '-0.03em',
  lineHeight: 1.02,
  color: 'rgba(255,255,255,0.9)',
}
const TITLE_MOBILE: React.CSSProperties = {
  fontSize: 'clamp(2.2rem, 7vw, 3.2rem)',
  letterSpacing: '-0.03em',
  lineHeight: 1.02,
  color: 'rgba(255,255,255,0.9)',
}

function ServiceCardBody({
  card,
  onCta,
  titleStyle,
}: {
  card: ServiceCard
  onCta: () => void
  titleStyle: React.CSSProperties
}) {
  return (
    <>
      {/* Ambient watermark — fills dead space below CTA; behind all copy */}
      <div
        className="card-watermark"
        aria-hidden="true"
        style={{ ['--wm-accent' as string]: card.accent }}
      >
        <div className="card-watermark-glyph">{card.icon(`${card.id}-wm`)}</div>
      </div>

      <div className="card-copy">
        <p className="service-pill">{card.eyebrow}</p>
        <h2 className="mt-4 font-extrabold" style={titleStyle}>
          {card.title}
        </h2>

        {!card.locked && card.chips.length > 0 ? (
          <div className="chip-row" aria-label={`${card.title} offerings`}>
            {card.chips.map((chip) => (
              <span key={chip} className="chip">
                {chip}
              </span>
            ))}
          </div>
        ) : null}

        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
          {card.description}
        </p>

        {card.locked ? (
          <span className="coming-soon-badge">Coming Soon</span>
        ) : (
          <button
            type="button"
            onClick={onCta}
            className="service-cta"
            style={{ backgroundColor: card.accent, borderColor: 'rgba(0,0,0,0.15)' }}
          >
            <span className="service-cta-badge" />
            {card.cta}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      <div className="icon-wrap">
        <div className="icon-shell">{card.icon(`${card.id}-badge`)}</div>
      </div>
    </>
  )
}

type ReelMode = 'desktop' | 'mobile'

/** Stepped peek blur — toggled, never interpolated. */
const PEEK_BLUR = 'blur(3px)'

function ReelCard({
  card,
  index,
  activeFloat,
  mode,
  onCta,
}: {
  card: ServiceCard
  index: number
  activeFloat: MotionValue<number>
  mode: ReelMode
  onCta: () => void
}) {
  // All derived values are raw useTransform — 1:1 with scroll, no per-property springs.
  const scale = useTransform(activeFloat, (v) => {
    if (mode === 'mobile') return 1
    const d = Math.abs(index - v)
    if (d >= 1.5) return 0.82
    return 1 - Math.min(d, 1) * 0.15
  })

  const opacity = useTransform(activeFloat, (v) => {
    const d = Math.abs(index - v)
    // Lead card stays fully opaque across its dwell so peek siblings cannot show through.
    if (d < 0.55) return 1
    if (mode === 'mobile') {
      if (d < 0.85) return 1 - (d - 0.55) / 0.3
      return 0
    }
    if (d >= 1.5) return 0
    if (d <= 1) return 1 - ((d - 0.55) / 0.45) * 0.65 // 1 → 0.35
    return 0.35 * (1 - (d - 1) / 0.5) // 0.35 → 0
  })

  const y = useTransform(activeFloat, (v) => {
    const d = index - v
    if (mode === 'mobile') {
      return Math.max(-1, Math.min(1, d)) * 72
    }
    return Math.max(-1.5, Math.min(1.5, d)) * 140
  })

  // Closer cards always stack above — avoids z-ties during mid-transition.
  const zIndex = useTransform(activeFloat, (v) =>
    Math.round(1000 - Math.abs(index - v) * 100),
  )

  // Locked = grayscale; peek = fixed blur. Never animate blur amount.
  const filter = useTransform(activeFloat, (v) => {
    const d = Math.abs(index - v)
    const parts: string[] = []
    if (card.locked) parts.push('grayscale(0.35)')
    if (mode !== 'mobile' && d >= 0.55) parts.push(PEEK_BLUR)
    return parts.length ? parts.join(' ') : 'none'
  })

  const pointerEvents = useTransform(opacity, (o) => (o < 0.04 ? 'none' : 'auto'))

  return (
    <motion.article
      className={`reel-card${card.locked ? ' is-locked' : ''}`}
      style={{
        scale,
        opacity,
        y,
        zIndex,
        filter,
        pointerEvents,
        ['--accent' as string]: card.accent,
        backgroundColor: '#0a0a0a',
        backgroundImage: card.bg,
      }}
      layout={false}
    >
      <div className="stack-inner">
        <ServiceCardBody
          card={card}
          onCta={onCta}
          titleStyle={mode === 'mobile' ? TITLE_MOBILE : TITLE_DESKTOP}
        />
      </div>
    </motion.article>
  )
}

const ServiceCardReel = memo(function ServiceCardReel({
  cards,
  mode,
  onCta,
}: {
  cards: ServiceCard[]
  mode: ReelMode
  onCta: () => void
}) {
  const runwayRef = React.useRef<HTMLDivElement>(null)
  const [stickOffset, setStickOffset] = React.useState('140px')

  React.useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w <= 768) setStickOffset('92px')
      else if (w <= 1024) setStickOffset('110px')
      else setStickOffset('140px')
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    // Progress 0 when sticky engages; 1 when runway releases into next section.
    offset: [`start ${stickOffset}`, 'end end'],
  })

  // Continuous index with a short dwell on first/last so they fully resolve.
  const activeFloat = useTransform(scrollYProgress, (p) => {
    const max = Math.max(cards.length - 1, 0)
    if (max === 0) return 0
    const startHold = 0.04
    const endHold = 0.04
    if (p <= startHold) return 0
    if (p >= 1 - endHold) return max
    return ((p - startHold) / (1 - startHold - endHold)) * max
  })

  return (
    <div
      ref={runwayRef}
      className="reel-runway"
      style={{ ['--reel-count' as string]: cards.length }}
    >
      {/* Deep-link anchors distributed along the runway (footer #hashes) */}
      {cards.map((card, i) => (
        <div
          key={`anchor-${card.id}`}
          id={card.id}
          className="reel-anchor"
          style={{
            top:
              cards.length <= 1
                ? '0%'
                : `${(i / (cards.length - 1)) * 100}%`,
          }}
        />
      ))}

      <div className="reel-sticky">
        <div className="reel-frame" aria-label="Services card reel">
          {cards.map((card, index) => (
            <ReelCard
              key={card.id}
              card={card}
              index={index}
              activeFloat={activeFloat}
              mode={mode}
              onCta={onCta}
            />
          ))}
        </div>
      </div>
    </div>
  )
})

function StaticServiceList({
  cards,
  onCta,
}: {
  cards: ServiceCard[]
  onCta: () => void
}) {
  return (
    <div className="reel-static">
      {cards.map((card) => (
        <article
          key={card.id}
          id={card.id}
          className={`reel-static-card${card.locked ? ' is-locked' : ''}`}
          style={{
            ['--accent' as string]: card.accent,
            backgroundColor: '#0a0a0a',
            backgroundImage: card.bg,
          }}
        >
          <div className="stack-inner">
            <ServiceCardBody card={card} onCta={onCta} titleStyle={TITLE_MOBILE} />
          </div>
        </article>
      ))}
    </div>
  )
}

export default function ServicesPage() {
  const navigate = useNavigate()
  const cards = SERVICE_CARDS
  const isMobile = useIsMobile()
  const prefersReducedMotion = useReducedMotion()
  const { mountStage } = useReveal()
  const [showBackground, setShowBackground] = useState(false)
  useEffect(() => {
    const t1 = requestAnimationFrame(() => {
      const t2 = requestAnimationFrame(() => {
        const t = setTimeout(() => setShowBackground(true), 100)
        return () => clearTimeout(t)
      })
      return () => cancelAnimationFrame(t2)
    })
    return () => cancelAnimationFrame(t1)
  }, [])
  const onCta = useCallback(() => navigate('/contact'), [navigate])
  const reelMode: ReelMode = isMobile ? 'mobile' : 'desktop'

  return (
    <section
      className="relative min-h-screen bg-page text-white"
      aria-labelledby="services-heading"
    >
      <style>{`
        .services-shell {
          font-family: 'Sora', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .services-shell h2 {
          letter-spacing: -0.03em;
        }

        /* One tall runway; sticky frame holds the absolute card stack */
        .reel-runway {
          position: relative;
          height: calc(var(--reel-count, ${CARD_COUNT}) * clamp(520px, 82vh, 760px));
        }
        .reel-anchor {
          position: absolute;
          left: 0;
          width: 1px;
          height: 1px;
          pointer-events: none;
          visibility: hidden;
        }
        .reel-sticky {
          position: sticky;
          top: 140px;
          z-index: 2;
        }
        .reel-frame {
          position: relative;
          max-width: 1120px;
          margin-inline: auto;
          min-height: 640px;
          height: clamp(560px, 72vh, 720px);
        }
        .reel-card {
          position: absolute;
          inset: 0;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 40px 90px rgba(0,0,0,0.75);
          overflow: hidden;
          transform-origin: center center;
          /* Opaque floor under gradient — blocks peek cards from bleeding through */
          background-color: #0a0a0a;
          isolation: isolate;
          /* Promote transform/opacity layers only — not filter (filter will-change is costly) */
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        .reel-card.is-locked {
          border: 1px dashed rgba(255,255,255,0.2);
          box-shadow: 0 24px 60px rgba(0,0,0,0.45);
        }
        .stack-inner {
          position: relative;
          padding: 58px 56px;
          min-height: 640px;
          height: 100%;
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.9fr);
          gap: 24px;
          align-items: stretch;
          z-index: 0;
        }
        .card-copy,
        .icon-wrap {
          position: relative;
          z-index: 2;
        }
        .card-watermark {
          position: absolute;
          right: -6%;
          bottom: -10%;
          width: min(420px, 58%);
          height: min(420px, 72%);
          z-index: 0;
          pointer-events: none;
          display: grid;
          place-items: center;
          color: var(--wm-accent);
        }
        .card-watermark::before {
          content: '';
          position: absolute;
          inset: 8%;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            color-mix(in srgb, var(--wm-accent) 55%, transparent) 0%,
            transparent 68%
          );
          opacity: 0.35;
        }
        .card-watermark-glyph {
          position: relative;
          width: 86px;
          height: 86px;
          transform: scale(4.4);
          transform-origin: center center;
          opacity: 0.09;
        }
        .card-watermark-glyph svg {
          display: block;
          width: 86px;
          height: 86px;
        }
        .chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 14px;
        }
        .chip {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.7);
          /* Solid paint only — backdrop-filter samples sibling peek cards through the stack */
          background: rgba(0, 0, 0, 0.45);
        }
        .service-cta {
          margin-top: 18px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.08);
          color: rgba(0,0,0,0.9);
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: transform 0.18s ease, background 0.18s ease;
        }
        .service-cta:hover { transform: translateY(-1px); background: rgba(255,255,255,0.12); }
        .service-cta:active { transform: translateY(0px); }
        .service-cta:focus-visible {
          outline: 2px solid var(--focus-ring);
          outline-offset: 3px;
        }
        .service-cta-badge {
          width: 12px; height: 12px; border-radius: 999px;
          background: var(--accent);
          box-shadow: 0 0 26px color-mix(in srgb, var(--accent) 45%, transparent);
        }
        .coming-soon-badge {
          margin-top: 18px;
          display: inline-flex;
          align-items: center;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px dashed rgba(255,255,255,0.28);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.55);
          font-family: 'DM Mono', monospace;
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .icon-wrap {
          display: flex;
          justify-content: flex-end;
          align-items: flex-start;
        }
        .icon-shell {
          width: 150px;
          height: 150px;
          display: grid;
          place-items: center;
          border-radius: 28px;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255,255,255,0.10);
        }

        /* Reduced-motion / no-JS-friendly fallback list */
        .reel-static {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .reel-static-card {
          position: relative;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 40px 90px rgba(0,0,0,0.75);
          overflow: hidden;
          max-width: 1120px;
          margin-inline: auto;
          width: 100%;
          background-color: #0a0a0a;
          isolation: isolate;
        }
        .reel-static-card.is-locked {
          border: 1px dashed rgba(255,255,255,0.2);
          box-shadow: 0 24px 60px rgba(0,0,0,0.45);
          filter: grayscale(0.35);
        }

        @media (max-width: 1024px) {
          .reel-sticky { top: 110px; }
          .reel-runway { height: calc(var(--reel-count, ${CARD_COUNT}) * clamp(520px, 78vh, 720px)); }
          .reel-frame { min-height: 620px; height: clamp(540px, 70vh, 700px); }
          .stack-inner { grid-template-columns: 1fr; min-height: 620px; padding: 44px 36px; }
          .icon-wrap { justify-content: flex-start; }
          .card-watermark {
            width: min(360px, 70%);
            height: min(360px, 58%);
            right: -8%;
            bottom: -8%;
          }
          .card-watermark-glyph { transform: scale(3.6); }
        }
        @media (max-width: 768px) {
          .reel-sticky { top: 92px; }
          .reel-runway { height: calc(var(--reel-count, ${CARD_COUNT}) * clamp(500px, 74vh, 660px)); }
          .reel-frame { min-height: 560px; height: clamp(520px, 68vh, 640px); }
          .reel-card { border-radius: 20px; }
          .stack-inner { padding: 34px 24px; min-height: 560px; }
          .icon-shell { width: 120px; height: 120px; border-radius: 24px; }
          .chip { font-size: 10px; padding: 6px 9px; }
          .reel-static-card { border-radius: 20px; }
          .card-watermark {
            width: min(280px, 78%);
            height: min(280px, 52%);
          }
          .card-watermark-glyph { transform: scale(3.1); opacity: 0.07; }
        }
        .service-pill {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none">
        {mountStage >= 3 && showBackground && !isMobile && !prefersReducedMotion ? (
          <BackgroundRippleEffect rows={9} cols={24} cellSize={58} interactive={false} />
        ) : null}
        <div
          className="absolute -top-40 left-1/2 h-[640px] w-[900px] -translate-x-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgb(var(--brand-gold-rgb) / 0.07) 0%, transparent 65%)',
          }}
        />
      </div>

      <div className="services-shell relative z-10 mx-auto max-w-6xl px-6 pt-36 pb-24 sm:pt-40 lg:px-10 lg:pt-44 lg:pb-28">
        <header className="mb-14">
          <SectionEyebrow variant="pillMono">What we do</SectionEyebrow>
          <h1
            id="services-heading"
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.4rem]"
          >
            Services Built Around What Actually Grows Your Business
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65">
            Seven ways we help — pick the one that matches what you&apos;re building, or tell us
            the problem and we&apos;ll point you to the right one.
          </p>
        </header>

        {prefersReducedMotion ? (
          <StaticServiceList cards={cards} onCta={onCta} />
        ) : (
          <ServiceCardReel cards={cards} mode={reelMode} onCta={onCta} />
        )}

        <ToolPhysicsPlayground />

        <section className="mt-28 border-t border-white/10 pt-16">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-2xl">
              <SectionEyebrow variant="plain">Next step</SectionEyebrow>
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Not sure which one fits?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/65">
                Tell us what you&apos;re trying to solve. We&apos;ll tell you which service actually
                applies — or if none of them do.
              </p>
            </div>

            <SecondaryCta variant="solid" onClick={() => navigate('/contact')}>
              Talk to us
            </SecondaryCta>
          </div>
        </section>
      </div>
    </section>
  )
}
