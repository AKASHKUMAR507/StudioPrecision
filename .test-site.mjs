import { chromium } from 'playwright'
import fs from 'node:fs'

const BASE = 'http://localhost:5173'
const SHOT_DIR = '/private/tmp/claude-501/-Users-akashkumar-Desktop-Developer-project/f2d6063b-d964-4e73-8cd8-7d9ac156b3a8/scratchpad/shots'
fs.mkdirSync(SHOT_DIR, { recursive: true })

const routes = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/blog', name: 'blog' },
  { path: '/blog/optimizing-flatlist', name: 'blog-post' },
  { path: '/work/ledge-pay', name: 'work-detail' },
  { path: '/style-guide', name: 'style-guide' },
  { path: '/does-not-exist', name: 'not-found' },
]

const browser = await chromium.launch()
const errors = []

for (const theme of ['light', 'dark']) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await context.newPage()
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[${theme}] console error on last nav: ${msg.text()}`)
  })
  page.on('pageerror', (err) => {
    errors.push(`[${theme}] page error: ${err.message}`)
  })

  for (const route of routes) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle' })
    if (theme === 'dark') {
      await page.evaluate(() => localStorage.setItem('sp-theme', 'dark'))
      await page.reload({ waitUntil: 'networkidle' })
    }
    await page.waitForTimeout(300)
    // Scroll through the full page like a human would, so reveal-on-scroll
    // sections actually trigger before the screenshot is taken.
    const height = await page.evaluate(() => document.body.scrollHeight)
    for (let y = 0; y < height; y += 400) {
      await page.evaluate((pos) => window.scrollTo(0, pos), y)
      await page.waitForTimeout(120)
    }
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(300)
    await page.screenshot({ path: `${SHOT_DIR}/${route.name}-${theme}.png`, fullPage: true })
    console.log(`captured ${route.name} (${theme}) -> ${page.url()}`)
  }

  // Click-through smoke test: home -> a work card -> back -> blog -> a post -> back link
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  if (theme === 'dark') await page.evaluate(() => localStorage.setItem('sp-theme', 'dark'))
  await page.reload({ waitUntil: 'networkidle' })

  const workLink = page.locator('a[href="/work/ledge-pay"]').first()
  await workLink.scrollIntoViewIfNeeded()
  await workLink.click()
  await page.waitForURL('**/work/ledge-pay')
  console.log(`[${theme}] clicked into work detail: ${page.url()}`)

  await page.locator('a:has-text("Work")').first().click()
  await page.waitForTimeout(300)
  console.log(`[${theme}] clicked back-to-work link: ${page.url()}`)

  await page.goto(`${BASE}/blog`, { waitUntil: 'networkidle' })
  const postLink = page.locator('a[href="/blog/optimizing-flatlist"]').first()
  await postLink.click()
  await page.waitForURL('**/blog/optimizing-flatlist')
  console.log(`[${theme}] clicked into blog post: ${page.url()}`)

  await page.locator('a:has-text("Blog")').first().click()
  await page.waitForURL('**/blog')
  console.log(`[${theme}] back-to-blog link works: ${page.url()}`)

  await context.close()
}

await browser.close()

console.log('\n--- Console/page errors ---')
if (errors.length === 0) {
  console.log('none')
} else {
  errors.forEach((e) => console.log(e))
}
