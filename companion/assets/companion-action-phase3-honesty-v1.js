/*! companion-action-phase3-honesty-v1.js
 * Tongue / Fire / Hifẓ — tap citations, Arabic primary, no empty practice card
 * Educational only — not a fatwa.
 */
(function (w, d) {
  'use strict';
  if (w.__COMPANION_ACTION_PHASE3_HONESTY__) return;
  w.__COMPANION_ACTION_PHASE3_HONESTY__ = true;

  function syncHifzCite() {
    var meta = d.getElementById('hifz-meta');
    var link = d.getElementById('hifz-quran-link');
    var ar = d.getElementById('hifz-arabic');
    var tr = d.getElementById('hifz-translation');
    if (!link) return;
    var s = 1, a = 1;
    if (meta && meta.textContent) {
      var m = meta.textContent.match(/(\d+)\s*:\s*(\d+)/);
      if (m) { s = parseInt(m[1], 10); a = parseInt(m[2], 10); }
    }
    var surahEl = d.getElementById('hifz-surah');
    var ayahEl = d.getElementById('hifz-ayah-num');
    if (surahEl && surahEl.value) s = parseInt(surahEl.value, 10) || s;
    if (ayahEl && ayahEl.value) a = parseInt(ayahEl.value, 10) || a;
    link.href = 'https://quran.com/' + s + '/' + a;
    link.textContent = 'Open Qurʾān ' + s + ':' + a + ' on Quran.com';
    // Empty practice defect: arabic must not be blank after load
    if (ar && !(ar.textContent || '').trim()) {
      ar.textContent = '…';
      var st = d.getElementById('hifz-status');
      if (st) st.textContent = 'Empty āyah panel — retry load. Educational only.';
    }
    if (tr && !tr.getAttribute('data-bridge-note')) {
      tr.setAttribute('data-bridge-note', '1');
    }
  }

  // Wrap clarityHifz.load if present
  function wrapHifz() {
    if (!w.clarityHifz || w.clarityHifz.__phase3) return;
    var api = w.clarityHifz;
    var orig = api.load;
    if (typeof orig === 'function') {
      api.load = function () {
        var ret = orig.apply(api, arguments);
        try {
          if (ret && typeof ret.then === 'function') {
            ret.then(function () { setTimeout(syncHifzCite, 30); });
          } else {
            setTimeout(syncHifzCite, 80);
          }
        } catch (e) { setTimeout(syncHifzCite, 80); }
        return ret;
      };
    }
    api.__phase3 = true;
  }

  function boot() {
    wrapHifz();
    syncHifzCite();
    ['hifz-surah', 'hifz-ayah-num'].forEach(function (id) {
      var el = d.getElementById(id);
      if (el && !el._p3) {
        el._p3 = true;
        el.addEventListener('change', function () { setTimeout(syncHifzCite, 100); });
      }
    });
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else boot();
  setInterval(wrapHifz, 1000);
  try {
    var mo = new MutationObserver(function () {
      if (d.getElementById('hifz-meta')) syncHifzCite();
      wrapHifz();
    });
    mo.observe(d.documentElement, { childList: true, subtree: true });
    setTimeout(function () { try { mo.disconnect(); } catch (e) {} }, 15000);
  } catch (e) {}
})(window, document);
