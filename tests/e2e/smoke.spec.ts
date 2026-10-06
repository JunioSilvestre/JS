import { test, expect } from '@playwright/test';

test.describe('Smoke & Language Tests', () => {
  const pages = [
    '/',
    '/bash',
    '/infra'
  ];

  for (const pagePath of pages) {
    test(`Page ${pagePath} loads and has lang="en-US"`, async ({ page }) => {
      const res = await page.goto(pagePath);
      expect(res?.status()).toBe(200);

      // Check language attribute on HTML
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBe('en-US');

      // Simple Portuguese words check in visible text (heuristic)
      const bodyText = await page.locator('body').innerText();
      const ptWords = ['módulo', 'questão', 'salvar', 'voltar', 'excluir', 'sucesso'];
      
      for (const word of ptWords) {
        expect(bodyText.toLowerCase()).not.toContain(word);
      }
    });
  }
});
