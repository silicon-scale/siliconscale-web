'use client'

import { useState, useSyncExternalStore } from 'react'
import { useReducedMotion } from 'framer-motion'
import { getPreferReducedEffectsDebugInfo } from '@/hooks/usePreferReducedEffects'
import {
  getPerfDebugLoops,
  isPerfDebugEnabled,
  subscribePerfDebug,
} from '@/utils/perfDebug'

function usePerfDebugLoops() {
  return useSyncExternalStore(subscribePerfDebug, getPerfDebugLoops, getPerfDebugLoops)
}

export function PerfDebugOverlay() {
  const [enabled] = useState(() =>
    typeof window !== 'undefined' ? isPerfDebugEnabled() : false,
  )
  const prefersReducedMotion = useReducedMotion()
  const loops = usePerfDebugLoops()

  if (!enabled) return null

  const info = getPreferReducedEffectsDebugInfo(prefersReducedMotion)

  return (
    <div
      className="pointer-events-none fixed bottom-3 left-3 z-[9999] max-w-[min(100vw-1.5rem,320px)] rounded-lg border border-white/15 bg-black/90 px-3 py-2 font-mono text-[10px] leading-relaxed text-white/85 shadow-lg backdrop-blur-0"
      aria-live="polite"
      aria-label="Performance debug readout"
    >
      <p className="mb-1 font-semibold text-brand-gold">perf debug (?debug=perf)</p>
      <p>cores: {String(info.cores)}</p>
      <p>deviceMemory: {String(info.mem)}</p>
      <p>android UA: {info.isAndroid ? 'yes' : 'no'}</p>
      <p className="text-white">
        preferSimple:{' '}
        <span className={info.preferSimple ? 'text-emerald-400' : 'text-amber-400'}>
          {info.preferSimple ? 'true' : 'false'}
        </span>
      </p>
      <p className="mt-1 border-t border-white/10 pt-1 text-white/70">loops</p>
      <p>hero: {loops.hero}</p>
      <p>testimonials: {loops.testimonials}</p>
      <p>services ticker: {loops.servicesTicker}</p>
    </div>
  )
}
