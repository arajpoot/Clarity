/*! clarity-amana-entry-v1 · Companion room only · C2 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_ENTRY_V1__) return;
  w.__CLARITY_AMANA_ENTRY_V1__ = true;

  function injectCue() {
    if (document.getElementById("clarity-amana-entry-cue")) return;
    var host = document.getElementById("tab-notes") ||
      document.querySelector("[data-rail-tab='notes']") ||
      document.querySelector(".amana-gate, #amana-vault-gate, #notes-shell");
    /* floating cue near top duo if no tab yet */
    var bar = document.createElement("div");
    bar.id = "clarity-amana-entry-cue";
    bar.setAttribute("data-clarity-room", "companion");
    bar.innerHTML = '<button type="button" class="btn-soft" id="clarity-amana-open-btn" data-enter-amana="1">' +
      "🔐 Amānah vault</button>" +
      '<span class="amana-entry-hint">Private · on this device · entered from Companion only · not legal advice</span>';
    bar.style.cssText = "display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;justify-content:center;" +
      "margin:0.5rem auto;padding:0.45rem 0.75rem;max-width:42rem;border-radius:12px;" +
      "border:1px solid rgba(212,180,90,0.3);background:rgba(15,76,58,0.12);font-size:0.8rem";
    var duo = document.getElementById("clarity-top-duo");
    if (duo && duo.parentNode) duo.parentNode.insertBefore(bar, duo.nextSibling);
    else if (document.body) document.body.insertBefore(bar, document.body.firstChild);

    var btn = document.getElementById("clarity-amana-open-btn");
    if (btn && !btn.__bound) {
      btn.__bound = true;
      btn.addEventListener("click", function () {
        if (typeof w.ClarityEnterAmana === "function") w.ClarityEnterAmana({ hash: "notes" });
        else if (typeof w.ClarityLoadAmanaSealed === "function") w.ClarityLoadAmanaSealed();
        try { w.location.hash = "notes"; } catch (e) {}
      });
    }
  }

  function boot() {
    try {
      if (document.documentElement.getAttribute("data-clarity-room") === "companion" ||
          (w.location.pathname || "").indexOf("/companion") === 0) {
        injectCue();
      }
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
