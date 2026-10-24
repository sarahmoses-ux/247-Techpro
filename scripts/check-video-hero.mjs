import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
const executablePath = 'C:/Users/Hp/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const browser = await chromium.launch({ headless: true, ...(existsSync(executablePath) ? { executablePath } : {}) });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const base = process.env.PREVIEW_URL || 'http://127.0.0.1:5174';
  await page.goto(base);
  await page.waitForFunction(() => { const v = document.querySelector('.cinema-backdrop video'); return v && v.readyState >= 2 && v.currentTime > .1 && !v.paused; }, null, { timeout: 60000 });
  assert.equal(await page.locator('video').evaluate(v => v.muted && v.loop && v.playsInline), true);
  await page.getByRole('button', { name: 'Pause background video' }).click();
  assert.equal(await page.locator('video').evaluate(v => v.paused), true);
  await page.getByRole('button', { name: 'Play background video' }).click();
  await page.waitForFunction(() => !document.querySelector('video').paused);
  for (const width of [320, 375, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `No overflow at ${width}`);
  }
  mkdirSync('test-results', { recursive: true });
  await page.screenshot({ path: 'test-results/video-hero-desktop.png' });
  await page.setViewportSize({ width: 375, height: 1000 });
  await page.screenshot({ path: 'test-results/video-hero-mobile.png' });
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('video').paused);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  assert.equal(await page.locator('video').count(), 0);
  await page.waitForFunction(() => { const img = document.querySelector('.cinema-backdrop img'); return img?.complete && img.naturalWidth > 0; });
  await page.locator('.hero-actions').getByRole('link', { name: 'Request a Solution', exact: true }).click();
  await page.waitForURL('**/request-solution');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.route('**/video/technology-living.mp4', route => route.abort());
  await page.goto(base);
  await page.waitForFunction(() => !document.querySelector('.cinema-backdrop video'));
  await page.waitForFunction(() => document.querySelector('.cinema-backdrop img')?.naturalWidth > 0);
  assert.deepEqual(errors, []);
  console.log('Video playback, pause/play, offscreen pause, six widths, reduced motion, failed-video fallback and consultation navigation passed.');
} finally { await browser.close(); }