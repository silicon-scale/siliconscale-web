# SiliconScale Web — Design & Architecture Audit

**Scope:** Full repository scan (`src/`, config, assets). No code was changed.  
**Date:** 11 July 2026  
**Stack:** Vite + React + React Router + Tailwind + Framer Motion; shadcn-style tokens in `src/index.css` / `tailwind.config.ts`.

---

## 1. Design system consistency

### 1.1 Tokens exist — marketing UI mostly ignores them

Canonical tokens live in:

| Source | Lines | What |
|--------|-------|------|
| `src/index.css` | 12–43 | `:root` colors, `--radius: 0.75rem`, font-weight tokens |
| `src/index.css` | 46–66 | `.dark` overrides |
| `src/index.css` | 69–101 | `@theme inline` Tailwind color/radius bridge |
| `tailwind.config.ts` | 28–70 | Maps CSS vars to Tailwind color/radius utilities |
| `tailwind.config.ts` | 24–27 | `fontFamily.sans` = Open Sans; `fontFamily.bagel` = Bagel Fat One |

**Critical gap:** The actual brand palette used across pages — gold `#c9a96e`, cream `#fff1d6`, page black `#050505` — is **not** defined as tokens. Declared accents (`--accent-blue`, `--accent-emerald`, `--accent-purple` at `src/index.css` 39–41) are almost unused by marketing UI.

### 1.2 Hardcoded colors bypassing tokens

Brand gold / page black appear as literal hex across the product surface:

| Value | Role | Examples (file:lines) |
|-------|------|------------------------|
| `#050505` | Page background | `HeroSection.tsx` 67; `AboutSection.tsx` 41; `Team.tsx` 180; `Connect.tsx` 110; `Testimonials.tsx` 71; `ServicesPage.tsx` 262; `PrivacyPolicy.tsx` 8; `TermsOfService.tsx` 8; `Footer.tsx` 14 |
| `#c9a96e` | Brand gold | `HeroSection.tsx` 153–214; `Navbar.tsx` 79, 93, 155–168; `BrandButton.tsx` 28; `FinalCTA.tsx` (many, ~25 hits); `Highlights.tsx` 77; `HowWeDo.tsx` 52; `NotFound.tsx` 25 |
| `#fff1d6` | Gold gradient mid | `BrandButton.tsx` 28; `FinalCTA.tsx` 217; `NotFound.tsx` 25 |
| `#0b0b0b` | Near-black variant (≠ token `#0a0a0a`) | `FinalCTA.tsx` 138; `ServicesPage.tsx` 45–149 |

**Also bypassed:**

- Canvas gold rgba in `Team.tsx` 78–79: `rgba(201, 169, 110, …)`
- Section-specific accent palettes that disagree with each other:
  - Home Services: `#E8FF47`, `#47C2FF`, `#FF6B47`, `#47FFB4`, `#FF4787` (`Services.tsx` 18–42)
  - Services page: `#b6f56a`, `#d6a6ff`, `#7dd3fc`, `#fbbf24` (`ServicesPage.tsx` 32–149)
  - HowWeDo SVG: `#e8c547`, `#f472b6`, `#a855f7`, `#38bdf8`, etc. (`HowWeDo.tsx` 51–112)
- `BrandButton.tsx` 28 still hardcodes the gold gradient even though it is the “canonical” CTA primitive.
- Unused Vite scaffold colors in orphaned `src/App.css` 14–17, 40 (`#646cffaa`, `#61dafbaa`, `#888`).

### 1.3 Typography drift

**Configured fonts** (`tailwind.config.ts` 24–27; `index.html` loads Bagel + Open Sans): Open Sans, Bagel Fat One.

**Fonts loaded / used ad hoc outside that scale:**

