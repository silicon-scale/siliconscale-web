import puppeteer from 'puppeteer'

const URL = process.env.SHOT_URL ?? 'http://127.0.0.1:5173/work'
const CHROME =
  process.env.CHROME_PATH ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const viewports = [
  { w: 1024, h: 768 },
  { w: 1280, h: 800 },
  { w: 1440, h: 900 },
  { w: 1920, h: 1080 },
]

const browser = await puppeteer.launch({
  headless: true,
  executablePath: CHROME,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

try {
  const page = await browser.newPage()
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 2000))

  for (const vp of viewports) {
    await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 1 })
    await page.evaluate(() => {
      const card = document.querySelector('.work-card')
      card?.scrollIntoView({ block: 'center' })
    })
    await new Promise((r) => setTimeout(r, 400))

    const m = await page.evaluate(() => {
      const card = document.querySelector('.work-card-link')
      const wrap = document.querySelector('.work-card')
      if (!card || !wrap) return null
      const cr = card.getBoundingClientRect()
      const wr = wrap.getBoundingClientRect()
      return {
        cardHeight: cr.height,
        wrapHeight: wr.height,
        topGap: wr.top,
        bottomGap: window.innerHeight - wr.bottom,
        fitsInViewport: cr.height <= window.innerHeight * 0.78,
        cardFitsWithPadding: wr.bottom <= window.innerHeight && wr.top >= 0,
      }
    })
    console.log(`${vp.w}x${vp.h}:`, JSON.stringify(m))
  }
} finally {
  await browser.close()
}
