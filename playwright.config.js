import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
const localBrowser = 'C:/Users/Hp/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
export default defineConfig({
  testDir: './tests', timeout: 60000, fullyParallel: false, workers: 1,
  reporter: 'list',
  use: { baseURL: process.env.PW_BASE_URL || 'http://127.0.0.1:5187', headless: true, launchOptions: existsSync(localBrowser) ? { executablePath: localBrowser } : {}, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: process.env.PW_BASE_URL ? undefined : [
    { command: 'npm run dev -- --host 127.0.0.1 --port 5187 --strictPort', url: 'http://127.0.0.1:5187', reuseExistingServer: false },
    { command: 'npm run dev -- --host 127.0.0.1 --port 5188 --strictPort', url: 'http://127.0.0.1:5188', reuseExistingServer: false, env: { VITE_LEAD_ENDPOINT: '/api/leads' } },
  ],
});
