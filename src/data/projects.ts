/**
 * Shared Work portfolio data.
 *
 * PLACEHOLDER FIELDS (need real client-approved content before go-live):
 * - All projects: challenge.heading/body, solution.heading/body,
 *   results (4× value/label/description except where noted),
 *   testimonial (optional), gallery (extra shots beyond hero image)
 * - DDEN: challenge, solution, results×4, testimonial, gallery extras
 * - MICRONANO: challenge, solution, results×4, testimonial, gallery extras
 * - RDC: challenge, solution, results×4, testimonial, gallery extras
 * - PLAAM: challenge, solution, result #4, testimonial, gallery extras
 *   (results 1–3 reuse existing live metrics: revenue / orders / conversion)
 * - LAVVI: challenge, solution, results×4, testimonial, gallery extras
 * - AXELS: challenge, solution, results×4, testimonial, gallery extras
 *   (sample project — keep labeled as non-client)
 */

// PLAAM IMAGES
import plaam2 from '@/assets/case-studies/plaam/2.webp'
import plaam3 from '@/assets/case-studies/plaam/3.webp'
import plaam4 from '@/assets/case-studies/plaam/4.webp'
import plaam5 from '@/assets/case-studies/plaam/5.webp'
import plaam6 from '@/assets/case-studies/plaam/6.webp'
import plaam7 from '@/assets/case-studies/plaam/7.webp'
import plaam8 from '@/assets/case-studies/plaam/8.webp'
import plaam9 from '@/assets/case-studies/plaam/9.webp'



import ddenImage from '@/assets/project-images/dden.webp'
import mnrdcImage from '@/assets/project-images/mnrdc.webp'
import rdcImage from '@/assets/project-images/rdc.webp'
import axelsImage from '@/assets/project-images/axels.webp'
import plaamImage from '@/assets/project-images/plaam.webp'
import lavviImage from '@/assets/project-images/lavvi.webp'

export type ProjectStatOverlay = {
  value: string
  label: string
}

export type ProjectResult = {
  value: string
  label: string
  description: string
}

export type ProjectTestimonial = {
  quote: string
  name: string
  role: string
  avatar?: string
}

export type Project = {
  id: string
  slug: string
  title: string
  tag: string
  services: string
  tagline?: string
  description: string
  /** Legacy single-stat string (listing / compatibility). */
  stat?: string
  /** Listing mockup float — only when set. */
  statOverlay?: ProjectStatOverlay
  link: string
  websiteUrl?: string
  image: string
  imageAlt: string
  year: string
  isSample?: boolean
  /** When true, listing card links to `/work/:slug` and the case study page is available. */
  caseStudy?: boolean
  gallery: string[]
  challenge: { heading: string; body: string[] }
  solution: { heading: string; body: string[] }
  results: ProjectResult[]
  testimonial?: ProjectTestimonial
  /** Case study intro — bold one-liner above overview paragraphs. */
  introHeadline?: string
  /** Case study overview copy (1–2 paragraphs). */
  introBody?: string[]
  /** Full-bleed hero on case study page (falls back to `image`). */
  heroImage?: string
  /** Two-up image row below Challenges (falls back to first gallery shots). */
  challengeImages?: string[]
  /** Results section heading (falls back to generic default in template). */
  resultsHeading?: string
}

const PH = (project: string, field: string) =>
  `PLACEHOLDER — ${field} needed for ${project}`

function placeholderResults(project: string): ProjectResult[] {
  return [1, 2, 3, 4].map((n) => ({
    value: '—',
    label: PH(project, `result ${n} label`),
    description: PH(project, `result ${n} description`),
  }))
}

function placeholderChallenge(project: string) {
  return {
    heading: PH(project, 'challenge heading'),
    body: [
      PH(project, 'challenge paragraph 1'),
      PH(project, 'challenge paragraph 2'),
    ],
  }
}

function placeholderSolution(project: string) {
  return {
    heading: PH(project, 'solution heading'),
    body: [
      PH(project, 'solution paragraph 1'),
      PH(project, 'solution paragraph 2'),
    ],
  }
}

