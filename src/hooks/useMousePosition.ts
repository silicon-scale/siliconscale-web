import { RefObject, useEffect } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

export interface MousePosition {
  x: ReturnType<typeof useSpring>
  y: ReturnType<typeof useSpring>
}

/**
 * Tracks mouse position within a container and exposes smoothed motion values in 0–1 range.
 * Uses motion values + springs to avoid React re-renders on every mouse move.
 */
export function useMousePosition(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean = true,
): MousePosition {
  const rawX = useMotionValue(0.5)
  const rawY = useMotionValue(0.5)

  const x = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.7 })
  const y = useSpring(rawY, { stiffness: 60, damping: 24, mass: 0.8 })

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return

    const handlePointerMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const nx = (event.clientX - rect.left) / rect.width
      const ny = (event.clientY - rect.top) / rect.height
      const clampedX = Math.min(1, Math.max(0, nx))
      const clampedY = Math.min(1, Math.max(0, ny))
      rawX.set(clampedX)
      rawY.set(clampedY)
    }

    el.addEventListener('pointermove', handlePointerMove)
    return () => {
      el.removeEventListener('pointermove', handlePointerMove)
    }
  }, [enabled, ref, rawX, rawY])

  return { x, y }
}

