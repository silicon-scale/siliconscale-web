'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'

const CARDS = [
  {
    number: '01',
    title: 'Discovery & Understanding',
    description:
      'We dive deep into your business, goals, and challenges. Through collaboration and research, we identify your unique needs to create a clear vision for your digital solution.',
    duration: '1-2 DAYS',
    icon: 'gold',
  },
  {
    number: '02',
    title: 'Strategy & Planning',
    description:
      'We analyze your market, competitors, and audience to craft a data-driven strategy. With a solid roadmap, we ensure every step aligns with your objectives, setting the foundation for success.',
    duration: '2-3 DAYS',
    icon: 'pink',
  },
  {
    number: '03',
    title: 'Design & Prototyping',
    description:
      'We translate strategy into intuitive interfaces and experiences. From wireframes to high-fidelity prototypes, we iterate with you until the solution feels right and performs.',
    duration: '3-5 DAYS',
    icon: 'blue',
  },
  {
    number: '04',
    title: 'Build & Launch',
    description:
      'We ship production-ready code with clean architecture and best practices. Rigorous testing and staged rollouts ensure a smooth launch and a product that scales with you.',
    duration: '2-4 WEEKS',
    icon: 'emerald',
  },
] as const

function StepIcon({ type }: { type: (typeof CARDS)[number]['icon'] }) {
  const size = 220

  if (type === 'gold') {
    return (
      <svg width={size} height={size} viewBox="0 0 160 160" className="flex-shrink-0">
        <defs>
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8c547" />
            <stop offset="100%" stopColor="#c9a96e" />
          </linearGradient>
        </defs>
        <rect x="20" y="20" width="120" height="120" rx="24" fill="none" stroke="url(#gold-grad)" strokeWidth="1.5" opacity="0.9" />
        <g stroke="url(#gold-grad)" strokeLinecap="round">
          <path d="M80 50 L80 110 M50 80 L110 80" opacity="0.6" strokeWidth="1.5" />
          <path d="M65 65 Q80 50 95 65 Q80 80 65 65" fill="none" strokeWidth="2" />
          <path d="M65 95 Q80 110 95 95 Q80 80 65 95" fill="none" strokeWidth="2" />
          <path d="M65 65 Q50 80 65 95 Q80 80 65 65" fill="none" strokeWidth="2" />
          <path d="M95 65 Q110 80 95 95 Q80 80 95 65" fill="none" strokeWidth="2" />
        </g>
      </svg>
    )
  }

  if (type === 'pink') {
    return (
      <svg width={size} height={size} viewBox="0 0 160 160" className="flex-shrink-0">
        <defs>
          <linearGradient id="pink-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <rect x="20" y="20" width="120" height="120" rx="24" fill="none" stroke="url(#pink-grad)" strokeWidth="1.5" opacity="0.9" />
        <g fill="none" stroke="url(#pink-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M80 45 Q100 60 80 75 Q60 60 80 45" opacity="0.9" />
          <path d="M80 75 Q100 90 80 115 Q60 90 80 75" opacity="0.9" />
          <path d="M80 75 Q60 60 45 80 Q60 100 80 75" opacity="0.9" />
          <path d="M80 75 Q100 90 115 80 Q100 60 80 75" opacity="0.9" />
        </g>
      </svg>
    )
  }

  if (type === 'blue') {
    return (
      <svg width={size} height={size} viewBox="0 0 160 160" className="flex-shrink-0">
        <defs>
          <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <rect x="20" y="20" width="120" height="120" rx="24" fill="none" stroke="url(#blue-grad)" strokeWidth="1.5" opacity="0.9" />
        <g fill="none" stroke="url(#blue-grad)" strokeWidth="2" strokeLinecap="round">
          <circle cx="80" cy="80" r="28" opacity="0.5" />
          <path d="M80 52 L80 108 M52 80 L108 80 M68 68 L92 92 M92 68 L68 92" opacity="0.8" />
        </g>
      </svg>
    )
  }

  // emerald
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" className="flex-shrink-0">
      <defs>
        <linearGradient id="emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="120" height="120" rx="24" fill="none" stroke="url(#emerald-grad)" strokeWidth="1.5" opacity="0.9" />
      <g fill="none" stroke="url(#emerald-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M80 55 L95 80 L80 105 L65 80 Z" opacity="0.8" />
        <path d="M80 70 L80 90 M70 80 L90 80" strokeWidth="1.5" opacity="0.6" />
      </g>
    </svg>
  )
}

export function HowWeDo() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  const goPrev = () =>
    setCurrentIndex((i) => (i - 1 + CARDS.length) % CARDS.length)
  const goNext = () =>
    setCurrentIndex((i) => (i + 1) % CARDS.length)

  const card = CARDS[currentIndex]

  return (
    <>
      <style>{`
        @keyframes reveal-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .how-we-do-reveal { opacity: 0; }
        .how-we-do-reveal.visible { animation: reveal-up 0.6s cubic-bezier(0.22,1,0.36,1) forwards; }
        .how-we-do-dot-grid {
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0);
          background-size: 24px 24px;
        }
        .how-we-do-card-bg {
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0);
          background-size: 20px 20px;
        }
        .arrow-btn-how {
          width: 56px; height: 56px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }
        .arrow-btn-how:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(201,169,110,0.5);
          transform: scale(1.05);
        }
        .arrow-btn-how:active { transform: scale(0.98); }
      `}</style>

      <section
        id="how-we-do"
        className="relative overflow-hidden py-24 sm:py-28 lg:py-32 xl:py-36 bg-[#050505]"
        aria-labelledby="how-we-do-heading"
      >
        {/* Dot grid background */}
        <div className="how-we-do-dot-grid absolute inset-0 pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          {/* Header */}
          <div className={`how-we-do-reveal ${isVisible ? 'visible' : ''} flex flex-wrap items-end justify-between gap-8 mb-14 lg:mb-20`}>
            <div>
              <span
                className="inline-block mb-4 text-xs font-bold tracking-[0.22em] uppercase text-white/40"
              >
                HOW WE WORK
              </span>
              <h2
                id="how-we-do-heading"
                className="text-white font-bold tracking-tight"
                style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)', lineHeight: 1.05, letterSpacing: '-0.04em' }}
              >
                <span className="text-white/60">How</span> we bring ideas to life
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-white/90 transition-colors"
            >
              How we work
              <ArrowUpRight className="w-5 h-5" aria-hidden />
            </button>
          </div>

          {/* Card carousel */}
          <div className={`how-we-do-reveal ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0.15s' }}>
            <div
              className="relative rounded-3xl border border-white/10 bg-black/60 overflow-hidden min-h-[380px] sm:min-h-[420px] lg:min-h-[460px]"
              style={{ background: 'rgba(10,10,10,0.85)' }}
            >
              <div className="how-we-do-card-bg absolute inset-0 pointer-events-none" />

              <div className="relative flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16 p-8 sm:p-10 lg:p-14 xl:p-16">
                {/* Expand / external link - top right */}
                <button
                  type="button"
                  onClick={() => navigate('/services')}
                  className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 transition-colors z-10"
                  aria-label="View how we work"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </button>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex w-full flex-col lg:flex-row lg:items-center gap-10 lg:gap-16"
                  >
                    {/* Left: number, title, description, duration */}
                    <div className="flex-1 pr-14 lg:pr-0">
                      <span
                        className="block text-5xl sm:text-6xl lg:text-7xl font-bold text-white/35 tabular-nums mb-3"
                        style={{ letterSpacing: '-0.02em' }}
                      >
                        {card.number}
                      </span>
                      <h3
                        className="text-white font-bold mb-5"
                        style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.02em', lineHeight: 1.2 }}
                      >
                        {card.title}
                      </h3>
                      <p className="text-white/55 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
                        {card.description}
                      </p>
                      <span
                        className="inline-block px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-white/50 border border-white/15 bg-white/5"
                      >
                        {card.duration}
                      </span>
                    </div>

                    {/* Right: icon */}
                    <div className="flex items-center justify-center lg:justify-end lg:w-[260px] xl:w-[280px]">
                      <StepIcon type={card.icon} />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Navigation arrows */}
            <div className="flex items-center justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={goPrev}
                className="arrow-btn-how"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-6 h-6 text-white/75" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="arrow-btn-how"
                aria-label="Next step"
              >
                <ChevronRight className="w-6 h-6 text-white/75" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
