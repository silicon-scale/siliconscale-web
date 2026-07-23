/** Client-safe route SEO copy (keep in sync with lib/server/route-meta.ts). */

export type ClientPageSeo = {
  path: string
  title: string
  description: string
  ogType?: "website" | "article"
}

export const STATIC_ROUTE_SEO: Record<string, ClientPageSeo> = {
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

export const CASE_STUDY_SEO: Record<string, { title: string; description: string; headline?: string }> =
  {
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
