// Parent companion page behavior. Reads items / SECTIONS / SCALE_LABELS /
// COMPANION from items.js and the codec from eforts-code.js — both are
// classic scripts loaded before this one, so their top-level `const`s live
// in the same shared script-realm scope (see items.js / eforts-code.js
// header comments). This file never loads app.js and carries no instrument
// text of its own (PF-spec-2026-09-28.md §B.7 / §F test 8).
//
// Fields collected (AMENDED 2026-09-28 12:31 by Allison, mid-build,
// overriding PF-spec §B/§C): sex, date of birth, and the 30 answers. No
// anonymous code/ID field at all — the email sender already identifies the
// family, and the therapist assigns her own anonymous number on import
// (PF2, a later run). See eforts-code.js's header comment for the format.
//
// Zero network: no fetch/XHR/beacon/socket/new-tab-opener anywhere below (the
// page's CSP also blocks connect-src at the browser level). The only
// "network-looking" thing this file does is build a
// blob: download — it does not leave the device until the parent acts on it.

const DRAFT_KEY = 'eforts_parent_draft_v1';
const DRAFT_MAX_AGE_MS = 14 * 24 * 3600 * 1000;

// ===== COPY (H.1 — the strings that vary; static text lives in parent.html) =====
const H_M0 = 'כדי לסיים, צריך להשלים עוד: ';
const H_S1 = 'מין הילד/ה';
const H_S2 = 'תאריך לידה';
const H_S3 = 'תשובות לשאלות {nums}';
const H_C2 = 'השורה הועתקה ✓';
const H_C3 = 'לא הצלחנו להעתיק אוטומטית. סמנו את השורה והעתיקו אותה.';
const H_pCodeHint = 'הדביקו את השורה במייל למטפל/ת.';
const H_D3 = 'למחוק את כל התשובות ששמרתם במכשיר הזה?';
// PDF send (2026-10-07): the answers travel as a PDF file the parent can send
// to ANY therapist by ANY channel. One main button; copy-code lives in the
// "had a problem?" fold. No email address anywhere on this page.
const H_P_SHARE = 'שליחת קובץ התשובות (PDF)';
const H_P_SHARE_HINT = 'בחרו מייל ושלחו את הקובץ למטפל/ת.';
const H_P_DL = 'הורדת קובץ התשובות (PDF)';
const H_P_DL_HINT = 'הקובץ יישמר במחשב. שלחו אותו במייל למטפל/ת.';
const H_P_SHARE_TITLE = 'EFORTS';

const state = {
  code: '',
  date: '',
  pdfFile: null,
  pdfPngs: [],
  pdfPromise: null,
  canShare: false,
};

// Elements are looked up once DOMContentLoaded fires (buildQuestionnaire()
// needs to run first for the pq{n} inputs to exist).
let pDraftBar,
  pDraftClear,
  pFormSection,
  pProgressFill,
  pProgressText,
  pDetails,
  pDob,
  pMissing,
  pFinish,
  pDone,
  pDoneTitle,
  pSend,
  pSendHint,
  pDownloadOnly,
  pAltWays,
  pCode,
  pCopy,
  pCopyStatus,
  pCodeHint,
  pBack,
  pClearDone;

let copyStatusTimer = null;

