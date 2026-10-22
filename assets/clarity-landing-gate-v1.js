/**
 * Companion landing / main surfaces · Phase 1–7 · 20261021P7
 * No auto-countdown. Stay | Skip to main.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LANDING_GATE_V1__ === "20261021P7") return;
  w.__CLARITY_LANDING_GATE_V1__ = "20261021P7";

  var KEY = "clarity_landing_gate_v1";

  function day() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function write(o) {
    try {
      localStorage.setItem(KEY, JSON.stringify(o));
    } catch (e) {}
  }

  function setMode(mode) {
    var root = document.documentElement;
    var body = document.body;
    root.classList.remove("clarity-landing-active", "clarity-landing-done", "clarity-main-active");
    if (body) body.classList.remove("clarity-landing-active", "clarity-landing-done", "clarity-main-active");
    if (mode === "landing") {
      root.classList.add("clarity-landing-active");
      if (body) body.classList.add("clarity-landing-active");
    } else {
      root.classList.add("clarity-landing-done", "clarity-main-active");
      if (body) body.classList.add("clarity-landing-done", "clarity-main-active");
    }
  }

  function resolveMode() {
    var q = w.location.search || "";
    if (/[?&]main=1(?:&|$)/.test(q) || /[?&]landing=0(?:&|$)/.test(q)) return "main";
    if (/[?&]landing=1(?:&|$)/.test(q)) return "landing";
    var s = read();
    if (s.skipDay === day()) return "main";
    if (s.stayDay === day()) return "landing";
    return "landing"; /* first open of day */
  }

  function removePill() {
    var pill = document.getElementById("clarity-landing-pill");
    if (pill) pill.remove();
  }

  function ensurePill() {
    if (document.getElementById("clarity-landing-pill")) return;
    var pill = document.createElement("div");
    pill.id = "clarity-landing-pill";
    pill.className = "clarity-landing-pill";
    pill.setAttribute("role", "dialog");
    pill.setAttribute("aria-label", "Main Companion");
    pill.innerHTML =
      '<span class="clp-label">Main Companion page</span>' +
      '<div class="clp-actions">' +
      '<button type="button" class="clp-btn" id="clp-stay">Stay</button>' +
      '<button type="button" class="clp-btn primary" id="clp-skip">Skip to main</button>' +
      "</div>";
    document.body.appendChild(pill);
    document.getElementById("clp-stay").onclick = function () {
      stay();
    };
    document.getElementById("clp-skip").onclick = function () {
      skipToMain();
    };
  }

  function ensureOpenDayBtn() {
    if (document.getElementById("clarity-open-day-wrap")) return;
    var banner = document.querySelector("#clarity-top-duo .banner, .banner");
    var wrap = document.createElement("div");
    wrap.id = "clarity-open-day-wrap";
    wrap.className = "clarity-open-day-btn";
    wrap.innerHTML =
      '<button type="button" id="clarity-open-day-btn" title="Do this today &amp; adhkār">☀ Day surface</button>';
    if (banner && banner.parentNode) {
      if (banner.nextSibling) banner.parentNode.insertBefore(wrap, banner.nextSibling);
      else banner.parentNode.appendChild(wrap);
    } else {
      document.body.appendChild(wrap);
    }
    document.getElementById("clarity-open-day-btn").onclick = function () {
      openLanding();
    };
  }

  function stay() {
    var s = read();
    s.stayDay = day();
    if (s.skipDay === day()) delete s.skipDay;
    write(s);
    setMode("landing");
    ensurePill();
  }

  function skipToMain() {
    var s = read();
    s.skipDay = day();
    write(s);
    setMode("main");
    removePill();
    ensureOpenDayBtn();
    try {
      w.dispatchEvent(new CustomEvent("clarity-landing-done", { detail: { reason: "skip" } }));
    } catch (e) {}
  }

  function openLanding() {
    var s = read();
    s.stayDay = day();
    if (s.skipDay === day()) delete s.skipDay;
    write(s);
    setMode("landing");
    ensurePill();
    try {
      w.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      w.scrollTo(0, 0);
    }
  }

  function boot() {
    var mode = resolveMode();
    setMode(mode);
    if (mode === "landing") {
      ensurePill();
    } else {
      removePill();
      ensureOpenDayBtn();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else boot();
  w.addEventListener("load", function () {
    if (document.documentElement.classList.contains("clarity-landing-active") && !document.getElementById("clarity-landing-pill")) {
      ensurePill();
    }
  });

  w.clarityLandingStay = stay;
  w.clarityLandingSkip = skipToMain;
  w.clarityOpenDaySurface = openLanding;
})(typeof window !== "undefined" ? window : this);
