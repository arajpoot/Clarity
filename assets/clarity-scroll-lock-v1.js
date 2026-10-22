/**
 * Companion scroll lock · 20261022SCROLL2
 * Force top-of-page on landing for mobile + desktop.
 * Blocks programmatic scroll/focus-scroll during lock window.
 * User-driven scroll after lock ends is allowed.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_SCROLL_LOCK_V1__ === "20261022SCROLL2") return;
  w.__CLARITY_SCROLL_LOCK_V1__ = "20261022SCROLL2";

  var LOCK_MS = 3500;
  var lockedUntil = 0;
  var raf = 0;

  function isLanding() {
    try {
      var root = document.documentElement;
      if (root.classList.contains("clarity-landing-active")) return true;
      if (document.body && document.body.classList.contains("clarity-landing-active")) return true;
      if (/[?&]landing=1(?:&|$)/.test(w.location.search || "")) return true;
      /* first paint before class: no skipDay today */
      var KEY = "clarity_landing_gate_v1";
      var d = new Date();
      var day = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      try {
        var s = JSON.parse(localStorage.getItem(KEY) || "{}") || {};
        if (s.skipDay === day) return false;
        if (/[?&]main=1(?:&|$)/.test(w.location.search || "")) return false;
        if (/[?&]landing=0(?:&|$)/.test(w.location.search || "")) return false;
        return true; /* default first open → landing */
      } catch (e0) {
        return true;
      }
    } catch (e) {
      return false;
    }
  }

  function pinTop() {
    try {
      var x = w.scrollX || 0;
      if (w.scrollTo) w.scrollTo(x, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      var se = document.scrollingElement;
      if (se) se.scrollTop = 0;
    } catch (e) {}
  }

  function armLock(ms) {
    lockedUntil = Date.now() + (ms || LOCK_MS);
    pinTop();
    if (raf) cancelAnimationFrame(raf);
    var end = lockedUntil;
    function tick() {
      if (Date.now() > end) return;
      if (isLanding()) pinTop();
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
  }

  function locked() {
    return Date.now() < lockedUntil && isLanding();
  }

  /* history */
  try {
    if ("scrollRestoration" in w.history) {
      w.history.scrollRestoration = "manual";
    }
  } catch (e1) {}

  /* strip hash on landing so browser does not jump to #reminder */
  function stripHashIfLanding() {
    if (!isLanding()) return;
    try {
      if (w.location.hash && w.location.hash.length > 1) {
        if (w.history && w.history.replaceState) {
          w.history.replaceState(null, "", w.location.pathname + w.location.search);
        }
      }
    } catch (e2) {}
  }

  /* wrap scrollTo */
  if (typeof w.scrollTo === "function") {
    var _scrollTo = w.scrollTo.bind(w);
    w.scrollTo = function (a, b) {
      if (locked()) {
        _scrollTo(0, 0);
        return;
      }
      if (typeof a === "object" && a !== null) {
        return _scrollTo(a);
      }
      return _scrollTo(a, b);
    };
  }

  /* wrap scrollBy */
  if (typeof w.scrollBy === "function") {
    var _scrollBy = w.scrollBy.bind(w);
    w.scrollBy = function (a, b) {
      if (locked()) {
        pinTop();
        return;
      }
      return _scrollBy.apply(w, arguments);
    };
  }

  /* wrap Element.scrollIntoView */
  try {
    var proto = Element.prototype;
    var _siv = proto.scrollIntoView;
    if (_siv) {
      proto.scrollIntoView = function () {
        if (locked()) {
          pinTop();
          return;
        }
        return _siv.apply(this, arguments);
      };
    }
  } catch (e3) {}

  /* wrap focus — mobile Safari scrolls focused nodes into view */
  try {
    var _focus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function () {
      if (locked()) {
        try {
          return _focus.call(this, { preventScroll: true });
        } catch (e4) {
          return; /* skip focus during lock */
        }
      }
      try {
        return _focus.apply(this, arguments);
      } catch (e5) {
        return _focus.call(this);
      }
    };
  } catch (e6) {}

  function onScroll() {
    if (locked()) pinTop();
  }

  function boot() {
    stripHashIfLanding();
    if (isLanding()) {
      armLock(LOCK_MS);
      setTimeout(pinTop, 0);
      setTimeout(pinTop, 100);
      setTimeout(pinTop, 400);
      setTimeout(pinTop, 1000);
      setTimeout(pinTop, 2000);
    }
  }

  w.addEventListener("scroll", onScroll, { passive: true, capture: true });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else boot();
  w.addEventListener("load", function () {
    stripHashIfLanding();
    if (isLanding()) armLock(2500);
  });
  w.addEventListener("hashchange", function () {
    if (isLanding()) {
      stripHashIfLanding();
      pinTop();
    }
  });
  w.addEventListener("pageshow", function (ev) {
    if (isLanding()) armLock(2000);
  });

  w.clarityPinTop = pinTop;
  w.clarityArmScrollLock = armLock;
})(typeof window !== "undefined" ? window : this);
