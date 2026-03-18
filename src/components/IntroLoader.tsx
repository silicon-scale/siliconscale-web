'use client'

import { useEffect, useRef, useState } from 'react'

export interface IntroLoaderProps {
  /** Whether the loader should be visible (opacity/pointer-events). */
  visible: boolean
  /** Called when the slide-out animation completes. */
  onExitComplete: () => void
}

const HOLD_DURATION_MS = 1000
const SLIDE_DURATION_MS = 900

export function IntroLoader({ visible, onExitComplete }: IntroLoaderProps) {
  const [exiting, setExiting] = useState(false)
  const exitFiredRef = useRef(false)

  // After 1s, start slide-out.
  useEffect(() => {
    const t = setTimeout(() => {
      setExiting(true)
    }, HOLD_DURATION_MS)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      className={[
        'intro-loader',
        exiting ? 'intro-loader--exit' : '',
        visible ? '' : 'intro-loader--hidden',
      ]
        .filter(Boolean)
        .join(' ')}
      onTransitionEnd={(e) => {
        if (exitFiredRef.current) return
        if (!exiting) return
        // Only fire when the slide transform finishes on the container.
        if (e.target !== e.currentTarget) return
        if (e.propertyName !== 'transform') return
        exitFiredRef.current = true
        onExitComplete()
      }}
      aria-label="Loading"
      role="presentation"
    >
      <style>{`
        .intro-loader{
          position: fixed;
          inset: 0;
          z-index: 300;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #050505;
          transform: translate3d(0,0,0);
          transition: transform ${SLIDE_DURATION_MS}ms cubic-bezier(.22,1,.36,1), opacity 250ms ease;
          will-change: transform, opacity;
          backface-visibility: hidden;
          opacity: 1;
          pointer-events: auto;
        }
        .intro-loader--exit{
          transform: translate3d(-100%,0,0);
        }
        .intro-loader--hidden{
          opacity: 0;
          pointer-events: none;
        }
        @keyframes introPulse {
          0% { transform: translate3d(0,0,0) scale(1); opacity: 0.9; }
          50% { transform: translate3d(0,0,0) scale(1.04); opacity: 1; }
          100% { transform: translate3d(0,0,0) scale(1); opacity: 0.9; }
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
        <img
          src="/transparent-logo.svg"
          alt=""
          width={120}
          height={120}
          className="intro-pulse h-32 w-32 sm:h-48 sm:w-48 md:h-44 md:w-44"
          loading="eager"
        />
        <p
          className="intro-pulse intro-text font-bold text-white tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 7rem)' }}
        >
          Silicon Scale
        </p>
      </div>
    </section>
  )
}
