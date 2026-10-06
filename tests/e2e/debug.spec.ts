import { test, expect } from '@playwright/test';

test('click test', async ({ page }) => {
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:3000/infra');
  await page.waitForTimeout(2000);
  
  const count = await page.locator('[data-id]').count();
  console.log('Cards count:', count);
  
  if (count > 0) {
    await page.locator('[data-id]').first().click();
    await page.waitForTimeout(1000);
    const isHidden = await page.locator('#detailView').evaluate(e => e.classList.contains('hidden'));
    console.log('Detail view hidden:', isHidden);
  }
});
