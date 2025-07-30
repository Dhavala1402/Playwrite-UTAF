import { test as base, Page, BrowserContext } from '@playwright/test';
import { PageUtils } from '../utils/page-utils';
import { ApiUtils } from '../utils/api-utils';
import { DataGenerator } from '../utils/data-generator';
import { TestSetupUtils } from '../utils/test-setup-utils';
import { Logger } from '../utils/logger';
import { UserCredentials, TestData } from '../types/index';
import * as fs from 'fs';

// Define custom fixtures with best practices
interface CustomFixtures {
  pageUtils: PageUtils;
  apiUtils: ApiUtils;
  testData: TestData;
  authenticatedPage: Page;
  adminUser: UserCredentials;
  standardUser: UserCredentials;
  logger: Logger;
  performanceTimer: ReturnType<typeof TestSetupUtils.createPerformanceTimer>;
  testId: string;
}

// Helper function to safely get test user
function getTestUser(testData: any, index: number = 0) {
  const user = testData.users[index];
  if (!user || !user.username || !user.email || !user.password) {
    throw new Error(`Test user at index ${index} is invalid or missing required fields`);
  }
  return user;
}

// Extend base test with enhanced custom fixtures
export const test = base.extend<CustomFixtures>({
  // Logger fixture
  logger: async ({}, use) => {
    const logger = Logger.getInstance();
    await use(logger);
  },

  // Performance timer fixture
  performanceTimer: async ({}, use) => {
    const timer = TestSetupUtils.createPerformanceTimer();
    timer.start();
    await use(timer);
    timer.end();
  },

  // Unique test ID fixture
  testId: async ({}, use) => {
    const testId = TestSetupUtils.generateTestId();
    await use(testId);
  },

  // Enhanced page utilities fixture
  pageUtils: async ({ page }, use) => {
    const pageUtils = new PageUtils(page);
    await use(pageUtils);
  },

  // API utilities fixture with enhanced configuration
  apiUtils: async ({ request }, use) => {
    const apiUtils = new ApiUtils(request);
    await use(apiUtils);
  },

  // Test data fixture with validation
  testData: async ({ logger }, use) => {
    logger.info('Generating test data');
    
    const testData: TestData = {
      users: DataGenerator.generateUsers(5),
      products: DataGenerator.generateProducts(10),
      orders: Array.from({ length: 3 }, () => DataGenerator.generateOrder()),
    };

    // Validate test data
    if (!testData.users || testData.users.length === 0) {
      throw new Error('Failed to generate test users');
    }
    if (!testData.products || testData.products.length === 0) {
      throw new Error('Failed to generate test products');
    }

    logger.info(`Generated test data: ${testData.users.length} users, ${testData.products.length} products`);
    await use(testData);
  },

  // Admin user fixture with enhanced validation
  adminUser: async ({ logger }, use) => {
    const adminUser = DataGenerator.generateUser({
      username: 'admin@test.com',
      password: 'AdminPass123!',
      email: 'admin@test.com',
    });

    // Validate admin user
    if (!adminUser.username || !adminUser.password) {
      throw new Error('Failed to generate admin user credentials');
    }

    logger.debug('Generated admin user credentials');
    await use(adminUser);
  },

  // Standard user fixture with enhanced validation
  standardUser: async ({ logger }, use) => {
    const standardUser = DataGenerator.generateUser({
      username: 'user@test.com',
      password: 'UserPass123!',
      email: 'user@test.com',
    });

    // Validate standard user
    if (!standardUser.username || !standardUser.password) {
      throw new Error('Failed to generate standard user credentials');
    }

    logger.debug('Generated standard user credentials');
    await use(standardUser);
  },

  // Enhanced authenticated page fixture with proper setup and cleanup
  authenticatedPage: async ({ browser, standardUser, logger }, use) => {
    logger.info('Setting up authenticated page');
    
    // Create new context with enhanced configuration
    const context = await TestSetupUtils.setupBrowserContext(browser, {
      viewport: { width: 1280, height: 720 },
      locale: 'en-US',
      timezone: 'America/New_York',
    });

    const page = await context.newPage();
    
    try {
      // Setup test environment
      await TestSetupUtils.setupTestEnvironment(page, {
        clearCookies: true,
        clearLocalStorage: true,
        clearSessionStorage: true,
      });

      // Perform authentication
      await TestSetupUtils.authenticateUser(page, {
        username: standardUser.username,
        password: standardUser.password,
        loginUrl: '/login',
        usernameSelector: '[data-testid="username"]',
        passwordSelector: '[data-testid="password"]',
        submitSelector: '[data-testid="login-button"]',
        successUrl: '**/dashboard',
      });

      logger.info('Authenticated page setup completed');
      await use(page);
      
    } catch (error) {
      logger.error('Failed to setup authenticated page', error);
      // Take screenshot for debugging
      await page.screenshot({ 
        path: `screenshots/auth-setup-error-${Date.now()}.png`,
        fullPage: true, 
      });
      throw error;
    } finally {
      // Cleanup
      await TestSetupUtils.cleanupTestEnvironment(page, {
        clearCookies: true,
        clearLocalStorage: true,
        clearSessionStorage: true,
      });
      await context.close();
      logger.info('Authenticated page cleanup completed');
    }
  },
});

// Enhanced test hooks with logging and error handling
export const beforeEach = test.beforeEach;
export const afterEach = test.afterEach;
export const beforeAll = test.beforeAll;
export const afterAll = test.afterAll;

// Custom expect with enhanced error messages
export { expect } from '@playwright/test';

// Export the helper function for use in tests
export { getTestUser };

