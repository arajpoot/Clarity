/**
 * Arabic entry gate · 20261019AR
 * Prep levels + skip · on-device cu_ar_entry_v1
 */
(function (g) {
  "use strict";
  if (g.__AR_ENTRY_V1__) return;
  g.__AR_ENTRY_V1__ = true;

  var KEY = "cu_ar_entry_v1";
  var MICRO = [
    "Prep: name 5 letters aloud while looking at shapes (video module or mushaf).",
    "L1: read 3 simple words with harakāt — slow, no rush.",
    "L2: open Recite · one short āyah · text visible · echo once.",
    "L3: open Everyday words pack · 5 cards · then return to Desk.",
    "Path ready: one ṣalāh lexicon card · then Seeker module 10 minutes."
  ];

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function save(o) {
    try {
      localStorage.setItem(KEY, JSON.stringify(o));
    } catch (e) {}
  }

  function setStatus(msg) {
    var el = document.getElementById("ar-gate-status");
    if (el) el.textContent = msg;
  }

  function highlight(level, skipped) {
    document.querySelectorAll(".ar-level").forEach(function (card) {
      var lv = Number(card.getAttribute("data-level"));
      card.classList.toggle("on", !skipped && lv === level);
    });
  }

  function applyMicro(level) {
    var t = document.getElementById("ar-micro-task");
    var idx = Math.min(Math.max(level, 0), MICRO.length - 1);
    if (t) t.textContent = MICRO[idx];
  }

  function enter(level) {
    var o = load();
    o.level = level;
    o.skipped = false;
    o.ts = Date.now();
    save(o);
    highlight(level, false);
    applyMicro(level);
    setStatus("Entry level L" + level + " saved on this device. Studio packs below.");
    var shell = document.getElementById("ar-studio-shell");
    if (shell) shell.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function skip() {
    var o = load();
    o.skipped = true;
    o.level = 3;
    o.ts = Date.now();
    save(o);
    highlight(3, true);
    applyMicro(3);
    setStatus("Gate skipped — you marked yourself path-ready on this device. Studio open.");
    var shell = document.getElementById("ar-studio-shell");
    if (shell) shell.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function reset() {
    try {
      localStorage.removeItem(KEY);
    } catch (e) {}
    highlight(-1, false);
    applyMicro(0);
    setStatus("Entry status cleared on this device.");
  }

  function boot() {
    var o = load();
    if (o.skipped) {
      highlight(3, true);
      applyMicro(3);
      setStatus("Previously skipped gate on this device · path-ready.");
    } else if (typeof o.level === "number") {
      highlight(o.level, false);
      applyMicro(o.level);
      setStatus("Continuing entry level L" + o.level + " on this device.");
    } else {
      applyMicro(0);
    }

    document.querySelectorAll("[data-enter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        enter(Number(btn.getAttribute("data-enter")));
      });
    });
    var sk = document.getElementById("ar-skip-gate");
    if (sk) sk.addEventListener("click", skip);
    var rs = document.getElementById("ar-reset-gate");
    if (rs) rs.addEventListener("click", reset);
    var go = document.getElementById("ar-micro-go");
    if (go) {
      go.addEventListener("click", function () {
        var shell = document.getElementById("ar-studio-shell");
        if (shell) shell.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
