/*! companion pathway pack · reflection · C2 curtain · educational only — not a fatwa */
(function (w, d) {
  "use strict";
  var ID = "reflection";
  if (w.__COMPANION_PATH_PACK__ && w.__COMPANION_PATH_PACK__[ID]) return;
  w.__COMPANION_PATH_PACK__ = w.__COMPANION_PATH_PACK__ || {};
  w.__COMPANION_PATH_PACK__[ID] = true;
  var SCRIPTS = ["/companion/assets/companion-g9-reflection-governance-v1.js"];
  var CSS = ["/companion/assets/companion-g9-reflection-governance-v1.css"];
  var V = "20261108C2";

  function loadCss(href) {
    if (d.querySelector('link[data-path-pack="'+ID+'"][href*="'+href.split('/').pop().split('?')[0]+'"]')) return;
    var l = d.createElement("link");
    l.rel = "stylesheet";
    l.href = href + (href.indexOf("?") >= 0 ? "&" : "?") + "v=" + V;
    l.setAttribute("data-path-pack", ID);
    d.head.appendChild(l);
  }
  function loadJs(src) {
    return new Promise(function (resolve) {
      var base = src.split("/").pop().split("?")[0];
      if (d.querySelector('script[data-path-pack="'+ID+'"][src*="'+base+'"]') ||
          d.querySelector('script[src*="'+base+'"]')) {
        resolve({src: src, skipped: true});
        return;
      }
      var s = d.createElement("script");
      s.src = src + (src.indexOf("?") >= 0 ? "&" : "?") + "v=" + V;
      s.async = false;
      s.setAttribute("data-path-pack", ID);
      s.onload = function () { resolve({src: src, ok: true}); };
      s.onerror = function () { resolve({src: src, ok: false}); };
      d.body.appendChild(s);
    });
  }
  CSS.forEach(loadCss);
  var chain = Promise.resolve();
  SCRIPTS.forEach(function (src) {
    chain = chain.then(function () { return loadJs(src); });
  });
  chain.then(function () {
    try {
      d.dispatchEvent(new CustomEvent("clarity-companion-pathway-ready", { detail: { id: ID } }));
    } catch (e) {}
  });
})(window, document);
