/*! companion-path-governance-shell-v1 · P17 backbone honest · educational only */
(function (w, d) {
  "use strict";
  /* Always install honest API — even if an older copy set the flag */
  var ORDER = ["seeker", "new_muslim", "practicing", "dai"];
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
    try { return normPath(localStorage.getItem("cu_companion_path_v1") || "dai"); } catch (e2) {}
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
    root.querySelectorAll("[id$='-card'], section.cs-plaque:not([data-cs-path-only]), .cs-plaque[data-cs-primary], .cs-rich-legacy-wrap, .cs-rich-legacy, .dl-card").forEach(function (el) {
      if (el.hasAttribute("data-cs-path-only")) return;
      showEl(el);
    });
    root.querySelectorAll("[data-cs-path-only]").forEach(function (el) {
      var only = normPath(el.getAttribute("data-cs-path-only") || "");
      var ok = only === g || only === "all" || (g === "practicing" && only === "daily");
      if (ok) { showEl(el); el.style.setProperty("display", "block", "important"); }
      else { el.style.setProperty("display", "none", "important"); el.setAttribute("hidden", ""); }
    });
    d.querySelectorAll("[data-cs-path]").forEach(function (btn) {
      btn.classList.toggle("is-active", normPath(btn.getAttribute("data-cs-path")) === g);
    });
  }
  function boot() { apply(gate()); }
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
  }, true);
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 300);
  setTimeout(boot, 1000);
  w.__COMPANION_PATH_GOV_SHELL_V1__ = true;
  w.__COMPANION_PATH_GOV_HONEST_P17__ = true;
  w.ClarityPathGovernanceShell = {
    apply: apply,
    applyPathGovernance: apply,
    gate: gate,
    order: ORDER,
    honest: true,
    version: "P17-backbone"
  };
})(window, document);
