/* global DOMException, File, DataTransfer, DragEvent, atob */
// Easy-send: getting a parent's answers back to the therapist with as few
// taps as possible. Two plain links:
//   parent.html  — parent fills in, taps ONE button, gets/sends a PDF; the
//                  mail + copy-code ways live in a closed fold.
//   index.html   — "send to parents" panel (the plain parent link + copy),
//                  open import box that takes a dropped PDF or .txt.
// Same file:// pattern as the other specs. The PDF itself is covered in
// pdf-send.spec.js.

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const { gotoApp } = require('./helpers/eforts-app');
const { gotoParent, fillParent, downloadPdf, GOLDEN, MODELS } = require('./helpers/eforts-parent');

test.use({ timezoneId: 'Asia/Jerusalem', locale: 'he-IL' });

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-09-28T10:00:00+03:00'));
});

const ADDR = 'dr.cohen@clalit.org.il';
const ANY_ADDR = 'therapist@gmail.com';

async function finishParent(page, query = '') {
  await gotoParent(page, query);
  await fillParent(page, MODELS.G50);
  await page.locator('#pFinish').click();
  await expect(page.locator('#pDone')).toBeVisible();
}

async function openFold(page) {
  await page.locator('#pAltWays').evaluate((el) => {
    el.open = true;
  });
}

// Pretends to be a phone browser that can share files. Records what was
// shared on window.__shared; `outcome` decides how share() ends.
function stubShare(page, outcome = 'ok') {
  return page.addInitScript((o) => {
    navigator.canShare = (d) => !!(d && d.files && d.files.length);
    navigator.share = async (d) => {
      window.__shared = d;
      if (o === 'abort') throw new DOMException('cancelled', 'AbortError');
      if (o === 'fail') throw new DOMException('nope', 'NotAllowedError');
    };
  }, outcome);
}

test.describe('parent page — address field inside the fold (no ?to=)', () => {
  test('any valid address reveals the mail way with a mailto that carries it', async ({ page }) => {
    await finishParent(page);
    await openFold(page);
    await expect(page.locator('#pAskTo')).toBeVisible();
    await expect(page.locator('#pWayMail')).toBeHidden();

    for (const addr of [ADDR, ANY_ADDR]) {
      await page.locator('#pToInput').fill(addr);
      await expect(page.locator('#pWayMail')).toBeVisible();
      const href = await page.locator('#pMailto').getAttribute('href');
      expect(href.startsWith(`mailto:${addr}?subject=`)).toBe(true);
      expect(decodeURIComponent(/[?&]body=([^&]*)/.exec(href)[1])).toContain(GOLDEN.G50);
    }

    // the address is not kept anywhere
    const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }));
    expect(stored).not.toContain('@');
  });

  test('an invalid address never builds a mailto', async ({ page }) => {
    await finishParent(page);
    await openFold(page);
    for (const bad of ['nobody', '@clalit.org.il', 'a@b', 'a b@gmail.com', 'x@@gmail.com']) {
      await page.locator('#pToInput').fill(bad);
      await expect(page.locator('#pWayMail')).toBeHidden();
      expect(await page.locator('#pMailto').getAttribute('href')).toBeNull();
    }
    // good, then broken again: the mail way goes away
    await page.locator('#pToInput').fill(ANY_ADDR);
    await expect(page.locator('#pWayMail')).toBeVisible();
    await page.locator('#pToInput').fill('therapist@gmail.');
    await expect(page.locator('#pWayMail')).toBeHidden();
  });

  test('with a valid ?to= the field is not shown', async ({ page }) => {
    await finishParent(page, `?to=${ADDR}`);
    await openFold(page);
    await expect(page.locator('#pAskTo')).toBeHidden();
    await expect(page.locator('#pWayMail')).toBeVisible();
  });
});

