import { useState, useEffect, useRef } from 'react'

/**
 * Returns true when scroll position passes the threshold.
 * Uses requestAnimationFrame to avoid layout thrashing and minimize re-renders.
 */
export function useScrollThreshold(threshold = 40): boolean {
  const [isPast, setIsPast] = useState(false)
  const rafRef = useRef<number | null>(null)
  const lastRef = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        const now = window.scrollY > threshold
        if (now !== lastRef.current) {
          lastRef.current = now
          setIsPast(now)
        }
        rafRef.current = null
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [threshold])

  return isPast
}
