/*! companion-action-lmr-merge-v1.js · B3
 * Single Action LMR card at #tj-lmr · hide duplicate · re-wire nx-tj-lmr
 * Craft keeps full atelier at /craft/tajweed/
 * Educational score only — not a qāriʾ grade — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_LMR_MERGE_B3__) return;
  w.__CLARITY_LMR_MERGE_B3__ = true;

  function $(id) {
    return d.getElementById(id);
  }

  function killDuplicate() {
    var dup = $("action-tj-lmr-panel");
    if (dup && dup.parentNode) dup.parentNode.removeChild(dup);
    var host = $("tj-lmr-host");
    if (host && host.parentNode && !$("tj-lmr")) {
      /* only remove empty host outside primary */
    }
    /* hide any leftover bridge shells */
    d.querySelectorAll(".phase-tlmr").forEach(function (el) {
      if (el.id !== "tj-lmr-panel" && !el.querySelector("#tj-lmr")) {
        el.style.display = "none";
      }
    });
  }

  function ensurePrimaryChrome() {
    var root = $("tj-lmr");
    if (!root) return false;
    /* If deep-studio details closed, open LMR panel */
    var panel = $("tj-lmr-panel");
    if (panel && panel.tagName === "DETAILS") panel.open = true;

    function need(id, html) {
      if ($(id)) return;
      var wrap = d.createElement("div");
      wrap.innerHTML = html;
      while (wrap.firstChild) root.appendChild(wrap.firstChild);
    }

    if (!$("tj-lmr-play-master")) {
      need(
        "tj-lmr-play-master",
        '<div style="display:flex;flex-wrap:wrap;gap:.4rem;margin:.5rem 0">' +
          '<button type="button" class="btn primary" id="tj-lmr-play-master">▶ Play master (Ḥuṣarī)</button>' +
          '<button type="button" class="btn" id="tj-lmr-rec-btn">● Record</button>' +
          '<button type="button" class="btn" id="tj-lmr-rec-stop">Stop</button>' +
          '<button type="button" class="btn" id="tj-lmr-rec-play">Play take</button>' +
          '<button type="button" class="btn" id="tj-lmr-score-btn">★ Score vs master</button>' +
          "</div>" +
          '<audio id="tj-lmr-master-audio" controls preload="none" style="width:100%;margin:.35rem 0"></audio>' +
          '<audio id="tj-lmr-user-audio" controls preload="none" style="width:100%;display:none;margin:.35rem 0"></audio>' +
          '<p id="tj-lmr-rec-status" class="td-src"></p>' +
          '<div id="tj-lmr-score-card" class="td-src"><span id="tj-lmr-score-val">—</span> <span id="tj-lmr-score-note"></span></div>' +
          '<p class="td-src">Educational duration/match proxy — not a qāriʾ grade. Prefer a teacher.</p>'
      );
    }
    if (!$("tj-lmr-fetch") && $("tj-lmr-surah")) {
      /* fetch may use different button label */
    }
    return true;
  }

  function loadScript(src, cb) {
    var s = d.createElement("script");
    s.src = src;
    s.onload = function () {
      if (cb) cb();
    };
    s.onerror = function () {
      if (cb) cb(new Error("load"));
    };
    d.head.appendChild(s);
  }

  function rewire() {
    /* nx boots on DOMContentLoaded only once — re-trigger by synthetic load of wire path */
    try {
      if (typeof w.craftTajweedMountLmrShell === "function") w.craftTajweedMountLmrShell();
    } catch (e) {}
    ensurePrimaryChrome();
    /* soft-reload nx to re-bind if wire already ran before DOM ready */
    var existing = d.querySelector('script[data-lmr-merge-nx]');
    if (!existing) {
      var src = "/craft/assets/vendor/nx-tj-lmr-js-v1.js?v=20261126B3";
      var s = d.createElement("script");
      s.src = src;
      s.setAttribute("data-lmr-merge-nx", "1");
      d.body.appendChild(s);
    }
  }

  function boot() {
    killDuplicate();
    ensurePrimaryChrome();
    rewire();
    setTimeout(killDuplicate, 300);
    setTimeout(ensurePrimaryChrome, 500);
    setTimeout(rewire, 800);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
