import { motion, useInView } from 'framer-motion'
import type { HTMLAttributes, ReactNode } from 'react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

export interface RevealOnScrollProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

/**
 * Fades content in and moves it up slightly when it first enters the viewport.
 */
export function RevealOnScroll({ children, className, ...rest }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(className)}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

