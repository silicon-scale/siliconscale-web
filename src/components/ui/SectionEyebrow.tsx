'use client'

import type { HTMLAttributes } from 'react'

// SectionEyebrow has been deprecated across the site. Export a no-op
// component so remaining imports render nothing instead of failing.
export type SectionEyebrowProps = HTMLAttributes<HTMLParagraphElement> & {
  variant?: string
}

export function SectionEyebrow(_: SectionEyebrowProps) {
  return null
}