| Font | Where | Notes |
|------|-------|-------|
| Sora | `About.tsx` 194; `ServicesPage.tsx` 266–268; `PrivacyPolicy.tsx` 12–14; `TermsOfService.tsx` 12–14 | Not in Tailwind config |
| DM Mono | About, Connect (`Connect.tsx` 129, 225), Testimonials (`Testimonials.tsx` 103, 198), ServicesPage, legal pages | Not in Tailwind config |
| Syne | `Footer.tsx` 9, 199, 229, 306 | Not in Tailwind config |
| DM Sans | Claimed at `Footer.tsx` 16 | **Broken:** import at L9 loads `OPEN+Sans`, not DM Sans |

Ad-hoc sizes/weights (no shared type scale):

- `Team.tsx` 233–321: clamps `2–2.6rem`, `1.5–1.8rem`, `0.95–1.05rem`; weights 900 / 700 / 300
- `About.tsx` 159–563: DM Mono `11–15px`; display clamps up to `136px`
- `HeroSection.tsx` 140: `clamp(2.15rem, 7.2vw, 4.8rem)`
- `Highlights.tsx` 59–65: `text-[0.65rem]` + title clamp `2.8–4.5rem`
- `Footer.tsx` 200–367: Syne clamps up to `10rem`
- Global `body { font-weight: 600 }` at `src/index.css` 6–8 fights `--font-weight-normal: 400` / `--font-weight-medium: 500` (L34–35)
- Base `h1`–`button` rules at `src/index.css` 409–463 hardcode rem sizes/weights outside Tailwind utilities

### 1.4 Spacing, radius, shadow, object-fit, transitions

**No shared spacing tokens** beyond Tailwind defaults. `--spacing` is referenced in `tailwind.config.ts` 11 (`padding: 'calc(var(--spacing) * 4)'`) but **never defined** in `index.css`.

Section vertical rhythm disagrees:

- Connect / Testimonials / AboutSection: `py-16 sm:py-20 lg:py-24`
- HowWeDo: `py-24 sm:py-28 lg:py-32 xl:py-36`

**Border-radius** (token `--radius: 0.75rem` largely unused by marketing cards):

| Value | Where |
|-------|--------|
| `16px` | `Services.tsx` 166; `Work.tsx` 139 |
| `18px` | `Testimonials.tsx` 169 |
| `20px` / `rounded-[20px]` | `ServicesPage.tsx` 365; `FinalCTA.tsx` 411, 628 |
| `22px` / `26px` | `Connect.tsx` 156, 166 |
| `24px` / `28px` | `ServicesPage.tsx` 367, 352; `Testimonials.tsx` 126 |
| `rounded-3xl` / `rounded-2xl` | `AboutSection.tsx` 41, 84 |

**Box-shadow** reinvented per section:

| Shadow | Where |
|--------|--------|
| `0 18px 60px rgba(0,0,0,0.55)` | `BrandButton.tsx` 28; hover-border-gradient |
| `0 20px 60px rgba(0,0,0,0.55)` | `FinalCTA.tsx` 411, 628 |
| `0 30px 90px rgba(0,0,0,0.7)` | `AboutSection.tsx` 41; Connect |
| `0 30–40px 80–90px` | Testimonials, Work, ServicesPage |
| Utility shadows | `.subtle-shadow` / `.elevated-shadow` / glass at `index.css` 145–178 (mostly unused by live pages) |

**object-fit / object-position:**

| File:line | Value | Issue |
|-----------|-------|--------|
| `Team.tsx` 261 | `object-cover object-top` | Shared for all three founders despite different intrinsic ratios |
| `Work.tsx` 205 | `object-cover` (no position) | Different convention from Team |
| `Footer.tsx` 221 | `object-fit: contain` | Logo — fine, but no shared image primitive |
| `index.css` 586 | `object-position: center center` | Only for `.video-container` at 2560px |

**Transitions:** `0.14s` / `0.18s` / `0.2s` / `0.22s` / `0.25s` / `0.3s` / `0.4–0.5s` / `0.9s` / `duration-1200` scattered across Connect, ServicesPage, Footer, Work, HowWeDo, Navbar, Team, About (`About.tsx` 199 uses `0.9s cubic-bezier(0.22,1,0.36,1)`).

### 1.5 Responsive breakpoints — no single source of truth

