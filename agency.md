# SiliconScale Agency Design System

Single source of truth extracted from the live codebase (`src/`, `tailwind.config.ts`, `package.json`). Values below are quoted from code — not invented.

---

## Agency Overview

| Field | Value |
|---|---|
| **Name** | SiliconScale (also “SiliconScale Tech” in `public/llms.txt`) |
| **Site** | `https://siliconscale.dev` |
| **One-liner** | Software development agency specializing in AI solutions, custom web applications, Shopify development, and scalable backend systems for startups and growing businesses. (`public/llms.txt`) |
| **Target client / industry** | Founders and growing businesses — fashion-tech, e-commerce, research platforms, SaaS/MVP/web platforms (hero, portfolio, contact budgets in INR) |
| **Team posture** | Remote India-based team; direct founder↔builder relationship (`public/llms.txt`, About copy) |

**Personality the site projects:** confident, technical, founder-direct, anti-agency-fluff. Dark near-black canvas (`#050505`), steel-blue brand accent (tokenized as “gold”), uppercase tracked CTAs, Bagel Fat One display numerals, and copy that emphasizes shipping, revenue, and honesty over awards.

**Unsure / inferred (flagged):**
- Brand tokens are named `--brand-gold` / `--brand-cream`, but both resolve to the same steel blue `#8fabd4` — the “gold/cream” naming is legacy; the visual accent is cool blue, not metallic gold.
- Personality leans serious/confident rather than playful, except for intentional play surfaces (tool physics playground, rotating FinalCTA words, vortex/spotlight ambient).

---

## Typography

### Font loading

Self-hosted via `@fontsource/*` in `src/styles/fonts.css` (imported from `src/main.tsx`). No Google Fonts `<link>` tags.

| Family | Package | Weights imported | Role |
|---|---|---|---|
| **Open Sans** | `@fontsource/open-sans` | 400, 600, 700 (+ italics; latin + latin-ext; symbols-400 for `←`) | Default body / `font-sans` |
| **Bagel Fat One** | `@fontsource/bagel-fat-one` | 400 only (latin + latin-ext) | Display numerals / blog titles |
| **Sora** | `@fontsource/sora` | 400, 600, 700, 800 | Marketing headings, Work page, Footer, mobile nav, legal shell |
| **DM Mono** | `@fontsource/dm-mono` | 300, 400 | Labels, meta, About mission body (300), eyebrows |

### Tailwind font families (`tailwind.config.ts`)

```ts
fontFamily: {
  sans: ["Open Sans", "sans-serif"],
  bagel: ["Bagel Fat One", "cursive"],
  sora: ["Sora", "system-ui", "sans-serif"],
  syne: ["Sora", "system-ui", "sans-serif"], // alias → Sora (no Syne package)
  "dm-mono": ["DM Mono", "ui-monospace", "monospace"],
}
```

Also: `.font-bagel` utility and many inline `font-family: 'Sora'…` / `'DM Mono'…` / `'Open Sans'…` in component `<style>` blocks.

### Display / heading conventions

- **Primary marketing headings:** Sora or default stack with heavy weights (`font-semibold`–`font-black` / 700–900), tight tracking (`tracking-tight`, `letter-spacing: -0.03em` to `-0.05em`).
- **Hero H1:** `font-black leading-[1.02] tracking-tight`, size `clamp(2.15rem, 7.2vw, 4.8rem)`.
- **Highlights H2:** `font-semibold tracking-tight`, `clamp(2.8rem, 6vw, 4.5rem)`.
- **About home H2:** `font-semibold tracking-tight`, `clamp(2.2rem, 5vw, 3.8rem)`, `lineHeight: 1.05`.
- **Services home H2:** `fontWeight: 900`, `letterSpacing: '-0.04em'`, `clamp(2.4rem, 5vw, 4.2rem)`.
- **Work page H1:** Sora, `font-weight: 900`, `letter-spacing: -0.03em`, `clamp(2.4rem, 5vw, 3.6rem)`.
- **About mission H1:** `clamp(54px, 9vw, 136px)`, weight 700, `letterSpacing: '-0.035em'`, translucent white layers.
- **Bagel Fat One:** Highlights / case-study result numerals (`font-bagel`, `clamp(3.5rem, 8vw, 6rem)`); admin markdown preview headings.

