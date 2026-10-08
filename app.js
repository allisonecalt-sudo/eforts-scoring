const cutoffs = {
  '3-5': { morning: 2.45, play: 3.14, social: 2.71, total: 2.92, inh: 2.51, wm: 3.0, flex: 2.72 },
  '6-7': { morning: 2.74, play: 3.42, social: 2.85, total: 3.16, inh: 2.77, wm: 3.26, flex: 3.0 },
  '8-11': { morning: 2.76, play: 3.55, social: 3.04, total: 3.28, inh: 2.84, wm: 3.37, flex: 3.07 },
};

// ===== STATUS (TM-spec §B) =====
// One status per score, from the cutoff and nothing else. Every surface
// that names or colors a score (card value, gauge, status pill, print
// table, AI export) calls this. EF_CLOSE_MARGIN is the same 0.15 "close"
// line buildSummary's efStatus uses (canon B2); routines and the total
// stay binary (canon 0b#12).
const EF_CLOSE_MARGIN = 0.15;
function cutoffStatus(score, cutoff, kind) {
  if (score < cutoff) return { key: 'below', cls: 'warn', text: 'נמוך מציון החתך' };
  if (kind === 'ef' && score - cutoff <= EF_CLOSE_MARGIN) {
    return { key: 'close', cls: 'mid', text: 'קרוב לציון החתך' };
  }
  return { key: 'norm', cls: 'ok', text: 'בטווח הנורמה' };
}

// Strips buildSummary()'s HTML down to plain text. Shared by the print
// template and the AI export, so both carry the exact same summary text.
function summaryHtmlToText(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Gemini review item 8: anonId reaches several HTML sinks (results meta,
// buildSummary's own embed, the print meta) unescaped — self-XSS today,
// a real injection vector once anything parent-supplied fills this field.
// One escaper, applied at each call site (never inside buildSummary()
// itself, which the FX2 round owns) so every reader of anonId gets the
// same safe string.
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });
}

// Single source for reading the anonymous id — trims once, "where it's
// read" (item 8), instead of every caller repeating `.value.trim()`.
function getAnonId() {
  return document.getElementById('anonId').value.trim();
}

// Gemini review item 9: a below-cutoff score can round to the same
// 2-decimal string as its cutoff ("2.92 כאשר ציון החתך הוא 2.92") and
// still print "נמוך מציון החתך" — reads like a software bug. Reveal a
// 3rd decimal only in that exact collision; the comparison used for
// status (cutoffStatus) always stays on the raw, unrounded numbers.
function fmtScore(score, cutoff) {
  if (score < cutoff && score.toFixed(2) === cutoff.toFixed(2)) {
    return score.toFixed(3);
  }
  return score.toFixed(2);
}

// Item 17: shared by the drilldown badges (scoreRow) and the print item
// grouping, so "one item" never reads like a bare item number.
const nItems = (n) => (n === 1 ? 'פריט אחד' : `${n} פריטים`);

// FX2 (Gemini review item 4 + FX2-strength-nouns-spec §A): the 30 noun
// phrases named in מומלץ when a strength item is woven in, instead of the
// vague fallback "במשימות אחרות". Masculine and feminine are identical —
// the only gendered words stay in the frame (כוחותיו/כוחותיה, לו/לה) —
// so these plain strings carry no g(). Items n and n+8 (n = 1-8) share one
// noun on purpose (strengthNoun[n] === strengthNoun[n + 8]), so a twin pair
// can merge into one "בשגרת הבוקר והערב" entry (see strengthNounSlot below).
// Top-level (not inside buildSummary) so a test can call it via
// page.evaluate, per the spec.
const strengthNoun = {
  1: 'התנעה עצמאית',
  2: 'שמירה על קצב ללא תזכורות',
  3: 'זכירת רצף הפעילויות',
  4: 'התארגנות לפי כללי הבית',
  5: 'פתרון בעיות',
  6: 'התעלמות מגירויים מסיחים',
  7: 'הקפדה על איכות הביצוע',
  8: 'סיום פעילות לפני מעבר לאחרת',
  9: 'התנעה עצמאית',
  10: 'שמירה על קצב ללא תזכורות',
  11: 'זכירת רצף הפעילויות',
  12: 'התארגנות לפי כללי הבית',
  13: 'פתרון בעיות',
  14: 'התעלמות מגירויים מסיחים',
  15: 'הקפדה על איכות הביצוע',
  16: 'סיום פעילות לפני מעבר לאחרת',
  17: 'יוזמה',
  18: 'שמירה על קצב מתאים',
  19: 'התקדמות לפי סדר השלבים',
  20: 'הקפדה על הכללים',
  21: 'התמקדות',
  22: 'תכנון',
  23: 'סיום פעילות לפני מעבר לאחרת',
  24: 'יוזמה',
  25: 'למידה מהתנסויות',
  26: 'הימנעות מהבעה מוגזמת של כעס',
  27: 'השתתפות לפי כללי הקבוצה',
  28: 'פתרון בעיות',
  29: 'שקילת תגובות אפשריות',
  30: 'חשיבה לפני תגובה',
};
const NOUN_SUFFIX = {
  am: 'בשגרת הבוקר',
  pm: 'בשגרת הערב',
  ampm: 'בשגרת הבוקר והערב',
  play: 'במשחק',
  social: 'במצבים חברתיים',
};
// joinHe: 1 item -> "A", 2 -> "A וB", 3+ -> "A, B וC". Every part already
// starts with "ב", so the result reads "…וב…".
const joinHe = (parts) =>
  parts.length === 1 ? parts[0] : parts.slice(0, -1).join(', ') + ' ו' + parts[parts.length - 1];

// FX2-strength-nouns-spec §B: `woven` is the ordered list of item numbers
// the routine paragraphs already wove in as strengths (buildSummary pushes
// into it — see the eligibleStrong block below). This turns that same list
// into the מומלץ noun-phrase slot: group by context (am/pm/play/social),
// merging a morning/evening twin pair into one "ampm" entry, cap at 3,
// then join.
function strengthNounSlot(woven) {
  const ctxOf = (n) => (n <= 8 ? 'am' : n <= 16 ? 'pm' : n <= 23 ? 'play' : 'social');
  const entries = [];
  for (const n of woven) {
    if (n >= 9 && n <= 16 && woven.includes(n - 8)) continue; // merged into its morning twin
    entries.push({
      noun: strengthNoun[n],
      ctx: n <= 8 && woven.includes(n + 8) ? 'ampm' : ctxOf(n),
    });
  }
  const groups = [];
  for (const e of entries.slice(0, 3)) {
    let g = groups.find((x) => x.ctx === e.ctx);
    if (!g) groups.push((g = { ctx: e.ctx, nouns: [] }));
    g.nouns.push('ב' + e.noun);
  }
  return groups.length ? joinHe(groups.map((g) => joinHe(g.nouns) + ' ' + NOUN_SUFFIX[g.ctx])) : '';
}

// ===== BUILD FORM =====
function buildForm() {
  const container = document.getElementById('questionnaire');
  const routines = SECTIONS;

  const scaleLabels = SCALE_LABELS;

  routines.forEach((r) => {
    const section = document.createElement('div');
    section.className = `section ${r.key}`;

    let html = `<div class="section-header">
      <h2><span class="dot"></span>${r.title}</h2>
      <div class="companion-row">
        <span>מי נמצא עם הילד בדרך כלל בשגרות אלו:</span>
        <select id="companion_${r.key}">
          <option value="">—</option>
          <option value="mom">אמא</option>
          <option value="dad">אבא</option>
          <option value="both">שני ההורים</option>
          <option value="other">אחר</option>
        </select>
      </div>
    </div>`;
    html += `<div class="section-instruction">${r.instruction}</div>`;
    html += `<div class="scale-legend">
      ${scaleLabels.map((l) => `<span>${l.replace('\n', ' ')}</span>`).join('')}
    </div>`;

    items
      .filter((it) => it.num >= r.range[0] && it.num <= r.range[1])
      .forEach((item) => {
        // Morning/evening divider between items 8 and 9
        if (r.key === 'morning' && item.num === 9) {
          html += `<div class="sub-divider">פריטי ערב</div>`;
        }
        const efNote =
          item.num === 10 || item.num === 11
            ? `<span class="ef-note">לא כלול בתפקודים הניהוליים</span>`
            : '';
        html += `<div class="item-row">
        <span class="item-num">${item.num}</span>
        <span class="item-text">${item.text}${efNote}</span>
        <div class="item-scores">`;
        for (let v = 1; v <= 5; v++) {
          html += `<input type="radio" name="q${item.num}" id="q${item.num}_${v}" value="${v}" onchange="updateProgress()">`;
          html += `<label for="q${item.num}_${v}">${scaleLabels[v - 1]}</label>`;
        }
        html += `</div>
        <span class="item-num">${item.num}</span>
      </div>`;
      });

    section.innerHTML = html;
    container.appendChild(section);
  });
}

// ===== PROGRESS =====
function updateProgress() {
  let answered = 0;
  items.forEach((item) => {
    if (document.querySelector(`input[name="q${item.num}"]:checked`)) answered++;
  });
  const pct = (answered / items.length) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  // Item 14: a bare "N / 30" is a count in RTL text — isolate it LTR so it
  // can't visually flip.
  document.getElementById('progressText').innerHTML =
    `<bdi dir="ltr">${answered} / ${items.length}</bdi>`;
}

// ===== AGE =====
// Item 7: every early return below must leave the same "nothing computed"
// state a fresh page load starts in — otherwise a date edited AFTER a
// valid age was already shown (e.g. the fill day briefly cleared while
// retyping) leaves the OLD age band sitting in the hidden #ageGroup input,
// and calculate() has no way to tell that band is stale.
function clearAgeDisplay() {
  const ageEl = document.getElementById('calcAge');
  ageEl.textContent = '—';
  ageEl.className = 'computed';
  const ageGroupDisplay = document.getElementById('ageGroupDisplay');
  ageGroupDisplay.textContent = '—';
  ageGroupDisplay.className = 'computed';
  document.getElementById('ageGroup').value = '';
}

function updateAge() {
  const birthInput = getBirthDateValue();
  const fillInput = getFillDateValue();
  if (!birthInput || !fillInput) {
    clearAgeDisplay();
    return;
  }

  const birth = new Date(birthInput);
  const fill = new Date(fillInput);
  if (birth >= fill) {
    clearAgeDisplay();
    return;
  }

  let years = fill.getFullYear() - birth.getFullYear();
  let months = fill.getMonth() - birth.getMonth();
  if (fill.getDate() < birth.getDate()) months--;
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalYears = years + months / 12;
  const ageEl = document.getElementById('calcAge');
  const monthsText =
    months === 0
      ? ''
      : months === 1
        ? ' וחודש'
        : months === 2
          ? ' וחודשיים'
          : ` ו-${months} חודשים`;
  ageEl.textContent = `${years} שנים${monthsText}`;
  ageEl.className = 'computed';

  const ageGroupEl = document.getElementById('ageGroup');
  const ageGroupDisplay = document.getElementById('ageGroupDisplay');

  // Item 14: age-band ranges read left-to-right even inside Hebrew text —
  // isolate them so no browser/RTL context can flip the small/large ends.
  if (totalYears >= 3 && totalYears < 6) {
    ageGroupEl.value = '3-5';
    ageGroupDisplay.innerHTML = '<bdi dir="ltr">3.0 — 5.11</bdi>';
    ageGroupDisplay.className = 'computed valid';
  } else if (totalYears >= 6 && totalYears < 8) {
    ageGroupEl.value = '6-7';
    ageGroupDisplay.innerHTML = '<bdi dir="ltr">6.0 — 7.11</bdi>';
    ageGroupDisplay.className = 'computed valid';
  } else if (totalYears >= 8 && totalYears < 12) {
    ageGroupEl.value = '8-11';
    ageGroupDisplay.innerHTML = '<bdi dir="ltr">8.0 — 11.11</bdi>';
    ageGroupDisplay.className = 'computed valid';
  } else {
    ageGroupEl.value = '';
    ageGroupDisplay.innerHTML = 'מחוץ לטווח הגילים של השאלון (<bdi dir="ltr">3.0–11.11</bdi>)';
    ageGroupDisplay.className = 'computed invalid';
  }
}

// ===== SAVE / LOAD =====
function saveForm() {
  const data = {
    anonId: getAnonId(),
    gender: document.getElementById('childGender').value,
    birthDate: getBirthDateValue(),
    fillDate: getFillDateValue(),
    companions: {
      morning: document.getElementById('companion_morning')?.value || '',
      play: document.getElementById('companion_play')?.value || '',
      social: document.getElementById('companion_social')?.value || '',
    },
    answers: {},
  };
  items.forEach((item) => {
    const checked = document.querySelector(`input[name="q${item.num}"]:checked`);
    if (checked) data.answers[item.num] = parseInt(checked.value);
  });
  localStorage.setItem('eforts_save', JSON.stringify(data));
  const ind = document.getElementById('saveIndicator');
  ind.style.display = 'block';
  setTimeout(() => (ind.style.display = 'none'), 2000);
}

