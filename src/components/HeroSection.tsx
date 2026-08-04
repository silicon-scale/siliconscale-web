'use client'

import { memo, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { CountUpNumber } from '@/components/ui/CountUpNumber'
import { cn } from '@/lib/utils'

/* ─── Light Beam — identical to the About page's mission hero ─────────── */
function LightBeam() {
  return (
    <div
      className="light-beam"
      style={{
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-55%)',
        width: '62%',
        height: '80%',
        pointerEvents: 'none',
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 900 600" preserveAspectRatio="xMinYMid meet">
        <defs>
          <radialGradient
            id="beamOuter"
            cx="0%"
            cy="50%"
            r="100%"
            gradientUnits="userSpaceOnUse"
            fx="0"
            fy="300"
          >
            <stop offset="0%" stopColor="#c8dcff" stopOpacity="0.0" />
            <stop offset="10%" stopColor="#c8dcff" stopOpacity="0.22" />
            <stop offset="55%" stopColor="#7aabee" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <radialGradient
            id="beamCore"
            cx="0%"
            cy="50%"
            r="55%"
            gradientUnits="userSpaceOnUse"
            fx="0"
            fy="300"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="20%" stopColor="#daeaff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* wide soft halo */}
        <polygon points="0,300 900,0 900,600" fill="url(#beamOuter)" />
        {/* tight bright core */}
        <polygon points="0,300 900,240 900,360" fill="url(#beamCore)" />
        {/* razor center */}
        <line x1="0" y1="300" x2="900" y2="300" stroke="white" strokeWidth="1.2" strokeOpacity="0.55" />
      </svg>
    </div>
  )
}

/* ─── Section Label — identical to the About page's [ TEXT ] eyebrow ──── */
function SectionLabel({ text }: { text: string }) {
  return (
    <p
      style={{
        fontFamily: "'DM Mono',monospace",
        fontSize: 12,
        letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.55)',
        marginBottom: 48,
        textTransform: 'uppercase',
      }}
    >
      {'[ ' + text + ' ]'}
    </p>
  )
}

const HEADLINE_WORDS = [
  { text: 'Design.', color: 'rgba(255,255,255,0.22)' },
  { text: 'Build.', color: 'rgba(255,255,255,0.55)' },
  { text: 'Grow.', color: 'rgba(255,255,255,0.85)' },
] as const

const HEADLINE_STYLE = {
  position: 'relative' as const,
  zIndex: 2,
  fontSize: 'clamp(54px,9vw,136px)',
  fontWeight: 700,
  lineHeight: 1.0,
  letterSpacing: '-0.035em',
  maxWidth: 800,
}

/**
 * "Design. Build. Grow." — each word drops in from above, one at a time,
 * and lands with a decaying gravity bounce. Pure CSS `@keyframes` (see
 * the .word-drop rule below) rather than a JS-driven animation library —
 * it runs the moment the element paints, with no dependency on React
 * effect timing, hook state, or hydration order. Per-keyframe
 * animation-timing-function alternates ease-in (falling, accelerating)
 * and ease-out (rising off a bounce, decelerating) to read as gravity
 * rather than a generic bounce easing curve.
 */
function MissionHeadline() {
  return (
    <h1 style={HEADLINE_STYLE}>
      {HEADLINE_WORDS.map((w, i) => (
        <span
          key={w.text}
          className="word-drop"
          style={{
            color: w.color,
            marginRight: i < HEADLINE_WORDS.length - 1 ? '0.28em' : 0,
            animationDelay: `${i * 1.15}s`,
          }}
        >
          {w.text}
        </span>
      ))}
    </h1>
  )
}

const STATS = [
  {
    value: '12+',
    label: 'Real Projects Delivered',
    sub: 'Across e-commerce, internal tools, and AI systems',
  },
  {
    value: '2.5+',
    label: 'Years Building',
    sub: 'Designing & shipping on the web',
  },
  {
    value: '95%',
    label: 'Client Retention',
    sub: 'Teams that keep coming back',
  },
  {
    value: '6+',
    label: 'Businesses Served',
    sub: 'From early-stage to growing teams',
  },
] as const

/**
 * Self-contained one-shot IntersectionObserver — deliberately not the
 * shared `useInViewOnce` (@/hooks/useInViewOnce -> sharedScrollRevealObserver
 * singleton). Same idea as the headline fix: fewer shared/hidden moving
 * parts to go wrong across hot-reloads, so this component owns its own
 * observer end to end.
 */
function useLocalInViewOnce<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(disabled)

  useEffect(() => {
    if (disabled) {
      setInView(true)
      return
    }

    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const alreadyVisible = rect.top < window.innerHeight * 0.94 && rect.bottom > window.innerHeight * 0.06
    if (alreadyVisible) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [disabled])

  return { ref, inView }
}

/**
 * Same stat-row treatment as the Highlights section (CountUpNumber,
 * index numbering, font-bagel figure) so this block and Highlights read
 * as one system even though this one lives inside the mission hero.
 */
function HeroStatRow({ stat, index }: { stat: (typeof STATS)[number]; index: number }) {
  const prefersReducedMotion = useReducedMotion()
  const { ref, inView } = useLocalInViewOnce<HTMLDivElement>(!!prefersReducedMotion)

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-3',
        index !== 0 && 'sm:border-l sm:border-white/10 sm:pl-8 lg:pl-10',
      )}
    >
      <div className="flex items-baseline gap-3">
        <span
          className="shrink-0 text-[11px] font-bold tracking-[0.12em] text-white/20 tabular-nums"
          aria-hidden
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <CountUpNumber
          value={stat.value}
          animate={inView}
          className="font-bagel leading-none tracking-tight text-white"
          style={{ fontSize: 'clamp(2.6rem, 4.5vw, 3.75rem)' }}
        />
      </div>
      <div className="text-base font-medium text-white/90 sm:text-lg">{stat.label}</div>
      <div className="text-[0.78rem] text-white/60 sm:text-xs">{stat.sub}</div>
    </div>
  )
}

