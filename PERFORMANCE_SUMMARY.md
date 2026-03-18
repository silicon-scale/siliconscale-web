# Performance fixes – rendering pipeline and jank

## What caused the jank

1. **Heavy work during React render (vortex)**  
   `Vortex` was doing expensive work on every render:
   - `createNoise3D()` (simplex-noise)
   - `new Float32Array(particlePropsLength)` (~4.7k elements by default)
   - All particle helpers and draw logic recreated each render  
   That blocked the main thread during the first paint and on every parent re-render (e.g. AboutSection), contributing to white flashes and dropped frames.

2. **Scroll-driven re-renders (Navbar)**  
   The navbar used a raw `scroll` listener that called `setIsScrolled(window.scrollY > 40)` on every scroll event. That caused frequent state updates and re-renders while scrolling, adding to layout/paint work and jank.

3. **Route transition and layout**  
   The route transition wrapper did not promote the animated content to its own layer (`will-change` / `translateZ(0)`), and Framer Motion layout animations were enabled by default in several places, causing extra layout work during transitions and scroll.

4. **Canvas animations always running**  
   Vortex and CanvasText kept their `requestAnimationFrame` loops running when the tab was hidden or when the component was offscreen, wasting CPU and contributing to long tasks.

5. **Services page stacking cards**  
   Each stacking card could re-render unnecessarily (new `onCta` reference every render), and the sticky cards did not explicitly opt out of layout animations.

6. **Initial render blocking**  
   The gtag config in `index.html` ran synchronously during parse, and `window.scrollTo(0, 0)` on route change ran in the same tick as the route update, which could delay first paint.

---

## Changes made

### 1. Vortex (`src/components/ui/vortex.tsx`)

- **Moved all heavy logic out of render**  
  `createNoise3D()`, `Float32Array` allocation, `tick`, `center`, and all helpers (`resizeToContainer`, `initParticles`, `drawParticle`, `updateParticle`, etc.) now live only inside a single `useEffect` with `[]` deps. The component body only holds refs and JSX.
- **Pause when not visible**  
  - `visibilitychange`: stop the RAF loop when the tab is hidden, start again when visible.  
  - `IntersectionObserver`: stop when the vortex container is offscreen, start when it enters the viewport.
- **Layer promotion**  
  The motion wrapper uses `willChange: "transform"` so the canvas is on its own compositor layer.

### 2. Navbar (`src/components/Navbar.tsx`)

- Replaced the raw `scroll` listener with **`useScrollThreshold(40)`**, which uses `requestAnimationFrame` and only updates state when the scroll position crosses the threshold. This cuts scroll-triggered re-renders and avoids layout thrashing.

### 3. App route transitions (`src/App.tsx`)

- Added **`style={{ willChange: "transform", transform: "translateZ(0)" }}`** and **`layout={false}`** on the route transition `motion.div` so only transform/opacity are animated and layout is not recalculated.
- **Deferred scroll on route change**: `window.scrollTo(0, 0)` is now scheduled with `requestAnimationFrame` so the new route can paint first, then scroll, reducing perceived white flash.

### 4. ServicesPage (`src/components/ServicesPage.tsx`)

- **`StackingServiceCard`** wrapped in **`React.memo`** to avoid re-renders when parent re-renders with same props.
- **Stable `onCta`** via **`useCallback(() => navigate('/contact'), [navigate])`** so memoized cards don’t re-render unnecessarily.
- **`layout={false}`** on the stacking `motion.article` so Framer does not run layout animations on the sticky cards (animations remain transform/opacity only).

### 5. CanvasText (`src/components/ui/canvas-text.tsx`)

- **Pause when tab is hidden**: `visibilitychange` stops the animation loop when the document is hidden and restarts when visible.
- **Pause when offscreen**: **`IntersectionObserver`** on the canvas stops the loop when the element is out of view and restarts when it enters.
- **`runningRef`** used so the loop only schedules the next frame when it should be running, avoiding work when paused.

### 6. Framer Motion layout

- **`layout={false}`** added to:
  - App route transition wrapper
  - ServicesPage stacking cards
  - **Reveal** (`src/components/ui/Reveal.tsx`)
  - **RevealOnScroll** (`src/components/ui/RevealOnScroll.tsx`)  
  So animations use only **transform** and **opacity**, with no layout passes.

### 7. Index.html

- **gtag config deferred**: `gtag('config', ...)` is run on **`DOMContentLoaded`** when the document is still loading, so it doesn’t block initial parse/paint. If the document is already loaded, config runs immediately.

---

## Components optimized

| Component / area        | Optimizations |
|-------------------------|---------------|
| **Vortex**              | No heavy work in render; pause when hidden/offscreen; `willChange: transform` |
| **Navbar**              | `useScrollThreshold(40)` instead of raw scroll listener |
| **App**                 | Route transition layer promotion, `layout={false}`, deferred `scrollTo` |
| **ServicesPage**        | `React.memo(StackingServiceCard)`, `useCallback(onCta)`, `layout={false}` on cards |
| **CanvasText**          | Pause on visibility/intersection; no layout change |
| **Reveal / RevealOnScroll** | `layout={false}` |
| **index.html**          | Deferred gtag config |

---

## Expected performance improvements

- **No blocking during initial render**: Heavy vortex work runs only once inside `useEffect`, so first paint is no longer blocked by simplex-noise or large allocations.
- **Smoother scrolling**: Fewer Navbar re-renders and no layout animations on scroll-driven content; stacking cards use only transform/opacity with `will-change: transform`.
- **Fewer long tasks**: Canvas loops pause when the tab is hidden or elements are offscreen, reducing main-thread work.
- **Stable 60 fps**: Route transitions and animated elements are on their own layers and avoid layout thrashing; scroll and route changes are deferred where appropriate.
- **Reduced white screen flashes**: Deferred route scroll and non-blocking gtag config help the browser paint the new route before running script, and shared shell (Navbar/Footer) does not reinitialize heavy effects on navigation.

---

## Runtime verification (recommended)

After deploying:

1. **Chrome Performance**  
   Record while navigating and scrolling; confirm no long tasks > 50 ms and that frame rate stays near 60 fps.

2. **Scrolling**  
   Scroll the home page and Services stacking section; check that scrolling stays smooth and there are no white flashes.

3. **Route changes**  
   Switch between `/`, `/about`, `/services`, etc.; confirm no 1–2 s white screen and that transitions are smooth.

4. **Background tab**  
   Open DevTools → Performance, switch to another tab for a few seconds, then back; verify canvas-related activity drops while the tab is hidden (e.g. in the flame chart).
