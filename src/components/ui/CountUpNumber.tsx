'use client'

import { useEffect, useMemo, useRef, type CSSProperties } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { detectPreferReducedEffects } from '@/hooks/usePreferReducedEffects'
import { COUNT_UP_DURATION_S, easeRevealProgress } from '@/lib/motion'

export type ParsedStatValue = {
  prefix: string
  target: number
  decimals: number
  suffix: string
  finalText: string
  useGrouping: boolean
  animatable: boolean
}

export function parseStatDisplayValue(raw: string): ParsedStatValue {
  const trimmed = raw.trim()

  const complex = trimmed.match(/^([+\-]?)(₹)?([\d,]+(?:\.\d+)?)(L)?(\+|%)?$/)
  if (complex) {
    const [, sign = '', currency = '', numStr, lakh = '', endSuffix = ''] = complex
    const cleaned = numStr.replace(/,/g, '')
    const target = Number.parseFloat(cleaned)
    const decimals = cleaned.includes('.') ? cleaned.split('.')[1].length : 0

    return {
      prefix: `${sign}${currency}`,
      target,
      decimals,
      suffix: `${lakh}${endSuffix}`,
      finalText: trimmed,
      useGrouping: numStr.includes(','),
      animatable: !Number.isNaN(target),
    }
  }

  const simple = trimmed.match(/^(\d+(?:\.\d+)?)(\+|%)?$/)
  if (!simple) {
    return {
      prefix: '',
      target: 0,
      decimals: 0,
      suffix: '',
      finalText: trimmed,
      useGrouping: false,
      animatable: false,
    }
  }

  const numeric = simple[1]
  const suffix = simple[2] ?? ''
  const target = Number.parseFloat(numeric)
  const decimals = numeric.includes('.') ? numeric.split('.')[1].length : 0

  return {
    prefix: '',
    target,
    decimals,
    suffix,
    finalText: trimmed,
    useGrouping: false,
    animatable: !Number.isNaN(target),
  }
}

function formatStatNumber(value: number, parsed: ParsedStatValue): string {
  if (!parsed.animatable) return parsed.finalText

  let numeric =
    parsed.decimals > 0 ? value.toFixed(parsed.decimals) : String(Math.round(value))

  if (parsed.useGrouping && parsed.decimals === 0) {
    numeric = Math.round(value).toLocaleString('en-US')
  }

  return `${parsed.prefix}${numeric}${parsed.suffix}`
}

type CountUpNumberProps = {
  value: string
  className?: string
  style?: CSSProperties
  /** When true, starts the one-shot count (parent should gate via IntersectionObserver). */
  animate: boolean
  /** Override default duration (ms). */
  durationMs?: number
}

/**
 * Imperative rAF count-up — writes textContent directly, no per-frame setState.
 */
export function CountUpNumber({
  value,
  className,
  style,
  animate,
  durationMs = COUNT_UP_DURATION_S * 1000,
}: CountUpNumberProps) {
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

    if (skipAnimation || !parsed.animatable) {
      el.textContent = parsed.finalText
      el.classList.remove('count-up-settled')
      return
    }

    if (!animate) {
      el.textContent = formatStatNumber(0, parsed)
      el.classList.remove('count-up-settled')
      return
    }

    let rafId = 0
    const startTime = performance.now()

    el.classList.remove('count-up-settled')
    el.textContent = formatStatNumber(0, parsed)

    const tick = (now: number) => {
      const elapsed = now - startTime
      const linear = Math.min(1, elapsed / durationMs)
      const eased = easeRevealProgress(linear)
      const current = parsed.target * eased

      el.textContent = formatStatNumber(current, parsed)

      if (linear < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        el.textContent = parsed.finalText
        el.classList.add('count-up-settled')
      }
    }
    rafId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafId)
  }, [animate, durationMs, skipAnimation, parsed])

  const initialText =
    skipAnimation || !parsed.animatable
      ? parsed.finalText
      : formatStatNumber(0, parsed)

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
