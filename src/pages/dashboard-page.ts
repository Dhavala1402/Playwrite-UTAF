import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { PageElement } from '../types/index';

/**
 * Dashboard Page Object Model
 */
export class DashboardPage extends BasePage {
  // Page elements
  private readonly welcomeMessage: PageElement = {
    selector: '[data-testid="welcome-message"], .welcome, h1',
    testId: 'welcome-message',
  };

  private readonly userProfile: PageElement = {
    selector: '[data-testid="user-profile"], .user-profile, .profile-dropdown',
    testId: 'user-profile',
  };

  private readonly logoutButton: PageElement = {
    selector: '[data-testid="logout"], .logout, a[href*="logout"]',
    testId: 'logout',
  };

  private readonly navigationMenu: PageElement = {
    selector: '[data-testid="navigation"], .nav-menu, nav',
    testId: 'navigation',
  };

  private readonly searchBox: PageElement = {
    selector: '[data-testid="search"], .search-input, input[type="search"]',
    testId: 'search',
  };

  private readonly notificationsBell: PageElement = {
    selector: '[data-testid="notifications"], .notifications, .bell-icon',
    testId: 'notifications',
  };

  private readonly settingsIcon: PageElement = {
    selector: '[data-testid="settings"], .settings, .settings-icon',
    testId: 'settings',
  };

  private readonly dashboardCards: PageElement = {
    selector: '[data-testid="dashboard-card"], .card, .widget',
    testId: 'dashboard-card',
  };

  constructor(page: Page) {
    super(page, '/dashboard');
  }

  /**
   * Get welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    await this.waitForElement(this.welcomeMessage);
    return await this.getElementText(this.welcomeMessage);
  }

  /**
   * Click user profile
   */
  async clickUserProfile(): Promise<void> {
    await this.clickElement(this.userProfile);
  }

  /**
   * Logout from dashboard
   */
  async logout(): Promise<void> {
    await this.clickElement(this.logoutButton);
    await this.waitForURL('**/login');
  }

  /**
   * Search for content
   */
  async search(query: string): Promise<void> {
    await this.fillText(this.searchBox, query);
    await this.pressKey('Enter');
  }

  /**
   * Click notifications
   */
  async clickNotifications(): Promise<void> {
    await this.clickElement(this.notificationsBell);
  }

  /**
   * Click settings
   */
  async clickSettings(): Promise<void> {
    await this.clickElement(this.settingsIcon);
  }

  /**
   * Get dashboard cards count
   */
  async getDashboardCardsCount(): Promise<number> {
    return await this.getElementCount(this.dashboardCards.selector);
  }

  /**
   * Navigate to specific section
   */
  async navigateToSection(sectionName: string): Promise<void> {
    const sectionLink: PageElement = {
      selector: `[data-testid="nav-${sectionName}"], a[href*="${sectionName}"]`,
      testId: `nav-${sectionName}`,
    };
    await this.clickElement(sectionLink);
  }

  /**
   * Check if dashboard is loaded
   */
  async isDashboardLoaded(): Promise<boolean> {
    try {
      await this.waitForElement(this.welcomeMessage);
      await this.waitForElement(this.navigationMenu);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get notification count
   */
  async getNotificationCount(): Promise<number> {
    const notificationBadge: PageElement = {
      selector: '[data-testid="notification-count"], .notification-badge, .badge',
      testId: 'notification-count',
    };

    if (await this.isElementVisible(notificationBadge)) {
      const badgeText = await this.getElementText(notificationBadge);
      return parseInt(badgeText) || 0;
    }
    return 0;
  }

  /**
   * Check if user is logged in
   */
  async isUserLoggedIn(): Promise<boolean> {
    return await this.isElementVisible(this.userProfile);
  }

  /**
   * Get current user name from profile
   */
  async getCurrentUserName(): Promise<string> {
    const userNameElement: PageElement = {
      selector: '[data-testid="user-name"], .user-name, .profile-name',
      testId: 'user-name',
    };

    if (await this.isElementVisible(userNameElement)) {
      return await this.getElementText(userNameElement);
    }
    return '';
  }

  /**
   * Wait for dashboard to fully load
   */
  async waitForDashboardLoad(): Promise<void> {
    await this.waitForPageLoad();
    await this.waitForElement(this.welcomeMessage);
    await this.waitForElement(this.navigationMenu);

    // Wait for any loading indicators to disappear
    await this.page.waitForLoadState('networkidle');
  }
}
