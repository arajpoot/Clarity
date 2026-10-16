/**
 * Campus surface loader S5 — surface paths only for shell assets
 */
(function (g) {
  "use strict";
  if (g.ClarityCampusAssets) return;
  var SURF_JS = "/campus/assets/js/";
  var SURF_CSS = "/campus/assets/css/";
  function loadScript(name, ver) {
    ver = ver || "20261016S4S6";
    return new Promise(function (resolve) {
      var base = name.split("/").pop();
      if (document.querySelector('script[src*="' + base + '"]')) return resolve(true);
      var s = document.createElement("script");
      s.defer = true;
      s.src = SURF_JS + base + "?v=" + ver;
      s.onload = function () { resolve(true); };
      s.onerror = function () { resolve(false); };
      document.head.appendChild(s);
    });
  }
  function loadCss(name, ver) {
    ver = ver || "20261016S4S6";
    return new Promise(function (resolve) {
      var base = name.split("/").pop();
      if (document.querySelector('link[href*="' + base + '"]')) return resolve(true);
      var l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = SURF_CSS + base + "?v=" + ver;
      l.onload = function () { resolve(true); };
      l.onerror = function () { resolve(false); };
      document.head.appendChild(l);
    });
  }
  g.ClarityCampusAssets = { loadScript: loadScript, loadCss: loadCss, SURF_JS: SURF_JS, SURF_CSS: SURF_CSS };
})(typeof window !== "undefined" ? window : this);
