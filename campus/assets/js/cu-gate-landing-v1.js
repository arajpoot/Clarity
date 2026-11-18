/*! cu-gate-landing-v1 · U25
 * Campus landing gate: New seeker vs Returning student (on-device name).
 * KEY cu_uni_admit_v1 · Educational only — not a fatwa · not a grade of īmān
 */
(function (w, d) {
  "use strict";
  if (w.__CU_GATE_LANDING_V1__) return;
  w.__CU_GATE_LANDING_V1__ = true;

  var KEY = "cu_uni_admit_v1";
  var MODE_KEY = "cu_campus_gate_mode_v1";

  function loadAdmit() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null");
    } catch (e) {
      return null;
    }
  }

  function setMode(mode) {
    d.documentElement.setAttribute("data-campus-gate", mode);
    if (d.body) d.body.setAttribute("data-campus-gate", mode);
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch (e) {}
  }

  function getSavedMode() {
    try {
      return localStorage.getItem(MODE_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function ensureGate() {
    if (d.getElementById("cu-gate-block")) return;
    var main = d.querySelector("main.adm-stage, main.cu-wrap, .cu-landing-wrap") || d.body;
    var wrap = d.createElement("section");
    wrap.id = "cu-gate-block";
    wrap.className = "cu-gate-block";
    wrap.setAttribute("data-clarity-owned", "gate-v1");
    wrap.innerHTML =
      '<h2 class="cu-gate-title">Enter Campus</h2>' +
      '<p class="cu-gate-lead">Two doors. Progress and preferred name stay on <strong>this device</strong> only.</p>' +
      '<div class="cu-gate-grid">' +
      '  <article class="cu-gate-card" data-gate="new">' +
      "    <h3>New seeker</h3>" +
      "    <p>Read the Charter limits, register a preferred name on this device, then Orientation — before the first desk module.</p>" +
      '    <div class="cu-g-actions">' +
      '      <button type="button" class="cu-g-btn primary" data-gate-go="new">Start as new</button>' +
      '      <a href="/campus/charter/">Charter</a>' +
      '      <a href="/campus/orientation/">Orientation</a>' +
      "    </div>" +
      "  </article>" +
      '  <article class="cu-gate-card" data-gate="return">' +
      "    <h3>Returning student</h3>" +
      "    <p>If you registered a preferred name here before, it is still in this browser’s storage — not on Clarity servers. Continue at the portal or desk.</p>" +
      '    <div class="cu-g-actions">' +
      '      <button type="button" class="cu-g-btn primary" data-gate-go="return">Continue as returning</button>' +
      '      <a href="/campus/portal/">Student portal</a>' +
      '      <a href="/campus/desk/">Seeker desk</a>' +
      "    </div>" +
      "  </article>" +
      "</div>" +
      '<p class="cu-gate-stamp">Educational only — not a fatwa · not a grade of īmān · not a seminary</p>';

    var back = d.createElement("div");
    back.className = "cu-gate-back";
    back.innerHTML = '<button type="button" data-gate-go="gate">← Both doors again</button>';

    // Insert gate after hero/banner if possible
    var hero = d.querySelector("header.cu-hero, #cu-banner, .cu-hero");
    if (hero && hero.parentNode) {
      if (hero.nextSibling) hero.parentNode.insertBefore(wrap, hero.nextSibling);
      else hero.parentNode.appendChild(wrap);
    } else if (main.firstChild) {
      main.insertBefore(wrap, main.firstChild);
    } else {
      main.appendChild(wrap);
    }
    wrap.parentNode.insertBefore(back, wrap.nextSibling);

    wrap.addEventListener("click", function (ev) {
      var t = ev.target.closest("[data-gate-go]");
      if (!t) return;
      var go = t.getAttribute("data-gate-go");
      if (go === "new") {
        setMode("new");
        var steps = d.getElementById("adm-steps");
        if (steps) steps.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (go === "return") {
        setMode("return");
        var cont = d.getElementById("seq-continue-slot") || d.querySelector(".seq-stage-map");
        if (cont) cont.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    back.addEventListener("click", function (ev) {
      if (ev.target.closest('[data-gate-go="gate"]')) {
        setMode("gate");
        wrap.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  function markProgressive() {
    // Hide heavy blocks until a door is chosen
    var hideOnGate = [
      "#seq-continue-slot",
      ".seq-stage-map",
      "#adm-steps",
      ".adm-panel",
      "#adm-returning",
      "#seq-after-clarity",
      "#adm-faculty-slot"
    ];
    hideOnGate.forEach(function (sel) {
      d.querySelectorAll(sel).forEach(function (el) {
        el.classList.add("cu-gate-hide-on-gate");
      });
    });
    // New-only: full admission panels
    d.querySelectorAll(".adm-panel, #adm-steps").forEach(function (el) {
      el.classList.add("cu-gate-new-only");
    });
    // Return-only: continue + stage map
    d.querySelectorAll("#seq-continue-slot, .seq-stage-map, #adm-returning").forEach(function (el) {
      el.classList.add("cu-gate-return-only");
      el.classList.remove("cu-gate-new-only");
    });
  }

  function moveWriteDown() {
    var write = d.getElementById("cu-write-clarity") || d.querySelector(".cu-write-clarity");
    var foot = d.querySelector("footer.cu-foot, footer.cu-niyyah-footer");
    if (write && foot && foot.parentNode && write.parentNode) {
      foot.parentNode.insertBefore(write, foot);
    }
  }

  function boot() {
    if (!/\/campus\/?$/.test(location.pathname.replace(/\/+$/, "") + "/") && location.pathname.replace(/\/+$/, "") !== "/campus") {
      // only landing
      var p = location.pathname.replace(/\/+$/, "") || "";
      if (p !== "/campus" && p !== "") return;
    }
    try {
      ensureGate();
      markProgressive();
      moveWriteDown();
      var admit = loadAdmit();
      var saved = getSavedMode();
      if (saved === "new" || saved === "return" || saved === "gate") {
        setMode(saved);
      } else if (admit && admit.name) {
        setMode("return");
      } else {
        setMode("gate");
      }
      // Show registered name on return card if present
      if (admit && admit.name) {
        var card = d.querySelector('.cu-gate-card[data-gate="return"] p');
        if (card && card.textContent.indexOf(admit.name) < 0) {
          card.innerHTML =
            "Preferred name on this device: <strong>" +
            String(admit.name).replace(/</g, "") +
            "</strong>. It is not sent to Clarity servers. Continue at the portal or desk.";
        }
      }
    } catch (e) {}
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 200);
  setTimeout(boot, 800);
})(window, document);
