/*! cu-campus-foundation-v1 · U36 CF1
 * Canonical landing order + anti-leak. Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CU_CAMPUS_FOUNDATION_V1__) return;
  w.__CU_CAMPUS_FOUNDATION_V1__ = true;

  function path() {
    return (location.pathname || "").replace(/\/+$/, "") || "";
  }
  function isLanding() {
    var p = path();
    return p === "/campus" || p === "";
  }

  function stripHubCurriculum() {
    if (!isLanding()) return;
    d.querySelectorAll(
      "#junior-curriculum-card, .junior-curriculum-card, #clarity-phase-plaque-rail, .clarity-phase-plaque-rail"
    ).forEach(function (el) {
      try {
        el.style.setProperty("display", "none", "important");
        el.setAttribute("data-cf-hide", "1");
      } catch (e) {}
    });
    d.querySelectorAll("h2, .card-title").forEach(function (el) {
      if (!/Junior curriculum/i.test(el.textContent || "")) return;
      var root = el.closest("section, article, .card, div") || el;
      try {
        root.style.setProperty("display", "none", "important");
      } catch (e2) {}
    });
  }

  function orderLanding() {
    if (!isLanding()) return;
    var roomNav = d.querySelector("nav.clarity-room-nav");
    var hero = d.querySelector("header.cu-hero");
    var gate = d.getElementById("cu-gate-block") || d.querySelector(".cu-gate-block");
    var conductor = d.getElementById("cu-path-conductor");
    var write = d.getElementById("cu-write-clarity") || d.querySelector(".cu-write-clarity");
    var foot = d.querySelector("footer.cu-foot, footer.cu-niyyah-footer, footer");

    function placeAfter(node, ref) {
      if (!node || !ref || !ref.parentNode) return;
      if (node.parentNode) node.parentNode.removeChild(node);
      if (ref.nextSibling) ref.parentNode.insertBefore(node, ref.nextSibling);
      else ref.parentNode.appendChild(node);
    }

    if (hero && roomNav) placeAfter(hero, roomNav);
    if (gate && hero) placeAfter(gate, hero);
    if (conductor && gate) placeAfter(conductor, gate);
    else if (conductor && hero) placeAfter(conductor, hero);
    if (write && foot) {
      try {
        foot.parentNode.insertBefore(write, foot);
      } catch (e) {}
    }
  }

  function boot() {
    try {
      stripHubCurriculum();
      orderLanding();
      d.documentElement.setAttribute("data-cu-foundation", "U36");
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  [150, 500, 1200, 2500].forEach(function (t) {
    setTimeout(boot, t);
  });
})(window, document);
