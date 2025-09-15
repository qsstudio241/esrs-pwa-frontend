import { test, expect } from '@playwright/test';

// Smoke test: create audit, toggle refactored checklist, add a comment, verify persistence in localStorage

test('create audit and add comment snapshot presence', async ({ page }) => {
  await page.goto('/');

  // Create new audit
  await page.getByText('Nuovo audit').click();
  await page.getByPlaceholder('Nome azienda').fill('E2E Test S.p.A.');
  await page.getByPlaceholder('Fatturato (EUR)').fill('2000000');
  await page.getByPlaceholder('Dipendenti').fill('120');
  await page.getByPlaceholder('Totale attivo (EUR)').fill('3000000');
  await page.getByRole('button', { name: 'Calcola dimensione' }).click();
  await page.getByRole('button', { name: 'Crea' }).click();

  // Expect an audit selection text to disappear and checklist to show something
  await expect(page.getByText('Seleziona un audit per iniziare.')).toHaveCount(0);

  // Toggle new checklist if available
  const betaToggle = page.getByLabel('Usa nuova checklist (beta)');
  if (await betaToggle.isVisible()) {
    await betaToggle.check();
  }

  // Try to locate a first textarea/comment input (heuristic: search for 'Commento' placeholder or a textarea)
  const textareas = page.locator('textarea');
  if (await textareas.count() > 0) {
    await textareas.nth(0).fill('Nota E2E automatica');
  }

  // Validate localStorage contains audits with our company name
  const auditsRaw = await page.evaluate(() => localStorage.getItem('audits'));
  expect(auditsRaw).toBeTruthy();
  expect(auditsRaw).toContain('E2E Test S.p.A.');
});
