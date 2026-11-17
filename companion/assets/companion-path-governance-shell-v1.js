/*! companion-path-governance-shell-v1
 * HONEST REPAIR P16 · path may emphasize; must NOT exclusive-hide educational cards
 * Only data-cs-path-only plaques are gated by path.
 * All [id$=-card] / primary plaques stay visible on every path (dai = full set in body).
 * Educational only — not a fatwa. Governance enrichment clause.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_PATH_GOV_SHELL_V1__) {
    /* allow re-patch if old hide version loaded first — force honest apply */
  }
  w.__COMPANION_PATH_GOV_SHELL_V1__ = true;
  w.__COMPANION_PATH_GOV_HONEST_P16__ = true;

  var ORDER = ["seeker", "new_muslim", "practicing", "dai"];

  /* Emphasis sets (optional UI class only — never display:none) */
  var EMPHASIS = {
    seeker: { "beautiful-names-card":1,"samina-ataana-card":1,"commands-card":1,"mercy-path-card":1,"tawbah-nasuhah-card":1,"building-pillars-card":1,"guard-tongue-card":1,"furnish-grave-card":1 },
    new_muslim: { "building-pillars-card":1,"commands-card":1,"samina-ataana-card":1,"tawbah-nasuhah-card":1,"new-muslim-foundations-card":1,"salah-starter-card":1 },
    practicing: { "steady-deeds-card":1,"guard-tongue-card":1,"weekly-review-card":1,"tajweed-live-card":1,"beautiful-names-card":1 },
    dai: {}
  };
  EMPHASIS.daily = EMPHASIS.practicing;

  function normPath(g) {
    g = String(g || "dai").toLowerCase().replace(/\s+/g, "_");
    if (g === "daily" || g === "daily_muslim") return "practicing";
    if (g === "new" || g === "newmuslim") return "new_muslim";
    if (ORDER.indexOf(g) >= 0) return g;
    return "dai";
  }

  function gate() {
    try {
      var b = d.querySelector("[data-cs-path].is-active, button[data-cs-path].active");
      if (b) return normPath(b.getAttribute("data-cs-path"));
    } catch (e) {}
    try {
      return normPath(localStorage.getItem("cu_companion_path_v1") || "dai");
    } catch (e2) {}
    return "dai";
  }

  function showEl(el) {
    if (!el) return;
    try {
      el.style.removeProperty("display");
      el.removeAttribute("hidden");
      el.classList.remove("cpp-path-hidden", "is-path-hidden", "arch-hidden");
    } catch (e) {}
  }

  function apply(g) {
    g = normPath(g || gate());
    var root = d.getElementById("cs-mount") || d;
    var emph = EMPHASIS[g] || {};

    /* 1) ALWAYS show educational cards / primary plaques */
    root.querySelectorAll("[id$='-card'], section.cs-plaque:not([data-cs-path-only]), .cs-plaque[data-cs-primary], .cs-rich-legacy-wrap, .cs-rich-legacy, .dl-card").forEach(function (el) {
      if (el.hasAttribute("data-cs-path-only")) return;
      showEl(el);
      var id = el.id || "";
      if (id && emph[id]) {
        el.classList.add("is-path-primary");
        el.classList.remove("is-path-soft");
      } else if (id && Object.keys(emph).length) {
        el.classList.add("is-path-soft");
        el.classList.remove("is-path-primary");
      } else {
        el.classList.remove("is-path-soft");
        el.classList.add("is-path-primary");
      }
    });

    /* 2) Path-only tips: only active path */
    root.querySelectorAll("[data-cs-path-only]").forEach(function (el) {
      var only = (el.getAttribute("data-cs-path-only") || "").toLowerCase().replace(/\s+/g, "_");
      var ok = only === g || only === "all" || (g === "practicing" && only === "daily");
      if (ok) {
        showEl(el);
        el.style.setProperty("display", "block", "important");
      } else {
        el.style.setProperty("display", "none", "important");
        el.setAttribute("hidden", "");
      }
    });

    /* 3) Path button active state */
    d.querySelectorAll("[data-cs-path]").forEach(function (btn) {
      btn.classList.toggle("is-active", normPath(btn.getAttribute("data-cs-path")) === g);
    });
  }

  function boot() {
    apply(gate());
  }

  var mount = d.getElementById("cs-mount");
  if (mount) {
    var t = null;
    new MutationObserver(function () {
      if (t) clearTimeout(t);
      t = setTimeout(function () { apply(gate()); }, 40);
    }).observe(mount, { childList: true });
  }

  d.addEventListener("click", function (ev) {
    var btn = ev.target && ev.target.closest && ev.target.closest("[data-cs-path]");
    if (!btn) return;
    try { localStorage.setItem("cu_companion_path_v1", btn.getAttribute("data-cs-path") || "dai"); } catch (e) {}
    setTimeout(function () { apply(btn.getAttribute("data-cs-path")); }, 20);
    setTimeout(function () { apply(btn.getAttribute("data-cs-path")); }, 100);
  }, true);

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 200);
  setTimeout(boot, 800);

  w.ClarityPathGovernanceShell = {
    apply: apply,
    applyPathGovernance: apply,
    gate: gate,
    order: ORDER,
    honest: true,
    version: "P16-honest"
  };
})(window, document);
