/*! companion-g2-polished-v1 · no double nav · no track clone · mobile path bar */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_G2_POLISHED_V1__) return;
  w.__CLARITY_G2_POLISHED_V1__ = true;
  var LOG = (w.__G2_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  function dedupeRoomNav() {
    var navs = d.querySelectorAll("nav.clarity-room-nav");
    if (navs.length <= 1) {
      log("nav-count:" + navs.length);
      return;
    }
    /* keep first rich nav */
    for (var i = 1; i < navs.length; i++) {
      try {
        navs[i].parentNode.removeChild(navs[i]);
        log("nav-removed-dup");
      } catch (e) {}
    }
  }

  function sealFive() {
    d.querySelectorAll(".crn-seal, .clarity-room-nav p").forEach(function (el) {
      if (/four rooms/i.test(el.textContent || "")) {
        el.textContent = "Five rooms · educational only · not a fatwa";
        log("seal-five");
      }
    });
  }

  function tracksOnce() {
    /* remove clones only */
    var globals = d.querySelectorAll("#clarity-track-strip-global, [data-global-track]");
    globals.forEach(function (el) {
      try {
        el.parentNode.removeChild(el);
        log("track-clone-removed");
      } catch (e) {}
    });
    var gates = d.querySelectorAll(".clarity-gate-switcher");
    if (gates.length > 1) {
      for (var i = 1; i < gates.length; i++) {
        try {
          gates[i].parentNode.removeChild(gates[i]);
          log("gate-dup-removed");
        } catch (e2) {}
      }
    }
    var g = d.querySelector(".clarity-gate-switcher");
    if (g) {
      g.style.setProperty("display", "flex", "important");
      g.hidden = false;
      log("gate-ok");
    }
  }

  function boot() {
    dedupeRoomNav();
    sealFive();
    tracksOnce();
    setTimeout(function () {
      dedupeRoomNav();
      sealFive();
      tracksOnce();
    }, 600);
    setTimeout(function () {
      dedupeRoomNav();
      sealFive();
      tracksOnce();
    }, 1500);
    log("g2-polished-boot");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(function () {
      dedupeRoomNav();
      sealFive();
      tracksOnce();
    }, 200);
  });
})(window, document);