function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ===== QUESTIONNAIRE BUILD (§B.3 — DOM APIs only, no HTML-string building) =====
function buildQuestionnaire() {
  const container = document.getElementById('pQuestionnaire');
  SECTIONS.forEach((s) => {
    const section = document.createElement('div');
    section.className = 'section ' + s.key;

    const header = document.createElement('div');
    header.className = 'section-header';

    const h2 = document.createElement('h2');
    const dot = document.createElement('span');
    dot.className = 'dot';
    h2.appendChild(dot);
    h2.appendChild(document.createTextNode(s.title));
    header.appendChild(h2);

    const companionRow = document.createElement('div');
    companionRow.className = 'companion-row';
    const label = document.createElement('label');
    label.setAttribute('for', 'pWith_' + s.key);
    label.textContent = COMPANION.question;
    const select = document.createElement('select');
    select.id = 'pWith_' + s.key;
    const emptyOpt = document.createElement('option');
    emptyOpt.value = '';
    emptyOpt.textContent = '—';
    select.appendChild(emptyOpt);
    COMPANION.options.forEach((o) => {
      const opt = document.createElement('option');
      opt.value = o.value;
      opt.textContent = o.label;
      select.appendChild(opt);
    });
    companionRow.appendChild(label);
    companionRow.appendChild(select);
    header.appendChild(companionRow);
    section.appendChild(header);

    const instruction = document.createElement('div');
    instruction.className = 'section-instruction';
    instruction.textContent = s.instruction;
    section.appendChild(instruction);

    items
      .filter((it) => it.num >= s.range[0] && it.num <= s.range[1])
      .forEach((item) => {
        const fieldset = document.createElement('fieldset');
        fieldset.className = 'p-item';
        fieldset.id = 'pItem' + item.num;

        const legend = document.createElement('legend');
        legend.className = 'p-item-text';
        const numSpan = document.createElement('span');
        numSpan.className = 'p-item-num';
        numSpan.textContent = item.num + '.';
        legend.appendChild(numSpan);
        legend.appendChild(document.createTextNode(' ' + item.text));
        fieldset.appendChild(legend);

        const scale = document.createElement('div');
        scale.className = 'p-scale';
        for (let v = 1; v <= 5; v++) {
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = 'pq' + item.num;
          input.id = 'pq' + item.num + '_' + v;
          input.value = String(v);
          const lbl = document.createElement('label');
          lbl.setAttribute('for', input.id);
          lbl.textContent = SCALE_LABELS[v - 1];
          scale.appendChild(input);
          scale.appendChild(lbl);
        }
        fieldset.appendChild(scale);
        section.appendChild(fieldset);
      });

    container.appendChild(section);
  });
}

// ===== PROGRESS =====
function updateProgress() {
  let answered = 0;
  items.forEach((item) => {
    if (document.querySelector(`input[name="pq${item.num}"]:checked`)) answered++;
  });
  pProgressText.textContent = `${answered} / ${items.length}`;
  pProgressFill.style.width = (answered / items.length) * 100 + '%';
}

// ===== DRAFT (localStorage, §B.5) =====
function withValues() {
  return {
    morning: document.getElementById('pWith_morning').value,
    play: document.getElementById('pWith_play').value,
    social: document.getElementById('pWith_social').value,
  };
}

function saveDraft() {
  try {
    const sexChecked = document.querySelector('input[name="pSex"]:checked');
    const answers = {};
    items.forEach((it) => {
      const r = document.querySelector(`input[name="pq${it.num}"]:checked`);
      if (r) answers[it.num] = Number(r.value);
    });
    const with_ = withValues();
    const data = {
      v: 1,
      savedAt: Date.now(),
      sex: sexChecked ? sexChecked.value : '',
      dob: pDob.value || '',
      with: with_,
      answers,
    };
    const hasValue =
      !!data.sex ||
      !!data.dob ||
      !!with_.morning ||
      !!with_.play ||
      !!with_.social ||
      Object.keys(answers).length > 0;
    if (!hasValue) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable (private mode) — the page works without a draft
  }
}

function restoreDraft() {
  let raw;
  try {
    raw = localStorage.getItem(DRAFT_KEY);
  } catch {
    return false;
  }
  if (!raw) return false;

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return false;
  }
  if (!data || typeof data.savedAt !== 'number') return false;

  if (Date.now() - data.savedAt > DRAFT_MAX_AGE_MS) {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
    return false;
  }

  if (data.sex) {
    const r = document.getElementById(data.sex === 'male' ? 'pSex_m' : 'pSex_f');
    if (r) r.checked = true;
  }
  if (data.dob) pDob.value = data.dob;
  if (data.with) {
    ['morning', 'play', 'social'].forEach((k) => {
      const el = document.getElementById('pWith_' + k);
      if (el && data.with[k]) el.value = data.with[k];
    });
  }
  if (data.answers) {
    Object.entries(data.answers).forEach(([num, val]) => {
      const r = document.getElementById(`pq${num}_${val}`);
      if (r) r.checked = true;
    });
  }
  return true;
}