| Source | Breakpoints |
|--------|-------------|
| Tailwind utilities (default) | 640 / 768 / 1024 / 1280 / 1536 px |
| `tailwind.config.ts` 12–17 **container only** | 40 / 48 / 64 / 80 / 96 **rem** |
| `useIsMobile.ts` 3 | `MOBILE_BREAKPOINT = 768` |

**One-off `@media` values with no shared constant:**

| Breakpoint | Files |
|------------|-------|
| `480px` | `About.tsx` 313; `Footer.tsx` 298 |
| `600px` | `Footer.tsx` 374 |
| `860px` | `About.tsx` 323 |
| `900px` | `Connect.tsx` 239; `Footer.tsx` 295, 369 |
| `640px` | `Services.tsx` 196; `Connect.tsx` 243; `IntroLoader.tsx` 91 |
| `768px` / `1024px` | Many components + `index.css` 481 |
| `2560px` | `index.css` 584 |

Pages can disagree on where “mobile” / “tablet” starts (Footer 900 vs Connect 900 vs Tailwind `md` 768 vs About 860).

### 1.6 Interactive states — uneven across sibling CTAs

| Control | hover | focus-visible | active | disabled |
|---------|-------|---------------|--------|----------|
| `BrandButton.tsx` 24–25 | yes | yes | — | yes |
| Hero CTAs (`HeroSection.tsx` 244–250) | secondary has hover | both | — | — |
| `NotFound.tsx` 25 | yes | yes | — | — |
| `AboutSection.tsx` 65–68 “Learn more” | yes | **missing** | — | — |
| `Highlights.tsx` 72–77 | yes + whileTap | **missing** | — | — |
| `Navbar.tsx` 74–108, 152–171 | hover | **missing** on links + menu toggle | — | — |
| Services `.cta-btn` (`Services.tsx` 243–247) | yes | **missing** | yes | **missing** |
| HowWeDo `.arrow-btn-how` (`HowWeDo.tsx` 167–172) | yes | **missing** | yes | **missing** |
| Work `.arrow-btn` (`Work.tsx` 132–137) | yes | **missing** | yes | **missing** |
| ServicesPage `.service-cta` (~335–336) | yes | **missing** | yes | **missing** |
| Footer links / social (`Footer.tsx` 260–333) | hover only | **missing** | — | — |
| About `.join-btn` / `.ghost-btn` (`About.tsx` 216–227) | hover | **missing** | — | — |

Global `:focus-visible` at `index.css` 112–115 uses `--ring: #a1a1aa` (light) / `#71717a` (dark) — weak contrast on `#050505` pages compared to Hero’s explicit white rings.

---

## 2. Component architecture

### 2.1 Project shape (current)

```
src/
├── App.tsx                 # router + Home composition
├── main.tsx                # imports index.css only (not App.css)
├── App.css                 # orphaned Vite scaffold
├── index.css               # tokens + global utilities
├── assets/
├── components/             # feature sections AND route pages mixed
│   ├── figma/              # unused ImageWithFallback
│   └── ui/                 # ~60 files; most shadcn unused
├── context/RevealContext.tsx
├── hooks/
├── lib/utils.ts
├── pages/NotFound.tsx      # only page here; NOT routed
└── utils/
```

Routes (`App.tsx` 82–91): `/`, `/about`, `/work`, `/team`, `/contact`, `/privacy`, `/terms`, `/services`. **No catch-all / 404 route.**

### 2.2 Duplicate / near-identical components

**Section eyebrow + CTA pattern** (copy-pasted, not shared):

- `AboutSection.tsx` 47–72 — pill eyebrow + white filled CTA
- `Highlights.tsx` 59–81 — same pill + bordered/gold CTA
- `ServicesPage.tsx` ~502 — white CTA again
- `NotFound.tsx` 16–28 — eyebrow + gold gradient CTA (duplicates `BrandButton` classes)

**Gold gradient primary button — 3 implementations:**

