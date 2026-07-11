import { test, expect } from '@playwright/test';

test.describe('NovaFlow E2E Test', () => {
  test('Navegação e Biblioteca', async ({ page }) => {
    // 1. Testa a home
    console.log('Navegando para a Home...');
    await page.goto('http://localhost:3000/');
    
    // Verifica se a página carregou
    await expect(page.locator('body')).toBeVisible();
    const isError = await page.evaluate(() => {
      return document.body.innerText.includes('Unhandled Runtime Error');
    });
    expect(isError).toBe(false);

    // 2. Testa a página da biblioteca (Marketplace)
    console.log('Navegando para a Biblioteca...');
    await page.goto('http://localhost:3000/biblioteca');
    await expect(page.locator('body')).toBeVisible();
    
    // Editor test removed since /test-editor does not exist and /workflows/novo requires authentication
    
    // 4. Testa a proteção das novas rotas do CRM (Fases 11-13)
    console.log('Verificando segurança das rotas...');
    const protectedRoutes = [
      '/dashboard/templates',
      '/dashboard/agentes',
      '/dashboard/afiliados'
    ];
    
    for (const route of protectedRoutes) {
      console.log(`Checando rota protegida: ${route}`);
      await page.goto(`http://localhost:3000${route}`);
      // Deve redirecionar para login
      await expect(page).toHaveURL(/.*\/login.*/);
    }
    
    console.log('Testes E2E concluídos com sucesso!');
  });
});