### Body

- Default: Open Sans, `--font-weight-normal: 400`, `--font-weight-medium: 500`.
- Base CSS (unclassed elements in `index.css`):
  - `p`: `1.125rem` (18px), weight normal, `line-height: 1.6`, `letter-spacing: 0.01em`
  - `label`: `1rem`, weight 500, `line-height: 1.5`
  - `button`: `1rem`, weight 600, `line-height: 1.5`
- Marketing body often overrides to `text-sm` / `sm:text-base` with `text-white/55`–`text-white/75`.

### Mono / utility

- **DM Mono** for section eyebrows (`SectionEyebrow` `pillMono` / `plain`), Testimonials pill (`font-size: 10px`), About mission paragraph (`fontSize: 13`, weight 300), Navbar mobile meta, admin code, PerfDebug overlay (`font-mono text-[10px]`).

### Type scale (exact values from code)

**Base element scale** (`src/index.css` `@layer base`):

| Element | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|
| `h1` | `2.25rem` (36px) | 900 | 1.1 | `-0.05em` |
| `h2` | `1.875rem` (30px) | 800 | 1.2 | `-0.04em` |
| `h3` | `1.5rem` (24px) | 700 | 1.3 | `-0.03em` |
| `h4` | `1.25rem` (20px) | 600 | 1.4 | `-0.02em` |
| `p` | `1.125rem` (18px) | 400 | 1.6 | `0.01em` |
| `label` / `button` / `input` | `1rem` (16px) | 500 / 600 / 400 | 1.5 | — |

**Root:** `--font-size: 16px` on `html`.

**Common marketing clamps / literals:**

| Use | Value |
|---|---|
| Hero H1 | `clamp(2.15rem, 7.2vw, 4.8rem)` |
| Highlights H2 | `clamp(2.8rem, 6vw, 4.5rem)` |
| Highlights numerals | `clamp(3.5rem, 8vw, 6rem)` |
| About home H2 | `clamp(2.2rem, 5vw, 3.8rem)` |
| Services home H2 | `clamp(2.4rem, 5vw, 4.2rem)` |
| FinalCTA heading | `clamp(1.75rem, 4vw, 3rem)` |
| Work H1 | `clamp(2.4rem, 5vw, 3.6rem)` |
| Work H2 (subsection) | `clamp(1.75rem, 3.5vw, 2.35rem)` |
| Footer brand wordmark | `clamp(1.35rem, 7.5vw, 2.75rem)` |
| IntroLoader title | `clamp(1.75rem, 0.4rem + 8.2vw, 6.75rem)` |
| Eyebrow pill | `text-[0.65rem]` / `text-[0.72rem]` |
| CTA labels | `text-sm` (0.875rem) with `uppercase` + `tracking-[0.18em]`–`tracking-[0.2em]` |
| Legal body | `0.94rem`, `line-height: 1.7` |

**Tracking conventions:**
- CTAs / nav links: `tracking-[0.18em]`–`tracking-[0.25em]`, uppercase
- Eyebrows: `tracking-[0.18em]`–`tracking-[0.26em]`, uppercase
- Headlines: `tracking-tight` or `-0.03em` to `-0.05em`
- Hero eyebrow: `tracking-[0.12em]` / `sm:tracking-[0.14em]`

---

## Color Palette

### Primary brand accent

**`--brand-gold` / `--brand-cream` / `brand` DEFAULT = `#8fabd4`** (`rgb(143, 171, 212)`).

Used for: accent text (`text-brand-gold`), gradients (`from-brand-gold via-brand-cream to-brand-gold`), borders/rings (`border-brand-gold/30`, `focus:ring-brand-gold/25`), glow orbs, hero canvas “Systems”/“Grow” emphasis, BrandButton fill, FinalCTA trust icons.

> Note: `--brand-gold` and `--brand-cream` are currently **identical**. Cream is not a separate cream hue.

### Brand & marketing tokens (`:root` in `src/index.css`)

