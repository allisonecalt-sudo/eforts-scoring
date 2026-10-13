// FX2: Gemini Pro review fix items 1-6 (second-brain/projects/clalit/eforts/
// GEMINI-REVIEW-2026-09-28.md, "FIX LIST FOR THE BUILDER") + the strength
// noun-phrase spec (FX2-strength-nouns-spec-2026-09-28.md) + the twin-pair
// strength-duplication bug the spec found while specifying item 4.
//
// scoring.spec.js already locks buildSummary()'s full output for every
// fixture (byte-equal golden diff), including the three new ones this round
// added (model-norm, model-ef-only, model-twin-dedupe). This file adds the
// narrower, spec-referenced assertions that a golden diff alone doesn't
// document: the twin-dedupe fix. (The strengthNoun table, strengthNounSlot()
// and the §D מומלץ-tail assertions were removed on 2026-10-13 together with
// the מומלץ paragraph itself.)

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { gotoApp, computeFixture } = require('./helpers/eforts-app');

const FIXTURES_DIR = path.join(__dirname, 'fixtures');
const loadFixture = (name) => JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, name), 'utf8'));

// ===== The מומלץ paragraph is no longer generated (2026-10-13) =====
// strengthNoun / strengthNounSlot only fed that paragraph and were removed
// with it; no-recommendation.spec.js holds the per-fixture assertions.

// ===== Twin-pair strength-duplication bug (FX2 spec "Seen while specifying") =====

test('twin dedupe: items 6+14 both strong prints the shared infinitive once, not twice', async ({
  page,
}) => {
  await gotoApp(page);
  const result = await computeFixture(page, loadFixture('model-twin-dedupe.json'));
  const occurrences = result.summaryHtml.split('להתעלם מגירויים מסיחים').length - 1;
  expect(occurrences).toBe(1);
  expect(result.summaryHtml).not.toContain('להתעלם מגירויים מסיחים וכן להתעלם מגירויים מסיחים');
});

// ===== Gemini review items 1, 2, 5: regression guards on the wording shape =====

test('cross-EF paragraph is prose: no semicolons, and "כמו למשל" always uses the spaced en dash', async ({
  page,
}) => {
  await gotoApp(page);
  for (const name of ['model-50.json', 'model-32.json', 'model-twin-dedupe.json']) {
    const result = await computeFixture(page, loadFixture(name));
    // The cross-EF paragraph itself never used semicolons even before FX2 in
    // its label list, but the whole summary (routine paragraphs included)
    // must carry no leftover "בכך ש-<number>" construction (item 2) and no
    // em-dash "כמו למשל —" (item 5, replaced everywhere by "– ").
    expect(result.summaryHtml, `${name}: no dangling "בכך ש-" + anonId`).not.toMatch(/בכך ש-\S/);
    expect(result.summaryHtml, `${name}: no em-dash after "כמו למשל"`).not.toContain('כמו למשל —');
    if (result.summaryHtml.includes('כמו למשל')) {
      expect(result.summaryHtml, `${name}: "כמו למשל" uses the en dash`).toMatch(/כמו למשל – /);
    }
  }
});

// ===== Gemini review item 6: the two in-norm branches read canon wording =====

test('nothing-below-cutoff branch (model-norm): "בטווח הנורמה" / "ציון החתך", never "תקין" alone', async ({
  page,
}) => {
  await gotoApp(page);
  const result = await computeFixture(page, loadFixture('model-norm.json'));
  expect(result.summaryHtml).toContain('בטווח הנורמה');
  expect(result.summaryHtml).toContain('ציון החתך');
  expect(result.summaryHtml).not.toContain('ציון חתך ');
  // "משמעות קלינית" doesn't render at all when nothing is below cutoff.
  expect(result.summaryHtml).not.toContain('משמעות קלינית');
});

test('total+routines in norm, one EF below (model-ef-only): cross-EF prose, no "בטווח התקין"', async ({
  page,
}) => {
  await gotoApp(page);
  const result = await computeFixture(page, loadFixture('model-ef-only.json'));
  expect(result.summaryHtml).toContain('משמעות קלינית');
  expect(result.summaryHtml).not.toContain('בטווח התקין');
  expect(result.summaryHtml).not.toContain('— ולא מקושי');
  expect(result.summaryHtml).toContain('נראה כי הקושי הבולט יותר הוא בתפקוד הניהולי עכבה');
});

// ===== Gemini review R7-4 (7.9): the close-EF bug found while preparing
// round 7 — no EF below cutoff, but one EF ("close") must never be folded
// into "כל התפקודים הניהוליים בטווח הנורמה" (that phrase contradicted the
// card, which shows "קרוב לציון החתך" for that EF) =====

test('no-EF-below-cutoff branch, one EF "close" (model-ef-close): names the close EF, never the flattened "all in norm"', async ({
  page,
}) => {
  await gotoApp(page);
  const result = await computeFixture(page, loadFixture('model-ef-close.json'));
  expect(result.summaryHtml).toContain('והציון בזיכרון עבודה קרוב לציון החתך');
  expect(result.summaryHtml).not.toContain('כל התפקודים הניהוליים');
});