1. `BrandButton.tsx` 21–28 (canonical)
2. `NotFound.tsx` 23–28 (same gradient classes, does not import BrandButton)
3. `Navbar.tsx` 91–93, 166–168 (parallel gold hover gradient)

**Legal page shell — near byte-level duplicate:**

- `PrivacyPolicy.tsx` 5–63 and `TermsOfService.tsx` 5–63 share the same `.legal-shell` `<style>`, Google Fonts `@import`, and header layout. Only body copy differs.

**Image helpers — near-identical:**

- `OptimizedImage.tsx` 3–57 (used by Team, Work)
- `figma/ImageWithFallback.tsx` 3–42 (unused) — same `useState` src + Unsplash fallback + `onError` pattern

**Reveal wrappers — two APIs, one unused:**

- `ui/Reveal.tsx` 12–29 (used by FinalCTA)
- `ui/RevealOnScroll.tsx` 14–45 (**zero imports**)

**Services content duplicated in two taxonomies:**

- Home accordion: `Services.tsx` 13–44 (`number`, `title`, `description`, `accent`)
- Full page: `ServicesPage.tsx` 11–21 + `SERVICE_CARDS` 23+ (`ServiceCard` with chips/icons)  
  Overlapping offerings (Branding / Design / Development / AI) defined twice with different shapes and accent colors.

**Social / contact links duplicated:**

- `Footer.tsx` 456–479
- `Connect.tsx` 18–59
- Legal pages (contact mentions)

**Motion easing triplicated:** `[0.22, 1, 0.36, 1]` in `Navbar.tsx` 12, `HeroSection.tsx` 14, `FinalCTA.tsx` 48.

**Floating form controls** inside `FinalCTA.tsx` 63–167: `FloatingInput` / `FloatingSelect` share border/focus/label class strings; textarea ~562–569 repeats them again.

**Background atmosphere** (gold radial blobs) repeated in `Team.tsx` 184–198, `ServicesPage.tsx` ~390, `FinalCTA.tsx` 339–341.

**Team founder card** is fully inline (`Team.tsx` 243–332) — no extracted `FounderCard` despite three identical structures.

### 2.3 Prop drilling / repeated data shapes

Not deep prop drilling — App composes pages with almost no props. The issue is **scattered inline data + local types**, no shared domain module (`src/types/` or `src/data/` does not exist).

| Shape | Defined at | Notes |
|-------|------------|-------|
| Founders | `Team.tsx` 146–174 | No exported type; `tags` / `initials` never rendered |
| Projects | `Work.tsx` 21–87 | Inline only |
| Home services | `Services.tsx` 13–44 | Disagrees with ServicesPage |
| Service cards | `ServicesPage.tsx` 11–21, 23+ | Separate `ServiceCard` type |
| Process steps | `HowWeDo.tsx` 8–41 | Local `CARDS` |
| Stats | `Highlights.tsx` 8–33 | Local `STATS` |
| Principles | `About.tsx` 7–61 | Local `PRINCIPLES` |
| Testimonials | `Testimonials.tsx` 5–36 | Local |
| Connect cards | `Connect.tsx` 6–59 | Local `ConnectCard` |
| FinalCTA form / trust | `FinalCTA.tsx` 22–42, 55–60 | Local |

`About.tsx` 64–83 defines a custom `useInView` instead of reusing `sharedVisibilityObserver`, Framer `useInView`, or `Reveal`.

### 2.4 Dead code

**Unused feature components (never imported by app):**

| File | Evidence |
|------|----------|
| `src/components/GlassCard.tsx` | Only self-references |
| `src/components/AnimationShowcase.tsx` | Only self (+ unused `Card` import) |
| `src/components/figma/ImageWithFallback.tsx` | Only self |
| `src/components/ui/RevealOnScroll.tsx` | Only self |
| `src/pages/NotFound.tsx` | No `<Route>` in `App.tsx` 82–91 |
| `src/hooks/useMousePosition.ts` | Defined 13–46; no consumers |

**Imported but unused:**

```14:14:src/App.tsx
import { PageTransitionFallback } from "./components/PageTransitionFallback"
```

