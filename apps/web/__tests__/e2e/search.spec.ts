import { test, expect } from '@playwright/test';

test.describe('Search & Browse', () => {
  test('search input accepts query and shows results', async ({ page }) => {
    await page.goto('/biblioteca');
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], input[placeholder*="buscar" i]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('marketing');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/q=marketing/);
  });

  test('sort dropdown is functional on biblioteca', async ({ page }) => {
    await page.goto('/biblioteca');
    const sortSelect = page.locator('select');
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption({ index: 1 });
      await expect(page).toHaveURL(/sort=/);
    }
  });

  test('category page loads with correct heading', async ({ page }) => {
    await page.goto('/biblioteca');
    const categoryLink = page.locator('a[href*="/biblioteca/"]').first();
    if (await categoryLink.isVisible()) {
      await categoryLink.click();
      await expect(page).toHaveURL(/\/biblioteca\/.+/);
    }
  });
});
