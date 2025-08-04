# IGS Playwright Framework
## Comprehensive Testing Framework Documentation

**Version:** 1.0.0  
**Created:** August 2025  
**Team:** IGS Development Team  

---

## Table of Contents

1. [Overview](#overview)
2. [Installation & Setup](#installation--setup)
3. [Framework Architecture](#framework-architecture)
4. [Core Utilities](#core-utilities)
5. [Test Structure](#test-structure)
6. [API Testing](#api-testing)
7. [Web Testing](#web-testing)
8. [Mobile Testing](#mobile-testing)
9. [Data Management](#data-management)
10. [Configuration](#configuration)
11. [Reporting](#reporting)
12. [CI/CD Integration](#cicd-integration)
13. [Best Practices](#best-practices)
14. [Troubleshooting](#troubleshooting)

---

## 1. Overview

The IGS Playwright Framework is a comprehensive testing solution built on Microsoft Playwright, designed to provide robust, scalable, and maintainable test automation for web, API, and mobile applications.

### 1.1 Key Features

- **Multi-Platform Support** - Web, API, and Mobile testing in a unified framework
- **TypeScript First** - Full type safety and excellent IDE support
- **Modular Architecture** - Reusable utilities and page objects
- **Advanced Reporting** - Built-in HTML reports with Allure integration
- **CI/CD Ready** - GitHub Actions integration and Docker support
- **Performance Optimized** - Parallel execution and resource management

### 1.2 Framework Benefits

- **Consistency** - Standardized patterns across all test types
- **Maintainability** - Clean architecture with separation of concerns
- **Scalability** - Designed to grow with your testing needs
- **Developer Experience** - Rich tooling and documentation
- **Quality Assurance** - Built-in best practices and standards

---

## 2. Installation & Setup

### 2.1 Prerequisites

- **Node.js 18 or higher**
- **Git** for version control
- **Visual Studio Code** (recommended IDE)
- **Microsoft Edge, Chrome, Firefox, or Safari** for browser testing

### 2.2 Quick Start

#### Clone the Repository
```bash
git clone https://github.com/IGSRepo/igs-playwright-framework.git
cd igs-playwright-framework
```

#### Install Dependencies
```bash
npm install
```

#### Install Playwright Browsers
```bash
npx playwright install
```

#### Run Setup
```bash
npm run setup
```

#### Verify Installation
```bash
npm test
```

### 2.3 VS Code Setup

#### Recommended Extensions
- **Playwright Test for VS Code** - Test runner integration
- **TypeScript Importer** - Auto import functionality
- **ESLint** - Code quality and linting
- **Prettier** - Code formatting
- **GitLens** - Git integration enhancements

#### Workspace Configuration
The framework includes VS Code workspace configuration with:
- Pre-configured tasks for common operations
- Debug configurations for test debugging
- Recommended extensions and settings
- Integrated terminal setup

---

## 3. Framework Architecture

### 3.1 Directory Structure

```
igs-playwright-framework/
├── src/                    # Source code
│   ├── utils/             # Utility classes
│   │   ├── api-utils.ts
│   │   ├── page-utils.ts
│   │   ├── data-generator.ts
│   │   ├── config-manager.ts
│   │   ├── logger.ts
│   │   ├── file-utils.ts
│   │   ├── database-utils.ts
│   │   └── test-setup-utils.ts
│   ├── pages/             # Page Object Models
│   │   ├── base-page.ts
│   │   ├── login-page.ts
│   │   └── dashboard-page.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   └── fixtures/          # Test fixtures and setup
│       └── test-fixtures.ts
├── tests/                 # Test files
│   ├── web/              # Web application tests
│   ├── api/              # API tests
│   └── mobile/           # Mobile application tests
├── test-data/            # Test data files
├── config/               # Configuration files
├── test-results/         # Test execution results
├── playwright-report/    # HTML test reports
└── allure-results/       # Allure report data
```

### 3.2 Architecture Principles

#### Separation of Concerns
- **Utils**: Reusable functionality across test types
- **Pages**: UI interaction patterns and element management
- **Tests**: Test logic and assertions
- **Fixtures**: Test setup, teardown, and data management

#### Dependency Injection
- Test fixtures provide configured instances
- Utils are injected where needed
- Configuration is centralized and environment-aware

#### Type Safety
- Full TypeScript implementation
- Strongly typed API responses
- Type-safe configuration management
- Generic utilities for reusability

---

## 4. Core Utilities

The framework provides 8 core utility classes with 85+ reusable methods:

### 4.1 ApiUtils (11 Methods)

**Purpose**: HTTP request handling and API interaction

#### Key Methods:
- `get<T>(url, options)`: Perform GET request with type safety
- `post<T>(url, data, options)`: Send POST request with payload
- `put<T>(url, data, options)`: Update resources with PUT
- `patch<T>(url, data, options)`: Partial updates with PATCH
- `delete<T>(url, options)`: Remove resources
- `uploadFile<T>(url, filePath, fieldName)`: File upload support
- `assertStatus(response, expectedStatus)`: Status code validation
- `assertContainsData(response, path, expectedValue)`: Data validation
- `waitForCondition(requestFn, condition)`: Polling with conditions
- `retryRequest(requestFn, options)`: Automatic retry with backoff

#### Example Usage:
```typescript
// Basic API testing
const response = await apiUtils.get('/api/users');
apiUtils.assertStatus(response, 200);

// Advanced usage with retries
const result = await apiUtils.retryRequest(
  () => apiUtils.get('/api/status'),
  { maxRetries: 3, condition: (r) => r.status === 200 }
);
```

### 4.2 PageUtils (16 Methods)

**Purpose**: Web page interaction and element management

#### Key Methods:
- `waitForElement(page, selector, options)`: Robust element waiting
- `clickElement(page, selector, options)`: Safe clicking with waits
- `fillInput(page, selector, value, options)`: Input field handling
- `selectDropdown(page, selector, value)`: Dropdown selection
- `uploadFile(page, selector, filePath)`: File upload handling
- `takeScreenshot(page, filename, options)`: Screenshot capture
- `scrollToElement(page, selector)`: Scroll management
- `waitForPageLoad(page, options)`: Page load detection
- `getElementText(page, selector)`: Text content extraction
- `isElementVisible(page, selector)`: Visibility checking
- `handleAlert(page, action, text)`: Alert dialog management
- `switchToFrame(page, frameSelector)`: Frame switching
- `executeScript(page, script, args)`: Custom JavaScript execution
- `waitForNetworkIdle(page, options)`: Network activity monitoring
- `clearBrowserData(page)`: Cache and data clearing
- `setViewport(page, width, height)`: Viewport management

#### Example Usage:
```typescript
// Page interaction workflow
await pageUtils.waitForPageLoad(page);
await pageUtils.fillInput(page, '#username', 'testuser');
await pageUtils.fillInput(page, '#password', 'password123');
await pageUtils.clickElement(page, '#login-button');
await pageUtils.waitForElement(page, '.dashboard');
```

### 4.3 DataGenerator (10 Methods)

**Purpose**: Test data generation and management

#### Key Methods:
- `generateUser(options)`: Create user test data
- `generateEmail(domain)`: Generate unique email addresses
- `generatePassword(length, options)`: Secure password generation
- `generatePhoneNumber(format)`: Phone number generation
- `generateAddress(country)`: Address data generation
- `generateCompany()`: Company information
- `generateProduct(category)`: Product data
- `generateCreditCard(type)`: Payment data (test only)
- `generateDate(range)`: Date and time generation
- `generateUUID()`: Unique identifier generation

#### Example Usage:
```typescript
// Generate complete user data
const testUser = dataGenerator.generateUser({
  role: 'admin',
  department: 'IT',
  includeAddress: true
});

// Generate test data for forms
const formData = {
  email: dataGenerator.generateEmail('testdomain.com'),
  password: dataGenerator.generatePassword(12, { includeSymbols: true }),
  phone: dataGenerator.generatePhoneNumber('US')
};
```

### 4.4 ConfigManager (8 Methods)

**Purpose**: Configuration and environment management

#### Key Methods:
- `get(key, defaultValue)`: Retrieve configuration values
- `getRequired(key)`: Get required configuration with validation
- `getEnvironment()`: Current environment detection
- `getBaseUrl(service)`: Service URL management
- `getTimeout(operation)`: Timeout configuration
- `getDatabaseConfig()`: Database connection settings
- `getApiKey(service)`: API key management
- `isFeatureEnabled(feature)`: Feature flag checking

#### Example Usage:
```typescript
// Environment-specific configuration
const baseUrl = configManager.getBaseUrl('api');
const timeout = configManager.getTimeout('api');
const dbConfig = configManager.getDatabaseConfig();

// Feature flags
if (configManager.isFeatureEnabled('advanced-reporting')) {
  // Enable advanced reporting features
}
```

### 4.5 Logger (5 Methods)

**Purpose**: Logging and debugging support

#### Key Methods:
- `info(message, data)`: Information logging
- `error(message, error, context)`: Error logging
- `debug(message, data)`: Debug information
- `warn(message, data)`: Warning messages
- `setLevel(level)`: Log level configuration

#### Example Usage:
```typescript
// Comprehensive logging
logger.info('Starting user creation test', { userId: testUser.id });
logger.debug('API request details', { url, method, headers });
logger.error('Test failed', error, { testName, environment });
```

### 4.6 FileUtils (10 Methods)

**Purpose**: File system operations and management

#### Key Methods:
- `readFile(filePath, encoding)`: File reading with encoding support
- `writeFile(filePath, content, options)`: File writing operations
- `copyFile(source, destination)`: File copying
- `deleteFile(filePath)`: File deletion
- `createDirectory(dirPath)`: Directory creation
- `listFiles(dirPath, pattern)`: File listing with patterns
- `getFileSize(filePath)`: File size information
- `getFileStats(filePath)`: File metadata
- `ensureDirectory(dirPath)`: Directory existence ensuring
- `cleanDirectory(dirPath)`: Directory cleanup

#### Example Usage:
```typescript
// Test data file management
const testData = await fileUtils.readFile('./test-data/users.json');
await fileUtils.writeFile('./reports/results.json', JSON.stringify(results));

// File system operations
await fileUtils.ensureDirectory('./test-results');
await fileUtils.copyFile('./templates/report.html', './reports/current.html');
```

### 4.7 DatabaseUtils (8 Methods)

**Purpose**: Database operations for test data management

#### Key Methods:
- `connect(config)`: Database connection establishment
- `disconnect()`: Connection cleanup
- `executeQuery(sql, params)`: SQL query execution
- `insert(table, data)`: Data insertion
- `update(table, data, where)`: Data updates
- `delete(table, where)`: Data deletion
- `truncateTable(table)`: Table cleanup
- `seedTestData(dataset)`: Test data seeding

#### Example Usage:
```typescript
// Test data management
await databaseUtils.connect(dbConfig);
await databaseUtils.seedTestData('users');

// Direct database operations
const user = await databaseUtils.insert('users', userData);
await databaseUtils.update('users', { status: 'active' }, { id: user.id });
```

### 4.8 TestSetupUtils (7 Methods)

**Purpose**: Test environment setup and configuration

#### Key Methods:
- `setupTestEnvironment(config)`: Environment initialization
- `teardownTestEnvironment()`: Environment cleanup
- `createTestUser(role)`: Test user creation
- `cleanupTestData()`: Test data cleanup
- `initializeMockServices()`: Mock service setup
- `configureTestBrowser(options)`: Browser configuration
- `generateTestReport(results)`: Test reporting

#### Example Usage:
```typescript
// Test setup and teardown
await testSetupUtils.setupTestEnvironment({
  mockServices: true,
  seedData: ['users', 'products']
});

// Test user management
const adminUser = await testSetupUtils.createTestUser('admin');
const regularUser = await testSetupUtils.createTestUser('user');
```

---

## 5. Test Structure

### 5.1 Test Organization

#### Test Categories
- **Smoke Tests**: Critical functionality verification
- **Regression Tests**: Full feature coverage
- **Integration Tests**: System interaction testing
- **End-to-End Tests**: Complete user workflows

#### Naming Conventions
```typescript
// File naming: feature.test-type.spec.ts
user-management.smoke.spec.ts
authentication.regression.spec.ts
checkout-flow.e2e.spec.ts
payment-api.integration.spec.ts
```

#### Test Structure Pattern
```typescript
test.describe('Feature Name', () => {
  test.beforeAll(async () => {
    // One-time setup
  });

  test.beforeEach(async ({ page }) => {
    // Per-test setup
  });

  test('should perform specific action with expected result', async ({ page }) => {
    // Arrange: Set up test data and initial state
    // Act: Perform the action being tested
    // Assert: Verify the expected outcome
  });

  test.afterEach(async ({ page }) => {
    // Per-test cleanup
  });

  test.afterAll(async () => {
    // One-time cleanup
  });
});
```

### 5.2 Page Object Model

#### Base Page Pattern
```typescript
export class BasePage {
  constructor(protected page: Page) {}

  protected async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  protected async takeScreenshot(name: string): Promise<void> {
    await pageUtils.takeScreenshot(this.page, name);
  }
}
```

#### Specific Page Implementation
```typescript
export class LoginPage extends BasePage {
  private readonly selectors = {
    usernameInput: '#username',
    passwordInput: '#password',
    loginButton: '#login-button',
    errorMessage: '.error-message'
  };

  async login(username: string, password: string): Promise<void> {
    await pageUtils.fillInput(this.page, this.selectors.usernameInput, username);
    await pageUtils.fillInput(this.page, this.selectors.passwordInput, password);
    await pageUtils.clickElement(this.page, this.selectors.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    return await pageUtils.getElementText(this.page, this.selectors.errorMessage);
  }
}
```

### 5.3 Test Fixtures

#### Custom Fixtures
```typescript
export const test = baseTest.extend<{
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  apiUtils: ApiUtils;
  testUser: User;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  apiUtils: async ({ request }, use) => {
    await use(new ApiUtils(request));
  },

  testUser: async ({}, use) => {
    const user = await testSetupUtils.createTestUser('standard');
    await use(user);
    await testSetupUtils.cleanupTestUser(user.id);
  }
});
```

---

## 6. API Testing

### 6.1 API Test Architecture

#### Request/Response Pattern
```typescript
test.describe('User API', () => {
  test('should create user successfully', async ({ apiUtils }) => {
    // Arrange
    const userData = dataGenerator.generateUser();

    // Act
    const response = await apiUtils.post('/api/users', userData);

    // Assert
    apiUtils.assertStatus(response, 201);
    apiUtils.assertContainsData(response, 'id', expect.any(String));
    apiUtils.assertContainsData(response, 'email', userData.email);
  });
});
```

#### Authentication Testing
```typescript
test.describe('API Authentication', () => {
  test('should reject requests without authentication', async ({ apiUtils }) => {
    const response = await apiUtils.get('/api/protected');
    apiUtils.assertStatus(response, 401);
  });

  test('should accept requests with valid token', async ({ apiUtils }) => {
    const token = await authUtils.getValidToken();
    const response = await apiUtils.get('/api/protected', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    apiUtils.assertStatus(response, 200);
  });
});
```

### 6.2 API Validation Patterns

#### Schema Validation
```typescript
test('should return valid user schema', async ({ apiUtils }) => {
  const response = await apiUtils.get('/api/users/1');
  
  await apiUtils.assertSchema(response, {
    type: 'object',
    properties: {
      id: { type: 'string' },
      email: { type: 'string', format: 'email' },
      name: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' }
    },
    required: ['id', 'email', 'name']
  });
});
```

#### Error Handling
```typescript
test('should handle validation errors appropriately', async ({ apiUtils }) => {
  const invalidData = { email: 'invalid-email' };
  
  const response = await apiUtils.post('/api/users', invalidData);
  
  apiUtils.assertStatus(response, 400);
  apiUtils.assertContainsData(response, 'error.field', 'email');
  apiUtils.assertContainsData(response, 'error.message', expect.stringContaining('valid email'));
});
```

### 6.3 Performance Testing

#### Response Time Validation
```typescript
test('should respond within acceptable time limits', async ({ apiUtils }) => {
  const startTime = Date.now();
  
  const response = await apiUtils.get('/api/users');
  
  const responseTime = Date.now() - startTime;
  expect(responseTime).toBeLessThan(2000); // 2 seconds
  apiUtils.assertStatus(response, 200);
});
```

#### Load Testing Patterns
```typescript
test('should handle concurrent requests', async ({ apiUtils }) => {
  const requests = Array.from({ length: 10 }, () => 
    apiUtils.get('/api/users')
  );
  
  const responses = await Promise.all(requests);
  
  responses.forEach(response => {
    apiUtils.assertStatus(response, 200);
  });
});
```

---

## 7. Web Testing

### 7.1 UI Component Testing

#### Form Interaction
```typescript
test('should handle user registration form', async ({ page, loginPage }) => {
  const userData = dataGenerator.generateUser();
  
  await page.goto('/register');
  await loginPage.fillRegistrationForm(userData);
  await loginPage.submitRegistration();
  
  await expect(page.locator('.success-message')).toBeVisible();
  await expect(page.locator('.success-message')).toContainText('Registration successful');
});
```

#### Navigation Testing
```typescript
test('should navigate through application sections', async ({ page, dashboardPage }) => {
  await page.goto('/dashboard');
  
  await dashboardPage.navigateToUsers();
  expect(page.url()).toContain('/users');
  
  await dashboardPage.navigateToSettings();
  expect(page.url()).toContain('/settings');
  
  await dashboardPage.navigateToReports();
  expect(page.url()).toContain('/reports');
});
```

### 7.2 Cross-Browser Testing

#### Browser-Specific Tests
```typescript
test.describe('Cross-browser compatibility', () => {
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test(`should work correctly on ${browserName}`, async ({ page }) => {
      await page.goto('/application');
      await expect(page.locator('.main-content')).toBeVisible();
      
      // Browser-specific assertions
      if (browserName === 'webkit') {
        // Safari-specific tests
      }
    });
  });
});
```

### 7.3 Responsive Design Testing

#### Viewport Testing
```typescript
test.describe('Responsive design', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 }
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`should display correctly on ${name}`, async ({ page }) => {
      await pageUtils.setViewport(page, width, height);
      await page.goto('/application');
      
      // Viewport-specific assertions
      const navigation = page.locator('.navigation');
      if (name === 'mobile') {
        await expect(navigation).toHaveClass(/mobile-nav/);
      } else {
        await expect(navigation).toHaveClass(/desktop-nav/);
      }
    });
  });
});
```

### 7.4 Accessibility Testing

#### Accessibility Validation
```typescript
test('should meet accessibility standards', async ({ page }) => {
  await page.goto('/application');
  
  // Check for proper heading structure
  const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
  expect(headings.length).toBeGreaterThan(0);
  
  // Verify alt text on images
  const images = await page.locator('img').all();
  for (const image of images) {
    const altText = await image.getAttribute('alt');
    expect(altText).toBeTruthy();
  }
  
  // Check form labels
  const inputs = await page.locator('input').all();
  for (const input of inputs) {
    const id = await input.getAttribute('id');
    if (id) {
      const label = page.locator(`label[for="${id}"]`);
      await expect(label).toBeVisible();
    }
  }
});
```

---

## 8. Mobile Testing

### 8.1 Mobile Device Emulation

#### Device Configuration
```typescript
test.describe('Mobile application testing', () => {
  test.use({
    ...devices['iPhone 12'],
    geolocation: { longitude: 12.492507, latitude: 41.889938 },
    permissions: ['geolocation']
  });

  test('should work on mobile devices', async ({ page }) => {
    await page.goto('/mobile-app');
    
    // Touch interactions
    await pageUtils.tapElement(page, '.menu-button');
    await expect(page.locator('.mobile-menu')).toBeVisible();
    
    // Swipe gestures
    await pageUtils.swipeLeft(page, '.carousel');
    await expect(page.locator('.carousel-item.active')).toHaveAttribute('data-index', '1');
  });
});
```

#### Progressive Web App Testing
```typescript
test('should function as PWA', async ({ page }) => {
  await page.goto('/pwa');
  
  // Check service worker registration
  const serviceWorker = await page.evaluate(() => 'serviceWorker' in navigator);
  expect(serviceWorker).toBeTruthy();
  
  // Verify offline functionality
  await page.context().setOffline(true);
  await page.reload();
  await expect(page.locator('.offline-indicator')).toBeVisible();
  
  await page.context().setOffline(false);
});
```

### 8.2 Location and Sensor Testing

#### Geolocation Testing
```typescript
test('should handle geolocation features', async ({ page, context }) => {
  await context.setGeolocation({ latitude: 40.7128, longitude: -74.0060 });
  await context.grantPermissions(['geolocation']);
  
  await page.goto('/location-app');
  await pageUtils.clickElement(page, '.get-location-button');
  
  await expect(page.locator('.location-display')).toContainText('New York');
});
```

#### Camera and Media Testing
```typescript
test('should handle camera access', async ({ page, context }) => {
  await context.grantPermissions(['camera']);
  
  await page.goto('/camera-app');
  await pageUtils.clickElement(page, '.camera-button');
  
  await expect(page.locator('.camera-preview')).toBeVisible();
});
```

---

## 9. Data Management

### 9.1 Test Data Strategies

#### Dynamic Data Generation
```typescript
test.describe('User management with dynamic data', () => {
  test('should create users with various profiles', async ({ page, apiUtils }) => {
    const userProfiles = [
      { role: 'admin', department: 'IT' },
      { role: 'user', department: 'Sales' },
      { role: 'guest', department: null }
    ];

    for (const profile of userProfiles) {
      const userData = dataGenerator.generateUser(profile);
      
      const response = await apiUtils.post('/api/users', userData);
      apiUtils.assertStatus(response, 201);
      
      // Verify user in UI
      await page.goto('/users');
      await expect(page.locator(`text=${userData.email}`)).toBeVisible();
    }
  });
});
```

#### Data Seeding and Cleanup
```typescript
test.describe('Tests with seeded data', () => {
  test.beforeAll(async () => {
    await databaseUtils.connect();
    await databaseUtils.seedTestData('users');
    await databaseUtils.seedTestData('products');
  });

  test.afterAll(async () => {
    await databaseUtils.cleanupTestData();
    await databaseUtils.disconnect();
  });

  test('should work with pre-seeded data', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('.user-count')).toHaveText('10 users');
    await expect(page.locator('.product-count')).toHaveText('50 products');
  });
});
```

### 9.2 External Data Integration

#### CSV Data Loading
```typescript
test('should process CSV data files', async ({ page }) => {
  const csvData = await fileUtils.readFile('./test-data/users.csv');
  const users = csvData.split('\n').slice(1).map(row => {
    const [name, email, role] = row.split(',');
    return { name, email, role };
  });

  for (const user of users) {
    await page.goto('/create-user');
    await pageUtils.fillInput(page, '#name', user.name);
    await pageUtils.fillInput(page, '#email', user.email);
    await pageUtils.selectDropdown(page, '#role', user.role);
    await pageUtils.clickElement(page, '#submit');
    
    await expect(page.locator('.success-message')).toBeVisible();
  }
});
```

#### JSON Data Management
```typescript
test('should handle complex JSON data structures', async ({ apiUtils }) => {
  const testData = await fileUtils.readFile('./test-data/complex-orders.json');
  const orders = JSON.parse(testData);

  for (const order of orders) {
    const response = await apiUtils.post('/api/orders', order);
    apiUtils.assertStatus(response, 201);
    
    // Validate nested data structures
    apiUtils.assertContainsData(response, 'customer.id', order.customer.id);
    apiUtils.assertContainsData(response, 'items.length', order.items.length);
  }
});
```

---

## 10. Configuration

### 10.1 Environment Configuration

#### Configuration Files
```typescript
// config/development.json
{
  "baseUrl": "http://localhost:3000",
  "apiUrl": "http://localhost:3001/api",
  "database": {
    "host": "localhost",
    "port": 5432,
    "database": "test_db"
  },
  "timeouts": {
    "default": 30000,
    "api": 15000,
    "pageLoad": 60000
  }
}

// config/production.json
{
  "baseUrl": "https://app.production.com",
  "apiUrl": "https://api.production.com/v1",
  "database": {
    "host": "prod-db.company.com",
    "port": 5432,
    "database": "production_db"
  },
  "timeouts": {
    "default": 45000,
    "api": 30000,
    "pageLoad": 90000
  }
}
```

#### Environment Variables
```typescript
// .env.example
NODE_ENV=development
API_KEY=your-api-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/testdb
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpassword123
ENABLE_SCREENSHOTS=true
ENABLE_VIDEO=false
PARALLEL_WORKERS=4
```

### 10.2 Playwright Configuration

#### Advanced Configuration
```typescript
// playwright.config.ts
export default defineConfig({
  // Test directory and pattern matching
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  
  // Global settings
  timeout: 30000,
  globalTimeout: 60 * 60 * 1000, // 1 hour
  expect: { timeout: 10000 },
  
  // Parallel execution
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  
  // Retry configuration
  retries: process.env.CI ? 2 : 1,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  
  // Global setup and teardown
  globalSetup: require.resolve('./src/fixtures/global-setup'),
  globalTeardown: require.resolve('./src/fixtures/global-teardown'),
  
  // Browser and device configuration
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] }
    }
  ],
  
  // Web server configuration
  webServer: {
    command: 'npm run start:test',
    port: 3000,
    reuseExistingServer: !process.env.CI
  }
});
```

### 10.3 Feature Flags

#### Feature Flag Management
```typescript
class FeatureFlags {
  private static flags = {
    'advanced-reporting': process.env.ENABLE_ADVANCED_REPORTING === 'true',
    'parallel-api-tests': process.env.ENABLE_PARALLEL_API === 'true',
    'visual-regression': process.env.ENABLE_VISUAL_REGRESSION === 'true',
    'performance-monitoring': process.env.ENABLE_PERFORMANCE === 'true'
  };

  static isEnabled(flag: string): boolean {
    return this.flags[flag] || false;
  }

  static enableFor(test: string, flag: string): boolean {
    // Conditional feature enablement
    if (flag === 'visual-regression' && test.includes('mobile')) {
      return false; // Disable for mobile tests
    }
    return this.isEnabled(flag);
  }
}

// Usage in tests
test.describe('Advanced features', () => {
  test.skip(!FeatureFlags.isEnabled('advanced-reporting'), 'Advanced reporting disabled');
  
  test('should generate advanced reports', async ({ page }) => {
    // Advanced reporting test logic
  });
});
```

---

## 11. Reporting

### 11.1 Built-in HTML Reports

#### HTML Report Features
- **Test Results Overview**: Pass/fail statistics and execution time
- **Detailed Test Information**: Steps, screenshots, and error details
- **Interactive Timeline**: Visual test execution timeline
- **Filtering and Search**: Filter by status, browser, or test name
- **Artifacts**: Screenshots, videos, and traces for failed tests

#### Generating Reports
```bash
# Run tests and generate HTML report
npm test

# Open HTML report in browser
npm run report
```

### 11.2 Allure Integration

#### Allure Report Setup
```typescript
// Install Allure dependencies
npm install -D allure-playwright @playwright/test

// Generate Allure results
npm run test

// Generate and view Allure report
npm run allure:generate
npm run allure:open
```

#### Enhanced Allure Reporting
```typescript
import { allure } from 'allure-playwright';

test('should create user with detailed reporting', async ({ page }) => {
  await allure.epic('User Management');
  await allure.feature('User Creation');
  await allure.story('Create Standard User');
  await allure.severity('critical');
  
  await allure.step('Navigate to user creation page', async () => {
    await page.goto('/create-user');
  });
  
  await allure.step('Fill user information', async () => {
    const userData = dataGenerator.generateUser();
    await pageUtils.fillInput(page, '#name', userData.name);
    await pageUtils.fillInput(page, '#email', userData.email);
  });
  
  await allure.step('Submit and verify creation', async () => {
    await pageUtils.clickElement(page, '#submit');
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

### 11.3 Custom Reporting

#### Custom Report Generation
```typescript
class CustomReporter {
  private results: TestResult[] = [];

  onTestEnd(test: TestCase, result: TestResult): void {
    this.results.push({
      title: test.title,
      status: result.status,
      duration: result.duration,
      error: result.error?.message,
      attachments: result.attachments
    });
  }

  onEnd(): void {
    const report = {
      summary: this.generateSummary(),
      details: this.results,
      timestamp: new Date().toISOString()
    };
    
    fileUtils.writeFile('./reports/custom-report.json', JSON.stringify(report, null, 2));
  }

  private generateSummary() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    
    return { total, passed, failed, passRate: (passed / total) * 100 };
  }
}
```

#### Integration with External Tools

```typescript
// Slack notification integration
class SlackReporter {
  static async sendSummary(results: TestResults): Promise<void> {
    const webhook = configManager.get('SLACK_WEBHOOK_URL');
    if (!webhook) return;

    const message = {
      text: `Test Execution Complete`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Test Results Summary*\n✅ Passed: ${results.passed}\n❌ Failed: ${results.failed}\n⏱️ Duration: ${results.duration}ms`
          }
        }
      ]
    };

    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
  }
}
```

---

## 12. CI/CD Integration

### 12.1 GitHub Actions

#### Complete Workflow
```yaml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
        
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps ${{ matrix.browser }}
        
      - name: Run Playwright tests
        run: npm test -- --project=${{ matrix.browser }}
        env:
          CI: true
          
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report-${{ matrix.browser }}
          path: playwright-report/
          retention-days: 30
          
      - name: Upload Allure results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: allure-results-${{ matrix.browser }}
          path: allure-results/
          retention-days: 30

  deploy-reports:
    needs: test
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Download all artifacts
        uses: actions/download-artifact@v3
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./playwright-report
```

#### Parallel Execution Strategy
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - name: Run tests
        run: npx playwright test --shard=${{ matrix.shard }}/${{ strategy.job-total }}
```

### 12.2 Docker Integration

#### Dockerfile for Testing
```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Set environment variables
ENV CI=true
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Run tests
CMD ["npm", "test"]
```

#### Docker Compose for Full Environment
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=test
      - DATABASE_URL=postgresql://test:test@db:5432/testdb
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=testdb
      - POSTGRES_USER=test
      - POSTGRES_PASSWORD=test
    ports:
      - "5432:5432"

  tests:
    build: .
    command: npm test
    depends_on:
      - app
      - db
    volumes:
      - ./test-results:/app/test-results
      - ./playwright-report:/app/playwright-report
```

### 12.3 Integration with Other CI Systems

#### Jenkins Pipeline
```groovy
pipeline {
    agent any
    
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install'
            }
        }
        
        stage('Run Tests') {
            parallel {
                stage('Chrome Tests') {
                    steps {
                        sh 'npm run test:chrome'
                    }
                }
                stage('Firefox Tests') {
                    steps {
                        sh 'npm run test:firefox'
                    }
                }
                stage('API Tests') {
                    steps {
                        sh 'npm run test:api'
                    }
                }
            }
        }
        
        stage('Generate Reports') {
            steps {
                sh 'npm run allure:generate'
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'allure-report',
                    reportFiles: 'index.html',
                    reportName: 'Allure Report'
                ])
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
            junit 'test-results/junit.xml'
        }
    }
}
```

---

## 13. Best Practices

### 13.1 Test Design Principles

#### Test Independence
```typescript
// ✅ GOOD - Independent tests
test('should create user', async ({ page }) => {
  const userData = dataGenerator.generateUser();
  await createUser(page, userData);
  await verifyUserCreated(page, userData);
});

test('should update user', async ({ page }) => {
  const userData = dataGenerator.generateUser();
  await createUser(page, userData);
  
  const updatedData = { ...userData, name: 'Updated Name' };
  await updateUser(page, userData.id, updatedData);
  await verifyUserUpdated(page, updatedData);
});

// ❌ BAD - Dependent tests
test('should create user', async ({ page }) => {
  // Creates user with specific ID
});

test('should update user', async ({ page }) => {
  // Assumes user from previous test exists
});
```

#### Single Responsibility
```typescript
// ✅ GOOD - Focused test
test('should validate email format in registration form', async ({ page }) => {
  await page.goto('/register');
  await pageUtils.fillInput(page, '#email', 'invalid-email');
  await pageUtils.clickElement(page, '#submit');
  
  await expect(page.locator('.email-error')).toBeVisible();
  await expect(page.locator('.email-error')).toContainText('valid email');
});

// ❌ BAD - Multiple responsibilities
test('should handle registration process', async ({ page }) => {
  // Tests form validation, user creation, email sending, redirect, etc.
});
```

#### Descriptive Test Names
```typescript
// ✅ GOOD - Clear intent
test('should display error message when submitting empty required fields', async () => {});
test('should redirect to dashboard after successful login with valid credentials', async () => {});
test('should disable submit button while API request is in progress', async () => {});

// ❌ BAD - Vague descriptions
test('form test', async () => {});
test('login works', async () => {});
test('button behavior', async () => {});
```

### 13.2 Performance Optimization

#### Parallel Execution
```typescript
// Configure parallel execution in playwright.config.ts
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  
  // Group related tests
  projects: [
    {
      name: 'api-tests',
      testMatch: '**/api/**/*.spec.ts',
      use: { /* API-specific config */ }
    },
    {
      name: 'ui-tests',
      testMatch: '**/ui/**/*.spec.ts',
      use: { /* UI-specific config */ }
    }
  ]
});
```

#### Resource Management
```typescript
test.afterEach(async ({ page, context }) => {
  // Clean up resources after each test
  await page.close();
  await context.close();
});

test.describe('Resource-intensive tests', () => {
  test.describe.configure({ mode: 'serial' }); // Run sequentially
  
  test('heavy test 1', async ({ page }) => {
    // Resource-intensive test
  });
  
  test('heavy test 2', async ({ page }) => {
    // Another resource-intensive test
  });
});
```

#### Efficient Waiting Strategies
```typescript
// ✅ GOOD - Smart waiting
await page.waitForLoadState('networkidle');
await expect(page.locator('.data-loaded')).toBeVisible();

// ✅ GOOD - Parallel operations
const [response1, response2] = await Promise.all([
  apiUtils.get('/api/users'),
  apiUtils.get('/api/settings')
]);

// ❌ BAD - Arbitrary timeouts
await page.waitForTimeout(5000);

// ❌ BAD - Sequential operations
const response1 = await apiUtils.get('/api/users');
const response2 = await apiUtils.get('/api/settings');
```

### 13.3 Maintainability

#### Page Object Patterns
```typescript
// ✅ GOOD - Encapsulated page logic
class UserManagementPage {
  private readonly selectors = {
    createButton: '[data-testid="create-user"]',
    nameInput: '[data-testid="user-name"]',
    emailInput: '[data-testid="user-email"]',
    submitButton: '[data-testid="submit"]',
    successMessage: '[data-testid="success"]'
  };

  async createUser(page: Page, userData: User): Promise<void> {
    await pageUtils.clickElement(page, this.selectors.createButton);
    await pageUtils.fillInput(page, this.selectors.nameInput, userData.name);
    await pageUtils.fillInput(page, this.selectors.emailInput, userData.email);
    await pageUtils.clickElement(page, this.selectors.submitButton);
    
    await expect(page.locator(this.selectors.successMessage)).toBeVisible();
  }
}

// ❌ BAD - Direct selectors in tests
test('create user', async ({ page }) => {
  await page.click('[data-testid="create-user"]');
  await page.fill('[data-testid="user-name"]', 'John Doe');
  // Repeated selectors throughout codebase
});
```

#### Configuration Management
```typescript
// ✅ GOOD - Centralized configuration
class TestConfig {
  static readonly TIMEOUTS = {
    DEFAULT: 30000,
    API: 15000,
    PAGE_LOAD: 60000
  };

  static readonly SELECTORS = {
    LOADING_SPINNER: '.loading-spinner',
    ERROR_MESSAGE: '.error-message',
    SUCCESS_MESSAGE: '.success-message'
  };

  static getBaseUrl(): string {
    return process.env.BASE_URL || 'http://localhost:3000';
  }
}

// ❌ BAD - Hardcoded values
test('example', async ({ page }) => {
  await page.goto('http://localhost:3000'); // Hardcoded URL
  await page.waitForSelector('.loading-spinner', { timeout: 30000 }); // Hardcoded timeout
});
```

#### Error Handling
```typescript
// ✅ GOOD - Graceful error handling
async function safeElementInteraction(page: Page, selector: string, action: string): Promise<void> {
  try {
    const element = page.locator(selector);
    await element.waitFor({ state: 'visible', timeout: 10000 });
    
    if (action === 'click') {
      await element.click();
    }
  } catch (error) {
    logger.error(`Failed to ${action} element ${selector}`, error);
    await pageUtils.takeScreenshot(page, `error-${Date.now()}`);
    throw new Error(`Element interaction failed: ${selector}`);
  }
}

// ❌ BAD - No error handling
async function elementInteraction(page: Page, selector: string): Promise<void> {
  await page.click(selector); // Can fail without context
}
```

### 13.4 Security Best Practices

#### Sensitive Data Management
```typescript
// ✅ GOOD - Environment variables
const testCredentials = {
  username: process.env.TEST_USERNAME,
  password: process.env.TEST_PASSWORD,
  apiKey: process.env.TEST_API_KEY
};

// Data sanitization in logs
logger.info('Login attempt', {
  username: testCredentials.username,
  password: '[REDACTED]',
  timestamp: new Date().toISOString()
});

// ❌ BAD - Hardcoded secrets
const credentials = {
  username: 'admin@company.com',
  password: 'admin123',
  apiKey: 'sk-1234567890abcdef'
};
```

#### Input Validation
```typescript
// ✅ GOOD - Input validation
function validateTestData(data: unknown): User {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid test data: must be an object');
  }

  const user = data as User;
  
  if (!user.email || !user.email.includes('@')) {
    throw new Error('Invalid email format');
  }

  if (!user.name || user.name.length < 2) {
    throw new Error('Name must be at least 2 characters');
  }

  return user;
}

// ❌ BAD - No validation
function useTestData(data: any): void {
  // Direct usage without validation
  loginPage.login(data.email, data.password);
}
```

---

## 14. Troubleshooting

### 14.1 Common Issues and Solutions

#### Browser Launch Issues
```typescript
// Issue: Browser fails to launch
// Solution: Check browser installation and permissions

test.beforeAll(async ({ browserName }) => {
  console.log(`Running tests on ${browserName}`);
  
  // Verify browser availability
  if (process.env.CI && browserName === 'webkit') {
    // Skip webkit on certain CI environments
    test.skip();
  }
});

// Alternative: Use different browser configurations
export default defineConfig({
  projects: [
    {
      name: 'chromium-headless',
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // CI-friendly args
      }
    }
  ]
});
```

#### Element Interaction Failures
```typescript
// Issue: Element not found or not interactable
// Solution: Improve waiting strategies

async function robustElementInteraction(page: Page, selector: string): Promise<void> {
  const element = page.locator(selector);
  
  // Wait for element to be attached to DOM
  await element.waitFor({ state: 'attached' });
  
  // Wait for element to be visible
  await element.waitFor({ state: 'visible' });
  
  // Scroll element into view if needed
  await element.scrollIntoViewIfNeeded();
  
  // Wait for element to be enabled
  await expect(element).toBeEnabled();
  
  // Perform interaction
  await element.click();
}
```

#### API Test Failures
```typescript
// Issue: API tests failing due to timing or connectivity
// Solution: Implement retry logic and better error handling

async function resilientApiCall<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: { maxRetries?: number; backoffMs?: number } = {}
): Promise<ApiResponse<T>> {
  const { maxRetries = 3, backoffMs = 1000 } = options;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await apiCall();
      
      if (response.status >= 200 && response.status < 300) {
        return response;
      }
      
      if (response.status >= 500 && attempt < maxRetries) {
        // Retry on server errors
        await new Promise(resolve => setTimeout(resolve, backoffMs * attempt));
        continue;
      }
      
      return response; // Return non-5xx responses for assertion
      
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      logger.warn(`API call attempt ${attempt} failed, retrying...`, error);
      await new Promise(resolve => setTimeout(resolve, backoffMs * attempt));
    }
  }
  
  throw new Error('All retry attempts exhausted');
}
```

#### Test Data Management Issues
```typescript
// Issue: Test data conflicts or persistence
// Solution: Implement proper data isolation

test.describe('Isolated test data', () => {
  let testDataCleanup: (() => Promise<void>)[] = [];

  test.beforeEach(async () => {
    // Create isolated test data
    const testUser = await testSetupUtils.createTestUser('user');
    testDataCleanup.push(() => testSetupUtils.cleanupTestUser(testUser.id));
  });

  test.afterEach(async () => {
    // Clean up all test data
    await Promise.all(testDataCleanup.map(cleanup => cleanup()));
    testDataCleanup = [];
  });

  test('isolated test', async ({ page }) => {
    // Test uses isolated data
  });
});
```

### 14.2 Debugging Techniques

#### Debug Mode
```typescript
// Enable debug mode
test('debug specific test', async ({ page }) => {
  // Add debug breakpoint
  await page.pause();
  
  // Take screenshot for debugging
  await pageUtils.takeScreenshot(page, 'debug-screenshot');
  
  // Log page content
  const content = await page.content();
  logger.debug('Page content', { content });
  
  // Continue with test
});

// Run single test in debug mode
// npx playwright test --debug --grep "debug specific test"
```

#### Trace Collection
```typescript
// Enable tracing for failed tests
export default defineConfig({
  use: {
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure'
  }
});

// View traces
// npx playwright show-trace test-results/example-test/trace.zip
```

#### Logging and Monitoring
```typescript
test('test with detailed logging', async ({ page }) => {
  // Log test start
  logger.info('Starting test execution', {
    testName: 'example test',
    browser: page.context().browser()?.browserType().name(),
    timestamp: new Date().toISOString()
  });

  // Monitor network activity
  page.on('request', request => {
    logger.debug('Network request', {
      url: request.url(),
      method: request.method(),
      headers: request.headers()
    });
  });

  page.on('response', response => {
    logger.debug('Network response', {
      url: response.url(),
      status: response.status(),
      statusText: response.statusText()
    });
  });

  // Monitor console messages
  page.on('console', msg => {
    logger.debug('Browser console', {
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });

  // Test execution with monitoring
  await page.goto('/application');
  // ... rest of test
});
```

### 14.3 Performance Troubleshooting

#### Slow Test Identification
```typescript
// Measure test execution time
test('performance monitored test', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('/application');
  
  const navigationTime = Date.now() - startTime;
  logger.info('Navigation performance', { navigationTime });
  
  if (navigationTime > 5000) {
    logger.warn('Slow navigation detected', { navigationTime });
  }
  
  // Continue with test assertions
});
```

#### Resource Usage Monitoring
```typescript
// Monitor memory usage
test.beforeEach(async ({ context }) => {
  const initialMemory = process.memoryUsage();
  logger.debug('Initial memory usage', initialMemory);
});

test.afterEach(async ({ context }) => {
  const finalMemory = process.memoryUsage();
  logger.debug('Final memory usage', finalMemory);
  
  // Force garbage collection if needed
  if (global.gc) {
    global.gc();
  }
});
```

### 14.4 CI/CD Troubleshooting

#### Environment-Specific Issues
```typescript
// Handle CI environment differences
const isCI = process.env.CI === 'true';
const timeout = isCI ? 60000 : 30000;

test('environment-aware test', async ({ page }) => {
  await page.goto('/application', { timeout });
  
  if (isCI) {
    // Additional waits for CI environment
    await page.waitForLoadState('networkidle');
  }
  
  await expect(page.locator('.content')).toBeVisible({ timeout });
});
```

#### Docker-Specific Issues
```bash
# Debug Docker container issues
docker run -it --rm playwright-tests /bin/bash

# Check browser installation
npx playwright install --dry-run

# Verify dependencies
ldd /usr/bin/google-chrome-stable
```

---

## Contact & Support

### Getting Help

For questions, issues, or contributions to the IGS Playwright Framework:

1. **GitHub Issues**: [Create an issue](https://github.com/IGSRepo/igs-playwright-framework/issues)
2. **Documentation Updates**: Submit pull requests for documentation improvements
3. **Feature Requests**: Use GitHub issues with the 'enhancement' label
4. **Bug Reports**: Provide detailed reproduction steps and environment information

### Team Contacts

- **Framework Maintainers**: IGS Development Team
- **Repository**: [https://github.com/IGSRepo/igs-playwright-framework](https://github.com/IGSRepo/igs-playwright-framework)
- **Version**: 1.0.0

### Contributing Guidelines

1. Fork the repository
2. Create a feature branch
3. Follow the coding standards outlined in the companion document
4. Add appropriate tests for new functionality
5. Update documentation as needed
6. Submit a pull request with detailed description

---

*This documentation is maintained by the IGS Development Team and is updated regularly to reflect the latest framework capabilities and best practices.*