| Token / name | Hex / value | Where used |
|---|---|---|
| `--brand-gold` | `#8fabd4` | **Primary accent** — CTAs, highlights, links, glows |
| `--brand-cream` | `#8fabd4` | Alias of gold (gradients, skip-link bg) |
| `--brand-black` / `page` | `#050505` | Marketing page canvas (`bg-page`) |
| `--brand-ink` / `ink` | `#0a0a0a` | Near-black ink; dark theme `--background`; ServicesPage shells |
| `--text-subtle` | `#8a8a8a` | AA-safe muted labels on page black (~5.9:1) |
| `--text-muted` | `#a3a3a3` | Mid hierarchy (~8.1:1) |
| `--text-secondary` | `#c4c4c4` | Stronger secondary (~11.7:1) |
| `--focus-ring` / `--ring` | `rgba(255, 255, 255, 0.7)` | Keyboard focus on dark surfaces |
| White overlays | `white/5`–`white/75`, etc. | Borders, cards, body text on dark |
| Work card surface | `#1c1c1c` | `WorkProjectCard` / SplashHoverButton default splash |
| Form card | `#0a0a0c` → `#141418` gradient | FinalCTA frosted form |
| Navbar scrolled | `#0a0a0c` @ 78% | Frosted nav bar |
| Mobile menu | `#0a0a0a` | Full-screen nav |
| Browser chrome dots | `#ff5f57`, `#febc2e`, `#28c840` | Work mockup window controls |
| Work light media pad | `#f5f5f3` | Screenshot containment light panel |

### Semantic / shadcn light theme (`:root`)

| Token | Hex | Role |
|---|---|---|
| `--background` | `#ffffff` | App shell / light surfaces |
| `--foreground` | `var(--brand-ink)` (`#0a0a0a`) | Default text |
| `--card` | `#fafafa` | Cards |
| `--popover` | `#ffffff` | Popovers |
| `--primary` | `var(--brand-ink)` | Primary |
| `--primary-foreground` | `#ffffff` | On primary |
| `--secondary` / `--muted` / `--accent` | `#f4f4f5` | Secondary fills |
| `--muted-foreground` | `#71717a` | Muted text |
| `--destructive` | `#ef4444` | Errors / destructive |
| `--border` | `#e4e4e7` | Borders |
| `--input` | `#f4f4f5` | Inputs |
| `--radius` | `0.75rem` (12px) | Base radius |

### Dark theme (`.dark`)

| Token | Hex |
|---|---|
| `--background` | `var(--brand-ink)` `#0a0a0a` |
| `--foreground` / `--primary` | `#fafafa` |
| `--card` / `--popover` / `--secondary` / `--muted` / `--accent` / `--input` | `#1a1a1a` |
| `--muted-foreground` | `#a1a1aa` |
| `--border` | `#27272a` |

### Named accent utilities (rarely used on marketing)

| Token | Hex | Intended use |
|---|---|---|
| `--accent-blue` | `#2563eb` | Chart / accent utility |
| `--accent-emerald` | `#059669` | Chart / accent utility |
| `--accent-purple` | `#7c3aed` | Chart / accent utility |

### Per-section / decorative accents (not brand tokens)

**Home Services row accents** (`Services.tsx`): `#E8FF47`, `#47C2FF`, `#FF6B47`, `#47FFB4`, `#FF4787`, `#A78BFA`, `#666666` (locked).

**Services page card accents** (`ServicesPage.tsx`): `#b6f56a`, `#7dd3fc`, `#fbbf24`, `#d6a6ff`, `#fb7185`, `#67e8f9`, `#a3a3a3`.

**Navbar mobile CTA** (`Navbar.tsx`): `#47C2FF` / hover `#5eccff`.

**About light-beam SVG stops:** `#c8dcff`, `#7aabee`, `#daeaff`, `#ffffff`.

**HowWeDo step gradients:** gold `#e8c547`→brand-gold; pink `#f472b6`→`#a855f7`→`#7c3aed`; blue `#38bdf8`→`#2563eb`; emerald family in emerald step.

**Hero grid lines:** `rgba(148,163,184,0.15)` / `0.12` (slate).

