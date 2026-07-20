import {
  COUNT_UP_IN_VIEW_ROOT_MARGIN,
  COUNT_UP_IN_VIEW_THRESHOLD,
  SCROLL_REVEAL_ROOT_MARGIN,
  SCROLL_REVEAL_THRESHOLD,
} from '@/lib/scrollReveal'

type RevealRegistration = {
  onReveal: () => void
}

type ObserverKind = 'scrollReveal' | 'countUp'

let scrollRevealObserver: IntersectionObserver | null = null
let countUpObserver: IntersectionObserver | null = null
const registrations = new Map<Element, RevealRegistration>()

function ensureObserver(kind: ObserverKind): IntersectionObserver {
  if (kind === 'countUp') {
    if (countUpObserver) return countUpObserver

    countUpObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const reg = registrations.get(entry.target)
          if (!reg) continue
          reg.onReveal()
          registrations.delete(entry.target)
          countUpObserver?.unobserve(entry.target)
        }
      },
      {
        threshold: COUNT_UP_IN_VIEW_THRESHOLD,
        rootMargin: COUNT_UP_IN_VIEW_ROOT_MARGIN,
      },
    )

    return countUpObserver
  }

  if (scrollRevealObserver) return scrollRevealObserver

  scrollRevealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const reg = registrations.get(entry.target)
        if (!reg) continue
        reg.onReveal()
        registrations.delete(entry.target)
        scrollRevealObserver?.unobserve(entry.target)
      }
    },
    {
      threshold: SCROLL_REVEAL_THRESHOLD,
      rootMargin: SCROLL_REVEAL_ROOT_MARGIN,
    },
  )

  return scrollRevealObserver
}

function teardownIfEmpty() {
  if (registrations.size === 0) {
    scrollRevealObserver?.disconnect()
    countUpObserver?.disconnect()
    scrollRevealObserver = null
    countUpObserver = null
  }
}

function observeOnce(
  el: Element,
  onReveal: () => void,
  kind: ObserverKind,
): () => void {
  const obs = ensureObserver(kind)
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

/** One shared IO for scroll-reveal elements — fires once per element, then unobserves. */
export function observeScrollRevealOnce(el: Element, onReveal: () => void): () => void {
  return observeOnce(el, onReveal, 'scrollReveal')
}

/** Looser IO tuned for count-up stat blocks on narrow / mobile viewports. */
export function observeCountUpInViewOnce(el: Element, onReveal: () => void): () => void {
  return observeOnce(el, onReveal, 'countUp')
}
