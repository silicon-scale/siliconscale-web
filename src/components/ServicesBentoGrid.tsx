'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Mic, Search, ShoppingBag } from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import wholeThingIllustration from '@/assets/24070814_bwink_edu_01_single_12_compressed.webp'
import { BrandButton } from '@/components/ui/BrandButton'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { useSectionInView } from '@/hooks/useSectionInView'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { REVEAL_EASE, COUNT_UP_DURATION_S, easeRevealProgress } from '@/lib/motion'
import { FOCUS_RING } from '@/lib/focus'
import { trackEvent } from '@/utils/analytics'
import { setPerfDebugLoop } from '@/utils/perfDebug'

type Vec3 = [number, number, number]

function latLongToVec(lat: number, lon: number): Vec3 {
  const la = (lat * Math.PI) / 180
  const lo = (lon * Math.PI) / 180
  return [Math.cos(la) * Math.cos(lo), Math.sin(la), Math.cos(la) * Math.sin(lo)]
}

function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))
  const omega = Math.acos(dot)
  if (omega < 1e-6) return a
  const sinOmega = Math.sin(omega)
  const w1 = Math.sin((1 - t) * omega) / sinOmega
  const w2 = Math.sin(t * omega) / sinOmega
  return [a[0] * w1 + b[0] * w2, a[1] * w1 + b[1] * w2, a[2] * w1 + b[2] * w2]
}

const NODES: Vec3[] = [
  latLongToVec(40.7, -74.0), // New York
  latLongToVec(51.5, -0.1), // London
  latLongToVec(37.7, -122.4), // SF
  latLongToVec(1.35, 103.8), // Singapore
  latLongToVec(-33.9, 151.2), // Sydney
  latLongToVec(12.97, 77.59), // Bangalore — team base
]

const ARCS = [
  { a: 0, b: 1 }, // NY - London
  { a: 2, b: 3 }, // SF - Singapore
  { a: 1, b: 5 }, // London - Bangalore
  { a: 3, b: 4 }, // Singapore - Sydney
  { a: 0, b: 2 }, // NY - SF
] as const

const PULSE_ARCS = [
  { arcIndex: 0, speed: 0.00042, phase: 0.1 },
  { arcIndex: 3, speed: 0.00031, phase: 0.6 },
] as const