**Elevation shadows:**
- sm: `0 8px 32px rgba(0, 0, 0, 0.3)`
- md: `0 18px 60px rgba(0, 0, 0, 0.55)` (BrandButton)
- lg: `0 30px 90px rgba(0, 0, 0, 0.7)` (About ScalesContainer)

---

## Layout & Components

### Spacing system

- Base unit: `--spacing: 0.25rem` (4px).
- Container padding (Tailwind): `calc(var(--spacing) * 4)` → `1rem` / 16px.
- Section vertical rhythm (most marketing sections + `SectionShell`): `py-16 sm:py-20 lg:py-24`.
- `SectionShell` inner: `max-w-6xl` + `px-6 sm:px-10 lg:px-16`.
- Common section inners without shell: `max-w-4xl` (hero), `max-w-5xl` (Highlights), `max-w-6xl` (About home / FinalCTA), `max-w-7xl` (Team), Work shell `max-width: 1120px`.
- Grid gaps: frequently `gap-4`, `gap-8`, `gap-10`, `sm:gap-x-0` with hairline dividers; Services rows `gap: 0 32px`, `padding: 28px 0`.

### Breakpoints (canonical)

From `src/lib/breakpoints.ts`, `index.css`, and `tailwind.config.ts`:

| Name | Value |
|---|---|
| `xs` | 480px |
| `sm` | 640px |
| `md` | 768px |
| `tablet` | 900px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |
| `ultrawide` | 2560px |

`MOBILE_BREAKPOINT = 768` (`md`). Mobile overflow rules kick in at `max-width: 768px`.

### Radii

| Token / class | Value | Use |
|---|---|---|
| `--radius` | `0.75rem` (12px) | shadcn `rounded-lg` |
| `rounded-md` | `calc(var(--radius) - 2px)` = 10px | |
| `rounded-sm` | `calc(var(--radius) - 4px)` = 8px | |
| `.rounded-button` | **8px** | All marketing / UI buttons sitewide |
| `--elevation-sm-radius` | `1rem` (16px) | Compact cards |
| `--elevation-md-radius` | `1.25rem` (20px) | Default cards / CTAs |
| `--elevation-lg-radius` | `1.75rem` (28px) | Section panels |
| Testimonials cards | `18px` | `.ss-test-card` |
| Work project cards | `18px` | `.work-card-link` |
| About feature chips | `rounded-2xl` | |
| About Scales shell | `rounded-3xl` | |
| Section eyebrows | `rounded-full` | Pills |

### Cards / panels

| Pattern | Spec |
|---|---|
| About home feature cards | `rounded-2xl border border-white/12 bg-black/55 p-5 backdrop-blur-md` |
| About Scales panel | `rounded-3xl border border-white/10 bg-page shadow-[0_30px_90px_rgba(0,0,0,0.7)] ring-1 ring-white/5` |
| FinalCTA form | `border border-white/[0.08] bg-gradient-to-br from-[#0a0a0c]/95 to-[#141418]/92` |
| Inputs | `rounded-xl border border-white/10 bg-white/[0.04] … focus:border-brand-gold/60 focus:ring-brand-gold/25` |
| Testimonials | `border-radius: 18px; background: rgba(255,255,255,0.04)` |
| Work cards | `#1c1c1c`, `border-radius: 18px`; mobile also `border: 1px solid rgba(255,255,255,0.07)` |
| Services list | Full-bleed rows, `border-bottom: 1px solid rgba(255,255,255,0.08)`, left accent bar 2px |

### Button styles

1. **`SplashHoverButton`** (primary marketing CTA on hero / About / HowWeDo)
   - `rounded-button`, white filled (`variant="filled"`) or outline
   - Cursor-origin `clip-path` splash, duration `0.5s`, ease `[0, 0, 0.2, 1]`
   - Label: typically `px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em]`
   - Default splash fill `#1c1c1c` (filled) or `#ffffff` (outline)

