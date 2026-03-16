'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export interface IntroLoaderProps {
  /** Called when the slide-out animation completes. */
  onComplete: () => void
}

const FADE_IN_DURATION = 0.6
const HOLD_DURATION = 1
const SLIDE_DURATION = 0.9
const EASING = [0.42, 0, 0.58, 1] as const // easeInOut

export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter')

  // After fade-in (0.6s) + hold (0.8s), start slide-out
  useEffect(() => {
    const delayMs = (FADE_IN_DURATION + HOLD_DURATION) * 1000
    const t = setTimeout(() => setPhase('exit'), delayMs)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.section
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#050505]"
      initial={false}
      animate={{
        x: phase === 'exit' ? '-100%' : 0,
      }}
      transition={{
        duration: SLIDE_DURATION,
        ease: EASING,
      }}
      onAnimationComplete={() => {
        if (phase === 'exit') onComplete()
      }}
      aria-label="Loading"
      role="presentation"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@600;700&display=swap');
        @keyframes introPulse {
          0% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.04); opacity: 1; }
          100% { transform: scale(1); opacity: 0.9; }
        }
        .intro-pulse {
          animation: introPulse 1.4s ease-in-out infinite;
          transform-origin: center;
        }
        .intro-wrapper {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.1rem;
        }
        .intro-text {
          font-family: 'Open Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        @media (max-width: 640px) {
          .intro-wrapper {
            gap: 0.5rem;
          }
        }
      `}</style>
      <div className="intro-wrapper px-4 sm:px-6">
        <motion.img
          src="/transparent-logo.svg"
          alt=""
          width={120}
          height={120}
          className="intro-pulse h-32 w-32 sm:h-48 sm:w-48 md:h-44 md:w-44"
          loading="eager"
        />
        <motion.p
          className="intro-pulse intro-text font-bold text-white tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 7rem)' }}
        >
          Silicon Scale
        </motion.p>
      </div>
    </motion.section>
  )
}
