'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface IntroLoaderProps {
  /** Whether the loader should be visible (opacity/pointer-events). */
  visible: boolean
  /** Called when the zoom-out animation completes. */
  onExitComplete: () => void
}

/** Fill rising toward ~95% — kept in line with prior ~1s hold budget. */
const FILL_TO_95_MS = 1000
/** Smooth completion 95→100 once assets are ready (or when already ready). */
const FILL_TO_100_MS = 280
/** Wordmark scale-up + fade handoff into Hero. */
const EXIT_MS = 620
/**
 * Hard failsafe from mount → handoff.
 * fill95 + fill100 + exit + small slack (mirrors prior ~2s envelope).
 */
const FAILSAFE_MS = FILL_TO_95_MS + FILL_TO_100_MS + EXIT_MS + 400

const WORDMARK = 'SiliconScale'
/** Update the visible % counter at most this often — avoids React churn during fill. */
const COUNTER_INTERVAL_MS = 50

/**
 * Static wave mask (luminance): transparent above the wave, opaque below.
 * Sized wider than the wordmark so the edge reads clearly; never animated via path `d`.
 */
const WAVE_MASK_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" preserveAspectRatio="none">
    <path fill="white" d="M0 48
      C40 18 80 78 120 48
      S200 18 240 48
      S320 78 360 48
      S440 18 480 48
      S560 78 600 48
      S680 18 720 48
      S760 78 800 48
      L800 200 L0 200 Z"/>
  </svg>`,
)

const WAVE_MASK_URL = `url("data:image/svg+xml,${WAVE_MASK_SVG}")`

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

function waitCriticalAssets(signal: AbortSignal): Promise<void> {
  const fontsReady = (async () => {
    try {
      if (document.fonts?.load) {
        await Promise.all([
          document.fonts.load('700 48px "Open Sans"'),
          document.fonts.load('400 16px "Open Sans"'),
        ])
        await document.fonts.ready
      }
    } catch {
      /* ignore — failsafe still releases */
    }
  })()

  const logoReady = new Promise<void>((resolve) => {
    const img = new Image()
    const done = () => resolve()
    img.onload = done
    img.onerror = done
    img.src = '/transparent-logo.svg'
    if (img.complete) done()
  })

  return new Promise((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      resolve()
    }
    signal.addEventListener('abort', finish, { once: true })
    Promise.all([fontsReady, logoReady]).then(finish)
  })
}

export function IntroLoader({ visible, onExitComplete }: IntroLoaderProps) {
  const exitFiredRef = useRef(false)
  const liquidRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const pctRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef(0)
  const lastCounterAtRef = useRef(0)

  const [exiting, setExiting] = useState(false)
  const [animating, setAnimating] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const applyProgress = useCallback((p: number, forceCounter = false) => {
    const progress = clamp01(p)
    progressRef.current = progress
    const rise = (1 - progress) * 100
    const liquid = liquidRef.current
    const inner = innerRef.current
    if (liquid) liquid.style.transform = `translate3d(0, ${rise}%, 0)`
    if (inner) inner.style.transform = `translate3d(0, ${-rise}%, 0)`

    const now = performance.now()
    if (
      forceCounter ||
      now - lastCounterAtRef.current >= COUNTER_INTERVAL_MS ||
      progress >= 1
    ) {
      lastCounterAtRef.current = now
      const pct = Math.round(progress * 100)
      if (pctRef.current) pctRef.current.textContent = `${pct}%`
      const root = liquid?.closest('.intro-loader')
      if (root) root.setAttribute('aria-valuenow', String(pct))
    }
  }, [])

  const finish = useCallback(() => {
    if (exitFiredRef.current) return
    exitFiredRef.current = true
    setAnimating(false)
    onExitComplete()
  }, [onExitComplete])

  // Primary sequence: fill → asset gate → 100% → zoom exit
  useEffect(() => {
    if (reducedMotion) {
      applyProgress(1, true)
      const t = window.setTimeout(() => {
        setExiting(true)
        window.setTimeout(finish, 220)
      }, 120)
      return () => clearTimeout(t)
    }

    const abort = new AbortController()
    let cancelled = false
    let raf = 0
    let completeRaf = 0
    let assetsReady = false
    let fill95Done = false

    applyProgress(0, true)

    waitCriticalAssets(abort.signal).then(() => {
      assetsReady = true
      maybeCompleteTo100()
    })

    const start = performance.now()

    const tickFill95 = (now: number) => {
      if (cancelled) return
      const t = clamp01((now - start) / FILL_TO_95_MS)
      const eased = 1 - (1 - t) ** 2.2
      applyProgress(eased * 0.95)
      if (t < 1) {
        raf = requestAnimationFrame(tickFill95)
      } else {
        fill95Done = true
        maybeCompleteTo100()
      }
    }
    raf = requestAnimationFrame(tickFill95)

    function maybeCompleteTo100() {
      if (cancelled || !fill95Done || !assetsReady) return
      const completeStart = performance.now()
      const from = Math.max(progressRef.current, 0.95)
      const tick = (now: number) => {
        if (cancelled) return
        const t = clamp01((now - completeStart) / FILL_TO_100_MS)
        const eased = 1 - (1 - t) ** 1.6
        applyProgress(from + (1 - from) * eased, t >= 1)
        if (t < 1) {
          completeRaf = requestAnimationFrame(tick)
        } else {
          setExiting(true)
        }
      }
      completeRaf = requestAnimationFrame(tick)
    }

    return () => {
      cancelled = true
      abort.abort()
      cancelAnimationFrame(raf)
      cancelAnimationFrame(completeRaf)
    }
  }, [applyProgress, finish, reducedMotion])

  // Failsafe — viewport-independent hard release
  useEffect(() => {
    const t = window.setTimeout(finish, reducedMotion ? 500 : FAILSAFE_MS)
    return () => clearTimeout(t)
  }, [finish, reducedMotion])

  // After exit transition ends (or duration fallback)
  useEffect(() => {
    if (!exiting) return
    const t = window.setTimeout(finish, EXIT_MS + 80)
    return () => clearTimeout(t)
  }, [exiting, finish])

  return (
    <section
      className={[
        'intro-loader',
        exiting ? 'intro-loader--exit' : '',
        visible ? '' : 'intro-loader--hidden',
        animating ? 'intro-loader--animating' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onTransitionEnd={(e) => {
        if (exitFiredRef.current) return
        if (!exiting) return
        if (e.target !== e.currentTarget) return
        if (e.propertyName !== 'opacity' && e.propertyName !== 'transform') return
        finish()
      }}
      aria-label="Loading"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <style>{`
        .intro-loader {
          position: fixed;
          inset: 0;
          z-index: 300;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--brand-black);
          transform: translate3d(0, 0, 0) scale(1);
          opacity: 1;
          pointer-events: auto;
          transition:
            transform ${EXIT_MS}ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity ${EXIT_MS}ms cubic-bezier(0.22, 1, 0.36, 1);
          backface-visibility: hidden;
        }
        .intro-loader--animating .intro-liquid,
        .intro-loader--animating .intro-liquid-inner {
          will-change: transform;
        }
        .intro-loader--animating.intro-loader--exit {
          will-change: transform, opacity;
        }
        .intro-loader--exit {
          transform: translate3d(0, 0, 0) scale(2.35);
          opacity: 0;
        }
        .intro-loader--hidden {
          opacity: 0;
          pointer-events: none;
        }
        .intro-stage {
          position: relative;
          display: inline-block;
          max-width: min(92vw, 56rem);
          padding: 0 0.25rem;
        }
        .intro-wordmark {
          margin: 0;
          font-family: 'Open Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-weight: 700;
          /* Tuned for single-line "SiliconScale" from ~320px through large desktop */
          font-size: clamp(1.75rem, 0.4rem + 8.2vw, 6.75rem);
          line-height: 1;
          letter-spacing: -0.03em;
          white-space: nowrap;
          user-select: none;
        }
        .intro-wordmark--base {
          color: rgba(255, 255, 255, 0.18);
        }
        .intro-liquid {
          position: absolute;
          inset: 0;
          overflow: hidden;
          /* Static SVG wave as mask — shape fixed; rise via translateY only */
          -webkit-mask-image: ${WAVE_MASK_URL};
          mask-image: ${WAVE_MASK_URL};
          -webkit-mask-size: 140% 115%;
          mask-size: 140% 115%;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: center top;
          mask-position: center top;
          transform: translate3d(0, 100%, 0);
        }
        .intro-liquid-inner {
          position: absolute;
          inset: 0;
          transform: translate3d(0, -100%, 0);
        }
        .intro-wordmark--fill {
          color: #ffffff;
        }
        .intro-progress {
          position: absolute;
          right: 0.05em;
          top: calc(100% + 0.55em);
          margin: 0;
          font-family: 'Open Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-weight: 400;
          font-size: clamp(0.65rem, 0.35rem + 1.1vw, 0.95rem);
          letter-spacing: 0.12em;
          text-transform: lowercase;
          color: rgba(255, 255, 255, 0.45);
          white-space: nowrap;
          pointer-events: none;
        }
        .intro-progress-num {
          font-variant-numeric: tabular-nums;
          color: rgba(255, 255, 255, 0.62);
        }
      `}</style>

      <div className="intro-stage">
        <p className="intro-wordmark intro-wordmark--base" aria-hidden={exiting}>
          {WORDMARK}
        </p>

        <div className="intro-liquid" aria-hidden ref={liquidRef}>
          <div className="intro-liquid-inner" ref={innerRef}>
            <p className="intro-wordmark intro-wordmark--fill">{WORDMARK}</p>
          </div>
        </div>

        <p className="intro-progress" aria-hidden>
          loading… <span className="intro-progress-num" ref={pctRef}>0%</span>
        </p>
      </div>
    </section>
  )
}
