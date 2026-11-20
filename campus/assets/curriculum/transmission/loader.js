/*! /campus/assets/curriculum/transmission/loader.js · U28S
 * Surface-local curriculum chain (no deep vault dependency for runtime).
 * Educational only — not a fatwa · not a grade of īmān.
 */
(function (w, d) {
  "use strict";
  var FLAG = "__CU_CURRICULUM_SURFACE_TRANSMISSION_U28S__";
  if (w[FLAG]) return;
  w[FLAG] = true;

  var SHARED = "/campus/assets/curriculum/shared/";
  var ROOM = "/campus/assets/curriculum/transmission/";
  var V = "20261120U37";
  var CSS = [SHARED + "phase-plaque.css"];
  var CHAIN = [
    SHARED + "engine.js",
    SHARED + "spark-quiz.js",
    SHARED + "phase-plaque.js",
    ROOM + "college-transmission.js"
  ];

  function loadCss(href) {
    return new Promise(function (resolve) {
      if (d.querySelector('link[data-cu-surf="' + href + '"]')) return resolve();
      var l = d.createElement("link");
      l.rel = "stylesheet";
      l.href = href + (href.indexOf("?") >= 0 ? "&" : "?") + "v=" + V;
      l.setAttribute("data-cu-surf", href);
      l.onload = function () { resolve(); };
      l.onerror = function () { resolve(); };
      d.head.appendChild(l);
    });
  }

  function loadScript(src) {
    return new Promise(function (resolve) {
      if (d.querySelector('script[data-cu-surf="' + src + '"]')) return resolve();
      var s = d.createElement("script");
      s.src = src + (src.indexOf("?") >= 0 ? "&" : "?") + "v=" + V;
      s.setAttribute("data-cu-surf", src);
      s.onload = function () { resolve(); };
      s.onerror = function () { resolve(); };
      d.head.appendChild(s);
    });
  }

  function series(list, fn) {
    return list.reduce(function (p, item) {
      return p.then(function () { return fn(item); });
    }, Promise.resolve());
  }

  function boot() {
    series(CSS, loadCss)
      .then(function () { return series(CHAIN, loadScript); })
      .then(function () {
        try {
          w.dispatchEvent(new CustomEvent("clarity-curriculum-ready", {
            detail: { room: "transmission", build: "U28S", surface: true }
          }));
        } catch (e) {}
      });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
