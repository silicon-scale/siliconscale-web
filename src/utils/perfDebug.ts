export type PerfDebugLoopKey =
  | 'hero'
  | 'testimonials'
  | 'servicesTicker'
  | 'finalCtaAmbient'
  | 'finalCtaRotatingWord'
  | 'footerWaves'
  | 'connectGlitter'
export type PerfDebugLoopStatus = 'active' | 'paused' | 'unknown'

/** Navbar frosted glass — isolated compositor layer (see Navbar.tsx). */
export const NAVBAR_BLUR_RADIUS_PX = 8

export type NavbarDebugState = {
  approach: 'isolated-layer-blur'
  blurRadiusPx: number
  scrolled: boolean
  containLayoutPaint: boolean
  layerPromotion: boolean
  willChangeBackdropFilter: boolean
}

const loopState: Record<PerfDebugLoopKey, PerfDebugLoopStatus> = {
  hero: 'unknown',
  testimonials: 'unknown',
  servicesTicker: 'unknown',
  finalCtaAmbient: 'unknown',
  finalCtaRotatingWord: 'unknown',
  footerWaves: 'unknown',
  connectGlitter: 'unknown',
}

/** Stable snapshot for useSyncExternalStore — same reference until a loop changes. */
let loopsSnapshot: Record<PerfDebugLoopKey, PerfDebugLoopStatus> = { ...loopState }

let navbarDebug: NavbarDebugState = {
  approach: 'isolated-layer-blur',
  blurRadiusPx: NAVBAR_BLUR_RADIUS_PX,
  scrolled: false,
  containLayoutPaint: true,
  layerPromotion: true,
  willChangeBackdropFilter: false,
}
let navbarSnapshot: NavbarDebugState = { ...navbarDebug }

type PerfDebugSnapshot = {
  loops: Record<PerfDebugLoopKey, PerfDebugLoopStatus>
  navbar: NavbarDebugState
}

let debugSnapshot: PerfDebugSnapshot = {
  loops: loopsSnapshot,
  navbar: navbarSnapshot,
}

function refreshDebugSnapshot(): void {
  debugSnapshot = {
    loops: loopsSnapshot,
    navbar: navbarSnapshot,
  }
}

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
  refreshDebugSnapshot()
  listeners.forEach((cb) => cb())
}

export function getPerfDebugLoops(): Record<PerfDebugLoopKey, PerfDebugLoopStatus> {
  return loopsSnapshot
}

export function setNavbarDebug(partial: Partial<NavbarDebugState>): void {
  const next = { ...navbarDebug, ...partial }
  if (
    next.approach === navbarDebug.approach &&
    next.blurRadiusPx === navbarDebug.blurRadiusPx &&
    next.scrolled === navbarDebug.scrolled &&
    next.containLayoutPaint === navbarDebug.containLayoutPaint &&
    next.layerPromotion === navbarDebug.layerPromotion &&
    next.willChangeBackdropFilter === navbarDebug.willChangeBackdropFilter
  ) {
    return
  }
  navbarDebug = next
  navbarSnapshot = { ...navbarDebug }
  refreshDebugSnapshot()
  listeners.forEach((cb) => cb())
}

export function getNavbarDebug(): NavbarDebugState {
  return navbarSnapshot
}

export function getPerfDebugSnapshot(): PerfDebugSnapshot {
  return debugSnapshot
}

export function subscribePerfDebug(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