const CASE_STUDY_GALLERIES = {
  plaam: [
    plaam2,
    plaam3,
    plaam4,
    plaam5,
    plaam6,
    plaam7,
    plaam8,
    plaam9,
  ],
} as const

/** Gallery uses the hero shot repeated until additional assets exist. */
function galleryFrom(
  hero: string,
  gallery?: readonly string[],
  count = 4,
): string[] {
  if (gallery?.length) return [...gallery]

  return Array.from({ length: count }, () => hero)
}

export const PROJECTS: Project[] = [
  {
    id: 'dden',
    slug: 'dden',
    title: 'DDEN',
    description:
      'A digital platform for a designer fashion marketplace — built for browsing, discovery, and a smooth path to purchase.',
    image: ddenImage,
    imageAlt: 'DDEN fashion marketplace homepage',
    link: 'https://www.dden.in/',
    websiteUrl: 'https://www.dden.in/',
    tag: 'Fashion-Tech Platform',
    year: '2024',
    services: 'BRANDING · DESIGN · DEVELOPMENT',
    tagline: 'Browse, discover, and buy designer fashion.',
    stat: '+120%',
    statOverlay: { value: '+120%', label: 'User Engagement' },
    gallery: galleryFrom(ddenImage),
    challenge: placeholderChallenge('DDEN'),
    solution: placeholderSolution('DDEN'),
    results: placeholderResults('DDEN'),
    testimonial: {
      quote: PH('DDEN', 'testimonial quote'),
      name: PH('DDEN', 'testimonial name'),
      role: PH('DDEN', 'testimonial role'),
    },
  },
  {
    id: 'plaam',
    slug: 'plaam',
    title: 'PLAAM',
    description: 'Curated jewellery-making and craft essentials.',
    image: plaamImage,
    imageAlt: 'PLAAM craft and jewellery storefront',
    link: 'https://www.plaam.in/',
    websiteUrl: 'https://www.plaam.in/',
    tag: 'Craft & Jewellery Store',
    year: '2026',
    services: 'BRANDING · DESIGN · DEVELOPMENT',
    tagline: 'Where Creativity Finds Its Supplies',
    statOverlay: { value: '13.87%', label: 'Conversion Rate' },
    caseStudy: true,
    introHeadline: 'From WhatsApp Orders to a Storefront That Never Sleeps',
    introBody: [
      "PLAAM started as a small business selling jewellery-making and craft materials — silk threads, kundans, clip stones, and everything in between — with every order coming through WhatsApp. As the customer base grew, so did the messages, and PLAAM's team simply couldn't keep up. Replies were delayed, orders were missed, and there was no real way to browse the full catalog without asking.",
      "They needed a proper online store, but as a small business, a fully custom-built platform with its own servers, databases, and ongoing infrastructure costs wasn't realistic — or necessary.",
    ],
    gallery: galleryFrom(plaamImage, CASE_STUDY_GALLERIES.plaam),
    challenge: {
      heading: 'Challenges',
      body: [
        "PLAAM's biggest bottleneck wasn't demand — it was capacity. Every order, every product question, every \"do you have this in stock\" came through WhatsApp, and there was no way to scale a conversation-based sales process without losing customers along the way.",
        "A standard e-commerce solution seemed like the obvious fix, but PLAAM's catalog didn't fit neatly into any off-the-shelf Shopify template. Their product structure — spanning silk thread materials, jewellery-making components, glossy kundans, white & gold kundans, and clip stones — needed a browsing experience built specifically around how their customers actually shop, not a generic theme retrofitted to work.",
      ],
    },
    solution: {
      heading: 'Solutions',
      body: [
        "We recommended Shopify as the commerce backbone — giving PLAAM enterprise-grade infrastructure, payments, and order management without the overhead of managing servers, databases, or hosting themselves. As a small business, that meant zero infrastructure costs and zero technical maintenance burden going forward.",
        "But no existing Shopify theme could handle PLAAM's catalog the way it needed to be presented. So instead of forcing a template to fit, we built a fully custom headless storefront on Shopify's Storefront API — giving PLAAM a completely bespoke browsing and shopping experience, while Shopify quietly handled everything running underneath it.",
      ],
    },
    results: [
      {
        value: '₹2.5L+',
        label: 'Revenue Generated',
        description: 'Live storefront revenue attributed to the shipped PLAAM experience.',
      },
      {
        value: '300+',
        label: 'Orders Processed',
        description: 'Orders fulfilled through the craft & jewellery storefront.',
      },
      {
        value: '13.87%',
        label: 'Conversion Rate',
        description: 'Measured conversion on the launched storefront.',
      },
      {
        value: '1,500+',
        label: 'Site Sessions',
        description:
          'Organic and returning traffic the storefront now handles independently — visibility PLAAM never had through WhatsApp alone.',
      },
    ],
  },
  {
    id: 'micronano',
    slug: 'micronano',
    title: 'MICRONANO',
    description:
      'Advanced micro and nano technology application platform for research and development.',
    image: mnrdcImage,
    imageAlt: 'MICRONANO resource booking system interface',
    link: 'https://app.micronano.paruluniversity.ac.in/',
    websiteUrl: 'https://app.micronano.paruluniversity.ac.in/',
    tag: 'Resource Booking System',
    year: '2024',
    services: 'UI/UX · ENGINEERING · RESEARCH',
    tagline: 'Precision at the Nanoscale',
    stat: '+89%',
    statOverlay: { value: '+89%', label: 'Traffic Growth' },
    gallery: galleryFrom(mnrdcImage),
    challenge: placeholderChallenge('MICRONANO'),
    solution: placeholderSolution('MICRONANO'),
    results: placeholderResults('MICRONANO'),
  },
  {
    id: 'rdc',
    slug: 'rdc',
    title: 'RDC',
    description:
      'Research and Development Center fostering innovation and technological advancement.',
    image: rdcImage,
    imageAlt: 'RDC research website homepage',
    link: 'https://rdc.paruluniversity.ac.in/',
    websiteUrl: 'https://rdc.paruluniversity.ac.in/',
    tag: 'Research Website',
    year: '2023',
    services: 'STRATEGY · DESIGN · DEVELOPMENT',
    tagline: 'From Research to Real-World Impact',
    stat: '+74%',
    gallery: galleryFrom(rdcImage),
    challenge: placeholderChallenge('RDC'),
    solution: placeholderSolution('RDC'),
    results: placeholderResults('RDC'),
  },
  {
    id: 'lavvi',
    slug: 'lavvi',
    title: 'LavviStore',
    description:
      'Designed and developed a high-performance e-commerce platform for LavviStore, focused on delivering a premium shopping experience through clean design, fast performance, mobile-first responsiveness, and scalable architecture.',
    image: lavviImage,
    imageAlt: 'LavviStore e-commerce website preview',
    link: 'https://www.lavvistore.com/',
    websiteUrl: 'https://www.lavvistore.com/',
    tag: 'Featured Client Project',
    year: '2025',
    services: 'BRANDING · UI/UX · E-COMMERCE · DEVELOPMENT',
    statOverlay: { value: '100%', label: 'Custom Solution' },
    gallery: galleryFrom(lavviImage),
    challenge: placeholderChallenge('LAVVI'),
    solution: placeholderSolution('LAVVI'),
    results: placeholderResults('LAVVI'),
  },
  {
    id: 'axels',
    slug: 'axels',
    title: 'AXELS',
    description:
      'A self-directed build exploring skills/learning platform UX and performance — built to sharpen our own process, not for a paying client.',
    image: axelsImage,
    imageAlt: 'AXELS sample skills platform UI',
    link: 'https://axels-beta.vercel.app/',
    websiteUrl: 'https://axels-beta.vercel.app/',
    tag: 'Sample Project — Not a Client Engagement',
    year: '2024',
    services: 'PRODUCT · DESIGN · DEVELOPMENT',
    tagline: 'Practice work that sharpened our process.',
    isSample: true,
    stat: '+95%',
    gallery: galleryFrom(axelsImage),
    challenge: placeholderChallenge('AXELS'),
    solution: placeholderSolution('AXELS'),
    results: placeholderResults('AXELS'),
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug)
}

export function projectHasCaseStudy(project: Project): boolean {
  return project.caseStudy === true
}
