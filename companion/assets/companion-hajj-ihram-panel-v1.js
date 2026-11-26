/*! companion-hajj-ihram-panel-v1.js — additive injector; educational only — not a fatwa */
(function () {
  'use strict';
  if (window.__clarityHajjIhramPanelV1) return;
  window.__clarityHajjIhramPanelV1 = true;

  function ensurePanel() {
    if (document.getElementById('hajj-ihram-do-avoid')) return;
    var checklist = document.getElementById('hajj-checklist-card');
    var guide = document.getElementById('hajj-guide-card');
    if (!guide && !checklist) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = document.getElementById('clarity-hajj-ihram-panel-src')
      ? document.getElementById('clarity-hajj-ihram-panel-src').innerHTML
      : '';
    // If no template, skip (HTML already in tab fragment)
    if (!wrap.firstElementChild) return;
    var node = wrap.firstElementChild;
    if (checklist && checklist.parentNode) {
      checklist.parentNode.insertBefore(node, checklist);
    } else if (guide && guide.parentNode) {
      if (guide.nextSibling) guide.parentNode.insertBefore(node, guide.nextSibling);
      else guide.parentNode.appendChild(node);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensurePanel);
  } else {
    ensurePanel();
  }
  // Companion tab remounts
  try {
    var mo = new MutationObserver(function () { ensurePanel(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { try { mo.disconnect(); } catch (e) {} }, 15000);
  } catch (e) {}
})();