Never referenced in JSX. Component: `PageTransitionFallback.tsx` 4–16.

**Unused shadcn/ui surface:** ~50+ primitives under `src/components/ui/` (accordion, alert, avatar, badge, button, calendar, card, carousel, chart, dialog, form, input, select, sidebar, toast stack, etc.) are not imported by any live marketing component. Product-used UI is a small set: `BrandButton`, `MagneticButton`, `Reveal`, `SectionShell`, `canvas-text`, `hover-border-gradient`, `lens`, `scales`, `vortex`, `background-ripple-effect`.

**Orphaned CSS:**

- `src/App.css` — never imported (`main.tsx` 1–3 only loads `index.css`)
- `index.css` utilities such as `.glass-effect`, `.glass-navbar`, `.video-container`, `.font-bagel`, `.float-gentle`, `.drift-*`, `.pulse-glow`, `.photo-sway-*`, `.subtle-shadow` — no TSX consumers (or only dead AnimationShowcase / GlassCard)
- Team class names `ss-anim-1`, `ss-anim-f1` / `ss-anim-f2`, `ss-founder-card`, `ss-photo-scale`, `ss-photo-overlay`, `ss-bio` (`Team.tsx` 231–288) — **no CSS definitions found** in the repo (no-op class names)

**Dead data / latent UI inside live files:**

- `Team.tsx` 149–171: `tags`, `initials` unused in render
- `Team.tsx` 268–284: photo overlay deliberately `opacity: 0` (“kept but hidden”)
- `Team.tsx` 248: `i === 1 ? 'ss-anim-f2' : 'ss-anim-f2'` is redundant (both branches identical)
- Unreferenced assets: `SiliconScaleLogoOnly.png`; `public/placeholder.svg` (no imports found)

### 2.5 File / folder convention inconsistencies

| Issue | Examples |
|-------|----------|
| Pages vs sections mixed | Route pages (`About`, `Work`, `Team`, `Contact`, `ServicesPage`, legal) live in `src/components/` next to home sections |
| `src/pages/` nearly empty | Only unrouted `NotFound.tsx` |
| Export style | Named: `Navbar`, `HeroSection`, `Services`; Default: `Team`, `About`, `Work`, `FinalCTA` |
| File vs export name | `About.tsx` exports `AboutPage` (L173) but App imports as `About` |
| Import path | `Services` imported with `.tsx` extension (`App.tsx` 9); others without |
| Style co-location | Heavy inline `<style>` in Work, Services, Testimonials, Privacy, Terms, Connect, Footer, HowWeDo — not CSS modules; mixed with Tailwind + global CSS |
| Naming | Feature PascalCase; ui mostly kebab-case; hooks `useIsMobile` vs `use-toast` |
| Buttons / cards | shadcn `Button`/`Card` unused; ad-hoc cards everywhere (Team, HowWeDo, ServicesPage, Connect, Testimonials) |

---

## 3. Bugs

### 3.1 Image framing / aspect-ratio (Team)

| Severity | Location | Issue |
|----------|----------|--------|
| High | Assets + `Team.tsx` 253–261 | Intrinsic ratios diverge under a shared crop: **tillu.webp 1008×957 (~1.05:1)**, **jhaneswar.webp 772×908 (~0.85:1)**, **abdul.webp 944×1114 (~0.85:1)**. Container is `aspect-[4/5]` with `object-cover object-top`. Pavan’s near-square source loses ~24% width; Mani/Abdul lose ~6%. Faces will not frame consistently. |
| Medium | `Team.tsx` 256–261 + `OptimizedImage.tsx` 53 | Parent `aspect-[4/5]` plus img inline `aspectRatio: width/height` (`800/1000`) can fight layout; crop depends on cascade. |
| Medium | Uniform `object-top` | Better for tall portraits; worse for near-square `tillu` if the face isn’t near the top edge. Prefer per-founder `objectPosition` or re-crop assets to matched 4:5. |
| Low | `tillu.webp` re-encode (git) | Binary shrink may show quality loss next to siblings. |
| Low | `OptimizedImage.tsx` 19–20, 37–38 | Error fallback is a generic Unsplash office photo — wrong for team portraits. |
| Low | `Team.tsx` 282 | Overlay does `f.name.split(' ')[1]` — for **"Abdul"** second token is `undefined` (overlay is `opacity: 0`, so latent). |

