import { test, expect } from '@playwright/test';

test.describe('Admin Pages', () => {
  test('admin login redirect works', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForURL('**/login**');
    expect(page.url()).toContain('/login');
    expect(page.url()).toContain('redirect=/admin');
  });

  test('admin login page has redirect param preserved', async ({ page }) => {
    await page.goto('/admin/prompts');
    await page.waitForURL('**/login**');
    expect(page.url()).toContain('redirect=/admin/prompts');
  });

  test('admin routes return 200 on server (without auth)', async ({ page }) => {
    const response = await page.request.get('/admin');
    expect(response.status()).toBe(200);
  });

  test('admin prompts novo page has form fields', async ({ page }) => {
    await page.goto('/admin/prompts/novo');
    const response = await page.request.get('/admin/prompts/novo');
    expect(response.status()).toBe(200);
  });

  test('admin categories page has content', async ({ page }) => {
    await page.goto('/admin/categorias');
    const response = await page.request.get('/admin/categorias');
    expect(response.status()).toBe(200);
  });
});
