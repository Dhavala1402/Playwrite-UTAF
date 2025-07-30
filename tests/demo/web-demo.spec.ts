import { test, expect } from '@playwright/test';

test.describe('🌐 Web Platform Demo Tests', () => {
  
  test('Demo: Basic page navigation and title verification', async ({ page }) => {
    // Navigate to a demo website
    await page.goto('https://playwright.dev');
    
    // Verify page title
    await expect(page).toHaveTitle(/Playwright/);
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/web-demo-homepage.png' });
    
    console.log('✅ Web Demo: Successfully navigated to homepage');
  });

  test('Demo: Element interaction and form handling', async ({ page }) => {
    // Navigate to example form page
    await page.goto('https://the-internet.herokuapp.com/login');
    
    // Fill login form
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Verify successful login
    await expect(page.locator('.flash.success')).toBeVisible();
    await expect(page.locator('.flash.success')).toContainText('You logged into a secure area!');
    
    // Take screenshot of success page
    await page.screenshot({ path: 'test-results/web-demo-login-success.png' });
    
    console.log('✅ Web Demo: Successfully completed login flow');
  });

  test('Demo: Element visibility and interaction', async ({ page }) => {
    // Navigate to dynamic elements page
    await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');
    
    // Verify initial state
    await expect(page.locator('#loading')).not.toBeVisible();
    await expect(page.locator('#finish')).not.toBeVisible();
    
    // Click start button
    await page.click('#start button');
    
    // Wait for loading to complete
    await page.waitForSelector('#finish', { state: 'visible', timeout: 10000 });
    
    // Verify final state
    await expect(page.locator('#finish')).toBeVisible();
    await expect(page.locator('#finish')).toContainText('Hello World!');
    
    console.log('✅ Web Demo: Successfully handled dynamic content loading');
  });

  test('Demo: Navigation and URL verification', async ({ page }) => {
    // Start at a reliable test page
    await page.goto('https://playwright.dev');
    
    // Verify URL
    expect(page.url()).toContain('playwright.dev');
    
    // Verify page content
    await expect(page.locator('h1, .hero__title, [data-testid="hero-title"]')).toBeVisible();
    
    // Verify links are present
    await expect(page.locator('a[href*="docs"]')).toBeVisible();
    
    console.log('✅ Web Demo: Successfully verified page structure and links');
  });

});
