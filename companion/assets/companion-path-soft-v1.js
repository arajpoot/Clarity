/*! companion-path-soft-v1 · P4 governance soft emphasis
 * Path may emphasize; must NOT exclusive-hide educational cards (GOVERNANCE §7).
 * Patches ClarityPathGovernanceShell.apply: keeps data-cs-path-only gating;
 * restores cards hidden only by ALLOW map; marks non-primary with .is-path-soft.
 * Does not remove path-gov script. Companion only. Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_PATH_SOFT_V1__) return;
  w.__COMPANION_PATH_SOFT_V1__ = true;

  function rootEl() {
    return d.getElementById("cs-mount") || d;
  }

  function softRestore(root) {
    root = root || rootEl();
    if (!root) return { restored: 0 };
    var n = 0;
    var path = "seeker";
    try {
      if (w.ClarityPathGovernanceShell && typeof w.ClarityPathGovernanceShell.gate === "function") {
        path = w.ClarityPathGovernanceShell.gate() || path;
      } else {
        path = localStorage.getItem("clarity_gate_v1") || path;
      }
    } catch (e) {}

    var allow = null;
    try {
      if (w.ClarityPathGovernanceShell && w.ClarityPathGovernanceShell.allow) {
        allow = w.ClarityPathGovernanceShell.allow[path] || w.ClarityPathGovernanceShell.allow.seeker;
      }
    } catch (e2) {}

    /* 1) Honor data-cs-path-only only */
    root.querySelectorAll("[data-cs-path-only]").forEach(function (el) {
      var only = (el.getAttribute("data-cs-path-only") || "").split(/\s+/);
      var show = only.indexOf(path) >= 0 || only.indexOf("all") >= 0;
      if (show) {
        el.style.removeProperty("display");
        el.removeAttribute("hidden");
        el.classList.remove("cpp-path-hidden");
      } else {
        el.style.setProperty("display", "none", "important");
        el.setAttribute("hidden", "");
      }
    });

    /* 2) Restore educational cards/plaques; soft-emphasize ALLOW set */
    var nodes = root.querySelectorAll(
      "[id$='-card'], section.cs-plaque, .cs-plaque, .dl-card, .dl-tab-hero, [data-cs-primary]"
    );
    nodes.forEach(function (el) {
      if (el.hasAttribute("data-cs-path-only")) return;
      try {
        el.style.removeProperty("display");
        el.removeAttribute("hidden");
        el.classList.remove("cpp-path-hidden");
        n++;
        var id = el.id || "";
        if (allow && id && allow[id]) {
          el.classList.add("is-path-primary");
          el.classList.remove("is-path-soft");
        } else if (allow && id) {
          el.classList.add("is-path-soft");
          el.classList.remove("is-path-primary");
        } else {
          /* no id or no allow map — keep visible, neutral */
          el.classList.remove("is-path-soft");
        }
      } catch (e3) {}
    });
    return { restored: n, path: path };
  }

  function patch() {
    var G = w.ClarityPathGovernanceShell;
    if (!G || typeof G.apply !== "function" || G.__pathSoftPatched) return false;
    var prev = G.apply;
    G.apply = function () {
      var ret;
      try {
        ret = prev.apply(G, arguments);
      } catch (e) {
        /* still restore */
      }
      try {
        softRestore(rootEl());
      } catch (e2) {}
      return ret;
    };
    G.__pathSoftPatched = true;
    return true;
  }

  function onMounted() {
    softRestore(rootEl());
  }

  function boot() {
    patch();
    var n = 0;
    var iv = setInterval(function () {
      n++;
      if (patch() || n > 50) clearInterval(iv);
    }, 40);
    softRestore(rootEl());
    d.addEventListener("clarity:tab-mounted", onMounted);
    w.addEventListener("clarity:tab-mounted", onMounted);
    var mount = d.getElementById("cs-mount");
    if (mount && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(function () {
          softRestore(mount);
        }, 50);
      }).observe(mount, { childList: true });
    }
  }

  w.ClarityPathSoft = { softRestore: softRestore, version: "v1-20261116P4" };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
