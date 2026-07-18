import { useEffect, useState, type RefObject } from 'react'
import { observeVisibility } from '@/utils/sharedVisibilityObserver'

type UseSectionInViewOptions = {
  /** Initial value before the observer fires (default false). */
  initial?: boolean
  onVisibilityChange?: (visible: boolean) => void
}

/**
 * Shared IntersectionObserver gate — pauses off-screen loops when visibility ends.
 */
export function useSectionInView(
  ref: RefObject<Element | null>,
  options: UseSectionInViewOptions = {},
) {
  const { initial = false, onVisibilityChange } = options
  const [inView, setInView] = useState(initial)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    return observeVisibility(el, (visible) => {
      setInView(visible)
      onVisibilityChange?.(visible)
    })
  }, [ref, onVisibilityChange])

  return inView
}
