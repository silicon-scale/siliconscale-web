'use client'

import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { observeScrollRevealOnce } from '@/utils/sharedScrollRevealObserver'
import {
  scrollRevealDelay,
  SCROLL_REVEAL_DURATION_MS,
  SCROLL_REVEAL_OFFSET_Y_PX,
} from '@/lib/scrollReveal'

type ScrollRevealOwnProps<T extends ElementType> = {
  as?: T
  children?: ReactNode
  className?: string
  delay?: number
  staggerIndex?: number
  threshold?: number
  rootMargin?: string
  offsetY?: number
  durationMs?: number
}

export type ScrollRevealProps<T extends ElementType = 'div'> = ScrollRevealOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ScrollRevealOwnProps<T>>

function startReveal(el: HTMLElement) {
  if (el.classList.contains('is-visible')) return

  el.classList.add('is-animating')
  requestAnimationFrame(() => {
    el.classList.add('is-visible')
  })

  const onEnd = (event: TransitionEvent) => {
    if (event.target !== el) return
    if (event.propertyName === 'transform' || event.propertyName === 'opacity') {
      el.classList.remove('is-animating')
      el.removeEventListener('transitionend', onEnd)
    }
  }
  el.addEventListener('transitionend', onEnd)
}

function ScrollRevealInner<T extends ElementType = 'div'>(
  {
    as,
    children,
    className,
    delay = 0,
    staggerIndex = 0,
    offsetY = SCROLL_REVEAL_OFFSET_Y_PX,
    durationMs = SCROLL_REVEAL_DURATION_MS,
    style,
    ...rest
  }: ScrollRevealProps<T>,
  forwardedRef: React.ForwardedRef<Element>,
) {
  const Component = (as ?? 'div') as ElementType
  const prefersReducedMotion = useReducedMotion()
  const disabled = !!prefersReducedMotion
  const innerRef = useRef<HTMLElement | null>(null)

  const delayMs = scrollRevealDelay(staggerIndex, Math.round(delay * 1000))

  const mergedStyle = useMemo(
    () => ({
      ...style,
      ['--scroll-reveal-y' as string]: `${offsetY}px`,
      ['--scroll-reveal-duration' as string]: `${durationMs}ms`,
      ['--scroll-reveal-delay' as string]: disabled ? '0ms' : delayMs,
    }),
    [delayMs, disabled, durationMs, offsetY, style],
  )

  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    if (disabled) {
      el.classList.add('is-visible', 'is-reduced')
      return
    }

    const reveal = () => startReveal(el)

    const rect = el.getBoundingClientRect()
    const alreadyVisible =
      rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.08

    if (alreadyVisible) {
      reveal()
      return
    }

    return observeScrollRevealOnce(el, reveal)
  }, [disabled])

  const setRef = (node: HTMLElement | null) => {
    innerRef.current = node
    if (typeof forwardedRef === 'function') forwardedRef(node)
    else if (forwardedRef) forwardedRef.current = node
  }

  return (
    <Component
      ref={setRef}
      className={cn('scroll-reveal', disabled && 'is-reduced', className)}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </Component>
  )
}

const ScrollReveal = forwardRef(ScrollRevealInner) as <T extends ElementType = 'div'>(
  props: ScrollRevealProps<T> & { ref?: React.ForwardedRef<Element> },
) => ReturnType<typeof ScrollRevealInner>

export default ScrollReveal
