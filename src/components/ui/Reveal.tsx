'use client'

import ScrollReveal from '@/components/ui/ScrollReveal'

type RevealProps = React.PropsWithChildren<{
  delay?: number
  className?: string
  staggerIndex?: number
}>

/** Back-compat wrapper — IO + CSS scroll reveal (no Framer whileInView). */
export default function Reveal({
  delay = 0,
  className,
  staggerIndex,
  children,
}: RevealProps) {
  return (
    <ScrollReveal
      delay={delay}
      staggerIndex={staggerIndex}
      className={className}
    >
      {children}
    </ScrollReveal>
  )
}
