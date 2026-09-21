import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { PageElement } from '../types/index';
import { ParabankPayee } from '../types/parabank.types';
import { config } from '../utils/config-manager';

/**
 * Single Page Object Model covering the entire ParaBank application domain.
 * All locators and element-level interactions for every ParaBank page
 * (login, accounts, transfers, bill pay, transaction search, profile,
 * loans) live here so business flows can be composed without duplicating
 * POM classes per module.
 */
export class ParabankPage extends BasePage {
  // Sourced from the PARABANK_BASE_URL env var (see .env.example); falls
  // back to the public demo instance when the env var is not set.
  private static readonly LOGIN_URL = config.get(
    'PARABANK_BASE_URL',
    'https://parabank.parasoft.com/parabank/index.htm',
  );

  // ==================== LOGIN ====================
  private readonly usernameInput: PageElement = { selector: 'input[name="username"]' };
  private readonly passwordInput: PageElement = { selector: 'input[name="password"]' };
  private readonly loginButton: PageElement = { selector: 'input[value="Log In"]', role: 'button', text: 'Log In' };

  // ==================== ACCOUNT SERVICES SHELL ====================
  private readonly accountServicesHeading: PageElement = { selector: '#leftPanel h2', role: 'heading', text: 'Account Services' };
  private readonly welcomeMessage: PageElement = { selector: '#rightPanel', text: 'Welcome' };
  private readonly leftPanel: PageElement = { selector: '#leftPanel' };
  private readonly logoutLink: PageElement = { selector: 'a[href*="logout"]', role: 'link', text: 'Log Out' };

  // ==================== OPEN NEW ACCOUNT ====================
  private readonly openNewAccountLink: PageElement = { selector: 'a[href*="openaccount"]', role: 'link', text: 'Open New Account' };
  private readonly accountTypeSelect: PageElement = { selector: '#type' };
  private readonly openNewAccountSubmitButton: PageElement = { selector: 'input[value="Open New Account"]', role: 'button', text: 'Open New Account' };
  private readonly accountOpenedHeading: PageElement = { selector: '#openAccountResult h1', role: 'heading', text: 'Account Opened!' };
  private readonly newAccountNumberLink: PageElement = { selector: '#newAccountId' };

  // ==================== ACCOUNT ACTIVITY ====================
  private readonly accountDetailsPanel: PageElement = { selector: '#accountDetails' };
  private readonly transactionTypeSelect: PageElement = { selector: '#transactionType' };
  private readonly goButton: PageElement = { selector: 'input[value="Go"]', role: 'button', text: 'Go' };
  private readonly fundsTransferReceivedLink: PageElement = { selector: '#transactionTable a', role: 'link', text: 'Funds Transfer Received' };

  // ==================== TRANSFER FUNDS ====================
  private readonly transferFundsLink: PageElement = { selector: 'a[href*="transfer"]', role: 'link', text: 'Transfer Funds' };
  private readonly transferAmountInput: PageElement = { selector: '#amount' };
  private readonly transferToAccountSelect: PageElement = { selector: '#toAccountId' };
  private readonly transferButton: PageElement = { selector: 'input[value="Transfer"]', role: 'button', text: 'Transfer' };
  private readonly transferCompleteHeading: PageElement = { selector: '#showResult h1', role: 'heading', text: 'Transfer Complete!' };

  // ==================== BILL PAY ====================
  private readonly billPayLink: PageElement = { selector: 'a[href*="billpay"]', role: 'link', text: 'Bill Pay' };
  private readonly payeeNameInput: PageElement = { selector: 'input[name="payee.name"]' };
  private readonly payeeStreetInput: PageElement = { selector: 'input[name="payee.address.street"]' };
  private readonly payeeCityInput: PageElement = { selector: 'input[name="payee.address.city"]' };
  private readonly payeeStateInput: PageElement = { selector: 'input[name="payee.address.state"]' };
  private readonly payeeZipCodeInput: PageElement = { selector: 'input[name="payee.address.zipCode"]' };
  private readonly payeePhoneInput: PageElement = { selector: 'input[name="payee.phoneNumber"]' };
  private readonly payeeAccountNumberInput: PageElement = { selector: 'input[name="payee.accountNumber"]' };
  private readonly verifyAccountNumberInput: PageElement = { selector: 'input[name="verifyAccount"]' };
  private readonly billPayAmountInput: PageElement = { selector: 'input[name="amount"]' };
  // ParaBank reuses the shared account-selection dropdown (id="fromAccountId") across
  // Open New Account, Transfer Funds, Bill Pay and Request Loan.
  private readonly fromAccountSelect: PageElement = { selector: '#fromAccountId' };
  private readonly sendPaymentButton: PageElement = { selector: 'input[value="Send Payment"]', role: 'button', text: 'Send Payment' };
  private readonly billPayResultPanel: PageElement = { selector: '#billpayResult' };

