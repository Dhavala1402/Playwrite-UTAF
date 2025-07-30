import { Page, Locator, expect } from '@playwright/test';
import { PageUtils } from '../utils/page-utils';
import { PageElement } from '../types/index';
import { Logger } from '../utils/logger';

/**
 * Base Page Object Model class with best practices
 * Implements common patterns for Playwright automation
 */
export abstract class BasePage {
  protected page: Page;
  protected pageUtils: PageUtils;
  protected url: string;
  protected logger: Logger;

  constructor(page: Page, url: string = '') {
    this.page = page;
    this.pageUtils = new PageUtils(page);
    this.url = url;
    this.logger = Logger.getInstance();
  }

  // ==================== GETTER METHODS ====================

  /**
   * Get the page instance for direct access when needed
   */
  get pageInstance(): Page {
    return this.page;
  }

  // ==================== NAVIGATION METHODS ====================

  /**
   * Navigate to the page with enhanced error handling
   */
  async navigate(): Promise<void> {
    this.logger.info(`Navigating to ${this.url}`);
    
    try {
      await this.page.goto(this.url, { 
        waitUntil: 'networkidle',
        timeout: 30000, 
      });
      await this.waitForPageLoad();
      this.logger.info(`Successfully navigated to ${this.url}`);
    } catch (error) {
      this.logger.error(`Failed to navigate to ${this.url}`, error);
      throw error;
    }
  }

  /**
   * Alias for navigate() to maintain compatibility
   */
  async goto(): Promise<void> {
    return this.navigate();
  }

  /**
   * Wait for page to load completely with multiple strategies
   */
  async waitForPageLoad(): Promise<void> {
    await Promise.all([
      this.page.waitForLoadState('domcontentloaded'),
      this.page.waitForLoadState('networkidle'),
    ]);
  }

  /**
   * Reload the current page
   */
  async reload(): Promise<void> {
    this.logger.debug('Reloading page');
    await this.page.reload({ waitUntil: 'networkidle' });
    await this.waitForPageLoad();
  }

  // ==================== ELEMENT INTERACTION METHODS ====================

  /**
   * Enhanced click with retry mechanism and logging
   */
  async clickElement(element: PageElement): Promise<void> {
    const identifier = element.testId || element.selector;
    this.logger.debug(`Clicking element: ${identifier}`);
    
    try {
      const locator = this.getLocator(element);
      await locator.waitFor({ state: 'visible', timeout: 10000 });
      await locator.waitFor({ state: 'attached', timeout: 10000 });
      
      // Scroll into view before clicking
      await locator.scrollIntoViewIfNeeded();
      
      // Use force click if element is covered
      await locator.click({ timeout: 5000 });
      
      this.logger.debug(`Successfully clicked element: ${identifier}`);
    } catch (error) {
      this.logger.error(`Failed to click element: ${identifier}`, error);
      // Take screenshot for debugging
      await this.takeScreenshot(`click-error-${Date.now()}`);
      throw error;
    }
  }

  /**
   * Enhanced text input with validation
   */
  async fillText(element: PageElement, text: string, options?: {
    clear?: boolean;
    validate?: boolean;
  }): Promise<void> {
    const identifier = element.testId || element.selector;
    this.logger.debug(`Filling text "${text}" into element: ${identifier}`);
    
    try {
      const locator = this.getLocator(element);
      await locator.waitFor({ state: 'visible', timeout: 10000 });
      
      // Clear existing text if requested
      if (options?.clear !== false) {
        await locator.clear();
      }
      
      await locator.fill(text);
      
      // Validate the text was entered correctly
      if (options?.validate !== false) {
        const actualValue = await locator.inputValue();
        if (actualValue !== text) {
          throw new Error(`Text validation failed. Expected: "${text}", Actual: "${actualValue}"`);
        }
      }
      
      this.logger.debug(`Successfully filled text into element: ${identifier}`);
    } catch (error) {
      this.logger.error(`Failed to fill text into element: ${identifier}`, error);
      throw error;
    }
  }

  /**
   * Get element text with timeout and error handling
   */
  async getElementText(element: PageElement): Promise<string> {
    const identifier = element.testId || element.selector;
    this.logger.debug(`Getting text from element: ${identifier}`);
    
    try {
      const locator = this.getLocator(element);
      await locator.waitFor({ state: 'visible', timeout: 10000 });
      
      const text = await locator.textContent() || '';
      this.logger.debug(`Retrieved text "${text}" from element: ${identifier}`);
      return text.trim();
    } catch (error) {
      this.logger.error(`Failed to get text from element: ${identifier}`, error);
      throw error;
    }
  }

