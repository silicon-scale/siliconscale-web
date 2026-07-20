import ddenHero from '@/assets/project-images/dden.webp'
import dden1 from '@/assets/case-studies/dden/1.webp'
import dden2 from '@/assets/case-studies/dden/2.webp'
import dden3 from '@/assets/case-studies/dden/3.webp'
import dden4 from '@/assets/case-studies/dden/4.webp'
import dden5 from '@/assets/case-studies/dden/5.webp'
import dden6 from '@/assets/case-studies/dden/6.webp'
import dden7 from '@/assets/case-studies/dden/7.webp'
import dden8 from '@/assets/case-studies/dden/8.webp'
import dden9 from '@/assets/case-studies/dden/9.webp'

const DDEN_SITE = 'https://www.dden.in/'

const DDEN_SCREEN_SOURCES = [
  { title: 'Design showcase feed', thumbnail: ddenHero },
  { title: 'Designer portfolio', thumbnail: dden1 },
  { title: 'Profile & identity', thumbnail: dden2 },
  { title: 'Recruiter discovery', thumbnail: dden3 },
  { title: 'Browse & hire flow', thumbnail: dden4 },
  { title: 'Admin portal', thumbnail: dden5 },
  { title: 'Merchant portal', thumbnail: dden6 },
  { title: '3D garment viewer', thumbnail: dden7 },
  { title: 'Stitch order workflow', thumbnail: dden8 },
  { title: 'Platform dashboard', thumbnail: dden9 },
] as const

const PRODUCT_COUNT = 15

/** Cycle DDEN hero + gallery shots to fill the 15-card parallax grid. */
export const products = Array.from({ length: PRODUCT_COUNT }, (_, i) => {
  const source = DDEN_SCREEN_SOURCES[i % DDEN_SCREEN_SOURCES.length]
  const cycle = Math.floor(i / DDEN_SCREEN_SOURCES.length)
  return {
    title: cycle > 0 ? `${source.title} (${cycle + 1})` : source.title,
    link: DDEN_SITE,
    thumbnail: source.thumbnail,
  }
})
