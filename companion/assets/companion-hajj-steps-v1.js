/*! companion-hajj-steps-v1.js
 * Phase 2 — Hajj step depth + tap citations + empty-panel guard
 * Educational only — not a fatwa. Companion-only. Additive.
 */
(function (w, d) {
  'use strict';
  if (w.__COMPANION_HAJJ_STEPS_V1__) return;
  w.__COMPANION_HAJJ_STEPS_V1__ = true;

  var KEY = 'clarity_hajj_steps_v1';
  var DISC =
    '<p class="hajj-step-disc"><strong>Educational only — not a fatwa.</strong> ' +
    'Madhāhib differ on sequence details and what incurs a penalty. Confirm with a local teacher and official guidance before you travel.</p>';

  function cite(label, href) {
    return (
      '<a class="hajj-cite" href="' +
      href +
      '" target="_blank" rel="noopener">' +
      label +
      '</a>'
    );
  }

  /** Shared educational steps (keys used across nusks). */
  var STEPS = {
    intention: {
      title: 'Intention & knowledge before travel',
      body:
        '<p>Learn which nusk you will perform and the days of Ḥajj before you leave home. Clarity stores progress on this device only.</p>' +
        '<ul><li>Ask a teacher about Tamattuʿ, Qirān, and Ifrād for your situation.</li>' +
        '<li>Logistics (visa, packages) are not fiqh — use official portals as logistics only.</li></ul>',
      cites: [
        { label: 'Qurʾān 2:196–197', href: 'https://quran.com/2/196' },
        { label: 'Sunnah.com · Hajj', href: 'https://sunnah.com/search?q=hajj' }
      ]
    },
    miqat: {
      title: 'Mīqāt — boundary of iḥrām',
      body:
        '<p>Enter iḥrām from the mīqāt that applies to your route. Do not delay past the boundary without the state of iḥrām your teacher taught for your case.</p>' +
        '<ul><li>Make ghusl if able; wear the garments taught for your gender and school.</li>' +
        '<li>Form the intention for ʿUmrah or Ḥajj as instructed for your nusk.</li></ul>',
      cites: [
        { label: 'Sunnah.com · mīqāt', href: 'https://sunnah.com/search?q=miqat' },
        { label: 'Qurʾān 2:196', href: 'https://quran.com/2/196' }
      ]
    },
    ihram_rules: {
      title: 'In iḥrām — remember the restrictions',
      body:
        '<p>While in iḥrām, avoid the restrictions your teacher listed (hair/nails, perfume, hunting, marital relations, and gender-specific garment rules).</p>' +
        '<p>Open the on-page <strong>In iḥrām — do / avoid</strong> panel for the study list. It is not a fatwa.</p>',
      cites: [
        { label: 'Qurʾān 2:197', href: 'https://quran.com/2/197' },
        { label: 'Do / avoid panel', href: '#hajj-ihram-do-avoid' }
      ]
    },
    talbiyah: {
      title: 'Talbiyah',
      body:
        '<p>Say the talbiyah after entering iḥrām. Keep the tongue with dhikr; avoid dispute and vanity on the way of Ḥajj.</p>' +
        '<div class="dua-ar" dir="rtl" lang="ar">لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ</div>',
      cites: [
        { label: 'Sunnah.com · talbiyah', href: 'https://sunnah.com/search?q=talbiyah' },
        { label: 'Qurʾān 2:197', href: 'https://quran.com/2/197' }
      ]
    },
    umrah_tawaf: {
      title: 'ʿUmrah — ṭawāf of arrival (Tamattuʿ)',
      body:
        '<p>For Tamattuʿ, perform ʿUmrah first: ṭawāf around the Kaʿbah with the conditions and sunan your teacher taught, then two rakʿahs if able in the proper place.</p>' +
        '<p>Video lectures are secondary rank — not equal to Qurʾān or graded reports.</p>',
      cites: [
        { label: 'Sunnah.com · ṭawāf', href: 'https://sunnah.com/search?q=tawaf' },
        { label: 'Qurʾān 22:26–29', href: 'https://quran.com/22/26' }
      ]
    },
    umrah_sai: {
      title: 'ʿUmrah — saʿī',
      body:
        '<p>Perform saʿī between Ṣafā and Marwah as taught. Begin at Ṣafā if that is what you were taught for this ʿUmrah.</p>',
      cites: [
        { label: 'Qurʾān 2:158', href: 'https://quran.com/2/158' },
        { label: 'Sunnah.com · saʿī', href: 'https://sunnah.com/search?q=safa%20marwa' }
      ]
    },
    tahallul_umrah: {
      title: 'Release from ʿUmrah iḥrām (Tamattuʿ)',
      body:
        '<p>After ʿUmrah rites, release from iḥrām as your teacher taught (shortening or shaving) until iḥrām for Ḥajj on the 8th.</p>' +
        '<p>If two reports seem to conflict, take both to a scholar — do not invent a third source.</p>',
      cites: [
        { label: 'Sunnah.com · tahallul', href: 'https://sunnah.com/search?q=tahallul' },
        { label: 'Qurʾān 2:196', href: 'https://quran.com/2/196' }
      ]
    },
    hajj_ihram: {
      title: 'Iḥrām for Ḥajj (8th of Dhul-Ḥijjah)',
      body:
        '<p>Enter iḥrām for Ḥajj from Makkah (Tamattuʿ) or continue as taught for Qirān/Ifrād. Proceed toward Minā with the pilgrims.</p>',
      cites: [
        { label: 'Sunnah.com · 8th Dhul-Hijjah', href: 'https://sunnah.com/search?q=mina%20tarwiyah' },
        { label: 'Qurʾān 2:197', href: 'https://quran.com/2/197' }
      ]
    },
    arafah: {
      title: 'ʿArafah (9th) — the core of Ḥajj',
      body:
        '<p>Presence at ʿArafah is the pillar without which Ḥajj is not complete in the way scholars teach. Stand, remember Allah, make duʿāʾ, and follow the timing your group and teacher use.</p>' +
        '<p>Keep phones and arguments from eating the day.</p>',
      cites: [
        { label: 'Sunnah.com · ʿArafah', href: 'https://sunnah.com/search?q=arafah' },
        { label: 'Qurʾān 2:198', href: 'https://quran.com/2/198' }
      ]
    },
    muzdalifah: {
      title: 'Muzdalifah',
      body:
        '<p>After ʿArafah, go to Muzdalifah. Combine and shorten as taught; rest if able; collect pebbles if that is your group’s practice for the next day.</p>',
      cites: [
        { label: 'Sunnah.com · Muzdalifah', href: 'https://sunnah.com/search?q=muzdalifah' },
        { label: 'Qurʾān 2:198', href: 'https://quran.com/2/198' }
      ]
    },
    jamarat: {
      title: 'Stoning the Jamarāt',
      body:
        '<p>Stone as sequenced for your days (10th and the days of tashrīq). Follow crowd safety and the number of pebbles your teacher specified.</p>' +
        '<p>This panel does not adjudicate disputed timings — ask your scholar.</p>',
      cites: [
        { label: 'Sunnah.com · jamarāt', href: 'https://sunnah.com/search?q=jamarat' },
        { label: 'Qurʾān 2:203', href: 'https://quran.com/2/203' }
      ]
    },
    sacrifice: {
      title: 'Hady / sacrifice (if required for your nusk)',
      body:
        '<p>Tamattuʿ and Qirān require a hady in the way taught; arrangements may be through official programs. Confirm what is required for <em>your</em> nusk with a teacher.</p>',
      cites: [
        { label: 'Qurʾān 2:196', href: 'https://quran.com/2/196' },
        { label: 'Sunnah.com · hady', href: 'https://sunnah.com/search?q=hady%20hajj' }
      ]
    },
    halq: {
      title: 'Ḥalq or taqṣīr',
      body:
        '<p>Shave or shorten the hair as taught for release from the first stage of iḥrām after the rites of the 10th. Women shorten; they do not shave.</p>',
      cites: [
        { label: 'Sunnah.com · shave / shorten', href: 'https://sunnah.com/search?q=shave%20hajj' },
        { label: 'Qurʾān 2:196', href: 'https://quran.com/2/196' }
      ]
    },
    ifadah: {
      title: 'Ṭawāf al-ifāḍah',
      body:
        '<p>Perform the ifāḍah ṭawāf — a pillar of Ḥajj in the way scholars teach — then saʿī if required for your nusk and prior rites.</p>',
      cites: [
        { label: 'Sunnah.com · ifāḍah', href: 'https://sunnah.com/search?q=tawaf%20ifadah' },
        { label: 'Qurʾān 22:29', href: 'https://quran.com/22/29' }
      ]
    },
    tashriq: {
      title: 'Days of tashrīq',
      body:
        '<p>Remain in Minā for the days of tashrīq as taught; stone on those days; remember Allah. Leaving early has conditions — do not self-issue a ruling from this card.</p>',
      cites: [
        { label: 'Qurʾān 2:203', href: 'https://quran.com/2/203' },
        { label: 'Sunnah.com · tashrīq', href: 'https://sunnah.com/search?q=tashriq' }
      ]
    },
    wada: {
      title: 'Farewell ṭawāf',
      body:
        '<p>Before leaving Makkah, perform the farewell ṭawāf if it is required in your case (exceptions exist for some women in menses — ask a teacher).</p>',
      cites: [
        { label: 'Sunnah.com · farewell ṭawāf', href: 'https://sunnah.com/search?q=farewell%20tawaf' },
        { label: 'Qurʾān 22:29', href: 'https://quran.com/22/29' }
      ]
    }
  };

  var NUSK = {
    tamattu: [
      'intention', 'miqat', 'ihram_rules', 'talbiyah', 'umrah_tawaf', 'umrah_sai',
      'tahallul_umrah', 'hajj_ihram', 'arafah', 'muzdalifah', 'jamarat',
      'sacrifice', 'halq', 'ifadah', 'tashriq', 'wada'
    ],
    qiran: [
      'intention', 'miqat', 'ihram_rules', 'talbiyah', 'umrah_tawaf', 'umrah_sai',
      'arafah', 'muzdalifah', 'jamarat', 'sacrifice', 'halq', 'ifadah', 'tashriq', 'wada'
    ],
    ifrad: [
      'intention', 'miqat', 'ihram_rules', 'talbiyah', 'arafah', 'muzdalifah',
      'jamarat', 'halq', 'ifadah', 'tashriq', 'wada'
    ]
  };

  function root() {
    return d.getElementById('cs-mount') || d;
  }
  function $(id) {
    return root().querySelector('#' + id) || d.getElementById(id);
  }
  function nusk() {
    var el = $('hajj-nusk');
    var v = el && el.value;
    return NUSK[v] ? v : 'tamattu';
  }
  function loadState() {
    try {
      return JSON.parse(w.localStorage.getItem(KEY) || '{}') || {};
    } catch (e) {
      return {};
    }
  }
  function saveState(st) {
    try {
      w.localStorage.setItem(KEY, JSON.stringify(st));
    } catch (e) {}
  }
  function doneSet() {
    var st = loadState();
    var n = nusk();
    if (!st[n]) st[n] = {};
    return { st: st, n: n, map: st[n] };
  }

  function renderCites(cites) {
    if (!cites || !cites.length) return '';
    var html = '<p class="hajj-cites"><strong>Tap citations:</strong> ';
    html += cites
      .map(function (c) {
        return cite(c.label, c.href);
      })
      .join(' · ');
    html += '</p>';
    return html;
  }

  function panelHtml(key) {
    var step = STEPS[key];
    if (!step) {
      return (
        DISC +
        '<p class="hajj-empty-defect"><strong>Empty step.</strong> This step id is missing content — that is a defect. Choose another step or update the module.</p>'
      );
    }
    return (
      DISC +
      '<h4 class="hajj-step-title">' +
      step.title +
      '</h4>' +
      step.body +
      renderCites(step.cites)
    );
  }

  function fillSelect() {
    var sel = $('hajj-step-select');
    if (!sel) return;
    var keys = NUSK[nusk()];
    var cur = sel.value;
    sel.innerHTML = '';
    keys.forEach(function (k, i) {
      var opt = d.createElement('option');
      opt.value = k;
      opt.textContent = i + 1 + '. ' + (STEPS[k] ? STEPS[k].title : k);
      sel.appendChild(opt);
    });
    if (cur && keys.indexOf(cur) >= 0) sel.value = cur;
    else sel.value = keys[0];
  }

  function renderProgress() {
    var box = $('hajj-progress');
    if (!box) return;
    var keys = NUSK[nusk()];
    var map = doneSet().map;
    var done = keys.filter(function (k) {
      return !!map[k];
    }).length;
    box.innerHTML =
      '<span class="hajj-prog-text">' +
      done +
      ' / ' +
      keys.length +
      ' steps marked on this device</span>' +
      '<span class="hajj-prog-bar" aria-hidden="true"><i style="width:' +
      Math.round((done / keys.length) * 100) +
      '%"></i></span>';
  }

  function showStep(v) {
    var panel = $('hajj-panel');
    if (!panel) return;
    var key = v || ($('hajj-step-select') && $('hajj-step-select').value) || NUSK[nusk()][0];
    var html = panelHtml(key);
    panel.innerHTML = html;
    // Empty panel defect: if somehow blank
    if (!panel.textContent || !panel.textContent.trim()) {
      panel.innerHTML =
        DISC +
        '<p class="hajj-empty-defect"><strong>Empty panel defect.</strong> Guidance failed to render. Re-select the step or reload Action.</p>';
    }
    renderProgress();
    // in-page cite for do/avoid
    panel.querySelectorAll('a[href="#hajj-ihram-do-avoid"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var el = $('hajj-ihram-do-avoid');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function markDone() {
    var sel = $('hajj-step-select');
    if (!sel) return;
    var o = doneSet();
    o.map[sel.value] = true;
    saveState(o.st);
    renderProgress();
  }
  function markUndone() {
    var sel = $('hajj-step-select');
    if (!sel) return;
    var o = doneSet();
    delete o.map[sel.value];
    saveState(o.st);
    renderProgress();
  }
  function whereAmI() {
    var keys = NUSK[nusk()];
    var map = doneSet().map;
    var next = keys.find(function (k) {
      return !map[k];
    });
    var sel = $('hajj-step-select');
    if (sel && next) {
      sel.value = next;
      showStep(next);
    } else if (sel) {
      showStep(sel.value);
    }
    var panel = $('hajj-panel');
    if (panel) {
      var note = d.createElement('p');
      note.className = 'hajj-where';
      note.innerHTML = next
        ? '<strong>Where am I?</strong> Next unmarked step selected. On-device only.'
        : '<strong>Where am I?</strong> All listed steps marked on this device. Still confirm with your teacher.';
      panel.insertBefore(note, panel.firstChild);
    }
  }

  // Public API — overwrite stubs
  w.hajjShowStep = showStep;
  w.hajjMarkDone = markDone;
  w.hajjMarkUndone = markUndone;
  w.hajjWhereAmI = whereAmI;

  if (typeof w.hajjTalbiyah !== 'function') {
    w.hajjTalbiyah = function (delta) {
      var el = $('hajj-talbiyah-count');
      if (!el) return;
      var n = parseInt(el.textContent, 10) || 0;
      n = Math.max(0, n + (delta || 0));
      el.textContent = String(n);
      try {
        w.localStorage.setItem('clarity_hajj_talbiyah_v1', String(n));
      } catch (e) {}
    };
  }
  if (typeof w.hajjPlayTalbiyah !== 'function') {
    w.hajjPlayTalbiyah = function () {
      try {
        if (!w.speechSynthesis) return;
        var u = new SpeechSynthesisUtterance(
          'Labbayk Allahumma labbayk, labbayk la shareeka laka labbayk'
        );
        u.lang = 'ar-SA';
        w.speechSynthesis.speak(u);
      } catch (e) {}
    };
  }
  if (typeof w.hajjLoadEpisode !== 'function') {
    w.hajjLoadEpisode = function (id) {
      var frame = d.getElementById('hajj-yt-frame-frame') || d.querySelector('#hajj-yt-frame iframe');
      var open = d.getElementById('hajj-yt-open');
      if (open) open.href = 'https://www.youtube-nocookie.com/embed/' + id;
      // prefer details open
      var host = d.querySelector('[data-embed-id="hajj-yt-frame"]');
      if (host) host.open = true;
      if (frame && frame.tagName === 'IFRAME') {
        frame.src = 'https://www.youtube-nocookie.com/embed/' + id;
      }
    };
  }
  if (typeof w.hajjChecklistRender !== 'function') {
    w.hajjChecklistRender = function () {
      var list = $('hajj-checklist-list');
      if (!list) return;
      var keys = NUSK[nusk()];
      var map = doneSet().map;
      list.innerHTML = keys
        .map(function (k, i) {
          var ok = map[k] ? '✓' : '○';
          return (
            '<label class="hajj-check-item"><span>' +
            ok +
            '</span> ' +
            (i + 1) +
            '. ' +
            (STEPS[k] ? STEPS[k].title : k) +
            '</label>'
          );
        })
        .join('');
    };
  }
  if (typeof w.hajjChecklistPrint !== 'function') {
    w.hajjChecklistPrint = function () {
      w.print();
    };
  }
  if (typeof w.hajjChecklistReset !== 'function') {
    w.hajjChecklistReset = function () {
      var o = doneSet();
      o.st[o.n] = {};
      saveState(o.st);
      renderProgress();
      if (typeof w.hajjChecklistRender === 'function') w.hajjChecklistRender();
    };
  }

  function boot() {
    fillSelect();
    var sel = $('hajj-step-select');
    if (sel) {
      sel.addEventListener('change', function () {
        showStep(sel.value);
      });
    }
    var nuskEl = $('hajj-nusk');
    if (nuskEl) {
      nuskEl.addEventListener('change', function () {
        fillSelect();
        showStep();
        if (typeof w.hajjChecklistRender === 'function') w.hajjChecklistRender();
      });
    }
    // restore talbiyah
    try {
      var tc = w.localStorage.getItem('clarity_hajj_talbiyah_v1');
      var el = $('hajj-talbiyah-count');
      if (el && tc) el.textContent = tc;
    } catch (e) {}
    showStep();
    renderProgress();
    // Empty initial panel guard
    var panel = $('hajj-panel');
    if (panel && !panel.textContent.trim()) {
      panel.innerHTML =
        DISC +
        '<p class="hajj-empty-defect"><strong>Empty panel defect.</strong> Select a step.</p>';
    }
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else boot();
  // remount observer (short)
  try {
    var mo = new MutationObserver(function () {
      if ($('hajj-step-select') && !$('hajj-step-select').options.length) boot();
    });
    mo.observe(d.documentElement, { childList: true, subtree: true });
    setTimeout(function () {
      try {
        mo.disconnect();
      } catch (e) {}
    }, 20000);
  } catch (e) {}
})(window, document);
