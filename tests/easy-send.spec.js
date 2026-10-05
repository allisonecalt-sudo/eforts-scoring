/* global DOMException, File, Node, DataTransfer, DragEvent */
// Easy-send (2026-10-05): getting a parent's answers back to the therapist
// with as few taps as possible.
//   parent.html  — done screen: typed clalit address -> mail way; phone share.
//   index.html   — "send to parents" panel (link + WhatsApp), open import
//                  box that also takes a dropped .txt.
// Same file:// pattern as the other specs.

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const { gotoApp } = require('./helpers/eforts-app');
const { gotoParent, fillParent, GOLDEN, MODELS } = require('./helpers/eforts-parent');

test.use({ timezoneId: 'Asia/Jerusalem', locale: 'he-IL' });

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-09-28T10:00:00+03:00'));
});

const ADDR = 'dr.cohen@clalit.org.il';

async function finishParent(page, query = '') {
  await gotoParent(page, query);
  await fillParent(page, MODELS.G50);
  await page.locator('#pFinish').click();
  await expect(page.locator('#pDone')).toBeVisible();
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

test.describe('parent page — address field (no ?to=)', () => {
  test('a valid clalit address reveals the mail way with a mailto that carries it', async ({
    page,
  }) => {
    await finishParent(page);
    await expect(page.locator('#pAskTo')).toBeVisible();
    await expect(page.locator('#pWayMail')).toBeHidden();

    await page.locator('#pToInput').fill(ADDR);
    await expect(page.locator('#pWayMail')).toBeVisible();
    const href = await page.locator('#pMailto').getAttribute('href');
    expect(href.startsWith(`mailto:${ADDR}?subject=`)).toBe(true);
    expect(decodeURIComponent(/[?&]body=([^&]*)/.exec(href)[1])).toContain(GOLDEN.G50);

    // the address is not kept anywhere
    const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }));
    expect(stored).not.toContain('clalit.org.il');
  });

  test('an invalid address never builds a mailto', async ({ page }) => {
    await finishParent(page);
    for (const bad of [
      'someone@gmail.com',
      'x@clalit.org.il.evil.com',
      'nobody',
      '@clalit.org.il',
    ]) {
      await page.locator('#pToInput').fill(bad);
      await expect(page.locator('#pWayMail')).toBeHidden();
      expect(await page.locator('#pMailto').getAttribute('href')).toBeNull();
    }
    // good, then broken again: the mail way goes away
    await page.locator('#pToInput').fill(ADDR);
    await expect(page.locator('#pWayMail')).toBeVisible();
    await page.locator('#pToInput').fill('dr.cohen@clalit.org.i');
    await expect(page.locator('#pWayMail')).toBeHidden();
  });

  test('with a valid ?to= the field is not shown', async ({ page }) => {
    await finishParent(page, `?to=${ADDR}`);
    await expect(page.locator('#pAskTo')).toBeHidden();
    await expect(page.locator('#pWayMail')).toBeVisible();
  });
});

test.describe('parent page — phone share', () => {
  test('hidden when the browser has no canShare', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'canShare', { value: undefined, configurable: true });
    });
    await finishParent(page);
    await expect(page.locator('#pWayShare')).toBeHidden();
  });

  test('hidden when canShare says no to files', async ({ page }) => {
    await page.addInitScript(() => {
      navigator.canShare = () => false;
      navigator.share = async () => {};
    });
    await finishParent(page);
    await expect(page.locator('#pWayShare')).toBeHidden();
  });

  test('shares one File whose text equals the download text', async ({ page }) => {
    await stubShare(page);
    await finishParent(page);
    await expect(page.locator('#pWayShare')).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#pDownload').click();
    const download = await downloadPromise;
    const downloadBytes = fs.readFileSync(await download.path());

    await page.locator('#pShare').click();
    const shared = await page.evaluate(async () => {
      const d = window.__shared;
      const f = d.files[0];
      return {
        count: d.files.length,
        isFile: f instanceof File,
        name: f.name,
        bytes: Array.from(new Uint8Array(await f.arrayBuffer())),
        hasTitle: !!d.title,
        hasText: !!d.text,
      };
    });
    expect(shared.count).toBe(1);
    expect(shared.isFile).toBe(true);
    expect(shared.name).toBe(download.suggestedFilename());
    expect(shared.name).toBe('EFORTS-answers-2026-09-28.txt');
    expect(Buffer.from(shared.bytes).equals(downloadBytes)).toBe(true);
    expect(downloadBytes.toString('utf8')).toContain(GOLDEN.G50);
    expect(shared.hasTitle && shared.hasText).toBe(true);
  });

  test('cancelling the share is silent; any other error falls back to the download', async ({
    page,
  }) => {
    await stubShare(page, 'abort');
    await finishParent(page);
    let downloads = 0;
    page.on('download', () => downloads++);
    await page.locator('#pShare').click();
    await page.waitForTimeout(400);
    expect(downloads).toBe(0);

    const page2 = await page.context().newPage();
    await page2.clock.setFixedTime(new Date('2026-09-28T10:00:00+03:00'));
    await stubShare(page2, 'fail');
    await finishParent(page2);
    const downloadPromise = page2.waitForEvent('download');
    await page2.locator('#pShare').click();
    expect((await downloadPromise).suggestedFilename()).toBe('EFORTS-answers-2026-09-28.txt');
  });

  test('order on the done screen: email, share, download, copy code', async ({ page }) => {
    await stubShare(page);
    await finishParent(page, `?to=${ADDR}`);
    const order = await page.evaluate(() =>
      ['pWayMail', 'pWayShare', 'pWayFile', 'pWayCode'].map((id) => {
        const el = document.getElementById(id);
        return { id, hidden: el.hidden, top: el.getBoundingClientRect().top };
      }),
    );
    expect(order.slice(0, 3).every((o) => !o.hidden)).toBe(true);
    const tops = order.slice(0, 3).map((o) => o.top);
    expect([...tops].sort((a, b) => a - b)).toEqual(tops);
    const position = await page.evaluate(() => {
      const ids = ['pWayMail', 'pWayShare', 'pWayFile', 'pWayCode'];
      const els = ids.map((id) => document.getElementById(id));
      return els.every(
        (el, i) =>
          i === 0 || els[i - 1].compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
    expect(position).toBeTruthy();
  });

  test('still no network calls and nothing new in the file', async ({ page }) => {
    const requests = [];
    page.on('request', (r) => {
      if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) requests.push(r.url());
    });
    await stubShare(page);
    await finishParent(page);
    await page.locator('#pToInput').fill(ADDR);
    await page.locator('#pShare').click();
    expect(requests).toEqual([]);
    const csp = await page
      .locator('meta[http-equiv="Content-Security-Policy"]')
      .getAttribute('content');
    expect(csp).toContain("connect-src 'none'");
  });
});

