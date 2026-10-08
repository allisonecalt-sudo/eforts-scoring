// איפוס on both questionnaires (her ask 2026-10-08 18:56: "make sure there is איפוס for both שאלון").
const { test, expect } = require('@playwright/test');
const { gotoParent, fillParent, MODELS } = require('./helpers/eforts-parent');
const { gotoApp } = require('./helpers/eforts-app');

test.describe('איפוס — both questionnaires', () => {
  test('parent page: the איפוס button is on the form and clears everything after a confirm', async ({
    page,
  }) => {
    await gotoParent(page);
    const model = Object.values(MODELS)[0];
    await fillParent(page, model);
    const reset = page.locator('#pReset');
    await expect(reset).toBeVisible();
    await expect(reset).toHaveText('איפוס');

    page.once('dialog', (d) => d.accept());
    await reset.click();

    await expect(page.locator('#pDob')).toHaveValue('');
    expect(await page.locator('#pQuestionnaire input[type="radio"]:checked').count()).toBe(0);
    expect(await page.locator('input[name="pSex"]:checked').count()).toBe(0);
  });

  test('parent page: cancelling the confirm keeps the answers', async ({ page }) => {
    await gotoParent(page);
    const model = Object.values(MODELS)[0];
    await fillParent(page, model);
    page.once('dialog', (d) => d.dismiss());
    await page.locator('#pReset').click();
    await expect(page.locator('#pDob')).toHaveValue(model.dob);
  });

  test('OT page: the איפוס button is on the form and also clears the import box', async ({
    page,
  }) => {
    await gotoApp(page);
    const reset = page.locator('#formReset');
    await expect(reset).toBeVisible();
    await expect(reset).toHaveText('איפוס');

    const model = Object.values(MODELS)[0];
    const code = await page.evaluate((m) => EFORTSCode.encode(m), model);
    await page.locator('#importCode').fill(code);
    await page.locator('#importCodeBtn').click();
    await expect(page.locator('#importPreview')).toBeVisible();
    await page.locator('#importApply').click();
    expect(await page.locator('#questionnaire input[type="radio"]:checked').count()).toBe(30);

    page.once('dialog', (d) => d.accept());
    await reset.click();

    expect(await page.locator('#questionnaire input[type="radio"]:checked').count()).toBe(0);
    await expect(page.locator('#importCode')).toHaveValue('');
    await expect(page.locator('#importPreview')).toBeHidden();
  });
});