// Enhanced test setup utilities
export class TestSetup {
  private static logger = Logger.getInstance();

  /**
   * Setup test with authentication and enhanced error handling
   */
  static async withAuth(page: Page, credentials: UserCredentials): Promise<void> {
    await TestSetupUtils.authenticateUser(page, {
      username: credentials.username,
      password: credentials.password,
    });
  }

  /**
   * Setup test with specific viewport and device simulation
   */
  static async withViewport(page: Page, width: number, height: number): Promise<void> {
    await page.setViewportSize({ width, height });
    this.logger.debug(`Set viewport to ${width}x${height}`);
  }

  /**
   * Setup test with geolocation and permissions
   */
  static async withGeolocation(
    context: BrowserContext, 
    latitude: number, 
    longitude: number,
  ): Promise<void> {
    await context.setGeolocation({ latitude, longitude });
    await context.grantPermissions(['geolocation']);
    this.logger.debug(`Set geolocation to ${latitude}, ${longitude}`);
  }

  /**
   * Setup test with offline mode simulation
   */
  static async withOfflineMode(context: BrowserContext): Promise<void> {
    await context.setOffline(true);
    this.logger.debug('Enabled offline mode');
  }

  /**
   * Setup test with network throttling
   */
  static async withSlowNetwork(page: Page): Promise<void> {
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 50 * 1024, // 50 KB/s
      uploadThroughput: 20 * 1024,   // 20 KB/s
      latency: 500, // 500ms
    });
    this.logger.debug('Applied network throttling');
  }

  /**
   * Setup test with custom user agent
   */
  static async withUserAgent(page: Page, userAgent: string): Promise<void> {
    await page.setExtraHTTPHeaders({
      'User-Agent': userAgent,
    });
    this.logger.debug(`Set custom user agent: ${userAgent}`);
  }

  /**
   * Setup test with local storage data
   */
  static async withLocalStorage(page: Page, data: Record<string, string>): Promise<void> {
    await page.addInitScript((storageData) => {
      Object.entries(storageData).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
    }, data);
    this.logger.debug('Set local storage data');
  }

  /**
   * Setup test with session storage data
   */
  static async withSessionStorage(page: Page, data: Record<string, string>): Promise<void> {
    await page.addInitScript((storageData) => {
      Object.entries(storageData).forEach(([key, value]) => {
        sessionStorage.setItem(key, value);
      });
    }, data);
    this.logger.debug('Set session storage data');
  }

  /**
   * Setup test with cookies
   */
  static async withCookies(context: BrowserContext, cookies: Array<{
    name: string;
    value: string;
    domain?: string;
    path?: string;
  }>): Promise<void> {
    await context.addCookies(cookies.map(cookie => ({
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain || 'localhost',
      path: cookie.path || '/',
    })));
    this.logger.debug(`Added ${cookies.length} cookies`);
  }

  /**
   * Setup API mocking for tests
   */
  static async withApiMocking(page: Page, mocks: Array<{
    url: string;
    method?: string;
    response: any;
    status?: number;
  }>): Promise<void> {
    for (const mock of mocks) {
      await page.route(mock.url, route => {
        if (mock.method && route.request().method() !== mock.method) {
          route.continue();
          return;
        }
        
        route.fulfill({
          status: mock.status || 200,
          contentType: 'application/json',
          body: JSON.stringify(mock.response),
        });
      });
    }
    this.logger.debug(`Setup ${mocks.length} API mocks`);
  }
}

// Enhanced test cleanup utilities
export class TestCleanup {
  private static logger = Logger.getInstance();

  /**
   * Clean up test data via API with enhanced error handling
   */
  static async cleanupTestData(apiUtils: ApiUtils, testId: string): Promise<void> {
    try {
      await apiUtils.delete(`/api/test-data/${testId}`);
      this.logger.debug(`Cleaned up test data for ${testId}`);
    } catch (error) {
      this.logger.warn(`Failed to cleanup test data for ${testId}:`, error);
      // Don't throw error during cleanup
    }
  }

  /**
   * Clear browser storage with validation
   */
  static async clearStorage(page: Page): Promise<void> {
    try {
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      this.logger.debug('Cleared browser storage');
    } catch (error) {
      this.logger.warn('Failed to clear storage:', error);
    }
  }

  /**
   * Clear cookies with error handling
   */
  static async clearCookies(context: BrowserContext): Promise<void> {
    try {
      await context.clearCookies();
      this.logger.debug('Cleared cookies');
    } catch (error) {
      this.logger.warn('Failed to clear cookies:', error);
    }
  }

  /**
   * Reset database state with validation
   */
  static async resetDatabase(apiUtils: ApiUtils): Promise<void> {
    try {
      await apiUtils.post('/api/admin/reset-database', {});
      this.logger.debug('Reset database state');
    } catch (error) {
      this.logger.warn('Failed to reset database:', error);
    }
  }

  /**
   * Capture test artifacts on failure
   */
  static async captureTestArtifacts(page: Page, testName: string): Promise<void> {
    try {
      const timestamp = Date.now();
      const safeName = testName.replace(/[^a-zA-Z0-9]/g, '-');

      // Take screenshot
      await page.screenshot({
        path: `screenshots/failure-${safeName}-${timestamp}.png`,
        fullPage: true,
      });

      // Save page content
      const html = await page.content();
      fs.writeFileSync(
        `screenshots/failure-${safeName}-${timestamp}.html`,
        html,
      );

      this.logger.info(`Captured test artifacts for ${testName}`);
    } catch (error) {
      this.logger.error('Failed to capture test artifacts:', error);
    }
  }
}
