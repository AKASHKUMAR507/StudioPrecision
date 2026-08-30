import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.evaluate(() => localStorage.setItem('sp-theme', 'dark'))
await page.reload({ waitUntil: 'networkidle' })
await page.waitForTimeout(500)

const info = await page.evaluate(() => {
  const p = document.querySelector('p.text-secondary, p[class*="text-secondary"]')
  const h1 = document.querySelector('h1')
  const section = p ? p.closest('section') : null
  const cssVar = getComputedStyle(document.documentElement).getPropertyValue('--sp-secondary')
  const colorVar = getComputedStyle(document.documentElement).getPropertyValue('--color-secondary')
  return {
    htmlHasDarkClass: document.documentElement.classList.contains('dark'),
    spSecondaryVar: cssVar,
    colorSecondaryVar: colorVar,
    paragraphText: p ? p.textContent.slice(0, 40) : null,
    paragraphColor: p ? getComputedStyle(p).color : null,
    paragraphOpacity: p ? getComputedStyle(p).opacity : null,
    paragraphClassName: p ? p.className : null,
    sectionOpacity: section ? getComputedStyle(section).opacity : null,
    sectionTransform: section ? getComputedStyle(section).transform : null,
    h1Color: h1 ? getComputedStyle(h1).color : null,
  }
})
console.log(JSON.stringify(info, null, 2))
await browser.close()
