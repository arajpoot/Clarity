/*! clarity-room-nav-v1 · 20261104C10
 * Single sticky rail only.
 * Four isolation doors (Companion · Yawm · University · Amānah) + soft Craft surface tile.
 * Upgrades EVERY existing .clarity-room-nav in place (add Craft if missing).
 * Never inserts a second rail when one exists.
 * No cross-room module imports · no Amānah/Yawm/Campus isolation breach.
 * Educational only — not a fatwa.
 *
 * Governance: ARCHITECTURE four-door isolation remains authoritative.
 * Craft is a soft fifth chrome tile only — not a new isolation domain.
 */
(function () {
  "use strict";
  if (window.__CLARITY_ROOM_NAV_V1_C10__) return;
  window.__CLARITY_ROOM_NAV_V1_C10__ = true;
  window.__CLARITY_ROOM_NAV_V1_C8__ = true;
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
      a.classList.toggle("here", !!here);
      if (here) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    }
  }

  function isSimpleRail(nav) {
    if (!nav) return false;
    if (nav.classList.contains("top")) return true;
    var sample = nav.querySelector("[data-room-link]");
    if (!sample) return false;
    return !sample.querySelector(".crn-ico, .crn-label");
  }

  function craftAnchor(simple) {
    var a = document.createElement("a");
    a.href = "/craft/";
    a.setAttribute("data-room-link", "craft");
    a.setAttribute("title", "Craft · soft surface · educational only");
    if (simple) {
      a.textContent = "Craft";
    } else {
      a.innerHTML =
        '<span class="crn-ico" aria-hidden="true">✒️</span>' +
        '<span class="crn-label">Craft<span class="crn-sub">meme · tajweed · desks</span></span>';
    }
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

  function upgradeOne(nav, room) {
    if (!nav) return;
    if (room) nav.setAttribute("data-room", room);
    if (!nav.querySelector('[data-room-link="craft"]')) {
      var simple = isSimpleRail(nav);
      var link = craftAnchor(simple);
      var seal = nav.querySelector(".crn-seal");
      if (seal) {
        nav.insertBefore(link, seal);
        seal.textContent = "Five rooms · educational only · not a fatwa";
      } else {
        nav.appendChild(link);
        if (!simple) {
          var p = document.createElement("p");
          p.className = "crn-seal";
          p.textContent = "Five rooms · educational only · not a fatwa";
          nav.appendChild(p);
        }
      }
    } else {
      var seal2 = nav.querySelector(".crn-seal");
      if (seal2) seal2.textContent = "Five rooms · educational only · not a fatwa";
    }
    mark(nav);
  }

  function ensureNav(room) {
    var list = document.querySelectorAll(".clarity-room-nav");
    if (list && list.length) {
      for (var i = 0; i < list.length; i++) upgradeOne(list[i], room);
      return list[0];
    }
    /* Only create when completely absent — never double */
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
    var room = "";
    try {
      room =
        (document.documentElement && document.documentElement.getAttribute("data-clarity-room")) ||
        (document.body && document.body.getAttribute("data-clarity-room")) ||
        "";
    } catch (e) {}
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
    try {
      ensureNav(detectRoom());
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  window.addEventListener("load", function () {
    ensureNav(detectRoom());
  });
  setTimeout(function () {
    ensureNav(detectRoom());
  }, 400);
  window.addEventListener("popstate", function () {
    var n = document.querySelector(".clarity-room-nav");
    if (n) mark(n);
  });

  window.ClarityRoomNavUpgrade = function () {
    ensureNav(detectRoom());
  };
})();
