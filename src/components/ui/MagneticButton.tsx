import { motion, useMotionValue, useSpring } from 'framer-motion'
import type { ButtonHTMLAttributes, MouseEvent } from 'react'
import { cn } from '@/lib/utils'

export interface MagneticButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

/**
 * Subtle magnetic hover button.
 * Uses transforms only (no layout changes) and motion values to stay 60fps.
 */
export function MagneticButton({
  className,
  children,
  onMouseMove,
  onMouseLeave,
  ...rest
}: MagneticButtonProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 150, damping: 18, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 150, damping: 18, mass: 0.4 })

  const handleMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const offsetX = event.clientX - (rect.left + rect.width / 2)
    const offsetY = event.clientY - (rect.top + rect.height / 2)

    const maxOffset = 6
    const nextX = Math.max(-maxOffset, Math.min(maxOffset, offsetX / 4))
    const nextY = Math.max(-maxOffset, Math.min(maxOffset, offsetY / 4))

    x.set(nextX)
    y.set(nextY)

    onMouseMove?.(event)
  }

  const handleMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
    x.set(0)
    y.set(0)
    onMouseLeave?.(event)
  }

  return (
    <motion.button
      type="button"
      style={{ x: springX, y: springY }}
      className={cn('will-change-transform', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

