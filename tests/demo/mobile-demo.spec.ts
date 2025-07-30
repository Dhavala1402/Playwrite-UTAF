import { test, expect, devices } from '@playwright/test';

test.describe('📱 Mobile Platform Demo Tests', () => {

  test('Demo: iPhone viewport and responsive design', async ({ browser }) => {
    // Create mobile context with iPhone 12 settings
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    
    const page = await context.newPage();
    
    // Navigate to responsive test page
    await page.goto('https://playwright.dev');
    
    // Verify mobile viewport
    const viewportSize = page.viewportSize();
    expect(viewportSize?.width).toBe(390);
    expect(viewportSize?.height).toBe(664); // Actual iPhone 12 viewport height
    
    // Check if mobile menu is visible
    await page.screenshot({ path: 'test-results/mobile-demo-iphone.png' });
    
    console.log('✅ Mobile Demo: iPhone viewport test successful');
    
    await context.close();
  });

  test('Demo: Android tablet landscape mode', async ({ browser }) => {
    // Create tablet context
    const context = await browser.newContext({
      ...devices['Galaxy Tab S4'],
    });
    
    const page = await context.newPage();
    
    // Navigate to test page
    await page.goto('https://example.com');
    
    // Verify tablet viewport
    const viewportSize = page.viewportSize();
    expect(viewportSize?.width).toBe(712);
    expect(viewportSize?.height).toBe(1138);
    
    // Take screenshot for verification
    await page.screenshot({ path: 'test-results/mobile-demo-tablet.png' });
    
    console.log('✅ Mobile Demo: Android tablet test successful');
    
    await context.close();
  });

  test('Demo: Touch gestures and mobile interactions', async ({ browser }) => {
    // Create mobile context
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    
    const page = await context.newPage();
    
    // Navigate to a page with interactive elements
    await page.goto('https://the-internet.herokuapp.com/login');
    
    // Simulate touch interactions
    await page.tap('#username');
    await page.fill('#username', 'demo-user');
    
    await page.tap('#password');
    await page.fill('#password', 'demo-password');
    
    // Tap the submit button (mobile touch)
    await page.tap('button[type="submit"]');
    
    // Verify mobile interaction worked
    await expect(page.locator('.flash')).toBeVisible();
    
    console.log('✅ Mobile Demo: Touch gestures test successful');
    
    await context.close();
  });

  test('Demo: Mobile user agent and device detection', async ({ browser }) => {
    // Create mobile context with custom user agent
    const context = await browser.newContext({
      ...devices['iPhone 12'],
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    });
    
    const page = await context.newPage();
    
    // Navigate to a page that will show our user agent in the content
    await page.goto('https://jsonplaceholder.typicode.com/posts/1');
    
    // Verify the page loaded (this confirms our custom user agent worked)
    const content = await page.locator('body').textContent();
    expect(content).toBeTruthy();
    
    // Verify user agent was set correctly by checking the page properties
    const userAgent = await page.evaluate(() => (globalThis as any).navigator.userAgent);
    expect(userAgent).toContain('iPhone');
    expect(userAgent).toContain('Mobile');
    
    console.log('✅ Mobile Demo: User agent verification successful');
    
    await context.close();
  });

  test('Demo: Portrait and landscape orientation simulation', async ({ browser }) => {
    // Test portrait mode
    const portraitContext = await browser.newContext({
      viewport: { width: 375, height: 667 }, // iPhone SE portrait
    });
    
    const portraitPage = await portraitContext.newPage();
    await portraitPage.goto('https://playwright.dev');
    
    // Verify portrait dimensions
    const portraitSize = portraitPage.viewportSize();
    expect(portraitSize?.width).toBe(375);
    expect(portraitSize?.height).toBe(667);
    expect(portraitSize!.width).toBeLessThan(portraitSize!.height);
    
    await portraitPage.screenshot({ path: 'test-results/mobile-demo-portrait.png' });
    await portraitContext.close();
    
    // Test landscape mode
    const landscapeContext = await browser.newContext({
      viewport: { width: 667, height: 375 }, // iPhone SE landscape
    });
    
    const landscapePage = await landscapeContext.newPage();
    await landscapePage.goto('https://playwright.dev');
    
    // Verify landscape dimensions
    const landscapeSize = landscapePage.viewportSize();
    expect(landscapeSize?.width).toBe(667);
    expect(landscapeSize?.height).toBe(375);
    expect(landscapeSize!.width).toBeGreaterThan(landscapeSize!.height);
    
    await landscapePage.screenshot({ path: 'test-results/mobile-demo-landscape.png' });
    await landscapeContext.close();
    
    console.log('✅ Mobile Demo: Orientation testing successful');
  });

  test('Demo: Multiple mobile devices comparison', async ({ browser }) => {
    // Test on different mobile devices
    const devices_to_test = [
      { name: 'iPhone 12', device: devices['iPhone 12'] },
      { name: 'Pixel 5', device: devices['Pixel 5'] },
      { name: 'Galaxy S9+', device: devices['Galaxy S9+'] },
    ];
    
    for (const deviceInfo of devices_to_test) {
      const context = await browser.newContext({
        ...deviceInfo.device,
      });
      
      const page = await context.newPage();
      await page.goto('https://playwright.dev');
      
      // Verify page loads correctly on each device
      await expect(page.locator('h1, .hero__title, [data-testid="hero-title"]')).toBeVisible();
      
      // Take device-specific screenshot
      await page.screenshot({ 
        path: `test-results/mobile-demo-${deviceInfo.name.toLowerCase().replace(/\s+/g, '-')}.png`,
      });
      
      console.log(`✅ Mobile Demo: ${deviceInfo.name} test successful`);
      
      await context.close();
    }
  });

});
