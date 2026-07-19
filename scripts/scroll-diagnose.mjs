/**
 * Scroll animation diagnosis: IO count, concurrent reveals, frame rate, layout metrics.
 */
import puppeteer from 'puppeteer'
import { writeFileSync } from 'fs'

const URL = process.env.PERF_URL ?? 'http://127.0.0.1:5173/'
const CHROME =
  process.env.CHROME_PATH ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const browser = await puppeteer.launch({
  headless: true,
  executablePath: CHROME,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })

  await page.evaluateOnNewDocument(() => {
    window.__ioConstructCount = 0
    const Orig = window.IntersectionObserver
    window.IntersectionObserver = class extends Orig {
      constructor(...args) {
        window.__ioConstructCount++
        super(...args)
      }
    }
  })

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 90000 })
  await page
    .waitForFunction(() => document.querySelectorAll('.scroll-reveal').length > 20, {
      timeout: 30000,
    })
    .catch(() => {})
  await new Promise((r) => setTimeout(r, 2000))

  const preScroll = await page.evaluate(() => ({
    ioConstructCount: window.__ioConstructCount ?? 0,
    scrollRevealElements: document.querySelectorAll('.scroll-reveal').length,
    withWillChange: document.querySelectorAll('.scroll-reveal.is-animating').length,
    withVisible: document.querySelectorAll('.scroll-reveal.is-visible').length,
    pageHeight: document.documentElement.scrollHeight,
  }))

  const client = await page.createCDPSession()
  await client.send('Performance.enable')

  await page.evaluate(() => {
    window.__frameDeltas = []
    window.__sampleFrames = true
    window.__longTasks = []
    let last = performance.now()
    const tick = (t) => {
      if (!window.__sampleFrames) return
      const d = t - last
      if (last > 0 && d > 0 && d < 200) window.__frameDeltas.push(d)
      last = t
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    try {
      const obs = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (e.entryType === 'longtask') window.__longTasks.push(e.duration)
        }
      })
      obs.observe({ entryTypes: ['longtask'] })
      window.__longTaskObs = obs
    } catch {
      /* unsupported */
    }
  })

  const scrollHeight = preScroll.pageHeight
  for (let i = 0; i <= 80; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.floor((scrollHeight * i) / 80))
    await page.mouse.wheel({ deltaY: 120 })
    await new Promise((r) => setTimeout(r, 50))
  }
  await new Promise((r) => setTimeout(r, 1500))

  const frameStats = await page.evaluate(() => {
    window.__sampleFrames = false
    window.__longTaskObs?.disconnect()
    const deltas = window.__frameDeltas ?? []
    const sorted = [...deltas].sort((a, b) => a - b)
    const avg = deltas.reduce((s, v) => s + v, 0) / Math.max(deltas.length, 1)
    const p95 = sorted[Math.floor(sorted.length * 0.95)] ?? 0
    const worst = sorted[sorted.length - 1] ?? 0
    const longTasks = window.__longTasks ?? []
    return {
      frames: deltas.length,
      avgMs: avg,
      avgFps: 1000 / avg,
      p95Ms: p95,
      p95Fps: p95 > 0 ? 1000 / p95 : 0,
      worstMs: worst,
      worstFps: worst > 0 ? 1000 / worst : 0,
      pctUnder50Fps: (deltas.filter((d) => d > 20).length / Math.max(deltas.length, 1)) * 100,
      longTasks: longTasks.length,
      longTaskMaxMs: longTasks.length ? Math.max(...longTasks) : 0,
    }
  })

  const metrics = await client.send('Performance.getMetrics')
  const postScroll = await page.evaluate(() => {
    const sectionCounts = {}
    for (const sel of ['#awards', '.tool-stack-shell', '.work-list']) {
      const root = document.querySelector(sel)
      if (!root) continue
      sectionCounts[sel] = {
        total: root.querySelectorAll('.scroll-reveal').length,
        animating: root.querySelectorAll('.scroll-reveal.is-animating').length,
        visible: root.querySelectorAll('.scroll-reveal.is-visible').length,
      }
    }
    return {
      ioConstructCount: window.__ioConstructCount ?? 0,
      scrollRevealElements: document.querySelectorAll('.scroll-reveal').length,
      concurrentAnimating: document.querySelectorAll('.scroll-reveal.is-animating').length,
      withWillChange: document.querySelectorAll('.scroll-reveal.is-animating').length,
      visibleCount: document.querySelectorAll('.scroll-reveal.is-visible').length,
      sectionCounts,
    }
  })

  const report = {
    url: URL,
    preScroll,
    postScroll,
    frameStats,
    cdpPerformance: {
      layoutCount: metrics.metrics?.find((m) => m.name === 'LayoutCount')?.value ?? null,
      recalcStyleCount:
        metrics.metrics?.find((m) => m.name === 'RecalcStyleCount')?.value ?? null,
      nodes: metrics.metrics?.find((m) => m.name === 'Nodes')?.value ?? null,
    },
  }

  console.log(JSON.stringify(report, null, 2))
  writeFileSync('scripts/scroll-diagnose-report.json', JSON.stringify(report, null, 2))
} finally {
  await browser.close()
}
