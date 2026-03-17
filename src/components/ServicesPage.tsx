'use client'

import React from 'react'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'

const SERVICES = [
  {
    id: 'web-development',
    name: 'Web Design & Development',
    summary: 'Conversion-focused websites and web apps that feel fast, modern, and reliable.',
    whatWeDo: [
      'Design responsive marketing sites, landing pages, and product experiences.',
      'Build production-grade frontends with modern stacks (React, TypeScript, performant CSS).',
      'Implement SEO-friendly structures, clean URLs, and fast loading times.',
      'Integrate forms, lead capture flows, and basic automations.',
    ],
    impact: [
      'Turn more visitors into leads and customers with clearer storytelling and UX.',
      'Reduce drop-offs on mobile and slow networks through performance-focused builds.',
      'Make updates easier so your site can evolve with your business.',
    ],
  },
  {
    id: 'branding',
    name: 'Branding & Identity',
    summary: 'A clear visual and verbal identity that makes your brand recognizable and memorable.',
    whatWeDo: [
      'Create logos, color systems, typography, and core brand elements.',
      'Define tone of voice and messaging foundations for websites and campaigns.',
      'Prepare brand kits you can share with internal teams and vendors.',
    ],
    impact: [
      'Build trust by presenting a cohesive and professional image everywhere your brand appears.',
      'Stand out in crowded markets with a distinct look and story.',
      'Make future design and content decisions faster with clear guidelines.',
    ],
  },
  {
    id: 'product-design',
    name: 'UI/UX & Product Design',
    summary: 'Interfaces designed for clarity, usability, and real-world workflows.',
    whatWeDo: [
      'Map user journeys, states, and edge cases for your product.',
      'Design UI systems and components that scale as your product grows.',
      'Prototype flows to validate ideas before committing to engineering.',
    ],
    impact: [
      'Reduce support tickets and user confusion with more intuitive flows.',
      'Increase engagement and retention by making key actions easier to complete.',
      'Speed up development by handing off clear, consistent design systems.',
    ],
  },
  {
    id: 'ecommerce',
    name: 'E‑commerce & Landing Systems',
    summary: 'Storefronts and funnels that help you sell more with less friction.',
    whatWeDo: [
      'Design and develop product pages, carts, and checkout flows.',
      'Set up promotional landing pages and campaign-specific funnels.',
      'Connect analytics and basic experimentation for continuous improvement.',
    ],
    impact: [
      'Increase average order value and conversion with optimized flows.',
      'Launch campaigns faster with reusable landing-page patterns.',
      'Understand what’s working using analytics set up around real goals.',
    ],
  },
  {
    id: 'ai-integration',
    name: 'AI Integration & Automation',
    summary: 'Practical AI-powered tools that remove manual work and create smarter experiences.',
    whatWeDo: [
      'Integrate AI features into websites and internal tools (chat, search, recommendations).',
      'Automate repetitive workflows like lead triage, summaries, and basic support.',
      'Design AI experiences that are safe, explainable, and aligned with your brand.',
    ],
    impact: [
      'Save hours per week for your team by automating routine tasks.',
      'Respond to customers faster with AI-assisted support and FAQs.',
      'Differentiate your product with smart features that feel genuinely useful.',
    ],
  },
  {
    id: 'consulting',
    name: 'Technical Consulting & Roadmapping',
    summary: 'Senior guidance on where to invest next in your digital stack.',
    whatWeDo: [
      'Audit your current site or product for performance, UX, and technical health.',
      'Help prioritize a roadmap that balances quick wins with long-term foundations.',
      'Advise on architecture, tooling, and hiring decisions for your digital team.',
    ],
    impact: [
      'Avoid expensive rebuilds by making better decisions earlier.',
      'Align founders, marketing, and engineering around a shared plan.',
      'Invest in changes that move metrics, not just add complexity.',
    ],
  },
]

export default function ServicesPage() {
  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#050505] text-white"
      aria-labelledby="services-heading"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Mono:wght@300;400&display=swap');
        .services-shell {
          font-family: 'Sora', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .services-shell h2 {
          letter-spacing: -0.03em;
        }
        .service-card {
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(10,10,10,1));
          padding: 1.5rem 1.6rem;
          display: grid;
          grid-template-columns: minmax(0,1.4fr) minmax(0,1.3fr);
          gap: 1.5rem;
        }
        @media (max-width: 768px) {
          .service-card {
            grid-template-columns: minmax(0,1fr);
          }
        }
        .service-pill {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }
      `}</style>

      {/* Background ripple layer */}
      <div className="absolute inset-0 pointer-events-none">
        <BackgroundRippleEffect rows={9} cols={24} cellSize={58} interactive={false} />
        {/* soft top glow to match theme */}
        <div
          className="absolute -top-40 left-1/2 h-[640px] w-[900px] -translate-x-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgba(201,169,110,0.07) 0%, transparent 65%)',
          }}
        />
      </div>

      <div className="services-shell relative z-10 mx-auto max-w-5xl px-6 py-24 lg:px-8 lg:py-28">
        {/* Header */}
        <header className="mb-12">
          <p className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-white/40">
            What We Do
          </p>
          <h1
            id="services-heading"
            className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.7rem]"
          >
            Services that move the needle
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65">
            Silicon Scale helps teams turn ideas into scalable digital products—from the
            first landing page to AI-powered internal tools. Each service is designed to
            be practical, measurable, and aligned with real business goals.
          </p>
        </header>

        <div className="space-y-6">
          {SERVICES.map((service) => (
            <article
              key={service.id}
              id={service.id}
              className="service-card"
            >
              <div>
                <span className="service-pill">Service</span>
                <h2 className="mt-2 text-xl font-semibold text-white sm:text-[1.35rem]">
                  {service.name}
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  {service.summary}
                </p>

                <div className="mt-4 space-y-2">
                  <p className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-white/45">
                    What we actually deliver
                  </p>
                  <ul className="list-disc space-y-1 pl-4 text-sm text-white/75">
                    {service.whatWeDo.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-l border-white/8 pl-4 text-sm text-white/75 sm:pl-5 sm:pt-1">
                <p className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-white/45">
                  How this helps your business
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  {service.impact.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