test.describe('practitioner page — send panel', () => {
  test('the copied link carries parent.html?to= and the address; WhatsApp wraps the link', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
    await gotoApp(page);
    await page.locator('#sendTo').fill(ADDR);

    const link = await page.locator('#sendLink').inputValue();
    expect(link).toContain(`parent.html?to=${ADDR}`);

    await page.locator('#sendCopy').click();
    await expect(page.locator('#sendStatus')).toContainText(ADDR);
    await expect(page.locator('#sendStatus')).toHaveClass(/ok/);
    const clip = await page.evaluate(() => navigator.clipboard.readText()).catch(() => null);
    if (clip !== null) expect(clip).toBe(link);

    const wa = await page.locator('#sendWhatsapp').getAttribute('href');
    expect(wa.startsWith('https://wa.me/?text=')).toBe(true);
    const msg = decodeURIComponent(wa.slice('https://wa.me/?text='.length));
    expect(msg).toContain(link);
    expect(wa).toContain(encodeURIComponent(link));
  });

  test('an invalid or empty address copies the plain link', async ({ page }) => {
    await gotoApp(page);
    await page.locator('#sendTo').fill('someone@gmail.com');
    let link = await page.locator('#sendLink').inputValue();
    expect(link.endsWith('parent.html')).toBe(true);
    expect(link).not.toContain('?to=');
    await expect(page.locator('#sendStatus')).toContainText('clalit.org.il');
    expect(await page.locator('#sendWhatsapp').getAttribute('href')).not.toContain('to%3D');

    await page.locator('#sendTo').fill('');
    await page.locator('#sendCopy').click();
    link = await page.locator('#sendLink').inputValue();
    expect(link.endsWith('parent.html')).toBe(true);
    await expect(page.locator('#sendStatus')).toContainText('יתבקשו להקליד');
  });

  test('the address is remembered on this device only', async ({ page }) => {
    await gotoApp(page);
    await page.locator('#sendTo').fill(ADDR);
    expect(await page.evaluate(() => localStorage.getItem('eforts_therapist_to_v1'))).toBe(ADDR);

    await gotoApp(page);
    await expect(page.locator('#sendTo')).toHaveValue(ADDR);
    expect(await page.locator('#sendLink').inputValue()).toContain(`?to=${ADDR}`);

    await page.locator('#sendTo').fill('');
    expect(await page.evaluate(() => localStorage.getItem('eforts_therapist_to_v1'))).toBeNull();
  });

  test('the link the panel builds is accepted by the parent page', async ({ page }) => {
    await gotoApp(page);
    await page.locator('#sendTo').fill(ADDR);
    const link = await page.locator('#sendLink').inputValue();
    await page.goto(link);
    await page.waitForSelector('#pQuestionnaire .p-item');
    await fillParent(page, MODELS.G50);
    await page.locator('#pFinish').click();
    expect((await page.locator('#pMailto').getAttribute('href')).startsWith(`mailto:${ADDR}`)).toBe(
      true,
    );
  });
});

test.describe('practitioner page — import box', () => {
  async function answersFile(page) {
    await gotoParent(page);
    await fillParent(page, MODELS.G50);
    await page.locator('#pFinish').click();
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#pDownload').click();
    return (await downloadPromise).path();
  }

  test('open by default', async ({ page }) => {
    await gotoApp(page);
    await expect(page.locator('#importBox')).toHaveJSProperty('open', true);
    await expect(page.locator('#importCode')).toBeVisible();
  });

  test('dropping a .txt on the box imports it, same as the file input', async ({ page }) => {
    const filePath = await answersFile(page);
    const text = fs.readFileSync(filePath, 'utf8');

    await gotoApp(page);
    await page.locator('#importBox').evaluate((box, t) => {
      const dt = new DataTransfer();
      dt.items.add(new File([t], 'EFORTS-answers-2026-09-28.txt', { type: 'text/plain' }));
      // drop on a child, not the box itself: "anywhere on the box"
      box
        .querySelector('#importStatus')
        .dispatchEvent(
          new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true }),
        );
    }, text);
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
  test('parent done screen with the address field, mail and share ways', async ({ page }) => {
    await stubShare(page);
    for (const width of [360, 412]) {
      await page.setViewportSize({ width, height: 800 });
      await finishParent(page);
      const fits = () =>
        page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
      expect(await fits()).toBe(true);
      await page.locator('#pToInput').fill('a.very.long.therapist.name.indeed@clalit.org.il');
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
      await page.locator('#sendTo').fill('a.very.long.therapist.name.indeed@clalit.org.il');
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
