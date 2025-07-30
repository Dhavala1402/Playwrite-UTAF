import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * IGS Playwright Framework Configuration
 * Comprehensive cross-platform testing configuration
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',

  /* Global test settings */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1, // Single worker as requested
  timeout: 30 * 1000, // 30 seconds
  expect: {
    timeout: 10 * 1000, // 10 seconds for assertions
  },

  /* Enhanced reporting */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['line'],
  ],

  /* Global test options */
  use: {
    /* Base URL for web testing */
    baseURL: process.env.BASE_URL || 'https://playwright.dev',

    /* Browser context options */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* Network and timeouts */
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,

    /* Additional context options */
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },

  /* Multiple browser and device projects */
  projects: [
    // Setup project for authentication and data preparation
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      teardown: 'cleanup',
    },

    // Cleanup project
    {
      name: 'cleanup',
      testMatch: /.*\.cleanup\.ts/,
    },

    // Desktop browsers
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },

    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
      dependencies: ['setup'],
    },

    // Mobile devices
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
    },

    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
      dependencies: ['setup'],
    },

    // API testing project
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_BASE_URL || 'https://api.github.com',
      },
      dependencies: ['setup'],
    },
  ],

  /* Web server configuration for local development */
  webServer: process.env.START_LOCAL_SERVER ? {
    command: 'npm run start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  } : undefined,
});
