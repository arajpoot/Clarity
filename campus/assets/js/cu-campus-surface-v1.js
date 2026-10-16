/**
 * Campus surface loader S2 — try /campus/assets first, fallback deep path
 */
(function (g) {
  "use strict";
  if (g.ClarityCampusAssets) return;
  var DEEP = "/assets/curriculum/vault/admin/campus/";
  var SURF_JS = "/campus/assets/js/";
  var SURF_CSS = "/campus/assets/css/";

  function loadScript(name, ver) {
    ver = ver || "20261016S0S3";
    return new Promise(function (resolve) {
      var base = name.split("/").pop();
      if (document.querySelector('script[src*="' + base + '"]')) return resolve(true);
      var s = document.createElement("script");
      s.defer = true;
      s.onload = function () { resolve(true); };
      s.onerror = function () {
        if (s.src.indexOf(SURF_JS) >= 0) {
          s2 = document.createElement("script");
          s2.defer = true;
          s2.src = DEEP + base + "?v=" + ver;
          s2.onload = function () { resolve(true); };
          s2.onerror = function () { resolve(false); };
          document.head.appendChild(s2);
        } else resolve(false);
      };
      var s2;
      s.src = SURF_JS + base + "?v=" + ver;
      document.head.appendChild(s);
    });
  }

  function loadCss(name, ver) {
    ver = ver || "20261016S0S3";
    return new Promise(function (resolve) {
      var base = name.split("/").pop();
      if (document.querySelector('link[href*="' + base + '"]')) return resolve(true);
      var l = document.createElement("link");
      l.rel = "stylesheet";
      l.onload = function () { resolve(true); };
      l.onerror = function () {
        if (l.href.indexOf(SURF_CSS) >= 0) {
          var l2 = document.createElement("link");
          l2.rel = "stylesheet";
          l2.href = DEEP + base + "?v=" + ver;
          l2.onload = function () { resolve(true); };
          l2.onerror = function () { resolve(false); };
          document.head.appendChild(l2);
        } else resolve(false);
      };
      l.href = SURF_CSS + base + "?v=" + ver;
      document.head.appendChild(l);
    });
  }

  g.ClarityCampusAssets = { loadScript: loadScript, loadCss: loadCss, SURF_JS: SURF_JS, SURF_CSS: SURF_CSS, DEEP: DEEP };
})(typeof window !== "undefined" ? window : this);
