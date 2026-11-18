/*! companion-siq-mount-v1 — rehydrate Sharia IQ / Daily Fiqh when Reminder tab mounts
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_SIQ_MOUNT_V1__) return;
  w.__CLARITY_SIQ_MOUNT_V1__ = true;

  function tryRender() {
    var stage = d.getElementById("fq-stage");
    if (!stage) return false;
    try {
      if (typeof w.fqForceNewDeck === "function") {
        if (!stage.innerHTML || !String(stage.innerHTML).trim() || !stage.querySelector(".fq-choice")) {
          w.fqForceNewDeck();
        }
        return true;
      }
    } catch (e) {}
    return false;
  }

  if (typeof w.siqStart !== "function") {
    w.siqStart = function () {
      if (typeof w.siqShow === "function") w.siqShow("iq");
      var stage = d.getElementById("siq-iq-stage");
      if (stage) {
        try { stage.hidden = false; stage.removeAttribute("hidden"); } catch (e) {}
      }
    };
  }

  function schedule() {
    tryRender();
    setTimeout(tryRender, 150);
    setTimeout(tryRender, 500);
    setTimeout(tryRender, 1200);
    setTimeout(tryRender, 2500);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", schedule);
  else schedule();

  try {
    var mo = new MutationObserver(function () {
      var stage = d.getElementById("fq-stage");
      if (stage && (!stage.innerHTML || !String(stage.innerHTML).trim())) tryRender();
    });
    mo.observe(d.documentElement, { childList: true, subtree: true });
  } catch (e) {}

  // poll briefly after load for late tab body inject
  var n = 0;
  var iv = setInterval(function () {
    n++;
    if (tryRender() || n > 40) clearInterval(iv);
  }, 250);

  d.addEventListener("cs:tab-shown", function (ev) {
    try {
      if (ev && ev.detail && String(ev.detail.tab || "").toLowerCase() === "reminder") schedule();
    } catch (e) {}
  });

  d.addEventListener("click", function (ev) {
    var t = ev.target;
    if (!t || !t.closest) return;
    var el = t.closest("[data-tab], [data-cs-tab], button, a");
    if (!el) return;
    var s = ((el.getAttribute("data-tab") || "") + " " + (el.getAttribute("data-cs-tab") || "") + " " + (el.textContent || "")).toLowerCase();
    if (s.indexOf("reminder") >= 0) setTimeout(schedule, 250);
  });
})(window, document);
