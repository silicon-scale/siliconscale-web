'use client'

import { useId, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

type MacbookOpenAnimationProps = {
  className?: string
}

/** Lid rests closed at this rotation, then sweeps open toward 0deg. */
const CLOSED_ROTATE_X = 105
const OPEN_TRANSITION = { duration: 1.5, ease: [0.16, 1, 0.3, 1] } as const
const GLOW_TRANSITION = { duration: 0.9, delay: 1.0, ease: 'easeOut' } as const
const SCREEN_TEXT_TRANSITION = { duration: 0.5, delay: 1.9, ease: 'easeOut' } as const

/**
 * Custom SVG MacBook — lid swings open once when scrolled into view (useInView,
 * once: true). Base and lid are positioned as percentages of one shared
 * container, so the lid's bottom edge (its transform-origin) lands exactly on
 * the base's top edge — they stay connected at every rotation angle, not just
 * at rest.
 */
export function MacbookOpenAnimation({ className }: MacbookOpenAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const isInView = useInView(containerRef, { once: true, amount: 0.5 })
  const open = prefersReducedMotion || isInView
  const uid = useId()
  const glowId = `macbook-glow-${uid}`
  const deckId = `macbook-deck-${uid}`

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn('mx-auto w-full max-w-[260px]', className)}
      style={{ perspective: 900 }}
    >
      {/* Shared coordinate space: base = bottom 20%, lid = top 80% — same split, no gap */}
      <div className="relative aspect-[240/200]">
        {/* Base — keyboard deck: tapered wedge, aluminum gradient, trackpad hint */}
        <div className="absolute inset-x-0 bottom-0 h-[20%]">
          <svg viewBox="0 0 240 40" width="100%" height="100%" className="block">
            <defs>
              <linearGradient id={deckId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2c2c30" />
                <stop offset="100%" stopColor="#161618" />
              </linearGradient>
            </defs>
            <path
              d="M10 0 H230 V3 Q230 7 226 9 L221 33 Q220 40 213 40 H27 Q20 40 19 33 L14 9 Q10 7 10 3 Z"
              fill={`url(#${deckId})`}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
            {/* hinge-edge highlight */}
            <rect x="10" y="0" width="220" height="1.5" fill="rgba(255,255,255,0.18)" />
            {/* trackpad seam */}
            <rect x="100" y="33" width="40" height="3" rx="1.5" fill="rgba(255,255,255,0.08)" />
          </svg>
        </div>

        {/* Lid — pivots from bottom-[20%], the exact line the base starts at */}
        <motion.div
          className="absolute inset-x-0 bottom-[20%] h-[80%] origin-bottom"
          initial={false}
          animate={{ rotateX: open ? 0 : CLOSED_ROTATE_X }}
          transition={prefersReducedMotion ? { duration: 0 } : OPEN_TRANSITION}
        >
          <svg viewBox="0 0 240 160" width="100%" height="100%" className="block">
            <defs>
              <radialGradient id={glowId} cx="50%" cy="34%" r="70%">
                <stop offset="0%" stopColor="rgba(143,171,212,0.32)" />
                <stop offset="100%" stopColor="rgba(143,171,212,0)" />
              </radialGradient>
            </defs>
            {/* bezel bottom edge sits exactly on the viewBox's own bottom (y=160) — the hinge */}
            <rect
              x="10"
              y="8"
              width="220"
              height="152"
              rx="10"
              fill="#1c1c1c"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1.5"
            />
            <rect x="18" y="16" width="204" height="136" rx="4" fill="#050506" />
            <motion.rect
              x="18"
              y="16"
              width="204"
              height="136"
              rx="4"
              fill={`url(#${glowId})`}
              initial={false}
              animate={{ opacity: open ? 1 : 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : GLOW_TRANSITION}
            />
            <circle cx="120" cy="12" r="1.5" fill="rgba(255,255,255,0.28)" />
            <foreignObject x="18" y="16" width="204" height="136">
              <motion.div
                className="flex h-full w-full items-center justify-center"
                initial={false}
                animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.92 }}
                transition={prefersReducedMotion ? { duration: 0 } : SCREEN_TEXT_TRANSITION}
              >
                <span className="font-dm-mono text-[9px] tracking-[0.2em] text-brand-gold/90">
                  &gt; Start a Project<span className="opacity-50">_</span>
                </span>
              </motion.div>
            </foreignObject>
          </svg>
        </motion.div>
      </div>
    </div>
  )
}

export default MacbookOpenAnimation
