/*! companion-hajj-steps-v1.js
 * Phase 2 + FIX — durable API, remount boot, button bind, empty-panel guard
 * Educational only — not a fatwa. Companion-only.
 */
(function (w, d) {
  'use strict';
  // Allow re-init of DOM bindings; keep data constants once
  var CORE = w.__COMPANION_HAJJ_STEPS_CORE__;
  if (!CORE) {
    CORE = w.__COMPANION_HAJJ_STEPS_CORE__ = { version: '20261126H2F' };
  }

  var KEY = 'clarity_hajj_steps_v1';
  var DISC =
    '<p class="hajj-step-disc"><strong>Educational only — not a fatwa.</strong> ' +
    'Madhāhib differ on sequence details and what incurs a penalty. Confirm with a local teacher and official guidance before you travel.</p>';

  function cite(label, href) {
    return '<a class="hajj-cite" href="' + href + '" target="_blank" rel="noopener">' + label + '</a>';
  }

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
      title: 'Iḥrām for ʿUmrah / at mīqāt',
      body:
        '<p>Enter iḥrām from the mīqāt with the intention your teacher gave for your nusk. Men: iḥrām garments. Women: modest dress; face-veil/gloves rules as taught — not from this card alone.</p>' +
        '<p>Begin talbiyah. Educational outline — confirm details with your teacher / official guide.</p>',
      cites: [
        { label: 'Sunnah.com · mīqāt', href: 'https://sunnah.com/search?q=miqat' },
        { label: 'Qurʾān 2:196', href: 'https://quran.com/2/196' },
        { label: 'Do / avoid panel', href: '#hajj-ihram-do-avoid' }
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
      title: 'ʿUmrah — ṭawāf',
      body:
        '<p>For Tamattuʿ, perform ʿUmrah ṭawāf with the conditions and sunan your teacher taught, then two rakʿahs if able in the proper place.</p>' +
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
        '<p>After ʿUmrah rites, release from iḥrām as your teacher taught (shortening or shaving) until iḥrām for Ḥajj on the 8th.</p>',
      cites: [
        { label: 'Sunnah.com · tahallul', href: 'https://sunnah.com/search?q=tahallul' },
        { label: 'Qurʾān 2:196', href: 'https://quran.com/2/196' }
      ]
    },
    hajj_ihram: {
      title: 'Iḥrām for Ḥajj (8th)',
      body:
        '<p>Enter iḥrām for Ḥajj from Makkah (Tamattuʿ) or continue as taught for Qirān/Ifrād. Proceed toward Minā with the pilgrims.</p>',
      cites: [
        { label: 'Sunnah.com · Minā', href: 'https://sunnah.com/search?q=mina%20tarwiyah' },
        { label: 'Qurʾān 2:197', href: 'https://quran.com/2/197' }
      ]
    },
    arafah: {
      title: 'ʿArafah (9th)',
      body:
        '<p>Presence at ʿArafah is the pillar without which Ḥajj is not complete in the way scholars teach. Stand, remember Allah, make duʿāʾ, and follow the timing your group and teacher use.</p>',
      cites: [
        { label: 'Sunnah.com · ʿArafah', href: 'https://sunnah.com/search?q=arafah' },
        { label: 'Qurʾān 2:198', href: 'https://quran.com/2/198' }
      ]
    },
    muzdalifah: {
      title: 'Muzdalifah',
      body:
        '<p>After ʿArafah, go to Muzdalifah. Combine and shorten as taught; rest if able; collect pebbles if that is your group’s practice.</p>',
      cites: [
        { label: 'Sunnah.com · Muzdalifah', href: 'https://sunnah.com/search?q=muzdalifah' },
        { label: 'Qurʾān 2:198', href: 'https://quran.com/2/198' }
      ]
    },
    jamarat: {
      title: 'Stoning the Jamarāt',
      body:
        '<p>Stone as sequenced for your days. Follow crowd safety and the number of pebbles your teacher specified. Disputed timings → ask your scholar.</p>',
      cites: [
        { label: 'Sunnah.com · jamarāt', href: 'https://sunnah.com/search?q=jamarat' },
        { label: 'Qurʾān 2:203', href: 'https://quran.com/2/203' }
      ]
    },
    sacrifice: {
      title: 'Hady / sacrifice (if required)',
      body:
        '<p>Tamattuʿ and Qirān require a hady in the way taught. Confirm what is required for <em>your</em> nusk with a teacher.</p>',
      cites: [
        { label: 'Qurʾān 2:196', href: 'https://quran.com/2/196' },
        { label: 'Sunnah.com · hady', href: 'https://sunnah.com/search?q=hady%20hajj' }
      ]
    },
    halq: {
      title: 'Ḥalq or taqṣīr',
      body:
        '<p>Shave or shorten the hair as taught for release after the rites of the 10th. Women shorten; they do not shave.</p>',
      cites: [
        { label: 'Sunnah.com · shave / shorten', href: 'https://sunnah.com/search?q=shave%20hajj' },
        { label: 'Qurʾān 2:196', href: 'https://quran.com/2/196' }
      ]
    },
    ifadah: {
      title: 'Ṭawāf al-ifāḍah',
      body:
        '<p>Perform the ifāḍah ṭawāf — a pillar of Ḥajj in the way scholars teach — then saʿī if required for your nusk.</p>',
      cites: [
        { label: 'Sunnah.com · ifāḍah', href: 'https://sunnah.com/search?q=tawaf%20ifadah' },
        { label: 'Qurʾān 22:29', href: 'https://quran.com/22/29' }
      ]
    },
    tashriq: {
      title: 'Days of tashrīq',
      body:
        '<p>Remain in Minā for the days of tashrīq as taught; stone on those days. Leaving early has conditions — do not self-issue a ruling from this card.</p>',
      cites: [
        { label: 'Qurʾān 2:203', href: 'https://quran.com/2/203' },
        { label: 'Sunnah.com · tashrīq', href: 'https://sunnah.com/search?q=tashriq' }
      ]
    },
    wada: {
      title: 'Farewell ṭawāf',
      body:
        '<p>Before leaving Makkah, perform the farewell ṭawāf if required in your case (exceptions exist — ask a teacher).</p>',
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
  function byId(id) {
    var r = root();
    return (r.querySelector && r.querySelector('#' + id)) || d.getElementById(id);
  }
  function nusk() {
    var el = byId('hajj-nusk');
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
    return (
      '<p class="hajj-cites"><strong>Tap citations:</strong> ' +
      cites
        .map(function (c) {
          return cite(c.label, c.href);
        })
        .join(' · ') +
      '</p>'
    );
  }

  function panelHtml(key) {
    var step = STEPS[key];
    if (!step) {
      return (
        DISC +
        '<p class="hajj-empty-defect"><strong>Empty step.</strong> Missing content for “' +
        String(key || '') +
        '”. Choose another step.</p>'
      );
    }
    return DISC + '<h4 class="hajj-step-title">' + step.title + '</h4>' + step.body + renderCites(step.cites);
  }

  function fillSelect() {
    var sel = byId('hajj-step-select');
    if (!sel) return false;
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
    return true;
  }

  function renderProgress() {
    var box = byId('hajj-progress');
    if (!box) return;
    var keys = NUSK[nusk()];
    var map = doneSet().map;
    var done = keys.filter(function (k) {
      return !!map[k];
    }).length;
    box.innerHTML =
      '<span class="hajj-prog-text">Progress: ' +
      done +
      ' / ' +
      keys.length +
      ' marked on this device · educational only — not a fatwa</span>' +
      '<span class="hajj-prog-bar" aria-hidden="true"><i style="width:' +
      Math.round((done / Math.max(keys.length, 1)) * 100) +
      '%"></i></span>';
  }

  function showStep(v) {
    var panel = byId('hajj-panel');
    if (!panel) return;
    var sel = byId('hajj-step-select');
    var key = v || (sel && sel.value) || NUSK[nusk()][0];
    if (sel && key && sel.value !== key) {
      try {
        sel.value = key;
      } catch (e) {}
    }
    panel.innerHTML = panelHtml(key);
    if (!panel.textContent || !String(panel.textContent).trim()) {
      panel.innerHTML =
        DISC +
        '<p class="hajj-empty-defect"><strong>Empty panel defect.</strong> Re-select the step or reopen Action.</p>';
    }
    renderProgress();
    panel.querySelectorAll('a[href="#hajj-ihram-do-avoid"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var el = byId('hajj-ihram-do-avoid');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function markDone() {
    var sel = byId('hajj-step-select');
    if (!sel || !sel.value) return;
    var o = doneSet();
    o.map[sel.value] = true;
    saveState(o.st);
    renderProgress();
    // advance to next unmarked
    var keys = NUSK[nusk()];
    var next = keys.find(function (k) {
      return !o.map[k];
    });
    if (next) {
      sel.value = next;
      showStep(next);
    } else {
      showStep(sel.value);
    }
  }
  function markUndone() {
    var sel = byId('hajj-step-select');
    if (!sel || !sel.value) return;
    var o = doneSet();
    delete o.map[sel.value];
    saveState(o.st);
    renderProgress();
    showStep(sel.value);
  }
  function whereAmI() {
    var keys = NUSK[nusk()];
    var map = doneSet().map;
    var next = keys.find(function (k) {
      return !map[k];
    });
    var sel = byId('hajj-step-select');
    if (sel) {
      if (next) sel.value = next;
      showStep(sel.value);
    }
    var panel = byId('hajj-panel');
    if (panel) {
      var old = panel.querySelector('.hajj-where');
      if (old) old.remove();
      var note = d.createElement('p');
      note.className = 'hajj-where';
      note.innerHTML = next
        ? '<strong>Where am I?</strong> Next unmarked step selected. On-device only.'
        : '<strong>Where am I?</strong> All listed steps marked on this device. Still confirm with your teacher.';
      panel.insertBefore(note, panel.firstChild);
      try {
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (e) {}
    }
  }

  function checklistRender() {
    var list = byId('hajj-checklist-list');
    if (!list) return;
    var keys = NUSK[nusk()];
    var map = doneSet().map;
    list.innerHTML = keys
      .map(function (k, i) {
        var ok = map[k] ? '✓' : '○';
        return (
          '<button type="button" class="hajj-check-item" data-hajj-step="' +
          k +
          '"><span>' +
          ok +
          '</span> ' +
          (i + 1) +
          '. ' +
          (STEPS[k] ? STEPS[k].title : k) +
          '</button>'
        );
      })
      .join('');
    var prog = byId('hajj-checklist-progress');
    if (prog) {
      var done = keys.filter(function (k) {
        return !!map[k];
      }).length;
      prog.textContent = done + ' / ' + keys.length + ' marked on this device';
    }
  }

  function bindButtons() {
    var actions = byId('hajj-guide-card') || root();
    if (!actions) return;
    // Prefer data attributes; also rewrite inline onclick to durable globals
    var map = [
      ['hajjMarkDone()', markDone],
      ['hajjMarkUndone()', markUndone],
      ['hajjWhereAmI()', whereAmI],
      ['hajjPrintChecklist()', function () { w.print(); }],
      ['hajjTalbiyah(-1)', function () { w.hajjTalbiyah(-1); }],
      ['hajjTalbiyah(1)', function () { w.hajjTalbiyah(1); }],
      ['hajjPlayTalbiyah()', function () { w.hajjPlayTalbiyah(); }]
    ];
    actions.querySelectorAll('button[onclick]').forEach(function (btn) {
      var oc = btn.getAttribute('onclick') || '';
      map.forEach(function (pair) {
        if (oc.indexOf(pair[0].replace('()', '')) >= 0 || oc.indexOf(pair[0]) >= 0) {
          if (btn.dataset.hajjBound === pair[0]) return;
          btn.dataset.hajjBound = pair[0];
          btn.addEventListener('click', function (e) {
            try {
              pair[1]();
            } catch (err) {
              console && console.warn && console.warn('[hajj]', err);
            }
          });
        }
      });
    });
    // Checklist open
    var list = byId('hajj-checklist-list');
    if (list && !list.dataset.hajjBound) {
      list.dataset.hajjBound = '1';
      list.addEventListener('click', function (e) {
        var t = e.target.closest('[data-hajj-step]');
        if (!t) return;
        var sel = byId('hajj-step-select');
        if (sel) {
          sel.value = t.getAttribute('data-hajj-step');
          showStep(sel.value);
        }
        var g = byId('hajj-guide-card');
        if (g) g.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  // Durable globals (overwrite stubs every boot)
  w.hajjShowStep = showStep;
  w.hajjMarkDone = markDone;
  w.hajjMarkUndone = markUndone;
  w.hajjWhereAmI = whereAmI;
  w.hajjChecklistRender = checklistRender;
  w.hajjPrintChecklist = function () {
    w.print();
  };
  w.hajjChecklistPrint = w.hajjPrintChecklist;
  w.hajjChecklistReset = function () {
    var o = doneSet();
    o.st[o.n] = {};
    saveState(o.st);
    renderProgress();
    checklistRender();
  };

  w.hajjTalbiyah = function (delta) {
    var el = byId('hajj-talbiyah-count');
    if (!el) return;
    var n = parseInt(el.textContent, 10) || 0;
    n = Math.max(0, n + (delta || 0));
    el.textContent = String(n);
    try {
      w.localStorage.setItem('clarity_hajj_talbiyah_v1', String(n));
    } catch (e) {}
  };
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
  w.hajjLoadEpisode = function (id) {
    if (!id) return;
    var frame = d.getElementById('hajj-yt-frame-frame');
    var open = d.getElementById('hajj-yt-open');
    if (open) open.href = 'https://youtu.be/' + id;
    var host = d.querySelector('[data-embed-id="hajj-yt-frame"]');
    if (host) host.open = true;
    if (frame) {
      if (frame.tagName === 'IFRAME') {
        frame.src = 'https://www.youtube-nocookie.com/embed/' + id;
      }
    }
  };

  function boot() {
    var sel = byId('hajj-step-select');
    if (!sel) return false;
    fillSelect();
    if (!sel._hajjChangeBound) {
      sel._hajjChangeBound = true;
      sel.addEventListener('change', function () {
        showStep(sel.value);
      });
    }
    var nuskEl = byId('hajj-nusk');
    if (nuskEl && !nuskEl._hajjChangeBound) {
      nuskEl._hajjChangeBound = true;
      nuskEl.addEventListener('change', function () {
        fillSelect();
        showStep();
        checklistRender();
      });
    }
    try {
      var tc = w.localStorage.getItem('clarity_hajj_talbiyah_v1');
      var el = byId('hajj-talbiyah-count');
      if (el && tc) el.textContent = tc;
    } catch (e) {}
    showStep();
    renderProgress();
    checklistRender();
    bindButtons();
    return true;
  }

  function scheduleBoot() {
    if (boot()) return;
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      if (boot() || tries > 40) clearInterval(t);
    }, 250);
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', scheduleBoot);
  else scheduleBoot();

  // Shell remounts Action into #cs-mount without running tab scripts again
  try {
    var mo = new MutationObserver(function () {
      if (byId('hajj-step-select')) scheduleBoot();
    });
    mo.observe(d.documentElement, { childList: true, subtree: true });
  } catch (e) {}

  // Also listen for custom companion tab events if present
  ['cs-tab-loaded', 'clarity-tab-mounted', 'hashchange'].forEach(function (ev) {
    try {
      w.addEventListener(ev, function () {
        setTimeout(scheduleBoot, 50);
      });
    } catch (e) {}
  });
})(window, document);
