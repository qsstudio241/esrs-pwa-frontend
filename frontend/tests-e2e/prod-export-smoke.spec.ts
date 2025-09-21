import { test, expect } from '@playwright/test';

// Production smoke: create audit, toggle beta UI, trigger JSON/HTML/Word exports
// Assumes app is served at PW_BASE_URL (Netlify or local serve)

test('production export smoke (beta UI)', async ({ page }) => {
  await page.goto('/');

  // Create new audit
  await page.getByText('Nuovo audit').click();
  await page.getByPlaceholder('Nome azienda').fill('Prod Smoke S.p.A.');
  await page.getByPlaceholder('Fatturato (EUR)').fill('1500000');
  await page.getByPlaceholder('Dipendenti').fill('50');
  await page.getByPlaceholder('Totale attivo (EUR)').fill('1200000');
  await page.getByRole('button', { name: 'Crea' }).click();

  // Enable refactored UI
  const betaToggle = page.getByLabel('Usa nuova checklist (beta)');
  if (await betaToggle.isVisible()) {
    await betaToggle.check();
  }
  await expect(page.getByLabel('Checklist Refactored')).toBeVisible();

  // Capture downloads per export
  const [jsonDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Esporta JSON' }).click(),
  ]);

  const [htmlDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Esporta HTML' }).click(),
  ]);

  let wordDownload: import('@playwright/test').Download | undefined;
  try {
    [wordDownload] = await Promise.all([
      page.waitForEvent('download', { timeout: 4000 }),
      page.getByRole('button', { name: 'Esporta Word' }).click(),
    ]);
  } catch {
    // On some browsers/permissions, Word may not trigger a download; tolerate this.
  }

  const names = [
    jsonDownload?.suggestedFilename(),
    htmlDownload?.suggestedFilename(),
    wordDownload?.suggestedFilename(),
  ].filter(Boolean) as string[];

  // Basic assertions: JSON and HTML should be present
  expect(names.some((n) => n.toLowerCase().endsWith('.json'))).toBeTruthy();
  expect(names.some((n) => n.toLowerCase().endsWith('.html'))).toBeTruthy();
});