/**
 * Landing hero — the About page's Mission + Stats sections, used verbatim
 * (same markup, same inline styles, same classes) as the site's front door.
 */
function HeroSectionComponent() {
  return (
    <div style={{ background: '#000', color: '#fff', fontFamily: "'Sora','Helvetica Neue',sans-serif", overflowX: 'hidden' }}>
      <style>{`
        .join-btn {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid rgba(255,255,255,0.28);
          padding: 12px 24px; border-radius: 8px;
          font-family: 'DM Mono',monospace; font-size: 11px;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #fff; background: transparent; cursor: pointer;
          text-decoration: none; transition: background 0.25s, border-color 0.25s;
        }
        .join-btn:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.55); }
        .join-btn:focus-visible {
          outline: 2px solid var(--focus-ring);
          outline-offset: 3px;
        }

        @keyframes heroWordDrop {
          0% { transform: translateY(-240px); opacity: 0; animation-timing-function: ease-in; }
          5% { opacity: 1; }
          42% { transform: translateY(0); animation-timing-function: ease-out; }
          55% { transform: translateY(-60px); animation-timing-function: ease-in; }
          70% { transform: translateY(0); animation-timing-function: ease-out; }
          79% { transform: translateY(-22px); animation-timing-function: ease-in; }
          88% { transform: translateY(0); animation-timing-function: ease-out; }
          94% { transform: translateY(-6px); animation-timing-function: ease-in; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .word-drop {
          display: inline-block;
          animation-name: heroWordDrop;
          animation-duration: 1.4s;
          animation-timing-function: ease-in;
          animation-fill-mode: both;
          animation-iteration-count: 1;
          will-change: transform, opacity;
        }

        .mission-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 56px 110px;
          overflow: hidden;
        }

        .bottom-row {
          position: absolute;
          bottom: 36px;
          left: 56px;
          right: 56px;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          flex-wrap: wrap;
        }

        .stats-section {
          padding: 0 56px 56px;
        }

        .light-beam {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-55%);
          width: 62%;
          height: 80%;
          pointer-events: none;
        }

        @media (max-width: 1024px) {
          .mission-section { padding: 50px 40px 90px; }
          .bottom-row { left: 40px; right: 40px; bottom: 30px; }
          .stats-section { padding: 0 40px 44px; }
          .light-beam { width: 50%; height: 70%; }
        }

        @media (max-width: 768px) {
          .mission-section { padding: 10px 20px 80px; }
          .bottom-row { left: 20px; right: 20px; bottom: 20px; flex-direction: column; align-items: flex-start; gap: 16px; }
          .stats-section { padding: 0 20px 36px; }
          .light-beam { display: none; }
        }

        @media (max-width: 480px) {
          .mission-section { padding: 5px 16px 60px; }
          .bottom-row { left: 16px; right: 16px; bottom: 16px; }
          .stats-section { padding: 0 16px 28px; }
        }
      `}</style>

      {/* ════ HERO / MISSION ════ */}
      <section className="mission-section" aria-label="Hero">
        <LightBeam />

        <ScrollReveal style={{ position: 'relative', zIndex: 2 }}>
          <SectionLabel text="OUR MISSION" />
        </ScrollReveal>

        <MissionHeadline />

        <ScrollReveal delay={0.16} className="bottom-row">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: 'rgba(255,255,255,0.55)',
              fontSize: 20,
            }}
          >
            ↓
          </div>
          <p
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 13,
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.52)',
              fontWeight: 300,
              maxWidth: 540,
            }}
          >
            SiliconScale builds the systems, stores, and automation that let a business run with
            less friction and more revenue. We&apos;re not chasing awards — we&apos;re building
            things that work, and hold up under real use.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/contact" className="join-btn">
              Start a project
            </Link>
            <Link to="/work" className="join-btn">
              See our work
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ════ STATS — same treatment as the Highlights section, one horizontal row ════ */}
      <div className="stats-section">
        <div className="border-t border-white/8 pt-12">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-6 lg:gap-x-10">
            {STATS.map((stat, index) => (
              <HeroStatRow key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const HeroSection = memo(HeroSectionComponent)