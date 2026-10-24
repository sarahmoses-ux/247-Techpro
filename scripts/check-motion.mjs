import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const executablePath = 'C:/Users/Hp/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const browser = await chromium.launch({ headless: true, ...(existsSync(executablePath) ? { executablePath } : {}) });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:5174');
    await page.locator('.home-solutions > a').first().scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('.home-solutions > a').dataset.motionSeen === 'true');
    await page.evaluate(() => Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {}))));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.equal(await page.locator('.home-solutions > a').first().evaluate(el => getComputedStyle(el).opacity), '1');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.locator('.home-solutions > a').first().scrollIntoViewIfNeeded();
  assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
  assert.deepEqual(errors, []);
  console.log('Desktop/mobile reveals, overflow, reduced motion and runtime checks passed.');
} finally { await browser.close(); }
