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
    text: 'לומד מהתנסות חברתית שלילית. לדוגמה, כאשר עושה משהו מכעיס ומקבל תגובה שלילית, הוא יימנע מלחזור על המעשה',
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

const routineNames = { morning: 'בוקר וערב', play: 'פנאי ומשחק', social: 'שגרה חברתית' };
const efNames = { inh: 'עכבה', wm: 'זיכרון עבודה', flex: 'גמישות מחשבתית' };

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
            ? `<span class="ef-note">לא בסולמות ניהוליים</span>`
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
  ageEl.textContent = `${years} שנים, ${months} חודשים`;
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
    ageGroupDisplay.textContent = 'מחוץ לטווח הגילאים';
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
    showWarning('הגיל מחוץ לטווח (3-11) — לא ניתן לחשב ציונים');
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
  const gender = genderRaw === 'male' ? 'זכר' : genderRaw === 'female' ? 'נקבה' : '';
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
      <h2>תוצאות EFORTS</h2>
      <div class="results-meta">מזהה: ${anonId} | ${gender} | ${ageText} | קבוצת גיל: ${ageLabel}</div>
      <div class="results-hint">לחצ/י על כל שורה כדי לראות פירוט הפריטים</div>
      <div class="score-legend" style="margin-top:12px;">
        <span class="score-legend-item"><span class="score-legend-dot" style="background:var(--green)"></span> בטווח התקין</span>
        <span style="margin:0 6px;">|</span>
        <span class="score-legend-item"><span class="score-legend-dot" style="background:var(--amber)"></span> מתחת לממוצע</span>
        <span style="margin:0 6px;">|</span>
        <span class="score-legend-item"><span class="score-legend-dot" style="background:var(--red)"></span> מתחת לציון החתך</span>
        <span style="margin:0 6px;">|</span>
        <span>▌ = ציון חתך</span>
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
      <div class="score-group-title">סולמות תפקודים ניהוליים</div>
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
        <span style="font-size:0.82rem; color:#334155;">💡 לסיכום קליני מפורט יותר — ניתן להשתמש ב-Copilot במחשב העבודה או בכלי AI אחר</span>
      </div>
      <div class="summary-note">
        ציון חתך = 1.5 סטיות תקן מתחת לממוצע הנורמטיבי. ציון מתחת לחתך מעיד על חשד לעיכוב.
        <br>פריטים 10 ו-11 לא נכללים בחישוב הסולמות הניהוליים.
      </div>
    </div>

    <div class="result-actions">
      <button class="btn btn-pdf" onclick="printResults()">שמור כ-PDF</button>
      <button class="btn btn-back" onclick="goBack()">חזרה לשאלון</button>
      <button class="btn btn-danger" onclick="resetForm()">שאלון חדש</button>
    </div>
  `;

  resultsDiv.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scoreRow(id, label, score, cutoff, cardItems, scores, type) {
  const isOk = score >= cutoff;
  const cls = isOk ? 'ok' : 'warn';
  const statusText = isOk ? 'בטווח התקין' : 'מתחת לחתך';
  const hasDetails = cardItems.length > 0;
  const interp =
    score <= 2 ? 'קושי משמעותי' : score <= 3 ? 'מתחת לממוצע' : score <= 4 ? 'בטווח הממוצע' : 'חזק';
  const interpCls = score <= 2 ? 'warn' : score <= 3 ? 'mid' : 'ok';
  const gaugeCls = score <= 2 ? 'warn' : score <= 3 ? 'mid' : 'ok';

  // Gauge: score position on 1-5 scale
  const pct = ((score - 1) / 4) * 100;
  const cutoffPct = ((cutoff - 1) / 4) * 100;

  // Drilldown
  let drillHtml = '';
  if (hasDetails) {
    const efLabels = { inh: 'עכבה', wm: 'זיכרון עבודה', flex: 'גמישות מחשבתית' };
    const routineLabels = { morning: 'בוקר/ערב', play: 'פנאי/משחק', social: 'חברתית' };
    const sorted = [...cardItems].sort((a, b) => scores[a.num] - scores[b.num]);
    const weak = sorted.filter((i) => scores[i.num] <= 2);
    const mid = sorted.filter((i) => scores[i.num] === 3);
    const strong = sorted.filter((i) => scores[i.num] >= 4);

    drillHtml = `<div class="drilldown" id="drill_${id}">
      <div class="drill-summary">
        <span class="drill-badge weak">${weak.length} חלשים</span>
        <span class="drill-badge mid">${mid.length} בינוניים</span>
        <span class="drill-badge strong">${strong.length} חזקים</span>
      </div>`;

    sorted.forEach((item) => {
      const s = scores[item.num];
      const rowCls = s <= 2 ? 'weak' : s === 3 ? 'mid' : 'strong';
      const tag =
        type === 'routine' ? (item.ef ? efLabels[item.ef] : '—') : routineLabels[item.routine];
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

  const scoreTip = `ממוצע על סולם 1-5:\n1.0-2.0 = קושי משמעותי\n2.0-3.0 = מתחת לממוצע\n3.0-4.0 = בטווח הממוצע\n4.0-5.0 = חזק`;
  const cutoffTip = `ציון חתך = 1.5 סטיות תקן מתחת לממוצע הנורמטיבי לקבוצת הגיל.\nציון מתחת לחתך מעיד על חשד לעיכוב.`;

  return `<div class="score-row ${hasDetails ? '' : 'no-drill'}" ${hasDetails ? `onclick="toggleDrill('${id}')"` : ''}>
    <div class="score-row-top">
      <div class="score-label">${label} ${hasDetails ? `<span class="arrow" id="arrow_${id}">&#9660;</span>` : ''}
        <span class="info-tip" tabindex="0" onclick="event.stopPropagation()">?<span class="tip-content">${scoreTip}</span></span>
      </div>
      <div class="score-value ${cls}">${score.toFixed(2)}</div>
    </div>
    <div class="gauge">
      <div class="gauge-fill ${gaugeCls}" style="width:${pct}%"></div>
      <div class="gauge-cutoff" style="right:${cutoffPct}%" data-label="חתך ${cutoff.toFixed(2)}"></div>
    </div>
    <div class="score-meta">
      <span class="score-interp ${interpCls}">${interp}</span>
      <span class="score-status ${cls}">${statusText}</span>
    </div>
  </div>
  ${drillHtml}`;
}

function buildSummary(d) {
  const belowCutoff = (s, c) => s < c;
  const belowAvg = (s) => s <= 3;
  const m = d.isMale;
  const child = m ? 'הילד' : 'הילדה';
  const shows = m ? 'מציג' : 'מציגה';
  const hisAge = m ? 'גילו' : 'גילה';

  // Helper: format item references like (פריט 17, ציון 2 — לעיתים רחוקות)
  const scoreLabel = ['', 'אף פעם', 'לעיתים רחוקות', 'לפעמים', 'לעיתים קרובות', 'תמיד'];
  const ref = (nums) => {
    const matched = (Array.isArray(nums) ? nums : [nums]).filter((n) => d.scores[n] !== undefined);
    if (matched.length === 0) return '';
    return ' (' + matched.map((n) => `פריט ${n}: ${scoreLabel[d.scores[n]]}`).join('; ') + ')';
  };
  // Helper: get matching item numbers from a filtered list
  const matchNums = (itemList, filterNums) =>
    itemList.filter((i) => filterNums.includes(i.num)).map((i) => i.num);

  const routineData = [
    { key: 'morning', label: 'בוקר וערב', score: d.morningAvg, cutoff: d.c.morning },
    { key: 'play', label: 'פנאי ומשחק', score: d.playAvg, cutoff: d.c.play },
    { key: 'social', label: 'שגרה חברתית', score: d.socialAvg, cutoff: d.c.social },
  ];
  const efData = [
    { key: 'wm', label: 'זיכרון עבודה', score: d.wmAvg, cutoff: d.c.wm },
    { key: 'inh', label: 'עכבה', score: d.inhAvg, cutoff: d.c.inh },
    { key: 'flex', label: 'גמישות מחשבתית', score: d.flexAvg, cutoff: d.c.flex },
  ];

  const weakRoutines = routineData.filter((r) => belowCutoff(r.score, r.cutoff));
  const okRoutines = routineData.filter((r) => !belowCutoff(r.score, r.cutoff));
  const weakEFs = efData.filter((e) => belowCutoff(e.score, e.cutoff));
  const okEFs = efData.filter((e) => !belowCutoff(e.score, e.cutoff));
  const totalBelow = belowCutoff(d.totalAvg, d.c.total);

  const wmBelow = belowCutoff(d.wmAvg, d.c.wm);
  const inhBelow = belowCutoff(d.inhAvg, d.c.inh);
  const flexBelow = belowCutoff(d.flexAvg, d.c.flex);

  // Helper: get items by score threshold
  const weakItems = (list) =>
    list.filter((i) => d.scores[i.num] <= 2).sort((a, b) => d.scores[a.num] - d.scores[b.num]);
  const strongItems = (list) => list.filter((i) => d.scores[i.num] >= 4);
  const midItems = (list) => list.filter((i) => d.scores[i.num] === 3);

  // Items by routine
  const morningItems = items.filter((i) => i.routine === 'morning');
  const playItems = items.filter((i) => i.routine === 'play');
  const socialItems = items.filter((i) => i.routine === 'social');

  // Count weak/strong per routine
  const morningWeak = weakItems(morningItems);
  const morningStrong = strongItems(morningItems);
  const socialWeak = weakItems(socialItems);
  const playWeak = weakItems(playItems);
  const playStrong = strongItems(playItems);

  // Interpret score level
  const levelText = (score, cutoff) => {
    if (score < cutoff) return 'מתחת לציון החתך';
    if (score <= 3) return 'מתחת לממוצע';
    return 'בטווח התקין';
  };

  let s = '';

  // =================================================================
  // BLOCK 1: תמונה כללית — reflects the REAL picture
  // =================================================================
  s += `<p style="font-weight:700; color:var(--primary); font-size:0.88rem; margin-bottom:6px;">תמונה כללית</p>`;
  s += `<p style="font-size:0.85rem; margin-bottom:14px;">`;
  s += `ע"פ דיווח ההורים בשאלון ה-EFORTS, `;

  if (totalBelow && weakRoutines.length >= 2) {
    // Total below + multiple weak routines = clear difficulty
    s += `${child} ${shows} קושי בניהול עצמאי של שגרות יום-יום ביחס לבני ${hisAge} (ציון כולל ${d.totalAvg.toFixed(2)}, חתך ${d.c.total.toFixed(2)}). `;
    s += `נמצאו קשיים ב${weakRoutines.map((r) => r.label).join(', ')}.`;
  } else if (totalBelow) {
    // Total below but only one weak routine
    s += `${child} ${shows} קושי בניהול עצמאי של שגרות יום-יום (ציון כולל ${d.totalAvg.toFixed(2)}, חתך ${d.c.total.toFixed(2)}), `;
    s += `בעיקר ב${weakRoutines.map((r) => r.label).join(' וב')}.`;
  } else if (weakRoutines.length > 0 || weakEFs.length > 0) {
    // Total OK but specific areas are weak = mixed picture
    s += `הציון הכולל בטווח התקין (${d.totalAvg.toFixed(2)}, חתך ${d.c.total.toFixed(2)}), אך הפרופיל מצביע על תמונה מעורבת — `;
    const weakAreas = [];
    if (weakRoutines.length > 0) weakAreas.push(...weakRoutines.map((r) => r.label));
    if (weakEFs.length > 0) weakAreas.push(...weakEFs.map((e) => e.label));
    s += `עם קשיים ב${weakAreas.join(', ')}.`;
  } else if (belowAvg(d.totalAvg) && midItems(items).length > 5) {
    // All technically OK but many "sometimes" items
    s += `הניהול העצמי תקין ביחס לבני ${hisAge} (ציון כולל ${d.totalAvg.toFixed(2)}, חתך ${d.c.total.toFixed(2)}), `;
    s += `אך ${midItems(items).length} פריטים דורגו "לפעמים" — רמה שגבולית ומצדיקה מעקב.`;
  } else {
    // All good
    s += `הניהול העצמי של שגרות יום-יום תקין ביחס לבני ${hisAge} (ציון כולל ${d.totalAvg.toFixed(2)}, חתך ${d.c.total.toFixed(2)}).`;
  }
  s += `</p>`;

  // =================================================================
  // BLOCK 2: פירוט לפי תחום — each area with score + clinical descriptions
  // =================================================================
  s += `<p style="font-weight:700; color:var(--primary); font-size:0.88rem; margin-bottom:6px;">פירוט לפי תחום</p>`;

  // --- Score table for all routines + EFs ---
  s += `<div style="font-size:0.83rem; margin-bottom:12px; line-height:1.7;">`;
  routineData.forEach((r) => {
    const lvl = levelText(r.score, r.cutoff);
    const isBad = r.score < r.cutoff;
    const clr = isBad ? '#c0392b' : r.score <= 3 ? '#d35400' : '#27ae60';
    s += `<div><strong>${r.label}:</strong> <span style="color:${clr}">${r.score.toFixed(2)}</span> (חתך ${r.cutoff.toFixed(2)}) — ${lvl}</div>`;
  });
  s += `<div style="margin-top:4px; border-top:1px solid #e0e0e0; padding-top:4px;">`;
  efData.forEach((e) => {
    const lvl = levelText(e.score, e.cutoff);
    const isBad = e.score < e.cutoff;
    const clr = isBad ? '#c0392b' : e.score <= 3 ? '#d35400' : '#27ae60';
    s += `<div><strong>${e.label}:</strong> <span style="color:${clr}">${e.score.toFixed(2)}</span> (חתך ${e.cutoff.toFixed(2)}) — ${lvl}</div>`;
  });
  s += `</div></div>`;

  // --- Narrative per weak area ---
  if (weakRoutines.length > 0 || weakEFs.length > 0) {
    // Morning/Evening
    const morningBelow = belowCutoff(d.morningAvg, d.c.morning);
    if (morningBelow) {
      s += `<p style="font-size:0.85rem; margin-bottom:10px;">`;
      s += `<strong>בוקר וערב:</strong> `;

      const difficulties = [];
      const initItems = morningWeak.filter((i) => [1, 9].includes(i.num));
      const seqItems = morningWeak.filter((i) => [3, 11].includes(i.num));
      const paceItems = morningWeak.filter((i) => [2, 10].includes(i.num));
      const rulesItems = morningWeak.filter((i) => [4, 12].includes(i.num));
      const qualityItems = morningWeak.filter((i) => [7, 15].includes(i.num));

      if (initItems.length > 0) {
        const when =
          initItems.length > 1
            ? 'בבוקר ובערב'
            : initItems[0].num <= 9 && initItems[0].num >= 1
              ? 'בבוקר'
              : 'בערב';
        difficulties.push(
          `לא ${m ? 'מתחיל' : 'מתחילה'} ${when} פעילויות ${m ? 'ביוזמתו' : 'ביוזמתה'} (כמו התלבשות, צחצוח שיניים, לבישת פיג׳מה)${ref(initItems.map((i) => i.num))}`,
        );
      }
      if (paceItems.length > 0) {
        difficulties.push(
          `${m ? 'צריך' : 'צריכה'} תזכורות חוזרות כדי לשמור על קצב${ref(paceItems.map((i) => i.num))}`,
        );
      }
      if (seqItems.length > 0) {
        difficulties.push(
          `לא ${m ? 'זוכר' : 'זוכרת'} את רצף הפעילויות (מה עושים קודם, מה אחר כך)${ref(seqItems.map((i) => i.num))}`,
        );
      }
      if (rulesItems.length > 0) {
        difficulties.push(
          `לא ${m ? 'מתארגן' : 'מתארגנת'} לפי כללי הבית (כמו שטיפת ידיים, פינוי צלחת, הנחת בגדים)${ref(rulesItems.map((i) => i.num))}`,
        );
      }
      if (qualityItems.length > 0) {
        difficulties.push(
          `לא ${m ? 'מקפיד' : 'מקפידה'} על איכות הביצוע (כמו בדיקה שהבגדים לא הפוכים)${ref(qualityItems.map((i) => i.num))}`,
        );
      }

      if (difficulties.length > 0) {
        s += difficulties.join('; ') + `. `;
      }

      // Strengths
      if (morningStrong.length > 0) {
        const strengths = [];
        if (morningStrong.some((i) => [8, 16].includes(i.num)))
          strengths.push(
            `${m ? 'מסיים' : 'מסיימת'} מה ש${m ? 'מתחיל' : 'מתחילה'}${ref(matchNums(morningStrong, [8, 16]))}`,
          );
        if (morningStrong.some((i) => [6, 14].includes(i.num)))
          strengths.push(
            `${m ? 'מצליח' : 'מצליחה'} להתעלם מגירויים מסיחים${ref(matchNums(morningStrong, [6, 14]))}`,
          );
        if (morningStrong.some((i) => [5, 13].includes(i.num)))
          strengths.push(
            `${m ? 'פותר' : 'פותרת'} בעיות שצצות${ref(matchNums(morningStrong, [5, 13]))}`,
          );

        if (strengths.length > 0) {
          s += `חוזקות: ${strengths.join(', ')}. `;
        }
      }
      s += `</p>`;
    }

    // Play
    const playBelow = belowCutoff(d.playAvg, d.c.play);
    if (playBelow) {
      s += `<p style="font-size:0.85rem; margin-bottom:10px;">`;
      s += `<strong>פנאי ומשחק:</strong> `;

      const difficulties = [];
      if (playWeak.some((i) => i.num === 17))
        difficulties.push(
          `לא ${m ? 'בוחר' : 'בוחרת'} משחקים ${m ? 'ביוזמתו' : 'ביוזמתה'}${ref(17)}`,
        );
      if (playWeak.some((i) => i.num === 22))
        difficulties.push(
          `לא ${m ? 'מתכנן' : 'מתכננת'} לפני תחילת משחק (לא ${m ? 'מדמיין' : 'מדמיינת'} מה ${m ? 'רוצה' : 'רוצה'} לבנות או לצייר)${ref(22)}`,
        );
      if (playWeak.some((i) => i.num === 18))
        difficulties.push(`לא ${m ? 'משחק' : 'משחקת'} בקצב מתאים${ref(18)}`);
      if (playWeak.some((i) => i.num === 19))
        difficulties.push(`לא ${m ? 'משחק' : 'משחקת'} לפי שלבי המשחק בסדר הנכון${ref(19)}`);
      if (playWeak.some((i) => i.num === 20))
        difficulties.push(`${m ? 'מתקשה' : 'מתקשה'} לשחק לפי כללים (כמו לחכות לתור)${ref(20)}`);
      if (playWeak.some((i) => i.num === 21))
        difficulties.push(
          `${m ? 'מוסח' : 'מוסחת'} במהלך משחק — ${m ? 'מסתובב' : 'מסתובבת'} בחדר או ${m ? 'נוגע' : 'נוגעת'} במשחקים אחרים${ref(21)}`,
        );
      if (playWeak.some((i) => i.num === 23))
        difficulties.push(`${m ? 'עובר' : 'עוברת'} ממשחק למשחק בלי לסיים${ref(23)}`);

      if (difficulties.length > 0) {
        s += difficulties.join('; ') + `. `;
      }

      if (playStrong.length > 0) {
        const strengths = [];
        if (playStrong.some((i) => i.num === 17))
          strengths.push(`${m ? 'בוחר' : 'בוחרת'} משחקים ${m ? 'ביוזמתו' : 'ביוזמתה'}${ref(17)}`);
        if (playStrong.some((i) => i.num === 23))
          strengths.push(`${m ? 'מסיים' : 'מסיימת'} משחק לפני שעובר${ref(23)}`);
        if (playStrong.some((i) => i.num === 22))
          strengths.push(`${m ? 'מתכנן' : 'מתכננת'} מראש${ref(22)}`);

        if (strengths.length > 0) {
          s += `חוזקות: ${strengths.join(', ')}. `;
        }
      }
      s += `</p>`;
    }

    // Social
    const socialBelow = belowCutoff(d.socialAvg, d.c.social);
    if (socialBelow) {
      s += `<p style="font-size:0.85rem; margin-bottom:10px;">`;
      s += `<strong>שגרה חברתית:</strong> `;

      const difficulties = [];
      if (d.scores[24] <= 2)
        difficulties.push(
          `לא ${m ? 'יוזם' : 'יוזמת'} אינטראקציות חברתיות (כמו הזמנת חבר הביתה)${ref(24)}`,
        );
      if (d.scores[28] <= 2)
        difficulties.push(`${m ? 'מתקשה' : 'מתקשה'} לפתור בעיות שעולות במשחק חברתי${ref(28)}`);
      if (d.scores[29] <= 2)
        difficulties.push(
          `לא ${m ? 'חושב' : 'חושבת'} על תגובות אפשריות לפני שמגיב בעימות${ref(29)}`,
        );
      if (d.scores[30] <= 2)
        difficulties.push(`לא ${m ? 'חושב' : 'חושבת'} על ההשפעה של תגובותיו על חברים${ref(30)}`);
      if (d.scores[25] <= 2)
        difficulties.push(`${m ? 'מתקשה' : 'מתקשה'} ללמוד מהתנסויות חברתיות שליליות${ref(25)}`);
      if (d.scores[26] <= 2)
        difficulties.push(`${m ? 'מביע' : 'מביעה'} כעס או תסכול באופן מוגזם במשחק חברתי${ref(26)}`);
      if (d.scores[27] <= 2)
        difficulties.push(`לא ${m ? 'משחק' : 'משחקת'} לפי הכללים המקובלים בקבוצה${ref(27)}`);

      if (difficulties.length > 0) {
        s += difficulties.join('; ') + `. `;
      }

      const socialMid = midItems(socialItems);
      if (socialMid.length > 0 && socialWeak.length < socialItems.length) {
        const midAreas = [];
        if (socialMid.some((i) => i.num === 26)) midAreas.push(`ויסות כעס${ref(26)}`);
        if (socialMid.some((i) => i.num === 27)) midAreas.push(`שמירה על כללים${ref(27)}`);
        if (socialMid.some((i) => i.num === 25)) midAreas.push(`למידה מטעויות${ref(25)}`);
        if (socialMid.some((i) => i.num === 29)) midAreas.push(`חשיבה לפני תגובה${ref(29)}`);
        if (midAreas.length > 0) {
          s += `תחומים גבוליים ("לפעמים"): ${midAreas.join(', ')}. `;
        }
      }
      s += `</p>`;
    }
  } else {
    // All routines OK
    s += `<p style="font-size:0.85rem; margin-bottom:10px;">`;
    s += `כל השגרות והתפקודים הניהוליים בטווח התקין לגיל. `;
    const allMid = midItems(items);
    if (allMid.length > 5) {
      s += `${allMid.length} פריטים דורגו "לפעמים" — יש מקום לצמיחה.`;
    }
    s += `</p>`;
  }

  // =================================================================
  // BLOCK 3: משמעות קלינית — what's driving the difficulties
  // =================================================================
  if (weakEFs.length > 0 || weakRoutines.length > 0) {
    s += `<p style="font-weight:700; color:var(--primary); font-size:0.88rem; margin-bottom:6px;">משמעות קלינית</p>`;
    s += `<p style="font-size:0.85rem; margin-bottom:4px;">`;

    if (weakEFs.length > 0) {
      // Explain each weak EF
      if (wmBelow) {
        s += `<strong>זיכרון עבודה</strong> (${d.wmAvg.toFixed(2)}, חתך ${d.c.wm.toFixed(2)}): `;
        const wmExplanations = [];
        const wmWeak = weakItems(items.filter((i) => i.ef === 'wm'));
        if (wmWeak.some((i) => [1, 9].includes(i.num)))
          wmExplanations.push(
            `לא ${m ? 'מתניע' : 'מתניעה'} שגרות בוקר/ערב באופן עצמאי${ref(matchNums(wmWeak, [1, 9]))}`,
          );
        if (wmWeak.some((i) => [2, 10, 18].includes(i.num)))
          wmExplanations.push(
            `${m ? 'צריך' : 'צריכה'} תזכורות חוזרות לשמירה על קצב${ref(matchNums(wmWeak, [2, 10, 18]))}`,
          );
        if (wmWeak.some((i) => [3, 11, 19].includes(i.num)))
          wmExplanations.push(
            `לא ${m ? 'מחזיק' : 'מחזיקה'} רצף פעילויות${ref(matchNums(wmWeak, [3, 11, 19]))}`,
          );
        if (wmWeak.some((i) => [4, 12, 20, 27].includes(i.num)))
          wmExplanations.push(
            `לא ${m ? 'מתארגן' : 'מתארגנת'} לפי כללים${ref(matchNums(wmWeak, [4, 12, 20, 27]))}`,
          );
        if (wmWeak.some((i) => [7, 15].includes(i.num)))
          wmExplanations.push(
            `לא ${m ? 'בודק' : 'בודקת'} איכות ביצוע${ref(matchNums(wmWeak, [7, 15]))}`,
          );
        s += wmExplanations.length > 0 ? wmExplanations.join('; ') : 'ציון מתחת לחתך';
        s += `. `;
      }
      if (inhBelow) {
        s += `<strong>עכבה</strong> (${d.inhAvg.toFixed(2)}, חתך ${d.c.inh.toFixed(2)}): `;
        const inhExplanations = [];
        const inhWeak = weakItems(items.filter((i) => i.ef === 'inh'));
        if (inhWeak.some((i) => [6, 14].includes(i.num)))
          inhExplanations.push(
            `${m ? 'מוסח' : 'מוסחת'} מגירויים חיצוניים (כמו טלוויזיה ברקע)${ref(matchNums(inhWeak, [6, 14]))}`,
          );
        if (inhWeak.some((i) => [8, 16, 23].includes(i.num)))
          inhExplanations.push(
            `לא ${m ? 'מסיים' : 'מסיימת'} פעילויות — ${m ? 'עובר' : 'עוברת'} לדבר אחר באמצע${ref(matchNums(inhWeak, [8, 16, 23]))}`,
          );
        if (inhWeak.some((i) => [26].includes(i.num)))
          inhExplanations.push(`${m ? 'מביע' : 'מביעה'} כעס באופן מוגזם${ref(26)}`);
        if (inhWeak.some((i) => [29, 30].includes(i.num)))
          inhExplanations.push(
            `${m ? 'מגיב' : 'מגיבה'} בלי לעצור לחשוב${ref(matchNums(inhWeak, [29, 30]))}`,
          );
        s += inhExplanations.length > 0 ? inhExplanations.join('; ') : 'ציון מתחת לחתך';
        s += `. `;
      }
      if (flexBelow) {
        s += `<strong>גמישות מחשבתית</strong> (${d.flexAvg.toFixed(2)}, חתך ${d.c.flex.toFixed(2)}): `;
        const flexExplanations = [];
        const flexWeak = weakItems(items.filter((i) => i.ef === 'flex'));
        if (flexWeak.some((i) => [5, 13].includes(i.num)))
          flexExplanations.push(
            `${m ? 'מתקשה' : 'מתקשה'} לפתור בעיות שצצות בשגרה (כמו חפץ חסר)${ref(matchNums(flexWeak, [5, 13]))}`,
          );
        if (flexWeak.some((i) => [28].includes(i.num)))
          flexExplanations.push(`${m ? 'מתקשה' : 'מתקשה'} לפתור אי-הסכמות חברתיות${ref(28)}`);
        if (flexWeak.some((i) => [22].includes(i.num)))
          flexExplanations.push(`לא ${m ? 'מתכנן' : 'מתכננת'} מראש לפני פעילות${ref(22)}`);
        if (flexWeak.some((i) => [17, 24].includes(i.num)))
          flexExplanations.push(
            `לא ${m ? 'יוזם' : 'יוזמת'} פעילויות באופן עצמאי${ref(matchNums(flexWeak, [17, 24]))}`,
          );
        s += flexExplanations.length > 0 ? flexExplanations.join('; ') : 'ציון מתחת לחתך';
        s += `. `;
      }

      // Intact EFs — the interpretive bottom line
      if (okEFs.length > 0) {
        s += `<br><br>`;
        s += `<strong>${okEFs.map((e) => e.label).join(' ו')} ${okEFs.length === 1 ? 'תקין' : 'תקינים'}</strong> — `;

        if (!inhBelow && (wmBelow || flexBelow)) {
          s += `${child} לא ${m ? 'אימפולסיבי' : 'אימפולסיבית'}`;
          const inhStrong816 = strongItems(items.filter((i) => i.ef === 'inh')).filter((i) =>
            [8, 16].includes(i.num),
          );
          if (inhStrong816.length > 0) {
            s += `, ${m ? 'מסיים' : 'מסיימת'} מה ש${m ? 'מתחיל' : 'מתחילה'} (כשמישהו עוזר ${m ? 'לו' : 'לה'} להתחיל)${ref(inhStrong816.map((i) => i.num))}`;
          }
          const inhStrong614 = strongItems(items.filter((i) => i.ef === 'inh')).filter((i) =>
            [6, 14].includes(i.num),
          );
          if (inhStrong614.length > 0) {
            s += `, ולא ${m ? 'מוסח' : 'מוסחת'} מגירויים חיצוניים${ref(inhStrong614.map((i) => i.num))}`;
          }
          s += `. הקושי הוא בהתנעה ובארגון עצמי, לא בשליטה עצמית.`;
        } else if (!wmBelow && (inhBelow || flexBelow)) {
          s += `${child} ${m ? 'זוכר' : 'זוכרת'} רצפים ו${m ? 'מתניע' : 'מתניעה'} לבד — הקושי הוא בבלימה ובגמישות, לא בזיכרון.`;
        } else if (!flexBelow && (wmBelow || inhBelow)) {
          s += `${child} ${m ? 'מצליח' : 'מצליחה'} לפתור בעיות ו${m ? 'מסתגל' : 'מסתגלת'} לשינויים — הקושי הוא בביצוע עצמאי של השגרה.`;
        } else {
          s += `${okEFs.map((e) => e.label).join(' ו')} בטווח הצפוי לגיל.`;
        }
      }
    } else {
      // No weak EFs but weak routines
      s += `כל התפקודים הניהוליים בטווח התקין (עכבה ${d.inhAvg.toFixed(2)}, זיכרון עבודה ${d.wmAvg.toFixed(2)}, גמישות מחשבתית ${d.flexAvg.toFixed(2)}). `;
      s += `הקושי בשגרות ייתכן שנובע מגורמים סביבתיים, חווייתיים, או הרגלים — לא מקושי בתפקודים הניהוליים עצמם.`;
    }
    s += `</p>`;
  }

  return s;
}