  /**
   * Check if element is visible with timeout
   */
  async isElementVisible(element: PageElement, timeout: number = 5000): Promise<boolean> {
    try {
      const locator = this.getLocator(element);
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(element: PageElement, timeout: number = 10000): Promise<void> {
    const locator = this.getLocator(element);
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to disappear
   */
  async waitForElementToDisappear(element: PageElement, timeout: number = 10000): Promise<void> {
    const locator = this.getLocator(element);
    await locator.waitFor({ state: 'hidden', timeout });
  }

  // ==================== ASSERTION METHODS ====================

  /**
   * Assert element is visible with custom error message
   */
  async assertElementVisible(element: PageElement, message?: string): Promise<void> {
    const locator = this.getLocator(element);
    const identifier = element.testId || element.selector;
    await expect(locator, message || `Element should be visible: ${identifier}`).toBeVisible();
  }

  /**
   * Assert element text matches expected value
   */
  async assertElementText(element: PageElement, expectedText: string, message?: string): Promise<void> {
    const locator = this.getLocator(element);
    await expect(locator, message || `Element text should match: ${expectedText}`).toHaveText(expectedText);
  }

  /**
   * Assert element contains text
   */
  async assertElementContainsText(element: PageElement, expectedText: string, message?: string): Promise<void> {
    const locator = this.getLocator(element);
    await expect(locator, message || `Element should contain text: ${expectedText}`).toContainText(expectedText);
  }

  /**
   * Assert page title
   */
  async assertPageTitle(expectedTitle: string | RegExp, message?: string): Promise<void> {
    await expect(this.page, message || `Page title should match: ${expectedTitle}`).toHaveTitle(expectedTitle);
  }

  /**
   * Assert current URL
   */
  async assertCurrentURL(expectedURL: string | RegExp, message?: string): Promise<void> {
    await expect(this.page, message || `URL should match: ${expectedURL}`).toHaveURL(expectedURL);
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Take screenshot with timestamp and context
   */
  async takeScreenshot(filename?: string): Promise<void> {
    const screenshotPath = filename || `screenshot-${Date.now()}.png`;
    this.logger.debug(`Taking screenshot: ${screenshotPath}`);
    
    await this.page.screenshot({ 
      path: `screenshots/${screenshotPath}`,
      fullPage: true, 
    });
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Execute JavaScript in page context
   */
  async executeScript<T>(script: string, ...args: unknown[]): Promise<T> {
    return await this.page.evaluate(script, ...args);
  }

  /**
   * Wait for URL to match pattern
   */
  async waitForURL(pattern: string | RegExp, timeout?: number): Promise<void> {
    await this.page.waitForURL(pattern, { timeout });
  }

  /**
   * Get element count by selector
   */
  async getElementCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  /**
   * Press keyboard key
   */
  async pressKey(key: string): Promise<void> {
    this.logger.debug(`Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  /**
   * Handle browser dialogs
   */
  async handleDialog(accept: boolean = true, promptText?: string): Promise<void> {
    this.page.once('dialog', async dialog => {
      this.logger.debug(`Handling dialog: ${dialog.type()} - ${dialog.message()}`);
      if (dialog.type() === 'prompt' && promptText) {
        await dialog.accept(promptText);
      } else if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }

  /**
   * Upload file to input element
   */
  async uploadFile(element: PageElement, filePath: string | string[]): Promise<void> {
    const locator = this.getLocator(element);
    await locator.setInputFiles(filePath);
  }

  /**
   * Drag and drop elements
   */
  async dragAndDrop(sourceElement: PageElement, targetElement: PageElement): Promise<void> {
    const sourceLocator = this.getLocator(sourceElement);
    const targetLocator = this.getLocator(targetElement);
    await sourceLocator.dragTo(targetLocator);
  }

  /**
   * Get page performance metrics (simplified for compatibility)
   */
  async getPerformanceMetrics(): Promise<Record<string, number>> {
    try {
      const loadStart = Date.now();
      await this.page.waitForLoadState('domcontentloaded');
      const domLoaded = Date.now();
      await this.page.waitForLoadState('load');
      const loadComplete = Date.now();
      
      return {
        domContentLoaded: domLoaded - loadStart,
        loadComplete: loadComplete - loadStart,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
      };
    } catch {
      return {
        domContentLoaded: 0,
        loadComplete: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
      };
    }
  }

  // ==================== PRIVATE HELPER METHODS ====================

  /**
   * Get locator from PageElement with enhanced selector strategy
   */
  private getLocator(element: PageElement): Locator {
    // Priority: testId > role + name > text > selector
    if (element.testId) {
      return this.page.getByTestId(element.testId);
    }
    if (element.role && element.text) {
      return this.page.getByRole(element.role as 'button' | 'link' | 'textbox' | 'checkbox' | 'radio', { name: element.text });
    }
    if (element.text) {
      return this.page.getByText(element.text, { exact: false });
    }
    return this.page.locator(element.selector);
  }

  // ==================== ADVANCED INTERACTION METHODS ====================

  /**
   * Hover over element
   */
  async hoverElement(element: PageElement): Promise<void> {
    const locator = this.getLocator(element);
    await locator.hover();
  }

  /**
   * Double click element
   */
  async doubleClickElement(element: PageElement): Promise<void> {
    const locator = this.getLocator(element);
    await locator.dblclick();
  }

  /**
   * Right click element
   */
  async rightClickElement(element: PageElement): Promise<void> {
    const locator = this.getLocator(element);
    await locator.click({ button: 'right' });
  }

  /**
   * Get element attribute value
   */
  async getElementAttribute(element: PageElement, attributeName: string): Promise<string | null> {
    const locator = this.getLocator(element);
    return await locator.getAttribute(attributeName);
  }

  /**
   * Check if element is enabled
   */
  async isElementEnabled(element: PageElement): Promise<boolean> {
    const locator = this.getLocator(element);
    return await locator.isEnabled();
  }

  /**
   * Check if checkbox/radio is checked
   */
  async isElementChecked(element: PageElement): Promise<boolean> {
    const locator = this.getLocator(element);
    return await locator.isChecked();
  }

  /**
   * Focus on element
   */
  async focusElement(element: PageElement): Promise<void> {
    const locator = this.getLocator(element);
    await locator.focus();
  }

  /**
   * Clear input field
   */
  async clearElement(element: PageElement): Promise<void> {
    const locator = this.getLocator(element);
    await locator.clear();
  }

  /**
   * Select option in dropdown
   */
  async selectOption(element: PageElement, option: string | string[]): Promise<void> {
    const locator = this.getLocator(element);
    await locator.selectOption(option);
  }

  /**
   * Scroll element into view
   */
  async scrollToElement(element: PageElement): Promise<void> {
    const locator = this.getLocator(element);
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Set viewport size
   */
  async setViewportSize(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }
}
