import { useEffect, useRef, useState } from 'react'
import { observeScrollRevealOnce } from '@/utils/sharedScrollRevealObserver'

export type UseInViewOnceOptions = {
  /** When true, element is treated as immediately visible (e.g. reduced motion). */
  disabled?: boolean
}

/**
 * Intersection Observer gate — fires once when the element enters the viewport.
 * Uses the shared scroll-reveal observer singleton (not a per-hook instance).
 */
export function useInViewOnce<T extends Element = HTMLElement>(
  options: UseInViewOnceOptions = {},
) {
  const { disabled = false } = options
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(disabled)

  useEffect(() => {
    if (disabled) {
      setInView(true)
      return
    }

    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.08) {
      setInView(true)
      return
    }

    return observeScrollRevealOnce(el, () => setInView(true))
  }, [disabled])

  return { ref, inView }
}
