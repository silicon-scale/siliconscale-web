import plaamHero from '@/assets/project-images/plaam.webp?responsive'
import plaam2 from '@/assets/case-studies/plaam/2.webp?responsive'
import plaam3 from '@/assets/case-studies/plaam/3.webp?responsive'
import plaam4 from '@/assets/case-studies/plaam/4.webp?responsive'
import plaam5 from '@/assets/case-studies/plaam/5.webp?responsive'
import plaam6 from '@/assets/case-studies/plaam/6.webp?responsive'
import plaam7 from '@/assets/case-studies/plaam/7.webp?responsive'
import plaam8 from '@/assets/case-studies/plaam/8.webp?responsive'
import plaam9 from '@/assets/case-studies/plaam/9.webp?responsive'

const PLAAM_SITE = 'https://www.plaam.in/'

const PLAAM_SCREEN_SOURCES = [
  { title: 'Home page', thumbnail: plaamHero },
  { title: 'Storefront hero', thumbnail: plaam2 },
  { title: 'Product listing', thumbnail: plaam3 },
  { title: 'Category browse', thumbnail: plaam4 },
  { title: 'Product detail', thumbnail: plaam5 },
  { title: 'Analytics dashboard', thumbnail: plaam6 },
  { title: 'Sales overview', thumbnail: plaam7 },
  { title: 'Checkout flow', thumbnail: plaam8 },
  { title: 'Cart & orders', thumbnail: plaam9 },
] as const

const PRODUCT_COUNT = 15

/** Cycle PLAAM hero + gallery shots to fill the 15-card parallax grid. */
export const products = Array.from({ length: PRODUCT_COUNT }, (_, i) => {
  const source = PLAAM_SCREEN_SOURCES[i % PLAAM_SCREEN_SOURCES.length]
  const cycle = Math.floor(i / PLAAM_SCREEN_SOURCES.length)
  return {
    title: cycle > 0 ? `${source.title} (${cycle + 1})` : source.title,
    link: PLAAM_SITE,
    thumbnail: source.thumbnail,
  }
})