function loadForm() {
  const raw = localStorage.getItem('eforts_save');
  if (!raw) return;
  const data = JSON.parse(raw);
  if (data.anonId) document.getElementById('anonId').value = data.anonId;
  if (data.gender) document.getElementById('childGender').value = data.gender;
  if (data.birthDate) setBirthDateValue(data.birthDate);
  if (data.fillDate) setFillDateValue(data.fillDate);
  if (data.companions) {
    ['morning', 'play', 'social'].forEach((k) => {
      const el = document.getElementById('companion_' + k);
      if (el && data.companions[k]) el.value = data.companions[k];
    });
  }
  if (data.answers) {
    Object.entries(data.answers).forEach(([num, val]) => {
      const radio = document.getElementById(`q${num}_${val}`);
      if (radio) radio.checked = true;
    });
  }
  updateAge();
  updateProgress();
}

function populateBirthDropdowns() {
  const dayEl = document.getElementById('birthDay');
  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    dayEl.appendChild(opt);
  }
  const yearEl = document.getElementById('birthYear');
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= currentYear - 15; y--) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearEl.appendChild(opt);
  }
}

function getBirthDateValue() {
  const d = document.getElementById('birthDay').value;
  const m = document.getElementById('birthMonth').value;
  const y = document.getElementById('birthYear').value;
  if (!d || m === '' || !y) return '';
  const mm = String(parseInt(m) + 1).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
}

function setBirthDateValue(dateStr) {
  if (!dateStr) return;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return;
  document.getElementById('birthYear').value = parseInt(parts[0]);
  document.getElementById('birthMonth').value = parseInt(parts[1]) - 1;
  document.getElementById('birthDay').value = parseInt(parts[2]);
}

function populateFillDropdowns() {
  const dayEl = document.getElementById('fillDay');
  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    dayEl.appendChild(opt);
  }
  const yearEl = document.getElementById('fillYear');
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= currentYear - 3; y--) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearEl.appendChild(opt);
  }
}

function getFillDateValue() {
  const d = document.getElementById('fillDay').value;
  const m = document.getElementById('fillMonth').value;
  const y = document.getElementById('fillYear').value;
  if (!d || m === '' || !y) return '';
  const mm = String(parseInt(m) + 1).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
}

function setFillDateValue(dateStr) {
  if (!dateStr) return;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return;
  document.getElementById('fillYear').value = parseInt(parts[0]);
  document.getElementById('fillMonth').value = parseInt(parts[1]) - 1;
  document.getElementById('fillDay').value = parseInt(parts[2]);
}

function setFillDateToToday() {
  const now = new Date();
  document.getElementById('fillDay').value = now.getDate();
  document.getElementById('fillMonth').value = now.getMonth();
  document.getElementById('fillYear').value = now.getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
  populateBirthDropdowns();
  populateFillDropdowns();
  buildForm();
  setFillDateToToday();
  loadForm();
  document.getElementById('birthDay').addEventListener('change', updateAge);
  document.getElementById('birthMonth').addEventListener('change', updateAge);
  document.getElementById('birthYear').addEventListener('change', updateAge);
  document.getElementById('fillDay').addEventListener('change', updateAge);
  document.getElementById('fillMonth').addEventListener('change', updateAge);
  document.getElementById('fillYear').addEventListener('change', updateAge);

  // Auto-save on any change
  document.querySelectorAll('input[type="radio"]').forEach((r) => {
    r.addEventListener('change', () => {
      saveForm();
      updateProgress();
    });
  });
  document
    .querySelectorAll(
      '#anonId, #childGender, #birthDay, #birthMonth, #birthYear, #fillDay, #fillMonth, #fillYear',
    )
    .forEach((el) => {
      el.addEventListener('change', saveForm);
    });

  // Auto-calculate on load if form has saved answers
  const saved = localStorage.getItem('eforts_save');
  if (saved) {
    const data = JSON.parse(saved);
    if (data.answers && Object.keys(data.answers).length === items.length && data.birthDate) {
      updateAge();
      setTimeout(calculate, 100);
    }
  }
});

