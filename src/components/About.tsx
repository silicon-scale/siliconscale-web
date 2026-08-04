"use client";

import { useEffect } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { SplashHoverButton } from "@/components/ui/SplashHoverButton";

/* ─── Data ───────────────────────────────────────────────── */
const PRINCIPLES = [
	{
		icon: (
			<svg
				width="44"
				height="44"
				viewBox="0 0 28 28"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.2"
			>
				<circle cx="14" cy="14" r="10" />
				<ellipse cx="14" cy="14" rx="10" ry="5" />
				<line x1="14" y1="4" x2="14" y2="24" />
			</svg>
		),
		title: "Built to grow with you",
		desc: "A system that works today and still works when you're 10x the size. We build for where you're going, not just where you are.",
	},
	{
		icon: (
			<svg
				width="44"
				height="44"
				viewBox="0 0 28 28"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.2"
			>
				<path d="M7 21 L20 8" />
				<path d="M20 8 L13 8" />
				<path d="M20 8 L20 15" />
			</svg>
		),
		title: "Function first, polish always",
		desc: "A tool nobody wants to use is a failed tool. We build things that work correctly AND feel good to use — not one at the expense of the other.",
	},
	{
		icon: (
			<svg
				width="44"
				height="44"
				viewBox="0 0 28 28"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.2"
			>
				<polyline points="14,5 14,14 19,19" />
				<circle cx="14" cy="14" r="9" />
			</svg>
		),
		title: "We ship, not just plan",
		desc: "Clean code, tested before it's handed off, explained in plain language — not a black box you're afraid to touch after we leave.",
	},
];

/* ─── Section Label ──────────────────────────────────────── */
function SectionLabel({ text }: { text: string }) {
	return (
		<p
			style={{
				fontFamily: "'DM Mono',monospace",
				fontSize: 12,
				letterSpacing: "0.2em",
				color: "rgba(255,255,255,0.55)",
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
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

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
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .join-btn {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid rgba(255,255,255,0.28);
          padding: 12px 24px; border-radius: 8px;
          font-family: 'DM Mono',monospace; font-size: 11px;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #fff; background: transparent; cursor: pointer;
          text-decoration: none; transition: background 0.25s, border-color 0.25s;
        }
        .join-btn:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.55); }
        .join-btn--splash:hover { background: transparent; border-color: rgba(255,255,255,0.28); }
        .join-btn:focus-visible {
          outline: 2px solid var(--focus-ring);
          outline-offset: 3px;
        }

        .ghost-btn {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid rgba(255,255,255,0.2);
          padding: 12px 24px; border-radius: 8px;
          font-family: 'DM Mono',monospace; font-size: 11px;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.6); background: transparent;
          cursor: pointer; text-decoration: none; transition: all 0.25s;
        }
        .ghost-btn:hover { border-color: rgba(255,255,255,0.45); color: #fff; }
        .ghost-btn:focus-visible {
          outline: 2px solid var(--focus-ring);
          outline-offset: 3px;
        }

        .pc {
          flex: 1; padding: 64px 56px;
          border-left: 1px solid rgba(255,255,255,0.1);
          transition: border-color 0.3s;
        }
        .pc:hover { border-color: rgba(255,255,255,0.35); }
        .pc:first-child { border-left: none; padding-left: 0; }

        .principles-section {
          padding: 128px 56px;
        }

        .cta-section {
          padding: 80px 56px;
          border-top: 1px solid rgba(255,255,255,0.08);
          position: relative;
          overflow: hidden;
        }

        @media (max-width: 1024px) {
          .principles-section { padding: 100px 40px; }
          .cta-section { padding: 60px 40px; }
        }

        @media (max-width: 768px) {
          .principles-section { padding: 64px 20px; }
          .cta-section { padding: 40px 20px; }
        }

        @media (max-width: 480px) {
          .principles-section { padding: 48px 16px; }
          .cta-section { padding: 32px 16px; }
          .pc { padding: 40px 20px; }
        }

        @media (max-width: 860px) {
          .principles-wrap { flex-direction: column !important; }
          .pc { border-left: none !important; border-top: 1px solid rgba(255,255,255,0.1); padding: 44px 0 !important; }
        }
      `}</style>

			{/* ════ PRINCIPLES ════ */}
			<section className="principles-section">
				<ScrollReveal>
					<SectionLabel text="OUR PRINCIPLES" />
				</ScrollReveal>

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
					<ScrollReveal
						as="h2"
						delay={0.08}
						style={{
							fontSize: "clamp(38px,5.5vw,76px)",
							fontWeight: 700,
							letterSpacing: "-0.03em",
							lineHeight: 1.05,
						}}
					>
						What we actually believe
					</ScrollReveal>
					<ScrollReveal
						as="p"
						delay={0.16}
						style={{
							fontFamily: "'DM Mono',monospace",
							fontSize: 14,
							lineHeight: 1.75,
							color: "rgba(255,255,255,0.48)",
							maxWidth: 400,
							fontWeight: 300,
						}}
					>
						A remote team spread across India, working like we&apos;re in the next
						room — you deal directly with the people building your system, not a
						layer of account management.
					</ScrollReveal>
				</div>

				<div className="principles-wrap" style={{ display: "flex" }}>
					{PRINCIPLES.map((p, i) => (
						<ScrollReveal key={p.title} staggerIndex={i + 1} className="pc">
							<div
								style={{
									color: "rgba(255,255,255,0.55)",
									marginBottom: 72,
								}}
							>
								{p.icon}
							</div>
							<h3
								style={{
									fontSize: 26,
									fontWeight: 600,
									letterSpacing: "-0.01em",
									marginBottom: 20,
									lineHeight: 1.3,
								}}
							>
								{p.title}
							</h3>
							<p
								style={{
									fontFamily: "'DM Mono',monospace",
									fontSize: 15,
									lineHeight: 1.85,
									color: "rgba(255,255,255,0.55)",
									fontWeight: 300,
								}}
							>
								{p.desc}
							</p>
						</ScrollReveal>
					))}
				</div>
			</section>

			{/* ════ CTA ════ */}
			<section className="cta-section">
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
				<ScrollReveal>
					<SectionLabel text="WORK WITH US" />
				</ScrollReveal>
				<ScrollReveal
					as="h2"
					delay={0.08}
					style={{
						fontSize: "clamp(46px,8vw,112px)",
						fontWeight: 700,
						letterSpacing: "-0.04em",
						lineHeight: 0.95,
						maxWidth: 820,
						marginBottom: 56,
					}}
				>
					Have something
					<br />
					worth{" "}
					<span style={{ color: "rgba(255,255,255,0.25)" }}>building?</span>
				</ScrollReveal>
				<ScrollReveal
					delay={0.16}
					style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
				>
					<SplashHoverButton
						to="/contact"
						variant="outline"
						className="join-btn join-btn--splash"
						style={{ fontSize: 12 }}
					>
						Talk to us
					</SplashHoverButton>
				</ScrollReveal>
			</section>
		</div>
	);
}