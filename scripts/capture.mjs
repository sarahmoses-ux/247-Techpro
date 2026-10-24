import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
const executablePath = 'C:/Users/Hp/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const browser = await chromium.launch({ headless: true, ...(existsSync(executablePath) ? { executablePath } : {}) });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
  await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:5174');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'test-results/desktop-top.png' });
  await page.locator('footer').screenshot({ path: 'test-results/footer.png' });
  await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
  await page.setViewportSize({ width: 375, height: 1000 });
  await page.screenshot({ path: 'test-results/mobile-top.png' });
} finally { await browser.close(); }
