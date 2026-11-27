/*! companion-action-phase4-tajweed-v1.js
 * Path counts match visibility · Craft isolation · empty rule guard
 * Educational only — not a fatwa.
 */
(function (w, d) {
  'use strict';
  if (w.__COMPANION_ACTION_PHASE4_TJ__) return;
  w.__COMPANION_ACTION_PHASE4_TJ__ = true;

  function root() { return d.getElementById('cs-mount') || d; }
  function q(sel) { return root().querySelector(sel) || d.querySelector(sel); }

  function countLessons() {
    var box = q('#tajweed-path-card') || q('#tj-deep-studio') || root();
    var checks = box.querySelectorAll('input[type="checkbox"][data-tj-lesson], input[type="checkbox"].tj-lesson, .tj-lesson input[type="checkbox"]');
    if (checks.length) return { total: checks.length, done: [].slice.call(checks).filter(function (c) { return c.checked; }).length };
    // fallback: list items in path
    var items = box.querySelectorAll('.tj-lesson, [data-tj-lesson], #tj-rule-grid .tj-rule');
    return { total: items.length, done: 0 };
  }

  function syncProgress() {
    var label = q('#tj-overall-label');
    var fill = q('#tj-overall-fill');
    var c = countLessons();
    if (label) {
      if (c.total > 0) label.textContent = c.done + ' / ' + c.total + ' lessons';
      else label.textContent = 'Lessons appear when the path list is rendered · on-device';
    }
    if (fill && c.total > 0) {
      fill.style.width = Math.round((c.done / c.total) * 100) + '%';
    }
  }

  function emptyRulesGuard() {
    var grid = q('#tj-rule-grid');
    var empty = q('#tj-rule-empty');
    if (!grid || !empty) return;
    var has = grid.children.length > 0;
    empty.style.display = has ? 'none' : 'block';
  }

  function honestSectionCount() {
    var el = q('#action-section-count');
    if (!el) return;
    var ids = [
      'guard-tongue-card','hell-sins-card','hifz-coach-card','seerah-mirror-card',
      'tajweed-live-card','tajweed-path-card','tj-deep-studio','hajj-guide-card',
      'hajj-ihram-do-avoid','hajj-checklist-card'
    ];
    var n = ids.filter(function (id) { return !!d.getElementById(id); }).length;
    if (n > 0) el.textContent = n + ' primary modules visible';
  }

  function boot() {
    syncProgress();
    emptyRulesGuard();
    honestSectionCount();
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else boot();
  setInterval(function () { syncProgress(); emptyRulesGuard(); }, 2000);
  try {
    var mo = new MutationObserver(boot);
    mo.observe(d.documentElement, { childList: true, subtree: true });
    setTimeout(function () { try { mo.disconnect(); } catch (e) {} }, 12000);
  } catch (e) {}
})(window, document);
