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
        @keyframes introPulse {
          0% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.04); opacity: 1; }
          100% { transform: scale(1); opacity: 0.9; }
        }
        .intro-pulse {
          animation: introPulse 1.4s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
      <div className="flex flex-row flex-wrap items-center justify-center gap-5 sm:gap-6 px-4 sm:px-6">
        <motion.img
          src="/transparent-logo.svg"
          alt=""
          width={120}
          height={120}
          className="intro-pulse h-28 w-28 sm:h-32 sm:w-32 md:h-40 md:w-40"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: FADE_IN_DURATION,
            ease: EASING,
          }}
        />
        <motion.p
          className="intro-pulse font-bold text-white tracking-tight"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)' }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: FADE_IN_DURATION,
            ease: EASING,
            delay: 0.1,
          }}
        >
          Silicon Scale
        </motion.p>
      </div>
    </motion.section>
  )
}
