'use client'

import { useState } from 'react'
import { Mail, Linkedin, Instagram, Facebook, X as XIcon } from 'lucide-react'

type ConnectKind = 'email' | 'linkedin' | 'instagram' | 'facebook' | 'x'

type ConnectCard = {
  kind: ConnectKind
  label: string
  href: string
  ariaLabel: string
  glitter: string
  bubbleText: string
  large?: boolean
}

const CONNECT_CARDS: ConnectCard[] = [
  {
    kind: 'email',
    label: 'Email',
    href: 'mailto:contact@siliconscale.dev?subject=Let%27s%20build%20something',
    ariaLabel: 'Write to SiliconScale via email',
    glitter: '#e8e8e8',
    bubbleText: 'Write us',
    large: true,
  },
  {
    kind: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/siliconscale',
    ariaLabel: 'Open SiliconScale on LinkedIn',
    glitter: '#60a5fa',
    bubbleText: 'Open',
  },
  {
    kind: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/siliconscale',
    ariaLabel: 'Open SiliconScale on Instagram',
    glitter: '#fb7185',
    bubbleText: 'Open',
  },
  {
    kind: 'facebook',
    label: 'Facebook',
    href: 'https://www.instagram.com/siliconscale',
    ariaLabel: 'Open SiliconScale on Instagram',
    glitter: '#22c55e',
    bubbleText: 'Open',
  },
  {
    kind: 'x',
    label: 'X',
    href: 'https://x.com/siliconscale',
    ariaLabel: 'Open SiliconScale on X',
    glitter: '#a78bfa',
    bubbleText: 'Open',
  },
]

function ConnectIcon({ kind }: { kind: ConnectKind }) {
  const common = { className: 'connect-icon', 'aria-hidden': true as const }
  if (kind === 'email') return <Mail {...common} />
  if (kind === 'linkedin') return <Linkedin {...common} />
  if (kind === 'instagram') return <Instagram {...common} />
  if (kind === 'facebook') return <Facebook {...common} />
  return <XIcon {...common} />
}

function ConnectCardItem({ card, className }: { card: ConnectCard; className?: string }) {
  const [hovered, setHovered] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  return (
    <a
      href={card.href}
      target={card.href.startsWith('mailto:') ? undefined : '_blank'}
      rel={card.href.startsWith('mailto:') ? undefined : 'noreferrer noopener'}
      aria-label={card.ariaLabel}
      className={`connect-card ${className ?? ''}`}
      style={{ ['--glitter' as unknown as string]: card.glitter } as React.CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => {
        const r = (e.currentTarget as HTMLAnchorElement).getBoundingClientRect()
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
      }}
    >
      <div className={`connect-glitter ${hovered ? 'is-on' : ''}`} aria-hidden />
      <div
        className={`connect-bubble ${hovered ? 'is-on' : ''}`}
        aria-hidden
        style={{ left: pos.x, top: pos.y }}
      >
        {card.bubbleText}
      </div>
      <div className="connect-inner">
        <ConnectIcon kind={card.kind} />
      </div>
    </a>
  )
}

export function Connect() {
  const email = CONNECT_CARDS.find((c) => c.kind === 'email')!
  const socials = CONNECT_CARDS.filter((c) => c.kind !== 'email')

  return (
    <section className="w-full bg-[#050505] py-16 sm:py-20 lg:py-24">
      <style>{`
        .connect-shell{
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(24px, 5vw, 64px);
        }
        .connect-head{
          max-width: 760px;
          margin-bottom: 28px;
        }
        .connect-pill{
          display:inline-flex;
          align-items:center;
          border:1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.55);
          padding: 6px 12px;
          border-radius: 999px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .connect-title{
          margin-top: 14px;
          font-size: clamp(2.1rem, 4.6vw, 3.5rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1.06;
          color: #fff;
        }
        .connect-grid{
          display:grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
          gap: 16px;
        }
        .connect-socials{
          display:grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .connect-card{
          position: relative;
          display:block;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          box-shadow: 0 30px 90px rgba(0,0,0,0.75);
          overflow: hidden;
          backface-visibility: hidden;
          min-height: 190px;
        }
        .connect-card.connect-big{
          min-height: 396px;
          border-radius: 26px;
        }
        .connect-card::before{
          content:'';
          position:absolute;
          inset:0;
          background: radial-gradient(circle at 20% 15%, rgba(255,255,255,0.06) 0%, transparent 55%);
          pointer-events:none;
        }
        .connect-inner{
          position:absolute;
          inset:0;
          display:grid;
          place-items:center;
          z-index: 2;
        }
        .connect-icon{
          width: 54px;
          height: 54px;
          color: rgba(255,255,255,0.92);
          filter: drop-shadow(0 12px 30px rgba(0,0,0,0.6));
        }
        .connect-big .connect-icon{
          width: 68px;
          height: 68px;
        }

        /* Glitter overlay — tinted per card */
        .connect-glitter{
          position:absolute;
          inset:-40%;
          z-index:1;
          opacity:0;
          transform: rotate(12deg);
          background:
            radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--glitter) 90%, transparent) 0%, transparent 35%),
            radial-gradient(circle at 70% 40%, color-mix(in srgb, var(--glitter) 85%, transparent) 0%, transparent 35%),
            radial-gradient(circle at 45% 70%, color-mix(in srgb, var(--glitter) 85%, transparent) 0%, transparent 35%),
            repeating-radial-gradient(circle at 20% 40%, rgba(255,255,255,0.18) 0 1px, transparent 1px 10px);
          filter: blur(0.2px);
          transition: opacity .22s ease;
          animation: glitterDrift 1.6s linear infinite;
        }
        .connect-glitter.is-on{ opacity:0.85; }
        @keyframes glitterDrift{
          0%{ transform: translate3d(-6%, -4%, 0) rotate(12deg); }
          100%{ transform: translate3d(6%, 4%, 0) rotate(12deg); }
        }

        /* Cursor bubble */
        .connect-bubble{
          position:absolute;
          z-index:3;
          transform: translate3d(-50%, -50%, 0) scale(0.92);
          opacity:0;
          pointer-events:none;
          transition: opacity .14s ease, transform .14s ease;
          padding: 10px 14px;
          border-radius: 999px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.9);
          background: rgba(255,255,255,0.9);
          box-shadow: 0 18px 45px rgba(0,0,0,0.55);
          white-space: nowrap;
        }
        .connect-bubble.is-on{
          opacity:1;
          transform: translate3d(-50%, -50%, 0) scale(1);
        }

        @media (max-width: 900px){
          .connect-grid{ grid-template-columns: 1fr; }
          .connect-card.connect-big{ min-height: 280px; }
        }
        @media (max-width: 640px){
          .connect-socials{ gap: 12px; }
          .connect-grid{ gap: 12px; }
          .connect-card{ min-height: 160px; }
          .connect-card.connect-big{ min-height: 220px; }
        }
      `}</style>

      <div className="connect-shell">
        <div className="connect-head">
          <span className="connect-pill">LET&apos;S CONNECT</span>
          <h2 className="connect-title">We&apos;re here for ideas, feedback, or a friendly hello!</h2>
        </div>

        <div className="connect-grid">
          <ConnectCardItem card={email} className="connect-big" />
          <div className="connect-socials">
            {socials.map((c) => (
              <ConnectCardItem key={c.kind} card={c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Connect

