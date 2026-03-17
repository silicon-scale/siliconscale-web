'use client'

import React from 'react'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import { ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'

type ServiceCard = {
  id: string
  title: string
  eyebrow: string
  description: string
  chips: string[]
  cta: string
  accent: string
  bg: string
  icon: React.ReactNode
}

const SERVICE_CARDS: ServiceCard[] = [
  {
    id: 'branding',
    eyebrow: 'OUR SERVICES',
    title: 'Branding',
    chips: ['Branding', 'Pitch Deck', 'Rebranding', 'Design System', 'Graphic Design'],
    description:
      'Exceptional brands deserve memorable identities. We craft strategic systems that captivate users, earn trust, and scale across every touchpoint.',
    cta: 'Branding services',
    accent: '#b6f56a',
    bg: 'linear-gradient(135deg, rgba(38,60,22,0.92), rgba(10,10,10,0.98))',
    icon: (
      <svg width="86" height="86" viewBox="0 0 86 86" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#b6f56a" />
            <stop offset="1" stopColor="#35f2c2" />
          </linearGradient>
        </defs>
        <circle cx="43" cy="43" r="40" fill="url(#g1)" opacity="0.98" />
        <path
          d="M43 20c8.8 0 16.7 3.6 22.4 9.4L43 43V20Z"
          fill="#0b0b0b"
          opacity="0.88"
        />
        <path
          d="M66.4 29.4c5.8 5.8 9.4 13.7 9.4 22.6H43l23.4-22.6Z"
          fill="#0b0b0b"
          opacity="0.88"
        />
        <path
          d="M75.8 52c0 8.9-3.6 16.8-9.4 22.6L43 52h32.8Z"
          fill="#0b0b0b"
          opacity="0.88"
        />
        <path
          d="M66.4 74.6C60.7 80.4 52.8 84 44 84V52l22.4 22.6Z"
          fill="#0b0b0b"
          opacity="0.88"
        />
      </svg>
    ),
  },
  {
    id: 'design',
    eyebrow: 'OUR SERVICES',
    title: 'Design',
    chips: ['UI/UX Design', 'Web Design', 'Mobile App Design', 'Website Redesign', 'UX/UI Audit'],
    description:
      'We design intuitive, engaging products built for user satisfaction. Research-backed UX and polished UI that feels effortless to use—and hard to ignore.',
    cta: 'Design services',
    accent: '#d6a6ff',
    bg: 'linear-gradient(135deg, rgba(52,28,72,0.95), rgba(10,10,10,0.98))',
    icon: (
      <svg width="86" height="86" viewBox="0 0 86 86" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#ff9bd6" />
            <stop offset="1" stopColor="#c6a0ff" />
          </linearGradient>
        </defs>
        <circle cx="43" cy="43" r="40" fill="url(#g2)" opacity="0.98" />
        <path
          d="M43 24l5.6 13.6L62 43l-13.4 5.4L43 62l-5.6-13.6L24 43l13.4-5.4L43 24Z"
          fill="#0b0b0b"
          opacity="0.9"
        />
      </svg>
    ),
  },
  {
    id: 'development',
    eyebrow: 'OUR SERVICES',
    title: 'Development',
    chips: ['Web Apps', 'Landing Systems', 'Performance', 'SEO', 'Integrations'],
    description:
      'Production-grade builds with clean architecture, fast loads, and scalable foundations. Built to ship quickly—and keep working reliably.',
    cta: 'Development services',
    accent: '#7dd3fc',
    bg: 'linear-gradient(135deg, rgba(12,42,78,0.95), rgba(10,10,10,0.98))',
    icon: (
      <svg width="86" height="86" viewBox="0 0 86 86" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#6ee7ff" />
            <stop offset="1" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
        <circle cx="43" cy="43" r="40" fill="url(#g3)" opacity="0.98" />
        <path
          d="M29 34l-9 9 9 9M57 34l9 9-9 9"
          stroke="#0b0b0b"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
      </svg>
    ),
  },
  {
    id: 'ai',
    eyebrow: 'OUR SERVICES',
    title: 'AI & Automation',
    chips: ['AI Chat', 'Search', 'Workflows', 'Internal Tools', 'Support'],
    description:
      'Practical AI that removes manual work and upgrades user experience. Automations, smart features, and assistants that feel natural—never gimmicky.',
    cta: 'AI services',
    accent: '#fbbf24',
    bg: 'linear-gradient(135deg, rgba(74,52,12,0.92), rgba(10,10,10,0.98))',
    icon: (
      <svg width="86" height="86" viewBox="0 0 86 86" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="g4" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fde68a" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <circle cx="43" cy="43" r="40" fill="url(#g4)" opacity="0.98" />
        <path
          d="M43 26c6.3 0 11.5 5.2 11.5 11.5S49.3 49 43 49s-11.5-5.2-11.5-11.5S36.7 26 43 26Z"
          fill="#0b0b0b"
          opacity="0.9"
        />
        <path
          d="M30 61c3.2-7.2 9-10.8 13-10.8S52.8 53.8 56 61"
          stroke="#0b0b0b"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    ),
  },
]

function StackingServiceCard({
  card,
  index,
  onCta,
}: {
  card: ServiceCard
  index: number
  onCta: () => void
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 85%', 'end 40%'],
  })

  // Webflow-like smoothness: spring the progress, then derive transforms.
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.6 })
  const baseStackOffset = index * 10
  const y = useTransform(p, [0, 1], [36 + baseStackOffset, baseStackOffset])
  const opacity = useTransform(p, [0, 1], [0.95, 1])

  return (
    <div ref={ref} className="stack-step" id={card.id}>
      <motion.article
        className="stack-card"
        style={{
          y,
          opacity,
          zIndex: index + 1,
          ['--accent' as any]: card.accent,
          background: card.bg,
        }}
        transition={{ type: 'spring' }}
      >
        <div className="stack-inner">
          <div>
            <p className="service-pill">{card.eyebrow}</p>
            <h2
              className="mt-4 font-extrabold"
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
                letterSpacing: '-0.03em',
                lineHeight: 1.02,
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              {card.title}
            </h2>

            <div className="chip-row" aria-label={`${card.title} offerings`}>
              {card.chips.map((chip) => (
                <span key={chip} className="chip">
                  {chip}
                </span>
              ))}
            </div>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
              {card.description}
            </p>

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
          </div>

          <div className="icon-wrap">
            <div className="icon-shell">{card.icon}</div>
          </div>
        </div>
      </motion.article>
    </div>
  )
}

