/*! cu-nuros-stage-v1 · U64
 * Nur OS stage conductor — assigns VLE modules by learning level.
 * Inspired by public stepped curricula (essentials → practice → depth → transmission).
 * Educational only — not a fatwa · not a grade of īmān
 */
(function (w, d) {
  "use strict";
  if (w.__CU_NUROS_STAGE_V1__) return;
  w.__CU_NUROS_STAGE_V1__ = true;

  var MAP_URL = "/campus/assets/data/cu-path-ai-map-v1.json?v=20261122U64";

  function path() {
    return (location.pathname || "").replace(/\/+$/, "") || "";
  }
  function phaseFromPath() {
    var p = path();
    if (p.indexOf("/campus/desk/practice") === 0) return 2;
    if (p.indexOf("/campus/desk/consistency") === 0) return 3;
    if (p.indexOf("/campus/desk/transmission") === 0) return 4;
    if (p.indexOf("/campus/desk/seeker") === 0) return 1;
    try {
      return parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1;
    } catch (e) {
      return 1;
    }
  }
  function ensureCss() {
    if (d.querySelector('link[data-nuros-stage]')) return;
    var l = d.createElement("link");
    l.rel = "stylesheet";
    l.href = "/campus/assets/css/cu-nuros-stage-v1.css?v=20261122U64";
    l.setAttribute("data-nuros-stage", "1");
    d.head.appendChild(l);
  }
  function applyLevel(level, meta) {
    var lv = String(Math.min(4, Math.max(1, level)));
    d.documentElement.setAttribute("data-nuros-level", lv);
    d.documentElement.setAttribute("data-campus-surface", "1");
    // chip once
    if (!d.getElementById("nuros-level-chip") && d.querySelector("main")) {
      var chip = d.createElement("div");
      chip.id = "nuros-level-chip";
      chip.className = "nuros-level-chip";
      chip.textContent =
        (meta && meta.label) || "Level " + lv + " · staged VLE";
      var main = d.querySelector("main");
      var h = main && main.querySelector("h1, h2");
      if (h && h.parentNode) h.parentNode.insertBefore(chip, h.nextSibling);
      else if (main) main.insertBefore(chip, main.firstChild);
    }
    // Hard-hide stacked modules on Seeker by DOM id
    var hideMap = {
      "1": ["cu-vle-research", "cu-vle-faculty-research", "cu-bots-command", "cu-vle-tutorial"],
      "2": ["cu-vle-faculty-research", "cu-bots-command", "cu-vle-tutorial"],
      "3": ["cu-vle-research", "cu-vle-faculty-research", "cu-bots-command"],
      "4": ["cu-vle-faculty-research"]
    };
    (hideMap[lv] || []).forEach(function (id) {
      var el = d.getElementById(id);
      if (el) {
        el.style.setProperty("display", "none", "important");
        el.setAttribute("data-nuros-hidden", "1");
      }
    });
    // Slim path-ai: if full path AI exists on level 1, leave engine to render fewer benches via map
    w.dispatchEvent(
      new CustomEvent("nuros-level", { detail: { level: +lv, meta: meta || null } })
    );
  }
  function boot() {
    if (path().indexOf("/campus") !== 0) return;
    ensureCss();
    var ph = phaseFromPath();
    fetch(MAP_URL, { cache: "no-cache" })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (map) {
        var meta = map && map.levels && map.levels[String(ph)];
        applyLevel(ph, meta);
        // re-apply after late injectors
        [400, 1200, 2500].forEach(function (t) {
          setTimeout(function () {
            applyLevel(ph, meta);
          }, t);
        });
      })
      .catch(function () {
        applyLevel(ph, null);
      });
  }
  w.ClarityNurOS = {
    version: "U64",
    level: phaseFromPath,
    apply: function () {
      boot();
    }
  };
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 300);
})(window, document);
