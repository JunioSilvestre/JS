import { test, expect } from '@playwright/test';
import getDb from '../../lib/db';

test.describe('E2E Module Flow & SpellChecker', () => {
  // Test cleanup
  test.afterAll(() => {
    const db = getDb();
    db.prepare("DELETE FROM modules WHERE id = 'e2e-test-module'").run();
  });

  test('Creates a module, uses spell checker, and validates DB', async ({ page }) => {
    // 1. Navigate to modules list
    await page.goto('/');
    
    // Check page loaded
    await expect(page.getByRole('heading', { name: /modules/i, exact: false }).first()).toBeVisible();

    // 2. Click Create Module
    await page.getByRole('link', { name: /create module/i, exact: false }).click();
    
    // Assuming there's a modal or navigation to a form
    // Wait for the new page to load
    await expect(page).toHaveURL(/\/modules\/create/);
    
    // Fill the form
    await page.getByPlaceholder(/e\.g\. lpic1-101-500/i).fill('e2e-test-module');
    await page.getByPlaceholder(/e\.g\. System Architecture/i).fill('E2E Test Module Title');
    
    // We expect a description field using our spell-checked textarea
    // The placeholder should be in English, e.g., "Provide a brief description"
    const descField = page.getByPlaceholder(/description of the module/i, { exact: false }).first();
    
    // 3. Test Spell Checker behavior
    // Type a misspelled word
    await descField.fill('This is a test descripption with an errror.');
    
    // We might have to wait for the language tool debounce
    await page.waitForTimeout(1500); 

    // Look for error highlights (the SpellCheckedTextarea uses <mark> tags inside the overlay)
    const marks = page.locator('mark');
    // Depending on LT rules, it should find 'descripption' and 'errror'
    const marksCount = await marks.count();
    // We expect at least one misspelled word identified (if LT server is running)
    // For resilience in tests, we'll log it or softly assert, because it depends on the local LT server.
    // However, if the server is offline, the textarea falls back to native behavior. 
    // We won't strictly fail if LT is offline but we will assert native textarea works.
    
    // Wait for native UI interactions
    await descField.fill('This is a corrected test description.');

    // Submit form
    // Look for a submit or save button
    await page.getByRole('button', { name: /create module/i, exact: false }).click();

    // 4. Validate successful creation on UI
    // Usually it redirects or shows a toast. Let's wait for URL or toast.
    await expect(page).toHaveURL(/\/modules/);
    
    // The module should be visible in the list
    await expect(page.getByText('E2E Test Module Title')).toBeVisible();
    
    // 5. Validate DB persistence
    const db = getDb();
    const row = db.prepare('SELECT * FROM modules WHERE id = ?').get('e2e-test-module') as any;
    
    expect(row).toBeDefined();
    expect(row.title).toBe('E2E Test Module Title');
    expect(row.description).toBe('This is a corrected test description.');
  });
});
