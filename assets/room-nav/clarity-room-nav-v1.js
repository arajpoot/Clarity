/*! clarity-room-nav-v1 · 20261104C5
 * Single sticky rail only. Four isolation doors + soft Craft tile.
 * If a .clarity-room-nav already exists → upgrade in place (add Craft if missing).
 * Never insert a second rail. No cross-room module imports.
 * Educational only — not a fatwa.
 */
(function () {
  "use strict";
  if (window.__CLARITY_ROOM_NAV_V1__) return;
  window.__CLARITY_ROOM_NAV_V1__ = true;

  var ROOMS = {
    companion: {
      href: "/companion/",
      match: function (p) {
        p = p || "";
        return p === "/companion" || p.indexOf("/companion/") === 0;
      }
    },
    yawm: {
      href: "/daily/",
      match: function (p) {
        return (p || "").indexOf("/daily") === 0;
      }
    },
    university: {
      href: "/campus/",
      match: function (p) {
        return (p || "").indexOf("/campus") === 0;
      }
    },
    amana: {
      href: "/amana/",
      match: function (p) {
        return (p || "").indexOf("/amana") === 0;
      }
    },
    craft: {
      href: "/craft/",
      match: function (p) {
        return (p || "").indexOf("/craft") === 0;
      }
    }
  };

  function path() {
    try {
      return location.pathname || "/";
    } catch (e) {
      return "/";
    }
  }

  function mark(nav) {
    if (!nav) return;
    var p = path();
    var forced = (nav.getAttribute("data-room") || "").toLowerCase();
    var links = nav.querySelectorAll("[data-room-link]");
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var id = (a.getAttribute("data-room-link") || "").toLowerCase();
      var here = forced ? id === forced : ROOMS[id] && ROOMS[id].match(p);
      a.classList.toggle("is-here", !!here);
      if (here) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    }
  }

  function craftAnchor() {
    var a = document.createElement("a");
    a.href = "/craft/";
    a.setAttribute("data-room-link", "craft");
    a.innerHTML =
      '<span class="crn-ico" aria-hidden="true">✒️</span>' +
      '<span class="crn-label">Craft<span class="crn-sub">meme · tajweed · desks</span></span>';
    return a;
  }

  function fullNavHtml() {
    return (
      '<a href="/companion/" data-room-link="companion">' +
        '<span class="crn-ico" aria-hidden="true">🏠</span>' +
        '<span class="crn-label">Companion<span class="crn-sub">tools · reminder</span></span></a>' +
      '<a href="/daily/" data-room-link="yawm">' +
        '<span class="crn-ico" aria-hidden="true">🌅</span>' +
        '<span class="crn-label">Yawm<span class="crn-sub">today’s portion</span></span></a>' +
      '<a href="/campus/" data-room-link="university">' +
        '<span class="crn-ico" aria-hidden="true">🎓</span>' +
        '<span class="crn-label">University<span class="crn-sub">ordered path</span></span></a>' +
      '<a href="/amana/" data-room-link="amana">' +
        '<span class="crn-ico" aria-hidden="true">🔐</span>' +
        '<span class="crn-label">Amānah<span class="crn-sub">vault · dayn · heirs</span></span></a>' +
      '<a href="/craft/" data-room-link="craft">' +
        '<span class="crn-ico" aria-hidden="true">✒️</span>' +
        '<span class="crn-label">Craft<span class="crn-sub">meme · tajweed · desks</span></span></a>' +
      '<p class="crn-seal">Five rooms · educational only · not a fatwa</p>'
    );
  }

  /**
   * SINGLE-RAIL RULE (NAV CONTRACT):
   * - If .clarity-room-nav exists → mutate it only (add Craft tile if absent).
   * - Never create a second .clarity-room-nav.
   * - Seal text updates to “Five rooms…” when Craft is present.
   */
  function ensureNav(room) {
    var existing = document.querySelector(".clarity-room-nav");
    if (existing) {
      if (room) existing.setAttribute("data-room", room);
      if (!existing.querySelector('[data-room-link="craft"]')) {
        var seal = existing.querySelector(".crn-seal");
        var link = craftAnchor();
        if (seal) existing.insertBefore(link, seal);
        else existing.appendChild(link);
        if (seal) seal.textContent = "Five rooms · educational only · not a fatwa";
      }
      mark(existing);
      return existing;
    }
    var nav = document.createElement("nav");
    nav.className = "clarity-room-nav";
    nav.setAttribute("aria-label", "Clarity rooms");
    if (room) nav.setAttribute("data-room", room);
    nav.innerHTML = fullNavHtml();
    var body = document.body;
    if (body) {
      if (body.firstChild) body.insertBefore(nav, body.firstChild);
      else body.appendChild(nav);
    }
    mark(nav);
    return nav;
  }

  function detectRoom() {
    var room =
      document.documentElement.getAttribute("data-clarity-room") ||
      (document.body && document.body.getAttribute("data-clarity-room")) ||
      "";
    room = (room || "").toLowerCase();
    if (room) return room;
    var p = path();
    if (p.indexOf("/daily") === 0) return "yawm";
    if (p.indexOf("/campus") === 0) return "university";
    if (p.indexOf("/amana") === 0) return "amana";
    if (p.indexOf("/craft") === 0) return "craft";
    if (p === "/companion" || p.indexOf("/companion/") === 0) return "companion";
    return "";
  }

  function boot() {
    ensureNav(detectRoom());
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("popstate", function () {
    mark(document.querySelector(".clarity-room-nav"));
  });
})();
