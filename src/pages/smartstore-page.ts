import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { PageElement } from '../types/index';
import { config } from '../utils/config-manager';

/**
 * Single Page Object Model covering the entire SmartStore (ecommerce) application
 * domain. All locators and element-level interactions for every SmartStore page
 * (login, catalog browsing, product details, cart) live here so business flows
 * can be composed without duplicating POM classes per module.
 */
export class SmartStorePage extends BasePage {
  // Sourced from the SMARTSTORE_BASE_URL env var (see .env.example); falls
  // back to the public demo instance when the env var is not set.
  private static readonly LOGIN_URL = config.get(
    'SMARTSTORE_BASE_URL',
    'https://smartbearstore.smartbear.com/samples/TestComplete15/smartstore/login?returnUrl=%2Fsamples%2FTestComplete15%2Fsmartstore%2F',
  );

  // ==================== LOGIN ====================
  private readonly usernameInput: PageElement = { selector: '#UsernameOrEmail', role: 'textbox', text: 'Username or email' };
  private readonly passwordInput: PageElement = { selector: '#Password', role: 'textbox', text: 'Password' };
  private readonly loginButton: PageElement = { selector: 'button.btn-login', role: 'button', text: 'Log in' };

  // ==================== PRODUCT DETAILS / CART ====================
  private readonly addToCartLink: PageElement = { selector: 'a.btn-add-to-cart', role: 'link', text: ' Add to cart' };
  private readonly checkoutLink: PageElement = { selector: 'a.btn-action[href*="checkout"]', role: 'link', text: ' Checkout' };

  constructor(page: Page) {
    super(page, SmartStorePage.LOGIN_URL);
  }

  // ==================== LOGIN ====================

  async gotoLogin(): Promise<void> {
    await this.navigate();
  }

  async enterUsername(username: string): Promise<void> {
    await this.fillText(this.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.fillText(this.passwordInput, password);
  }

  async clickLoginButton(): Promise<void> {
    await this.clickElement(this.loginButton);
  }

  // ==================== CATALOG NAVIGATION ====================

  async clickCategory(categoryName: string): Promise<void> {
    await this.clickElement({
      selector: `a.art-picture:has(img[alt="Picture for category ${categoryName}"])`,
      role: 'link',
      text: `Picture for category ${categoryName}`,
    });
  }

  async clickProduct(productName: string): Promise<void> {
    await this.clickElement({
      selector: `a.art-picture:has(img[alt="Picture of ${productName}"])`,
      role: 'link',
      text: `Picture of ${productName}`,
    });
    // The product page's add-to-cart handler is bound by a script that loads
    // after first paint; clicking before it settles silently no-ops.
    await this.waitForNetworkIdle();
  }

  // ==================== PRODUCT DETAILS / CART ====================

  async clickAddToCart(): Promise<void> {
    await this.clickElement(this.addToCartLink);
  }

  async assertCheckoutLinkVisible(): Promise<void> {
    await this.assertElementVisible(this.checkoutLink);
  }
}
