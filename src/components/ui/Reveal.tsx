'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type RevealProps = React.PropsWithChildren<{
  delay?: number
  className?: string
}>

export default function Reveal({ delay = 0, className, children }: RevealProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

