import { test } from '@playwright/test';
import { SmartStoreBusinessFunctions } from '../../src/business-functions/smartstore-business-functions';
import { FileUtils } from '../../src/utils/file-utils';
import { TestManifest } from '../../src/types/index';
import { SmartStoreTestData } from '../../src/types/smartstore.types';

const manifest: TestManifest = FileUtils.readJSON('tests/smartstore/smartstore.manifest.json');
const testData: SmartStoreTestData = FileUtils.loadTestData('smartstore', manifest.dataFile);

test.describe(manifest.testSuiteName, () => {
  const testCase = manifest.testCases[0]!;

  test(testCase.title, async ({ page }) => {
    test.skip(!testCase.enabled, `${testCase.testCaseId} is disabled in the manifest`);

    const smartStore = new SmartStoreBusinessFunctions(page);

    await test.step('Login to SmartStore', async () => {
      await smartStore.login(testData.credentials);
    });

    await test.step('Browse a category and add a product to the cart', async () => {
      await smartStore.addProductToCart(testData.category, testData.product);
    });
  });
});
