'use client'

import { HeroParallax } from '@/components/ui/hero-parallax'
import { parallaxConfigForSlug } from '@/data/caseStudyParallax'

type CaseStudyParallaxShowcaseProps = {
  slug: string
}

export function CaseStudyParallaxShowcase({ slug }: CaseStudyParallaxShowcaseProps) {
  const config = parallaxConfigForSlug(slug)
  if (!config) return null

  return (
    <HeroParallax
      products={config.products}
      heading={config.heading}
      subheading={config.subheading}
    />
  )
}
