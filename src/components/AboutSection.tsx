'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { ScalesContainer } from '@/components/ui/scales'
import { Vortex } from '@/components/ui/vortex'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useReveal } from '@/context/RevealContext'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { FOCUS_RING } from '@/lib/focus'
import { SplashHoverButton } from '@/components/ui/SplashHoverButton'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { observeScrollRevealOnce } from '@/utils/sharedScrollRevealObserver'

// TODO: replace with real, current numbers before shipping — do not launch with placeholders.
const HERO_STATS = [
  { value: '40+', label: 'Systems shipped' },
  { value: '3.2×', label: 'Avg. revenue lift' },
  { value: '14 days', label: 'To first working build' },
] as const

const TERMINAL_LINES = [
  { text: 'We build the systems that grow your business.', emphasis: true },
  { text: 'Custom software, headless commerce, and AI agents.' },
  { text: 'Engineered to save hours every week and turn visitors into revenue.' },
] as const

const CAPABILITY_NODES = [
  { id: 'software', label: 'Custom Software', cx: 96, cy: 108 },
  { id: 'commerce', label: 'Headless Commerce', cx: 384, cy: 96 },
  { id: 'agents', label: 'AI Agents', cx: 240, cy: 404 },
] as const

function useTypewriterLines(
  lines: readonly { text: string; emphasis?: boolean }[],
  start: boolean,
  reduced: boolean
) {
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!start) return
    if (reduced) {
      setLineIndex(lines.length)
      setDone(true)
      return
    }
    if (done || lineIndex >= lines.length) {
      if (!done) setDone(true)
      return
    }
    const currentText = lines[lineIndex].text
    if (charIndex < currentText.length) {
      const t = window.setTimeout(() => setCharIndex((c) => c + 1), 26)
      return () => clearTimeout(t)
    }
    const t = window.setTimeout(() => {
      setLineIndex((i) => i + 1)
      setCharIndex(0)
    }, 380)
    return () => clearTimeout(t)
  }, [start, reduced, lineIndex, charIndex, done, lines])

  return { lineIndex, charIndex, done }
}

/**
 * Live-typed intro copy — moved here from the landing Hero. Set in the
 * site's monospace face, prints one sentence at a time.
 */
