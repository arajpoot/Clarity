/**
 * Clarity Boot Orchestrator v1
 * ---------------------------------------------------------------
 * Single control plane for deferred asset modules.
 * Goal: smooth in/out of ./assets — one version, one load graph,
 * no competing cache-busts, health report in console.
 *
 * Dependency layers (conceptual):
 *   L0  path-boot / null-guard (inline, already ran)
 *   L1  chunk-8          — core UI, meme, search, doors
 *   L2  track-os, tj-lmr, bridge, amana, uft, notes
 *   L3  path-progress, grave-curriculum
 *   L4  polish-wiring, ui-shine   — final paint / path gates
 *
 * This file does NOT re-fetch modules already in the page with defer.
 * It: unifies version, dedupes DOM junk, wires health, exposes
 * window.ClarityBoot for diagnostics and future soft-reload.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_BOOT_ORCH_V1__) return;
  g.__CLARITY_BOOT_ORCH_V1__ = true;

  var VERSION = "20261005f";
  var ASSETS = [
    { id: "chunk-8",          src: "./assets/clarity-chunk-8.js",                 layer: 1 },
    { id: "track-os",         src: "./assets/clarity-track-os-v3.js",             layer: 2 },
    { id: "tj-lmr",           src: "./assets/nx-tj-lmr-js-v1.js",                 layer: 2 },
    { id: "bridge",           src: "./assets/nuros-bridge-enrich-js.js",          layer: 2 },
    { id: "amana",            src: "./assets/clarity-amana-vault-gate-js-v1.js",  layer: 2 },
    { id: "uft",              src: "./assets/clarity-uft-full-restore-v1.js",     layer: 2 },
    { id: "notes",            src: "./assets/clarity-notes-recovery-v1.js",       layer: 2 },
    { id: "path-progress",    src: "./assets/clarity-path-progress-v1.js",        layer: 3 },
    { id: "grave-curriculum", src: "./assets/clarity-grave-path-curriculum-js.js",layer: 3 },
    { id: "polish-wiring",    src: "./assets/clarity-polish-wiring-v2.js",        layer: 4 },
    { id: "ui-shine",         src: "./assets/clarity-ui-shine-v1.js",             layer: 4 },
    { id: "smooth-flow",      src: "./assets/clarity-smooth-flow-v1.js",          layer: 4 }
  ];

  var health = {
    version: VERSION,
    started: Date.now(),
    modules: {},
    errors: [],
    deduped: []
  };

  function mark(id, status, detail) {
    health.modules[id] = { status: status, at: Date.now(), detail: detail || null };
  }

  /** Remove leftover duplicate audio / gate nodes from prior factor chaos */
  function scrubDomJunk() {
    try {
      var seenAudio = {};
      document.querySelectorAll("audio[id]").forEach(function (el) {
        var id = el.id;
        if (seenAudio[id] || /-dup\d+$/.test(id)) {
          el.remove();
          health.deduped.push("audio#" + id);
        } else {
          seenAudio[id] = true;
        }
      });
    } catch (e) {
      health.errors.push("scrubAudio:" + e.message);
    }
    try {
      var gates = document.querySelectorAll("#landing-gate-screen");
      if (gates.length > 1) {
        for (var i = 1; i < gates.length; i++) {
          gates[i].remove();
          health.deduped.push("landing-gate-extra");
        }
      }
    } catch (e2) {
      health.errors.push("scrubGate:" + e2.message);
    }
  }

  /** Ensure CSS patches link is present (if someone strips head) */
  function ensureCssPatches() {
    if (document.getElementById("clarity-css-patches-link")) {
      mark("css-patches", "present");
      return;
    }
    try {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.id = "clarity-css-patches-link";
      link.href = "./assets/clarity-css-patches-v1.css?v=" + VERSION;
      (document.head || document.documentElement).appendChild(link);
      mark("css-patches", "injected");
    } catch (e) {
      mark("css-patches", "fail", e.message);
      health.errors.push("css:" + e.message);
    }
  }

  /** Soft-ensure a deferred script exists (idempotent) */
  function ensureScript(mod) {
    var sel = 'script[src*="' + mod.src.replace("./", "") + '"]';
    if (document.querySelector(sel)) {
      mark(mod.id, "already-in-dom");
      return;
    }
    try {
      var s = document.createElement("script");
      s.src = mod.src + "?v=" + VERSION;
      s.defer = true;
      s.dataset.clarityMod = mod.id;
      s.dataset.clarityLayer = String(mod.layer);
      s.onerror = function () {
        mark(mod.id, "error-load");
        health.errors.push("load:" + mod.id);
      };
      s.onload = function () { mark(mod.id, "loaded-late"); };
      (document.body || document.documentElement).appendChild(s);
      mark(mod.id, "injected");
    } catch (e) {
      mark(mod.id, "fail", e.message);
    }
  }

  function inventoryDeferred() {
    ASSETS.forEach(function (mod) {
      var sel = 'script[src*="' + mod.src.replace("./", "") + '"]';
      if (document.querySelector(sel)) mark(mod.id, "deferred-ok");
      else mark(mod.id, "missing");
    });
  }

  function report() {
    var missing = Object.keys(health.modules).filter(function (k) {
      return health.modules[k].status === "missing" || health.modules[k].status === "error-load";
    });
    var line = "[ClarityBoot] v" + VERSION +
      " · " + (Date.now() - health.started) + "ms · " +
      "deduped=" + health.deduped.length +
      " · errors=" + health.errors.length +
      (missing.length ? " · missing=" + missing.join(",") : " · all modules present");
    if (health.errors.length || missing.length) console.warn(line, health);
    else console.info(line);
    return health;
  }

  // Public API
  g.ClarityBoot = {
    version: VERSION,
    assets: ASSETS,
    health: health,
    scrub: scrubDomJunk,
    ensureAll: function () { ASSETS.forEach(ensureScript); return report(); },
    report: report,
    reloadCss: function () {
      var el = document.getElementById("clarity-css-patches-link");
      if (el) {
        el.href = "./assets/clarity-css-patches-v1.css?v=" + VERSION + "&t=" + Date.now();
      }
    }
  };

  function boot() {
    ensureCssPatches();
    scrubDomJunk();
    inventoryDeferred();
    // Late safety: if path-progress already set meme-ok, leave it; else soft default
    try {
      if (!document.documentElement.getAttribute("data-clarity-meme-ok")) {
        var max = 0;
        try { max = parseInt(localStorage.getItem("clarity_path_unlocked_max") || "0", 10) || 0; } catch (e) {}
        var ok = max >= 2; // practicing index
        document.documentElement.setAttribute("data-clarity-meme-ok", ok ? "1" : "0");
        document.body && document.body.setAttribute("data-clarity-meme-ok", ok ? "1" : "0");
      }
    } catch (e) {}
    setTimeout(report, 0);
    setTimeout(report, 1200); // after deferred scripts settle
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(typeof window !== "undefined" ? window : this);
