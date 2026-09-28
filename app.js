// ===== DATA =====
const items = [
  {
    num: 1,
    text: 'מתחיל ביוזמתו לבצע פעילויות בבוקר כמו התלבשות או צחצוח שיניים',
    routine: 'morning',
    ef: 'wm',
  },
  {
    num: 2,
    text: 'מצליח להתמיד בפעילות הבוקר בקצב מתאים, ללא צורך בתזכורת של מבוגר',
    routine: 'morning',
    ef: 'wm',
  },
  {
    num: 3,
    text: 'זוכר את רצף הפעילויות שצריך לעשות בבוקר לפי סדרן',
    routine: 'morning',
    ef: 'wm',
  },
  {
    num: 4,
    text: 'מתארגן בבוקר בהתאם לכללי הבית. לדוגמה, שוטף ידיים אחר השירותים, מניח את הפיג׳מה על מיטתו או מסיר צלחת מהשולחן',
    routine: 'morning',
    ef: 'wm',
  },
  {
    num: 5,
    text: 'פותר בעיות שמתעוררות במהלך ביצוע פעילויות הבוקר. לדוגמה, מחפש בעצמו חפצים חיוניים כשהוא לא מוצא אותם',
    routine: 'morning',
    ef: 'flex',
  },
  {
    num: 6,
    text: 'מבצע רק פעילויות שמקדמות את ההתלבשות וההכנה ליציאה מהבית ונמנע מעיסוק בדברים אחרים שרואה או שומע ושאינם קשורים לכך. לדוגמה, מצליח להתעלם מטלוויזיה שדלוקה בחדר אחר',
    routine: 'morning',
    ef: 'inh',
  },
  {
    num: 7,
    text: 'מקפיד על איכות הביצוע של הפעילויות. לדוגמה, בודק שהוא לקח את הכריך שלו ולא של מישהו אחר מבני הבית או שהבגדים שהוא לובש אינם הפוכים',
    routine: 'morning',
    ef: 'wm',
  },
  {
    num: 8,
    text: 'נוטה לסיים פעילויות מבלי להפסיקן באמצע ולעבור לפעילויות אחרות',
    routine: 'morning',
    ef: 'inh',
  },
  {
    num: 9,
    text: 'מתחיל בביצוע פעילויות הערב ביוזמתו. לדוגמה, יוזם לבישת פיג׳מה',
    routine: 'morning',
    ef: 'wm',
  },
  {
    num: 10,
    text: 'מצליח להתמיד בפעילויות הערב בקצב מתאים, ללא צורך בתזכורת של מבוגר',
    routine: 'morning',
    ef: null,
  },
  {
    num: 11,
    text: 'זוכר את רצף הפעילויות שצריך לעשות בערב לפי סדרן',
    routine: 'morning',
    ef: null,
  },
  {
    num: 12,
    text: 'מתארגן בערב בהתאם לכללי הבית. לדוגמה, מסייע בפינוי השולחן או מניח הבגדים שלבש במקום מתאים',
    routine: 'morning',
    ef: 'wm',
  },
  {
    num: 13,
    text: 'פותר בעיות שמתעוררות במהלך ביצוע פעילויות הערב. לדוגמה, כשחסר לו סכו״ם בארוחה, כשמונחים חפצים על המיטה שלו או כשהפיג׳מה שלו בכביסה',
    routine: 'morning',
    ef: 'flex',
  },
  {
    num: 14,
    text: 'מבצע רק פעילויות שמקדמות את ההכנה לשינה ונמנע מעיסוק בדברים אחרים שהוא רואה או שומע ושאינם קשורים לכך. לדוגמה, מצליח להתעלם מטלוויזיה שפועלת ברקע',
    routine: 'morning',
    ef: 'inh',
  },
  {
    num: 15,
    text: 'מתייחס לאיכות הביצוע של פעילויות. לדוגמה, בודק שהפיג׳מה שהוא לובש אינה הפוכה',
    routine: 'morning',
    ef: 'flex',
  },
  {
    num: 16,
    text: 'נוטה לסיים פעילויות מבלי להפסיקן באמצע ולעבור לפעילויות אחרות',
    routine: 'morning',
    ef: 'inh',
  },
  {
    num: 17,
    text: 'מתחיל לבצע את הפעילויות ביוזמתו. לדוגמה, בוחר משחק',
    routine: 'play',
    ef: 'flex',
  },
  { num: 18, text: 'מצליח לשחק בקצב מתאים (לא מהיר או איטי מדי)', routine: 'play', ef: 'wm' },
  { num: 19, text: 'משחק לפי שלבי המשחק ובסדר המתאים', routine: 'play', ef: 'wm' },
  { num: 20, text: 'משחק בהתאם לכללי המשחק. לדוגמה, מחכה לתורו', routine: 'play', ef: 'wm' },
  {
    num: 21,
    text: 'בזמן שהוא משחק במשחק ספציפי הוא מבצע רק פעילויות שקשורות אליו ונמנע מלהסתובב בחדר או לגעת במשחקים אחרים',
    routine: 'play',
    ef: 'flex',
  },
  {
    num: 22,
    text: 'עוצר לחשוב לפני שמשחק. לדוגמה, במשחק בנייה הוא מדמיין איך ייראה מה שרוצה להרכיב או בוחר מראש דגם מסוים, ובציור הוא מתכנן מראש מה ירצה לצייר ואז מתחיל לצייר',
    routine: 'play',
    ef: 'flex',
  },
  { num: 23, text: 'מסיים משחק אחד לפני שהוא עובר למשחק אחר', routine: 'play', ef: 'inh' },
  {
    num: 24,
    text: 'יוזם אינטראקציה חברתית. לדוגמה, מזמין חבר הביתה',
    routine: 'social',
    ef: 'flex',
  },
  {
    num: 25,
    text: 'לומד מהתנסות חברתית שלילית. לדוגמה, כאשר עושה משהו מכעיס ומקבל התגובה שלילית, הוא יימנע מלחזור על המעשה',
    routine: 'social',
    ef: 'wm',
  },
  {
    num: 26,
    text: 'נמנע מהבעה מוגזמת של כעס או תסכול בזמן משחק עם חברים',
    routine: 'social',
    ef: 'inh',
  },
  {
    num: 27,
    text: 'משתתף במשחק חברתי בהתאם לכללי המשחק המקובלים או אלה שקבעה הקבוצה. לדוגמה, במשחק כדור',
    routine: 'social',
    ef: 'wm',
  },
  {
    num: 28,
    text: 'פותר בעיות שמתעוררות במשחק חברתי. לדוגמה, כשיש אי-הסכמה',
    routine: 'social',
    ef: 'flex',
  },
  {
    num: 29,
    text: 'כאשר מתרחש עימות עם חבר, חושב על מספר תגובות אפשריות לפני שהוא מגיב. לדוגמה, להגיד שלא נעים לו או לקרוא לעזרה',
    routine: 'social',
    ef: 'inh',
  },
  {
    num: 30,
    text: 'חושב על התגובות שלו כאשר הוא מתייחס למעשי חבריו',
    routine: 'social',
    ef: 'inh',
  },
];

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

