// 2026-10-13 (Allison's decision after Dr. Carmit Frisch's review): the app
// no longer generates the closing «מומלץ על טיפול…» paragraph. The
// therapist summary ends with the last clinical paragraph. One test per
// fixture on buildSummary(), plus one flow test for the output surfaces
// that carry the summary (Clicks text, AI export).
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { gotoApp, computeFixture, fillAndCalculate } = require('./helpers/eforts-app');

const FIXTURES_DIR = path.join(__dirname, 'fixtures');
const GOLDEN_DIR = path.join(__dirname, 'golden');
const fixtureFiles = fs.readdirSync(FIXTURES_DIR).filter((f) => f.endsWith('.json'));

const lastParagraph = (html) => html.slice(html.lastIndexOf('<p '));

for (const file of fixtureFiles) {
  test(`${file}: summary has no מומלץ and ends with the last clinical paragraph`, async ({
    page,
  }) => {
    await gotoApp(page);
    const fixture = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, file), 'utf8'));
    const { summaryHtml } = await computeFixture(page, fixture);
    expect(summaryHtml).not.toContain('מומלץ');
    expect(summaryHtml).not.toContain('מומלץ על טיפול');
    expect(summaryHtml.trimEnd().endsWith('</p>')).toBe(true);
    const golden = fs.readFileSync(
      path.join(GOLDEN_DIR, file.replace(/\.json$/, '.summary.txt')),
      'utf8',
    );
    expect(lastParagraph(summaryHtml)).toBe(lastParagraph(golden));
    expect(lastParagraph(summaryHtml)).not.toMatch(/טיפול|הדרכת הורים/);
  });
}

test('Clicks text and AI export carry no מומלץ paragraph', async ({ page }) => {
  await gotoApp(page);
  const scores = {};
  for (let n = 1; n <= 30; n++) scores[n] = 2;
  scores[17] = 4;
  scores[22] = 4;
  await fillAndCalculate(page, {
    sex: 'male',
    ageYearsBack: 5,
    ageMonthsBack: 0,
    itemScores: scores,
    anonId: '50',
  });
  const onScreen = await page.evaluate(() => document.querySelector('.summary-text').innerText);
  const clicks = await page.evaluate(() => buildClicksText());
  const ai = await page.evaluate(() => buildExportText());
  expect(onScreen).not.toContain('מומלץ');
  expect(clicks).not.toContain('מומלץ');
  expect(ai).not.toContain('מומלץ');
  expect(ai).not.toContain('מטרות טיפול');
});
