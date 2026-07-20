/**
 * Shared Work portfolio data.
 *
 * PLACEHOLDER FIELDS (need real client-approved content before go-live):
 * - All projects: challenge.heading/body, solution.heading/body,
 *   results (4× value/label/description except where noted),
 *   testimonial (optional), gallery (extra shots beyond hero image)
 * - DDEN: results×4 (placeholders), gallery extras, testimonial, hero assets
 * - MICRONANO R&D / RDC: independent work only (INDEPENDENT_PROJECTS)
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

// DDEN IMAGES



// LAVVI IMAGES


// 

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
  /** When true, render value as static text (no count-up). */
  skipCountUp?: boolean
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
  /** Solo / personal builds — not agency client engagements. */
  isIndependent?: boolean
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
    tag: 'Fashion-Tech Platform',
    services: 'UI/UX · BACKEND · DEVELOPMENT',
    description:
      'A LinkedIn-style platform where fashion designers showcase their work and get discovered by recruiters and brands.',
    image: ddenImage,
    imageAlt: PH('DDEN', 'listing / hero image alt'),
    link: 'https://www.dden.in/',
    websiteUrl: 'https://www.dden.in/',
    year: PH('DDEN', 'year'),
    tagline: PH('DDEN', 'tagline'),
    caseStudy: true,
    introHeadline: 'A LinkedIn for Fashion Designers — Built From Nothing but an Idea',
    introBody: [
      'DDEN started as a vision from a group of student founders: a platform where fashion designers could showcase their work the way developers showcase code — a portfolio, a feed, a professional identity — and where recruiters and brands could discover real talent through real work, not just a resume.',
      "Siliconscale built DDEN from the ground up — UI/UX, architecture, and full backend — with no existing product to reference, no template to adapt. Just a founder's vision and a blank canvas.",
    ],
    gallery: galleryFrom(ddenImage),
    challenge: {
      heading: 'Challenges',
      body: [
        'There was no reference application to model DDEN after. We had to plan the entire product architecture from scratch — three distinct portals with three distinct user journeys: a client portal for designers and recruiters, an admin portal for internal operations, and a merchant portal for manufacturers fulfilling stitch orders. Every workflow between them had to be designed before a single line of code made sense.',
        'The hardest technical problem was performance at scale. Designers upload 3D garment designs that regularly exceed 100MB per file. Storing and — more critically — fetching those files fast enough for a smooth browsing feed was a serious bottleneck, especially running on a single AWS S3 bucket and a single render server with no infrastructure budget for scaling horizontally.',
      ],
    },
    solution: {
      heading: 'Solutions',
      body: [
        'We designed and built all three portals as a connected system: users and recruiters browse and hire through the client portal, admins onboard and manage merchants and monitor platform health through the admin portal, and merchants — invited via email registration sent from the admin panel — manage incoming stitch orders through their own dedicated portal. When a stitch order comes in, our system routes it to the best-matched merchant based on our internal assignment logic.',
        "To solve the 3D file performance problem, we identified which designs were being fetched most frequently and tagged them for aggressive caching — storing them client-side in IndexedDB on compatible devices for near-instant reloads. For devices that couldn't handle full-resolution files, we served compressed, lower-fidelity 3D models instead. Combined with Gzip and Brotli compression across the pipeline, this cut load times dramatically without needing to scale infrastructure spend.",
      ],
    },
    results: [
      {
        value: '1,000+',
        label: 'Students Onboarded',
        description:
          'Fashion design students actively using DDEN to build portfolios and get discovered by recruiters.',
      },
      {
        value: '3',
        label: 'Integrated Portals',
        description:
          'A unified system connecting designers, admins, and manufacturing partners in one workflow.',
      },
      {
        value: '100MB+',
        label: '3D Files Handled Per Design',
        description:
          'Optimized delivery of large-scale 3D garment files without compromising load speed.',
      },
      {
        value: '0 → 1',
        label: 'Built From Scratch',
        description:
          'No existing product to model — architecture, UI/UX, and backend designed and shipped from a blank slate.',
        skipCountUp: true,
      },
    ],
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

