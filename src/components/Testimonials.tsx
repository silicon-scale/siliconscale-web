'use client'

import React from 'react'

type Testimonial = {
  quote: string
  name: string
  role: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'SiliconScale delivered a polished experience with strong performance and clear communication throughout.',
    name: 'Sriram',
    role: 'CEO, DDEN.in',
  },
  {
    quote:
      'Great attention to detail and a smooth process end‑to‑end. The result feels modern and reliable.',
    name: 'Pranav Rathi',
    role: 'Web & Digital Media Associate, MNRDC',
  },
  {
    quote:
      'Fast iterations, thoughtful design decisions, and a final build we’re genuinely proud to share.',
    name: 'Prathysha',
    role: 'Founder, Plaam.in',
  },
  {
    quote:
      'Strong engineering and a clean delivery. The foundation is scalable and the execution is solid.',
    name: 'Uday Nagesh',
    role: 'CTO, Zero Prime',
  },
] as const

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="ss-test-card">
      <p className="ss-test-quote">{t.quote}</p>
      <div className="ss-test-person">
        <div className="ss-test-avatar" aria-hidden>
          {initials(t.name)}
        </div>
        <div className="ss-test-meta">
          <div className="ss-test-name">{t.name}</div>
          <div className="ss-test-role">{t.role}</div>
        </div>
      </div>
    </div>
  )
}

export function Testimonials() {
  const rowA = [...TESTIMONIALS.slice(0, 2), ...TESTIMONIALS.slice(0, 2)]
  const rowB = [...TESTIMONIALS.slice(2, 4), ...TESTIMONIALS.slice(2, 4)]

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="w-full bg-[#050505] py-16 sm:py-20 lg:py-24"
    >
      <style>{`
        @keyframes marqueeLeft {
          from { transform: translate3d(0,0,0); }
          to   { transform: translate3d(-50%,0,0); }
        }
        @keyframes marqueeRight {
          from { transform: translate3d(-50%,0,0); }
          to   { transform: translate3d(0,0,0); }
        }
        .ss-test-shell {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(24px, 5vw, 64px);
        }
        .ss-test-head {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 36px;
        }
        .ss-test-pill {
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.55);
          padding: 6px 12px;
          border-radius: 999px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .ss-test-title {
          margin-top: 12px;
          font-size: clamp(2rem, 4.4vw, 3.6rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: #fff;
        }
        .ss-test-sub {
          max-width: 520px;
          font-size: 0.95rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.45);
        }

        .ss-marquee {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(0,0,0,0.35);
          box-shadow: 0 30px 80px rgba(0,0,0,0.7);
          padding: 22px 0;
        }
        .ss-marquee::before,
        .ss-marquee::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 90px;
          z-index: 3;
          pointer-events: none;
        }
        .ss-marquee::before {
          left: 0;
          background: linear-gradient(90deg, rgba(5,5,5,1), rgba(5,5,5,0));
        }
        .ss-marquee::after {
          right: 0;
          background: linear-gradient(270deg, rgba(5,5,5,1), rgba(5,5,5,0));
        }

        .ss-row {
          display: flex;
          width: max-content;
          gap: 18px;
          padding: 0 22px;
          will-change: transform;
        }
        .ss-row.left {
          animation: 34s linear infinite marqueeLeft;
        }
        .ss-row.right {
          animation: 36s linear infinite marqueeRight;
        }
        .ss-row:hover { animation-play-state: paused; }

        .ss-test-card {
          width: clamp(260px, 30vw, 420px);
          min-height: 156px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          padding: 20px 20px 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 16px;
          backface-visibility: hidden;
        }
        .ss-test-quote {
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.82);
          letter-spacing: -0.01em;
        }
        .ss-test-person {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ss-test-avatar {
          width: 36px;
          height: 36px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          display: grid;
          place-items: center;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.7);
        }
        .ss-test-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          line-height: 1.2;
        }
        .ss-test-role {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.5);
          margin-top: 2px;
        }

        .ss-rows {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        @media (max-width: 768px) {
          .ss-test-head { margin-bottom: 26px; }
          .ss-marquee::before, .ss-marquee::after { width: 60px; }
          .ss-row { gap: 14px; padding: 0 16px; }
          .ss-test-card { width: clamp(240px, 78vw, 360px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .ss-row.left, .ss-row.right { animation: none; transform: translate3d(0,0,0); }
        }
      `}</style>

      <div className="ss-test-shell">
        <div className="ss-test-head">
          <div>
            <span className="ss-test-pill">TESTIMONIALS</span>
            <h2 id="testimonials-heading" className="ss-test-title">
              What Our Clients Say
            </h2>
          </div>
          <p className="ss-test-sub">
            Businesses choose SiliconScale for fast delivery, clear communication, and reliable engineering.
          </p>
        </div>

        <div className="ss-marquee" aria-label="Testimonials scrolling rows">
          <div className="ss-rows">
            <div className="ss-row left" aria-hidden>
              {rowA.map((t, i) => (
                <TestimonialCard key={`${t.name}-${i}`} t={t} />
              ))}
            </div>
            <div className="ss-row right" aria-hidden>
              {rowB.map((t, i) => (
                <TestimonialCard key={`${t.name}-${i}`} t={t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