`alt={f.name}` at `Team.tsx` 258 is fine.

### 3.2 Accessibility

| Severity | Location | Issue |
|----------|----------|--------|
| High | `Navbar.tsx` 100–108 | Mobile menu toggle has **no `aria-label` / `aria-expanded` / `aria-controls`**. Icon-only control. |
| High | `Navbar.tsx` 116–178 | Overlay menu: no focus trap, no Escape handling; backdrop is a clickable `div` (not a button). |
| Medium | `Navbar.tsx` 89–98, 164–172 | **`<Link>` wrapping `<motion.button>`** — nested interactive elements (invalid HTML / confusing for AT). |
| Medium | `Team.tsx` 305–315 | Founder names are `<div>`s, not `h2`/`h3` under page `h1` (230–240). Flat heading tree. |
| Medium | `Team.tsx` 178–180 | `<section>` lacks `id="team"` / `aria-label="Team section"`, but `index.css` 551–575 targets those selectors — dead a11y/CSS hooks. |
| Medium | `Team.tsx` 217–222 | Decorative `<canvas>` missing `aria-hidden` (pixel overlay at 204 has it). |
| Medium | `Work.tsx` 158 vs 176–181 | `aria-labelledby="work-heading"` but **no element with `id="work-heading"`**. |
| Medium | `index.css` 112–115 + `--ring` | Global focus ring is muted gray on near-black — weak keyboard visibility vs Hero white rings. |
| Medium | Multiple (`Highlights.tsx` 59; `HowWeDo.tsx` 188; legal `text-white/40`; `FinalCTA.tsx` 99) | `text-white/40`–`/45` on `#050505` is roughly **2.5–3.5:1** — fails WCAG AA for normal text. |
| Low | `App.tsx` 70 | No skip link to `#main-content`. |
| Low | Marketing CTAs listed in §1.6 | Missing `focus-visible` on many interactive siblings of Hero/BrandButton. |

Positive: `App.tsx` has `<main id="main-content">`; Navbar uses `<nav>`; Footer uses `<footer>`; many sections use `aria-labelledby`.

### 3.3 Broken links / routing / data mismatches

| Severity | Location | Issue |
|----------|----------|--------|
| High | `Footer.tsx` 505–508 vs `ServicesPage.tsx` 23–124, 180, 418 | Footer hashes `#web-development`, `#ai-integration`, `#backend-systems`, `#product-design` do **not** match card ids `branding`, `design`, `development`, `ai`. All four deep links are broken. |
| High | `Connect.tsx` 44–50 | Facebook card `href` and `ariaLabel` both point at / say **Instagram**. |
| High | `App.tsx` 82–91 | **`NotFound` is never routed**; unknown paths render blank `<main>` under Navbar/Footer. |
| Medium | `Work.tsx` 66 | Portfolio link `https://axels-beta.vercel.app/` looks like a **beta/staging** URL. |
| Medium | `Footer.tsx` 9 vs 16 | Font import loads `OPEN+Sans` but CSS sets `font-family: 'DM Sans'` — Footer body text may fall back to system sans. |
| Low | `abdul.webp` | Untracked in git but imported (`Team.tsx` 8); local build works; clone/CI without the file will fail. |
| Low | `pnpm-workspace.yaml` | Untracked; only `allowBuilds` for SWC/esbuild — review intent for a non-monorepo app. |

### 3.4 Responsive / layout risks