test.describe('parent page — the main button', () => {
  test('no canShare: the label is the computer one and there is no "just download" link', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'canShare', { value: undefined, configurable: true });
    });
    await finishParent(page);
    await expect(page.locator('#pSend')).toHaveText('הורדת קובץ התשובות (PDF)');
    await expect(page.locator('#pDownloadOnly')).toBeHidden();
  });

  test('canShare says no to files: the computer label stays', async ({ page }) => {
    await page.addInitScript(() => {
      navigator.canShare = () => false;
      navigator.share = async () => {};
    });
    await finishParent(page);
    await expect(page.locator('#pSend')).toHaveText('הורדת קובץ התשובות (PDF)');
    await expect(page.locator('#pDownloadOnly')).toBeHidden();
  });

  test('cancelling the share is silent; any other error falls back to the download', async ({
    page,
  }) => {
    await stubShare(page, 'abort');
    await finishParent(page);
    await expect(page.locator('#pSend')).toHaveText('שליחת קובץ התשובות (PDF)');
    let downloads = 0;
    page.on('download', () => downloads++);
    await page.locator('#pSend').click();
    await page.waitForTimeout(400);
    expect(downloads).toBe(0);

    const page2 = await page.context().newPage();
    await page2.clock.setFixedTime(new Date('2026-09-28T10:00:00+03:00'));
    await stubShare(page2, 'fail');
    await finishParent(page2);
    await expect(page2.locator('#pSend')).toHaveText('שליחת קובץ התשובות (PDF)');
    const downloadPromise = page2.waitForEvent('download');
    await page2.locator('#pSend').click();
    expect((await downloadPromise).suggestedFilename()).toBe('EFORTS-answers-2026-09-28.pdf');
  });

  test('the done screen order: main button first, then the closed fold', async ({ page }) => {
    await finishParent(page, `?to=${ADDR}`);
    const order = await page.evaluate(() => {
      const top = (id) => document.getElementById(id).getBoundingClientRect().top;
      return { main: top('pSend'), fold: top('pAltWays') };
    });
    expect(order.main).toBeLessThan(order.fold);
    await expect(page.locator('#pAltWays')).toHaveJSProperty('open', false);
    // nothing about WhatsApp anywhere on the parent page
    expect(await page.locator('#pDone').innerText()).not.toContain('וואטסאפ');
  });

  test('still no network calls', async ({ page }) => {
    const requests = [];
    page.on('request', (r) => {
      if (
        !r.url().startsWith('file:') &&
        !r.url().startsWith('data:') &&
        !r.url().startsWith('blob:')
      )
        requests.push(r.url());
    });
    await stubShare(page);
    await finishParent(page);
    await page.locator('#pSend').click();
    expect(requests).toEqual([]);
    const csp = await page
      .locator('meta[http-equiv="Content-Security-Policy"]')
      .getAttribute('content');
    expect(csp).toContain("connect-src 'none'");
  });
});

test.describe('practitioner page — send panel (two plain links)', () => {
  test('shows the plain parent link; copy puts exactly that link on the clipboard', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
    await gotoApp(page);

    const link = await page.locator('#sendLink').inputValue();
    expect(link.endsWith('/parent.html')).toBe(true);
    expect(link).not.toContain('?');

    await page.locator('#sendCopy').click();
    await expect(page.locator('#sendStatus')).toHaveText('הקישור הועתק ✓');
    await expect(page.locator('#sendStatus')).toHaveClass(/ok/);
    const clip = await page.evaluate(() => navigator.clipboard.readText()).catch(() => null);
    if (clip !== null) expect(clip).toBe(link);
  });

  test('no WhatsApp button and no address field any more', async ({ page }) => {
    await gotoApp(page);
    await expect(page.locator('#sendWhatsapp')).toHaveCount(0);
    await expect(page.locator('#sendTo')).toHaveCount(0);
    expect(await page.locator('#sendBox').innerText()).not.toContain('וואטסאפ');
    await expect(page.locator('#sendHint')).toHaveText(
      'זה הקישור להורים. שלחו אותו להורים בכל דרך שנוח לכם.',
    );
  });

  test('the link the panel builds opens the parent page', async ({ page }) => {
    await gotoApp(page);
    const link = await page.locator('#sendLink').inputValue();
    await page.goto(link);
    await page.waitForSelector('#pQuestionnaire .p-item');
    await fillParent(page, MODELS.G50);
    await page.locator('#pFinish').click();
    await expect(page.locator('#pDone')).toBeVisible();
  });
});

