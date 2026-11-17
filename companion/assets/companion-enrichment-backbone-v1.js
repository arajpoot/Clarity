/*! companion-enrichment-backbone-v1 · P17 · last-word integrity · educational only
 * Patches any prior ALLOW-hide governance. Does not strip educational cards.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_ENRICHMENT_BACKBONE_P17__) return;
  w.__COMPANION_ENRICHMENT_BACKBONE_P17__ = true;

  function root() { return d.getElementById("cs-mount"); }

  function showCards() {
    var m = root(); if (!m) return 0;
    var n = 0;
    m.querySelectorAll("[id$='-card'], section.cs-plaque:not([data-cs-path-only]), .cs-plaque[data-cs-primary], .cs-rich-legacy-wrap, .cs-rich-legacy, .dl-card, [data-rrra]").forEach(function (el) {
      if (el.hasAttribute("data-cs-path-only")) return;
      if (el.getAttribute("data-arch-counts-only") === "1") return; /* shallow arch strip ok to hide */
      try {
        el.style.removeProperty("display");
        el.style.setProperty("display", "block", "important");
        el.style.setProperty("visibility", "visible", "important");
        el.style.setProperty("opacity", "1", "important");
        el.removeAttribute("hidden");
        el.classList.remove("cpp-path-hidden", "is-path-hidden", "arch-hidden", "nuros-deferred");
        /* nuros-deferred was dim-only but some CSS may collapse it */
        n++;
      } catch (e) {}
    });
    return n;
  }

  function pathOnly() {
    var m = root(); if (!m) return;
    var p = "dai";
    try {
      var b = d.querySelector("[data-cs-path].is-active, button[data-cs-path].active");
      if (b) p = (b.getAttribute("data-cs-path") || "dai").toLowerCase();
    } catch (e) {}
    if (p === "daily") p = "practicing";
    m.querySelectorAll("[data-cs-path-only]").forEach(function (el) {
      var want = (el.getAttribute("data-cs-path-only") || "").toLowerCase();
      var ok = want === p || want === "all" || (p === "practicing" && want === "daily");
      if (ok) {
        el.style.setProperty("display", "block", "important");
        el.removeAttribute("hidden");
      } else {
        el.style.setProperty("display", "none", "important");
        el.setAttribute("hidden", "");
      }
    });
  }

  function honestApply() {
    showCards();
    pathOnly();
  }

  function patchGovernance() {
    var G = w.ClarityPathGovernanceShell;
    if (!G) {
      w.ClarityPathGovernanceShell = { apply: honestApply, applyPathGovernance: honestApply, honest: true, version: "P17-backbone-shim" };
      return;
    }
    G.apply = honestApply;
    G.applyPathGovernance = honestApply;
    G.honest = true;
    G.version = "P17-backbone-patched";
    /* neuter ALLOW hide if still present */
    try { G.allow = {}; } catch (e) {}
  }

  function patchHygiene() {
    /* prevent hygiene from hiding educational cards */
    var m = root(); if (!m) return;
    m.querySelectorAll("[id$='-card'][hidden]").forEach(function (el) {
      if (!el.hasAttribute("data-cs-path-only")) {
        el.removeAttribute("hidden");
        el.style.removeProperty("display");
      }
    });
  }

  function tick() {
    patchGovernance();
    honestApply();
    patchHygiene();
  }

  function boot() {
    tick();
    var m = root();
    if (m) {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(tick, 30);
      }).observe(m, { childList: true, subtree: true });
    }
    d.addEventListener("click", function () { setTimeout(tick, 20); setTimeout(tick, 120); }, true);
    /* sustained integrity — first 8s after load defeat late scripts */
    var i = 0;
    var iv = setInterval(function () {
      tick();
      if (++i > 40) clearInterval(iv);
    }, 200);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityEnrichmentBackbone = { tick: tick, showCards: showCards, version: "P17" };
})(window, document);
