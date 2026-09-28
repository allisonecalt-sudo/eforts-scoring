// Reproduces dossier finding B8 (PLAN-2026-09-28): a routine score can be
// below its cutoff (red "מתחת לחתך" badge) while the SAME score's plain-
// language interpretation band reads "בטווח הממוצע" ("in the average
// range" — a reassuring, green-coded label) at the same time. That's a
// contradiction: two signals on one number disagreeing about whether it's
// fine.
//
// Root cause (app.js scoreRow(), L614-622): the color/status badge is
// driven by `score >= cutoff` (a norm-referenced, age-band-specific
// threshold), while the interp label is driven by fixed absolute bands
// (<=2 / <=3 / <=4 / >4) that don't know about the cutoff at all. Whenever
// a cutoff falls inside the (3, 4] absolute band — which happens for every
// age band's play/social/total cutoffs (all > 3.0) — a score can sit below
// the cutoff and still land in the "בטווח הממוצע" absolute band.
//
// Per task instructions: do NOT fix app.js here. This test exists to LOCK
// the finding as a tracked, reproducible case — not to pass.

const { test, expect } = require('@playwright/test');
const { gotoApp, fillAndCalculate } = require('./helpers/eforts-app');

// Play routine = items 17-23 (7 items). Sum 24 -> avg 3.428571... ("3.43"),
// which is: (a) < the 8-11 band's play cutoff of 3.55 (dossier §B Table 5)
// -> red/"below cutoff", and (b) in the (3, 4] absolute band -> "בטווח
// הממוצע" per scoreRow()'s interp logic (app.js L620). Morning/social items
// are filled with a flat 3 each — irrelevant to this case, just needs to be
// a complete, valid 30-item form so calculate() doesn't warn about missing
// answers.
function buildItemScores() {
  const scores = {};
  for (let n = 1; n <= 16; n++) scores[n] = 3; // morning
  const play = { 17: 3, 18: 3, 19: 4, 20: 3, 21: 4, 22: 4, 23: 3 }; // sum 24
  Object.assign(scores, play);
  for (let n = 24; n <= 30; n++) scores[n] = 3; // social
  return scores;
}

test('B8: cutoff-color and interp-label agree on whether a play score is fine (8-11 band)', async ({
  page,
}) => {
  test.fixme(
    true,
    'Reproduces dossier finding B8 (evidence-dossier-2026-09-28.md §D/PLAN-2026-09-28): ' +
      'a play score of 3.43 in the 8-11 age band is BELOW its cutoff (3.55) — rendered red, ' +
      'status "מתחת לחתך" — while the SAME score\'s absolute-band interp label reads ' +
      '"בטווח הממוצע" ("in the average range"), a reassuring/green-coded label. The two ' +
      'signals disagree. Root cause: scoreRow() colors by score>=cutoff (age-band-aware) but ' +
      "labels by fixed absolute bands (app.js L619-622) that don't know about the cutoff. " +
      'NOT fixed here per T0 scope (app.js untouched) — this test locks the reproduction so ' +
      'it stays visible until a deliberate fix ships.',
  );

  await gotoApp(page);
  const html = await fillAndCalculate(page, {
    sex: 'male',
    ageYearsBack: 9,
    ageMonthsBack: 0,
    itemScores: buildItemScores(),
    anonId: 'b8-repro',
  });

  const playRow = extractPlayRowSignals(html);

  console.log('B8 repro — rendered play row signals:', playRow);

  const statusSaysBelowCutoff = playRow.statusCls === 'warn';
  const interpSaysFine = playRow.interpCls === 'ok';

  // These must AGREE: if the cutoff-based status says "below cutoff"
  // (concerning), the absolute-band interp label must not simultaneously
  // say "fine" (בטווח הממוצע / ok-colored). Expected to FAIL — see fixme
  // reason above.
  expect(statusSaysBelowCutoff && interpSaysFine, JSON.stringify(playRow)).toBe(false);
});

function extractPlayRowSignals(resultsHtml) {
  // Locate the "פנאי ומשחק" (play) score row by its label, then pull the
  // score-value class/text, score-status class/text, and score-interp
  // class/text out of the surrounding markup produced by scoreRow().
  const rowStart = resultsHtml.indexOf('פנאי ומשחק');
  if (rowStart === -1) throw new Error('Play row not found in rendered results HTML');
  const rowHtml = resultsHtml.slice(Math.max(0, rowStart - 200), rowStart + 1200);

  const scoreValueMatch = rowHtml.match(/score-value (\w+)">([\d.]+)</);
  const statusMatch = rowHtml.match(/score-status (\w+)">([^<]+)</);
  const interpMatch = rowHtml.match(/score-interp (\w+)">([^<]+)</);

  if (!scoreValueMatch || !statusMatch || !interpMatch) {
    throw new Error(`Could not parse play row markup:\n${rowHtml}`);
  }

  return {
    score: scoreValueMatch[2],
    valueCls: scoreValueMatch[1],
    statusCls: statusMatch[1],
    statusText: statusMatch[2],
    interpCls: interpMatch[1],
    interpText: interpMatch[2],
  };
}
