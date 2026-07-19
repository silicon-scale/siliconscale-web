'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { observeScrollRevealOnce } from '@/utils/sharedScrollRevealObserver'
import { scrollRevealDelay, SCROLL_REVEAL_DURATION_MS } from '@/lib/scrollReveal'

type ScrollRevealGroupProps = {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

/**
 * One shared IO trigger for a group of `.scroll-reveal-item` children.
 * Avoids N observers + N simultaneous compositor promotions for grid/list sections.
 */
export function ScrollRevealGroup({ children, className, style }: ScrollRevealGroupProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const items = [...root.querySelectorAll<HTMLElement>('.scroll-reveal-item')]

    if (prefersReducedMotion) {
      root.classList.add('is-visible')
      for (const item of items) {
        item.classList.add('is-visible', 'is-reduced')
      }
      return
    }

    const reveal = () => {
      root.classList.add('is-visible')
      items.forEach((item, index) => {
        item.style.setProperty('--scroll-reveal-duration', `${SCROLL_REVEAL_DURATION_MS}ms`)
        item.style.setProperty('--scroll-reveal-delay', scrollRevealDelay(index))
        item.classList.add('is-animating')
        requestAnimationFrame(() => item.classList.add('is-visible'))

        const onEnd = (event: TransitionEvent) => {
          if (event.target !== item) return
          if (event.propertyName === 'transform' || event.propertyName === 'opacity') {
            item.classList.remove('is-animating')
            item.removeEventListener('transitionend', onEnd)
          }
        }
        item.addEventListener('transitionend', onEnd)
      })
    }

    const rect = root.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.08) {
      reveal()
      return
    }

    return observeScrollRevealOnce(root, reveal)
  }, [prefersReducedMotion])

  return (
    <div ref={ref} className={cn('scroll-reveal-group', className)} style={style}>
      {children}
    </div>
  )
}
