/*! Amānah UFT workspace v1 · P4
 * Empty-state copy · double-tap zoom reset · Farāʾiḍ readiness integrity strip
 * Smooths workspace without replacing core uftZoom*
 * Educational only — not a legal pedigree · not a fatwa
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_WORKSPACE_V1__) return;
  w.__CLARITY_AMANA_UFT_WORKSPACE_V1__ = true;

  var TREE_KEY = w.UFT_KEY || "clarity_user_family_tree_v1";

  function isTree() {
    try {
      return /\/amana\/tree\/?/.test(location.pathname || "");
    } catch (e) {
      return false;
    }
  }

  function readTree() {
    try {
      if (typeof w.uftRead === "function") return w.uftRead() || {};
      return JSON.parse(localStorage.getItem(TREE_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function setStatus(msg) {
    var s = document.getElementById("uft-status");
    if (s) s.textContent = msg;
  }

  /** Double-tap / double-click on preview → zoom 100% */
  function bindDoubleTapReset() {
    var preview = document.getElementById("uft-preview") || document.getElementById("uft-stage");
    if (!preview || preview.getAttribute("data-uft-dblzoom") === "1") return;
    preview.setAttribute("data-uft-dblzoom", "1");

    var lastTap = 0;
    function reset() {
      try {
        if (typeof w.uftZoomReset === "function") w.uftZoomReset();
        else if (typeof w.uftZoomSet === "function") w.uftZoomSet(1);
        setStatus("Zoom reset · 100%");
        var lab = document.getElementById("uft-zoom-label");
        if (lab && !lab.textContent) lab.textContent = "100%";
      } catch (e) {}
    }

    preview.addEventListener(
      "touchend",
      function (ev) {
        if (!ev.changedTouches || ev.changedTouches.length !== 1) return;
        var now = Date.now();
        if (now - lastTap < 450) {
          reset();
          lastTap = 0;
        } else {
          lastTap = now;
        }
      },
      { passive: true }
    );

    preview.addEventListener("dblclick", function () {
      reset();
    });
  }

  function peopleFromTree(tree) {
    var names = [];
    var seen = {};
    function add(n) {
      n = String(n || "").trim();
      if (!n) return;
      var k = n.toLowerCase();
      if (seen[k]) return;
      seen[k] = true;
      names.push(n);
    }
    ["self", "spouse", "father", "mother", "pgf", "pgm", "mgf", "mgm"].forEach(function (s) {
      add(tree[s]);
    });
    (Array.isArray(tree.registry) ? tree.registry : []).forEach(function (r) {
      if (r) add(r.name);
    });
    return names;
  }

  function registryMeta(tree) {
    var map = {};
    (Array.isArray(tree.registry) ? tree.registry : []).forEach(function (r) {
      if (!r || !r.name) return;
      map[String(r.name).trim().toLowerCase()] = r;
    });
    return map;
  }

  /** Integrity strip: gender/vital gaps for Farāʾiḍ readiness */
  function refreshIntegrity() {
    var el = document.getElementById("uft-integrity");
    if (!el) return;
    var tree = readTree();
    var meta = registryMeta(tree);
    var people = peopleFromTree(tree);
    if (!people.length) {
      el.className = "";
      el.innerHTML =
        "Pedigree empty — add people in <strong>Registry</strong> (step 1), then build the stage. Educational outline only.";
      return;
    }
    var missingG = [];
    var missingV = [];
    people.forEach(function (n) {
      var r = meta[n.toLowerCase()] || {};
      if (!r.gender) missingG.push(n);
      if (!r.vital) missingV.push(n);
    });
    var bits = [];
    bits.push("<strong>" + people.length + "</strong> name(s) on outline.");
    if (missingG.length) {
      bits.push(
        "Gender missing for " +
          missingG.slice(0, 5).map(function (x) {
            return "<em>" + esc(x) + "</em>";
          }).join(", ") +
          (missingG.length > 5 ? "…" : "") +
          "."
      );
    }
    if (missingV.length) {
      bits.push(
        "Vital status missing for " +
          missingV.slice(0, 5).map(function (x) {
            return "<em>" + esc(x) + "</em>";
          }).join(", ") +
          (missingV.length > 5 ? "…" : "") +
          "."
      );
    }
    if (!missingG.length && !missingV.length) {
      el.className = "is-ready";
      bits.push("Farāʾiḍ study readiness: gender &amp; vital present on registry rows.");
      bits.push('<a class="btn-soft" href="/amana/fiqh/" style="margin-left:0.25rem">Open Farāʾiḍ →</a>');
    } else {
      el.className = "is-warn";
      bits.push("Set gender/vital on registry rows (step 5) before loading heirs in Farāʾiḍ study.");
    }
    el.innerHTML = bits.join(" ");
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function ensureEmptyCopy() {
    var empty = document.getElementById("uft-empty");
    var layer = document.getElementById("uft-zoom-layer");
    var tree = readTree();
    var has =
      tree.self ||
      (Array.isArray(tree.registry) && tree.registry.length) ||
      tree.father ||
      tree.mother;
    if (!has && layer && !layer.querySelector(".uft-person, .uft-card, [data-uft-name]")) {
      var existing = layer.querySelector(".uft-empty");
      if (!existing && layer.childElementCount < 2) {
        /* leave core render; only set status */
      }
      if (empty && !empty.textContent.trim()) {
        empty.textContent =
          "Pedigree template ready. Add names in Registry, then they appear on the stage. Empty slots stay open like an ancestry chart.";
      }
    }
  }

  function bindZoomLabel() {
    var lab = document.getElementById("uft-zoom-label");
    if (!lab) return;
    if (!lab.getAttribute("role")) lab.setAttribute("role", "button");
    lab.title = "Reset zoom (double-tap pedigree or tap here)";
  }

  function boot() {
    if (!isTree()) return;
    try {
      bindDoubleTapReset();
      bindZoomLabel();
      ensureEmptyCopy();
      refreshIntegrity();
    } catch (e) {
      try {
        console.warn("[UFT workspace]", e);
      } catch (err) {}
    }
  }

  w.uftWorkspaceRefreshIntegrity = refreshIntegrity;

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 500);
  setTimeout(boot, 1800);
  document.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 120);
  });
})(typeof window !== "undefined" ? window : this);
