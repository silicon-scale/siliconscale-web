"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Data ───────────────────────────────────────────────── */
const PRINCIPLES = [
	{
		icon: (
			<svg
				width="28"
				height="28"
				viewBox="0 0 28 28"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.4"
			>
				<circle cx="14" cy="14" r="10" />
				<ellipse cx="14" cy="14" rx="10" ry="5" />
				<line x1="14" y1="4" x2="14" y2="24" />
			</svg>
		),
		title: "Websites built to scale",
		desc: "At SiliconScale, we build websites that grow with your business. From performance to architecture, every decision ensures your site remains fast, reliable, and ready for future growth.",
	},
	{
		icon: (
			<svg
				width="28"
				height="28"
				viewBox="0 0 28 28"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.4"
			>
				<path d="M7 21 L20 8" />
				<path d="M20 8 L13 8" />
				<path d="M20 8 L20 15" />
			</svg>
		),
		title: "Design meets performance",
		desc: "We believe great websites combine beautiful design with strong performance. Every interface we build is crafted to look exceptional and load instantly across all devices.",
	},
	{
		icon: (
			<svg
				width="28"
				height="28"
				viewBox="0 0 28 28"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.4"
			>
				<polyline points="14,5 14,14 19,19" />
				<circle cx="14" cy="14" r="9" />
			</svg>
		),
		title: "Crafted with precision",
		desc: "Every website we create is carefully crafted—from clean code and smooth interactions to thoughtful user experiences—ensuring your digital presence feels polished and professional.",
	},
];

/* ─── useInView ──────────────────────────────────────────── */
function useInView<T extends HTMLElement = HTMLElement>(threshold = 0.12) {
	const ref = useRef<T>(null);
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) {
					setVisible(true);
					obs.disconnect();
				}
			},
			{ threshold }
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, [threshold]);
	return { ref, visible };
}

/* ─── Light Beam ─────────────────────────────────────────── */
function LightBeam() {
	return (
		<div
			style={{
				position: "absolute",
				right: 0,
				top: "50%",
				transform: "translateY(-55%)",
				width: "62%",
				height: "80%",
				pointerEvents: "none",
			}}
		>
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 900 600"
				preserveAspectRatio="xMinYMid meet"
			>
				<defs>
					<radialGradient
						id="beamOuter"
						cx="0%"
						cy="50%"
						r="100%"
						gradientUnits="userSpaceOnUse"
						fx="0"
						fy="300"
					>
						<stop offset="0%" stopColor="#c8dcff" stopOpacity="0.0" />
						<stop offset="10%" stopColor="#c8dcff" stopOpacity="0.22" />
						<stop offset="55%" stopColor="#7aabee" stopOpacity="0.08" />
						<stop offset="100%" stopColor="#000" stopOpacity="0" />
					</radialGradient>
					<radialGradient
						id="beamCore"
						cx="0%"
						cy="50%"
						r="55%"
						gradientUnits="userSpaceOnUse"
						fx="0"
						fy="300"
					>
						<stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
						<stop offset="20%" stopColor="#daeaff" stopOpacity="0.35" />
						<stop offset="100%" stopColor="#000" stopOpacity="0" />
					</radialGradient>
				</defs>
				{/* wide soft halo */}
				<polygon points="0,300 900,0 900,600" fill="url(#beamOuter)" />
				{/* tight bright core */}
				<polygon points="0,300 900,240 900,360" fill="url(#beamCore)" />
				{/* razor center */}
				<line
					x1="0"
					y1="300"
					x2="900"
					y2="300"
					stroke="white"
					strokeWidth="1.2"
					strokeOpacity="0.55"
				/>
			</svg>
		</div>
	);
}

/* ─── Section Label ──────────────────────────────────────── */
function SectionLabel({ text }: { text: string }) {
	return (
		<p
			style={{
				fontFamily: "'DM Mono',monospace",
				fontSize: 12,
				letterSpacing: "0.2em",
				color: "rgba(255,255,255,0.38)",
				marginBottom: 48,
				textTransform: "uppercase",
			}}
		>
			{"[ " + text + " ]"}
		</p>
	);
}

