import puppeteer from 'puppeteer'

const URL = process.env.SHOT_URL ?? 'http://127.0.0.1:5173/work/plaam'
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
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 2000))

  await page.screenshot({ path: 'scripts/plaam-header-fix-1440.png', fullPage: false })

  await page.evaluate(() => {
    const hero = document.querySelector('.cs-hero-outer')
    if (hero) {
      const top = hero.getBoundingClientRect().top + window.scrollY - 60
      window.scrollTo(0, Math.max(0, top))
    }
  })
  await new Promise((r) => setTimeout(r, 500))
  await page.screenshot({ path: 'scripts/plaam-header-fix-hero-scroll-1440.png', fullPage: false })

  await page.evaluate(() => window.scrollTo(0, 0))
  await new Promise((r) => setTimeout(r, 300))
  await page.screenshot({ path: 'scripts/plaam-header-fix-top-1440.png', fullPage: false })

  const navCheck = await page.evaluate(() => {
    const nav = document.querySelector('nav, [class*="nav"]')
    const navRect = nav?.getBoundingClientRect()
    const tickerLike = [...document.querySelectorAll('*')].filter((el) => {
      const t = el.textContent || ''
      return t.includes('Crafted with intention') && t.length < 120
    })
    return {
      navTop: navRect?.top,
      navZ: nav ? getComputedStyle(nav).zIndex : null,
      tickerElementsAboveNav: tickerLike.filter((el) => {
        const r = el.getBoundingClientRect()
        return r.top < 80 && r.height > 0
      }).length,
    }
  })
  console.log('Nav/ticker check:', navCheck)
} finally {
  await browser.close()
}
