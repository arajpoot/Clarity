/*! clarity-room-nav-v1 · isolated rooms · no cross-room module imports */
(function () {
  "use strict";
  if (window.__CLARITY_ROOM_NAV_V1__) return;
  window.__CLARITY_ROOM_NAV_V1__ = true;

  var ROOMS = {
    companion: { href: "/companion/", match: function (p) {
      p = p || "";
      return p === "/companion" || p.indexOf("/companion/") === 0;
    }},
    yawm: { href: "/daily/", match: function (p) { return (p || "").indexOf("/daily") === 0; }},
    university: { href: "/campus/", match: function (p) { return (p || "").indexOf("/campus") === 0; }}
  };


  function path() {
    try { return location.pathname || "/"; } catch (e) { return "/"; }
  }

  function mark(nav) {
    if (!nav) return;
    var p = path();
    var forced = (nav.getAttribute("data-room") || "").toLowerCase();
    var links = nav.querySelectorAll("[data-room-link]");
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var id = (a.getAttribute("data-room-link") || "").toLowerCase();
      var here = forced ? (id === forced) : (ROOMS[id] && ROOMS[id].match(p));
      a.classList.toggle("is-here", !!here);
      if (here) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    }
  }

  function ensureNav(room) {
    var existing = document.querySelector(".clarity-room-nav");
    if (existing) {
      if (room) existing.setAttribute("data-room", room);
      mark(existing);
      return existing;
    }
    var nav = document.createElement("nav");
    nav.className = "clarity-room-nav";
    nav.setAttribute("aria-label", "Clarity rooms");
    if (room) nav.setAttribute("data-room", room);
    nav.innerHTML =
      '<a href="/companion/" data-room-link="companion"><span class="crn-ico" aria-hidden="true">🏠</span>' +
        '<span class="crn-label">Companion<span class="crn-sub">tools · vault · reminder</span></span></a>' +
      '<a href="/daily/" data-room-link="yawm"><span class="crn-ico" aria-hidden="true">🌅</span>' +
        '<span class="crn-label">Yawm<span class="crn-sub">today’s portion</span></span></a>' +
      '<a href="/campus/" data-room-link="university"><span class="crn-ico" aria-hidden="true">🎓</span>' +
        '<span class="crn-label">University<span class="crn-sub">ordered path</span></span></a>' +
      '<p class="crn-seal">Three rooms · educational only · not a fatwa</p>';
    var body = document.body;
    if (body) {
      if (body.firstChild) body.insertBefore(nav, body.firstChild);
      else body.appendChild(nav);
    }
    mark(nav);
    return nav;
  }

  function boot() {
    var room = document.documentElement.getAttribute("data-clarity-room") ||
      (document.body && document.body.getAttribute("data-clarity-room")) || "";
    room = (room || "").toLowerCase();
    if (!room) {
      var p = path();
      if (p.indexOf("/daily") === 0) room = "yawm";
      else if (p.indexOf("/campus") === 0) room = "university";
      else if (p === "/companion" || p.indexOf("/companion/") === 0) room = "companion";
      else room = ""; /* thin door at root — no room current */
    }
    ensureNav(room);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("popstate", function () {
    mark(document.querySelector(".clarity-room-nav"));
  });
})();