// ===== CALCULATE =====
function calculate() {
  const birthDate = getBirthDateValue();
  if (!birthDate) {
    showWarning('יש להזין תאריך לידה לפני חישוב הציונים');
    return;
  }
  // Item 7: the age band depends on the fill date as much as the birth
  // date. Refuse rather than silently scoring against a stale or missing
  // one (updateAge() clears #ageGroup on every early return, so a stale
  // band can no longer survive to here — this is the belt-and-braces
  // check for the fill date specifically, with its own message).
  if (!getFillDateValue()) {
    showWarning('יש להזין תאריך מילוי לפני חישוב הציונים');
    return;
  }
  const ageGroup = document.getElementById('ageGroup').value;
  if (!ageGroup) {
    showWarning('הגיל מחוץ לטווח הגילים של השאלון (3.0–11.11) — לא ניתן לחשב ציונים');
    return;
  }
  // F-15 / F-16 (TM-spec §C-F, optional — her yes): an unset sex silently
  // wrote the summary in female forms, and an empty anonymous number put
  // "—" into the summary as the child's stand-in noun. Fail loud instead.
  if (!document.getElementById('childGender').value) {
    showWarning('יש לבחור מין לפני חישוב הציונים — הסיכום נכתב בלשון זכר או נקבה בהתאם.');
    return;
  }
  if (!getAnonId()) {
    showWarning('יש להזין מספר אנונימי — הסיכום משתמש בו במקום שם.');
    return;
  }

  const scores = {};
  let missing = [];
  items.forEach((item) => {
    const checked = document.querySelector(`input[name="q${item.num}"]:checked`);
    if (checked) {
      scores[item.num] = parseInt(checked.value);
    } else {
      missing.push(item.num);
    }
  });

  if (missing.length > 0) {
    showWarning(`חסרות תשובות לפריטים: ${missing.join(', ')}`);
    return;
  }

  hideWarning();

  const morningItems = items.filter((i) => i.routine === 'morning').map((i) => scores[i.num]);
  const playItems = items.filter((i) => i.routine === 'play').map((i) => scores[i.num]);
  const socialItems = items.filter((i) => i.routine === 'social').map((i) => scores[i.num]);

  const morningAvg = avg(morningItems);
  const playAvg = avg(playItems);
  const socialAvg = avg(socialItems);
  const totalAvg = avg([morningAvg, playAvg, socialAvg]);

  const inhItems = items.filter((i) => i.ef === 'inh').map((i) => scores[i.num]);
  const wmItems = items.filter((i) => i.ef === 'wm').map((i) => scores[i.num]);
  const flexItems = items.filter((i) => i.ef === 'flex').map((i) => scores[i.num]);

  const inhAvg = avg(inhItems);
  const wmAvg = avg(wmItems);
  const flexAvg = avg(flexItems);

  const c = cutoffs[ageGroup];

  // Item 8: escape once, here, for every HTML sink this value reaches
  // below — the results meta line and buildSummary's own embed — without
  // touching buildSummary()'s body itself.
  const anonId = escapeHtml(getAnonId()) || '—';
  const ageText = document.getElementById('calcAge').textContent;
  const ageLabel = document.getElementById('ageGroupDisplay').textContent;
  const genderRaw = document.getElementById('childGender').value;
  const gender = genderText(genderRaw);
  const isMale = genderRaw === 'male';

  const routineGroups = {
    morning: { items: items.filter((i) => i.routine === 'morning') },
    play: { items: items.filter((i) => i.routine === 'play') },
    social: { items: items.filter((i) => i.routine === 'social') },
  };
  const efGroups = {
    inh: { items: items.filter((i) => i.ef === 'inh') },
    wm: { items: items.filter((i) => i.ef === 'wm') },
    flex: { items: items.filter((i) => i.ef === 'flex') },
  };

  // Hide form, show results. Item 13: the sticky progress bar has no
  // business sitting over a completed results screen — goBack()/
  // resetForm() bring it back.
  document.getElementById('formSection').style.display = 'none';
  document.getElementById('progressWrap').style.display = 'none';

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `
    <div class="results-header">
      <h2>תוצאות שאלון EFORTS</h2>
      <div class="results-meta">${patientNoun(genderRaw)} מס' ${anonId} | ${gender} | ${ageText} | קבוצת גיל: <bdi dir="ltr">${ageLabel}</bdi></div>
      <div class="results-hint">לחצ/י על כל שורה כדי לראות פירוט הפריטים</div>
      <div class="score-legend" style="margin-top:12px;">
        <span class="score-legend-item"><span class="score-legend-dot" style="background:var(--green)"></span> בטווח הנורמה</span>
        <span style="margin:0 6px;">|</span>
        <span class="score-legend-item"><span class="score-legend-dot" style="background:var(--amber)"></span> קרוב לציון החתך (בתפקודים ניהוליים)</span>
        <span style="margin:0 6px;">|</span>
        <span class="score-legend-item"><span class="score-legend-dot" style="background:var(--red)"></span> נמוך מציון החתך</span>
        <span style="margin:0 6px;">|</span>
        <span>▌ = ציון החתך לקבוצת הגיל</span>
      </div>
    </div>

    <div class="score-group">
      <div class="score-group-title">ציוני שגרות</div>
      ${scoreRow('morning', 'בוקר וערב', morningAvg, c.morning, routineGroups.morning.items, scores, 'routine')}
      ${scoreRow('play', 'פנאי ומשחק', playAvg, c.play, routineGroups.play.items, scores, 'routine')}
      ${scoreRow('social', 'שגרה חברתית', socialAvg, c.social, routineGroups.social.items, scores, 'routine')}
      ${scoreRow('total', 'ציון כולל', totalAvg, c.total, [], scores, 'total')}
    </div>

    <div class="score-group">
      <div class="score-group-title">ציוני תפקודים ניהוליים</div>
      ${scoreRow('inh', 'עכבה', inhAvg, c.inh, efGroups.inh.items, scores, 'ef')}
      ${scoreRow('wm', 'זיכרון עבודה', wmAvg, c.wm, efGroups.wm.items, scores, 'ef')}
      ${scoreRow('flex', 'גמישות מחשבתית', flexAvg, c.flex, efGroups.flex.items, scores, 'ef')}
    </div>

    <div class="summary-card">
      <h3 style="font-size:0.95rem; font-weight:700; color:var(--text); margin-bottom:12px; text-align:center;">סיכום קליני</h3>
      <div class="summary-text">${buildSummary({
        anonId,
        gender,
        isMale,
        ageText,
        ageLabel,
        morningAvg,
        playAvg,
        socialAvg,
        totalAvg,
        inhAvg,
        wmAvg,
        flexAvg,
        c,
        scores,
      })}</div>
      <div style="background:#eef6ff; border:1px solid #c5ddf5; border-radius:8px; padding:10px 14px; margin-top:14px;">
        <span style="font-size:0.82rem; color:#334155;">לשילוב ממצאי השאלון עם התמונה הקלינית מהמפגש: לחצ/י על "הורד ל-AI", העל/י את הקובץ לכלי AI (Claude, ChatGPT, Copilot) ותאר/י לו מה נצפה. הכלי יכתוב רק את פסקת המטפל/ת, בלי לשנות ציונים או את הסיכום. אין להוסיף שם או ת״ז.</span>
      </div>
      <div class="summary-note">
        ציון החתך נקבע 1.5 סטיות תקן מתחת לממוצע של קבוצת הגיל (Frisch & Rosenblum, 2024). ציון נמוך מציון החתך מורה על חשד לקושי בתחום שנמדד בלבד: בשגרה או בתפקוד הניהולי.
        <br>הציון הכולל הוא ממוצע שלושת ציוני השגרות. פריטים 10 ו-11 אינם נכללים בחישוב התפקודים הניהוליים.
      </div>
    </div>

    <div class="result-actions">
      <button class="btn btn-pdf" onclick="printResults()">שמור כ-PDF</button>
      <button class="btn btn-ai" onclick="downloadForAI()">הורד ל-AI</button>
      <button class="btn btn-back" onclick="goBack()">חזרה לשאלון</button>
      <button class="btn btn-danger" onclick="resetForm()">שאלון חדש</button>
    </div>
  `;

  resultsDiv.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scoreRow(id, label, score, cutoff, cardItems, scores, type) {
  const st = cutoffStatus(score, cutoff, type);
  const hasDetails = cardItems.length > 0;

  // Gauge: score position on 1-5 scale
  const pct = ((score - 1) / 4) * 100;
  const cutoffPct = ((cutoff - 1) / 4) * 100;

  // Drilldown
  let drillHtml = '';
  if (hasDetails) {
    const efLabels = { inh: 'עכבה', wm: 'זיכרון עבודה', flex: 'גמישות מחשבתית' };
    const routineLabels = { morning: 'בוקר וערב', play: 'פנאי ומשחק', social: 'שגרה חברתית' };
    const sorted = [...cardItems].sort((a, b) => scores[a.num] - scores[b.num]);
    const weak = sorted.filter((i) => scores[i.num] <= 2);
    const mid = sorted.filter((i) => scores[i.num] === 3);
    const strong = sorted.filter((i) => scores[i.num] >= 4);

    drillHtml = `<div class="drilldown" id="drill_${id}">
      <div class="drill-summary">
        <span class="drill-badge weak">ציון 1–2: ${nItems(weak.length)}</span>
        <span class="drill-badge mid">ציון 3: ${nItems(mid.length)}</span>
        <span class="drill-badge strong">ציון 4–5: ${nItems(strong.length)}</span>
      </div>`;

    sorted.forEach((item) => {
      const s = scores[item.num];
      const rowCls = s <= 2 ? 'weak' : s === 3 ? 'mid' : 'strong';
      const tag =
        type === 'routine'
          ? item.ef
            ? efLabels[item.ef]
            : 'לא כלול'
          : routineLabels[item.routine];
      const dots = [1, 2, 3, 4, 5]
        .map((v) => `<span class="drill-dot ${v === s ? 'active-' + rowCls : ''}">${v}</span>`)
        .join('');

      drillHtml += `<div class="drill-item ${rowCls}-row">
        <span class="drill-item-num">${item.num}</span>
        <span class="drill-item-text">${item.text}</span>
        <span class="drill-item-tag">${tag}</span>
        <div class="drill-dots">${dots}</div>
      </div>`;
    });
    drillHtml += `</div>`;
  }

  // S-09: explains the cutoff, not the deleted absolute bands.
  const tipScope = {
    routine: 'ממוצע הפריטים בשגרה זו',
    total: 'ממוצע שלושת ציוני השגרות',
    ef: 'ממוצע הפריטים של תפקוד זה בשלוש השגרות (בלי פריטים 10 ו-11)',
  }[type];
  const tipBelow = {
    routine: 'חשד לקושי בשגרה זו',
    total: 'חשד לקושי בניהול העצמי של שגרות היום-יום',
    ef: 'חשד לקושי בתפקוד ניהולי זה',
  }[type];
  const scoreTip =
    `${tipScope}, בסולם 1–5 (ככל שהציון גבוה יותר, התפקוד טוב יותר).\n` +
    `ציון החתך לקבוצת הגיל: ${cutoff.toFixed(2)}\n` +
    `נמוך מציון החתך: ${tipBelow}.` +
    (type === 'ef' ? `\nקרוב לציון החתך: עד 0.15 מעליו.` : '');

  return `<div class="score-row ${hasDetails ? '' : 'no-drill'}" ${hasDetails ? `onclick="toggleDrill('${id}')"` : ''}>
    <div class="score-row-top">
      <div class="score-label">${label} ${hasDetails ? `<span class="arrow" id="arrow_${id}">&#9660;</span>` : ''}
        <span class="info-tip" tabindex="0" onclick="event.stopPropagation()">?<span class="tip-content">${scoreTip}</span></span>
      </div>
      <div class="score-value ${st.cls}">${fmtScore(score, cutoff)}</div>
    </div>
    <div class="gauge">
      <div class="gauge-fill ${st.cls}" style="width:${pct}%"></div>
      <div class="gauge-cutoff" style="right:${cutoffPct}%" data-label="חתך ${cutoff.toFixed(2)}"></div>
    </div>
    <div class="score-meta">
      <span class="score-interp">ציון החתך: ${cutoff.toFixed(2)}</span>
      <span class="score-status ${st.cls}">${st.text}</span>
    </div>
  </div>
  ${drillHtml}`;
}

function buildSummary(d) {
  const belowCutoff = (s, c) => s < c;
  const m = d.isMale;
  const g = (male, female) => (m ? male : female);
  const hisAge = g('גילו', 'גילה');
  const got = g('קיבל', 'קיבלה');
  // canon C4: never "הילד/הילדה" — the anonymous number replaces it
  // everywhere a noun-subject is needed; pronouns (g('הוא','היא')) cover
  // the rest.
  const anonId = d.anonId || '—';

  // Short clinical phrasings per item — difficulty direction (score 1-2)
  const diffPhrase = {
    1: 'מתקשה להתניע את שגרת הבוקר באופן עצמאי',
    2: `${g('זקוק', 'זקוקה')} לתזכורות חוזרות כדי לשמור על קצב`,
    3: 'מתקשה לזכור את רצף הפעילויות',
    4: 'מתקשה להתארגן על פי כללי הבית',
    5: 'מתקשה לפתור בעיות שמתעוררות במהלך השגרה',
    6: `${g('מוסח', 'מוסחת')} מגירויים חיצוניים ורעשי רקע`,
    7: 'מתקשה להקפיד על איכות הביצוע',
    // canon B3 twins table: 8↔16 are the same content ("finishes without
    // switching") and must share one phrase so the twin-merge (below) can
    // fire for them — before this fix they had different text and never merged.
    8: `${g('עובר', 'עוברת')} לפעילות אחרת באמצע, מבלי לסיים את הקודמת`,
    9: 'מתקשה להתניע את שגרת הערב באופן עצמאי',
    10: `${g('זקוק', 'זקוקה')} לתזכורות חוזרות כדי לשמור על קצב בערב`,
    11: 'מתקשה לזכור את רצף פעילויות הערב',
    12: 'מתקשה להתארגן על פי כללי הבית',
    13: 'מתקשה לפתור בעיות שמתעוררות במהלך השגרה',
    14: `${g('מוסח', 'מוסחת')} מגירויים חיצוניים ורעשי רקע`,
    15: 'מתקשה לשים לב לאיכות הביצוע',
    16: `${g('עובר', 'עוברת')} לפעילות אחרת באמצע, מבלי לסיים את הקודמת`,
    17: 'מתקשה ליזום בחירת משחק',
    18: 'מתקשה לשחק בקצב מתאים',
    19: 'מתקשה להחזיק רצף פעילות ולשחק לפי שלבי המשחק בסדר הנכון',
    20: 'מתקשה לשחק לפי כללי המשחק, כמו להמתין לתור',
    21: `מתקשה להישאר ${g('ממוקד', 'ממוקדת')} במשחק אחד`,
    22: 'מתקשה לעצור ולתכנן לפני המשחק',
    23: `${g('עובר', 'עוברת')} ממשחק למשחק מבלי לסיים`,
    24: 'מתקשה ליזום אינטראקציה חברתית',
    25: 'מתקשה ללמוד מהתנסות חברתית שלילית',
    26: `${g('מביע', 'מביעה')} כעס או תסכול באופן מוגזם`,
    27: 'מתקשה להשתתף במשחק לפי כללי הקבוצה',
    28: 'מתקשה לפתור בעיות שעולות במשחק חברתי',
    29: `${g('מגיב', 'מגיבה')} מבלי לשקול מספר תגובות אפשריות`,
    30: `${g('מגיב', 'מגיבה')} לפני ש${g('עוצר', 'עוצרת')} לחשוב`,
  };

  // Strength direction (score 4-5).
  // canon F-36 / FX1 re-check: every phrase is an INFINITIVE, governed by one
  // "מצליח/ה" that the frame supplies ("והוא מצליח ליזום… וכן לתכנן…", Carmit's
  // C50 form). Infinitives carry no gender; only suffixes/participles do.
  const strengthPhrase = {
    1: 'להתניע את שגרת הבוקר באופן עצמאי',
    2: 'לשמור על קצב ללא תזכורות',
    3: 'לזכור את רצף הפעילויות',
    4: 'להתארגן לפי כללי הבית',
    5: 'לפתור בעיות שצצות במהלך השגרה',
    6: 'להתעלם מגירויים מסיחים',
    7: 'להקפיד על איכות הביצוע',
    8: `לסיים פעילויות ש${g('התחיל', 'התחילה')}`,
    9: 'להתניע את שגרת הערב באופן עצמאי',
    10: 'לשמור על קצב בפעילויות הערב',
    11: 'לזכור את רצף פעילויות הערב',
    12: 'להתארגן לפי כללי הבית בערב',
    13: 'לפתור בעיות שצצות במהלך השגרה',
    14: 'להתעלם מגירויים מסיחים',
    15: 'לשים לב לאיכות הביצוע',
    16: 'לסיים פעילויות מבלי לעבור באמצע לאחרות',
    17: 'ליזום בחירת משחק',
    18: 'לשחק בקצב מתאים',
    19: 'לשחק לפי שלבי המשחק',
    20: 'לשחק לפי כללי המשחק',
    21: `להישאר ${g('ממוקד', 'ממוקדת')} במשחק`,
    22: `לתכנן את ${g('פעולותיו', 'פעולותיה')} מראש`,
    23: 'לסיים משחק אחד לפני מעבר לאחר',
    24: 'ליזום אינטראקציה חברתית',
    25: 'ללמוד מהתנסויות חברתיות',
    26: 'להימנע מהבעה מוגזמת של כעס במשחק חברתי',
    27: 'להשתתף במשחק לפי כללי הקבוצה',
    28: 'לפתור בעיות שעולות במשחק חברתי',
    29: `לשקול תגובות אפשריות לפני ש${g('מגיב', 'מגיבה')}`,
    30: `לחשוב על השפעת ${g('תגובותיו על חבריו', 'תגובותיה על חברותיה')}`,
  };

  const efNames = { wm: 'זיכרון עבודה', inh: 'עכבה', flex: 'גמישות מחשבתית' };
  // FX1-r2 fix 3: definite-article forms, used only when a strength
  // sentence is framed through its EF ("בתחום ה...", Carmit's C50 form).
  const efNamesDef = { wm: 'זיכרון העבודה', inh: 'העכבה', flex: 'הגמישות המחשבתית' };

  // canon B3: morning/evening twin pairs that may be cited together in one
  // clause when both are weak (or the non-anchor twin scores exactly 3 —
  // rule 7, "a 3 may ride along"). 2↔10, 3↔11 are excluded because 10/11
  // carry no EF; 7↔15 is excluded because the two items sit under different
  // EFs. Only items 1-16 (morning/evening) have twins at all.
  const twinOf = { 1: 9, 9: 1, 4: 12, 12: 4, 5: 13, 13: 5, 6: 14, 14: 6, 8: 16, 16: 8 };
  const pairKey = (a, b) => [a, b].sort((x, y) => x - y).join('-');
  const twinMergePhrase = {
    '1-9': 'מתקשה ביוזמה של תחילת פעילות',
    '4-12': 'קושי להתארגן על פי כללי הבית, כמו הנחת בגדים במקום ופינוי כלים',
    '5-13': diffPhrase[5],
    '6-14': diffPhrase[6],
    '8-16': diffPhrase[8],
  };

  const routineData = [
    { key: 'morning', inName: 'בשגרת בוקר וערב', score: d.morningAvg, cutoff: d.c.morning },
    { key: 'play', inName: 'בשגרת פנאי ומשחק', score: d.playAvg, cutoff: d.c.play },
    { key: 'social', inName: 'בשגרה החברתית', score: d.socialAvg, cutoff: d.c.social },
  ];
  const efData = [
    { key: 'inh', label: 'עכבה', score: d.inhAvg, cutoff: d.c.inh },
    { key: 'wm', label: 'זיכרון עבודה', score: d.wmAvg, cutoff: d.c.wm },
    { key: 'flex', label: 'גמישות מחשבתית', score: d.flexAvg, cutoff: d.c.flex },
  ];

  const weakRoutines = routineData.filter((r) => belowCutoff(r.score, r.cutoff));
  const okRoutines = routineData.filter((r) => !belowCutoff(r.score, r.cutoff));
  const weakEFs = efData.filter((e) => belowCutoff(e.score, e.cutoff));
  const okEFs = efData.filter((e) => !belowCutoff(e.score, e.cutoff));
  const totalBelow = belowCutoff(d.totalAvg, d.c.total);

  // canon B2, the EF-status rule: below its own cutoff = primary attribution;
  // within 0.15 above = "close" (secondary only, softened wording); more than
  // 0.15 above = "clearly above" and may NEVER be used to explain a
  // difficulty (rule 17) — it can only become a woven-in strength.
  const efStatus = (e) => {
    const diff = e.score - e.cutoff;
    if (diff < 0) return 'below';
    if (diff <= 0.15) return 'close';
    return 'above';
  };
  const efStatusMap = {};
  efData.forEach((e) => {
    efStatusMap[e.key] = efStatus(e);
  });

  const strongItemsAll = items.filter((i) => d.scores[i.num] >= 4);

  const fmt = (n) => n.toFixed(2);
  const header = (t) =>
    `<p style="font-weight:700; color:var(--primary); font-size:0.88rem; margin-bottom:6px;">${t}</p>`;
  const para = (t) => `<p style="font-size:0.85rem; margin-bottom:12px;">${t}</p>`;

  let s = '';

  // ===== תמונה כללית =====
  s += header('תמונה כללית');
  let intro = `על פי דיווח ההורים בשאלון ה-EFORTS, `;
  if (totalBelow && weakRoutines.length === 3) {
    intro += `עולה קושי בניהול עצמאי של שגרות היום-יום ביחס לבני ${hisAge} (${got} ציון כולל ${fmtScore(d.totalAvg, d.c.total)} כאשר ציון החתך הוא ${fmt(d.c.total)}). התפקוד בשלוש השגרות (בוקר וערב, פנאי ומשחק ושגרה חברתית) נמוך מהמצופה ${g('לגילו', 'לגילה')}.`;
  } else if (totalBelow) {
    intro += `עולה קושי בניהול עצמאי של שגרות היום-יום ביחס לבני ${hisAge} (${got} ציון כולל ${fmtScore(d.totalAvg, d.c.total)} כאשר ציון החתך הוא ${fmt(d.c.total)}), בעיקר ${weakRoutines.map((r) => r.inName).join(' ו')}.`;
  } else if (weakRoutines.length > 0 || weakEFs.length > 0) {
    // canon F-4 / table row "Total in norm, profile weak": name "ציון כולל"
    // (not just the bare number) and LINK the weak routine to the EF behind
    // it ("נראה על רקע קושי ב...") instead of a flat comma list mixing
    // routines and EFs together.
    intro += `הציון הכולל הינו בתחום הנורמה (${got} ציון כולל ${fmtScore(d.totalAvg, d.c.total)} כאשר ציון החתך הוא ${fmt(d.c.total)}), אך מניתוח הפרופיל `;
    if (weakRoutines.length > 0) {
      intro += `עולים קשיים ${weakRoutines.map((r) => r.inName).join(' ו')}`;
      if (weakEFs.length > 0) {
        intro += `, נראה על רקע קושי ב${weakEFs.map((e) => e.label).join(' וב')}`;
      }
    } else {
      intro += `עולה קושי ב${weakEFs.map((e) => e.label).join(' וב')}`;
    }
    intro += '.';
  } else {
    // canon table row "Nothing below cutoff" (ASK E11): the only stated
    // default is "one in-norm sentence... none [else]" — no borderline/
    // frequency-label text. The old branch here quoted "לפעמים" (a
    // frequency label, rule 3) and invented a "רמה גבולית" concept the
    // canon explicitly flags; removed rather than replaced, per the
    // canon's own default.
    // Gemini review item 6: "תקין" / "ציון חתך" (no ה) are off-canon —
    // canon C2 bans "תקין לגמרי" and requires "ציון החתך" throughout.
    // Gemini review R7-2 (7.5): this sentence had no verb and dropped the
    // canon "(קיבל ציון כולל X כאשר ציון החתך הוא Y)" numeric form used
    // everywhere else in the summary.
    intro += `הניהול העצמאי של שגרות היום-יום הינו בטווח הנורמה ביחס לבני ${hisAge} (${got} ציון כולל ${fmtScore(d.totalAvg, d.c.total)} כאשר ציון החתך הוא ${fmt(d.c.total)}).`;
  }
  s += para(intro);

  // ===== משמעות קלינית — routine by routine, EF attribution inside =====
  if (weakRoutines.length > 0 || weakEFs.length > 0) {
    s += header('משמעות קלינית');

    // canon F-7 / table row "Total in norm, profile weak" (MUST, Carmit
    // rule 6): fold "which routines are fine" into the FIRST weak routine's
    // own score sentence (C32's exact form), so its below-cutoff status is
    // said ONCE — not once here and again in its own paragraph below.
    let mergedFirstWeakPrefix = null;
    if (okRoutines.length > 0 && weakRoutines.length > 0) {
      if (!totalBelow) {
        const first = weakRoutines[0];
        mergedFirstWeakPrefix = `ממצאי השאלון מורים על ציונים בטווח הנורמה (גבוהים מציון החתך) ${okRoutines.map((r) => r.inName).join(' ו')}, והציון ${first.inName} `;
      } else {
        // canon table row "Total below, only 1-2 routines low" (SHOULD,
        // deduced — no model verifies this exact mix). Credit the in-norm
        // routine(s) once here and say nothing yet about the weak
        // routine(s)' status — each gets its own paragraph below, so
        // nothing is announced twice either way.
        s += para(
          `ממצאי השאלון מורים על ציונים בטווח הנורמה ${okRoutines.map((r) => r.inName).join(' ו')}.`,
        );
      }
    }

    // Tracks which EFs have already been named in an earlier routine
    // paragraph this summary, so a repeat gets a transition + a different
    // verb instead of the same opener repeated (canon rule 22, the
    // attribution verb bank in §B1).
    const usedEFs = new Set();
    let repeatCount = 0;
    // FX2-strength-nouns-spec §B: the ordered union of every routine
    // paragraph's woven-in strengths (item numbers, paragraph order) — fed
    // to strengthNounSlot() below for the מומלץ fallback (item 4).
    const woven = [];

    weakRoutines.forEach((r, idx) => {
      const rItems = items.filter((i) => i.routine === r.key);
      const rWeak = rItems
        .filter((i) => d.scores[i.num] <= 2)
        .sort((a, b) => d.scores[a.num] - d.scores[b.num]);
      const rStrong = rItems.filter((i) => d.scores[i.num] >= 4);

      let p;
      if (mergedFirstWeakPrefix && idx === 0) {
        p = `${mergedFirstWeakPrefix}נמוך מציון החתך (${got} ציון ${fmtScore(r.score, r.cutoff)} כאשר ציון החתך הוא ${fmt(r.cutoff)}). `;
      } else {
        // canon rule 13 / 0b#5: "באופן משמעותי" only at a gap >= 0.50, and
        // it's never required; otherwise plain. "במעט" is never correct —
        // Carmit wrote plain at a 0.14 gap in both her model cases.
        const gap = r.cutoff - r.score;
        const severity =
          gap >= 0.5
            ? `הציון מורה על תפקוד נמוך באופן משמעותי מהמצופה ${g('לגילו', 'לגילה')}`
            : `הציון נמוך מציון החתך`;
        p = `${r.inName} ${severity} (${got} ציון ${fmtScore(r.score, r.cutoff)} כאשר ציון החתך הוא ${fmt(r.cutoff)}). `;
      }

      // Group this routine's weak items by EF function, then drop any EF
      // that is clearly above its OWN cutoff (canon B2 / rule 17) — that EF
      // never explains a difficulty here no matter how many weak items in
      // this routine happen to carry it; it can only become a strength below.
      const byEf = {};
      rWeak.forEach((i) => {
        if (!i.ef) return; // rule 21: items 10/11 are never EF evidence
        (byEf[i.ef] = byEf[i.ef] || []).push(i);
      });
      const eligibleEfKeys = Object.keys(byEf).filter((ef) => efStatusMap[ef] !== 'above');
      const statusRank = { below: 0, close: 1 };
      const efOrder = eligibleEfKeys.sort(
        (a, b) =>
          statusRank[efStatusMap[a]] - statusRank[efStatusMap[b]] ||
          byEf[b].length - byEf[a].length ||
          d.scores[byEf[a][0].num] - d.scores[byEf[b][0].num],
      );
      const chosen = efOrder.slice(0, 2); // canon: max 2 EFs per routine paragraph

      // canon B3: 1-2 examples per EF, lowest score first, merging a
      // morning/evening twin into one clause when it's also weak (or rides
      // along at exactly 3 — rule 7).
      const buildExamples = (weakItemsForEf) => {
        const used = new Set();
        const examples = [];
        for (const it of weakItemsForEf) {
          if (examples.length >= 2) break;
          if (used.has(it.num)) continue;
          const twinNum = twinOf[it.num];
          const twinScore = twinNum != null ? d.scores[twinNum] : undefined;
          if (twinNum != null && !used.has(twinNum) && twinScore != null && twinScore <= 3) {
            const key = pairKey(it.num, twinNum);
            const phrase = twinMergePhrase[key];
            if (phrase) {
              const [a, b] = key.split('-').map(Number);
              examples.push(`${phrase} (פריט ${a} ופריט ${b})`);
              used.add(it.num);
              used.add(twinNum);
              continue;
            }
          }
          examples.push(`${diffPhrase[it.num]} (פריט ${it.num})`);
          used.add(it.num);
        }
        return examples.join(' או ');
      };

      let attribution = '';
      if (chosen.length === 1) {
        const ef = chosen[0];
        const examples = buildExamples(byEf[ef]);
        if (usedEFs.has(ef)) {
          // canon rule 22: this EF was already named in an earlier
          // paragraph — a transition + a different verb, rotating through
          // the attribution verb bank instead of repeating "מושפע" again.
          attribution =
            repeatCount % 2 === 0
              ? `גם כאן נראה כי הקושי התפקודי קשור לקושי ב${efNames[ef]}, כמו למשל – ${examples}.`
              : // FX1-r2 fix 2: don't open a new sentence with "ו" right after
                // a period — dropped the leading ו. FX1-r2 fix 1: "מתבטא ב..."
                // needs a "בכך ש{pronoun}..." clause before a verb-phrase
                // description, not a bare ב-prefix glued onto the verb
                // itself ("מתבטא במביע" is ungrammatical). Also fixes the
                // "תפקודו" hardcode the FX1 check's §5 female-form audit
                // flagged: gendered via g().
                `נראה מממצאי השאלון כי הקושי המנמיך את ${g('תפקודו', 'תפקודה')} בתחום זה הוא הקושי ב${efNames[ef]}, וזה מתבטא בכך ש${g('הוא', 'היא')} ${examples}.`;
          repeatCount++;
        } else {
          attribution = `נראה כי הקושי התפקודי מושפע מקושי ב${efNames[ef]}, כמו למשל – ${examples}.`;
        }
      } else if (chosen.length === 2) {
        const [ef1, ef2] = chosen;
        const ex1 = buildExamples(byEf[ef1]);
        const ex2 = buildExamples(byEf[ef2]);
        if (efStatusMap[ef2] === 'close') {
          // canon rule 16: lead EF below cutoff + second EF close to its
          // own cutoff — the lead gets "לרוב", the second is softened.
          // FX1-r2 fix 1: same grammar class as the repeated-EF branch above
          // — "כפי שמתבטא ב..." needs the "בכך ש{pronoun}..." clause before
          // a verb-phrase description ("מתבטא בזקוק" is ungrammatical).
          // Gemini review item 5: the "כמו למשל" dash was missing on this
          // path (model 32 had none) — one form everywhere now: "– " (en
          // dash, spaced).
          attribution = `נראה כי הקושי התפקודי נובע לרוב מקושי ב${efNames[ef1]}, כמו למשל – ${ex1}, ולעיתים על רקע קושי ב${efNames[ef2]}, כפי שמתבטא בכך ש${g('הוא', 'היא')} ${ex2}.`;
        } else {
          // canon rule 16: two EFs both below their own cutoffs share equal
          // weight — no "בעיקר" on the first.
          // Gemini review item 2: a pronoun replaces the number mid-sentence
          // ("בכך ש-50 מוסח" read like the number was the subject).
          attribution = `נראה כי הקושי התפקודי מושפע מקושי ב${efNames[ef1]}, כמו למשל – ${ex1}, וכן מקושי ב${efNames[ef2]}, שמתבטא בין השאר בכך ש${g('הוא', 'היא')} ${ex2}.`;
        }
      }
      chosen.forEach((ef) => usedEFs.add(ef));

      if (attribution) p += attribution + ' ';

      // canon B4: a woven-in strength must come from an EF NOT blamed in
      // this paragraph, and must not contradict a cited item OR that
      // item's twin (e.g. "solves problems" is false when the twin item
      // scored low, even if that twin itself wasn't cited here).
      const blamedEFs = new Set(chosen);
      const eligibleStrong = rStrong.filter((i) => {
        if (i.ef && blamedEFs.has(i.ef)) return false;
        const twinNum = twinOf[i.num];
        const twinScore = twinNum != null ? d.scores[twinNum] : undefined;
        if (twinScore != null && twinScore <= 2) return false;
        return true;
      });
      if (eligibleStrong.length > 0) {
        // FX2-strength-nouns-spec §B step 1: feed the מומלץ noun-phrase
        // slot from the SAME items this paragraph already wove in as
        // strengths, in the SAME order/cap it uses (item order, first 3) —
        // pushed from the raw list (both twin numbers, when both are
        // strong) so strengthNounSlot's own twin-merge (step 2) can see
        // both and produce one "…והערב" entry instead of two.
        woven.push(...eligibleStrong.slice(0, 3).map((i) => i.num));

        // Twin-pair duplication bug (FX2 spec "Seen while specifying"):
        // both twins of a pair (e.g. items 6 + 14) share one strengthPhrase
        // string — without this, a strong twin pair printed the SAME
        // infinitive twice ("...מצליח להתעלם מגירויים מסיחים וכן להתעלם
        // מגירויים מסיחים"). Dedupe by phrase text before capping at 3, so
        // the sentence never repeats itself and a 3rd, distinct strength
        // gets the freed slot.
        const seenPhrases = new Set();
        const dedupedStrong = eligibleStrong.filter((i) => {
          const phrase = strengthPhrase[i.num];
          if (seenPhrases.has(phrase)) return false;
          seenPhrases.add(phrase);
          return true;
        });
        const sPhrases = dedupedStrong.slice(0, 3).map((i) => strengthPhrase[i.num]);
        // FX1-r2 fix 3: frame the strength through its EF, Carmit's C50
        // form ("בתחום זה נראה כי היכולת שלו בתחום ה[EF] באה לידי ביטוי,
        // והוא [strength] וכן [strength]") — generalized to any strength
        // set that shares a single EF, not just flexibility/play. Each
        // strengthPhrase entry already carries its own gendered verb, so no
        // separate lead verb is needed; a mixed-EF strength set (no model
        // case) falls back to the old EF-agnostic phrasing.
        const strongEfKeys = [
          ...new Set(
            dedupedStrong
              .slice(0, 3)
              .map((i) => i.ef)
              .filter(Boolean),
          ),
        ];
        if (strongEfKeys.length === 1) {
          const efLabel = efNamesDef[strongEfKeys[0]];
          p += `בתחום זה נראה כי היכולת ${g('שלו', 'שלה')} בתחום ${efLabel} באה לידי ביטוי, ו${g('הוא', 'היא')} ${g('מצליח', 'מצליחה')} ${sPhrases.join(' וכן ')}.`;
        } else {
          const joined =
            sPhrases.length > 1
              ? sPhrases.slice(0, -1).join(', ') + ' ו' + sPhrases[sPhrases.length - 1]
              : sPhrases[0];
          p += `לצד זאת, ${g('הוא', 'היא')} ${g('מצליח', 'מצליחה')} ${joined}.`;
        }
      }
      // canon B4 (last line): with no eligible strength, write nothing —
      // don't reach for a filler.

      s += para(p.trim());
    });

    // Cross-EF view (canon B5): status in WORDS only, no behavioral claims
    // the item data doesn't support. The three canned sentences this used
    // to end with are gone — rule 35's grounding failures (e.g. "זוכר
    // רצפים ומתניע לבד" while this same summary cites item 9/1 as weak two
    // paragraphs up) came from exactly this kind of invented claim.
    // Gemini review item 1: prose in Carmit's own shape (C32, canon B5),
    // not a table row — no semicolons and no dashes, "ואכן" follows a
    // comma not a period (canon F36), and efStatusMap (already computed
    // above) is read instead of re-deriving the 0.15 "close" line a
    // second time here.
    const efStatusText = (e) =>
      efStatusMap[e.key] === 'close' ? 'קרוב לציון החתך' : 'גבוה מציון החתך';
    const joinEfClauses = (arr) => arr.join(', ו');
    let efPara = 'בהסתכלות על תפקודים ניהוליים ספציפיים, ';
    if (weakEFs.length === 1) {
      const e = weakEFs[0];
      efPara += `נראה כי הקושי הבולט יותר הוא בתפקוד הניהולי ${e.label}, ואכן הציון בתפקוד זה נמוך מציון החתך (${got} ציון ${fmtScore(e.score, e.cutoff)} כאשר ציון החתך הוא ${fmt(e.cutoff)}).`;
      if (okEFs.length > 0) {
        // Gemini review R7-3 (7.6): when both remaining EFs share the SAME
        // status, one plural clause reads cleaner than two repeated
        // "הציון ב-X..." clauses. Mixed statuses (one close, one above)
        // stay as two clauses, unchanged.
        if (okEFs.length === 2 && efStatusMap[okEFs[0].key] === efStatusMap[okEFs[1].key]) {
          const [o1, o2] = okEFs;
          const statusPlural =
            efStatusMap[o1.key] === 'close' ? 'קרובים לציון החתך' : 'גבוהים מציון החתך';
          efPara += ` בתפקודים האחרים המנותחים בשאלון, הציונים ב${o1.label} וב${o2.label} ${statusPlural}.`;
        } else {
          const okClauses = okEFs.map((o) => `הציון ב${o.label} ${efStatusText(o)}`);
          efPara += ` בתפקודים האחרים המנותחים בשאלון, ${joinEfClauses(okClauses)}.`;
        }
      }
    } else if (weakEFs.length === 2) {
      const [e1, e2] = weakEFs;
      efPara += `נראה כי הקושי הבולט הוא ב${e1.label} וב${e2.label}, ואכן הציונים בתפקודים אלו נמוכים מציון החתך (ב${e1.label} ${got} ציון ${fmtScore(e1.score, e1.cutoff)} כאשר ציון החתך הוא ${fmt(e1.cutoff)}, וב${e2.label} ${got} ציון ${fmtScore(e2.score, e2.cutoff)} כאשר ציון החתך הוא ${fmt(e2.cutoff)}).`;
      if (okEFs.length > 0) {
        const e3 = okEFs[0];
        efPara += ` הציון בתפקוד השלישי שנבדק בשאלון, ${e3.label}, ${efStatusText(e3)}.`;
      }
    } else if (weakEFs.length === 3) {
      // Three weak EFs (no model case, canon E11): extend the two-EF
      // template naturally rather than invent a new shape.
      const names = weakEFs.map((e) => e.label);
      const namesJoined = names.slice(0, -1).join(', ') + ' ו' + names[names.length - 1];
      const scoresJoined = weakEFs
        .map(
          (e) =>
            `ב${e.label} ${got} ציון ${fmtScore(e.score, e.cutoff)} כאשר ציון החתך הוא ${fmt(e.cutoff)}`,
        )
        .join(', ');
      efPara += `נראה כי הקושי הבולט הוא ב${namesJoined}, ואכן הציונים בתפקודים אלו נמוכים מציון החתך (${scoresJoined}).`;
    } else {
      // Gemini review item 6: "בטווח התקין" is off-canon (canon C2 wants
      // "בטווח הנורמה").
      // Gemini review R7-4 (7.9, BUG found while preparing round 7): the old
      // text here said "כל התפקודים הניהוליים בטווח הנורמה" whenever NO EF
      // was below its own cutoff — including when one was merely "close"
      // (within EF_CLOSE_MARGIN), contradicting the card, which shows
      // "קרוב לציון החתך" for that EF. Group by efStatusMap instead, in the
      // fixed instrument order (עכבה → זיכרון עבודה → גמישות מחשבתית), and
      // name every EF's own status.
      // R7-4 (7.8) also deletes the old "ייתכן שהקושי בשגרות נובע מגורמים
      // סביבתיים..." sentence: it named causes the questionnaire doesn't
      // measure, and an EF average in norm overall doesn't rule out an EF
      // part in ONE routine (same "not X" ban fix 6 already applied).
      const aboveGroup = efData.filter((e) => efStatusMap[e.key] === 'above');
      const closeGroup = efData.filter((e) => efStatusMap[e.key] === 'close');
      const namesB = (arr) =>
        arr.length === 1 ? `ב${arr[0].label}` : `ב${arr[0].label} וב${arr[1].label}`;

      let statusSentence;
      if (aboveGroup.length === 3) {
        statusSentence = 'הציונים בכל התפקודים הניהוליים הינם בטווח הנורמה';
      } else if (closeGroup.length === 3) {
        statusSentence = 'הציונים בכל התפקודים הניהוליים קרובים לציון החתך';
      } else {
        const aboveClause =
          aboveGroup.length === 1
            ? `הציון ${namesB(aboveGroup)} הינו בטווח הנורמה`
            : `הציונים ${namesB(aboveGroup)} הינם בטווח הנורמה`;
        const closeClause =
          closeGroup.length === 1
            ? `הציון ${namesB(closeGroup)} קרוב לציון החתך`
            : `הציונים ${namesB(closeGroup)} קרובים לציון החתך`;
        statusSentence = `${aboveClause}, ו${closeClause}`;
      }

      // One bracket with all three EFs, fixed order, ב- form throughout
      // (the round-1 gender trap: "עכבה קיבל ציון" reads as if the EF name
      // were the subject — "בעכבה קיבל ציון" keeps the child as subject).
      const bracketParts = efData.map(
        (e) =>
          `ב${e.label} ${got} ציון ${fmtScore(e.score, e.cutoff)} כאשר ציון החתך הוא ${fmt(e.cutoff)}`,
      );
      const bracket =
        bracketParts.slice(0, -1).join(', ') + ', ו' + bracketParts[bracketParts.length - 1];

      efPara += `${statusSentence} (${bracket}).`;
    }
    s += para(efPara);

    // ===== המלצה =====
    let rec =
      'מומלץ על טיפול שיכלול הדרכת הורים אודות התפתחות התפקודים הניהוליים וכיצד ההורים יכולים לסייע בהקניית אסטרטגיות יעילות התומכות בתפקוד';
    if (weakEFs.length > 0) {
      rec += `, תוך ניתוח דרישות המטלה והסביבה וקביעת מטרות ישימות לטווח קצר, בהתייחס למוקד הקושי ב${weakEFs.map((e) => e.label).join(' וב')}`;
    } else {
      rec += ', תוך ניתוח דרישות המטלה והסביבה והתאמת השגרה בבית';
    }
    if (strongItemsAll.length >= 2) {
      // canon D "Strengths" part: motivation + small successes + recruiting
      // strengths from an easier routine toward the harder ones, named with
      // the anonymous number — never "הילד" (rule 25).
      // Gemini review item 3: "כמו כן מומלץ לשים דגש" repeated the
      // מ-ל-צ root right after "מומלץ על טיפול" — Carmit's C32 wording
      // ("תוך שימת דגש על") folds this into ONE sentence instead.
      // Gemini review item 4 / FX2-strength-nouns-spec: when in-norm
      // routines exist, keep naming them (unchanged, §C precedence 1);
      // otherwise, name the real strength items instead of the vague
      // fallback (§C precedence 2); "במשימות אחרות" only when neither
      // applies (§C precedence 3, Carmit's own C32 wording).
      // Gemini review R7-5b (7.11): when NO routine is below cutoff (the
      // EF-only profile), there's no harder routine to transfer strengths
      // onto — end at the success-collecting clause instead of inventing a
      // target ("...אל המשימות שקשות לו יותר" implied a harder routine that
      // doesn't exist here).
      if (weakRoutines.length === 0) {
        rec += `, תוך שימת דגש על גיוס מוטיבציה של ${anonId}, איסוף חוויות של הצלחה גם אם קטנות.`;
      } else {
        // Gemini review R7-5a (7.10): joinHe ("A, B וC"), never the flat
        // "A וB וC" a plain join(' ו') produces for three routines. Guarded
        // on length — joinHe([]) has no defined "0 items" case (it's built
        // for the 1+ case elsewhere), so keep the empty-string fallthrough
        // a bare join(' ו') gave for free when okRoutines is empty (e.g.
        // model-50/50f, all three routines weak) — that '' is what lets the
        // next `||` reach strengthNounSlot()/the vague fallback.
        const strengthRoutines =
          okRoutines.length > 0 ? joinHe(okRoutines.map((r) => r.inName)) : '';
        const strengthSlot = strengthRoutines || strengthNounSlot(woven) || 'במשימות אחרות';
        rec += `, תוך שימת דגש על גיוס מוטיבציה של ${anonId}, איסוף חוויות של הצלחה גם אם קטנות, וגיוס ${g('כוחותיו', 'כוחותיה')} המתבטאים ${strengthSlot} אל המשימות שקשות ${g('לו', 'לה')} יותר.`;
      }
    } else {
      rec += '.';
    }
    s += para(rec);
  }

  return s;
}

// AI-13: the new prompt. Top-level so buildExportText() can call it. The
// template literal's lines sit flush left — anything indented inside the
// backticks would end up in the downloaded file.
function aiPrompt(anonIdText, gender) {
  return `הנחיות לכלי ה-AI:

1. מה כבר קיים. הציונים חושבו בכלי, והסיכום הקליני שלמעלה (תמונה כללית, משמעות קלינית ופסקת "מומלץ") נכתב בכלי לפי כללי הכתיבה שנגזרו מהנוסח של מחברות השאלון. אל תחשב מחדש אף ציון, אל תשנה אף מספר, ואל תכתוב מחדש את הסיכום או חלק ממנו.

2. מה אתה כותב: רק את פסקת המטפל/ת. זו פסקה אחת, שנכנסת בין "משמעות קלינית" לבין פסקת "מומלץ", ומצרפת את ממצאי השאלון לתמונה הקלינית מהמפגש. פתח כמו בנוסח של המחברות: "אם מצרפים ממצאי הערכה אלו לתמונה הקלינית בשטח עולה כי…". כתוב אותה רק ממה שהמטפל/ת מוסר/ת לך בשיחה הזו: תצפיות מהמפגש, דיווח של ההורים או של הצוות החינוכי, ממצאים ממבדקים אחרים. אם לא נמסרו תצפיות, אל תכתוב את הפסקה, ושאל את המטפל/ת מה נצפה.

3. תוספת לפסקת "מומלץ", רק אם המטפל/ת ביקש/ה: חצי משפט שמתחבר לסוף הפסקה הקיימת, רק ממה שעלה במפגש (לדוגמה "וייתכן גם ויסות רגשי", כשזה עלה בטיפול ולא מהשאלון). בלי מספר טיפולים, תדירות, שמות פרוטוקולים, הפניות או אבחנות.

4. לא להמציא. כל משפט נשען על הקובץ הזה או על מה שהמטפל/ת כתב/ה בשיחה. אף משפט לא סותר ציון של פריט או משפט אחר בסיכום. מוטיבציה, ביטחון עצמי, ויסות רגשי וקשב נכתבים רק אם המטפל/ת מסר/ה אותם.

5. קול ושפה, כמו בסיכום:
- גוף שלישי. פעלים רכים: "מתקשה ל…", "זקוק ל…", "מוסח מ…", "עולה קושי ב…", "נראה כי", "ייתכן", "על רקע", "ככל הנראה".
- בלי שרשראות שלילה ("לא עושה, לא זוכר") ובלי ניגוד מהסוג "לא X אלא Y".
- בלי תוויות אבחנתיות או תכונתיות ("אימפולסיבי", ADHD, "קשב" כאבחנה). מתארים התנהגות: פזיזות, מוסחות, קושי בעכבה.
- "איחור" או "עיכוב" לעולם אינם קביעה כללית; קושי נכתב תמיד בתחום שלו.
- כינוי למטופל/ת: כינוי גוף ("הוא", "היא"), או המספר האנונימי (${anonIdText}) לכל היותר פעם אחת בפסקה. לעולם לא "הילד" או "הילדה", לעולם לא שם או ת״ז, ואין לבקש אותם.
- מין: ${gender}. התאמת מין בכל פועל, כינוי וסיומת. אם המין לא צוין, שאל לפני שאתה כותב.
- עברית בלבד. המילה הלועזית היחידה: EFORTS.

6. מונחים, בדיוק כך: עכבה · זיכרון עבודה · גמישות מחשבתית · תפקודים ניהוליים · ציון החתך · ציון כולל · בטווח הנורמה (בסיכום מופיע גם "בתחום הנורמה", ולתפקוד ניהולי גם "גבוה מציון החתך") · שגרת בוקר וערב · שגרת פנאי ומשחק · השגרה החברתית · שגרות היום-יום. לא: "סף", "נקודת חתך", "פונקציות ניהוליות", "תקין לגמרי".

7. מספרים ופריטים. ציון נכתב בצורה "(קיבל/ה ציון X כאשר ציון החתך הוא Y)", שתי ספרות אחרי הנקודה, בדיוק כפי שהוא מופיע למעלה. בלי ממוצעים, סטיות תקן, אחוזונים, "מתחת לממוצע", ובלי מילות התשובה ("לפעמים", "לעיתים רחוקות"). פריט נכתב "פריט N"; שני פריטים: "(פריט N ופריט M)".

8. תפקודים ניהוליים. תפקוד ניהולי שציונו נמוך מציון החתך הוא ההסבר העיקרי לקושי. תפקוד שציונו "קרוב לציון החתך" (עד 0.15 מעליו) יכול להסביר קושי רק כגורם משני ("ולעיתים על רקע קושי ב…"). תפקוד שציונו גבוה מציון החתך ביותר מ-0.15 (במצב "בטווח הנורמה" ברשימת הציונים) אינו מסביר קושי; הוא יכול להופיע רק כחוזקה. פריטים 10 ו-11 אינם ראיה לאף תפקוד ניהולי.

9. פורמט. טקסט רגיל בלבד: בלי כוכביות, בלי כותרות ובלי תבליטים, כי הטקסט מודבק למערכת שמוחקת עיצוב. החזר רק את הפסקה המבוקשת, ללא שום טקסט מקדים (כמו "להלן הפסקה"), ולפניה שורה אחת שאומרת איפה היא נכנסת.

10. בקשות אחרות (נוסח לדוח, גרסה להורים, מטרות טיפול): למחברות עוד אין נוסח מוסכם לאלה. כתוב אותן רק אם המטפל/ת ביקש/ה במפורש, פתח ב"טיוטה — לבדיקת המטפל/ת", ושמור על כל הכללים שלמעלה.

לפני שאתה עונה, בדוק:
[ ] לא חישבתי ולא שיניתי אף ציון, ולא כתבתי מחדש את הסיכום.
[ ] כל משפט נשען על הקובץ או על דברי המטפל/ת, ואף משפט לא סותר ציון של פריט.
[ ] אין "הילד" או "הילדה", אין שם ואין ת״ז; המספר האנונימי מופיע לכל היותר פעם בפסקה.
[ ] התאמת מין בכל מקום.
[ ] פעלים רכים; בלי שרשראות שלילה, בלי תוויות אבחנתיות, בלי "איחור" כללי.
[ ] מונחים ומספרים בדיוק בצורה שלמעלה.
[ ] בלי מספר טיפולים, פרוטוקולים, הפניות או אבחנות.
[ ] טקסט רגיל, בלי עיצוב.
`;
}

// Pure: builds the "הורד ל-AI" export text from the current form/results
// state. No DOM writes, no download — downloadForAI() below does that, so
// this is directly testable via page.evaluate(() => buildExportText()).
function buildExportText() {
  const genderRaw = document.getElementById('childGender').value;
  const gender = genderText(genderRaw);
  const isMale = genderRaw === 'male';
  const ageText = document.getElementById('calcAge').textContent;
  const ageLabel = document.getElementById('ageGroupDisplay').textContent;
  const ageGroup = document.getElementById('ageGroup').value;
  // Item 8: escape here too — this text also feeds buildSummary() below.
  const anonIdText = escapeHtml(getAnonId()) || '—';
  const efLabels = { inh: 'עכבה', wm: 'זיכרון עבודה', flex: 'גמישות מחשבתית' };

  // Collect all scores
  const scores = {};
  items.forEach((item) => {
    const checked = document.querySelector(`input[name="q${item.num}"]:checked`);
    if (checked) scores[item.num] = parseInt(checked.value);
  });

  // Compute averages
  const morningItems = items.filter((i) => i.routine === 'morning').map((i) => scores[i.num]);
  const playItems = items.filter((i) => i.routine === 'play').map((i) => scores[i.num]);
  const socialItems = items.filter((i) => i.routine === 'social').map((i) => scores[i.num]);
  const morningAvg = avg(morningItems);
  const playAvg = avg(playItems);
  const socialAvg = avg(socialItems);
  const totalAvg = avg([morningAvg, playAvg, socialAvg]);
  const inhAvg = avg(items.filter((i) => i.ef === 'inh').map((i) => scores[i.num]));
  const wmAvg = avg(items.filter((i) => i.ef === 'wm').map((i) => scores[i.num]));
  const flexAvg = avg(items.filter((i) => i.ef === 'flex').map((i) => scores[i.num]));
  const c = cutoffs[ageGroup];

  const companions = {
    morning: document.getElementById('companion_morning')?.value || '',
    play: document.getElementById('companion_play')?.value || '',
    social: document.getElementById('companion_social')?.value || '',
  };
  const compLabels = { mom: 'אמא', dad: 'אבא', both: 'שני ההורים', other: 'אחר' };

  const scoreNames = ['', 'אף פעם', 'לעיתים רחוקות', 'לפעמים', 'לעיתים קרובות', 'תמיד'];

  let text = `שאלון EFORTS — נתוני קידוד לשימוש בכלי AI\n`;
  text += `══════════════════════════════════\n\n`;

  text += `רקע על הכלי:\n`;
  text += `EFORTS (Executive Functions & Occupational Routine Scale) — "שאלון למדידת יכולת הניהול העצמי של ילדים בשגרות היום יום" (Frisch & Rosenblum, 2014; נורמות וציוני חתך: Frisch & Rosenblum, 2024). שאלון להורים, לגילאי 3.0–11.11: 30 פריטים בשלוש שגרות — שגרות בוקר וערב (פריטים 1–16), שגרות משחק ופנאי (17–23) ושגרה חברתית (24–30). כל פריט מדורג מ-1 (אף פעם) עד 5 (תמיד); ציון גבוה = תפקוד טוב יותר. ציון שגרה = ממוצע פריטי השגרה; ציון כולל = ממוצע שלושת ציוני השגרות. כל פריט משויך גם לאחד משלושה תפקודים ניהוליים — עכבה, זיכרון עבודה או גמישות מחשבתית; פריטים 10 ו-11 אינם נכללים בחישוב התפקודים הניהוליים. ציון החתך נקבע 1.5 סטיות תקן מתחת לממוצע של קבוצת הגיל. ציון נמוך מציון החתך מורה על חשד לקושי בתחום שנמדד בלבד (בשגרה או בתפקוד הניהולי), ואינו קביעה של עיכוב כללי.\n\n`;

  text += `פרטי המטופל/ת:\n`;
  text += `  מספר אנונימי: ${anonIdText} | מין: ${gender} | גיל: ${ageText} | קבוצת גיל נורמטיבית: ${ageLabel}\n\n`;

  const line = (label, sc, ct, kind) =>
    `    ${label}: ${fmtScore(sc, ct)} | ציון החתך: ${ct.toFixed(2)} | ${cutoffStatus(sc, ct, kind).text}\n`;
  text += `ציונים (חושבו בכלי — אין לחשב מחדש): ציון, ציון החתך, מצב\n`;
  text += `  שגרות:\n`;
  text += line('בוקר וערב', morningAvg, c.morning, 'routine');
  text += line('פנאי ומשחק', playAvg, c.play, 'routine');
  text += line('שגרה חברתית', socialAvg, c.social, 'routine');
  text += line('ציון כולל', totalAvg, c.total, 'total');
  text += `  תפקודים ניהוליים:\n`;
  text += line('עכבה', inhAvg, c.inh, 'ef');
  text += line('זיכרון עבודה', wmAvg, c.wm, 'ef');
  text += line('גמישות מחשבתית', flexAvg, c.flex, 'ef');
  text += `\n`;

  // All 30 items with scores
  text += `פריטים וציונים:\n`;
  const routines = [
    { key: 'morning', label: 'שגרת בוקר וערב', range: [1, 16] },
    { key: 'play', label: 'שגרת פנאי ומשחק', range: [17, 23] },
    { key: 'social', label: 'שגרה חברתית', range: [24, 30] },
  ];
  routines.forEach((r) => {
    const comp = companions[r.key]
      ? ` (מי נמצא בדרך כלל בשגרות אלו: ${compLabels[companions[r.key]] || companions[r.key]})`
      : '';
    text += `\n${r.label}${comp}:\n`;
    items
      .filter((i) => i.num >= r.range[0] && i.num <= r.range[1])
      .forEach((item) => {
        const sc = scores[item.num];
        const ef = item.ef ? efLabels[item.ef] : 'לא כלול בתפקודים הניהוליים';
        text += `  ${item.num}. ${item.text} — ${sc} (${scoreNames[sc]}) [${ef}]\n`;
      });
  });

  // AI-12: the fixed summary, so the AI sees exactly what it must not rewrite.
  const summaryHtml = buildSummary({
    anonId: anonIdText,
    gender,
    isMale,
    ageText,
    ageLabel,
    morningAvg,
    playAvg,
    socialAvg,
    totalAvg,
    inhAvg,
    wmAvg,
    flexAvg,
    c,
    scores,
  });
  text += `\nהסיכום הקליני שנכתב בכלי (קבוע — אין לשנות):\n`;
  text += summaryHtmlToText(summaryHtml) + '\n';

  text += '\n' + aiPrompt(anonIdText, gender);

  return text;
}

function downloadForAI() {
  const text = buildExportText();
  // Item 8: sanitize (not HTML-escape) for a filename — strip anything
  // outside letters/digits/hyphen so a pasted "<script>" etc. can't reach
  // the downloaded file's name.
  const anonId = (getAnonId() || 'eforts').replace(/[^0-9A-Za-zא-ת-]/g, '_');
  const date = new Date().toISOString().slice(0, 10);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `EFORTS_${anonId}_${date}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

async function printResults() {
  const btn = document.querySelector('.btn-pdf');
  btn.disabled = true;
  btn.textContent = 'מכין להדפסה…';

  try {
    // Gather all data from the current results. Item 8: escape here too —
    // this feeds both the print meta line and buildSummary() below.
    const anonId = escapeHtml(getAnonId()) || '—';
    const genderRaw = document.getElementById('childGender').value;
    const gender = genderText(genderRaw);
    const ageText = document.getElementById('calcAge').textContent;
    const ageLabel = document.getElementById('ageGroupDisplay').textContent;
    const ageGroup = document.getElementById('ageGroup').value;
    const c = cutoffs[ageGroup];

    const scores = {};
    items.forEach((item) => {
      const checked = document.querySelector(`input[name="q${item.num}"]:checked`);
      if (checked) scores[item.num] = parseInt(checked.value);
    });

    const morningAvg = avg(items.filter((i) => i.routine === 'morning').map((i) => scores[i.num]));
    const playAvg = avg(items.filter((i) => i.routine === 'play').map((i) => scores[i.num]));
    const socialAvg = avg(items.filter((i) => i.routine === 'social').map((i) => scores[i.num]));
    const totalAvg = avg([morningAvg, playAvg, socialAvg]);
    const inhAvg = avg(items.filter((i) => i.ef === 'inh').map((i) => scores[i.num]));
    const wmAvg = avg(items.filter((i) => i.ef === 'wm').map((i) => scores[i.num]));
    const flexAvg = avg(items.filter((i) => i.ef === 'flex').map((i) => scores[i.num]));

    const isMale = document.getElementById('childGender').value === 'male';
    const summaryHtml = buildSummary({
      anonId,
      gender,
      isMale,
      ageText,
      ageLabel,
      morningAvg,
      playAvg,
      socialAvg,
      totalAvg,
      inhAvg,
      wmAvg,
      flexAvg,
      c,
      scores,
    });

    // Score level helpers
    const scoreNames = ['', 'אף פעם', 'לעיתים רחוקות', 'לפעמים', 'לעיתים קרובות', 'תמיד'];
    const _efLabels = { inh: 'עכבה', wm: 'זיכרון עבודה', flex: 'גמישות מחשבתית' };
    const _routineLabels = { morning: 'בוקר וערב', play: 'פנאי ומשחק', social: 'שגרה חברתית' };

    // Group items by score level
    const weakItems = items
      .filter((i) => scores[i.num] <= 2)
      .sort((a, b) => scores[a.num] - scores[b.num]);
    const midItems = items.filter((i) => scores[i.num] === 3);
    const strongItems = items
      .filter((i) => scores[i.num] >= 4)
      .sort((a, b) => scores[b.num] - scores[a.num]);

    // S-11: the print copy of B8 — same cutoffStatus() source as the screen.
    // Item 10: match the screen's --red/--amber/--green exactly, not a
    // separate print-only palette.
    const PRINT_COLOR = { warn: '#c62828', mid: '#f57f17', ok: '#2e7d32' };
    const levelText = (sc, ct, kind) => {
      const st = cutoffStatus(sc, ct, kind);
      return st.key === 'below' ? `${st.text} ⚠` : st.key === 'norm' ? `${st.text} ✓` : st.text;
    };
    const levelColor = (sc, ct, kind) => PRINT_COLOR[cutoffStatus(sc, ct, kind).cls];

    // Build score rows for the table
    const scoreTableRows = [
      { label: 'בוקר וערב', sc: morningAvg, ct: c.morning, kind: 'routine' },
      { label: 'פנאי ומשחק', sc: playAvg, ct: c.play, kind: 'routine' },
      { label: 'שגרה חברתית', sc: socialAvg, ct: c.social, kind: 'routine' },
      { label: 'ציון כולל', sc: totalAvg, ct: c.total, kind: 'total' },
    ];
    const efTableRows = [
      { label: 'עכבה', sc: inhAvg, ct: c.inh, kind: 'ef' },
      { label: 'זיכרון עבודה', sc: wmAvg, ct: c.wm, kind: 'ef' },
      { label: 'גמישות מחשבתית', sc: flexAvg, ct: c.flex, kind: 'ef' },
    ];

    const buildScoreTable = (rows) =>
      rows
        .map(
          (r) =>
            `<tr>
        <td style="padding:4px 10px;font-weight:600;text-align:right;">${r.label}</td>
        <td style="padding:4px 10px;text-align:center;color:${levelColor(r.sc, r.ct, r.kind)};font-weight:700;">${fmtScore(r.sc, r.ct)}</td>
        <td style="padding:4px 10px;text-align:center;color:#666;">${r.ct.toFixed(2)}</td>
        <td style="padding:4px 10px;text-align:center;color:${levelColor(r.sc, r.ct, r.kind)};">${levelText(r.sc, r.ct, r.kind)}</td>
      </tr>`,
        )
        .join('');

    const buildItemRows = (itemList, bgColor) =>
      itemList
        .map(
          (item) =>
            `<tr style="background:${bgColor};">
        <td style="padding:4px 8px;text-align:center;color:#888;font-size:11px;">${item.num}</td>
        <td style="padding:4px 8px;text-align:right;font-size:11px;line-height:1.5;">${item.text}</td>
        <td style="padding:4px 8px;text-align:center;font-size:11px;">${_routineLabels[item.routine]}</td>
        <td style="padding:4px 8px;text-align:center;font-size:11px;">${_efLabels[item.ef] || 'לא כלול'}</td>
        <td style="padding:4px 8px;text-align:center;font-weight:700;font-size:12px;color:${scores[item.num] <= 2 ? '#c0392b' : scores[item.num] === 3 ? '#d35400' : '#27ae60'};">${scores[item.num]}</td>
        <td style="padding:4px 8px;text-align:center;font-size:10px;color:#888;">${scoreNames[scores[item.num]]}</td>
      </tr>`,
        )
        .join('');

    // P-07: the fill date, not today's date — the age is computed from it.
    const fillIso = getFillDateValue();
    const fillDateText = new Date(fillIso || Date.now()).toLocaleDateString('he-IL');

    // Build a minimal, print-optimized HTML document
    const printHtml = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Heebo', sans-serif; direction: rtl; color: #1a202c; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
  h1 { text-align: center; font-size: 18px; margin-bottom: 4px; }
  .meta { text-align: center; font-size: 12px; color: #666; margin-bottom: 16px; }
  .print-header { text-align: center; margin-bottom: 12px; }
  .print-header-logos { display: flex; align-items: flex-end; justify-content: center; gap: 14px; margin-bottom: 8px; }
  .print-header-logos img { height: 28px; width: auto; max-width: 100px; object-fit: contain; }
  .print-header-title { font-size: 15px; font-weight: 700; color: #1a202c; margin-top: 8px; line-height: 1.4; }
  .print-header-authors { font-size: 12px; font-weight: 700; color: #1a202c; margin-top: 6px; }
  .print-header-lab { font-size: 10px; font-weight: 500; color: #64748b; margin-top: 1px; }
  .print-header-citation { font-size: 9px; font-weight: 300; color: #64748b; margin-top: 3px; }
  .print-header-credit { font-size: 9px; font-weight: 300; color: #94a3b8; margin-top: 4px; line-height: 1.4; }
  .section-title { font-size: 14px; font-weight: 700; color: #0077b6; margin: 16px 0 8px; padding-bottom: 4px; border-bottom: 2px solid #0077b6; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  th { background: #f0f4f8; padding: 6px 10px; font-size: 11px; font-weight: 600; color: #444; text-align: center; border-bottom: 2px solid #ddd; }
  td { border-bottom: 1px solid #eee; }
  .summary-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 16px; font-size: 12px; line-height: 1.8; }
  .summary-box p { margin: 0 0 10px; }
  .summary-box p:last-child { margin-bottom: 0; }
  .group-header { font-size: 12px; font-weight: 700; padding: 6px 10px; margin-top: 8px; }
  .group-weak { color: #c0392b; background: #fff5f5; }
  .group-mid { color: #d35400; background: #fffbeb; }
  .group-strong { color: #27ae60; background: #f0fdf4; }
  .footer { text-align: center; font-size: 10px; color: #aaa; margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee; }
  @media print { body { padding: 10px; } }
</style>
</head>
<body>
  <div class="print-header">
    <div class="print-header-logos">
      <img src="assets/haifa.jpg" alt="אוניברסיטת חיפה">
      <img src="assets/chap.png" alt="המעבדה לתפקוד אנושי מורכב (CHAP)">
      <img src="assets/clalit.svg" alt="שירותי בריאות כללית">
    </div>
    <div class="print-header-title">שאלון למדידת יכולת הניהול העצמי של ילדים בשגרות היום יום</div>
    <div class="print-header-authors">כרמית פריש ופרופ' שרה רוזנבלום, אוניברסיטת חיפה</div>
    <div class="print-header-lab">המעבדה לתפקוד אנושי מורכב (CHAP), אוניברסיטת חיפה</div>
    <div class="print-header-citation">Frisch &amp; Rosenblum, 2014</div>
    <div class="print-header-credit">תהליך מחשוב השאלון בוצע ע"י אליסון אלט, מרפאה בעיסוק בשירותי בריאות כללית מחוז ירושלים, בתיאום ואישור המחברות.</div>
  </div>
  <h1>תוצאות שאלון EFORTS</h1>
  <div class="meta">${patientNoun(genderRaw)} מס' ${anonId} | ${gender} | ${ageText} | קבוצת גיל: <bdi dir="ltr">${ageLabel}</bdi> | תאריך מילוי: ${fillDateText}</div>

  <div class="section-title">ציונים</div>
  <table>
    <tr><th style="text-align:right;">שגרה</th><th>ציון</th><th>ציון החתך</th><th>מצב</th></tr>
    ${buildScoreTable(scoreTableRows)}
    <tr><td colspan="4" style="padding:2px;border:none;"></td></tr>
    <tr><th style="text-align:right;">תפקוד ניהולי</th><th>ציון</th><th>ציון החתך</th><th>מצב</th></tr>
    ${buildScoreTable(efTableRows)}
  </table>

  <div class="section-title">סיכום קליני</div>
  <div class="summary-box">${summaryHtml}</div>

  <div class="section-title">פירוט הפריטים לפי ציון</div>
  <table>
    <tr><th style="width:30px;">#</th><th style="text-align:right;">פריט</th><th style="width:80px;">שגרה</th><th style="width:80px;">תפקוד ניהולי</th><th style="width:40px;">ציון</th><th style="width:70px;">תשובה</th></tr>
    ${weakItems.length > 0 ? `<tr><td colspan="6" class="group-header group-weak">ציון 1–2 (קושי) — ${nItems(weakItems.length)}</td></tr>` + buildItemRows(weakItems, '#fff5f5') : ''}
    ${midItems.length > 0 ? `<tr><td colspan="6" class="group-header group-mid">ציון 3 — ${nItems(midItems.length)}</td></tr>` + buildItemRows(midItems, '#fffbeb') : ''}
    ${strongItems.length > 0 ? `<tr><td colspan="6" class="group-header group-strong">ציון 4–5 (חוזקה) — ${nItems(strongItems.length)}</td></tr>` + buildItemRows(strongItems, '#f0fdf4') : ''}
  </table>

  <div class="footer">
    EFORTS — Frisch & Rosenblum, 2014 | נורמות: Frisch & Rosenblum, 2024 | ציון החתך נקבע 1.5 סטיות תקן מתחת לממוצע של קבוצת הגיל | פריטים 10 ו-11 אינם נכללים בחישוב התפקודים הניהוליים
  </div>
</body>
</html>`;

    // Open a clean print window — user saves as PDF via browser print dialog.
    // Item 10: a popup blocker makes window.open() return null; without
    // this guard the next line throws and the catch below shows a raw
    // "Cannot read properties of null" instead of a message she can act on.
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert('הדפדפן חסם את חלון ההדפסה. יש לאפשר חלונות קופצים לאתר זה ולנסות שוב.');
      btn.disabled = false;
      btn.textContent = 'שמור כ-PDF';
      return;
    }
    printWindow.document.open();
    printWindow.document.write(printHtml);
    printWindow.document.close();

    // Wait for fonts to load, then trigger print
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 600);
  } catch (e) {
    alert('שגיאה ביצירת PDF: ' + e.message);
  }

  btn.disabled = false;
  btn.textContent = 'שמור כ-PDF';
}

function toggleDrill(id) {
  const el = document.getElementById('drill_' + id);
  const arrow = document.getElementById('arrow_' + id);
  if (!el) return;
  if (el.style.display === 'block') {
    el.style.display = 'none';
    if (arrow) arrow.innerHTML = '&#9660;';
  } else {
    el.style.display = 'block';
    if (arrow) arrow.innerHTML = '&#9650;';
  }
}

function avg(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// R-01 (TM-spec §A-11): one gender/patient-noun source, used everywhere a
// "—"/"נקבה" fallback used to hide an unset sex.
function genderText(raw) {
  return raw === 'male' ? 'זכר' : raw === 'female' ? 'נקבה' : 'מין לא צוין';
}
function patientNoun(raw) {
  return raw === 'male' ? 'מטופל' : raw === 'female' ? 'מטופלת' : 'מטופל/ת';
}

function showWarning(msg) {
  const w = document.getElementById('warning');
  w.textContent = msg;
  w.style.display = 'block';
  w.scrollIntoView({ behavior: 'smooth' });
}
function hideWarning() {
  document.getElementById('warning').style.display = 'none';
}

function goBack() {
  document.getElementById('results').style.display = 'none';
  document.getElementById('formSection').style.display = 'block';
  document.getElementById('progressWrap').style.display = '';
  document.getElementById('questionnaire').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetForm() {
  if (!confirm('לאפס את כל התשובות ולהתחיל שאלון חדש? הנתונים השמורים בדפדפן זה יימחקו.')) return;
  localStorage.removeItem('eforts_save');
  document.querySelectorAll('input[type="radio"]').forEach((r) => (r.checked = false));
  document.getElementById('anonId').value = '';
  document.getElementById('childGender').value = '';
  document.getElementById('birthDay').value = '';
  document.getElementById('birthMonth').value = '';
  document.getElementById('birthYear').value = '';
  clearAgeDisplay();
  setFillDateToToday();
  ['morning', 'play', 'social'].forEach((k) => {
    const el = document.getElementById('companion_' + k);
    if (el) el.value = '';
  });
  document.getElementById('results').style.display = 'none';
  document.getElementById('formSection').style.display = 'block';
  document.getElementById('progressWrap').style.display = '';
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== IMPORT PARENT ANSWERS (PF2) =====
// Decodes an EFORTS1 code from parent.html (sex + dob + date + with + 30
// answers — see eforts-code.js's header comment; there is no anonymous
// id in the format, AMENDED 2026-09-28 12:31) and fills this form. The
// therapist types the anonymous number herself: import never touches
// #anonId, and calculate() is never called automatically (dob here is
// the parent's real answer, not an estimate that needs correcting).

let importPreviewData = null;

function importErrorText(code, params) {
  const p = params || {};
  switch (code) {
    case 'E0':
      return 'לא הודבק טקסט.';
    case 'E1':
      return 'לא נמצא קוד תשובות. העתק/י את כל שורת הקוד שבתחתית ה-PDF.';
    case 'E2':
      return `הקוד נוצר בגרסה אחרת של טופס ההורים (${p.found}) ולא ניתן לייבא אותו כאן.`;
    case 'E3':
      return 'הקוד השתנה או נקטע בדרך. נסה/י להעתיק שוב, או בקש/י מההורים לשלוח שוב את הקובץ.';
    case 'E4':
      return `חסר שדה בקוד, או ששדה לא במקומו: ${p.key}.`;
    case 'E5':
      return `ערך לא תקין בשדה מין: "${p.v}".`;
    case 'E6':
      return `בקוד יש ${p.n} תשובות במקום 30.`;
    case 'E7':
      return `תשובה לא תקינה לשאלה ${p.num}: "${p.v}" (מותר 1 עד 5).`;
    case 'E8':
      // The pinned E8 text in PF-spec §H.3 covers an "age Y;M" field that
      // no longer exists (AMENDED 2026-09-28: dob replaces age). E8 is now
      // the codec's invalid-date-of-birth error, so the message names dob.
      return `תאריך לידה לא תקין: "${p.v}".`;
    case 'E9':
      return `תאריך מילוי לא תקין: "${p.v}".`;
    case 'E10':
      return `תאריך המילוי (${p.v}) ישן מדי — הטופס תומך עד 3 שנים אחורה.`;
    case 'E12':
      return `ערך לא תקין בשדה "מי נמצא עם הילד": "${p.v}".`;
    case 'E13':
      return 'נמצאו כמה קודים שונים. הדביק/י קוד אחד בכל פעם.';
    case 'F1':
      return 'הקובץ גדול מדי — זה לא קובץ תשובות של טופס ההורים.';
    case 'F2':
      return 'לא הצלחנו לקרוא את הקובץ.';
    case 'F3':
      return 'לא נמצא קוד בקובץ. פתח/י את ה-PDF, העתק/י את שורת הקוד שבתחתית העמוד והדבק/י אותה כאן.';
    default:
      return 'שגיאה לא צפויה בקריאת הקוד.';
  }
}

// Same years/months arithmetic as updateAge() above, duplicated (not
// called) so the import preview can show age before anything is written
// to the birth-date fields.
function computeAgeYM(dobStr, dateStr) {
  const birth = new Date(dobStr);
  const fill = new Date(dateStr);
  let years = fill.getFullYear() - birth.getFullYear();
  let months = fill.getMonth() - birth.getMonth();
  if (fill.getDate() < birth.getDate()) months--;
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months };
}

// Age-band boundaries in total months: 3y0m, 6y0m, 8y0m, 12y0m (the
// instrument's own cutoffs, cutoffs const above / updateAge()'s
// totalYears thresholds). "Near" = within 1 month either side.
const AGE_BAND_EDGE_MONTHS = [36, 72, 96, 144];
function isNearAgeBandEdge(years, months) {
  const total = years * 12 + months;
  return AGE_BAND_EDGE_MONTHS.some((edge) => Math.abs(total - edge) <= 1);
}

function importFillDateOutOfRange(dateStr) {
  const y = Number(dateStr.slice(0, 4));
  const currentYear = new Date().getFullYear();
  return y < currentYear - 3 || y > currentYear;
}

function withLabel(code) {
  if (!code) return '—';
  const opt = COMPANION.options.find((o) => o.value === code);
  return opt ? opt.label : '—';
}

function clearImportPanel() {
  const status = document.getElementById('importStatus');
  status.textContent = '';
  status.className = 'import-status';
  document.getElementById('importEdge').hidden = true;
  document.getElementById('importPreview').hidden = true;
}

function showImportError(code, params) {
  const status = document.getElementById('importStatus');
  status.className = 'import-status err';
  status.textContent = importErrorText(code, params);
  document.getElementById('importEdge').hidden = true;
  document.getElementById('importPreview').hidden = true;
  importPreviewData = null;
}

function buildImportPreview(data) {
  const list = document.getElementById('importPreviewList');
  list.textContent = '';
  const { years, months } = computeAgeYM(data.dob, data.date);
  const [fy, fm, fd] = data.date.split('-');
  const rows = [
    ['מין', data.sex === 'male' ? 'זכר' : 'נקבה'],
    ['גיל לפי ההורה', `${years} שנים, ${months} חודשים`],
    ['תאריך מילוי', `${fd}/${fm}/${fy}`],
    [
      'מי נמצא עם הילד',
      `בוקר וערב: ${withLabel(data.with.morning)} · משחק ופנאי: ${withLabel(data.with.play)} · חברתית: ${withLabel(data.with.social)}`,
    ],
    ['תשובות', `${data.answers.length} מתוך 30`],
  ];
  rows.forEach(([dt, dd]) => {
    const dtEl = document.createElement('dt');
    dtEl.textContent = dt;
    const ddEl = document.createElement('dd');
    ddEl.textContent = dd;
    list.appendChild(dtEl);
    list.appendChild(ddEl);
  });
}

function importParentAnswers(text) {
  clearImportPanel();
  const result = EFORTSCode.decode(text);
  if (!result.ok) {
    showImportError(result.error, result.params);
    return;
  }
  if (importFillDateOutOfRange(result.data.date)) {
    showImportError('E10', { v: result.data.date });
    return;
  }
  importPreviewData = result.data;
  buildImportPreview(result.data);
  document.getElementById('importPreview').hidden = false;
}

function isClinicianFormDirty() {
  const anyRadio = document.querySelector('#questionnaire input[type="radio"]:checked');
  const anonId = getAnonId();
  const gender = document.getElementById('childGender').value;
  const birthDate = getBirthDateValue();
  return !!anyRadio || !!anonId || !!gender || !!birthDate;
}

function applyImportedAnswers() {
  if (!importPreviewData) return;
  if (isClinicianFormDirty()) {
    if (!confirm('הטופס כבר מכיל נתונים. הייבוא יחליף אותם. להמשיך?')) return;
  }
  const data = importPreviewData;

  document.querySelectorAll('#questionnaire input[type="radio"]').forEach((r) => {
    r.checked = false;
  });

  document.getElementById('childGender').value = data.sex;
  setFillDateValue(data.date);
  setBirthDateValue(data.dob);
  ['morning', 'play', 'social'].forEach((k) => {
    const el = document.getElementById('companion_' + k);
    if (el) el.value = data.with[k] || '';
  });
  data.answers.forEach((val, i) => {
    const radio = document.getElementById(`q${i + 1}_${val}`);
    if (radio) radio.checked = true;
  });

  updateAge();
  updateProgress();
  saveForm();

  const { years, months } = computeAgeYM(data.dob, data.date);
  const status = document.getElementById('importStatus');
  status.className = 'import-status ok';
  status.textContent = 'התשובות הוזנו. הקלד/י מספר אנונימי ולחצ/י על "חשב ציונים".';

  const edge = document.getElementById('importEdge');
  if (isNearAgeBandEdge(years, months)) {
    edge.hidden = false;
    edge.textContent =
      'שים/י לב: הגיל קרוב לגבול בין קבוצות גיל, ולכן תאריך הלידה המדויק קובע את ציוני החתך.';
  } else {
    edge.hidden = true;
  }

  document.getElementById('importPreview').hidden = true;
  document.getElementById('importCode').value = '';
  importPreviewData = null;

  const anonField = document.getElementById('anonId');
  anonField.scrollIntoView({ behavior: 'smooth', block: 'center' });
  anonField.focus();
}

// ----- PDF answers file -----
// The parent's PDF carries the whole code as one line of real text, so the
// code is found by scanning the file's bytes (read as latin1). A PDF written
// with compressed streams (other tools) is tried second: every Flate stream
// is inflated with the browser's own DecompressionStream and scanned too.
const PDF_CODE_RE = /EFORTS1\|[A-Za-z0-9=|,;:-]+/g;
const PDF_MAX_BYTES = 10 * 1024 * 1024;

function latin1(bytes) {
  let out = '';
  for (let i = 0; i < bytes.length; i += 8192) {
    out += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
  }
  return out;
}

async function inflateBytes(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function codesFromPdf(bytes) {
  const raw = latin1(bytes);
  const direct = raw.match(PDF_CODE_RE);
  if (direct) return direct;

  if (typeof DecompressionStream !== 'function') return [];
  const found = [];
  const streamRe = /obj\s*<<([\s\S]*?)>>\s*stream\r?\n/g;
  let m;
  while ((m = streamRe.exec(raw)) !== null) {
    if (!/\/FlateDecode/.test(m[1])) continue;
    const start = m.index + m[0].length;
    let end = raw.indexOf('endstream', start);
    if (end < 0) continue;
    // the end-of-line before "endstream" is not part of the data
    if (raw[end - 1] === '\n') end--;
    if (raw[end - 1] === '\r') end--;
    try {
      const inflated = latin1(await inflateBytes(bytes.subarray(start, end)));
      const hits = inflated.match(PDF_CODE_RE);
      if (hits) found.push(...hits);
    } catch {
      // not a valid Flate stream — skip it
    }
  }
  return found;
}

function looksLikePdf(file, bytes) {
  if (/\.pdf$/i.test(file.name || '') || file.type === 'application/pdf') return true;
  return bytes.length >= 4 && latin1(bytes.subarray(0, 4)) === '%PDF';
}

async function importFromPdf(file) {
  if (file.size > PDF_MAX_BYTES) {
    showImportError('F1', {});
    return;
  }
  let codes;
  try {
    codes = await codesFromPdf(new Uint8Array(await file.arrayBuffer()));
  } catch {
    showImportError('F2', {});
    return;
  }
  if (!codes.length) {
    showImportError('F3', {});
    return;
  }
  importParentAnswers(codes.join('\n'));
}

// One path for a chosen OR dropped answers file (PDF or .txt).
async function importFromFile(file) {
  if (!file) return;
  clearImportPanel();
  if (/\.pdf$/i.test(file.name || '') || file.type === 'application/pdf') {
    await importFromPdf(file);
    return;
  }
  // a PDF that lost its name/type: the first bytes still say %PDF
  try {
    const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
    if (looksLikePdf(file, head)) {
      await importFromPdf(file);
      return;
    }
  } catch {
    showImportError('F2', {});
    return;
  }
  if (file.size > 20000) {
    showImportError('F1', {});
    return;
  }
  let text;
  try {
    text = await file.text();
  } catch {
    showImportError('F2', {});
    return;
  }
  importParentAnswers(text);
}

// ===== SEND THE QUESTIONNAIRE TO PARENTS =====
// Two plain links: this page's parent link (parent.html: parents fill in, get a
// PDF, send it back however they like) and this page (upload the PDF below).
// The link is built from wherever this page is served (same folder +
// parent.html). Nothing is stored or sent from here.
const S_COPIED = 'הקישור הועתק ✓';
const S_COPY_FAIL = 'לא הצלחנו להעתיק אוטומטית. סמנ/י את הקישור שבשדה והעתיק/י אותו.';

function parentLink() {
  return new URL('parent.html', window.location.href).href;
}

function copyParentLink() {
  const link = parentLink();
  const status = document.getElementById('sendStatus');
  const ok = () => {
    status.className = 'import-status ok';
    status.textContent = S_COPIED;
  };
  const fallback = () => {
    const field = document.getElementById('sendLink');
    let done = false;
    try {
      field.select();
      done = document.execCommand('copy');
    } catch {
      done = false;
    }
    if (done) ok();
    else {
      status.className = 'import-status err';
      status.textContent = S_COPY_FAIL;
    }
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link).then(ok, fallback);
  } else {
    fallback();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('sendLink').value = parentLink();
  document.getElementById('sendCopy').addEventListener('click', copyParentLink);
});

document.addEventListener('DOMContentLoaded', () => {
  const importCodeBtn = document.getElementById('importCodeBtn');
  const importFile = document.getElementById('importFile');
  const importCancel = document.getElementById('importCancel');
  const importApply = document.getElementById('importApply');

  importCodeBtn.addEventListener('click', () => {
    importParentAnswers(document.getElementById('importCode').value);
  });

  // Pasting goes straight to the preview — no need to press the check button.
  const importCode = document.getElementById('importCode');
  importCode.addEventListener('paste', () => {
    setTimeout(() => importParentAnswers(importCode.value), 0);
  });

  importFile.addEventListener('change', () => {
    const file = importFile.files && importFile.files[0];
    importFile.value = '';
    importFromFile(file);
  });

  // Drag-and-drop: a .txt dropped anywhere on the box takes the same path as
  // the file input.
  const importBox = document.getElementById('importBox');
  importBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    importBox.classList.add('drag-over');
  });
  importBox.addEventListener('dragleave', (e) => {
    if (!importBox.contains(e.relatedTarget)) importBox.classList.remove('drag-over');
  });
  importBox.addEventListener('drop', (e) => {
    e.preventDefault();
    importBox.classList.remove('drag-over');
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    importFromFile(file);
  });

  importCancel.addEventListener('click', () => {
    clearImportPanel();
    importPreviewData = null;
  });

  importApply.addEventListener('click', applyImportedAnswers);
});
