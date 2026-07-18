'use client'

import { useEffect, useMemo, useRef, type CSSProperties } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { detectPreferReducedEffects } from '@/hooks/usePreferReducedEffects'
import { COUNT_UP_DURATION_S, easeRevealProgress } from '@/lib/motion'

export type ParsedStatValue = {
  target: number
  decimals: number
  suffix: string
  finalText: string
}

export function parseStatDisplayValue(raw: string): ParsedStatValue {
  const match = raw.match(/^(\d+(?:\.\d+)?)(\+|%)?$/)
  if (!match) {
    return { target: 0, decimals: 0, suffix: '', finalText: raw }
  }

  const numeric = match[1]
  const suffix = match[2] ?? ''
  const target = Number.parseFloat(numeric)
  const decimals = numeric.includes('.') ? numeric.split('.')[1].length : 0

  return { target, decimals, suffix, finalText: raw }
}

function formatStatNumber(value: number, decimals: number, suffix: string): string {
  const numeric =
    decimals > 0 ? value.toFixed(decimals) : String(Math.round(value))
  return `${numeric}${suffix}`
}

type CountUpNumberProps = {
  value: string
  className?: string
  style?: CSSProperties
  /** When true, starts the one-shot count (parent should gate via IntersectionObserver). */
  animate: boolean
}

/**
 * Imperative rAF count-up — writes textContent directly, no per-frame setState.
 */
export function CountUpNumber({ value, className, style, animate }: CountUpNumberProps) {
  const spanRef = useRef<HTMLSpanElement>(null)
  const parsed = useMemo(() => parseStatDisplayValue(value), [value])
  const prefersReducedMotion = useReducedMotion()
  const skipAnimation = useMemo(
    () => detectPreferReducedEffects(prefersReducedMotion),
    [prefersReducedMotion],
  )

  useEffect(() => {
    const el = spanRef.current
    if (!el) return

    if (skipAnimation) {
      el.textContent = parsed.finalText
      el.classList.remove('count-up-settled')
      return
    }

    if (!animate) {
      el.textContent = formatStatNumber(0, parsed.decimals, parsed.suffix)
      el.classList.remove('count-up-settled')
      return
    }

    const durationMs = COUNT_UP_DURATION_S * 1000
    const suffix = parsed.suffix
    let rafId = 0
    const startTime = performance.now()

    el.classList.remove('count-up-settled')
    el.textContent = formatStatNumber(0, parsed.decimals, suffix)

    const tick = (now: number) => {
      const elapsed = now - startTime
      const linear = Math.min(1, elapsed / durationMs)
      const eased = easeRevealProgress(linear)
      const current = parsed.target * eased

      el.textContent = formatStatNumber(current, parsed.decimals, suffix)

      if (linear < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        el.textContent = parsed.finalText
        el.classList.add('count-up-settled')
      }
    }
    rafId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafId)
  }, [animate, skipAnimation, parsed])

  const initialText = skipAnimation
    ? parsed.finalText
    : formatStatNumber(0, parsed.decimals, parsed.suffix)

  return (
    <span
      ref={spanRef}
      className={cn('tabular-nums', className)}
      style={{ fontVariantNumeric: 'tabular-nums', ...style }}
    >
      {initialText}
    </span>
  )
}
