"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { motion } from "framer-motion";
import { observeVisibility } from "@/utils/sharedVisibilityObserver";

interface VortexProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  backgroundColor?: string;
}

const PARTICLE_PROP_COUNT = 9;

export const Vortex = (props: VortexProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | undefined>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const baseParticleCount = props.particleCount ?? 520;
    const rangeY = props.rangeY ?? 140;
    const baseTTL = 50;
    const rangeTTL = 150;
    const baseSpeed = props.baseSpeed ?? 0.0;
    const rangeSpeed = props.rangeSpeed ?? 1.4;
    const baseRadius = props.baseRadius ?? 1;
    const rangeRadius = props.rangeRadius ?? 2;
    const baseHue = props.baseHue ?? 42;
    const rangeHue = 24;
    const noiseSteps = 3;
    const xOff = 0.00125;
    const yOff = 0.00125;
    const zOff = 0.0005;
    const backgroundColor = props.backgroundColor ?? "rgba(0,0,0,0)";

    let tick = 0;
    const noise3D = createNoise3D();
    let particleProps = new Float32Array(0);
    const center: [number, number] = [0, 0];

    const TAU = 2 * Math.PI;
    const rand = (n: number): number => n * Math.random();
    const randRange = (n: number): number => n - rand(2 * n);
    const fadeInOut = (t: number, m: number): number => {
      const hm = 0.5 * m;
      return Math.abs(((t + hm) % m) - hm) / hm;
    };
    const lerp = (n1: number, n2: number, speed: number): number =>
      (1 - speed) * n1 + speed * n2;

    const resizeToContainer = (c: HTMLCanvasElement, ctx?: CanvasRenderingContext2D) => {
      const cont = containerRef.current;
      if (!cont) return;
      const rect = cont.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      c.width = Math.max(1, Math.floor(rect.width * dpr));
      c.height = Math.max(1, Math.floor(rect.height * dpr));
      c.style.width = `${rect.width}px`;
      c.style.height = `${rect.height}px`;
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      center[0] = 0.5 * rect.width;
      center[1] = 0.5 * rect.height;
    };

    const initParticle = (i: number) => {
      const c = canvasRef.current;
      const cont = containerRef.current;
      if (!c || !cont) return;
      const w = cont.getBoundingClientRect().width;
      particleProps.set(
        [
          rand(w),
          center[1] + randRange(rangeY),
          0,
          0,
          0,
          baseTTL + rand(rangeTTL),
          baseSpeed + rand(rangeSpeed),
          baseRadius + rand(rangeRadius),
          baseHue + rand(rangeHue),
        ],
        i
      );
    };

    const initParticles = () => {
      tick = 0;
      // Density scaling: slightly lower particle count on high-DPR / smaller screens.
      const cont = containerRef.current;
      const w = cont?.getBoundingClientRect().width ?? 0;
      const dpr = window.devicePixelRatio || 1;
      const densityScale = dpr > 1.5 || w < 1200 ? 0.88 : 1;
      const particleCount = Math.max(260, Math.round(baseParticleCount * densityScale));
      const particlePropsLength = particleCount * PARTICLE_PROP_COUNT;
      particleProps = new Float32Array(particlePropsLength);
      for (let i = 0; i < particlePropsLength; i += PARTICLE_PROP_COUNT) {
        initParticle(i);
      }
    };

    const drawParticle = (
      x: number,
      y: number,
      x2: number,
      y2: number,
      life: number,
      ttl: number,
      radius: number,
      hue: number,
      cctx: CanvasRenderingContext2D
    ) => {
      cctx.save();
      cctx.lineCap = "round";
      cctx.lineWidth = radius;
      cctx.strokeStyle = `hsla(${hue},100%,65%,${fadeInOut(life, ttl) * 0.9})`;
      cctx.beginPath();
      cctx.moveTo(x, y);
      cctx.lineTo(x2, y2);
      cctx.stroke();
      cctx.restore();
    };

    const checkBounds = (x: number, y: number, w: number, h: number) =>
      x > w || x < 0 || y > h || y < 0;

    const updateParticle = (i: number, cctx: CanvasRenderingContext2D, w: number, h: number) => {
      const i2 = i + 1, i3 = i + 2, i4 = i + 3, i5 = i + 4, i6 = i + 5, i7 = i + 6, i8 = i + 7, i9 = i + 8;
      const x = particleProps[i];
      const y = particleProps[i2];
      const n = noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;
      const vx = lerp(particleProps[i3], Math.cos(n), 0.5);
      const vy = lerp(particleProps[i4], Math.sin(n), 0.5);
      const life = particleProps[i5];
      const ttl = particleProps[i6];
      const speed = particleProps[i7];
      const x2 = x + vx * speed;
      const y2 = y + vy * speed;
      const radius = particleProps[i8];
      const hue = particleProps[i9];
      drawParticle(x, y, x2, y2, life, ttl, radius, hue, cctx);
      const nextLife = life + 1;
      particleProps[i] = x2;
      particleProps[i2] = y2;
      particleProps[i3] = vx;
      particleProps[i4] = vy;
      particleProps[i5] = nextLife;
      if (checkBounds(x2, y2, w, h) || nextLife > ttl) initParticle(i);
    };

    const drawParticles = (cctx: CanvasRenderingContext2D, w: number, h: number) => {
      // particleProps holds a packed array of particle attributes.
      for (let i = 0; i < particleProps.length; i += PARTICLE_PROP_COUNT) {
        updateParticle(i, cctx, w, h);
      }
    };

    const renderGlow = (c: HTMLCanvasElement, cctx: CanvasRenderingContext2D) => {
      cctx.save();
      cctx.filter = "blur(8px) brightness(200%)";
      cctx.globalCompositeOperation = "lighter";
      cctx.drawImage(c, 0, 0);
      cctx.restore();
      cctx.save();
      cctx.filter = "blur(4px) brightness(200%)";
      cctx.globalCompositeOperation = "lighter";
      cctx.drawImage(c, 0, 0);
      cctx.restore();
    };

    const renderToScreen = (c: HTMLCanvasElement, cctx: CanvasRenderingContext2D) => {
      cctx.save();
      cctx.globalCompositeOperation = "lighter";
      cctx.drawImage(c, 0, 0);
      cctx.restore();
    };

    let running = true;
    let isInView = true;
    let lastTime = performance.now();
    let overBudgetStreak = 0;
    let hzSamples = 0;
    let hzDtSum = 0;
    let throttleTo60 = false;
    let frameAccumulator = 0;

    const draw = () => {
      if (!running) return;
      const c = canvasRef.current;
      const cont = containerRef.current;
      if (!c || !cont || !ctx) return;

      const now = performance.now();
      const dt = now - lastTime;
      lastTime = now;

      if (!throttleTo60 && dt > 0 && hzSamples < 30) {
        hzSamples += 1;
        hzDtSum += dt;
        if (hzSamples === 30) {
          const avgDt = hzDtSum / hzSamples;
          const hz = 1000 / avgDt;
          throttleTo60 = hz > 90;
        }
      }

      if (throttleTo60) {
        frameAccumulator += dt;
        if (frameAccumulator < 16.67) {
          animationFrameId.current = window.requestAnimationFrame(draw);
          return;
        }
        frameAccumulator = 0;
      }
      // If frames are consistently over ~24ms, pause briefly to avoid runaway loops on slow devices.
      if (dt > 24) {
        overBudgetStreak++;
        if (overBudgetStreak >= 8) {
          overBudgetStreak = 0;
          running = false;
          setTimeout(() => {
            if (document.visibilityState !== "hidden") {
              running = true;
              animationFrameId.current = window.requestAnimationFrame(draw);
            }
          }, 250);
          return;
        }
      } else {
        overBudgetStreak = 0;
      }

      tick++;
      const rect = cont.getBoundingClientRect();
      const w = rect?.width ?? 1;
      const h = rect?.height ?? 1;

      ctx.clearRect(0, 0, w, h);
      if (backgroundColor !== "transparent" && backgroundColor !== "rgba(0,0,0,0)") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }
      drawParticles(ctx, w, h);
      renderGlow(c, ctx);
      renderToScreen(c, ctx);

      animationFrameId.current = window.requestAnimationFrame(draw);
    };

    const start = () => {
      if (!isInView || document.visibilityState === "hidden") return;
      running = true;
      lastTime = performance.now();
      animationFrameId.current = window.requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      if (animationFrameId.current !== undefined) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = undefined;
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") stop();
      else start();
    };

    // Initialize immediately, but defer starting the animation until after first paint,
    // and stagger slightly so it doesn't compete with hero reveal.
    resizeToContainer(canvas, ctx);
    initParticles();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => start(), 120);
      });
    });

    const ro = new ResizeObserver(() => {
      resizeToContainer(canvas, ctx);
      initParticles();
    });
    ro.observe(container);

    const unobserve = observeVisibility(container, (visible) => {
      isInView = visible;
      if (!visible) stop();
      else start();
    });

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      ro.disconnect();
      unobserve();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div className={cn("relative h-full w-full", props.containerClassName)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        ref={containerRef}
        className="absolute inset-0 z-0 flex h-full w-full items-center justify-center bg-transparent"
        style={{ pointerEvents: "none", willChange: "transform" }}
        aria-hidden
      >
        <canvas ref={canvasRef} className="h-full w-full" />
      </motion.div>

      <div className={cn("relative z-10", props.className)}>{props.children}</div>
    </div>
  );
};
