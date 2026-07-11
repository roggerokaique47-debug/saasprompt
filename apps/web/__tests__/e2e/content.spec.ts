import { test, expect } from '@playwright/test';

test.describe('Content Creation', () => {
  // Tests removed since /artigos/novo and /workflows/novo are now protected and redirect to login,
  // which is covered in the tests below.

  test('artigos novo form redirects to login if unauthenticated', async ({ page }) => {
    await page.goto('/artigos/novo');
    await expect(page).toHaveURL(/.*\/login.*/);
  });

  test('workflows novo form redirects to login if unauthenticated', async ({ page }) => {
    await page.goto('/workflows/novo');
    await expect(page).toHaveURL(/.*\/login.*/);
  });
});
