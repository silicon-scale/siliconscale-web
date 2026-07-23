import { getSiteUrl } from "./site.js"

/** Default Open Graph / Twitter share image (1200×630). */
export function defaultOgImage(siteUrl = getSiteUrl()): string {
  return `${siteUrl}/og-image.png`
}

export interface PageSeoMeta {
  /** Document title (may include brand). */
  title: string
  description: string
  /** Absolute canonical URL. */
  canonicalPath: string
  ogType?: "website" | "article"
  /** Absolute image URL; defaults to site OG image. */
  ogImage?: string
  /** When true, inject noindex,nofollow. */
  noindex?: boolean
  /** Extra JSON-LD graphs to inject (Organization, WebSite, BreadcrumbList, etc.). */
  jsonLd?: Record<string, unknown>[]
}

/** Static public routes — titles ≤60, descriptions ≤160. */
export const STATIC_ROUTE_SEO: Record<string, Omit<PageSeoMeta, "canonicalPath"> & { path: string }> = {
  "/": {
    path: "/",
    title: "SiliconScale — Systems, Shopify & AI Agents",
    description:
      "SiliconScale builds custom software, headless Shopify stores, and AI agents that cut busywork and drive revenue. Based in India, shipping worldwide.",
    ogType: "website",
  },
  "/about": {
    path: "/about",
    title: "About SiliconScale — How We Build",
    description:
      "We design, build, and grow systems with founders and operators — no account-manager theater, just the people shipping your product.",
    ogType: "website",
  },
  "/services": {
    path: "/services",
    title: "Services — Custom Systems & Shopify",
    description:
      "From headless Shopify and custom backends to AI agents — SiliconScale ships production systems that scale with your business.",
    ogType: "website",
  },
  "/work": {
    path: "/work",
    title: "Work — Results You Can Measure",
    description:
      "Case studies from fashion-tech platforms, craft commerce, and research booking systems — outcomes SiliconScale shipped for real teams.",
    ogType: "website",
  },
  "/blog": {
    path: "/blog",
    title: "Blog — Systems, Shopify & AI Notes",
    description:
      "Practical notes on systems, Shopify builds, and AI agents — written for operators who care how products actually ship.",
    ogType: "website",
  },
  "/contact": {
    path: "/contact",
    title: "Contact SiliconScale — Start a Project",
    description:
      "Tell us what you’re building. We’ll say honestly whether it’s a fit — and if it is, how we’d approach the work.",
    ogType: "website",
  },
  "/team": {
    path: "/team",
    title: "Team — SiliconScale",
    description:
      "Meet the people behind SiliconScale — builders who design, ship, and own the systems your business runs on.",
    ogType: "website",
  },
  "/tool-stack": {
    path: "/tool-stack",
    title: "Tool Stack — SiliconScale",
    description:
      "The technologies SiliconScale uses to design, build, and operate high-performance web products and commerce systems.",
    ogType: "website",
  },
  "/privacy": {
    path: "/privacy",
    title: "Privacy Policy — SiliconScale",
    description: "How SiliconScale collects, uses, and protects information when you use our website and services.",
    ogType: "website",
  },
  "/terms": {
    path: "/terms",
    title: "Terms of Service — SiliconScale",
    description: "Terms that govern use of the SiliconScale website and related services.",
    ogType: "website",
  },
}

/** Lean SEO fields for case studies (edge-safe — no image imports). */
export const CASE_STUDY_SEO: Record<
  string,
  { title: string; description: string; headline?: string }
> = {
  dden: {
    title: "DDEN Case Study — SiliconScale",
    description:
      "How SiliconScale built DDEN from scratch — a LinkedIn-style platform for fashion designers, with three portals and 100MB+ 3D files.",
    headline: "DDEN — Fashion-Tech Platform",
  },
  plaam: {
    title: "PLAAM Case Study — SiliconScale",
    description:
      "From WhatsApp orders to a headless Shopify storefront — PLAAM’s craft & jewellery catalog, built for how customers actually shop.",
    headline: "PLAAM — Craft & Jewellery Store",
  },
  "micronano-rnd": {
    title: "Micro-Nano R&D Case Study",
    description:
      "A solo-built booking, payment, and invoicing platform for Parul University’s Micro-Nano R&D Center — end to end.",
    headline: "Micro-Nano R&D Booking Platform",
  },
}

export const CASE_STUDY_SLUGS = Object.keys(CASE_STUDY_SEO)

/** Stable lastmod for static marketing URLs (YYYY-MM-DD). Bump when content materially changes. */
export const STATIC_SITEMAP_LASTMOD = "2026-07-01"

export function organizationJsonLd(siteUrl = getSiteUrl()) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SiliconScale",
    url: siteUrl,
    logo: `${siteUrl}/android-chrome-512x512.png`,
    sameAs: [
      "https://www.instagram.com/siliconscale",
      "https://www.linkedin.com/company/siliconscale",
    ],
  }
}

export function websiteJsonLd(siteUrl = getSiteUrl()) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SiliconScale",
    url: siteUrl,
    publisher: { "@type": "Organization", name: "SiliconScale", url: siteUrl },
  }
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
  siteUrl = getSiteUrl(),
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path === "/" ? "/" : item.path}`,
    })),
  }
}

export function resolveStaticPageSeo(pathname: string, siteUrl = getSiteUrl()): PageSeoMeta | null {
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname
  const entry = STATIC_ROUTE_SEO[path]
  if (!entry) return null
  return {
    title: entry.title,
    description: entry.description,
    canonicalPath: entry.path,
    ogType: entry.ogType ?? "website",
    ogImage: defaultOgImage(siteUrl),
    jsonLd:
      path === "/"
        ? [organizationJsonLd(siteUrl), websiteJsonLd(siteUrl)]
        : [
            breadcrumbJsonLd(
              [
                { name: "Home", path: "/" },
                { name: entry.title.split(" — ")[0] || entry.title, path: entry.path },
              ],
              siteUrl,
            ),
          ],
  }
}

export function resolveCaseStudySeo(slug: string, siteUrl = getSiteUrl()): PageSeoMeta | null {
  const entry = CASE_STUDY_SEO[slug]
  if (!entry) return null
  const path = `/work/${slug}`
  return {
    title: entry.title,
    description: entry.description,
    canonicalPath: path,
    ogType: "article",
    ogImage: defaultOgImage(siteUrl),
    jsonLd: [
      breadcrumbJsonLd(
        [
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: entry.headline || entry.title, path },
        ],
        siteUrl,
      ),
    ],
  }
}