| Severity | Location | Issue |
|----------|----------|--------|
| Medium | `Team.tsx` 243–249 | At **md (768–1023)** the 3rd card uses `md:col-span-2 md:max-w-[calc(50%-1.5rem)] md:justify-self-center` — centered half-width under a 2-col grid; can look orphaned vs equal columns at lg+. |
| Medium | `Team.tsx` 186–193 | Fixed decorative blobs `w-[900px]` / `w-[700px]` with section `overflow-hidden` — clipped, but heavy paint on 375px. |
| Medium | `index.css` 578–580 | `[class*="absolute"] { max-width: 100vw; }` — `100vw` often causes **horizontal scrollbar** when a vertical scrollbar is present. |
| Medium | `useIsMobile.ts` 6–18 | Initial state is `undefined` → `!!undefined === false`, so **desktop path runs on first paint** (Team canvas may start on phones, then stop after effect). |
| Low | `Team.tsx` 180 | `min-h-screen` + three tall 4:5 cards + `pt-20` makes mobile scroll very long (UX). |
| Low | Breakpoint one-offs (§1.5) | Layouts can disagree between Footer 900px and Tailwind `md` 768px at tablet widths. |

**Breakpoint spot-check notes (code review, not live browser):**

- **375px:** Team single-column OK; Navbar mobile menu a11y broken; Footer 480/600 media kick in; Connect 640 kicks in.
- **768px:** Team 2-col + orphaned 3rd card; `useIsMobile` flips; several `@media (max-width: 768px)` fire.
- **1024px:** Team 3-col; Services/ServicesPage/About 1024 media; Footer 1024 media.
- **1440px:** Mostly max-width containers; no major overflow rules unique to this width.

### 3.5 Console / lint / list keys

- Scripts (`package.json`): `dev`, `build`, `build:dev`, `lint`, `preview` only — no `typecheck` / `test`.
- ESLint: `@typescript-eslint/no-unused-vars` is **off** — unused imports (`PageTransitionFallback`) and dead Team fields won’t fail lint.
- `Services.tsx` ~329, 367: list `key={index}` (static list, but a smell).
- `FinalCTA.tsx` ~325: `console.error` on EmailJS failure in DEV.
- `NotFound.tsx` 8–9: DEV `console.error` for 404 (component unused in router).

---

## 4. Priority ranking

Every finding below is tagged **High / Medium / Low** by user-facing visibility. Batchable groups vs individually reviewed work are called out.

### High — user-facing, fix soon

| ID | Finding | Safe to batch? |
|----|---------|----------------|
| H1 | Team photo framing: `tillu.webp` aspect vs shared `aspect-[4/5]` + `object-top` (`Team.tsx` 253–261; assets) | **Individual** — needs visual review per photo; may combine asset crop + optional per-card `objectPosition` |
| H2 | Footer service deep links broken (`Footer.tsx` 505–508 vs ServicesPage ids) | **Batch with H3** as “link/href audit” |
| H3 | Connect Facebook → Instagram (`Connect.tsx` 44–50) | **Batch with H2** |
| H4 | No 404 route (`App.tsx` 82–91; unused `NotFound.tsx`) | **Individual** — router change; wire existing NotFound |
| H5 | Mobile nav a11y: missing ARIA, focus trap, Escape (`Navbar.tsx` 100–178) | **Individual** — interaction behavior review |
| H6 | Brand tokens missing (`#c9a96e`, `#050505`, `#fff1d6` not in `:root`) while hardcoded everywhere | **Batch** — “tokenize brand colors” across all files that hardcode them |
| H7 | Nested `<Link>` + `<button>` in Navbar CTAs (`Navbar.tsx` 89–98, 164–172) | **Batch with H5** as Navbar a11y pass |

### Medium — visible polish / maintainability

