import { test, expect } from '@playwright/test';

const book = async page => {
  for (const [name, value] of Object.entries({ firstName: 'Ada', lastName: 'Test', email: 'ada@example.com', phone: '08132393485', address: '12 Test Street, Lagos', time: '10:30', modelNumber: '840 G8' })) await page.locator(`#computer-${name}`).fill(value);
  const day = await page.locator('#computer-date').getAttribute('min');
  await page.locator('#computer-date').fill(day);
  await page.getByRole('checkbox', { name: /I have reviewed/ }).check();
};

test('repair uses image, model and issue clicks, then a validated scheduling form', async ({ page }) => {
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
  await expect(page.getByText('Your request is ready to email.')).toBeVisible();
  const href = decodeURIComponent(await page.getByRole('link', { name: 'Open Email to Send' }).getAttribute('href'));
  for (const value of ['HP', 'EliteBook', 'Battery / Charging', '10:30', '12 Test Street', 'Ada Test']) expect(href).toContain(value);
  expect(href).not.toContain('Broken Screen');
});

test('purchase mirrors image and model selection and resets repair choices when switching', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/request-solution?service=computer-sales-repairs&request=Repair');
  await page.getByRole('button', { name: 'Dell Computers', exact: true }).click();
  await page.getByRole('button', { name: 'Latitude Dell Computers', exact: true }).click();
  await page.getByRole('button', { name: 'Water Damaged', exact: true }).click();
  await page.getByRole('button', { name: 'Buy a Computer', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Choose Your Computer', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Apple Computers', exact: true }).click();
  await page.getByRole('button', { name: 'MacBook Air Apple Computers', exact: true }).click();
  await page.getByRole('button', { name: 'Work / Business', exact: true }).click();
  await book(page);
  await page.locator('#computer-quantity').fill('2');
  await page.screenshot({ path: 'test-results/computer-purchase-desktop.png', fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Request Computer Quote' }).click();
  const href = decodeURIComponent(await page.getByRole('link', { name: 'Open Email to Send' }).getAttribute('href'));
  expect(href).toContain('Purchase'); expect(href).toContain('MacBook Air'); expect(href).toContain('Number of computers: 2'); expect(href).not.toContain('Water Damaged');
});