function copyResultsForAI() {
  const gender = document.getElementById('childGender').value === 'male' ? 'זכר' : 'נקבה';
  const ageText = document.getElementById('calcAge').textContent;
  const ageLabel = document.getElementById('ageGroupDisplay').textContent;
  const efLabels = { inh: 'עכבה', wm: 'זיכרון עבודה', flex: 'גמישות מחשבתית' };
  const routineLabels = { morning: 'בוקר וערב', play: 'פנאי ומשחק', social: 'שגרה חברתית' };

  // Collect all scores
  const scores = {};
  items.forEach((item) => {
    const checked = document.querySelector(`input[name="q${item.num}"]:checked`);
    if (checked) scores[item.num] = parseInt(checked.value);
  });

  const scoreNames = ['', 'אף פעם', 'לעיתים רחוקות', 'לפעמים', 'לעיתים קרובות', 'תמיד'];

  let text = `שאלון EFORTS — נתונים לניתוח\n`;
  text += `${gender} | ${ageText} | קבוצת גיל: ${ageLabel}\n\n`;

  // All 30 items with scores
  text += `פריטים וציונים:\n`;
  const routines = [
    { key: 'morning', label: 'שגרות בוקר וערב', range: [1, 16] },
    { key: 'play', label: 'פנאי ומשחק', range: [17, 23] },
    { key: 'social', label: 'שגרה חברתית', range: [24, 30] },
  ];
  routines.forEach((r) => {
    text += `\n${r.label}:\n`;
    items
      .filter((i) => i.num >= r.range[0] && i.num <= r.range[1])
      .forEach((item) => {
        const sc = scores[item.num];
        const ef = item.ef ? efLabels[item.ef] : 'לא כלול בסולמות';
        text += `  ${item.num}. ${item.text} — ${sc} (${scoreNames[sc]}) [${ef}]\n`;
      });
  });

  text += `\nכתוב סיכום קליני בעברית על סמך הנתונים. תאר מה קורה ביום-יום, מה מניע את הקשיים, ומה תקין. שלב את הפריטים כראיות בתוך המשפטים, לא כרשימה נפרדת.`;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyAiBtn');
    btn.textContent = 'הועתק!';
    btn.style.background = 'var(--green)';
    setTimeout(() => {
      btn.textContent = 'העתק נתונים';
      btn.style.background = 'var(--primary)';
    }, 2000);
  });
}

