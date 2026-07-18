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
  gallery: string[]
  challenge: { heading: string; body: string[] }
  solution: { heading: string; body: string[] }
  results: ProjectResult[]
  testimonial?: ProjectTestimonial
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

/** Gallery uses the hero shot repeated until additional assets exist. */
function galleryFrom(hero: string, count = 4): string[] {
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
    gallery: galleryFrom(plaamImage),
    challenge: placeholderChallenge('PLAAM'),
    solution: placeholderSolution('PLAAM'),
    results: [
      {
        value: '₹1.3L+',
        label: 'Revenue Generated',
        description: 'Live storefront revenue attributed to the shipped PLAAM experience.',
      },
      {
        value: '150+',
        label: 'Orders Processed',
        description: 'Orders fulfilled through the craft & jewellery storefront.',
      },
      {
        value: '13.87%',
        label: 'Conversion Rate',
        description: 'Measured conversion on the launched storefront.',
      },
      {
        value: '—',
        label: PH('PLAAM', 'result 4 label'),
        description: PH('PLAAM', 'result 4 description'),
      },
    ],
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