  // ==================== FIND TRANSACTIONS ====================
  private readonly findTransactionsLink: PageElement = { selector: 'a[href*="findtrans"]', role: 'link', text: 'Find Transactions' };
  private readonly findByAmountInput: PageElement = { selector: '#amount' };
  private readonly findByAmountLabel: PageElement = { selector: '#criteriaTabs', text: 'Find by Amount' };
  private readonly findByAmountButton: PageElement = { selector: '#findByAmount' };

  // ==================== UPDATE CONTACT INFO ====================
  private readonly updateContactInfoLink: PageElement = { selector: 'a[href*="updateprofile"]', role: 'link', text: 'Update Contact Info' };
  private readonly lastNameInput: PageElement = { selector: '[id="customer.lastName"]' };
  private readonly streetInput: PageElement = { selector: '[id="customer.address.street"]' };
  private readonly updateProfileButton: PageElement = { selector: 'input[value="Update Profile"]', role: 'button', text: 'Update Profile' };
  private readonly updateProfileResultPanel: PageElement = { selector: '#updateProfileResult' };

  // ==================== REQUEST LOAN ====================
  private readonly requestLoanLink: PageElement = { selector: 'a[href*="requestloan"]', role: 'link', text: 'Request Loan' };
  private readonly applyForLoanHeading: PageElement = { selector: '#requestLoanForm h1', role: 'heading', text: 'Apply for a Loan' };
  private readonly loanAmountInput: PageElement = { selector: '#amount' };
  private readonly downPaymentInput: PageElement = { selector: '#downPayment' };
  private readonly applyNowButton: PageElement = { selector: 'input[value="Apply Now"]', role: 'button', text: 'Apply Now' };

