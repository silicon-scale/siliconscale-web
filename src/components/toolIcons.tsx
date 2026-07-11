import type { ReactNode } from 'react'
import figmaIcon from '@/assets/icons/figma-icon.svg'
import htmlIcon from '@/assets/icons/html.svg'
import cssIcon from '@/assets/icons/css.svg'
import typescriptIcon from '@/assets/icons/typescript.svg'
import reactIcon from '@/assets/icons/react.svg'
import nextjsIcon from '@/assets/icons/nextjs.svg'
import tailwindIcon from '@/assets/icons/tailwind.svg'
import framerIcon from '@/assets/icons/framer.svg'
import shopifyIcon from '@/assets/icons/shopify.svg'
import gsapIcon from '@/assets/icons/gsap.svg'
import threejsIcon from '@/assets/icons/threejs.svg'
import claudeIcon from '@/assets/icons/claude.svg'
import geminiIcon from '@/assets/icons/gemini.svg'
import zapierIcon from '@/assets/icons/zapier.svg'
import n8nIcon from '@/assets/icons/n8n.svg'
import clickupIcon from '@/assets/icons/clickup.svg'
import vercelIcon from '@/assets/icons/vercel.svg'
import googleIcon from '@/assets/icons/google.svg'

export type ToolIconId =
  | 'figma'
  | 'html'
  | 'css'
  | 'typescript'
  | 'react'
  | 'nextjs'
  | 'tailwind'
  | 'framer'
  | 'shopify'
  | 'gsap'
  | 'threejs'
  | 'claude'
  | 'gemini'
  | 'zapier'
  | 'n8n'
  | 'clickup'
  | 'vercel'
  | 'google'

const SOURCES: Record<ToolIconId, string> = {
  figma: figmaIcon,
  html: htmlIcon,
  css: cssIcon,
  typescript: typescriptIcon,
  react: reactIcon,
  nextjs: nextjsIcon,
  tailwind: tailwindIcon,
  framer: framerIcon,
  shopify: shopifyIcon,
  gsap: gsapIcon,
  threejs: threejsIcon,
  claude: claudeIcon,
  gemini: geminiIcon,
  zapier: zapierIcon,
  n8n: n8nIcon,
  clickup: clickupIcon,
  vercel: vercelIcon,
  google: googleIcon,
}

/** Wide wordmarks need non-square sizing so they aren't squashed. */
const WIDE: Partial<Record<ToolIconId, true>> = {
  gsap: true,
  n8n: true,
}

type ToolIconProps = {
  id: ToolIconId
  size?: number
  className?: string
}

export function ToolIcon({ id, size = 28, className }: ToolIconProps) {
  const wide = WIDE[id]
  // n8n is a wide chain mark — give it more width so it reads at peer size
  const width = wide
    ? Math.round(size * (id === 'n8n' ? 1.65 : 1.55))
    : size
  const height = wide
    ? Math.round(size * (id === 'n8n' ? 0.9 : 0.57))
    : size

  return (
    <img
      src={SOURCES[id]}
      alt=""
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
      draggable={false}
    />
  )
}

export function toolIconNode(id: ToolIconId, size = 28): ReactNode {
  return <ToolIcon id={id} size={size} />
}
