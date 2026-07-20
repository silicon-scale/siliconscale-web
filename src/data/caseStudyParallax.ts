import { products as ddenProducts } from '@/data/ddenParallaxProducts'
import { products as plaamProducts } from '@/data/plaamParallaxProducts'

export type CaseStudyParallaxConfig = {
  products: {
    title: string
    link: string
    thumbnail: string
  }[]
  heading: string
  subheading: string
}

export const CASE_STUDY_PARALLAX: Record<string, CaseStudyParallaxConfig> = {
  plaam: {
    products: plaamProducts,
    heading: 'Every screen, every detail',
    subheading:
      'A closer look at PLAAM — from storefront browse to checkout, every screen of the custom headless Shopify experience we shipped.',
  },
  dden: {
    products: ddenProducts,
    heading: 'Every screen, every detail',
    subheading:
      'A closer look at DDEN — client, admin, and merchant portals connected in one platform for fashion designers and recruiters.',
  },
}

export function parallaxConfigForSlug(slug: string): CaseStudyParallaxConfig | undefined {
  return CASE_STUDY_PARALLAX[slug]
}
