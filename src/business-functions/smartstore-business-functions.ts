import { Page } from '@playwright/test';
import { SmartStorePage } from '../pages/smartstore-page';
import { Logger } from '../utils/logger';
import { SmartStoreCredentials } from '../types/smartstore.types';

/**
 * Business-level, reusable flows for the SmartStore (ecommerce) application
 * domain. Composes SmartStorePage element interactions into scenario-level
 * operations so tests express business intent instead of driving page
 * elements directly.
 */
export class SmartStoreBusinessFunctions {
  private readonly smartStorePage: SmartStorePage;
  private readonly logger: Logger;

  constructor(page: Page) {
    this.smartStorePage = new SmartStorePage(page);
    this.logger = Logger.getInstance();
  }

  /**
   * Navigate to SmartStore and log in with the given credentials.
   */
  async login(credentials: SmartStoreCredentials): Promise<void> {
    this.logger.step('Login to SmartStore', { username: credentials.username });
    await this.smartStorePage.gotoLogin();
    await this.smartStorePage.enterUsername(credentials.username);
    await this.smartStorePage.enterPassword(credentials.password);
    await this.smartStorePage.clickLoginButton();
  }

  /**
   * Browse to a category, open a product and add it to the cart.
   */
  async addProductToCart(category: string, product: string): Promise<void> {
    this.logger.step('Add product to cart', { category, product });
    await this.smartStorePage.clickCategory(category);
    await this.smartStorePage.clickProduct(product);
    await this.smartStorePage.clickAddToCart();
    await this.smartStorePage.assertCheckoutLinkVisible();
  }
}
