/*! cu-campus-rails-v1 · site + curriculum rails · campus only · educational only */
(function (w, d) {
  "use strict";
  if (w.__CU_CAMPUS_RAILS_V1__) return;
  w.__CU_CAMPUS_RAILS_V1__ = true;

  var SITE = [
    { href: "/", label: "Port", ico: "P" },
    { href: "/companion/", label: "Companion", ico: "C" },
    { href: "/daily/", label: "Yawm", ico: "Y" },
    { href: "/campus/", label: "University", ico: "U", here: true },
    { href: "/amana/", label: "Amānah", ico: "A" },
    { href: "/craft/", label: "Craft", ico: "K" }
  ];

  var CURR = [
    { href: "/campus/", label: "Campus" },
    { href: "/campus/desk/", label: "Desk" },
    { href: "/campus/desk/seeker/", label: "Seeker", stage: "seeker" },
    { href: "/campus/desk/practice/", label: "Practice", stage: "practice" },
    { href: "/campus/desk/consistency/", label: "Consistency", stage: "consistency" },
    { href: "/campus/desk/transmission/", label: "Transmission", stage: "transmission" },
    { href: "/campus/desk/foundation/", label: "Foundation" },
    { href: "/campus/desk/pillars/", label: "Pillars" },
    { href: "/campus/desk/ihsan/", label: "Iḥsān" },
    { href: "/campus/desk/amanah/", label: "Amānah" },
    { href: "/campus/assignments/", label: "Assignments" },
    { href: "/campus/grading.html", label: "Progress" },
    { href: "/campus/lab/", label: "Lab" },
    { href: "/campus/library/", label: "Library" },
    { href: "/campus/buddy/", label: "Buddy" },
    { href: "/campus/portal/", label: "Portal" },
    { href: "/campus/charter/", label: "Charter" }
  ];

  function path() {
    return (location.pathname || "/").replace(/\/+$/, "") || "/";
  }

  function isHere(href) {
    var p = path();
    var h = href.replace(/\/+$/, "") || "/";
    if (h === "/") return p === "/";
    return p === h || p.indexOf(h + "/") === 0;
  }

  function injectSite() {
    if (d.getElementById("cu-site-rail")) return;
    var rail = d.createElement("nav");
    rail.id = "cu-site-rail";
    rail.className = "cu-site-rail";
    rail.setAttribute("aria-label", "Clarity rooms");
    SITE.forEach(function (s) {
      var a = d.createElement("a");
      a.href = s.href;
      a.innerHTML = '<span class="ico" aria-hidden="true">' + s.ico + "</span> " + s.label;
      if (s.here || isHere(s.href)) a.className = "is-here";
      rail.appendChild(a);
    });
    d.body.insertBefore(rail, d.body.firstChild);
  }

  function injectCurr() {
    if (d.getElementById("cu-curr-rail")) return;
    var stage = (d.body && d.body.getAttribute("data-seq-stage")) || "";
    var rail = d.createElement("nav");
    rail.id = "cu-curr-rail";
    rail.className = "cu-curr-rail";
    rail.setAttribute("aria-label", "University curriculum");
    CURR.forEach(function (c) {
      var a = d.createElement("a");
      a.href = c.href;
      a.textContent = c.label;
      if (isHere(c.href) || (c.stage && c.stage === stage)) a.className = "here";
      rail.appendChild(a);
    });
    var site = d.getElementById("cu-site-rail");
    if (site && site.nextSibling) site.parentNode.insertBefore(rail, site.nextSibling);
    else d.body.insertBefore(rail, d.body.firstChild);
  }

  function boot() {
    var room = (d.documentElement.getAttribute("data-clarity-room") || "").toLowerCase();
    var p = path();
    if (room !== "university" && p.indexOf("/campus") !== 0) return;
    injectSite();
    injectCurr();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