export const INDEPENDENT_PROJECTS: Project[] = [
  {
    id: 'micronano-rnd',
    slug: 'micronano-rnd',
    title: 'Micro-Nano R&D Booking Platform',
    tag: 'Booking Management Platform',
    services: 'BACKEND · DEVOPS · FULL-STACK',
    description:
      'A complete booking, payment, and invoicing system built solo for Parul University\'s Micro-Nano R&D Center.',
    isIndependent: true,
    caseStudy: true,
    image: mnrdcImage,
    imageAlt: PH('MICRONANO R&D', 'listing / hero image alt'),
    link: PH('MICRONANO R&D', 'link'),
    websiteUrl: PH('MICRONANO R&D', 'website URL'),
    year: PH('MICRONANO R&D', 'year'),
    gallery: galleryFrom(mnrdcImage),
    introHeadline: 'A Full Booking Platform, Built Solo — From Server to UI',
    introBody: [
      'Micro-Nano R&D Center at Parul University previously had a static website — just information about the center, its equipment, and its services. There was no way to actually book resources, manage requests, or process payments online.',
      'As an intern, I designed and built the entire booking system from scratch — solo, end-to-end — from the database architecture and payment integration to server deployment and the admin interface used to manage it all.',
    ],
    challenge: {
      heading: 'Challenges',
      body: [
        'The university had its own infrastructure with no cloud budget for managed services — meaning there was no AWS, no managed database, no third-party file storage to lean on. Everything from the server to file storage had to be self-hosted and self-managed on a Linux box I configured myself.',
        'Beyond infrastructure, the system had to handle real operational complexity: secure authentication for university users, role-based access for different staff levels, safe payment processing, and — critically — booking requests that could never double-book a resource, even under concurrent load.',
      ],
    },
    solution: {
      heading: 'Solutions',
      body: [
        'I built the backend on Node.js and Express with PostgreSQL, using Google OAuth for authentication and a full role-based access control (RBAC) system to separate what students, staff, and admins could each see and do. Every booking request runs through database transactions with locking to guarantee ACID compliance — so two people can never accidentally book the same slot — and every request is idempotent with automatic retry handling to stay resilient under network failures.',
        'I integrated Easebuzz for payments, and built automatic PDF invoice generation for every successful booking, delivered instantly via automated email using custom Pug templates. On the infrastructure side, I configured the Linux server myself — Nginx as the reverse proxy, Certbot for SSL, and local file storage for invoices instead of paying for external services like S3. I also rebuilt the admin dashboard UI from scratch in React, giving staff a clean way to manage bookings, and redesigned the public-facing portal UI.',
      ],
    },
    results: [
      {
        value: '₹6.7Cr+',
        label: 'Equipment Value Managed',
        description:
          'Real institutional lab and research equipment scheduled and tracked through the platform.',
        skipCountUp: true,
      },
      {
        value: 'Zero',
        label: 'Double-Booking Incidents',
        description:
          'Transaction-level locking and ACID-compliant booking logic ensure no resource is ever booked twice.',
        skipCountUp: true,
      },
      {
        value: 'End-to-End',
        label: 'Solo-Built System',
        description:
          'From server provisioning to UI — architecture, backend, frontend, and infrastructure all built and deployed independently.',
        skipCountUp: true,
      },
      {
        value: 'Self-Hosted',
        label: 'Zero Third-Party Infrastructure',
        description:
          'No AWS, no managed database, no external file storage — a fully self-configured Linux server handling everything from SSL to invoice storage.',
        skipCountUp: true,
      },
    ],
    resultsHeading: 'Built to run in production',
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
    isIndependent: true,
    stat: '+74%',
    gallery: galleryFrom(rdcImage),
    challenge: placeholderChallenge('RDC'),
    solution: placeholderSolution('RDC'),
    results: placeholderResults('RDC'),
  },
]

/** Client + independent listings (deduped by slug). */
export const ALL_PROJECTS: Project[] = [...PROJECTS, ...INDEPENDENT_PROJECTS]

export function getProjectBySlug(slug: string): Project | undefined {
  return ALL_PROJECTS.find((p) => p.slug === slug)
}

export function projectHasCaseStudy(project: Project): boolean {
  return project.caseStudy === true
}
