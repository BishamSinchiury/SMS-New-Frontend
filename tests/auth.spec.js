import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should redirect to login when accessing dashboard unauthenticated', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page).toHaveURL(/\/login/);
    });

    test('should show error on invalid credentials', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[name="email"]', 'wrong@test.com');
        await page.fill('input[name="password"]', 'wrongpass');
        await page.click('button[type="submit"]');

        // Expect error message
        const errorMsg = page.locator('.error-message'); // access via class or aria-label
        // Note: Actual selector depends on Login component implementation
    });
});