export default function ServicesPage() {
  const navigate = useNavigate()
  const cards = SERVICE_CARDS
  const isMobile = useIsMobile()
  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#050505] text-white"
      aria-labelledby="services-heading"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Mono:wght@300;400&display=swap');
        .services-shell {
          font-family: 'Sora', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .services-shell h2 {
          letter-spacing: -0.03em;
        }
        .stack-wrap {
          position: relative;
        }
        .stack-step {
          position: relative;
          /* Each step controls spacing between stacked cards */
          height: clamp(520px, 82vh, 760px);
        }
        .stack-card {
          position: sticky;
          top: 140px;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 40px 90px rgba(0,0,0,0.75);
          overflow: hidden;
          transform: translateZ(0);
          will-change: transform;
          max-width: 1120px;
          margin-inline: auto;
        }
        .stack-inner {
          padding: 58px 56px;
          min-height: 640px;
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.9fr);
          gap: 24px;
          align-items: stretch;
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
          background: rgba(0,0,0,0.12);
          backdrop-filter: blur(8px);
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
        .service-cta-badge {
          width: 12px; height: 12px; border-radius: 999px;
          background: var(--accent);
          box-shadow: 0 0 26px color-mix(in srgb, var(--accent) 45%, transparent);
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
          background: rgba(0,0,0,0.14);
          border: 1px solid rgba(255,255,255,0.10);
          backdrop-filter: blur(10px);
        }

        @media (max-width: 1024px) {
          .stack-card { top: 110px; }
          .stack-inner { grid-template-columns: 1fr; min-height: 620px; padding: 44px 36px; }
          .icon-wrap { justify-content: flex-start; }
          .stack-step { height: clamp(520px, 78vh, 720px); }
        }
        @media (max-width: 768px) {
          .stack-card { top: 92px; border-radius: 20px; }
          .stack-inner { padding: 34px 24px; min-height: 560px; }
          .icon-shell { width: 120px; height: 120px; border-radius: 24px; }
          .chip { font-size: 10px; padding: 6px 9px; }
          .stack-step { height: clamp(500px, 74vh, 660px); }
        }
        .service-pill {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }
      `}</style>

      {/* Background ripple layer */}
      <div className="absolute inset-0 pointer-events-none">
        {!isMobile ? (
          <BackgroundRippleEffect rows={9} cols={24} cellSize={58} interactive={false} />
        ) : null}
        {/* soft top glow to match theme */}
        <div
          className="absolute -top-40 left-1/2 h-[640px] w-[900px] -translate-x-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgba(201,169,110,0.07) 0%, transparent 65%)',
          }}
        />
      </div>

      <div className="services-shell relative z-10 mx-auto max-w-6xl px-6 pt-36 pb-24 sm:pt-40 lg:px-10 lg:pt-44 lg:pb-28">
        {/* Header */}
        <header className="mb-14">
          <p className="mb-4 inline-flex w-fit items-center rounded-full border border-white/12 bg-white/5 px-3 py-1 font-mono text-[0.72rem] uppercase tracking-[0.26em] text-white/65">
            What we do
          </p>
          <h1
            id="services-heading"
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.4rem]"
          >
            Services that move the needle
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65">
            Silicon Scale helps teams turn ideas into scalable digital products—from the
            first landing page to AI-powered internal tools. Each service is designed to
            be practical, measurable, and aligned with real business goals.
          </p>
        </header>

        {/* Stacked cards section */}
        <div className="stack-wrap">
          {cards.map((card, idx) => (
            isMobile ? (
              <div key={card.id} className="stack-step" id={card.id}>
                <article
                  className="stack-card"
                  style={{
                    zIndex: idx + 1,
                    ['--accent' as any]: card.accent,
                    background: card.bg,
                    transform: `translateY(${idx * 8}px) translateZ(0)`,
                  }}
                >
                  <div className="stack-inner">
                    <div>
                      <p className="service-pill">{card.eyebrow}</p>
                      <h2
                        className="mt-4 font-extrabold"
                        style={{
                          fontSize: 'clamp(2.2rem, 7vw, 3.2rem)',
                          letterSpacing: '-0.03em',
                          lineHeight: 1.02,
                          color: 'rgba(255,255,255,0.9)',
                        }}
                      >
                        {card.title}
                      </h2>

                      <div className="chip-row" aria-label={`${card.title} offerings`}>
                        {card.chips.map((chip) => (
                          <span key={chip} className="chip">
                            {chip}
                          </span>
                        ))}
                      </div>

                      <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
                        {card.description}
                      </p>

                      <button
                        type="button"
                        onClick={() => navigate('/contact')}
                        className="service-cta"
                        style={{ backgroundColor: card.accent, borderColor: 'rgba(0,0,0,0.15)' }}
                      >
                        <span className="service-cta-badge" />
                        {card.cta}
                        <ArrowUpRight className="h-4 w-4" aria-hidden />
                      </button>
                    </div>

                    <div className="icon-wrap">
                      <div className="icon-shell">{card.icon}</div>
                    </div>
                  </div>
                </article>
              </div>
            ) : (
              <StackingServiceCard
                key={card.id}
                card={card}
                index={idx}
                onCta={() => navigate('/contact')}
              />
            )
          ))}
        </div>

        {/* Next section after stack */}
        <section className="mt-28 border-t border-white/10 pt-16">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-2xl">
              <p className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-white/40">
                Next step
              </p>
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Not sure which service fits?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/65">
                Tell us what you’re building and we’ll recommend the best path—fast, clear, and aligned with your goals.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-white/90"
            >
              Talk to us
            </button>
          </div>
        </section>
      </div>
    </section>
  )
}

