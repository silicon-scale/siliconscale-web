'use client'

import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { ToolIcon } from '@/components/toolIcons'
import { REVEAL_EASE } from '@/lib/motion'
import { FOCUS_RING } from '@/lib/focus'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type Tool = {
  name: string
  icon: ReactNode
  url: string
  note?: string
}

type StackCategory = {
  title: string
  tools: Tool[]
}

const STACK: StackCategory[] = [
  {
    title: 'Design',
    tools: [
      {
        name: 'Figma',
        url: 'https://figma.com',
        icon: <ToolIcon id="figma" />,
        note: 'Where layouts, components, and client reviews all live before a line of code.',
      },
    ],
  },
  {
    title: 'Development',
    tools: [
      {
        name: 'HTML',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        icon: <ToolIcon id="html" />,
        note: 'Semantic structure first — every page starts here.',
      },
      {
        name: 'CSS',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
        icon: <ToolIcon id="css" />,
        note: 'Layout, typography, and motion foundations without fighting the cascade.',
      },
      {
        name: 'TypeScript',
        url: 'https://www.typescriptlang.org',
        icon: <ToolIcon id="typescript" />,
        note: 'Typed JavaScript for safer components, APIs, and long-lived codebases.',
      },
      {
        name: 'React',
        url: 'https://react.dev',
        icon: <ToolIcon id="react" />,
        note: 'Component model we reach for on product UIs and custom storefronts.',
      },
      {
        name: 'Next.js',
        url: 'https://nextjs.org',
        icon: <ToolIcon id="nextjs" />,
        note: 'App Router, SSR, and routing when the product needs more than a SPA.',
      },
      {
        name: 'Tailwind CSS',
        url: 'https://tailwindcss.com',
        icon: <ToolIcon id="tailwind" />,
        note: 'Utility-first styling that keeps marketing and product surfaces consistent.',
      },
      {
        name: 'Framer',
        url: 'https://www.framer.com',
        icon: <ToolIcon id="framer" />,
        note: 'Prototypes and motion explorations before we commit to production code.',
      },
      {
        name: 'Shopify',
        url: 'https://shopify.dev',
        icon: <ToolIcon id="shopify" />,
        note: 'Storefront API and commerce tooling for headless and custom builds.',
      },
    ],
  },
  {
    title: 'Animation',
    tools: [
      {
        name: 'GSAP',
        url: 'https://gsap.com',
        icon: <ToolIcon id="gsap" />,
        note: 'Timeline-driven motion for scroll scenes and interaction sequences.',
      },
      {
        name: 'Three.js',
        url: 'https://threejs.org',
        icon: <ToolIcon id="threejs" />,
        note: 'WebGL scenes and 3D product moments when flat UI isn\'t enough.',
      },
    ],
  },
  {
    title: 'Artificial Intelligence',
    tools: [
      {
        name: 'Claude',
        url: 'https://claude.ai',
        icon: <ToolIcon id="claude" />,
        note: 'Drafting, debugging, and accelerating the boring parts of shipping.',
      },
      {
        name: 'Gemini',
        url: 'https://gemini.google.com',
        icon: <ToolIcon id="gemini" />,
        note: 'Research, multimodal checks, and a second opinion in the workflow.',
      },
      {
        name: 'Zapier',
        url: 'https://zapier.com',
        icon: <ToolIcon id="zapier" />,
        note: 'Quick integrations between SaaS tools without standing up a service.',
      },
      {
        name: 'n8n',
        url: 'https://n8n.io',
        icon: <ToolIcon id="n8n" />,
        note: 'Self-hosted workflows when automation needs to stay under our control.',
      },
    ],
  },
  {
    title: 'Project & Ops',
    tools: [
      {
        name: 'ClickUp',
        url: 'https://clickup.com',
        icon: <ToolIcon id="clickup" />,
        note: 'Tasks, timelines, and handoffs in one place for the team and the client.',
      },
      {
        name: 'Google Workspace',
        url: 'https://workspace.google.com',
        icon: <ToolIcon id="google" />,
        note: 'Docs, drive, and mail for day-to-day collaboration.',
      },
      {
        name: 'Vercel',
        url: 'https://vercel.com',
        icon: <ToolIcon id="vercel" />,
        note: 'Preview deploys and production hosting for frontends we ship.',
      },
    ],
  },
]