/* ─── Page ───────────────────────────────────────────────── */
export default function AboutPage() {
	const missionRef = useInView<HTMLElement>(0.05);
	const statsRef = useInView<HTMLElement>(0.1);
	const principlesRef = useInView<HTMLElement>(0.1);
	const ctaRef = useInView<HTMLElement>(0.1);

	return (
		<div
			style={{
				background: "#000",
				color: "#fff",
				minHeight: "100vh",
				fontFamily: "'Sora','Helvetica Neue',sans-serif",
				overflowX: "hidden",
			}}
		>
			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@300;400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rv {
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1);
        }
        .rv.in { opacity: 1; transform: none; }
        .rv.d1 { transition-delay: 0.08s; }
        .rv.d2 { transition-delay: 0.18s; }
        .rv.d3 { transition-delay: 0.28s; }
        .rv.d4 { transition-delay: 0.38s; }

        .join-btn {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid rgba(255,255,255,0.28);
          padding: 12px 24px; border-radius: 100px;
          font-family: 'DM Mono',monospace; font-size: 11px;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #fff; background: transparent; cursor: pointer;
          text-decoration: none; transition: background 0.25s, border-color 0.25s;
        }
        .join-btn:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.55); }

        .ghost-btn {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid rgba(255,255,255,0.2);
          padding: 12px 24px; border-radius: 100px;
          font-family: 'DM Mono',monospace; font-size: 11px;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.6); background: transparent;
          cursor: pointer; text-decoration: none; transition: all 0.25s;
        }
        .ghost-btn:hover { border-color: rgba(255,255,255,0.45); color: #fff; }

        .stat-row {
          display: flex; border-top: 1px solid rgba(255,255,255,0.1);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .stat-cell {
          flex: 1; padding: 44px 0 44px 40px;
          border-right: 1px solid rgba(255,255,255,0.1);
        }
        .stat-cell:last-child { border-right: none; }

        .pc {
          flex: 1; padding: 44px 40px;
          border-left: 1px solid rgba(255,255,255,0.1);
          transition: border-color 0.3s;
        }
        .pc:hover { border-color: rgba(255,255,255,0.35); }
        .pc:first-child { border-left: none; padding-left: 0; }

        @media (max-width: 860px) {
          .principles-wrap { flex-direction: column !important; }
          .pc { border-left: none !important; border-top: 1px solid rgba(255,255,255,0.1); padding: 36px 0 !important; }
          .stat-row { flex-wrap: wrap; }
          .stat-cell { flex: 1 1 50%; }
        }
      `}</style>

			{/* ════ HERO / MISSION ════ */}
			<section
				ref={missionRef.ref}
				style={{
					position: "relative",
					minHeight: "100vh",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					padding: "60px 56px 110px",
					overflow: "hidden",
				}}
			>
				<LightBeam />

				<div
					className={`rv ${missionRef.visible ? "in" : ""}`}
					style={{ position: "relative", zIndex: 2 }}
				>
					<SectionLabel text="OUR MISSION" />
				</div>

				<h1
					className={`rv d1 ${missionRef.visible ? "in" : ""}`}
					style={{
						position: "relative",
						zIndex: 2,
						fontSize: "clamp(54px,9vw,136px)",
						fontWeight: 700,
						lineHeight: 1.0,
						letterSpacing: "-0.035em",
						maxWidth: 800,
						// Mirror xAI: first words dim, key word bright
						color: "rgba(255,255,255,0.22)",
					}}
				>
					Design.{" "}
					<span style={{ color: "rgba(255,255,255,0.42)" }}>Build.</span>{" "}
					<span style={{ color: "rgba(255,255,255,0.82)" }}>Scale.</span>
				</h1>

				{/* bottom row */}
				<div
					style={{
						position: "absolute",
						bottom: 36,
						left: 56,
						right: 56,
						zIndex: 2,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-end",
						gap: 24,
						flexWrap: "wrap",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 8,
							color: "rgba(255,255,255,0.35)",
							fontSize: 20,
						}}
					>
						↓
					</div>
					<p
						style={{
							fontFamily: "'DM Mono',monospace",
							fontSize: 13,
							lineHeight: 1.75,
							color: "rgba(255,255,255,0.52)",
							fontWeight: 300,
							maxWidth: 540,
						}}
					>
						SiliconScale blends creativity with scalable technology — delivering
						digital experiences that are visually compelling, technically robust, and
						built for long-term growth.
					</p>
					<a href="/contact" className="join-btn">
						Start a project ↗
					</a>
				</div>
			</section>

			{/* ════ STATS ════ */}
			<div ref={statsRef.ref} style={{ padding: "0 56px" }}>
				<div className="stat-row">
					{[
						{ n: "6+", l: "Projects Delivered" },
						{ n: "2 yrs", l: "Crafting Experiences" },
						{ n: "3+", l: "Business Brands Served" },
						{ n: "99%", l: "Client Retention" },
					].map((s, i) => (
						<div
							key={s.l}
							className={`stat-cell rv d${i + 1} ${statsRef.visible ? "in" : ""}`}
						>
							<p
								style={{
									fontSize: "clamp(30px,4vw,52px)",
									fontWeight: 700,
									letterSpacing: "-0.03em",
									marginBottom: 10,
								}}
							>
								{s.n}
							</p>
							<p
								style={{
									fontFamily: "'DM Mono',monospace",
									fontSize: 11,
									letterSpacing: "0.12em",
									textTransform: "uppercase",
									color: "rgba(255,255,255,0.32)",
								}}
							>
								{s.l}
							</p>
						</div>
					))}
				</div>
			</div>

			{/* ════ PRINCIPLES ════ */}
			<section ref={principlesRef.ref} style={{ padding: "128px 56px" }}>
				<div className={`rv ${principlesRef.visible ? "in" : ""}`}>
					<SectionLabel text="OUR PRINCIPLES" />
				</div>

				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-end",
						marginBottom: 80,
						flexWrap: "wrap",
						gap: 24,
					}}
				>
					<h2
						className={`rv d1 ${principlesRef.visible ? "in" : ""}`}
						style={{
							fontSize: "clamp(38px,5.5vw,76px)",
							fontWeight: 700,
							letterSpacing: "-0.03em",
							lineHeight: 1.05,
						}}
					>
						At our core
					</h2>
					<p
						className={`rv d2 ${principlesRef.visible ? "in" : ""}`}
						style={{
							fontFamily: "'DM Mono',monospace",
							fontSize: 14,
							lineHeight: 1.75,
							color: "rgba(255,255,255,0.48)",
							maxWidth: 400,
							fontWeight: 300,
						}}
					>
						We two founders united by curiosity and craft are building meaningful digital experiences.
					</p>
				</div>

				<div className="principles-wrap" style={{ display: "flex" }}>
					{PRINCIPLES.map((p, i) => (
						<div
							key={p.title}
							className={`pc rv d${i + 2} ${principlesRef.visible ? "in" : ""}`}
						>
							<div
								style={{
									color: "rgba(255,255,255,0.55)",
									marginBottom: 60,
								}}
							>
								{p.icon}
							</div>
							<h3
								style={{
									fontSize: 19,
									fontWeight: 600,
									letterSpacing: "-0.01em",
									marginBottom: 16,
									lineHeight: 1.3,
								}}
							>
								{p.title}
							</h3>
							<p
								style={{
									fontFamily: "'DM Mono',monospace",
									fontSize: 13,
									lineHeight: 1.85,
									color: "rgba(255,255,255,0.42)",
									fontWeight: 300,
								}}
							>
								{p.desc}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* ════ CTA ════ */}
			<section
				ref={ctaRef.ref}
				style={{
					padding: "80px 56px",
					borderTop: "1px solid rgba(255,255,255,0.08)",
					position: "relative",
					overflow: "hidden",
				}}
			>
				<div
					style={{
						position: "absolute",
						top: "40%",
						left: "15%",
						width: 700,
						height: 500,
						background:
							"radial-gradient(ellipse, rgba(255,107,43,0.055) 0%, transparent 65%)",
						pointerEvents: "none",
						transform: "translate(-50%,-50%)",
					}}
				/>
				<div className={`rv ${ctaRef.visible ? "in" : ""}`}>
					<SectionLabel text="WORK WITH US" />
				</div>
				<h2
					className={`rv d1 ${ctaRef.visible ? "in" : ""}`}
					style={{
						fontSize: "clamp(46px,8vw,112px)",
						fontWeight: 700,
						letterSpacing: "-0.04em",
						lineHeight: 0.95,
						maxWidth: 820,
						marginBottom: 56,
					}}
				>
					Ready to build
					<br />
					something{" "}
					<span style={{ color: "rgba(255,255,255,0.25)" }}>great?</span>
				</h2>
				<div
					className={`rv d2 ${ctaRef.visible ? "in" : ""}`}
					style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
				>
					<a
						href="/work"
						className="join-btn"
						style={{ fontSize: 12 }}
					>
						View Our Work ↗
					</a>
				</div>
			</section>
		</div>
	);
}