// ===== BUILD FORM =====
function buildForm() {
  const container = document.getElementById('questionnaire');
  const routines = [
    {
      key: 'morning',
      title: 'שגרות בוקר וערב',
      instruction: 'בהקשר לשגרת הבוקר והערב, נא ציינ/י באיזו מידה ילדך:',
      range: [1, 16],
    },
    {
      key: 'play',
      title: 'שגרות משחק ופנאי',
      instruction: 'בזמנים של משחק עצמאי ופנאי, נא ציינ/י באיזו מידה ילדך:',
      range: [17, 23],
    },
    {
      key: 'social',
      title: 'שגרה חברתית',
      instruction: 'בהקשר לתפקוד החברתי, נא ציינ/י באיזו מידה ילדך:',
      range: [24, 30],
    },
  ];

  const scaleLabels = ['אף\nפעם', 'לעיתים\nרחוקות', 'לפעמים', 'לעיתים\nקרובות', 'תמיד'];

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
  document.getElementById('progressText').textContent = `${answered} / ${items.length}`;
}

// ===== AGE =====
function updateAge() {
  const birthInput = getBirthDateValue();
  const fillInput = getFillDateValue();
  if (!birthInput || !fillInput) return;

  const birth = new Date(birthInput);
  const fill = new Date(fillInput);
  if (birth >= fill) return;

  let years = fill.getFullYear() - birth.getFullYear();
  let months = fill.getMonth() - birth.getMonth();
  if (fill.getDate() < birth.getDate()) months--;
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalYears = years + months / 12;
  const ageEl = document.getElementById('calcAge');
  const monthsText = months === 0 ? '' : months === 1 ? ' וחודש' : ` ו-${months} חודשים`;
  ageEl.textContent = `${years} שנים${monthsText}`;
  ageEl.className = 'computed';

  const ageGroupEl = document.getElementById('ageGroup');
  const ageGroupDisplay = document.getElementById('ageGroupDisplay');

  if (totalYears >= 3 && totalYears < 6) {
    ageGroupEl.value = '3-5';
    ageGroupDisplay.textContent = '3.0 — 5.11';
    ageGroupDisplay.className = 'computed valid';
  } else if (totalYears >= 6 && totalYears < 8) {
    ageGroupEl.value = '6-7';
    ageGroupDisplay.textContent = '6.0 — 7.11';
    ageGroupDisplay.className = 'computed valid';
  } else if (totalYears >= 8 && totalYears < 12) {
    ageGroupEl.value = '8-11';
    ageGroupDisplay.textContent = '8.0 — 11.11';
    ageGroupDisplay.className = 'computed valid';
  } else {
    ageGroupEl.value = '';
    ageGroupDisplay.textContent = 'מחוץ לטווח הגילים של השאלון (3.0–11.11)';
    ageGroupDisplay.className = 'computed invalid';
  }
}

