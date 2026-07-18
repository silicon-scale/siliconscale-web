export type PerfDebugLoopKey = 'hero' | 'testimonials' | 'servicesTicker'
export type PerfDebugLoopStatus = 'active' | 'paused' | 'unknown'

const loopState: Record<PerfDebugLoopKey, PerfDebugLoopStatus> = {
  hero: 'unknown',
  testimonials: 'unknown',
  servicesTicker: 'unknown',
}

/** Stable snapshot for useSyncExternalStore — same reference until a loop changes. */
let loopsSnapshot: Record<PerfDebugLoopKey, PerfDebugLoopStatus> = { ...loopState }

const listeners = new Set<() => void>()

export function isPerfDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('debug') === 'perf'
}

export function setPerfDebugLoop(
  key: PerfDebugLoopKey,
  status: PerfDebugLoopStatus,
): void {
  if (loopState[key] === status) return
  loopState[key] = status
  loopsSnapshot = { ...loopState }
  listeners.forEach((cb) => cb())
}

export function getPerfDebugLoops(): Record<PerfDebugLoopKey, PerfDebugLoopStatus> {
  return loopsSnapshot
}

export function subscribePerfDebug(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