  constructor(page: Page) {
    super(page, ParabankPage.LOGIN_URL);
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

  // ==================== ACCOUNT SERVICES SHELL ====================

  async assertAccountServicesVisible(): Promise<void> {
    await this.assertElementVisible(this.accountServicesHeading);
  }

  async assertWelcomeMessageVisible(): Promise<void> {
    await this.assertElementVisible(this.welcomeMessage);
  }

  async assertLeftPanelContainsOpenNewAccount(): Promise<void> {
    await this.assertElementContainsText(this.leftPanel, 'Open New Account');
  }

  async clickLogoutLink(): Promise<void> {
    await this.clickElement(this.logoutLink);
  }

  // ==================== OPEN NEW ACCOUNT ====================

  async clickOpenNewAccountLink(): Promise<void> {
    await this.clickElement(this.openNewAccountLink);
  }

  async selectAccountType(accountType: string): Promise<void> {
    await this.selectOption(this.accountTypeSelect, accountType);
  }

  async selectFromAccount(accountId: string): Promise<void> {
    await this.selectOption(this.fromAccountSelect, accountId);
  }

  async clickOpenNewAccountSubmit(): Promise<void> {
    await this.clickElement(this.openNewAccountSubmitButton);
  }

  async assertAccountOpenedVisible(): Promise<void> {
    await this.assertElementVisible(this.accountOpenedHeading);
  }

  async getNewAccountNumber(): Promise<string> {
    return this.getElementText(this.newAccountNumberLink);
  }

  async clickAccountNumberLink(accountNumber: string): Promise<void> {
    await this.clickElement({ selector: '#accountTable a', role: 'link', text: accountNumber });
  }

  // ==================== ACCOUNT ACTIVITY ====================

  async assertAccountDetailsVisible(): Promise<void> {
    await this.assertElementContainsText(this.accountDetailsPanel, 'Account Details');
  }

  async selectTransactionType(transactionType: string): Promise<void> {
    await this.selectOption(this.transactionTypeSelect, transactionType);
  }

  async clickGoButton(): Promise<void> {
    await this.clickElement(this.goButton);
  }

  async assertFundsTransferReceivedVisible(): Promise<void> {
    await this.assertElementVisible(this.fundsTransferReceivedLink);
  }

  // ==================== TRANSFER FUNDS ====================

  async clickTransferFundsLink(): Promise<void> {
    await this.clickElement(this.transferFundsLink);
  }

  async enterTransferAmount(amount: string): Promise<void> {
    await this.fillText(this.transferAmountInput, amount);
  }

  async selectTransferToAccount(accountId: string): Promise<void> {
    await this.selectOption(this.transferToAccountSelect, accountId);
  }

  async clickTransferButton(): Promise<void> {
    await this.clickElement(this.transferButton);
  }

  async assertTransferCompleteVisible(): Promise<void> {
    await this.assertElementVisible(this.transferCompleteHeading);
  }

  // ==================== BILL PAY ====================

  async clickBillPayLink(): Promise<void> {
    await this.clickElement(this.billPayLink);
  }

  async fillPayeeDetails(payee: ParabankPayee): Promise<void> {
    await this.fillText(this.payeeNameInput, payee.name);
    await this.fillText(this.payeeStreetInput, payee.street);
    await this.fillText(this.payeeCityInput, payee.city);
    await this.fillText(this.payeeStateInput, payee.state);
    await this.fillText(this.payeeZipCodeInput, payee.zipCode);
    await this.fillText(this.payeePhoneInput, payee.phoneNumber);
    await this.fillText(this.payeeAccountNumberInput, payee.accountNumber);
    await this.fillText(this.verifyAccountNumberInput, payee.verifyAccountNumber);
  }

  async enterBillPayAmount(amount: string): Promise<void> {
    await this.fillText(this.billPayAmountInput, amount);
  }

  async clickSendPaymentButton(): Promise<void> {
    await this.clickElement(this.sendPaymentButton);
  }

  async assertBillPaymentCompleteVisible(): Promise<void> {
    await this.assertElementContainsText(this.billPayResultPanel, 'Bill Payment Complete');
  }

  // ==================== FIND TRANSACTIONS ====================

  async clickFindTransactionsLink(): Promise<void> {
    await this.clickElement(this.findTransactionsLink);
  }

  async enterFindTransactionAmount(amount: string): Promise<void> {
    await this.fillText(this.findByAmountInput, amount);
  }

  async assertFindByAmountVisible(): Promise<void> {
    await this.assertElementVisible(this.findByAmountLabel);
  }

  async clickFindByAmountButton(): Promise<void> {
    await this.clickElement(this.findByAmountButton);
  }

  // ==================== UPDATE CONTACT INFO ====================

  async clickUpdateContactInfoLink(): Promise<void> {
    await this.clickElement(this.updateContactInfoLink);
  }

  async enterLastName(lastName: string): Promise<void> {
    await this.fillText(this.lastNameInput, lastName);
  }

  async enterStreet(street: string): Promise<void> {
    await this.fillText(this.streetInput, street);
  }

  async clickUpdateProfileButton(): Promise<void> {
    await this.clickElement(this.updateProfileButton);
  }

  async assertProfileUpdatedVisible(): Promise<void> {
    await this.assertElementContainsText(this.updateProfileResultPanel, 'Profile Updated');
  }

  // ==================== REQUEST LOAN ====================

  async clickRequestLoanLink(): Promise<void> {
    await this.clickElement(this.requestLoanLink);
  }

  async assertApplyForLoanHeadingVisible(): Promise<void> {
    await this.assertElementVisible(this.applyForLoanHeading);
  }

  async enterLoanAmount(amount: string): Promise<void> {
    await this.fillText(this.loanAmountInput, amount);
  }

  async enterDownPayment(downPayment: string): Promise<void> {
    await this.fillText(this.downPaymentInput, downPayment);
  }

  async clickApplyNowButton(): Promise<void> {
    await this.clickElement(this.applyNowButton);
  }
}
