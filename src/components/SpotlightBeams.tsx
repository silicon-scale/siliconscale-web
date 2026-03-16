import { motion, useReducedMotion } from 'framer-motion'
import { memo, useEffect, useMemo, useState } from 'react'

const BASE_W = 1920
const BASE_H = 1080
const TOP_Y_RATIO = 0

const DESKTOP = {
  baseYRatio: 650 / BASE_H,
  leftApexCenterRatio: 420 / BASE_W,
  rightApexCenterRatio: 1500 / BASE_W,
  leftBaseCenterRatio: 800 / BASE_W,
  rightBaseCenterRatio: 1120 / BASE_W,
}

const MOBILE = {
  baseYRatio: 520 / BASE_H,
  leftApexCenterRatio: 0,
  rightApexCenterRatio: 1,
  leftBaseCenterRatio: 0.495,
  rightBaseCenterRatio: 0.505,
}

const APEX_HALF_WIDTH_RATIO = 26 / BASE_W
const BASE_HALF_WIDTH_RATIO = 130 / BASE_W
const BEAM_GRAD = "spotBeamGrad"

type ViewportSize = { width: number; height: number }

function clamp(min: number, value: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

// Deterministic seed-like function for spreading particles
function pseudoVal(seed: number): number {
  return ((seed * 9301 + 49297) % 233280) / 233280
}

// Generate many tiny dust specks spread across both beams
// Left beam approximate area: x 420-930, y 0-650
// Right beam approximate area: x 1090-1500, y 0-650
type Speck = {
  x: number
  y: number
  r: number
  dx: number
  dy: number
  duration: number
  delay: number
  brightness: number
}

const DUST_SPECKS: Speck[] = (() => {
  const specks: Speck[] = []
  // Left beam specks - spread throughout the cone shape
  // At y=0, beam is narrow around x=420. At y=650, beam is wide around x=670-930
  for (let i = 0; i < 90; i++) {
    const v1 = pseudoVal(i * 7 + 1)
    const v2 = pseudoVal(i * 13 + 3)
    const v3 = pseudoVal(i * 19 + 7)
    const v4 = pseudoVal(i * 23 + 11)
    const v5 = pseudoVal(i * 31 + 17)
    const v6 = pseudoVal(i * 37 + 23)

    // Small per-speck vertical jitter so no row of dust lines up perfectly
    const yPos = v1 * 640 + 10 + (v2 - 0.5) * 8 // 10–650 with ±4px jitter
    // Beam widens as y increases: interpolate x range
    const yRatio = yPos / 650
    const centerX = lerp(420, 700, yRatio)
    const halfWidth = lerp(26, 130, yRatio)
    const xPos = centerX + (v2 - 0.5) * 2 * halfWidth

    specks.push({
      x: xPos,
      y: yPos,
      // Smaller specks for a fine dust feel
      r: 0.5 + v3 * 0.5, // 0.5–1.0
      dx: (v4 - 0.5) * 24,
      dy: -16 - v5 * 48,
      duration: 7 + v6 * 9,
      delay: v1 * 6,
      // Still bright enough to read against the beam
      brightness: 0.55 + v3 * 0.45,
    })
  }

  // Right beam specks
  for (let i = 0; i < 90; i++) {
    const v1 = pseudoVal(i * 11 + 41)
    const v2 = pseudoVal(i * 17 + 43)
    const v3 = pseudoVal(i * 23 + 47)
    const v4 = pseudoVal(i * 29 + 53)
    const v5 = pseudoVal(i * 31 + 59)
    const v6 = pseudoVal(i * 37 + 61)

    const yPos = v1 * 640 + 10 + (v2 - 0.5) * 8
    const yRatio = yPos / 650
    const centerX = lerp(1500, 1120, yRatio)
    const halfWidth = lerp(26, 130, yRatio)
    const xPos = centerX + (v2 - 0.5) * 2 * halfWidth

    specks.push({
      x: xPos,
      y: yPos,
      r: 0.5 + v3 * 0.5,
      dx: (v4 - 0.5) * 24,
      dy: -16 - v5 * 48,
      duration: 7 + v6 * 9,
      delay: v1 * 6,
      brightness: 0.55 + v3 * 0.45,
    })
  }

  return specks
})()

function SpotlightBeamsComponent() {
  const prefersReducedMotion = useReducedMotion()
  const [vp, setVp] = useState<ViewportSize>(() => {
    if (typeof window === 'undefined') return { width: BASE_W, height: BASE_H }
    return { width: window.innerWidth, height: window.innerHeight }
  })

  useEffect(() => {
    const onResize = () => setVp({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const { leftPoints, rightPoints } = useMemo(() => {
    const t = clamp(0, (vp.width - 360) / (BASE_W - 360), 1)
    const baseYRatio = lerp(MOBILE.baseYRatio, DESKTOP.baseYRatio, t)
    const leftApexCenterRatio = lerp(MOBILE.leftApexCenterRatio, DESKTOP.leftApexCenterRatio, t)
    const rightApexCenterRatio = lerp(MOBILE.rightApexCenterRatio, DESKTOP.rightApexCenterRatio, t)
    const leftBaseCenterRatio = lerp(MOBILE.leftBaseCenterRatio, DESKTOP.leftBaseCenterRatio, t)
    const rightBaseCenterRatio = lerp(MOBILE.rightBaseCenterRatio, DESKTOP.rightBaseCenterRatio, t)

    const widthBoostApex = clamp(1, (BASE_W / Math.max(320, vp.width)) * 0.32, 1.35)
    const widthBoostBase = clamp(1, (BASE_W / Math.max(320, vp.width)) * 0.42, 1.75)
    const heightScale = clamp(0.75, vp.height / 900, 1)

    const topY = TOP_Y_RATIO * BASE_H
    const baseY = baseYRatio * BASE_H * heightScale
    const apexHalf = APEX_HALF_WIDTH_RATIO * BASE_W * widthBoostApex
    const baseHalf = BASE_HALF_WIDTH_RATIO * BASE_W * widthBoostBase

    const leftApexCenterX = clamp(apexHalf, leftApexCenterRatio * BASE_W, BASE_W - apexHalf)
    const rightApexCenterX = clamp(apexHalf, rightApexCenterRatio * BASE_W, BASE_W - apexHalf)
    const leftBaseCenterX = leftBaseCenterRatio * BASE_W
    const rightBaseCenterX = rightBaseCenterRatio * BASE_W

    const left = [
      `${leftApexCenterX - apexHalf},${topY}`,
      `${leftApexCenterX + apexHalf},${topY}`,
      `${leftBaseCenterX + baseHalf},${baseY}`,
      `${leftBaseCenterX - baseHalf},${baseY}`,
    ].join(' ')

    const right = [
      `${rightApexCenterX - apexHalf},${topY}`,
      `${rightApexCenterX + apexHalf},${topY}`,
      `${rightBaseCenterX + baseHalf},${baseY}`,
      `${rightBaseCenterX - baseHalf},${baseY}`,
    ].join(' ')

    return { leftPoints: left, rightPoints: right }
  }, [vp.width, vp.height])

  const defs = (
    <defs>
      <linearGradient id={BEAM_GRAD} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="white" stopOpacity="0.18" />
        <stop offset="35%" stopColor="white" stopOpacity="0.10" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>
      {/* Tiny subtle glow — just enough to not be a hard dot */}
      <filter id="dustTinyGlow" x="-300%" y="-300%" width="700%" height="700%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <clipPath id="beamClip">
        <polygon points={leftPoints} />
        <polygon points={rightPoints} />
      </clipPath>
    </defs>
  )

  // Each speck: tiny dot that drifts gently back and forth, fading in/out like
  // real dust catching and losing the light as it tumbles
  const particles = !prefersReducedMotion && DUST_SPECKS.map((s, i) => (
    <motion.circle
      key={i}
      cx={s.x}
      cy={s.y}
      r={s.r}
      fill="hsl(42, 100%, 75%)"
      filter="url(#dustTinyGlow)"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, s.brightness * 0.45, s.brightness, s.brightness * 0.55, 0],
        cx: [s.x, s.x + s.dx * 0.3, s.x + s.dx * 0.75, s.x + s.dx],
        cy: [s.y, s.y + s.dy * 0.35, s.y + s.dy * 0.7, s.y + s.dy],
      }}
      transition={{
        duration: s.duration,
        repeat: Infinity,
        delay: s.delay,
        ease: [0.4, 0, 0.2, 1],
      }}
    />
  ))

  const cls = 'pointer-events-none absolute inset-0 z-[1] w-full h-full overflow-hidden'

  if (prefersReducedMotion) {
    return (
      <svg
        aria-hidden
        className={cls}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {defs}
        <polygon points={leftPoints} fill={`url(#${BEAM_GRAD})`} />
        <polygon points={rightPoints} fill={`url(#${BEAM_GRAD})`} />
      </svg>
    )
  }

  return (
    <motion.svg
      aria-hidden
      className={cls}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{
        duration: 9,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
      }}
    >
      {defs}
      <polygon points={leftPoints} fill={`url(#${BEAM_GRAD})`} />
      <polygon points={rightPoints} fill={`url(#${BEAM_GRAD})`} />
      <g clipPath="url(#beamClip)">{particles}</g>
    </motion.svg>
  )
}

export const SpotlightBeams = memo(SpotlightBeamsComponent)