test.describe('practitioner page — import box', () => {
  async function pdfFile(page) {
    await finishParent(page);
    return (await downloadPdf(page)).path;
  }

  test('open by default', async ({ page }) => {
    await gotoApp(page);
    await expect(page.locator('#importBox')).toHaveJSProperty('open', true);
    await expect(page.locator('#importCode')).toBeVisible();
    await expect(page.locator('#importDropHint')).toHaveText(
      'העלו את קובץ התשובות (PDF) שקיבלתם מההורים, או גררו אותו לכאן.',
    );
    await expect(page.locator('#importFileLabel')).toHaveText('בחירת קובץ התשובות (PDF)');
    await expect(page.locator('#importFileLabel')).toHaveClass(/btn-primary/);
    await expect(page.locator('#importCodeLabel')).toHaveText('או הדביקו את שורת הקוד:');
    await expect(page.locator('#importCodeBtn')).toHaveClass(/btn-secondary/);
    const y = (sel) => page.locator(sel).evaluate((el) => el.getBoundingClientRect().top);
    expect(await y('#importDropHint')).toBeLessThan(await y('#importFileLabel'));
    expect(await y('#importFileLabel')).toBeLessThan(await y('#importCodeLabel'));
    expect(await y('#importCodeLabel')).toBeLessThan(await y('#importCode'));
    expect(await y('#importCode')).toBeLessThan(await y('#importCodeBtn'));
    expect(await page.locator('#importFile').getAttribute('accept')).toBe(
      '.pdf,.txt,application/pdf,text/plain',
    );
  });

  test('dropping a PDF on the box imports it, same as the file input', async ({ page }) => {
    const filePath = await pdfFile(page);
    const bytes = fs.readFileSync(filePath).toString('base64');

    await gotoApp(page);
    await page.locator('#importBox').evaluate(async (box, b64) => {
      const bin = atob(b64);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      const dt = new DataTransfer();
      dt.items.add(new File([arr], 'EFORTS-answers-2026-09-28.pdf', { type: 'application/pdf' }));
      // drop on a child, not the box itself: "anywhere on the box"
      box
        .querySelector('#importStatus')
        .dispatchEvent(
          new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true }),
        );
    }, bytes);
    await expect(page.locator('#importPreview')).toBeVisible();
    const dropPreview = await page.locator('#importPreviewList').innerText();

    await page.locator('#importApply').click();
    await expect(page.locator('#importStatus')).toHaveClass(/ok/);
    expect(await page.locator('#childGender').inputValue()).toBe('male');
    const droppedModel = await page.evaluate(() =>
      [...document.querySelectorAll('#questionnaire input[type="radio"]:checked')].map((r) => r.id),
    );

    // same file through the input
    await gotoApp(page);
    await page.setInputFiles('#importFile', filePath);
    await expect(page.locator('#importPreview')).toBeVisible();
    expect(await page.locator('#importPreviewList').innerText()).toBe(dropPreview);
    await page.locator('#importApply').click();
    const inputModel = await page.evaluate(() =>
      [...document.querySelectorAll('#questionnaire input[type="radio"]:checked')].map((r) => r.id),
    );
    expect(droppedModel).toEqual(inputModel);
    expect(droppedModel.length).toBe(30);
  });

  test('a plain .txt file with the code still imports', async ({ page }) => {
    await gotoApp(page);
    await page.setInputFiles('#importFile', {
      name: 'EFORTS-answers.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('﻿' + GOLDEN.G50 + '\r\n\r\nהערה כלשהי\r\n', 'utf8'),
    });
    await expect(page.locator('#importPreview')).toBeVisible();
  });

  test('dropping something that is not an answers file shows the normal error', async ({
    page,
  }) => {
    await gotoApp(page);
    await page.locator('#importBox').evaluate((box) => {
      const dt = new DataTransfer();
      dt.items.add(new File(['hello'], 'x.txt', { type: 'text/plain' }));
      box.dispatchEvent(
        new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true }),
      );
    });
    await expect(page.locator('#importStatus')).toHaveClass(/err/);
    await expect(page.locator('#importPreview')).toBeHidden();
  });
});

test.describe('phone width — no horizontal overflow', () => {
  test('parent done screen with the fold open and the address field', async ({ page }) => {
    await stubShare(page);
    for (const width of [360, 412]) {
      await page.setViewportSize({ width, height: 800 });
      await finishParent(page);
      await openFold(page);
      const fits = () =>
        page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
      expect(await fits()).toBe(true);
      await page.locator('#pToInput').fill('a.very.long.therapist.name.indeed@example.org');
      expect(await fits()).toBe(true);
    }
  });

  // The page's own #progressWrap already pokes 4px past the edge at 360px
  // (pre-existing, outside this work), so the check here is scoped to the
  // new panel and the import box.
  test('practitioner send panel and open import box fit the phone width', async ({ page }) => {
    for (const width of [360, 412]) {
      await page.setViewportSize({ width, height: 800 });
      await gotoApp(page);
      await page.locator('#sendCopy').click();
      const outside = await page.evaluate(() =>
        [...document.querySelectorAll('#sendBox, #sendBox *, #importBox, #importBox *')]
          .filter((e) => {
            const r = e.getBoundingClientRect();
            return r.width > 0 && (r.left < -0.5 || r.right > window.innerWidth + 0.5);
          })
          .map((e) => e.tagName + '#' + e.id),
      );
      expect(outside).toEqual([]);
    }
  });
});