function ConnectivityGlobe({ loopActive }: { loopActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()
  const loopActiveRef = useRef(loopActive)
  loopActiveRef.current = loopActive

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf = 0
    let angle = 0.6

    const N = 700
    const dots: Vec3[] = []
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2
      const radius = Math.sqrt(1 - y * y)
      const theta = golden * i
      dots.push([Math.cos(theta) * radius, y, Math.sin(theta) * radius])
    }

    const arcSegments = ARCS.map(({ a, b }) => {
      const pts: Vec3[] = []
      const steps = 36
      for (let i = 0; i <= steps; i++) pts.push(slerp(NODES[a], NODES[b], i / steps))
      return pts
    })

    function resize() {
      const size = Math.max(wrap!.clientWidth, wrap!.clientHeight)
      canvas!.width = size * dpr
      canvas!.height = size * dpr
      canvas!.style.width = `${size}px`
      canvas!.style.height = `${size}px`
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    function rotate([x, y, z]: Vec3, cosA: number, sinA: number): Vec3 {
      return [x * cosA - z * sinA, y, x * sinA + z * cosA]
    }

    function draw() {
      const size = canvas!.width
      const cx = size / 2
      const cy = size / 2
      const R = size * 0.44
      ctx!.clearRect(0, 0, size, size)

      const shouldSpin = loopActiveRef.current && !prefersReduced
      if (shouldSpin) angle += 0.0011 * dpr

      const cosA = Math.cos(angle)
      const sinA = Math.sin(angle)

      const proj = dots.map(([x, y, z]) => {
        const [xr, yr, zr] = rotate([x, y, z], cosA, sinA)
        return { sx: cx + xr * R, sy: cy + yr * R, z: zr }
      })
      proj.sort((p, q) => p.z - q.z)
      proj.forEach((p) => {
        const depth = (p.z + 1) / 2
        ctx!.beginPath()
        ctx!.arc(p.sx, p.sy, (0.7 + depth * 1.2) * dpr, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(143,171,212,${0.05 + depth * 0.4})`
        ctx!.shadowBlur = 0
        ctx!.fill()
      })

      arcSegments.forEach((pts) => {
        ctx!.beginPath()
        let started = false
        let avgZ = 0
        pts.forEach((pt) => {
          const [xr, yr, zr] = rotate(pt, cosA, sinA)
          avgZ += zr
          const sx = cx + xr * R
          const sy = cy + yr * R
          if (!started) {
            ctx!.moveTo(sx, sy)
            started = true
          } else {
            ctx!.lineTo(sx, sy)
          }
        })
        avgZ /= pts.length
        const depth = (avgZ + 1) / 2
        ctx!.strokeStyle = `rgba(143,171,212,${0.06 + depth * 0.22})`
        ctx!.lineWidth = 1 * dpr
        ctx!.stroke()
      })

      NODES.forEach((n) => {
        const [xr, yr, zr] = rotate(n, cosA, sinA)
        const depth = (zr + 1) / 2
        const sx = cx + xr * R
        const sy = cy + yr * R
        ctx!.beginPath()
        ctx!.arc(sx, sy, 2.6 * dpr, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(190,212,238,${0.25 + depth * 0.55})`
        ctx!.shadowColor = 'rgba(143,171,212,0.85)'
        ctx!.shadowBlur = 6 * dpr
        ctx!.fill()
      })

      const now = performance.now()
      PULSE_ARCS.forEach(({ arcIndex, speed, phase }) => {
        const { a, b } = ARCS[arcIndex]
        const t = prefersReduced || !loopActiveRef.current ? phase : (phase + now * speed) % 1
        for (let k = 0; k < 6; k++) {
          const tt = Math.max(0, t - k * 0.012)
          const pt = slerp(NODES[a], NODES[b], tt)
          const [xr, yr, zr] = rotate(pt, cosA, sinA)
          const depth = (zr + 1) / 2
          const sx = cx + xr * R
          const sy = cy + yr * R
          const fade = (1 - k / 6) * (0.25 + depth * 0.75)
          ctx!.beginPath()
          ctx!.arc(sx, sy, (2.4 - k * 0.25) * dpr, 0, Math.PI * 2)
          ctx!.fillStyle = `rgba(215,228,245,${fade})`
          ctx!.shadowColor = 'rgba(150,180,225,0.95)'
          ctx!.shadowBlur = 10 * dpr
          ctx!.fill()
        }
      })

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [prefersReduced])

  return (
    <div ref={wrapRef} className="absolute inset-0 flex items-center justify-center">
      <canvas ref={canvasRef} className="w-[130%] max-w-none" />
    </div>
  )
}

const PROGRESS = [
  { name: 'done', value: 62, color: '#8fabd4' },
  { name: 'left', value: 38, color: '#2a2a2a' },
] as const

const NOTIFICATIONS = [
  {
    id: 'design',
    title: 'Design finalized',
    gradient: 'linear-gradient(135deg,#c4d4ec,#8fabd4)',
  },
  {
    id: 'revision',
    title: 'Revision completed',
    gradient: 'linear-gradient(135deg,#8fabd4,#5f7ba8)',
  },
  {
    id: 'approved',
    title: 'Project approved',
    gradient: 'linear-gradient(135deg,#8fabd4,#3f5a86)',
  },
] as const

const STACK_SLOTS = [
  { y: 0, opacity: 1, zIndex: 3 },
  { y: -14, opacity: 1, zIndex: 2 },
  { y: -26, opacity: 1, zIndex: 1 },
] as const

function NotificationStack({ loopActive }: { loopActive: boolean }) {
  const [order, setOrder] = useState([0, 1, 2])
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced || !loopActive) return
    const id = window.setInterval(() => {
      setOrder(([front, middle, back]) => [middle, back, front])
    }, 2800)
    return () => clearInterval(id)
  }, [prefersReduced, loopActive])

  return (
    <div className="relative h-28">
      {NOTIFICATIONS.map((n, i) => {
        const slot = order.indexOf(i)
        const target = STACK_SLOTS[slot]
        return (
          <motion.div
            key={n.id}
            className="absolute inset-x-0 top-7 flex items-center justify-between rounded-xl px-4 py-3"
            style={{
              zIndex: target.zIndex,
              background: '#262626',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            }}
            animate={{ y: target.y, opacity: target.opacity }}
            transition={{
              duration: prefersReduced ? 0 : 0.85,
              ease: REVEAL_EASE,
            }}
          >
            <div>
              <div className="font-dm-mono text-[11px] uppercase tracking-[0.08em] text-subtle">
                notification
              </div>
              <div className="mt-0.5 text-sm font-medium text-[#e8e8e8]">{n.title}</div>
            </div>
            <div
              className="h-7 w-7 shrink-0 rounded-full"
              style={{ backgroundImage: n.gradient }}
              aria-hidden
            />
          </motion.div>
        )
      })}
    </div>
  )
}

