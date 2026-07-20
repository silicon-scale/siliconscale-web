'use client'

import { HeroParallax } from '@/components/ui/hero-parallax'
import { products } from '@/data/plaamParallaxProducts'

export function PlaamParallaxShowcase() {
  return <HeroParallax products={products} />
}
