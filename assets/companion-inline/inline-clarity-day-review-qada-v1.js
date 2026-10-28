/**
 * Day landing: Auto review restore + qaḍāʾ tracker enrich
 * Educational only — not a fatwa
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAY_REVIEW_QADA_V1__) return;
  g.__CLARITY_DAY_REVIEW_QADA_V1__ = true;

  var QADA_KEY = "clarity_qada_counts_v1";

  function readQada() {
    try {
      return JSON.parse(localStorage.getItem(QADA_KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function writeQada(o) {
    try {
      localStorage.setItem(QADA_KEY, JSON.stringify(o));
    } catch (e) {}
  }

  function enrichQada() {
    var card = document.querySelector("#cdl-qada, #cdl-qada-root, .cdl-card");
    // find by heading
    var host = null;
    document.querySelectorAll("#clarity-day-landing-room .cdl-card, #clarity-day-landing-room h2").forEach(function (el) {
      if (/qaḍā|qada/i.test(el.textContent || "")) {
        host = el.closest(".cdl-card") || el.parentElement;
      }
    });
    if (!host) {
      var row = document.querySelector(".cdl-qada-row");
      if (row) host = row.closest(".cdl-card") || row.parentElement;
    }
    if (!host || host.getAttribute("data-qada-enrich") === "1") {
      if (host) updateQadaSummary(host);
      return;
    }
    host.setAttribute("data-qada-enrich", "1");
    var q = readQada();
    host.querySelectorAll("input[data-qada]").forEach(function (inp) {
      var k = inp.getAttribute("data-qada");
      if (q[k] != null) inp.value = q[k];
    });
    var sum = host.querySelector(".cdl-qada-summary");
    if (!sum) {
      sum = document.createElement("p");
      sum.className = "cdl-qada-summary";
      host.appendChild(sum);
    }
    var save = host.querySelector("#cdl-qada-save");
    if (save && !save.__enrich) {
      save.__enrich = true;
      save.addEventListener("click", function () {
        var o = readQada();
        host.querySelectorAll("input[data-qada]").forEach(function (inp) {
          o[inp.getAttribute("data-qada")] = parseInt(inp.value, 10) || 0;
        });
        writeQada(o);
        updateQadaSummary(host);
        save.textContent = "Saved ✓";
        setTimeout(function () {
          save.textContent = "Save";
        }, 1000);
      });
    }
    updateQadaSummary(host);
  }

  function updateQadaSummary(host) {
    var sum = host.querySelector(".cdl-qada-summary");
    if (!sum) return;
    var o = readQada();
    // also live inputs
    host.querySelectorAll("input[data-qada]").forEach(function (inp) {
      o[inp.getAttribute("data-qada")] = parseInt(inp.value, 10) || 0;
    });
    var total = 0;
    ["fajr", "dhuhr", "asr", "maghrib", "isha"].forEach(function (k) {
      total += parseInt(o[k], 10) || 0;
    });
    sum.textContent =
      total === 0
        ? "No qaḍāʾ counts stored on this device. Educational tracker only — not a fatwa."
        : "Total on this device: " + total + " · Ask a local teacher for your case. Educational only — not a fatwa.";
  }

  function ensureReview() {
    var room = document.getElementById("clarity-day-landing-room");
    if (!room) return;
    var inner = room.querySelector(".day-room-inner");
    if (!inner) return;
    if (document.getElementById("cdl-trust-review-card")) return;

    var card = document.createElement("div");
    card.className = "cdl-card";
    card.id = "cdl-trust-review-card";
    card.innerHTML =
      '<div class="cdl-head"><h2>🔎 Auto review · this device</h2></div>' +
      '<p class="cdl-sub" id="cdl-trust-review-body">Tap to re-check Day landing shell, qaḍāʾ host, Dayn slot, and dual paths after a revamp.</p>' +
      '<button type="button" class="cdl-btn" id="cdl-trust-review-btn">Run trust check</button>' +
      '<p class="cdl-sub" id="cdl-trust-review-stamp" style="margin-top:0.4rem"></p>';

    var trust = null;
    inner.querySelectorAll(".cdl-card").forEach(function (c) {
      if (/Built for trust/i.test(c.textContent || "")) trust = c;
    });
    if (trust) inner.insertBefore(card, trust);
    else inner.appendChild(card);

    var btn = document.getElementById("cdl-trust-review-btn");
    if (btn && !btn.__w) {
      btn.__w = true;
      btn.addEventListener("click", function () {
        var checks = [];
        checks.push(document.getElementById("clarity-day-landing-room") ? "Day room ✓" : "Day room ✗");
        checks.push(document.querySelector(".dual-tiles") ? "Dual paths ✓" : "Dual paths ✗");
        checks.push(document.querySelector(".cdl-qada-row, input[data-qada]") ? "Qaḍāʾ ✓" : "Qaḍāʾ ✗");
        checks.push(
          document.getElementById("clarity-landing-slot-dayn") ? "Dayn slot ✓" : "Dayn slot ✗"
        );
        checks.push(
          document.documentElement.getAttribute("data-shell-mode") === "landing"
            ? "Shell landing ✓"
            : "Shell mode: " + (document.documentElement.getAttribute("data-shell-mode") || "?")
        );
        var body = document.getElementById("cdl-trust-review-body");
        var stamp = document.getElementById("cdl-trust-review-stamp");
        if (body) body.textContent = checks.join(" · ");
        if (stamp)
          stamp.textContent =
            "Checked " + new Date().toLocaleString() + " · educational only — not a fatwa";
      });
    }
  }

  function boot() {
    try {
      enrichQada();
      ensureReview();
    } catch (e) {
      console.warn("[day review/qada]", e);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  document.addEventListener("clarity:day-room-ready", boot);
  document.addEventListener("clarity:landing-ready", boot);
  [600, 2000].forEach(function (ms) {
    setTimeout(boot, ms);
  });
})(typeof window !== "undefined" ? window : this);