const EXPAND_EASE = REVEAL_EASE
const EXPAND_DURATION = 0.28

function ToolCard({ tool, category }: { tool: Tool; category: string }) {
  const [open, setOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const panelId = useId()
  const hasNote = Boolean(tool.note)

  return (
    <article className="tool-card">
      <div className="tool-card-top">
        <div className="tool-icon-badge" aria-hidden="true">
          {tool.icon}
        </div>

        {hasNote ? (
          <button
            type="button"
            className={cn('tool-chevron', FOCUS_RING)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={
              open ? `Hide details about ${tool.name}` : `Show more about ${tool.name}`
            }
            onClick={() => setOpen((v) => !v)}
          >
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform duration-300 ease-out',
                open && 'rotate-180',
              )}
              aria-hidden
            />
          </button>
        ) : null}
      </div>

      <p className="tool-category-tag">{category}</p>

      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn('tool-name-link', FOCUS_RING)}
        aria-label={`Open ${tool.name} website (opens in a new tab)`}
      >
        {tool.name}
      </a>

      {hasNote ? (
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              id={panelId}
              key="note"
              initial={
                prefersReducedMotion ? false : { height: 0, opacity: 0 }
              }
              animate={{ height: 'auto', opacity: 1 }}
              exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: EXPAND_DURATION, ease: EXPAND_EASE }}
              className="tool-note-wrap"
            >
              <p className="tool-note">{tool.note}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      ) : null}
    </article>
  )
}

function CategorySection({
  category,
  index,
}: {
  category: StackCategory
  index: number
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.section
      className="tool-category"
      aria-labelledby={`stack-cat-${category.title}`}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: REVEAL_EASE, delay: index * 0.06 }}
    >
      <h2 id={`stack-cat-${category.title}`} className="tool-category-title">
        {category.title}
      </h2>
      <div className="tool-grid">
        {category.tools.map((tool) => (
          <ToolCard key={tool.name} tool={tool} category={category.title} />
        ))}
      </div>
    </motion.section>
  )
}

