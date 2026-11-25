import { test, expect } from '@playwright/test';

const book = async page => {
  for (const [name, value] of Object.entries({ firstName: 'Ada', lastName: 'Test', email: 'ada@example.com', phone: '08132393485', address: '12 Test Street, Lagos', time: '10:30', modelNumber: '840 G8' })) await page.locator(`#computer-${name}`).fill(value);
  const day = await page.locator('#computer-date').getAttribute('min');
  await page.locator('#computer-date').fill(day);
  await page.getByRole('checkbox', { name: /I have reviewed/ }).check();
};

test('repair uses image, model and issue clicks, then a validated scheduling form', async ({ page }) => {
  let submitted;
  await page.route('**/api/repairs', async route => { submitted = route.request().postDataJSON(); await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, reference: 'REP-TEST1234' }) }); });
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/services/computer-sales-repairs');
  await page.getByRole('link', { name: 'Repair a Computer' }).click();
  await expect(page.getByRole('heading', { name: 'Choose Your Computer', exact: true })).toBeVisible();
  await expect(page.locator('.form-progress')).toHaveCount(0);
  await expect(page.locator('.computer-device img')).toHaveCount(7);
  for (const image of await page.locator('.computer-device img').all()) await expect.poll(() => image.evaluate(i => i.complete && i.naturalWidth > 0)).toBe(true);
  await page.screenshot({ path: 'test-results/computer-devices-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'HP Computers', exact: true }).click();
  await page.getByRole('button', { name: 'EliteBook HP Computers', exact: true }).click();
  await page.getByRole('button', { name: 'Broken Screen', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Schedule Your Computer Repair' })).toBeVisible();
  await expect(page.locator('.computer-summary')).toContainText('HP EliteBook');
  await expect(page.locator('.computer-summary')).toContainText('Broken Screen');
  await page.getByRole('button', { name: 'Confirm Repair Request' }).click();
  await expect(page.locator('#computer-email')).toHaveAttribute('aria-invalid', 'true');
  await book(page);
  await page.locator('#computer-date').fill('2020-01-01');
  await page.getByRole('button', { name: 'Confirm Repair Request' }).click();
  await expect(page.locator('#computer-date')).toHaveAttribute('aria-invalid', 'true');
  await page.locator('#computer-date').fill(await page.locator('#computer-date').getAttribute('min'));
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.getByRole('button', { name: 'Battery / Charging', exact: true }).click();
  await expect(page.locator('#computer-firstName')).toHaveValue('Ada');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/computer-schedule-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Confirm Repair Request' }).click();
  await expect(page.getByRole('heading', { name: 'Your repair request has been sent.' })).toBeVisible();
  await expect(page.getByText('REP-TEST1234')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Email to Send' })).toHaveCount(0);
  const request = JSON.stringify(submitted);
  for (const value of ['HP', 'EliteBook', 'Battery / Charging', '10:30', '12 Test Street', 'Ada Test']) expect(request).toContain(value);
  expect(request).not.toContain('Broken Screen');
});

for (const response of [{ status: 503, body: { success: false } }, { status: 200, body: { success: false } }]) test(`repair delivery failure retains details: ${response.status}`, async ({ page }) => {
  await page.route('**/api/repairs', route => route.fulfill({ status: response.status, contentType: 'application/json', body: JSON.stringify(response.body) }));
  await page.goto('/request-solution?service=computer-sales-repairs&request=Repair');
  await page.getByRole('button', { name: 'HP Computers', exact: true }).click();
  await page.getByRole('button', { name: 'EliteBook HP Computers', exact: true }).click();
  await page.getByRole('button', { name: 'Broken Screen', exact: true }).click();
  await book(page);
  await page.getByRole('button', { name: 'Confirm Repair Request' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.locator('#computer-firstName')).toHaveValue('Ada');
  await expect(page.getByRole('heading', { name: 'Your repair request has been sent.' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Open Email to Send' })).toHaveCount(0);
});
