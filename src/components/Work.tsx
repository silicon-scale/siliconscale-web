'use client'

import { memo } from 'react'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { WorkProjectCard, WorkProjectCardStyles } from '@/components/work/WorkProjectCard'
import { INDEPENDENT_PROJECTS, PROJECTS } from '@/data/projects'

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
        .work-section-divider {
          margin: clamp(3.5rem, 7vw, 5rem) 0 clamp(3rem, 6vw, 4rem);
          border: 0;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .work-subsection {
          max-width: 40rem;
          margin-bottom: 2.75rem;
        }
        .work-subsection h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.35rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.08;
          color: #fff;
        }
        .work-subsection p {
          margin-top: 0.85rem;
          max-width: 34rem;
          font-size: 0.95rem;
          line-height: 1.65;
          color: rgba(255,255,255,0.62);
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

        {INDEPENDENT_PROJECTS.length > 0 ? (
          <>
            <div className="work-section-divider" role="separator" aria-hidden />

            <ScrollReveal className="work-subsection">
              <SectionEyebrow variant="pillMono">Independent Work</SectionEyebrow>
              <h2 id="work-independent-heading">Built end-to-end, solo.</h2>
              <p>
                Beyond client work — projects built independently, from architecture to
                deployment. A closer look at the depth of what we can handle on our own.
              </p>
            </ScrollReveal>

            <div className="work-list" aria-labelledby="work-independent-heading">
              {INDEPENDENT_PROJECTS.map((project, index) => (
                <WorkProjectCard
                  key={project.id}
                  project={project}
                  index={PROJECTS.length + index}
                />
              ))}
            </div>
          </>
        ) : null}

        <ScrollReveal className="work-footnote">
          Sample builds are labeled clearly. Client work is live on the open web.
          <span className="work-footnote-rule" aria-hidden />
        </ScrollReveal>
      </div>
    </section>
  )
}

export default memo(WorkListing)