export default function ToolStack() {
  const navigate = useNavigate()

  return (
    <section
      className="relative min-h-screen overflow-x-clip bg-page text-white"
      aria-labelledby="tool-stack-heading"
    >
      <style>{`
        .tool-stack-shell {
          font-family: 'Sora', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .tool-card {
          position: relative;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.08);
          background: #0a0a0a;
          box-shadow: 0 24px 60px rgba(0,0,0,0.45);
          padding: 22px 20px 24px;
          display: flex;
          flex-direction: column;
          min-height: 168px;
        }
        .tool-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }
        .tool-icon-badge {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.10);
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .tool-icon-badge img {
          display: block;
          max-width: 46px;
          max-height: 40px;
          width: auto;
          height: auto;
          object-fit: contain;
        }
        .tool-chevron {
          width: 36px;
          height: 36px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.7);
          display: grid;
          place-items: center;
          flex-shrink: 0;
          transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
        }
        .tool-chevron:hover {
          border-color: rgba(255,255,255,0.28);
          background: rgba(255,255,255,0.08);
          color: #fff;
        }
        .tool-category-tag {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-bottom: 8px;
        }
        .tool-name-link {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          max-width: 100%;
          margin-top: auto;
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: rgba(255,255,255,0.92);
          text-decoration: none;
          border-radius: 8px;
          transition: color 0.2s ease;
        }
        .tool-name-link:hover { color: #fff; }
        .tool-note-wrap {
          overflow: hidden;
        }
        .tool-note {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.08);
          font-size: 0.9rem;
          line-height: 1.55;
          color: rgba(255,255,255,0.58);
        }
        .tool-category {
          margin-top: 3.5rem;
        }
        .tool-category-title {
          font-size: clamp(1.6rem, 3vw, 2.1rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: rgba(255,255,255,0.92);
          margin-bottom: 1.25rem;
        }
        .tool-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }
        .tool-finale {
          margin-top: 7rem;
          padding: 5.5rem 0.5rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.75rem;
          position: relative;
        }
        .tool-finale::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            rgba(255,255,255,0.08) 1px,
            transparent 1px
          );
          background-size: 20px 20px;
          mask-image: radial-gradient(ellipse at center, #000 28%, transparent 72%);
          pointer-events: none;
        }
        .tool-finale-pill {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: clamp(1rem, 2.5vw, 1.6rem);
          padding: clamp(0.85rem, 1.8vw, 1.35rem) clamp(1.5rem, 3.5vw, 2.75rem) clamp(0.85rem, 1.8vw, 1.35rem) clamp(0.85rem, 1.8vw, 1.35rem);
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.10);
          background: #1a1a1a;
          color: #fff;
          font-size: clamp(1.85rem, 5.2vw, 3.75rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
          text-decoration: none;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }
        .tool-finale-pill:hover {
          background: #222;
          border-color: rgb(var(--brand-gold-rgb) / 0.45);
          transform: translateY(-2px);
        }
        .tool-finale-orb {
          width: clamp(52px, 7vw, 84px);
          height: clamp(52px, 7vw, 84px);
          border-radius: 999px;
          background: #fff;
          color: #050505;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .tool-finale-orb svg {
          width: clamp(22px, 2.8vw, 34px);
          height: clamp(22px, 2.8vw, 34px);
        }
        @media (max-width: 1024px) {
          .tool-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 640px) {
          .tool-grid { grid-template-columns: 1fr; }
          .tool-card { border-radius: 20px; min-height: 0; }
          .tool-finale { margin-top: 4.5rem; padding: 3.5rem 0 1rem; gap: 1.25rem; }
          .tool-finale-pill {
            width: 100%;
            justify-content: flex-start;
            font-size: clamp(1.55rem, 8vw, 2.1rem);
            padding: 0.85rem 1.25rem 0.85rem 0.85rem;
            gap: 0.9rem;
          }
          .tool-finale-orb { width: 52px; height: 52px; }
          .tool-finale-orb svg { width: 22px; height: 22px; }
        }
      `}</style>

      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, rgb(var(--brand-gold-rgb) / 0.07) 0%, transparent 65%)',
        }}
      />

      <div className="tool-stack-shell relative z-10 mx-auto max-w-6xl px-6 pt-36 pb-24 sm:pt-40 lg:px-10 lg:pt-44 lg:pb-28">
        <header className="mb-6 max-w-3xl">
          <SectionEyebrow variant="pillMono">Our Stack</SectionEyebrow>
          <h1
            id="tool-stack-heading"
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.25rem]"
          >
            The tools behind what we build
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
            Design, development, animation, AI, and ops — the tools we actually reach for on
            client work, not a laundry list of every logo on the internet.
          </p>
        </header>

        {STACK.map((category, index) => (
          <CategorySection key={category.title} category={category} index={index} />
        ))}

        <div className="tool-finale">
          <button
            type="button"
            className={cn('tool-finale-pill', FOCUS_RING)}
            onClick={() => navigate('/contact')}
            aria-label="Let's get started — go to contact"
          >
            <span className="tool-finale-orb" aria-hidden="true">
              <ChevronDown strokeWidth={2.25} />
            </span>
            Let&apos;s get started
          </button>
        </div>
      </div>
    </section>
  )
}
