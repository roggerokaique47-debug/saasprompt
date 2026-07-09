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
    
    // 3. Testa a página de Workflow novo
    console.log('Navegando para o Editor de Workflow (Rota Pública de Teste)...');
    await page.goto('http://localhost:3000/test-editor');
    
    // Espera o botão 'Gerar com IA' aparecer
    console.log('Buscando botão de IA...');
    const btn = page.locator('button', { hasText: 'Gerar com IA' });
    try {
      await expect(btn).toBeVisible({ timeout: 5000 });
    } catch (e) {
      await page.screenshot({ path: 'playwright-error.png' });
      throw e;
    }
    
    // Abre o Modal
    console.log('Abrindo Modal de IA...');
    await btn.click();
    
    // Testa o textarea do modal
    const textarea = page.locator('textarea[placeholder*="Receber um webhook"]');
    await expect(textarea).toBeVisible();
    
    // Digita um prompt
    await textarea.fill('Criar um workflow que recebe um webhook, passa por um filtro e manda email');
    
    console.log('Testes E2E concluídos com sucesso!');
  });
});
