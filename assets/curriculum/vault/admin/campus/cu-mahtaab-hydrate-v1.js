/* Mahtaab Hydration Engine v1
 * Progressive energize: core → stage → wings on demand
 * Visual: full-moon (mahtāb) glow — soft silver-gold on deep night
 * Educational UX only
 */
(function (g) {
  "use strict";
  if (g.__CU_MAHTAAB_HYDRATE_V1__) return;
  g.__CU_MAHTAAB_HYDRATE_V1__ = true;

  var VER = "20261012MAH";
  var loaded = {};
  var phase = "seed"; /* seed | crescent | half | full */

  var CORE = [
    "/assets/curriculum/vault/admin/campus/cu-shared-v1.css",
    "/assets/curriculum/vault/admin/campus/cu-app-polish-v1.css",
    "/assets/curriculum/vault/admin/campus/cu-mahtaab-theme-v1.css"
  ];

  var STAGE = {
    desk: [
      "/assets/curriculum/vault/admin/campus/cu-learner-v1.js",
      "/assets/curriculum/vault/admin/campus/cu-campus-mount-v1.js",
      "/assets/curriculum/vault/admin/campus/cu-spark-adab-v1.js",
      "/assets/curriculum/vault/admin/campus/cu-lab-curriculum-link-v1.js"
    ],
    lab: [
      "/assets/craft/craft-shell.css",
      "/assets/craft/calligraphy-studio-v1.js",
      "/assets/craft/tajweed-studio-v1.js",
      "/assets/craft/media-reminder-studio-v1.js",
      "/assets/craft/craft-bridge-v1.js"
    ],
    map: [
      "/assets/curriculum/vault/admin/campus/cu-bab-qubul-v1.js",
      "/assets/curriculum/vault/admin/campus/cu-compass-fab-v1.js"
    ]
  };

  function log(msg) {
    try {
      if (g.console && console.debug) console.debug("[Mahtaab]", msg);
    } catch (e) {}
  }

  function withVer(src) {
    if (!src) return src;
    return src + (src.indexOf("?") >= 0 ? "&" : "?") + "v=" + VER;
  }

  function loadCss(href) {
    return new Promise(function (resolve) {
      var key = "css:" + href;
      if (loaded[key]) return resolve(true);
      if (document.querySelector('link[href*="' + href.split("/").pop().split("?")[0] + '"]')) {
        loaded[key] = true;
        return resolve(true);
      }
      var l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = withVer(href);
      l.onload = function () {
        loaded[key] = true;
        resolve(true);
      };
      l.onerror = function () {
        resolve(false);
      };
      document.head.appendChild(l);
    });
  }

  function loadJs(src) {
    return new Promise(function (resolve) {
      var key = "js:" + src;
      if (loaded[key]) return resolve(true);
      var base = src.split("/").pop().split("?")[0];
      if (document.querySelector('script[src*="' + base + '"]')) {
        loaded[key] = true;
        return resolve(true);
      }
      var s = document.createElement("script");
      s.src = withVer(src);
      s.defer = true;
      s.onload = function () {
        loaded[key] = true;
        resolve(true);
      };
      s.onerror = function () {
        resolve(false);
      };
      document.head.appendChild(s);
    });
  }

  function sequence(list, loader) {
    return list.reduce(function (chain, item) {
      return chain.then(function () {
        return loader(item);
      });
    }, Promise.resolve());
  }

  function setPhase(name) {
    phase = name;
    try {
      document.documentElement.setAttribute("data-mahtaab", name);
      document.body && document.body.setAttribute("data-mahtaab", name);
    } catch (e) {}
    log("phase → " + name);
    try {
      g.dispatchEvent(new CustomEvent("cu-mahtaab-phase", { detail: { phase: name } }));
    } catch (e2) {}
  }

  function pageKey() {
    var p = (location.pathname || "").replace(/\/$/, "") || "/";
    if (p.indexOf("/campus/desk") === 0) return "desk";
    if (p.indexOf("/lab") === 0) return "lab";
    if (p.indexOf("/library") === 0) return "library";
    if (p.indexOf("/campus") === 0) return "map";
    if (p.indexOf("/journey") === 0) return "map";
    return "map";
  }

  function pulseMoon() {
    /* brief full-moon shimmer on hydrate complete */
    var m = document.getElementById("cu-mahtaab-orb");
    if (!m) {
      m = document.createElement("div");
      m.id = "cu-mahtaab-orb";
      m.setAttribute("aria-hidden", "true");
      document.body.appendChild(m);
    }
    m.classList.remove("shine");
    void m.offsetWidth;
    m.classList.add("shine");
    setTimeout(function () {
      m.classList.remove("shine");
    }, 1800);
  }

  function hydrate() {
    setPhase("seed");
    return sequence(CORE, loadCss)
      .then(function () {
        setPhase("crescent");
        var key = pageKey();
        var list = STAGE[key] || STAGE.map;
        var css = list.filter(function (x) {
          return /\.css$/.test(x);
        });
        var js = list.filter(function (x) {
          return /\.js$/.test(x);
        });
        return sequence(css, loadCss).then(function () {
          setPhase("half");
          return sequence(js, loadJs);
        });
      })
      .then(function () {
        setPhase("full");
        pulseMoon();
        try {
          g.dispatchEvent(new CustomEvent("cu-mahtaab-ready", { detail: { page: pageKey() } }));
        } catch (e) {}
        log("full moon");
      });
  }

  /* Public API */
  g.ClarityMahtaab = {
    hydrate: hydrate,
    loadJs: loadJs,
    loadCss: loadCss,
    phase: function () {
      return phase;
    },
    ensure: function (src) {
      return /\.css$/.test(src) ? loadCss(src) : loadJs(src);
    }
  };

  /* Auto-hydrate early */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      hydrate();
    });
  } else {
    hydrate();
  }
})(typeof window !== "undefined" ? window : this);