const CIRCUIT_PATHS = [
  'M0,52 H150 V196 H298',
  'M0,118 H92 V230 H300',
  'M0,188 H54 V262 H300',
  'M42,0 V88 H326 V190',
  'M112,0 V56 H352 V190',
  'M0,258 H400',
] as const

const PULSE_PATHS = [
  { d: CIRCUIT_PATHS[0], className: 'ss-bento-pulse-a' },
  { d: CIRCUIT_PATHS[1], className: 'ss-bento-pulse-b' },
  { d: CIRCUIT_PATHS[2], className: 'ss-bento-pulse-c' },
  { d: CIRCUIT_PATHS[3], className: 'ss-bento-pulse-d' },
] as const

const CARD_SURFACE =
  'overflow-hidden border border-white/[0.07] bg-[#1c1c1c] [border-radius:18px]'

export function ServicesBentoGrid() {
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement>(null)
  const sectionInView = useSectionInView(sectionRef)
  const prefersReduced = useReducedMotion()
  const glowId = useId().replace(/:/g, '')
  const loopActive = sectionInView && !prefersReduced

  useEffect(() => {
    setPerfDebugLoop('bento', loopActive ? 'active' : 'paused')
  }, [loopActive])

  // "Progress, every week" donut — fills from progressStart to its target
  // (62%) the first time it's scrolled into view. The center label is
  // derived from this same state (not a separate CountUpNumber) so the
  // ring and the label can never drift out of sync with each other.
  const progressStart = 10
  const progressTarget = PROGRESS[0].value
  const { ref: progressRef, inView: progressInView } = useInViewOnce<HTMLDivElement>({
    disabled: !!prefersReduced,
    variant: 'countUp',
  })
  const [progressValue, setProgressValue] = useState(prefersReduced ? progressTarget : progressStart)

  useEffect(() => {
    if (!progressInView || prefersReduced) return
    let rafId = 0
    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startTime
      const linear = Math.min(1, elapsed / (COUNT_UP_DURATION_S * 1000))
      setProgressValue(progressStart + (progressTarget - progressStart) * easeRevealProgress(linear))
      if (linear < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [progressInView, prefersReduced, progressStart, progressTarget])

  const goToContact = () => {
    trackEvent('cta_click', { location: 'services_bento' })
    navigate('/contact')
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="bento-heading"
      className="w-full bg-page px-6 py-16 font-sans sm:px-10 sm:py-20 lg:px-16 lg:py-24"
    >
      <style>{`
        .ss-bento{
          display: grid;
          gap: 20px;
          grid-template-columns: 1fr;
          grid-template-areas:
            "left"
            "small"
            "globe"
            "wide"
            "components";
        }
        @media (min-width: 768px){
          .ss-bento{
            grid-template-columns: 1fr 1fr;
            grid-template-areas:
              "left small"
              "left globe"
              "wide wide"
              "components components";
          }
        }
        @media (min-width: 1100px){
          .ss-bento{
            grid-template-columns: 0.86fr 0.72fr 0.72fr 0.62fr;
            grid-template-rows: auto auto;
            grid-template-areas:
              "left small globe globe"
              "left wide  wide  components";
          }
        }
        .ss-bento-left{ grid-area: left; }
        .ss-bento-small{ grid-area: small; }
        .ss-bento-globe{ grid-area: globe; }
        .ss-bento-wide{ grid-area: wide; }
        .ss-bento-components{ grid-area: components; }

        .ss-bento-dot-grid{
          background-image: radial-gradient(rgba(148,163,184,0.14) 1px, transparent 1px);
          background-size: 14px 14px;
        }

        @keyframes ss-bento-circuit-pulse{
          0%, 55%  { stroke-dashoffset: 112; }
          85%      { stroke-dashoffset: -112; }
          100%     { stroke-dashoffset: -112; }
        }
        .ss-bento-pulse-a path{ animation: ss-bento-circuit-pulse 5.2s linear infinite; }
        .ss-bento-pulse-b path{ animation: ss-bento-circuit-pulse 6.4s linear infinite; animation-delay: 1.6s; }
        .ss-bento-pulse-c path{ animation: ss-bento-circuit-pulse 5.8s linear infinite; animation-delay: 3.1s; }
        .ss-bento-pulse-d path{ animation: ss-bento-circuit-pulse 7s linear infinite; animation-delay: 0.6s; }

        .ss-bento-chip-breathe{ animation: ss-bento-chip-breathe 4s ease-in-out infinite; }
        @keyframes ss-bento-chip-breathe{
          0%, 100% { box-shadow: 0 20px 40px -12px rgba(143,171,212,0.45); }
          50%      { box-shadow: 0 20px 46px -10px rgba(143,171,212,0.7), 0 0 0 3px rgba(143,171,212,0.12); }
        }

        .ss-bento.is-loops-paused .ss-bento-pulse-a path,
        .ss-bento.is-loops-paused .ss-bento-pulse-b path,
        .ss-bento.is-loops-paused .ss-bento-pulse-c path,
        .ss-bento.is-loops-paused .ss-bento-pulse-d path{
          animation: none;
          stroke-dashoffset: 112;
        }
        .ss-bento.is-loops-paused .ss-bento-chip-breathe{ animation: none; }

        @media (prefers-reduced-motion: reduce){
          .ss-bento-pulse-a path, .ss-bento-pulse-b path, .ss-bento-pulse-c path, .ss-bento-pulse-d path{
            animation: none;
            stroke-dashoffset: 112;
          }
          .ss-bento-chip-breathe{ animation: none; }
        }
      `}</style>

      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <h2
            id="bento-heading"
            className="mb-4 font-sora font-black tracking-tight text-white"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', letterSpacing: '-0.04em', lineHeight: 1.05 }}
          >
            Built for businesses that need it to actually work.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <p className="mb-10 max-w-xl text-base leading-relaxed text-muted">
            How we design, build, and keep it running — no account managers, no fluff.
          </p>
        </ScrollReveal>

        <div className={`ss-bento${loopActive ? '' : ' is-loops-paused'}`}>
          <ScrollReveal staggerIndex={3} className={`ss-bento-left flex flex-col ${CARD_SURFACE}`}>
            <div className="p-4 pb-0">
              <div className="relative h-64 overflow-hidden rounded-2xl bg-[#f5f5f3] sm:h-72">
                {/* Blurred, scaled-up backdrop fills the letterboxed space around the
                    contained image below instead of leaving flat white margins. */}
                <img
                  src={wholeThingIllustration}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full scale-125 object-cover blur-2xl"
                />
                <img
                  src={wholeThingIllustration}
                  alt=""
                  className="relative h-full w-full object-contain p-12"
                />
              </div>
            </div>

            <div className="ss-bento-dot-grid mt-6 flex flex-1 flex-col justify-end p-8 pt-8">
              <h3 className="mb-2.5 font-sora text-xl font-semibold tracking-tight text-white">
                We build the whole thing.
              </h3>
              <p className="mb-6 max-w-xs text-[15px] leading-relaxed text-muted">
                We design, build, and ship the product — so you&apos;re not coordinating five
                different teams.
              </p>
              <BrandButton onClick={goToContact} className={FOCUS_RING}>
                Start a project
              </BrandButton>
            </div>
          </ScrollReveal>

          <ScrollReveal staggerIndex={4} className={`ss-bento-small flex flex-col p-6 ${CARD_SURFACE}`}>
            <h3 className="mb-6 font-sora text-lg font-semibold leading-snug tracking-tight text-white">
              Progress, every week
            </h3>
            <div className="flex flex-1 items-center justify-center">
              <div ref={progressRef} className="relative h-32 w-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'done', value: progressValue, color: PROGRESS[0].color },
                        { name: 'left', value: 100 - progressValue, color: PROGRESS[1].color },
                      ]}
                      dataKey="value"
                      innerRadius={40}
                      outerRadius={60}
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                      isAnimationActive={false}
                    >
                      {PROGRESS.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="font-bagel tabular-nums text-white"
                    style={{ fontSize: '1.4rem' }}
                  >
                    {Math.round(progressValue)}%
                  </span>
                </div>
              </div>
            </div>
            <NotificationStack loopActive={loopActive} />
          </ScrollReveal>

          <ScrollReveal
            staggerIndex={4}
            className={`ss-bento-globe relative min-h-[280px] ${CARD_SURFACE}`}
          >
            <ConnectivityGlobe loopActive={loopActive} />
            <div className="relative z-10 p-6">
              <h3 className="font-sora text-lg font-semibold tracking-tight text-white">
                Hosting, deployment &amp; maintenance
              </h3>
              <p className="mt-2 text-[15px] font-medium text-white/80">
                It doesn&apos;t stop at launch.
              </p>
              <p className="mt-1 max-w-xs text-[15px] leading-relaxed text-muted">
                We deploy, monitor, maintain, and improve what we build.
              </p>
            </div>
            <div
              className="pointer-events-none absolute inset-0"
              style={{ boxShadow: 'inset 0 -40px 60px -20px rgba(0,0,0,0.7)' }}
              aria-hidden
            />
          </ScrollReveal>

          <ScrollReveal staggerIndex={4} className={`ss-bento-wide p-6 ${CARD_SURFACE}`}>
            <h3 className="mb-5 font-sora text-lg font-semibold tracking-tight text-white">
              Show up on Google
            </h3>
            <div className="mb-4 flex max-w-md items-center gap-3 rounded-full bg-[#f5f5f3] px-4 py-3">
              <Search size={16} className="shrink-0 text-neutral-400" aria-hidden />
              <span className="flex-1 truncate text-sm text-neutral-500">
                Best Shopify agency for fashion brands
              </span>
              <Mic size={16} className="shrink-0 text-neutral-400" aria-hidden />
            </div>
            <div className="max-w-md rounded-2xl bg-[#f5f5f3] p-4">
              <div className="mb-2 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800">
                  <ShoppingBag size={14} className="text-white" aria-hidden />
                </span>
                <div className="leading-tight">
                  <div className="text-sm font-medium text-neutral-800">runwayhaus.io</div>
                  <div className="text-[11px] text-neutral-400">
                    www.runwayhaus.io &gt; collections &gt; new-arrivals
                  </div>
                </div>
              </div>
              <div className="mb-2 text-sm font-medium text-neutral-800">
                Shopify storefront, fully optimized
              </div>
              <div className="mb-1.5 h-1.5 w-full rounded-full bg-neutral-200" />
              <div className="h-1.5 w-2/3 rounded-full bg-neutral-200" />
            </div>
          </ScrollReveal>

          <ScrollReveal
            staggerIndex={4}
            className={`ss-bento-components relative min-h-[220px] overflow-hidden p-6 ${CARD_SURFACE}`}
          >
            <h3 className="relative z-10 max-w-[70%] font-sora text-lg font-semibold leading-snug tracking-tight text-white">
              One team. End to end.
            </h3>
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 400 300"
              fill="none"
              aria-hidden
            >
              <defs>
                <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="1.6" />
                </filter>
              </defs>

              {CIRCUIT_PATHS.map((d, i) => (
                <path
                  key={d}
                  d={d}
                  stroke={i < 4 ? 'rgba(143,171,212,0.28)' : 'rgba(255,255,255,0.08)'}
                  strokeWidth="1.4"
                />
              ))}

              {PULSE_PATHS.map(({ d, className }) => (
                <g key={className} className={className}>
                  <path
                    d={d}
                    pathLength="100"
                    stroke="rgba(143,171,212,0.6)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="10 300"
                    filter={`url(#${glowId})`}
                  />
                  <path
                    d={d}
                    pathLength="100"
                    stroke="rgba(228,236,248,0.92)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="6 304"
                  />
                </g>
              ))}
            </svg>
            <div
              className="ss-bento-chip-breathe absolute bottom-6 right-6 h-24 w-24 rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, #c4d4ec, #8fabd4)',
                boxShadow: '0 20px 40px -12px rgba(143,171,212,0.5)',
              }}
              aria-hidden
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

export default ServicesBentoGrid
