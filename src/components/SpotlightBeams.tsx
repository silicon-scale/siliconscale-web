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
    </defs>
  )

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
    </motion.svg>
  )
}

export const SpotlightBeams = memo(SpotlightBeamsComponent)