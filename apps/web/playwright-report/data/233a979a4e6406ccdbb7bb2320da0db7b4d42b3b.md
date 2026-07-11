# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Auth Flow >> should navigate to login page
- Location: __tests__\e2e\auth.spec.ts:4:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/login", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Auth Flow', () => {
  4  |   test('should navigate to login page', async ({ page }) => {
  5  |     // Go to the home page
  6  |     await page.goto('/');
  7  | 
  8  |     // Check if there is a link to the login page (or any text/button that points to auth)
  9  |     // Adjust based on the actual UI. The home page has a "Criar Conta Grátis" button
  10 |     const cta = page.locator('text=Criar Conta Grátis').first();
  11 |     
  12 |     // We just verify it's visible. Clicking it might require the backend to be running properly.
  13 |     await expect(cta).toBeVisible();
  14 |     
  15 |     // Also we can go directly to /login
> 16 |     await page.goto('/login');
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  17 |     
  18 |     // Check if the login form is present
  19 |     await expect(page.locator('button', { hasText: /Google/i })).toBeVisible();
  20 |   });
  21 | });
  22 | 
```