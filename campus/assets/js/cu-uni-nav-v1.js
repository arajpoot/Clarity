/* 20261023CLEAN cleanse */
/**
 * cu-uni-nav-v1.js — Unified University navigation + stage rail
 * Educational path only. Does not edit Companion files.
 */
(function (g) {
  "use strict";
  if (g.__CU_UNI_NAV_V1__) return;
  g.__CU_UNI_NAV_V1__ = true;

  var PRIMARY = [
    { href: "/charter/", label: "Charter" },
    { href: "/campus/", label: "Campus" },
    { href: "/campus/desk/", label: "Desk" },
    { href: "/campus/faculty.html", label: "Faculty" },
    { href: "/campus/bots.html", label: "Bots" },
    { href: "/campus/grading.html", label: "Progress" },
    { href: "/lab/", label: "Lab" },
    { href: "/library/", label: "Library" },
    { href: "/", label: "Companion" }
  ];

  var STAGES = [
    { href: "/campus/desk/seeker/", id: "seeker", label: "Seeker" },
    { href: "/campus/desk/practice/", id: "practice", label: "Practice" },
    { href: "/campus/desk/consistency/", id: "consistency", label: "Consistency" },
    { href: "/campus/desk/transmission/", id: "transmission", label: "Transmission" }
  ];

  function path() {
    return (location.pathname || "/").replace(/\/+$/, "") || "/";
  }

  function isCurrent(href) {
    var p = path();
    var h = href.replace(/\/+$/, "") || "/";
    if (h === "/") return p === "/" || p === "";
    if (h === "/campus") return p === "/campus";
    if (h === "/campus/desk") return p === "/campus/desk";
    return p === h || p.indexOf(h + "/") === 0;
  }

  function stageId() {
    var b = document.body && document.body.getAttribute("data-phase-room");
    if (b) return b;
    var m = path().match(/\/campus\/desk\/(seeker|practice|consistency|transmission)/);
    return m ? m[1] : null;
  }

  function buildStages(el) {
    el.innerHTML = "";
    var sid = stageId();
    STAGES.forEach(function (s) {
      var a = document.createElement("a");
      a.href = s.href;
      a.textContent = s.label;
      if (sid === s.id) a.setAttribute("aria-current", "page");
      if (g.CuSeq && g.CuSeq.isStageUnlocked && !g.CuSeq.isStageUnlocked(s.id)) {
        a.className = "is-locked";
        a.title = "Complete previous stage first";
      }
      el.appendChild(a);
    });
  }

  function inject() {
    var host = document.getElementById("cu-uni-path");
    if (!host) {
      host = document.createElement("div");
      host.id = "cu-uni-path";
      host.className = "cu-uni-path";
      host.setAttribute("role", "navigation");
      host.setAttribute("aria-label", "University path");

      var rail = document.createElement("div");
      rail.className = "cu-uni-path-rail";
      PRIMARY.forEach(function (item) {
        var a = document.createElement("a");
        a.href = item.href;
        a.textContent = item.label;
        if (isCurrent(item.href)) a.setAttribute("aria-current", "page");
        rail.appendChild(a);
      });
      host.appendChild(rail);

      var stages = document.createElement("div");
      stages.id = "cu-uni-stages";
      stages.className = "cu-uni-stages";
      stages.setAttribute("aria-label", "Learning stages");
      host.appendChild(stages);

      var crumb = document.createElement("p");
      crumb.className = "cu-uni-crumb";
      crumb.textContent =
        "Path · Charter → Campus → Desk stages → Faculty / Progress → Lab · Educational only — not a fatwa";
      host.appendChild(crumb);

      var banner = document.querySelector("header.cu-banner, header");
      if (banner && banner.parentNode) {
        if (banner.nextSibling) banner.parentNode.insertBefore(host, banner.nextSibling);
        else banner.parentNode.appendChild(host);
      } else {
        document.body.insertBefore(host, document.body.firstChild);
      }

      document.querySelectorAll("nav.cu-pills").forEach(function (nav) {
        var html = nav.innerHTML || "";
        if (/lab\/arabic|tajweed|recite|calligraphy/i.test(html) && path().indexOf("/lab") === 0)
          return;
        nav.style.display = "none";
        nav.setAttribute("data-uni-replaced", "1");
      });
    }
    var stagesEl = document.getElementById("cu-uni-stages");
    if (stagesEl) buildStages(stagesEl);
  }

  function enrichCampusJourney() {
    if (path() !== "/campus") return;
    if (document.getElementById("cu-uni-journey")) return;
    var main = document.querySelector("main");
    if (!main) return;
    var box = document.createElement("section");
    box.id = "cu-uni-journey";
    box.className = "cu-uni-journey";
    box.innerHTML =
      "<strong>University journey</strong>" +
      "<ol>" +
      '<li><a href="/charter/">Charter</a> — limits and intention</li>' +
      '<li><a href="/campus/">Campus</a> — admit &amp; continue learning</li>' +
      '<li><a href="/campus/desk/seeker/">Seeker</a> → <a href="/campus/desk/practice/">Practice</a> → <a href="/campus/desk/consistency/">Consistency</a> → <a href="/campus/desk/transmission/">Transmission</a></li>' +
      '<li><a href="/campus/faculty.html">Faculty</a> · <a href="/campus/bots.html">Bots</a> · <a href="/campus/grading.html">Progress</a></li>' +
      '<li><a href="/lab/">Lab</a> · <a href="/library/">Library</a> — practice aids</li>' +
      "</ol>" +
      '<p style="font-size:.8rem;opacity:.85;margin:.5rem 0 0">Nothing before its proper time. Markers are a study mirror — not a grade of īmān.</p>';
    var slot = document.getElementById("seq-continue-slot");
    if (slot && slot.parentNode) slot.parentNode.insertBefore(box, slot);
    else main.insertBefore(box, main.firstChild);
  }

  function boot() {
    inject();
    enrichCampusJourney();
    document.addEventListener("cu-seq-progress", function () {
      var stagesEl = document.getElementById("cu-uni-stages");
      if (stagesEl) buildStages(stagesEl);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
