import { Page } from '@playwright/test';
import { ParabankPage } from '../pages/parabank-page';
import { Logger } from '../utils/logger';
import { ParabankCredentials, ParabankPayee } from '../types/parabank.types';

/**
 * Business-level, reusable flows for the ParaBank application domain.
 * Composes ParabankPage element interactions into scenario-level
 * operations so tests express business intent instead of driving
 * page elements directly.
 */
export class ParabankBusinessFunctions {
  private readonly parabankPage: ParabankPage;
  private readonly logger: Logger;

  constructor(page: Page) {
    this.parabankPage = new ParabankPage(page);
    this.logger = Logger.getInstance();
  }

  /**
   * Navigate to ParaBank, log in and confirm the account services shell loaded.
   */
  async login(credentials: ParabankCredentials): Promise<void> {
    this.logger.step('Login to ParaBank', { username: credentials.username });
    await this.parabankPage.gotoLogin();
    await this.parabankPage.enterUsername(credentials.username);
    await this.parabankPage.enterPassword(credentials.password);
    await this.parabankPage.clickLoginButton();
    await this.parabankPage.assertAccountServicesVisible();
    await this.parabankPage.assertWelcomeMessageVisible();
    await this.parabankPage.assertLeftPanelContainsOpenNewAccount();
  }

  /**
   * Open a new account funded from an existing account.
   * @returns the newly created account number
   */
  async openNewAccount(accountType: string, fromAccountId: string): Promise<string> {
    this.logger.step('Open new account', { accountType, fromAccountId });
    await this.parabankPage.clickOpenNewAccountLink();
    await this.parabankPage.selectAccountType(accountType);
    await this.parabankPage.selectFromAccount(fromAccountId);
    await this.parabankPage.clickOpenNewAccountSubmit();
    await this.parabankPage.assertAccountOpenedVisible();
    const newAccountNumber = await this.parabankPage.getNewAccountNumber();
    this.logger.info(`New account opened: ${newAccountNumber}`);
    return newAccountNumber;
  }

  /**
   * Open an account's activity page and filter its transactions by type.
   */
  async viewAccountActivity(accountNumber: string, transactionType: string): Promise<void> {
    this.logger.step('View account activity', { accountNumber, transactionType });
    await this.parabankPage.clickAccountNumberLink(accountNumber);
    await this.parabankPage.assertAccountDetailsVisible();
    await this.parabankPage.selectTransactionType(transactionType);
    await this.parabankPage.clickGoButton();
    await this.parabankPage.assertFundsTransferReceivedVisible();
  }

  /**
   * Transfer funds between two accounts.
   */
  async transferFunds(amount: string, fromAccountId: string, toAccountId: string): Promise<void> {
    this.logger.step('Transfer funds', { amount, fromAccountId, toAccountId });
    await this.parabankPage.clickTransferFundsLink();
    await this.parabankPage.enterTransferAmount(amount);
    await this.parabankPage.selectFromAccount(fromAccountId);
    await this.parabankPage.selectTransferToAccount(toAccountId);
    await this.parabankPage.clickTransferButton();
    await this.parabankPage.assertTransferCompleteVisible();
  }

  /**
   * Pay a bill to a payee from the given account.
   */
  async payBill(payee: ParabankPayee, amount: string, fromAccountId: string): Promise<void> {
    this.logger.step('Pay bill', { payee: payee.name, amount, fromAccountId });
    await this.parabankPage.clickBillPayLink();
    await this.parabankPage.fillPayeeDetails(payee);
    await this.parabankPage.enterBillPayAmount(amount);
    await this.parabankPage.selectFromAccount(fromAccountId);
    await this.parabankPage.clickSendPaymentButton();
    await this.parabankPage.assertBillPaymentCompleteVisible();
  }

  /**
   * Search for a transaction by amount.
   */
  async findTransactionByAmount(amount: string): Promise<void> {
    this.logger.step('Find transaction by amount', { amount });
    await this.parabankPage.clickFindTransactionsLink();
    await this.parabankPage.enterFindTransactionAmount(amount);
    await this.parabankPage.assertFindByAmountVisible();
    await this.parabankPage.clickFindByAmountButton();
  }

  /**
   * Update the logged-in customer's contact information.
   */
  async updateContactInfo(lastName: string, street: string): Promise<void> {
    this.logger.step('Update contact info', { lastName, street });
    await this.parabankPage.clickUpdateContactInfoLink();
    await this.parabankPage.enterLastName(lastName);
    await this.parabankPage.enterStreet(street);
    await this.parabankPage.clickUpdateProfileButton();
    await this.parabankPage.assertProfileUpdatedVisible();
  }

  /**
   * Submit a loan request from the given account.
   */
  async requestLoan(amount: string, downPayment: string, fromAccountId: string): Promise<void> {
    this.logger.step('Request loan', { amount, downPayment, fromAccountId });
    await this.parabankPage.clickRequestLoanLink();
    await this.parabankPage.assertApplyForLoanHeadingVisible();
    await this.parabankPage.enterLoanAmount(amount);
    await this.parabankPage.enterDownPayment(downPayment);
    await this.parabankPage.selectFromAccount(fromAccountId);
    await this.parabankPage.clickApplyNowButton();
  }

  /**
   * Log out of ParaBank.
   */
  async logout(): Promise<void> {
    this.logger.step('Logout from ParaBank');
    await this.parabankPage.clickLogoutLink();
  }
}
