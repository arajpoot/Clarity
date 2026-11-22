/*! cu-bots-harmony-v1 · U58 — dedupe bots page chrome/body noise */
(function (w, d) {
  "use strict";
  if (w.__CU_BOTS_HARMONY_V1__) return;
  w.__CU_BOTS_HARMONY_V1__ = true;
  if (((location.pathname || "").replace(/\/+$/, "") || "") !== "/campus/bots") return;

  function hide(el) {
    if (!el) return;
    try {
      el.style.setProperty("display", "none", "important");
      el.setAttribute("data-bots-deduped", "1");
    } catch (e) {}
  }

  function dedupe() {
    // Keep first command center / tutorial / faculty / research / hud only
    ["cu-bots-command", "cu-vle-tutorial", "cu-vle-faculty-research", "cu-vle-research", "cu-vle-hud"].forEach(function (id) {
      var nodes = d.querySelectorAll("#" + id);
      for (var i = 1; i < nodes.length; i++) hide(nodes[i]);
    });
    // Hide legacy noisy cit-scan + duplicate "Campus bots" article cards after modern stack
    hide(d.getElementById("cit-scan"));
    var modern = d.getElementById("cu-bots-command") || d.getElementById("cu-vle-tutorial");
    if (modern) {
      d.querySelectorAll("main section, main article, main .card, main .uni-card").forEach(function (el) {
        if (el.closest("#cu-bots-command, #cu-vle-tutorial, #cu-vle-faculty-research, #cu-vle-research, #cu-vle-hud, #cu-path-conductor, footer, .cu-foot")) return;
        var t = (el.textContent || "").slice(0, 200);
        if (/Campus bots\s*·\s*on-device ops/i.test(t) || /Resurrected workers tools/i.test(t)) hide(el);
        if (/Workers ops pack resurrected from vault/i.test(t)) hide(el);
      });
    }
  }

  function boot() {
    dedupe();
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  [200, 600, 1200, 2500].forEach(function (t) {
    setTimeout(boot, t);
  });
})(window, document);
