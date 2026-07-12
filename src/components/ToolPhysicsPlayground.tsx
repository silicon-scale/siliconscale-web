'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import Matter from 'matter-js'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { SecondaryCta } from '@/components/ui/SecondaryCta'
import { ToolIcon, type ToolIconId } from '@/components/toolIcons'
import { cn } from '@/lib/utils'

type PhysicsTool = {
  id: ToolIconId
  name: string
  icon: ReactNode
}

const BLOCK = 64

const PHYSICS_TOOLS: PhysicsTool[] = [
  { id: 'figma', name: 'Figma', icon: <ToolIcon id="figma" size={42} /> },
  { id: 'html', name: 'HTML', icon: <ToolIcon id="html" size={42} /> },
  { id: 'css', name: 'CSS', icon: <ToolIcon id="css" size={42} /> },
  { id: 'typescript', name: 'TypeScript', icon: <ToolIcon id="typescript" size={42} /> },
  { id: 'react', name: 'React', icon: <ToolIcon id="react" size={42} /> },
  { id: 'nextjs', name: 'Next.js', icon: <ToolIcon id="nextjs" size={42} /> },
  { id: 'tailwind', name: 'Tailwind', icon: <ToolIcon id="tailwind" size={42} /> },
  { id: 'framer', name: 'Framer', icon: <ToolIcon id="framer" size={42} /> },
  { id: 'shopify', name: 'Shopify', icon: <ToolIcon id="shopify" size={42} /> },
  { id: 'gsap', name: 'GSAP', icon: <ToolIcon id="gsap" size={42} /> },
  { id: 'threejs', name: 'Three.js', icon: <ToolIcon id="threejs" size={42} /> },
  { id: 'claude', name: 'Claude', icon: <ToolIcon id="claude" size={42} /> },
  { id: 'gemini', name: 'Gemini', icon: <ToolIcon id="gemini" size={42} /> },
  { id: 'zapier', name: 'Zapier', icon: <ToolIcon id="zapier" size={42} /> },
  { id: 'n8n', name: 'n8n', icon: <ToolIcon id="n8n" size={42} /> },
  { id: 'clickup', name: 'ClickUp', icon: <ToolIcon id="clickup" size={42} /> },
  { id: 'vercel', name: 'Vercel', icon: <ToolIcon id="vercel" size={42} /> },
]

function StaticToolPile() {
  return (
    <div className="physics-static" aria-hidden="true">
      {PHYSICS_TOOLS.map((tool) => (
        <div key={tool.id} className="physics-block is-static" title={tool.name}>
          {tool.icon}
        </div>
      ))}
    </div>
  )
}

function stagePoint(stage: HTMLElement, clientX: number, clientY: number) {
  const rect = stage.getBoundingClientRect()
  return { x: clientX - rect.left, y: clientY - rect.top }
}

