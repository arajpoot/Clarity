/* CD-B1 — mark next salah row for mobile hero styling */
(function () {
  "use strict";
  if (window.__CLARITY_BANNER_MOBILE_V1__) return;
  window.__CLARITY_BANNER_MOBILE_V1__ = true;

  function markNext() {
    var list = document.getElementById("salah-times-list");
    if (!list) return;
    var items = list.querySelectorAll("li");
    if (!items.length) return;
    items.forEach(function (li) {
      li.classList.remove("salah-next");
    });
    /* Prefer explicit next/current class from existing logic */
    var explicit =
      list.querySelector("li.next, li.current, li.active, li[data-next='1']") ||
      null;
    if (explicit) {
      explicit.classList.add("salah-next");
      return;
    }
    /* Heuristic: first time still in the future vs now — parse HH:MM */
    var now = new Date();
    var minsNow = now.getHours() * 60 + now.getMinutes();
    var chosen = null;
    items.forEach(function (li) {
      var tEl = li.querySelector(".salah-time");
      if (!tEl) return;
      var m = (tEl.textContent || "").match(/(\d{1,2}):(\d{2})/);
      if (!m) return;
      var mins = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
      if (mins >= minsNow && !chosen) chosen = li;
    });
    if (!chosen && items.length) chosen = items[0];
    if (chosen) chosen.classList.add("salah-next");
  }

  function boot() {
    markNext();
    var list = document.getElementById("salah-times-list");
    if (list && !list.__cdb1Obs) {
      list.__cdb1Obs = true;
      try {
        var obs = new MutationObserver(function () {
          markNext();
        });
        obs.observe(list, { childList: true, subtree: true, characterData: true });
      } catch (e) {}
    }
    setInterval(markNext, 60000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else boot();
})();
