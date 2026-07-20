import { useEffect, useRef, useState } from 'react'
import { observeCountUpInViewOnce, observeScrollRevealOnce } from '@/utils/sharedScrollRevealObserver'

export type UseInViewOnceOptions = {
  /** When true, element is treated as immediately visible (e.g. reduced motion). */
  disabled?: boolean
  /** Looser intersection settings for large stat / count-up blocks on mobile. */
  variant?: 'default' | 'countUp'
}

function isAlreadyInViewport(el: Element) {
  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight
  return rect.top < vh * 0.94 && rect.bottom > vh * 0.06
}

/**
 * Intersection Observer gate — fires once when the element enters the viewport.
 * Uses the shared scroll-reveal observer singleton (not a per-hook instance).
 */
export function useInViewOnce<T extends Element = HTMLElement>(
  options: UseInViewOnceOptions = {},
) {
  const { disabled = false, variant = 'default' } = options
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(disabled)

  useEffect(() => {
    if (disabled) {
      setInView(true)
      return
    }

    const el = ref.current
    if (!el) return

    if (isAlreadyInViewport(el)) {
      setInView(true)
      return
    }

    const observe =
      variant === 'countUp' ? observeCountUpInViewOnce : observeScrollRevealOnce

    return observe(el, () => setInView(true))
  }, [disabled, variant])

  return { ref, inView }
}
