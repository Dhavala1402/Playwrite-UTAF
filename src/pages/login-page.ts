import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { UserCredentials, PageElement } from '../types/index';

/**
 * Login Page Object Model
 */
export class LoginPage extends BasePage {
  // Page elements
  private readonly usernameField: PageElement = {
    selector: '[data-testid="username"], #username, input[name="username"]',
    testId: 'username',
  };

  private readonly passwordField: PageElement = {
    selector: '[data-testid="password"], #password, input[name="password"]',
    testId: 'password',
  };

  private readonly loginButton: PageElement = {
    selector: '[data-testid="login-button"], #login-btn, button[type="submit"]',
    testId: 'login-button',
  };

  private readonly errorMessage: PageElement = {
    selector: '[data-testid="error-message"], .error, .alert-danger',
    testId: 'error-message',
  };

  private readonly forgotPasswordLink: PageElement = {
    selector: '[data-testid="forgot-password"], a[href*="forgot"]',
    testId: 'forgot-password',
  };

  private readonly rememberMeCheckbox: PageElement = {
    selector: '[data-testid="remember-me"], input[name="remember"]',
    testId: 'remember-me',
  };

  private readonly signupLink: PageElement = {
    selector: '[data-testid="signup-link"], a[href*="signup"], a[href*="register"]',
    testId: 'signup-link',
  };

  constructor(page: Page) {
    super(page, '/login');
  }

  /**
   * Enter username
   */
  async enterUsername(username: string): Promise<void> {
    await this.fillText(this.usernameField, username);
  }

  /**
   * Enter password
   */
  async enterPassword(password: string): Promise<void> {
    await this.fillText(this.passwordField, password);
  }

  /**
   * Click login button
   */
  async clickLogin(): Promise<void> {
    await this.clickElement(this.loginButton);
  }

  /**
   * Perform complete login
   */
  async login(credentials: UserCredentials): Promise<void> {
    await this.enterUsername(credentials.username);
    await this.enterPassword(credentials.password);
    await this.clickLogin();
  }

  /**
   * Login and wait for navigation
   */
  async loginAndWait(credentials: UserCredentials, expectedUrl: string = '/dashboard'): Promise<void> {
    await this.login(credentials);
    await this.waitForURL(`**${expectedUrl}`);
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.errorMessage);
    return await this.getElementText(this.errorMessage);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
  }

  /**
   * Click signup link
   */
  async clickSignup(): Promise<void> {
    await this.clickElement(this.signupLink);
  }

  /**
   * Toggle remember me checkbox
   */
  async toggleRememberMe(): Promise<void> {
    await this.clickElement(this.rememberMeCheckbox);
  }

  /**
   * Check if remember me is checked
   */
  async isRememberMeChecked(): Promise<boolean> {
    const locator = this.page.locator(this.rememberMeCheckbox.selector);
    return await locator.isChecked();
  }

  /**
   * Clear login form
   */
  async clearForm(): Promise<void> {
    await this.fillText(this.usernameField, '');
    await this.fillText(this.passwordField, '');
  }

  /**
   * Check if login button is enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    const locator = this.page.locator(this.loginButton.selector);
    return await locator.isEnabled();
  }

  /**
   * Get username field value
   */
  async getUsernameValue(): Promise<string> {
    const locator = this.page.locator(this.usernameField.selector);
    return await locator.inputValue();
  }

  /**
   * Get password field value
   */
  async getPasswordValue(): Promise<string> {
    const locator = this.page.locator(this.passwordField.selector);
    return await locator.inputValue();
  }

  /**
   * Wait for login form to be ready
   */
  async waitForLoginForm(): Promise<void> {
    await this.waitForElement(this.usernameField);
    await this.waitForElement(this.passwordField);
    await this.waitForElement(this.loginButton);
  }

  /**
   * Perform login with validation
   */
  async loginWithValidation(credentials: UserCredentials): Promise<{
    success: boolean;
    errorMessage?: string;
  }> {
    await this.login(credentials);
    
    // Wait a moment for response
    await this.page.waitForTimeout(1000);
    
    // Check if error message appears
    if (await this.isErrorMessageDisplayed()) {
      return {
        success: false,
        errorMessage: await this.getErrorMessage(),
      };
    }
    
    // Check if URL changed (successful login)
    const currentUrl = await this.getCurrentUrl();
    if (!currentUrl.includes('/login')) {
      return { success: true };
    }
    
    return {
      success: false,
      errorMessage: 'Login failed - remained on login page',
    };
  }

  /**
   * Check if login page is loaded
   */
  async isLoginPageLoaded(): Promise<boolean> {
    try {
      await this.waitForLoginForm();
      return true;
    } catch {
      return false;
    }
  }
}