async function printResults() {
  const btn = document.querySelector('.btn-pdf');
  btn.disabled = true;
  btn.textContent = '...יוצר PDF';

  try {
    // Gather all data from the current results
    const anonId = document.getElementById('anonId').value || '—';
    const gender = document.getElementById('childGender').value === 'male' ? 'זכר' : 'נקבה';
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

    const levelText = (sc, ct) =>
      sc < ct ? 'מתחת לחתך ⚠' : sc <= 3 ? 'מתחת לממוצע' : 'בטווח התקין ✓';
    const levelColor = (sc, ct) => (sc < ct ? '#c0392b' : sc <= 3 ? '#d35400' : '#27ae60');

    // Build score rows for the table
    const scoreTableRows = [
      { label: 'בוקר וערב', sc: morningAvg, ct: c.morning },
      { label: 'פנאי ומשחק', sc: playAvg, ct: c.play },
      { label: 'שגרה חברתית', sc: socialAvg, ct: c.social },
      { label: 'ציון כולל', sc: totalAvg, ct: c.total },
    ];
    const efTableRows = [
      { label: 'עכבה', sc: inhAvg, ct: c.inh },
      { label: 'זיכרון עבודה', sc: wmAvg, ct: c.wm },
      { label: 'גמישות מחשבתית', sc: flexAvg, ct: c.flex },
    ];

    const buildScoreTable = (rows) =>
      rows
        .map(
          (r) =>
            `<tr>
        <td style="padding:4px 10px;font-weight:600;text-align:right;">${r.label}</td>
        <td style="padding:4px 10px;text-align:center;color:${levelColor(r.sc, r.ct)};font-weight:700;">${r.sc.toFixed(2)}</td>
        <td style="padding:4px 10px;text-align:center;color:#666;">${r.ct.toFixed(2)}</td>
        <td style="padding:4px 10px;text-align:center;color:${levelColor(r.sc, r.ct)};">${levelText(r.sc, r.ct)}</td>
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
        <td style="padding:4px 8px;text-align:center;font-size:11px;">${_efLabels[item.ef] || '—'}</td>
        <td style="padding:4px 8px;text-align:center;font-weight:700;font-size:12px;color:${scores[item.num] <= 2 ? '#c0392b' : scores[item.num] === 3 ? '#d35400' : '#27ae60'};">${scores[item.num]}</td>
        <td style="padding:4px 8px;text-align:center;font-size:10px;color:#888;">${scoreNames[scores[item.num]]}</td>
      </tr>`,
        )
        .join('');

    // Strip HTML tags from summary for clean text
    const summaryText = summaryHtml
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

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
  <h1>תוצאות שאלון EFORTS</h1>
  <div class="meta">מזהה: ${anonId} | ${gender} | ${ageText} | קבוצת גיל: ${ageLabel} | תאריך: ${new Date().toLocaleDateString('he-IL')}</div>

  <div class="section-title">ציונים</div>
  <table>
    <tr><th style="text-align:right;">תחום</th><th>ציון</th><th>חתך</th><th>מצב</th></tr>
    ${buildScoreTable(scoreTableRows)}
    <tr><td colspan="4" style="padding:2px;border:none;"></td></tr>
    <tr><th style="text-align:right;">תפקוד ניהולי</th><th>ציון</th><th>חתך</th><th>מצב</th></tr>
    ${buildScoreTable(efTableRows)}
  </table>

  <div class="section-title">סיכום קליני</div>
  <div class="summary-box">${summaryText}</div>

  <div class="section-title">פירוט פריטים לפי רמת ציון</div>
  <table>
    <tr><th style="width:30px;">#</th><th style="text-align:right;">פריט</th><th style="width:80px;">שגרה</th><th style="width:80px;">תפקוד</th><th style="width:40px;">ציון</th><th style="width:70px;">רמה</th></tr>
    ${weakItems.length > 0 ? `<tr><td colspan="6" class="group-header group-weak">קושי (ציון 1-2) — ${weakItems.length} פריטים</td></tr>` + buildItemRows(weakItems, '#fff5f5') : ''}
    ${midItems.length > 0 ? `<tr><td colspan="6" class="group-header group-mid">בינוני (ציון 3) — ${midItems.length} פריטים</td></tr>` + buildItemRows(midItems, '#fffbeb') : ''}
    ${strongItems.length > 0 ? `<tr><td colspan="6" class="group-header group-strong">חזק (ציון 4-5) — ${strongItems.length} פריטים</td></tr>` + buildItemRows(strongItems, '#f0fdf4') : ''}
  </table>

  <div class="footer">
    EFORTS — Frisch & Rosenblum, 2014 | ציון חתך = 1.5 סטיות תקן מתחת לממוצע הנורמטיבי | פריטים 10 ו-11 לא נכללים בסולמות הניהוליים
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
  if (!confirm('לאפס את כל התשובות ולהתחיל שאלון חדש?')) return;
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