| ID | Finding | Safe to batch? |
|----|---------|----------------|
| M1 | Typography drift (Sora / DM Mono / Syne / broken DM Sans in Footer) | **Batch** font loading into `index.html` / Tailwind; **individual** for Footer Syne display choices |
| M2 | Breakpoint one-offs (480 / 600 / 860 / 900 / 2560) | **Batch** onto shared constants / Tailwind screens after deciding scale |
| M3 | CTA `focus-visible` gaps vs Hero/BrandButton | **Batch** “interactive state pass” on AboutSection, Highlights, Navbar, Footer, Services, HowWeDo, Work, ServicesPage |
| M4 | Radius / shadow / transition inconsistency across cards | **Batch** after defining 2–3 elevation tokens |
| M5 | Services home vs ServicesPage duplicate content/types | **Individual** — content taxonomy decision first |
| M6 | Legal page shell duplication (Privacy / Terms) | **Batch** extract `LegalShell` |
| M7 | Section eyebrow + CTA duplication | **Batch** extract `SectionEyebrow` + reuse `BrandButton` / secondary CTA |
| M8 | Work `aria-labelledby` missing `id` (`Work.tsx` 158) | **Batch with M3** a11y pass |
| M9 | Team missing `id`/`aria-label` vs CSS hooks (`Team.tsx` 178; `index.css` 551–575) | **Batch with M8** |
| M10 | Contrast: `text-white/40`–`/45` on black | **Batch** contrast token pass (raise muted text opacity) |
| M11 | `useIsMobile` first-paint flash (`useIsMobile.ts` 6–18) | **Individual** — small hook fix, verify Team canvas |
| M12 | `100vw` absolute max-width scrollbar risk (`index.css` 578–580) | **Individual** — replace with `100%` and retest |
| M13 | Team md orphaned third card layout | **Individual** — design decision |
| M14 | OptimizedImage aspectRatio fight + Unsplash fallback | **Batch with H1** image pipeline cleanup |
| M15 | Pages mixed into `components/` + inconsistent exports | **Individual** — structural move; do after dead-code purge |
| M16 | Work portfolio staging URL | **Individual** — confirm production URL with owners |

### Low — cleanup / latent

| ID | Finding | Safe to batch? |
|----|---------|----------------|
| L1 | Dead components: GlassCard, AnimationShowcase, ImageWithFallback, RevealOnScroll, useMousePosition, PageTransitionFallback import | **Batch** delete unused |
| L2 | Unused shadcn `ui/*` (~50 files) + toast stack | **Batch** quarantine or delete; confirm no planned use |
| L3 | Orphaned `App.css` + unused `index.css` animation utilities | **Batch with L1–L2** |
| L4 | Team dead fields (`tags`, `initials`), hidden overlay, redundant class branch | **Batch with H1** Team cleanup |
| L5 | No-op `ss-*` class names on Team | **Batch with L4** |
| L6 | Motion easing constant triplication | **Batch** extract `REVEAL_EASE` |
| L7 | Floating form style duplication in FinalCTA | **Individual** (touches form UX) |
| L8 | `key={index}` in Services lists | **Batch** trivial |
| L9 | Untracked `abdul.webp` / `pnpm-workspace.yaml` | **Individual** — commit intent review |
| L10 | Skip link to `#main-content` | **Batch with M3** a11y |
| L11 | `--spacing` undefined in Tailwind container padding | **Batch with M2** token foundation |
| L12 | Abdul overlay `split(' ')[1]` undefined | **Batch with L4** (or delete dead overlay) |

### Suggested fix batches (when you approve work)

1. **Links & routing (H2, H3, H4)** — low risk, high impact, no visual redesign.
2. **Brand tokens + hardcoded color sweep (H6)** — mechanical find/replace after adding CSS vars; re-check gold gradients.
3. **Navbar a11y (H5, H7)** — one focused PR; needs keyboard testing.
4. **Team images + dead Team markup (H1, M14, L4, L5, L12)** — visual QA at 375 / 768 / 1024.
5. **Interactive states + contrast + Work/Team aria (M3, M8, M9, M10, L10)** — shared focus ring token.
6. **Extract shared shells (M6, M7) + Services taxonomy (M5)** — needs content/design decisions; do separately.
7. **Dead code purge (L1–L3)** — safe after grep confirmation; large diff but low runtime risk.
8. **Breakpoint / type / elevation tokens (M1, M2, M4, L11)** — foundation work; do before large visual refactors.

---

*End of audit. Awaiting review before any fixes.*