function TerminalIntro({ active, reduced }: { active: boolean; reduced: boolean }) {
  const { lineIndex, charIndex, done } = useTypewriterLines(TERMINAL_LINES, active, reduced)

  return (
    <div className="w-full space-y-2 font-dm-mono text-[13px] leading-relaxed sm:text-sm">
      {TERMINAL_LINES.map((line, i) => {
        if (i > lineIndex) return null
        const isActiveLine = i === lineIndex && !done
        const shownText = isActiveLine ? line.text.slice(0, charIndex) : line.text
        const showCursor = isActiveLine || (done && i === TERMINAL_LINES.length - 1)

        return (
          <p key={line.text} className={line.emphasis ? 'text-white' : 'text-white/70'}>
            {shownText}
            {showCursor && (
              <motion.span
                aria-hidden
                className="ml-0.5 inline-block h-[1em] w-[6px] translate-y-[1px] bg-brand-gold align-middle"
                animate={reduced ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
                transition={reduced ? { duration: 0 } : { duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </p>
        )
      })}
    </div>
  )
}

/**
 * Systems diagram — moved here from the landing Hero. Three service nodes
 * (what we build) converging into one core (the business outcome).
 */
function SystemsVisual({ active, reduced }: { active: boolean; reduced: boolean }) {
  const core = { cx: 240, cy: 240, r: 40 }

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[360px]" aria-hidden>
      <svg viewBox="0 0 480 480" className="h-full w-full overflow-visible">
        <defs>
          <radialGradient id="about-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--brand-gold)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--brand-gold)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={core.cx} cy={core.cy} r={110} fill="url(#about-core-glow)" />

        {CAPABILITY_NODES.map((node, i) => (
          <motion.line
            key={`line-${node.id}`}
            x1={node.cx}
            y1={node.cy}
            x2={core.cx}
            y2={core.cy}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={1}
            initial={false}
            animate={active ? { strokeDashoffset: [0, -24] } : { strokeDashoffset: 0 }}
            transition={
              active
                ? { duration: 3.4, repeat: Infinity, ease: 'linear', delay: i * 0.3 }
                : { duration: 0 }
            }
            strokeDasharray="2 6"
          />
        ))}

        <motion.circle
          cx={core.cx}
          cy={core.cy}
          r={core.r}
          fill="rgba(10,10,12,0.9)"
          stroke="var(--brand-gold)"
          strokeWidth={1.5}
          initial={false}
          animate={active && !reduced ? { scale: [1, 1.045, 1] } : { scale: 1 }}
          transition={active && !reduced ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
          style={{ transformOrigin: `${core.cx}px ${core.cy}px` }}
        />
        <text
          x={core.cx}
          y={core.cy + 5}
          textAnchor="middle"
          className="fill-white text-[13px] font-semibold uppercase tracking-[0.08em]"
        >
          Growth
        </text>

        {CAPABILITY_NODES.map((node, i) => (
          <motion.g
            key={node.id}
            initial={false}
            animate={active && !reduced ? { y: [0, i % 2 === 0 ? -6 : 6, 0] } : { y: 0 }}
            transition={
              active && !reduced
                ? { duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }
                : { duration: 0 }
            }
          >
            <circle cx={node.cx} cy={node.cy} r={7} fill="var(--brand-gold)" />
            <circle cx={node.cx} cy={node.cy} r={13} fill="none" stroke="var(--brand-gold)" strokeOpacity={0.4} />
          </motion.g>
        ))}
      </svg>

      {CAPABILITY_NODES.map((node) => (
        <span
          key={`label-${node.id}`}
          className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] font-medium tracking-wide text-white/85 backdrop-blur-sm"
          style={{ left: `${(node.cx / 480) * 100}%`, top: `${(node.cy / 480) * 100}%` }}
        >
          {node.label}
        </span>
      ))}
    </div>
  )
}

export function AboutSection() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const prefersReducedMotion = useReducedMotion()
  const { mountStage } = useReveal()
  const introRef = useRef<HTMLDivElement>(null)
  const [typingActive, setTypingActive] = useState(false)

  // Start the typewriter once this block scrolls into view (same reveal-once
  // pattern ScrollReveal uses internally).
  useEffect(() => {
    const el = introRef.current
    if (!el) return
    if (prefersReducedMotion) {
      setTypingActive(true)
      return
    }
    const rect = el.getBoundingClientRect()
    const alreadyVisible =
      rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.08
    if (alreadyVisible) {
      setTypingActive(true)
      return
    }
    return observeScrollRevealOnce(el, () => setTypingActive(true))
  }, [prefersReducedMotion])

  return (
    <section
      aria-labelledby="about-home-heading"
      className="relative w-full bg-page py-16 sm:py-20 lg:py-24 overflow-hidden"
    >
      {/* Vortex background effect */}
      {mountStage >= 3 && !isMobile && !prefersReducedMotion ? (
        <div className="absolute inset-0 pointer-events-none opacity-[0.55]">
          <Vortex
            backgroundColor="rgba(0,0,0,0)"
            particleCount={420}
            baseHue={42}
            rangeSpeed={1.2}
            baseSpeed={0.05}
            baseRadius={1}
            rangeRadius={2}
            containerClassName="absolute inset-0"
          />
        </div>
      ) : null}
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
        <ScalesContainer
          orientation="diagonal"
          size={10}
          containerClassName="w-full overflow-hidden rounded-3xl border border-white/10 bg-page shadow-[0_30px_90px_rgba(0,0,0,0.7)] ring-1 ring-white/5"
          className="[--pattern-scales:rgba(255,255,255,0.10)]"
        >
          <div className="flex flex-col gap-10 p-8 sm:p-10 lg:p-14">
            <ScrollReveal className="flex flex-wrap items-end justify-between gap-6">
              <div className="space-y-2">
                <SectionEyebrow>About Us</SectionEyebrow>
                <h2 id="about-home-heading" className="sr-only">
                  About SiliconScale
                </h2>
              </div>

              <SplashHoverButton
                onClick={() => navigate('/about')}
                className={`group px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] ${FOCUS_RING}`}
              >
                See how we work
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </SplashHoverButton>
            </ScrollReveal>

            <ScrollReveal
              staggerIndex={1}
              className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
            >
              <div ref={introRef}>
                <TerminalIntro active={typingActive} reduced={!!prefersReducedMotion} />
              </div>

              {!isMobile && (
                <div className="hidden lg:block">
                  <SystemsVisual active={typingActive && !prefersReducedMotion} reduced={!!prefersReducedMotion} />
                </div>
              )}
            </ScrollReveal>
          </div>
        </ScalesContainer>
      </div>
    </section>
  )
}