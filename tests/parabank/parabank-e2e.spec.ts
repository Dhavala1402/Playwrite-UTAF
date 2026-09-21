import { test } from '@playwright/test';
import { ParabankBusinessFunctions } from '../../src/business-functions/parabank-business-functions';
import { FileUtils } from '../../src/utils/file-utils';
import { TestManifest } from '../../src/types/index';
import { ParabankTestData } from '../../src/types/parabank.types';

const manifest: TestManifest = FileUtils.readJSON('tests/parabank/parabank.manifest.json');
const testData: ParabankTestData = FileUtils.loadTestData('parabank', manifest.dataFile);

test.describe(manifest.testSuiteName, () => {
  const testCase = manifest.testCases[0]!;

  test(testCase.title, async ({ page }) => {
    test.skip(!testCase.enabled, `${testCase.testCaseId} is disabled in the manifest`);

    const parabank = new ParabankBusinessFunctions(page);

    await test.step('Login to ParaBank', async () => {
      await parabank.login(testData.credentials);
    });

    const newAccountNumber = await test.step('Open a new account', async () => {
      return parabank.openNewAccount(
        testData.newAccount.accountType,
        testData.newAccount.fromAccountId,
      );
    });

    await test.step('View activity for the new account', async () => {
      await parabank.viewAccountActivity(newAccountNumber, testData.accountActivity.transactionType);
    });

    await test.step('Transfer funds between accounts', async () => {
      await parabank.transferFunds(
        testData.transfer.amount,
        testData.transfer.fromAccountId,
        testData.transfer.toAccountId,
      );
    });

    await test.step('Pay a bill from the new account', async () => {
      await parabank.payBill(testData.billPay.payee, testData.billPay.amount, newAccountNumber);
    });

    await test.step('Find a transaction by amount', async () => {
      await parabank.findTransactionByAmount(testData.findTransaction.amount);
    });

    await test.step('Update contact information', async () => {
      await parabank.updateContactInfo(testData.contactInfo.lastName, testData.contactInfo.street);
    });

    await test.step('Request a loan', async () => {
      await parabank.requestLoan(
        testData.loanRequest.amount,
        testData.loanRequest.downPayment,
        testData.loanRequest.fromAccountId,
      );
    });

    await test.step('Logout from ParaBank', async () => {
      await parabank.logout();
    });
  });
});
