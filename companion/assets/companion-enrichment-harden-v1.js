/*! companion-enrichment-harden-v1
 * Path may emphasize + filter data-cs-path-only; never thin [id$=-card] on refresh.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_ENRICHMENT_HARDEN_V1__) return;
  w.__COMPANION_ENRICHMENT_HARDEN_V1__ = true;

  function mount() { return d.getElementById("cs-mount"); }

  function showCards(root) {
    if (!root) return 0;
    var n = 0;
    root.querySelectorAll("[id$='-card'], .cs-plaque[data-cs-primary], section.cs-plaque, .cs-rich-legacy-wrap, .cs-rich-legacy, [data-rrra]").forEach(function (el) {
      if (el.hasAttribute("data-cs-path-only")) return;
      try {
        if (el.style && el.style.display === "none") { el.style.removeProperty("display"); n++; }
        el.removeAttribute("hidden");
        el.classList.remove("cpp-path-hidden", "is-path-hidden");
      } catch (e) {}
    });
    root.querySelectorAll("[style*='display: none'], [style*='display:none']").forEach(function (el) {
      if (el.hasAttribute("data-cs-path-only")) return;
      if (el.tagName === "SCRIPT" || el.tagName === "STYLE") return;
      try {
        el.style.removeProperty("display");
        el.classList.remove("cpp-path-hidden");
        el.removeAttribute("hidden");
        n++;
      } catch (e2) {}
    });
    return n;
  }

  function filterPathOnly(root, path) {
    if (!root) return;
    var p = path || "dai";
    if (p === "daily") p = "practicing";
    root.querySelectorAll("[data-cs-path-only]").forEach(function (el) {
      var want = el.getAttribute("data-cs-path-only");
      if (!want) return;
      var match = (want === p) || (p === "practicing" && want === "daily");
      if (match) {
        el.style.removeProperty("display");
        el.removeAttribute("hidden");
        el.classList.remove("cpp-path-hidden");
      } else {
        el.style.display = "none";
      }
    });
  }

  function currentPath() {
    try {
      var btn = d.querySelector("[data-cs-path].is-active, .cs-path button.is-active, button[data-cs-path].active");
      if (btn) return btn.getAttribute("data-cs-path") || "dai";
    } catch (e) {}
    try { return localStorage.getItem("cu_companion_path_v1") || "dai"; } catch (e2) {}
    return "dai";
  }

  function apply() {
    var root = mount();
    if (!root) return;
    showCards(root);
    filterPathOnly(root, currentPath());
  }

  function patchGov() {
    try {
      var G = w.ClarityPathGovernanceShell;
      if (!G || G.__enrichmentHardened) return;
      if (typeof G.applyPathGovernance === "function") {
        var o = G.applyPathGovernance.bind(G);
        G.applyPathGovernance = function () {
          var r = o.apply(this, arguments);
          setTimeout(apply, 0);
          setTimeout(apply, 60);
          setTimeout(apply, 250);
          return r;
        };
        G.__enrichmentHardened = true;
      }
    } catch (e) {}
  }

  function boot() {
    patchGov();
    apply();
    var m = mount();
    if (m) {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(function () { patchGov(); apply(); }, 50);
      }).observe(m, { childList: true });
    }
    [0, 100, 300, 700, 1500, 3000].forEach(function (ms) {
      setTimeout(function () { patchGov(); apply(); }, ms);
    });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityEnrichmentHarden = { apply: apply, showCards: showCards };
})(window, document);
