/*! companion-action-phase6-polish-v1.js
 * Visibility foundation smoke + soft path · Action only
 * Educational only — not a fatwa.
 */
(function (w, d) {
  'use strict';
  if (w.__COMPANION_ACTION_PHASE6__) return;
  w.__COMPANION_ACTION_PHASE6__ = true;

  var REQUIRED = [
    { id: 'guard-tongue-card', name: 'Tongue' },
    { id: 'hell-sins-card', name: 'Fire warnings' },
    { id: 'hifz-coach-card', name: 'Hifẓ' },
    { id: 'seerah-mirror-card', name: 'Seerah Mirror' },
    { id: 'tajweed-path-card', name: 'Tajweed path' },
    { id: 'tj-deep-studio', name: 'Tajweed studio' },
    { id: 'hajj-guide-card', name: 'Hajj guide' },
    { id: 'hajj-ihram-do-avoid', name: 'Iḥrām do/avoid' },
    { id: 'hajj-checklist-card', name: 'Hajj checklist' }
  ];

  function vis(el) {
    if (!el) return false;
    var cs = w.getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function smoke() {
    var report = { ok: [], bad: [], ts: Date.now() };
    REQUIRED.forEach(function (item) {
      var el = d.getElementById(item.id);
      if (el && vis(el)) report.ok.push(item.name);
      else report.bad.push(item.name + (!el ? ' (missing)' : ' (not visible)'));
    });
    // Seerah not stuck on Loading
    var title = d.getElementById('sm-title');
    if (title && /loading/i.test(title.textContent || '')) {
      report.bad.push('Seerah stuck on Loading');
    } else if (title) {
      report.ok.push('Seerah titled');
    }
    // Hifz arabic non-empty
    var ar = d.getElementById('hifz-arabic');
    if (ar && (ar.textContent || '').trim().length > 2) report.ok.push('Hifẓ Arabic');
    else if (ar) report.bad.push('Hifẓ Arabic empty');
    // Hajj APIs
    if (typeof w.hajjWhereAmI === 'function') report.ok.push('hajjWhereAmI');
    else report.bad.push('hajjWhereAmI missing');
    if (typeof w.hajjShowStep === 'function') report.ok.push('hajjShowStep');
    w.__ACTION_VISIBILITY_SMOKE__ = report;
    return report;
  }

  function paintSmokeChip(report) {
    var host = d.getElementById('action-section-count') || d.querySelector('.cs-hub-whisper');
    if (!host) return;
    var chip = d.getElementById('phase6-smoke-chip');
    if (!chip) {
      chip = d.createElement('span');
      chip.id = 'phase6-smoke-chip';
      chip.style.cssText = 'display:inline-block;margin-left:.35rem;font-size:.72rem;opacity:.9';
      host.appendChild(chip);
    }
    if (report.bad.length === 0) {
      chip.textContent = '· visibility smoke green';
      chip.style.color = '#8fd19e';
    } else {
      chip.textContent = '· visibility: ' + report.bad.length + ' issue(s)';
      chip.style.color = '#f0c0c0';
      chip.title = report.bad.join('; ');
    }
  }

  function softPath() {
    // Soft emphasis only — never remove Archive3 nodes
    try {
      var path = (w.localStorage.getItem('clarity_path_v1') || '').toLowerCase();
      if (!path) return;
      d.documentElement.setAttribute('data-path-soft', '1');
    } catch (e) {}
  }

  function boot() {
    softPath();
    var r = smoke();
    paintSmokeChip(r);
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(boot, 800);
  setTimeout(boot, 2500);
  try {
    var mo = new MutationObserver(function () { setTimeout(boot, 100); });
    mo.observe(d.documentElement, { childList: true, subtree: true });
    setTimeout(function () { try { mo.disconnect(); } catch (e) {} }, 12000);
  } catch (e) {}

  w.clarityActionVisibilitySmoke = smoke;
})(window, document);