function clearDraftKey() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

// ===== VALIDATION helpers =====
function sexChosen() {
  return !!document.querySelector('input[name="pSex"]:checked');
}
function dobFilled() {
  return pDob.value !== '';
}
function allResolved() {
  return sexChosen() && dobFilled() && document.querySelectorAll('.p-item.p-missing').length === 0;
}

// ===== DONE SCREEN =====
function downloadAnswers() {
  const file = state.pdfFile;
  if (!file) return;
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Web Share Level 2: only when this browser can share this very PDF.
function canShareFile(file) {
  try {
    if (typeof navigator.share !== 'function') return false;
    if (typeof navigator.canShare !== 'function') return false;
    return !!navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

// The PDF is built when the done screen opens, so the file is READY before
// any tap: navigator.share() needs the tap's user activation, which an await
// on a build inside the handler would lose.
function preparePdf(code, model) {
  state.pdfFile = null;
  state.pdfPngs = [];
  state.canShare = false;
  pSend.textContent = H_P_DL;
  pSendHint.textContent = H_P_DL_HINT;
  pDownloadOnly.hidden = true;
  const promise = EFORTSPdf.build(code, model).then(
    (res) => {
      if (state.pdfPromise !== promise) return;
      state.pdfFile = res.file;
      state.pdfPngs = res.pngs;
      if (canShareFile(res.file)) {
        state.canShare = true;
        pSend.textContent = H_P_SHARE;
        pSendHint.textContent = H_P_SHARE_HINT;
        pDownloadOnly.hidden = false;
      }
    },
    () => {
      // PDF could not be built: the copy-code way in the fold still works
      if (state.pdfPromise === promise) pAltWays.open = true;
    },
  );
  state.pdfPromise = promise;
}

function showDone(code, model) {
  state.code = code;
  state.date = model.date;

  pCode.textContent = code;

  pAltWays.open = false;
  pCodeHint.textContent = H_pCodeHint;
  preparePdf(code, model);

  pFormSection.hidden = true;
  pDraftBar.hidden = true;
  pDone.hidden = false;
  window.scrollTo(0, 0);
  pDoneTitle.focus();
}

// ===== CLEAR (draft bar + done screen "delete answers") =====
function clearAll() {
  if (!confirm(H_D3)) return;

  clearDraftKey();

  document.querySelectorAll('input[type="radio"]').forEach((r) => {
    r.checked = false;
  });
  pDob.value = '';
  ['pWith_morning', 'pWith_play', 'pWith_social'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  pMissing.hidden = true;
  pDraftBar.hidden = true;
  pDone.hidden = true;
  pFormSection.hidden = false;

  document.querySelectorAll('.p-item.p-missing').forEach((el) => el.classList.remove('p-missing'));

  updateProgress();
  window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', () => {
  // ----- element lookups -----
  pDraftBar = document.getElementById('pDraftBar');
  pDraftClear = document.getElementById('pDraftClear');
  pFormSection = document.getElementById('pFormSection');
  pProgressFill = document.getElementById('pProgressFill');
  pProgressText = document.getElementById('pProgressText');
  pDetails = document.getElementById('pDetails');
  pDob = document.getElementById('pDob');
  pMissing = document.getElementById('pMissing');
  pFinish = document.getElementById('pFinish');
  pDone = document.getElementById('pDone');
  pDoneTitle = document.getElementById('pDoneTitle');
  pSend = document.getElementById('pSend');
  pSendHint = document.getElementById('pSendHint');
  pDownloadOnly = document.getElementById('pDownloadOnly');
  pAltWays = document.getElementById('pAltWays');
  pCode = document.getElementById('pCode');
  pCopy = document.getElementById('pCopy');
  pCopyStatus = document.getElementById('pCopyStatus');
  pCodeHint = document.getElementById('pCodeHint');
  pBack = document.getElementById('pBack');
  pClearDone = document.getElementById('pClearDone');

  // Keeps a stray typo out of the date field; today can't be a birth date.
  pDob.max = localToday();

  // ----- build questionnaire (§B.3) -----
  buildQuestionnaire();

  // ----- draft restore (§B.5) -----
  const restored = restoreDraft();
  if (restored) pDraftBar.hidden = false;

  // ----- initial progress -----
  updateProgress();

  // ----- change handling (§B.4.5) -----
  pFormSection.addEventListener('change', () => {
    updateProgress();
    saveDraft();
  });
  pFormSection.addEventListener('change', (e) => {
    const name = e.target && e.target.name;
    const m = name && /^pq(\d+)$/.exec(name);
    if (!m) return;
    const el = document.getElementById('pItem' + m[1]);
    if (el) el.classList.remove('p-missing');
    if (allResolved()) {
      pMissing.hidden = true;
    }
  });

  // ----- finish / validate (§B.4.6) -----
  pFinish.addEventListener('click', () => {
    const problems = [];
    const sexOk = sexChosen();
    if (!sexOk) problems.push(H_S1);

    const dobOk = dobFilled();
    if (!dobOk) problems.push(H_S2);

    const missingItems = [];
    items.forEach((it) => {
      if (!document.querySelector(`input[name="pq${it.num}"]:checked`)) missingItems.push(it.num);
    });
    if (missingItems.length) {
      problems.push(H_S3.replace('{nums}', missingItems.join(', ')));
    }

    if (problems.length) {
      pMissing.textContent = H_M0 + problems.join('; ');
      pMissing.hidden = false;
      missingItems.forEach((n) => {
        const el = document.getElementById('pItem' + n);
        if (el) el.classList.add('p-missing');
      });

      const target =
        !sexOk || !dobOk ? pDetails : document.getElementById('pItem' + missingItems[0]);
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (typeof target.focus === 'function') target.focus();
      return;
    }

    const model = {
      sex: document.querySelector('input[name="pSex"]:checked').value,
      dob: pDob.value,
      date: localToday(),
      with: withValues(),
      answers: items.map((it) =>
        Number(document.querySelector(`input[name="pq${it.num}"]:checked`).value),
      ),
    };
    const code = EFORTSCode.encode(model);
    showDone(code, model);
  });

  // ----- clear buttons -----
  pDraftClear.addEventListener('click', clearAll);
  pClearDone.addEventListener('click', clearAll);

  // ----- main button: share the prepared PDF (phones) or download it -----
  pSend.addEventListener('click', () => {
    const file = state.pdfFile;
    if (file && state.canShare) {
      // called synchronously inside the tap (user activation)
      navigator.share({ files: [file], title: H_P_SHARE_TITLE }).catch((err) => {
        // User cancelled: stay silent. Anything else: fall back to the file.
        if (!err || err.name !== 'AbortError') downloadAnswers();
      });
      return;
    }
    if (file) {
      downloadAnswers();
      return;
    }
    // not ready yet (rare): wait for the build, then download
    if (state.pdfPromise) state.pdfPromise.then(downloadAnswers);
  });
  pDownloadOnly.addEventListener('click', downloadAnswers);

  // ----- copy (§B.4.9) -----
  pCopy.addEventListener('click', () => {
    if (copyStatusTimer) {
      clearTimeout(copyStatusTimer);
      copyStatusTimer = null;
    }

    const fallback = () => {
      let ok = false;
      try {
        const range = document.createRange();
        range.selectNodeContents(pCode);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        ok = document.execCommand('copy');
      } catch {
        ok = false;
      }
      if (ok) {
        pCopyStatus.textContent = H_C2;
        copyStatusTimer = setTimeout(() => {
          pCopyStatus.textContent = '';
        }, 2000);
      } else {
        pCopyStatus.textContent = H_C3;
      }
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(state.code).then(
        () => {
          pCopyStatus.textContent = H_C2;
          copyStatusTimer = setTimeout(() => {
            pCopyStatus.textContent = '';
          }, 2000);
        },
        () => fallback(),
      );
    } else {
      fallback();
    }
  });

  // ----- back (§B.4.11) -----
  pBack.addEventListener('click', () => {
    pDone.hidden = true;
    pFormSection.hidden = false;
    pFinish.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