2. **`BrandButton`** (FinalCTA submit / gold primary)
   - `rounded-button font-extrabold uppercase tracking-[0.18em]`
   - `border border-white/10 bg-gradient-to-r from-brand-gold via-brand-cream to-brand-gold text-black shadow-[0_18px_60px_rgba(0,0,0,0.55)]`
   - Sizes: `md` = `px-5 py-3 text-sm`; `lg` = `px-6 py-3.5 text-sm`
   - Hover: `-translate-y-[1px]`

3. **`SecondaryCta`**
   - `solid`: white fill, `tracking-[0.2em]`
   - `outline`: `border-white/20 bg-white/5` → gold gradient on hover
   - `textLink`: compact section header link + rotating arrow (`SECTION_ARROW_ICON_CLASS`, 220ms)

4. **`MagneticButton`** (hero “See Our Work”)
   - Outline: `border border-white/40 … tracking-[0.2em]`
   - Magnetic spring: `stiffness: 150, damping: 18, mass: 0.4`, max offset ±6px

5. **Navbar CTA**
   - `border border-white/20 … tracking-[0.18em] lg:tracking-[0.25em]` → gold gradient hover

**Focus ring (shared):** `FOCUS_RING` = `focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black`.

### Signature UI patterns (reuse)

- **Hero:** full-bleed `bg-page`, slate grid (`80px`), soft radial “glow dots”, `SpotlightBeams`, gold hairline + eyebrow, `CanvasText` animated fill on accent words (desktop), dual CTAs.
- **Section eyebrow pills:** `SectionEyebrow` (`pill` / `pillMono` / `plain`).
- **Hairline rules + numbered lists:** Highlights divider grid; Services numbered rows with accent bars + marquee ticker.
- **Browser mockup work cards:** traffic-light dots + screenshot zoom-on-reveal.
- **Hero parallax product strips:** case-study showcases (`hero-parallax.tsx`).
- **Vortex particle field** + **scales diagonal pattern** on About home.
- **Tool physics playground** (`matter-js`) — interactive stack icons.
- **IntroLoader** full-screen brand intro before reveal.
- **Lenis** smooth scroll sitewide.
- **Ambient gold radial orbs** on FinalCTA / Footer (CSS, no blur filters).
- **Count-up Bagel numerals** in Highlights.

---

## Motion

### Libraries

| Library | Version | Role |
|---|---|---|
| `framer-motion` | `^12.23.19` | Hover/ambient loops, route transitions, AnimatePresence, springs |
| `lenis` | `^1.3.25` | Smooth scroll (`duration: 1.15`, `smoothWheel: true`, `touchMultiplier: 1.4`) |
| `tailwindcss-animate` | `^1.0.7` | Accordion keyframes |
| `matter-js` | `^0.20.0` | Tool physics playground |
| `simplex-noise` | `^4.0.3` | Vortex particle noise |

**Scroll reveals are CSS + Intersection Observer**, not Framer `whileInView` (explicitly noted in `Reveal.tsx`).

### Shared tokens (`src/lib/motion.ts`)

| Token | Value |
|---|---|
| `REVEAL_EASE` | `[0.22, 1, 0.36, 1]` ↔ `cubic-bezier(0.22, 1, 0.36, 1)` |
| `HERO_REVEAL_DURATION_S` | `0.75` |
| `NAV_REVEAL_DURATION_S` | `0.7` |
| `HERO_STAGGER_S` | `0.14` |
| `ENTRANCE_SETTLE_MS` | `1100` |
| `HERO_TRAVEL_Y_DESKTOP_PX` | `80` |
| `HERO_TRAVEL_Y_MOBILE_PX` | `42` |
| `NAV_TRAVEL_Y_PX` | `70` |
| `COUNT_UP_DURATION_S` | `1.35` |

### Scroll reveal tokens (`src/lib/scrollReveal.ts`)

| Token | Value |
|---|---|
| Duration | `600ms` |
| Ease | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Offset Y | `24px` |
| Stagger | `80ms` (cap `320ms`) |
| IO threshold | `0.2` |
| Root margin | `0px 0px -5% 0px` |

`prefers-reduced-motion` is respected globally (CSS + Lenis unmounted + Framer `useReducedMotion`).

### Pattern examples (from repo)

**1. CSS hero entrance (class toggle)**

