import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
  test('should navigate to login page', async ({ page }) => {
    // Go to the home page
    await page.goto('/');

    // Check if there is a link to the login page (or any text/button that points to auth)
    // Adjust based on the actual UI. The home page has a "Criar Conta Grátis" button
    const cta = page.locator('text=Criar Conta Grátis').first();
    
    // We just verify it's visible. Clicking it might require the backend to be running properly.
    await expect(cta).toBeVisible();
    
    // Also we can go directly to /login
    await page.goto('/login');
    
    // Check if the login form is present
    await expect(page.locator('button', { hasText: /Google/i })).toBeVisible();
  });
});
