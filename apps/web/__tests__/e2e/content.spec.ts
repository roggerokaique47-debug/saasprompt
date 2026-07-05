import { test, expect } from '@playwright/test';

test.describe('Content Creation', () => {
  test('artigos novo page loads with form', async ({ page }) => {
    await page.goto('/artigos/novo');
    await expect(page.locator('h1')).toContainText('Artigo');
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('textarea[name="content"]')).toBeVisible();
    await expect(page.locator('select[name="categoryId"]')).toBeVisible();
  });

  test('workflows novo page loads with form', async ({ page }) => {
    await page.goto('/workflows/novo');
    await expect(page.locator('h1')).toContainText('Workflow');
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
  });

  test('artigos novo form accepts input', async ({ page }) => {
    await page.goto('/artigos/novo');
    await page.fill('input[name="title"]', 'Teste Playwright');
    await page.fill('textarea[name="content"]', '# Conteúdo de teste');
    const titleValue = await page.inputValue('input[name="title"]');
    expect(titleValue).toBe('Teste Playwright');
  });

  test('workflows novo form workflow JSON textarea exists', async ({ page }) => {
    await page.goto('/workflows/novo');
    const textareas = page.locator('textarea');
    const count = await textareas.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
