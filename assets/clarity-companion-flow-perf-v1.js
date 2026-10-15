/**
 * Phase H+ — Begin-Islam-inspired companion flow & performance
 * Staged path strip, progressive tool load on tab intent, reduced thrash.
 * Educational only.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_COMPANION_FLOW_PERF_V1__) return;
  g.__CLARITY_COMPANION_FLOW_PERF_V1__ = true;

  var PATH = [
    { id: "reminder", label: "1 · Reminder", hint: "Commands & living words" },
    { id: "reality", label: "2 · Reality", hint: "What is true" },
    { id: "reflection", label: "3 · Reflect", hint: "Ponder & grave focus" },
    { id: "action", label: "4 · Action", hint: "Practice & craft" },
    { id: "notes", label: "5 · Notes", hint: "On-device notes" }
  ];

  function ensurePathStrip() {
    if (document.getElementById("cu-bi-path-strip")) return;
    var host =
      document.getElementById("dual-path-companion") ||
      document.querySelector(".dual-tiles") ||
      document.getElementById("main-content") ||
      document.querySelector("main") ||
      document.body;
    var strip = document.createElement("nav");
    strip.id = "cu-bi-path-strip";
    strip.className = "cu-bi-path-strip";
    strip.setAttribute("aria-label", "Companion path");
    strip.innerHTML =
      '<p class="cu-bi-path-lead">First steps — one door at a time (on this device)</p>' +
      '<div class="cu-bi-path-row">' +
      PATH.map(function (p) {
        return (
          '<button type="button" class="cu-bi-path-btn" data-path-tab="' +
          p.id +
          '"><span class="cu-bi-path-label">' +
          p.label +
          '</span><span class="cu-bi-path-hint">' +
          p.hint +
          "</span></button>"
        );
      }).join("") +
      "</div>";
    try {
      if (host.id === "dual-path-companion" || (host.classList && host.classList.contains("dual-tiles"))) {
        host.parentNode.insertBefore(strip, host.nextSibling);
      } else if (host.id === "main-content") {
        host.insertBefore(strip, host.firstChild);
      } else {
        host.insertBefore(strip, host.firstChild);
      }
    } catch (e) {
      document.body.appendChild(strip);
    }
    strip.querySelectorAll("[data-path-tab]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tab = btn.getAttribute("data-path-tab");
        markPath(tab);
        try {
          if (typeof g.switchTab === "function") g.switchTab(tab);
          else if (typeof g.claritySwitchTab === "function") g.claritySwitchTab(tab);
          else location.hash = tab;
        } catch (err) {
          location.hash = tab;
        }
        /* Priority load tools when entering action/reminder */
        if (tab === "action" || tab === "reminder" || tab === "notes") {
          kickDiet();
        }
      });
    });
  }

  function markPath(tab) {
    document.querySelectorAll(".cu-bi-path-btn").forEach(function (b) {
      b.classList.toggle("is-on", b.getAttribute("data-path-tab") === tab);
    });
    try {
      document.body.setAttribute("data-active-tab", tab || "reminder");
    } catch (e) {}
  }

  function kickDiet() {
    try {
      if (g.__CLARITY_COMPANION_DIET_IDLE_V1__ && !g.memeFetchBg) {
        /* diet already scheduled */
      }
      g.dispatchEvent(new CustomEvent("clarity-companion-need-tools"));
    } catch (e) {}
  }

  /* Observe hash / tab changes */
  function syncFromHash() {
    var h = (location.hash || "").replace(/^#/, "").toLowerCase();
    var map = {
      journey: "reminder",
      commands: "reminder",
      seerah: "reality",
      grave: "reflection",
      tajweed: "action",
      notes: "notes",
      reminder: "reminder",
      reality: "reality",
      reflection: "reflection",
      action: "action"
    };
    markPath(map[h] || h || "reminder");
  }

  function injectCss() {
    if (document.getElementById("cu-bi-flow-css")) return;
    var s = document.createElement("style");
    s.id = "cu-bi-flow-css";
    s.textContent =
      ".cu-bi-path-strip{max-width:42rem;margin:.65rem auto 1rem;padding:0 .75rem}" +
      ".cu-bi-path-lead{margin:0 0 .45rem;font-size:.78rem;opacity:.85;text-align:center}" +
      ".cu-bi-path-row{display:flex;flex-wrap:wrap;gap:.35rem;justify-content:center}" +
      ".cu-bi-path-btn{flex:1 1 5.5rem;min-width:4.8rem;max-width:8rem;padding:.45rem .4rem;border-radius:12px;" +
      "border:1px solid rgba(184,166,135,.35);background:rgba(0,0,0,.18);color:inherit;cursor:pointer;text-align:center}" +
      ".cu-bi-path-btn.is-on{border-color:rgba(224,197,106,.55);background:rgba(31,166,122,.12)}" +
      ".cu-bi-path-label{display:block;font-size:.72rem;font-weight:800}" +
      ".cu-bi-path-hint{display:block;font-size:.62rem;opacity:.75;line-height:1.25;margin-top:.15rem}" +
      "/* Performance: skip offscreen work for heavy cards */" +
      "#meme-card,#callig-lab-card,#tajweed-live-card,#tajweed-path-card," +
      ".card-commands,.card-seerah,.card-grave{content-visibility:auto;contain-intrinsic-size:auto 320px}" +
      "@media(max-width:520px){.cu-bi-path-hint{display:none}}";
    document.documentElement.appendChild(s);
  }

  function boot() {
    injectCss();
    ensurePathStrip();
    syncFromHash();
    g.addEventListener("hashchange", syncFromHash);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () {
    setTimeout(boot, 100);
  });
})(typeof window !== "undefined" ? window : this);
