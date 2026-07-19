import {
  SCROLL_REVEAL_ROOT_MARGIN,
  SCROLL_REVEAL_THRESHOLD,
} from '@/lib/scrollReveal'

type RevealRegistration = {
  onReveal: () => void
}

let sharedObserver: IntersectionObserver | null = null
const registrations = new Map<Element, RevealRegistration>()

function ensureObserver(): IntersectionObserver {
  if (sharedObserver) return sharedObserver

  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const reg = registrations.get(entry.target)
        if (!reg) continue
        reg.onReveal()
        registrations.delete(entry.target)
        sharedObserver?.unobserve(entry.target)
      }
    },
    {
      threshold: SCROLL_REVEAL_THRESHOLD,
      rootMargin: SCROLL_REVEAL_ROOT_MARGIN,
    },
  )

  return sharedObserver
}

function teardownIfEmpty() {
  if (registrations.size === 0 && sharedObserver) {
    sharedObserver.disconnect()
    sharedObserver = null
  }
}

/** One shared IO for all scroll-reveal elements — fires once per element, then unobserves. */
export function observeScrollRevealOnce(el: Element, onReveal: () => void): () => void {
  const obs = ensureObserver()
  registrations.set(el, { onReveal })
  obs.observe(el)

  return () => {
    registrations.delete(el)
    try {
      obs.unobserve(el)
    } catch {
      // element may already be gone
    }
    teardownIfEmpty()
  }
}