```tsx
// HeroSection — .reveal-item / .is-revealed (index.css: 0.75s, REVEAL_EASE, y: 80→0)
const itemClass = (index: number, extra = '') =>
  ['reveal-item', `reveal-item--${index}`, extra, revealClassOn ? 'is-revealed' : '']
    .filter(Boolean)
    .join(' ')
```

**2. Scroll reveal (IO + CSS)**

```tsx
// ScrollReveal.tsx — sets CSS vars, adds .scroll-reveal → .is-visible
<ScrollReveal staggerIndex={index + 1} className="rounded-2xl border border-white/12 …">
  {children}
</ScrollReveal>
```

**3. Splash hover CTA**

```tsx
// SplashHoverButton.tsx
const SPLASH_EASE = [0, 0, 0.2, 1] as const
const SPLASH_DURATION = 0.5
animate={{
  clipPath: hovered ? circleClip(origin, origin.radius) : circleClip(origin, 0),
}}
transition={{ duration: SPLASH_DURATION, ease: SPLASH_EASE }}
```

**4. Magnetic button spring**

```tsx
// MagneticButton.tsx
const springX = useSpring(x, { stiffness: 150, damping: 18, mass: 0.4 })
// maxOffset = 6
```

**5. Ambient pulse loops (hero dots)**

```tsx
// HeroSection PULSE_DOTS — duration 5–7s, repeat Infinity, repeatType: 'mirror'
animate={pulseLoopsActive ? { opacity: [...dot.opacity], scale: [...dot.scale] } : …}
```

**6. Route / step AnimatePresence**

```tsx
// App.tsx
transition={{ duration: admin ? 0.15 : 0.4, ease: "easeInOut" }}

// HowWeDo.tsx card swap
transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
```

**7. FinalCTA rotating word**

```tsx
// WORDS = ['Actually Works.', 'Saves You Hours.', 'Makes You Money.', 'Lasts.']
transition={{ duration: 0.6, ease: REVEAL_EASE }}
```

**8. Count-up settle pulse (CSS)**

```css
/* index.css */
.count-up-settled {
  animation: count-up-settle 150ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
```

---

## Voice & Content Style

### Real headline / subhead examples

1. **Hero**
   - Eyebrow: `We just don't build websites`
   - H1: `We Build the Systems That Grow Your Business`
   - Sub: `Custom software, headless Shopify stores, and AI agents — built to save you hours every week and make your business more money, not just look better online.`
   - Trust line: `Trusted by founders who needed it built right the first time.`

2. **Highlights**
   - H2: `Numbers we can back up.`
   - Eyebrow: `By the Numbers`

3. **About (home)**
   - H2: `A small team that builds like it's our own business.`
   - Body: `We partner directly with founders — not account managers, not a rotating cast of juniors…`

4. **Services (home)**
   - H2: `Built for businesses that need it to actually work.`
   - Sub: `Six ways we help you run and grow your business — plus one more coming soon.`

5. **Work**
   - H1: `Results you can measure.`
   - Sub: `Every project on this page is live — click through and see it running, not a mockup.`

6. **FinalCTA**
   - H2: `Let's Build Something That [Actually Works. / Saves You Hours. / Makes You Money. / Lasts.]`
   - Sub: `Tell us what you're building. We'll tell you honestly whether it's a fit — and if it is, how we'd approach it.`

7. **Testimonials**
   - H2: `What Our Clients Say`
   - Sub: `Shipped. Then they told us how it went.`

### Tone rules (from the copy above)

- **Sentence case for most headlines** (`Numbers we can back up.`, `Results you can measure.`) with occasional **Title Case** on hero / process / about mission (`We Build the Systems…`, `Design. Build. Grow.`).
- **Short, punchy sentences** and fragments (`Shipped. Then they told us how it went.`).
- **Active voice, founder-direct “we/you”** — contrasts against agencies (“not account managers”, “not a mockup”, “not chasing awards”).
- **Outcome language:** hours saved, money made, retention, live results — not awards or aesthetics alone.
- **Honest / anti-sales:** “We'll tell you if we're not the right fit”, “No pressure, no hard sell”.
- **CTAs:** Title Case or short imperative — `Start Your Project`, `See Our Work`, `Start a project`, `See how we work`.
- **Eyebrows:** short uppercase labels (`WHAT WE DO`, `BY THE NUMBERS`, `PORTFOLIO`, `TESTIMONIALS`).

