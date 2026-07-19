'use client'

import { memo } from 'react'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { WorkProjectCard, WorkProjectCardStyles } from '@/components/work/WorkProjectCard'
import { PROJECTS } from '@/data/projects'

function WorkListing() {
  return (
    <section
      id="work"
      className="work-page relative bg-page text-white"
      aria-labelledby="work-heading"
    >
      <style>{`
        .work-page {
          padding: 7.5rem 0 5rem;
          font-family: 'Sora', system-ui, sans-serif;
          position: relative;
          z-index: 0;
        }
        .work-shell {
          position: relative;
          z-index: 1;
          max-width: 1120px;
          margin-inline: auto;
          padding-inline: 1.5rem;
        }
        @media (min-width: 1024px) {
          .work-shell { padding-inline: 2.5rem; }
        }
        .work-header {
          max-width: 40rem;
          margin-bottom: 3.5rem;
        }
        .work-header h1 {
          margin-top: 0.75rem;
          font-size: clamp(2.4rem, 5vw, 3.6rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: #fff;
        }
        .work-header p {
          margin-top: 1rem;
          max-width: 34rem;
          font-size: 0.95rem;
          line-height: 1.65;
          color: rgba(255,255,255,0.62);
        }
        .work-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .work-footnote {
          margin-top: 4rem;
          text-align: center;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.5);
        }
        .work-footnote-rule {
          margin: 1rem auto 0;
          height: 1px;
          width: 6rem;
          background: linear-gradient(to right, transparent, rgb(var(--brand-gold-rgb) / 0.35), transparent);
        }
        .work-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 20% 12%, rgb(var(--brand-gold-rgb) / 0.05), transparent 42%),
            radial-gradient(circle at 85% 70%, rgb(var(--brand-gold-rgb) / 0.03), transparent 40%);
        }
      `}</style>

      <WorkProjectCardStyles />

      <div className="work-glow" aria-hidden />

      <div className="work-shell">
        <ScrollReveal className="work-header">
          <SectionEyebrow variant="pillMono">Portfolio</SectionEyebrow>
          <h1 id="work-heading">Results you can measure.</h1>
          <p>
            Every project on this page is live — click through and see it running, not a
            mockup.
          </p>
        </ScrollReveal>

        <div className="work-list">
          {PROJECTS.map((project, index) => (
            <WorkProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <ScrollReveal className="work-footnote">
          Sample builds are labeled clearly. Client work is live on the open web.
          <span className="work-footnote-rule" aria-hidden />
        </ScrollReveal>
      </div>
    </section>
  )
}

export default memo(WorkListing)