export function ToolPhysicsPlayground() {
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const blockRefs = useRef(new Map<string, HTMLDivElement>())
  const [armed, setArmed] = useState(false)
  const [dragging, setDragging] = useState(false)

  const setBlockRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) blockRefs.current.set(id, el)
    else blockRefs.current.delete(id)
  }, [])

  // Arm once the section first enters the viewport (unchanged — we still only
  // want to pay the Matter.js/body-creation cost once).
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true)
          io.disconnect()
        }
      },
      { threshold: 0.28 },
    )
    io.observe(section)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!armed || prefersReducedMotion) return
    const stage = stageRef.current
    const section = sectionRef.current
    if (!stage || !section) return

    const { Engine, Bodies, Body, Composite, Runner, Constraint, Query, Events } = Matter

    const engine = Engine.create({
      gravity: { x: 0, y: 1.15, scale: 0.001 },
    })
    engine.constraintIterations = 4
    engine.positionIterations = 10
    engine.velocityIterations = 8

    const wallOpts: Matter.IChamferableBodyDefinition = {
      isStatic: true,
      restitution: 0.18,
      friction: 0.9,
      label: 'wall',
    }

    let width = stage.clientWidth
    let height = stage.clientHeight
    const wallT = 80

    const makeWalls = (w: number, h: number, withLid: boolean) => {
      const tall = h + 900
      // Inset so settled / thrown blocks aren't clipped by overflow:hidden
      const inset = 10
      const list = [
        Bodies.rectangle(w / 2, h + wallT / 2 - inset, w + wallT * 2, wallT, wallOpts),
        Bodies.rectangle(-wallT / 2 + inset, h / 2 - 280, wallT, tall, wallOpts),
        Bodies.rectangle(w + wallT / 2 - inset, h / 2 - 280, wallT, tall, wallOpts),
      ]
      if (withLid) {
        list.push(Bodies.rectangle(w / 2, -wallT / 2 + inset, w + wallT * 2, wallT, wallOpts))
      }
      return list
    }

    let walls = makeWalls(width, height, false)
    Composite.add(engine.world, walls)

    const cols = Math.max(4, Math.floor((width - 48) / (BLOCK + 12)))
    const bodies = PHYSICS_TOOLS.map((tool, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = 40 + col * (BLOCK + 12) + (Math.random() * 8 - 4)
      const y = -90 - row * (BLOCK + 18) - Math.random() * 60
      return Bodies.rectangle(x, y, BLOCK, BLOCK, {
        chamfer: { radius: 15 },
        restitution: 0.42,
        friction: 0.32,
        frictionAir: 0.014,
        density: 0.002,
        label: tool.id,
        slop: 0.02,
      })
    })
    Composite.add(engine.world, bodies)

    const lidTimer = window.setTimeout(() => {
      Composite.remove(engine.world, walls)
      walls = makeWalls(width, height, true)
      Composite.add(engine.world, walls)
    }, 2200)

    // Pointer-based grab — Matter's Mouse breaks on Retina + scrolled pages
    let dragConstraint: Matter.Constraint | null = null
    let dragBody: Matter.Body | null = null
    let lastSample = { x: 0, y: 0, t: 0 }
    let velocity = { x: 0, y: 0 }

    const clearDrag = () => {
      if (dragConstraint) {
        Composite.remove(engine.world, dragConstraint)
        dragConstraint = null
      }
      dragBody = null
      setDragging(false)
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return
      const point = stagePoint(stage, e.clientX, e.clientY)
      const hits = Query.point(
        bodies.filter((b) => !b.isStatic),
        point,
      )
      if (!hits.length) return

      e.preventDefault()
      dragBody = hits[hits.length - 1]
      Body.setAngularVelocity(dragBody, 0)
      Body.setVelocity(dragBody, { x: 0, y: 0 })

      dragConstraint = Constraint.create({
        pointA: { ...point },
        bodyB: dragBody,
        pointB: {
          x: point.x - dragBody.position.x,
          y: point.y - dragBody.position.y,
        },
        stiffness: 0.22,
        damping: 0.08,
        length: 0,
      })
      Composite.add(engine.world, dragConstraint)

      lastSample = { x: point.x, y: point.y, t: performance.now() }
      velocity = { x: 0, y: 0 }
      setDragging(true)
      stage.setPointerCapture(e.pointerId)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!dragConstraint || !dragBody) return
      e.preventDefault()
      const point = stagePoint(stage, e.clientX, e.clientY)
      dragConstraint.pointA.x = point.x
      dragConstraint.pointA.y = point.y

      const now = performance.now()
      const dt = Math.max(now - lastSample.t, 1) / 1000
      velocity = {
        x: (point.x - lastSample.x) / dt,
        y: (point.y - lastSample.y) / dt,
      }
      lastSample = { x: point.x, y: point.y, t: now }
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!dragBody) return
      // Throw impulse from recent pointer velocity
      const throwScale = 0.012
      Body.setVelocity(dragBody, {
        x: Math.max(-22, Math.min(22, velocity.x * throwScale)),
        y: Math.max(-22, Math.min(22, velocity.y * throwScale)),
      })
      Body.setAngularVelocity(
        dragBody,
        Math.max(-0.28, Math.min(0.28, velocity.x * 0.0003)),
      )
      try {
        stage.releasePointerCapture(e.pointerId)
      } catch {
        /* already released */
      }
      clearDrag()
    }

    stage.addEventListener('pointerdown', onPointerDown)
    stage.addEventListener('pointermove', onPointerMove)
    stage.addEventListener('pointerup', onPointerUp)
    stage.addEventListener('pointercancel', onPointerUp)

    const runner = Runner.create()

    // Sync DOM transforms straight off Matter's own tick instead of running a
    // second, independent requestAnimationFrame loop — one less loop fighting
    // the main thread every frame.
    const half = BLOCK / 2
    const sync = () => {
      for (const body of bodies) {
        const el = blockRefs.current.get(body.label)
        if (!el) continue
        el.style.transform = `translate3d(${body.position.x - half}px, ${body.position.y - half}px, 0) rotate(${body.angle}rad)`
      }
    }
    Events.on(engine, 'afterUpdate', sync)

    // --- Visibility-gated start/stop -----------------------------------
    // This is the critical fix: previously the Matter runner + a separate
    // rAF sync loop ran forever once armed, even after the section scrolled
    // fully out of view — a permanent per-frame cost on every other
    // interaction on the page. Now the simulation is paused whenever the
    // stage isn't actually on screen, and resumed when it is.
    let physicsRunning = false

    const startPhysics = () => {
      if (physicsRunning) return
      physicsRunning = true
      Runner.run(runner, engine)
    }

    const stopPhysics = () => {
      if (!physicsRunning) return
      physicsRunning = false
      Runner.stop(runner)
    }

    const visibilityIo = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? startPhysics() : stopPhysics()),
      { threshold: 0.05 },
    )
    visibilityIo.observe(section)

    const onDocVisibility = () => {
      if (document.visibilityState === 'hidden') stopPhysics()
      else if (section.getBoundingClientRect().top < window.innerHeight) startPhysics()
    }
    document.addEventListener('visibilitychange', onDocVisibility)

    // Section was just armed because it entered the viewport, so start now.
    startPhysics()

    const onResize = () => {
      const w = stage.clientWidth
      const h = stage.clientHeight
      if (Math.abs(w - width) < 2 && Math.abs(h - height) < 2) return
      width = w
      height = h
      Composite.remove(engine.world, walls)
      walls = makeWalls(w, h, true)
      Composite.add(engine.world, walls)
      for (const body of bodies) {
        const x = Math.min(Math.max(body.position.x, half + 4), w - half - 4)
        const y = Math.min(Math.max(body.position.y, half + 4), h - half - 4)
        Body.setPosition(body, { x, y })
        Body.setVelocity(body, { x: 0, y: 0 })
      }
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(stage)

    return () => {
      clearTimeout(lidTimer)
      visibilityIo.disconnect()
      document.removeEventListener('visibilitychange', onDocVisibility)
      ro.disconnect()
      stage.removeEventListener('pointerdown', onPointerDown)
      stage.removeEventListener('pointermove', onPointerMove)
      stage.removeEventListener('pointerup', onPointerUp)
      stage.removeEventListener('pointercancel', onPointerUp)
      clearDrag()
      Events.off(engine, 'afterUpdate', sync)
      stopPhysics()
      Composite.clear(engine.world, false)
      Engine.clear(engine)
    }
  }, [armed, prefersReducedMotion])

  return (
    <section
      ref={sectionRef}
      className="physics-section"
      aria-labelledby="physics-stack-heading"
    >
      <style>{`
        .physics-section {
          margin-top: 5rem;
          padding-top: 3.5rem;
          border-top: 1px solid rgba(255,255,255,0.10);
        }
        .physics-layout {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.2fr);
          gap: 2.5rem;
          align-items: center;
        }
        .physics-copy h2 {
          font-size: clamp(2.2rem, 4vw, 3.4rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: #fff;
        }
        .physics-copy p {
          margin-top: 1rem;
          max-width: 28rem;
          font-size: 0.95rem;
          line-height: 1.65;
          color: rgba(255,255,255,0.62);
        }
        .physics-cta {
          margin-top: 1.5rem;
        }
        .physics-stage {
          position: relative;
          height: clamp(340px, 48vh, 460px);
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.10);
          background: linear-gradient(160deg, rgba(255,255,255,0.04), rgba(10,10,10,0.95));
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03), 0 30px 80px rgba(0,0,0,0.45);
          overflow: hidden;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
          cursor: grab;
        }
        .physics-stage.is-dragging { cursor: grabbing; }
        .physics-block {
          position: absolute;
          top: 0;
          left: 0;
          width: ${BLOCK}px;
          height: ${BLOCK}px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.14);
          background: #161616;
          box-shadow: 0 10px 24px rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          will-change: transform;
          pointer-events: none;
        }
        .physics-block img {
          display: block;
          max-width: 56px;
          max-height: 56px;
          width: auto;
          height: auto;
          flex-shrink: 0;
          object-fit: contain;
          pointer-events: none;
        }
        .physics-static {
          height: 100%;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-end;
          align-items: flex-end;
          gap: 10px;
          padding: 18px;
        }
        .physics-block.is-static {
          position: relative;
          pointer-events: auto;
        }
        @media (max-width: 900px) {
          .physics-layout {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
          .physics-stage { height: 360px; }
        }
      `}</style>

      <div className="physics-layout">
        <div className="physics-copy">
          <SectionEyebrow variant="pillMono">Our Stack</SectionEyebrow>
          <h2 id="physics-stack-heading">What we build with</h2>
          <p>
            Drag the blocks. Toss them around. Every icon is a tool we actually ship with —
            open the full stack when you want the why behind each one.
          </p>
          <div className="physics-cta">
            <SecondaryCta variant="solid" onClick={() => navigate('/tool-stack')}>
              Our tool stack
            </SecondaryCta>
          </div>
        </div>

        <div
          ref={stageRef}
          className={cn('physics-stage', dragging && 'is-dragging')}
          role="img"
          aria-label="Interactive physics sandbox of tool icons. Drag blocks to throw them around inside the box."
        >
          {prefersReducedMotion ? (
            <StaticToolPile />
          ) : (
            PHYSICS_TOOLS.map((tool) => (
              <div
                key={tool.id}
                ref={(el) => setBlockRef(tool.id, el)}
                className="physics-block"
                title={tool.name}
                aria-hidden="true"
                style={{ transform: 'translate3d(-9999px, -9999px, 0)' }}
              >
                {tool.icon}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}