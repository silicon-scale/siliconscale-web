/**
 * Approximate scroll FPS under CPU throttle (simulates mid-range Android).
 * Uses Puppeteer CDP Emulation.setCPUThrottlingRate + rAF delta sampling during wheel scroll.
 */
import puppeteer from 'puppeteer'

const URL = process.env.PERF_URL ?? 'http://127.0.0.1:4173/'
const THROTTLE = Number(process.env.CPU_THROTTLE ?? 4)
const SCROLL_MS = Number(process.env.SCROLL_MS ?? 8000)
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
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true })
  const client = await page.createCDPSession()
  await client.send('Emulation.setCPUThrottlingRate', { rate: THROTTLE })

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 2500))

  await page.evaluate(() => {
    window.__perfDeltas = []
    window.__perfRunning = true
    let last = performance.now()
    const tick = (t) => {
      if (!window.__perfRunning) return
      const d = t - last
      if (last > 0 && d > 0 && d < 200) window.__perfDeltas.push(d)
      last = t
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })

  const t0 = Date.now()
  while (Date.now() - t0 < SCROLL_MS) {
    await page.mouse.wheel({ deltaY: 100 })
    await new Promise((r) => setTimeout(r, 16))
  }

  await page.evaluate(() => {
    window.__perfRunning = false
  })
  await new Promise((r) => setTimeout(r, 300))

  const samples = await page.evaluate(() => {
    const deltas = window.__perfDeltas ?? []
    const sorted = [...deltas].sort((a, b) => a - b)
    const avg = deltas.reduce((s, v) => s + v, 0) / Math.max(deltas.length, 1)
    const p95 = sorted[Math.floor(sorted.length * 0.95)] ?? 0
    const worst = sorted[sorted.length - 1] ?? 0
    const under50 = deltas.filter((d) => d > 20).length / Math.max(deltas.length, 1)

    return {
      frames: deltas.length,
      avgMs: avg,
      avgFps: 1000 / avg,
      p95Ms: p95,
      p95Fps: p95 > 0 ? 1000 / p95 : 0,
      worstMs: worst,
      worstFps: worst > 0 ? 1000 / worst : 0,
      pctFramesUnder50Fps: under50 * 100,
      scrollHeight: document.documentElement.scrollHeight,
      scrollY: window.scrollY,
    }
  })

  console.log(JSON.stringify({ url: URL, cpuThrottle: THROTTLE, scrollMs: SCROLL_MS, ...samples }, null, 2))
} finally {
  await browser.close()
}