// ===== SAVE / LOAD =====
function saveForm() {
  const data = {
    anonId: document.getElementById('anonId').value,
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
  if (!document.getElementById('anonId').value.trim()) {
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

  const anonId = document.getElementById('anonId').value || '—';
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

  // Hide form, show results
  document.getElementById('formSection').style.display = 'none';

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `
    <div class="results-header">
      <h2>תוצאות שאלון EFORTS</h2>
      <div class="results-meta">${patientNoun(genderRaw)} מס' ${anonId} | ${gender} | ${ageText} | קבוצת גיל: ${ageLabel}</div>
      <div class="results-hint">לחצ/י על כל שורה כדי לראות פירוט הפריטים</div>
      <div class="score-legend" style="margin-top:12px;">
        <span class="score-legend-item"><span class="score-legend-dot" style="background:var(--green)"></span> בטווח הנורמה</span>
        <span style="margin:0 6px;">|</span>
        <span class="score-legend-item"><span class="score-legend-dot" style="background:var(--amber)"></span> קרוב לציון החתך (תפקודים ניהוליים)</span>
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
        <span style="font-size:0.82rem; color:#334155;">לשילוב ממצאי השאלון עם התמונה הקלינית מהמפגש: לחצ/י "הורד ל-AI", העל/י את הקובץ לכלי AI (Claude, ChatGPT, Copilot) ותאר/י לו מה נצפה. הכלי יכתוב רק את פסקת המטפל/ת, בלי לשנות ציונים או את הסיכום. אין להוסיף שם או ת״ז.</span>
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
        <span class="drill-badge weak">ציון 1–2: ${weak.length}</span>
        <span class="drill-badge mid">ציון 3: ${mid.length}</span>
        <span class="drill-badge strong">ציון 4–5: ${strong.length}</span>
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
    `${tipScope}, בסולם 1–5 (ציון גבוה = תפקוד טוב יותר).\n` +
    `ציון החתך לקבוצת הגיל: ${cutoff.toFixed(2)}\n` +
    `נמוך מציון החתך = ${tipBelow}.` +
    (type === 'ef' ? `\nקרוב לציון החתך = עד 0.15 מעליו.` : '');

  return `<div class="score-row ${hasDetails ? '' : 'no-drill'}" ${hasDetails ? `onclick="toggleDrill('${id}')"` : ''}>
    <div class="score-row-top">
      <div class="score-label">${label} ${hasDetails ? `<span class="arrow" id="arrow_${id}">&#9660;</span>` : ''}
        <span class="info-tip" tabindex="0" onclick="event.stopPropagation()">?<span class="tip-content">${scoreTip}</span></span>
      </div>
      <div class="score-value ${st.cls}">${score.toFixed(2)}</div>
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
    intro += `עולה קושי בניהול עצמאי של שגרות היום-יום ביחס לבני ${hisAge} (${got} ציון כולל ${fmt(d.totalAvg)} כאשר ציון החתך הוא ${fmt(d.c.total)}). התפקוד בשלוש השגרות (בוקר וערב, פנאי ומשחק ושגרה חברתית) נמוך מהמצופה ${g('לגילו', 'לגילה')}.`;
  } else if (totalBelow) {
    intro += `עולה קושי בניהול עצמאי של שגרות היום-יום ביחס לבני ${hisAge} (${got} ציון כולל ${fmt(d.totalAvg)} כאשר ציון החתך הוא ${fmt(d.c.total)}), בעיקר ${weakRoutines.map((r) => r.inName).join(' ו')}.`;
  } else if (weakRoutines.length > 0 || weakEFs.length > 0) {
    // canon F-4 / table row "Total in norm, profile weak": name "ציון כולל"
    // (not just the bare number) and LINK the weak routine to the EF behind
    // it ("נראה על רקע קושי ב...") instead of a flat comma list mixing
    // routines and EFs together.
    intro += `הציון הכולל הינו בתחום הנורמה (${got} ציון כולל ${fmt(d.totalAvg)} כאשר ציון החתך הוא ${fmt(d.c.total)}), אך מניתוח הפרופיל `;
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
    intro += `הניהול העצמאי של שגרות היום-יום תקין ביחס לבני ${hisAge} (ציון כולל ${fmt(d.totalAvg)}, ציון חתך ${fmt(d.c.total)}).`;
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

    weakRoutines.forEach((r, idx) => {
      const rItems = items.filter((i) => i.routine === r.key);
      const rWeak = rItems
        .filter((i) => d.scores[i.num] <= 2)
        .sort((a, b) => d.scores[a.num] - d.scores[b.num]);
      const rStrong = rItems.filter((i) => d.scores[i.num] >= 4);

      let p;
      if (mergedFirstWeakPrefix && idx === 0) {
        p = `${mergedFirstWeakPrefix}נמוך מציון החתך (${got} ציון ${fmt(r.score)} כאשר ציון החתך הוא ${fmt(r.cutoff)}). `;
      } else {
        // canon rule 13 / 0b#5: "באופן משמעותי" only at a gap >= 0.50, and
        // it's never required; otherwise plain. "במעט" is never correct —
        // Carmit wrote plain at a 0.14 gap in both her model cases.
        const gap = r.cutoff - r.score;
        const severity =
          gap >= 0.5
            ? `הציון מורה על תפקוד נמוך באופן משמעותי מהמצופה ${g('לגילו', 'לגילה')}`
            : `הציון נמוך מציון החתך`;
        p = `${r.inName} ${severity} (${got} ציון ${fmt(r.score)} כאשר ציון החתך הוא ${fmt(r.cutoff)}). `;
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
              ? `גם כאן נראה כי הקושי התפקודי קשור לקושי ב${efNames[ef]}, כמו למשל — ${examples}.`
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
          attribution = `נראה כי הקושי התפקודי מושפע מקושי ב${efNames[ef]}, כמו למשל — ${examples}.`;
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
          attribution = `נראה כי הקושי התפקודי נובע לרוב מקושי ב${efNames[ef1]} כמו למשל ${ex1}, ולעיתים על רקע קושי ב${efNames[ef2]}, כפי שמתבטא בכך ש${g('הוא', 'היא')} ${ex2}.`;
        } else {
          // canon rule 16: two EFs both below their own cutoffs share equal
          // weight — no "בעיקר" on the first.
          attribution = `נראה כי הקושי התפקודי מושפע מקושי ב${efNames[ef1]}, כמו למשל — ${ex1}, וכן מקושי ב${efNames[ef2]}, שמתבטא בין השאר בכך ש-${anonId} ${ex2}.`;
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
        const sPhrases = eligibleStrong.slice(0, 3).map((i) => strengthPhrase[i.num]);
        // FX1-r2 fix 3: frame the strength through its EF, Carmit's C50
        // form ("בתחום זה נראה כי היכולת שלו בתחום ה[EF] באה לידי ביטוי,
        // והוא [strength] וכן [strength]") — generalized to any strength
        // set that shares a single EF, not just flexibility/play. Each
        // strengthPhrase entry already carries its own gendered verb, so no
        // separate lead verb is needed; a mixed-EF strength set (no model
        // case) falls back to the old EF-agnostic phrasing.
        const strongEfKeys = [
          ...new Set(
            eligibleStrong
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
    let efPara = 'בהסתכלות על תפקודים ניהוליים ספציפיים, ';
    if (weakEFs.length > 0) {
      efPara += `הקושי הבולט הינו ב${weakEFs.map((e) => `${e.label} (${got} ציון ${fmt(e.score)} כאשר ציון החתך הוא ${fmt(e.cutoff)})`).join(' וב')}`;
      // FX1-r2 fix 4 (canon B5 MUST, §F 9): state each below-cutoff EF's
      // status in WORDS, not only numbers — keep the numbers as they are
      // above. Singular for one weak EF (Carmit's own C32 words); pluralized
      // the same way when more than one EF is below cutoff.
      efPara +=
        weakEFs.length === 1
          ? `; ואכן הציון בתפקוד זה נמוך מציון החתך`
          : `; ואכן הציונים בתפקודים אלו נמוכים מציון החתך`;
      if (okEFs.length > 0) {
        const okDesc = okEFs.map((e) =>
          e.score - e.cutoff < 0.15
            ? `${e.label} — ציון קרוב לציון החתך`
            : `${e.label} — ציון גבוה מציון החתך`,
        );
        efPara += `; בתפקודים האחרים: ${okDesc.join(', ')}`;
      }
      efPara += '.';
    } else {
      efPara += `כל התפקודים הניהוליים בטווח התקין (עכבה ${fmt(d.inhAvg)}, זיכרון עבודה ${fmt(d.wmAvg)}, גמישות מחשבתית ${fmt(d.flexAvg)}). ייתכן שהקושי בשגרות נובע מגורמים סביבתיים, חווייתיים או הרגלים — ולא מקושי בתפקודים הניהוליים עצמם.`;
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
    rec += '. ';
    if (strongItemsAll.length >= 2) {
      // canon D "Strengths" part: motivation + small successes + recruiting
      // strengths from an easier routine toward the harder ones, named with
      // the anonymous number — never "הילד" (rule 25).
      const strengthRoutines = okRoutines.map((r) => r.inName).join(' ו');
      rec += `כמו כן מומלץ לשים דגש על גיוס מוטיבציה של ${anonId}, איסוף חוויות של הצלחה גם אם קטנות, וגיוס ${g('כוחותיו', 'כוחותיה')} המתבטאים ${strengthRoutines || 'במשימות אחרות'} אל המשימות שקשות ${g('לו', 'לה')} יותר.`;
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

3. תוספת לפסקת "מומלץ", רק אם המטפל/ת ביקש/ה: חצי משפט שמתחבר לסוף הפסקה הקיימת, רק ממה שעלה במפגש (לדוגמה "ויתכן גם ויסות רגשי", כשזה עלה בטיפול ולא מהשאלון). בלי מספר טיפולים, תדירות, שמות פרוטוקולים, הפניות או אבחנות.

4. לא להמציא. כל משפט נשען על הקובץ הזה או על מה שהמטפל/ת כתב/ה בשיחה. אף משפט לא סותר ציון של פריט או משפט אחר בסיכום. מוטיבציה, ביטחון עצמי, ויסות רגשי וקשב נכתבים רק אם המטפל/ת מסר/ה אותם.

5. קול ושפה, כמו בסיכום:
- גוף שלישי. פעלים רכים: "מתקשה ל…", "זקוק ל…", "מוסח מ…", "עולה קושי ב…", "נראה כי", "יתכן", "על רקע", "ככל הנראה".
- בלי שרשראות שלילה ("לא עושה, לא זוכר") ובלי ניגוד מהסוג "לא X אלא Y".
- בלי תוויות אבחנתיות או תכונתיות ("אימפולסיבי", ADHD, "קשב" כאבחנה). מתארים התנהגות: פזיזות, מוסחות, קושי בעכבה.
- "איחור" או "עיכוב" לעולם אינם קביעה כללית; קושי נכתב תמיד בתחום שלו.
- כינוי למטופל/ת: כינוי גוף ("הוא", "היא"), או המספר האנונימי (${anonIdText}) לכל היותר פעם אחת בפסקה. לעולם לא "הילד" או "הילדה", לעולם לא שם או ת״ז, ואין לבקש אותם.
- מין: ${gender}. התאמת מין בכל פועל, כינוי וסיומת. אם המין לא צוין, שאל לפני שאתה כותב.
- עברית בלבד. המילה הלועזית היחידה: EFORTS.

6. מונחים, בדיוק כך: עכבה · זיכרון עבודה · גמישות מחשבתית · תפקודים ניהוליים · ציון החתך · ציון כולל · בטווח הנורמה · שגרת בוקר וערב · שגרת פנאי ומשחק · השגרה החברתית · שגרות היום-יום. לא: "סף", "נקודת חתך", "פונקציות ניהוליות", "תקין לגמרי".

7. מספרים ופריטים. ציון נכתב בצורה "(קיבל/ה ציון X כאשר ציון החתך הוא Y)", שתי ספרות אחרי הנקודה, בדיוק כפי שהוא מופיע למעלה. בלי ממוצעים, סטיות תקן, אחוזונים, "מתחת לממוצע", ובלי מילות התשובה ("לפעמים", "לעיתים רחוקות"). פריט נכתב "פריט N"; שני פריטים: "(פריט N ופריט M)".

8. תפקודים ניהוליים. תפקוד ניהולי שציונו נמוך מציון החתך הוא ההסבר העיקרי לקושי. תפקוד שציונו "קרוב לציון החתך" (עד 0.15 מעליו) יכול להסביר קושי רק כגורם משני ("ולעיתים על רקע קושי ב…"). תפקוד שציונו גבוה מציון החתך ביותר מ-0.15 אינו מסביר קושי; הוא יכול להופיע רק כחוזקה. פריטים 10 ו-11 אינם ראיה לאף תפקוד ניהולי.

9. פורמט. טקסט רגיל בלבד: בלי כוכביות, בלי כותרות ובלי תבליטים, כי הטקסט מודבק למערכת שמוחקת עיצוב. החזר רק את הפסקה המבוקשת, ולפניה שורה אחת שאומרת איפה היא נכנסת.

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
  const anonIdText = document.getElementById('anonId').value || '—';
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
    `    ${label}: ${sc.toFixed(2)} | ציון החתך: ${ct.toFixed(2)} | ${cutoffStatus(sc, ct, kind).text}\n`;
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
  const anonId = document.getElementById('anonId').value || 'eforts';
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
    // Gather all data from the current results
    const anonId = document.getElementById('anonId').value || '—';
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
    const PRINT_COLOR = { warn: '#c0392b', mid: '#d35400', ok: '#27ae60' };
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
        <td style="padding:4px 10px;text-align:center;color:${levelColor(r.sc, r.ct, r.kind)};font-weight:700;">${r.sc.toFixed(2)}</td>
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

    const nItems = (n) => (n === 1 ? 'פריט אחד' : `${n} פריטים`);

    // Strip HTML tags from summary for clean text
    const summaryText = summaryHtmlToText(summaryHtml);

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
  .print-header-authors { font-size: 13px; font-weight: 700; color: #1a202c; margin-top: 4px; }
  .print-header-lab { font-size: 10px; font-weight: 500; color: #64748b; margin-top: 1px; }
  .print-header-credit { font-size: 9px; font-weight: 300; color: #94a3b8; margin-top: 4px; line-height: 1.4; }
  .section-title { font-size: 14px; font-weight: 700; color: #0077b6; margin: 16px 0 8px; padding-bottom: 4px; border-bottom: 2px solid #0077b6; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  th { background: #f0f4f8; padding: 6px 10px; font-size: 11px; font-weight: 600; color: #444; text-align: center; border-bottom: 2px solid #ddd; }
  td { border-bottom: 1px solid #eee; }
  .summary-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 16px; font-size: 12px; line-height: 1.8; white-space: pre-line; }
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
    <div class="print-header-authors">כרמית פריש ופרופ' שרה רוזנבלום, אוניברסיטת חיפה</div>
    <div class="print-header-lab">המעבדה לתפקוד אנושי מורכב (CHAP), אוניברסיטת חיפה</div>
    <div class="print-header-credit">תהליך מחשוב השאלון בוצע ע"י אליסון אלט, מרפאה בעיסוק בשירותי בריאות כללית מחוז ירושלים, בתיאום ואישור המחברות.</div>
  </div>
  <h1>תוצאות שאלון EFORTS</h1>
  <div class="meta">${patientNoun(genderRaw)} מס' ${anonId} | ${gender} | ${ageText} | קבוצת גיל: ${ageLabel} | תאריך מילוי: ${fillDateText}</div>

  <div class="section-title">ציונים</div>
  <table>
    <tr><th style="text-align:right;">שגרה</th><th>ציון</th><th>ציון החתך</th><th>מצב</th></tr>
    ${buildScoreTable(scoreTableRows)}
    <tr><td colspan="4" style="padding:2px;border:none;"></td></tr>
    <tr><th style="text-align:right;">תפקוד ניהולי</th><th>ציון</th><th>ציון החתך</th><th>מצב</th></tr>
    ${buildScoreTable(efTableRows)}
  </table>

  <div class="section-title">סיכום קליני</div>
  <div class="summary-box">${summaryText}</div>

  <div class="section-title">פירוט הפריטים לפי ציון</div>
  <table>
    <tr><th style="width:30px;">#</th><th style="text-align:right;">פריט</th><th style="width:80px;">שגרה</th><th style="width:80px;">תפקוד ניהולי</th><th style="width:40px;">ציון</th><th style="width:70px;">תשובה</th></tr>
    ${weakItems.length > 0 ? `<tr><td colspan="6" class="group-header group-weak">ציון 1–2 (קושי) — ${nItems(weakItems.length)}</td></tr>` + buildItemRows(weakItems, '#fff5f5') : ''}
    ${midItems.length > 0 ? `<tr><td colspan="6" class="group-header group-mid">ציון 3 — ${nItems(midItems.length)}</td></tr>` + buildItemRows(midItems, '#fffbeb') : ''}
    ${strongItems.length > 0 ? `<tr><td colspan="6" class="group-header group-strong">ציון 4–5 (חוזקה) — ${nItems(strongItems.length)}</td></tr>` + buildItemRows(strongItems, '#f0fdf4') : ''}
  </table>

  <div class="footer">
    EFORTS — Frisch & Rosenblum, 2014 | נורמות: Frisch & Rosenblum, 2024 | ציון החתך = 1.5 סטיות תקן מתחת לממוצע של קבוצת הגיל | פריטים 10 ו-11 אינם נכללים בחישוב התפקודים הניהוליים
  </div>
</body>
</html>`;

    // Open a clean print window — user saves as PDF via browser print dialog
    const printWindow = window.open('', '_blank', 'width=800,height=900');
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
  document.getElementById('calcAge').textContent = '—';
  document.getElementById('calcAge').className = 'computed';
  document.getElementById('ageGroupDisplay').textContent = '—';
  document.getElementById('ageGroupDisplay').className = 'computed';
  document.getElementById('ageGroup').value = '';
  setFillDateToToday();
  ['morning', 'play', 'social'].forEach((k) => {
    const el = document.getElementById('companion_' + k);
    if (el) el.value = '';
  });
  document.getElementById('results').style.display = 'none';
  document.getElementById('formSection').style.display = 'block';
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
