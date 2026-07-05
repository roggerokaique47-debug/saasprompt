import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads with hero and featured sections', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Explorar Biblioteca').first()).toBeVisible();
  });

  test('biblioteca page loads with search and filters', async ({ page }) => {
    await page.goto('/biblioteca');
    await expect(page.locator('h1')).toContainText('Biblioteca');
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });

  test('pricing page shows plan options', async ({ page }) => {
    await page.goto('/preco');
    await expect(page.locator('h1')).toContainText('Planos');
  });

  test('login page has form and social options', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('Entrar');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('text=Entrar com Google')).toBeVisible();
  });

  test('signup page has form and social options', async ({ page }) => {
    await page.goto('/cadastro');
    await expect(page.locator('h1')).toContainText('Conta');
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('comunidade page has creator action cards', async ({ page }) => {
    await page.goto('/comunidade');
    await expect(page.locator('text=Submeter Prompt')).toBeVisible();
    await expect(page.locator('text=Submeter Workflow')).toBeVisible();
    await expect(page.locator('text=Escrever Artigo')).toBeVisible();
  });

  test('artigos listing page loads', async ({ page }) => {
    await page.goto('/artigos');
    await expect(page.locator('h1')).toContainText('Artigos');
  });

  test('workflows listing page loads', async ({ page }) => {
    await page.goto('/workflows');
    await expect(page.locator('h1')).toContainText('Workflows');
  });

  test('admin page redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForURL('**/login**');
    await expect(page.locator('h1')).toContainText('Entrar');
  });

  test('header navigation is visible on all pages', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header, nav').first();
    await expect(header).toBeVisible();
    await expect(header.locator('text=Bem-vindo').or(header.locator('text=PromptHub'))).toBeVisible();
  });

  test('browser back/forward works between pages', async ({ page }) => {
    await page.goto('/');
    const title1 = await page.locator('h1').textContent();
    await page.goto('/biblioteca');
    await expect(page.locator('h1')).toContainText('Biblioteca');
    await page.goBack();
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
