/*! cu-vle-hud-v1 · U52
 * Virtual Learning Experience HUD on desk + bots — surface paths only.
 * Educational only — not a fatwa · not a grade of īmān · not a live classroom
 */
(function (w, d) {
  "use strict";
  if (w.__CU_VLE_HUD_V1__) return;
  w.__CU_VLE_HUD_V1__ = true;

  function path() {
    return (location.pathname || "").replace(/\/+$/, "") || "";
  }
  function onPath() {
    var p = path();
    return (
      p.indexOf("/campus/desk") === 0 ||
      p === "/campus/bots" ||
      p === "/campus/lab" ||
      p.indexOf("/campus/lab/") === 0
    );
  }

  function juniorDone() {
    try {
      var o = JSON.parse(localStorage.getItem("clarity_junior_progress_v1") || "{}");
      var n = 0;
      Object.keys(o || {}).forEach(function (k) {
        if (o[k]) n++;
      });
      return n;
    } catch (e) {
      return 0;
    }
  }

  function phase() {
    try {
      return parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1;
    } catch (e) {
      return 1;
    }
  }

  function ensureCss() {
    if (d.querySelector('link[data-cu-vle-hud]')) return;
    var l = d.createElement("link");
    l.rel = "stylesheet";
    l.href = "/campus/assets/css/cu-vle-hud-v1.css?v=20261121U52";
    l.setAttribute("data-cu-vle-hud", "1");
    d.head.appendChild(l);
  }

  function mount() {
    if (!onPath()) return;
    if (d.getElementById("cu-vle-hud")) return;
    ensureCss();
    var done = juniorDone();
    var ph = phase();
    var sec = d.createElement("section");
    sec.id = "cu-vle-hud";
    sec.className = "cu-vle-hud";
    sec.setAttribute("data-clarity-owned", "vle-hud-v1");
    sec.innerHTML =
      '<div class="vle-bar" role="status">' +
      '<span class="vle-live" aria-hidden="true"></span>' +
      '<span class="vle-label">VLE · on-device</span>' +
      '<span class="vle-meta">Phase ' +
      ph +
      " · Junior " +
      done +
      "/12 · study mirror</span>" +
      '<a class="vle-btn primary" href="/campus/bots/">Bots ops</a>' +
      '<a class="vle-btn" href="/campus/desk/seeker/">Seeker</a>' +
      '<a class="vle-btn" href="/campus/faculty.html">Faculty</a>' +
      '<a class="vle-btn" href="/campus/portal/">Portal</a>' +
      "</div>";
    var main = d.querySelector("main") || d.body;
    var anchor = main.querySelector("h1, h2, .cu-hero, header");
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(sec, anchor.nextSibling);
    else main.insertBefore(sec, main.firstChild);
  }

  function boot() {
    try {
      mount();
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 350);
})(window, document);
