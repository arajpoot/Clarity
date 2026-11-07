/*! Amānah UFT polish + study print pack v1 · Phase 4
 * Additive: unified educational print sheet (tree + outline + stamps),
 * soft empty-state copy, visibility re-boot hooks.
 * Enrichment never decreases. Not a fatwa · not a court document.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_POLISH_PRINT_V1__) return;
  w.__CLARITY_AMANA_UFT_POLISH_PRINT_V1__ = true;

  var TREE_KEY = w.UFT_KEY || "clarity_user_family_tree_v1";
  var OUTLINE_KEY = "clarity_amana_fiqh_outline_v1";

  function path() {
    try { return location.pathname || ""; } catch (e) { return ""; }
  }
  function isTree() { return /\/amana\/tree\/?/.test(path()); }
  function isFiqh() { return /\/amana\/fiqh\/?/.test(path()); }

  function readTree() {
    try {
      if (typeof w.uftRead === "function") return w.uftRead() || {};
      return JSON.parse(localStorage.getItem(TREE_KEY) || "{}");
    } catch (e) { return {}; }
  }

  function loadOutline() {
    try {
      var o = JSON.parse(localStorage.getItem(OUTLINE_KEY) || "null");
      if (o) return o;
    } catch (e) {}
    if (typeof w.uftBuildFiqhOutline === "function") {
      try { return w.uftBuildFiqhOutline(); } catch (e2) {}
    }
    return null;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stampBlock() {
    return (
      '<div style="border:1px solid #c9a84c;padding:0.6rem 0.75rem;margin:0 0 0.75rem;border-radius:8px;font-size:0.85rem">' +
      "<strong>Educational study sheet only</strong> — not a fatwa · not legal advice · not a court document. " +
      "Confirm inheritance matters with a qualified local scholar. Data stayed on this device when this sheet was printed." +
      "</div>"
    );
  }

  function registryTable(tree) {
    var reg = Array.isArray(tree.registry) ? tree.registry : [];
    if (!reg.length) return "<p>No registry rows yet.</p>";
    var rows = reg.map(function (r) {
      if (!r) return "";
      return (
        "<tr><td>" + esc(r.name) + "</td><td>" + esc(r.role) + "</td><td>" +
        esc(r.gender) + "</td><td>" + esc(r.vital) + "</td><td>" +
        esc(r.kinship || "") + "</td><td>" + esc(r.line || "") + "</td></tr>"
      );
    }).join("");
    return (
      '<table style="width:100%;border-collapse:collapse;font-size:12px">' +
      "<thead><tr><th align='left'>Name</th><th align='left'>Role</th><th align='left'>Gender</th>" +
      "<th align='left'>Vital</th><th align='left'>Kinship</th><th align='left'>Line</th></tr></thead>" +
      "<tbody>" + rows + "</tbody></table>"
    );
  }

  function outlineTable(o) {
    if (!o || !o.people || !o.people.length) return "<p>No Farāʾiḍ outline saved — use Tree → Outline for Farāʾiḍ study.</p>";
    var rows = o.people.map(function (p) {
      return (
        "<tr><td>" + esc(p.name) + "</td><td>" + esc(p.role) + "</td><td>" +
        esc(p.gender) + "</td><td>" + esc(p.vital) + "</td><td>" +
        esc(p.kinship) + "</td><td>" + esc(p.line) + "</td></tr>"
      );
    }).join("");
    return (
      '<table style="width:100%;border-collapse:collapse;font-size:12px">' +
      "<thead><tr><th align='left'>Name</th><th align='left'>Role</th><th align='left'>Gender</th>" +
      "<th align='left'>Vital</th><th align='left'>Kinship</th><th align='left'>Line</th></tr></thead>" +
      "<tbody>" + rows + "</tbody></table>"
    );
  }

  function buildSheet() {
    var tree = readTree();
    var outline = loadOutline();
    var backbone = ["self", "spouse", "father", "mother", "pgf", "pgm", "mgf", "mgm"]
      .map(function (k) {
        return tree[k] ? "<li><strong>" + esc(k) + "</strong>: " + esc(tree[k]) + "</li>" : "";
      })
      .join("");

    var sheet = document.createElement("div");
    sheet.id = "amana-study-print-sheet";
    sheet.setAttribute("role", "document");
    sheet.innerHTML =
      '<div style="font-family:system-ui,sans-serif;color:#111;max-width:800px;margin:0 auto;padding:1rem">' +
      stampBlock() +
      "<h1 style=\"font-size:1.25rem;margin:0 0 0.35rem\">Amānah · Family outline + Farāʾiḍ study sheet</h1>" +
      '<p style="font-size:0.8rem;margin:0 0 0.75rem">Printed ' + esc(new Date().toLocaleString()) + " · clarity-dawah.fyi</p>" +
      "<h2 style=\"font-size:1.05rem\">Pedigree backbone</h2>" +
      (backbone ? "<ul>" + backbone + "</ul>" : "<p>No backbone names set.</p>") +
      "<h2 style=\"font-size:1.05rem\">Registry</h2>" +
      registryTable(tree) +
      "<h2 style=\"font-size:1.05rem\">Farāʾiḍ study outline</h2>" +
      outlineTable(outline) +
      stampBlock() +
      "</div>";
    return sheet;
  }

  function runPrint() {
    var sheet = buildSheet();
    var style = document.createElement("style");
    style.setAttribute("data-amana-print", "1");
    style.textContent =
      "@media print { body * { visibility: hidden !important; } #amana-study-print-sheet, #amana-study-print-sheet * { visibility: visible !important; } #amana-study-print-sheet { position: absolute; left: 0; top: 0; width: 100%; } }";
    document.body.appendChild(style);
    document.body.appendChild(sheet);
    document.body.classList.add("printing");
    function cleanup() {
      try { document.body.classList.remove("printing"); } catch (e) {}
      try { if (sheet.parentNode) sheet.parentNode.removeChild(sheet); } catch (e2) {}
      try { if (style.parentNode) style.parentNode.removeChild(style); } catch (e3) {}
    }
    window.onafterprint = function () {
      cleanup();
      window.onafterprint = null;
    };
    setTimeout(function () {
      try { w.print(); } catch (e) {}
      setTimeout(cleanup, 5000);
    }, 50);
  }

  function injectPrintButtons() {
    var id = "amana-study-print-btn";
    if (document.getElementById(id)) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = id;
    btn.className = "btn-soft";
    btn.style.cursor = "pointer";
    btn.textContent = "Print study pack";
    btn.setAttribute("aria-label", "Print educational family outline and farāʾiḍ study sheet");
    btn.onclick = function () { runPrint(); };

    if (isTree()) {
      var bar = document.getElementById("uft-fiqh-bridge-bar");
      var tools = document.querySelector(".uft-tools") || document.getElementById("uft-status");
      if (bar) bar.appendChild(btn);
      else if (tools && tools.parentNode) tools.parentNode.insertBefore(btn, tools.nextSibling);
      else {
        var card = document.getElementById("user-family-tree-card");
        if (card) card.appendChild(btn);
      }
    }
    if (isFiqh()) {
      var panel = document.getElementById("amana-fiqh-outline-panel");
      if (panel) {
        var wrap = panel.querySelector("div[style*='flex']") || panel;
        wrap.appendChild(btn);
      } else {
        var fc = document.getElementById("faraid-card");
        if (fc) fc.insertBefore(btn, fc.firstChild);
      }
    }
  }

  function polishEmptyStates() {
    if (!isTree()) return;
    var empty = document.getElementById("uft-empty");
    if (empty && !(empty.textContent || "").trim()) {
      empty.textContent = "Add people in the registry, then build the pedigree. Educational outline on this device only.";
    }
    var status = document.getElementById("uft-status");
    if (status && /Loading UFT modules/i.test(status.textContent || "")) {
      // leave stable bridge to clear; soft fallback after delay
      setTimeout(function () {
        if (status && /Loading UFT modules/i.test(status.textContent || "")) {
          status.textContent = "UFT modules ready when vault is unlocked · educational only · not a legal pedigree";
        }
      }, 2500);
    }
  }

  function resilience() {
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState !== "visible") return;
      try {
        if (typeof w.uftViewportStableBoot === "function") w.uftViewportStableBoot();
        if (typeof w.uftRelationEnrichBoot === "function") w.uftRelationEnrichBoot();
      } catch (e) {}
      setTimeout(injectPrintButtons, 200);
    });
  }

  function boot() {
    try {
      injectPrintButtons();
      polishEmptyStates();
      resilience();
    } catch (e) {
      console.warn("polish-print", e);
    }
  }

  function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  onReady(function () {
    boot();
    setTimeout(boot, 700);
  });
  document.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 150);
  });

  w.amanaPrintStudyPack = runPrint;
})(typeof window !== "undefined" ? window : this);