---

## Tech Stack

From `package.json` (versions as declared):

| Layer | Choice | Version |
|---|---|---|
| Framework | React | `^18.3.1` |
| Bundler | Vite | `^5.4.19` |
| Language | TypeScript | `^5.8.3` |
| Routing | `react-router-dom` | `^6.30.1` |
| Styling | Tailwind CSS | `^3.4.17` |
| UI primitives | Radix UI + shadcn-style (`class-variance-authority`, `tailwind-merge`, `clsx`) | various `@radix-ui/*` |
| Animation | `framer-motion` | `^12.23.19` |
| Smooth scroll | `lenis` | `^1.3.25` |
| Physics | `matter-js` | `^0.20.0` |
| Noise / particles | `simplex-noise` | `^4.0.3` |
| Icons | `lucide-react` | `^0.462.0` |
| Charts | `recharts` | `^2.15.4` *(dependency present; not imported in current `src/` marketing surfaces)* |
| Carousel | `embla-carousel-react` | `^8.6.0` |
| Forms | `react-hook-form` | `^7.61.1` |
| Email | `@emailjs/browser` | `^4.4.1` |
| Themes | `next-themes` | `^0.3.0` |
| Toasts | `sonner` | `^1.7.4` |
| Markdown | `marked` | `^18.0.6` |
| Fonts | `@fontsource/{open-sans,bagel-fat-one,sora,dm-mono}` | `^5.3.0` |
| Backend / host | Vercel (`vercel`, `@vercel/blob`, `@vercel/edge`, Neon `@neondatabase/serverless`) | see package.json |
| Images | `vite-imagetools`, `sharp` | `^9.0.3`, `^0.35.3` |
| PWA | `vite-plugin-pwa` | `^1.2.0` |

Package name in `package.json` is still the scaffold slug `vite_react_shadcn_ts`.

---

## Open Questions

Decisions needed from the team:

1. **Brand “gold” vs visual blue** — Tokens `--brand-gold` / `--brand-cream` both equal `#8fabd4`. Rename tokens to steel/blue, or restore a true gold/cream pair?
2. **Secondary accent `#47C2FF`** — Used as Shopify service accent and mobile-nav CTA fill, separate from brand gold. Promote to a token, or retire in favor of `#8fabd4`?
3. **Service accent systems diverge** — Home `Services.tsx` neon list (`#E8FF47`, `#47C2FF`, …) ≠ `ServicesPage.tsx` card accents (`#b6f56a`, `#7dd3fc`, …). Which palette is canonical?
4. **`font-syne` alias** — Maps to Sora; no Syne font is installed. Remove the alias or document as intentional legacy?
5. **Button primary hierarchy** — Hero uses white `SplashHoverButton`; FinalCTA uses gold `BrandButton`. Confirm: white splash = primary on dark marketing, gold gradient = form/submit primary?
6. **Heading case inconsistency** — Mix of sentence case (`Numbers we can back up.`) and Title Case (`We Build the Systems…`, `What Our Clients Say`). Pick one rule for H1/H2?
7. **Container widths** — `SectionShell` = `max-w-6xl`; Highlights = `max-w-5xl`; Work = `1120px`; Team = `max-w-7xl`. Should marketing standardize on one max width?
8. **Text hierarchy tokens vs opacity utilities** — AA tokens `--text-subtle/muted/secondary` exist, but many sections still use `text-white/55`, `text-white/60`, `rgba(255,255,255,0.4)`, etc. Migrate fully?
9. **`recharts` / `embla-carousel-react`** — In dependencies; confirm keep for future admin/charts or remove dead weight.
10. **Elevation radii vs one-offs** — Elevation tokens (16/20/28px) coexist with hardcoded `18px` (work/testimonials) and `rounded-2xl`/`rounded-3xl`. Collapse to elevation scale?
)
