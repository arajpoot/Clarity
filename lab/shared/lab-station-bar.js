/* Inject centered lab station bar if missing · 20261019L2 */
(function () {
  "use strict";
  if (window.__LAB_STATION_BAR_V1__) return;
  window.__LAB_STATION_BAR_V1__ = true;

  var STATIONS = [
    { href: "/lab/", label: "Hub" },
    { href: "/lab/arabic/", label: "Arabic" },
    { href: "/lab/tajweed/", label: "Tajweed" },
    { href: "/lab/recite/", label: "Recite" },
    { href: "/lab/calligraphy/", label: "Calligraphy" },
    { href: "/lab/hifz/", label: "Hifz" },
    { href: "/lab/media/", label: "Media" }
  ];

  function path() {
    return (location.pathname || "/").replace(/\/+$/, "") || "/";
  }

  function isHere(href) {
    var p = path();
    var h = href.replace(/\/+$/, "") || "/";
    if (h === "/lab") return p === "/lab";
    return p === h || p.indexOf(h + "/") === 0;
  }

  function ensureCss() {
    if (document.querySelector('link[data-lab-station-bar]')) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "/lab/shared/lab-station-bar.css?v=20261019L2";
    l.setAttribute("data-lab-station-bar", "1");
    document.head.appendChild(l);
  }

  function inject() {
    if (document.querySelector(".lab-station-nav[data-lab-bar='1']")) return;
    var existing = document.querySelector(".lab-station-nav");
    if (existing) {
      existing.setAttribute("data-lab-bar", "1");
      /* restyle only */
      return;
    }
    var nav = document.createElement("nav");
    nav.className = "lab-station-nav";
    nav.setAttribute("aria-label", "Lab stations");
    nav.setAttribute("data-lab-bar", "1");
    STATIONS.forEach(function (s) {
      var a = document.createElement("a");
      a.href = s.href;
      a.textContent = s.label;
      if (isHere(s.href)) {
        a.className = "here";
        a.setAttribute("aria-current", "page");
      }
      nav.appendChild(a);
    });
    var campus = document.querySelector("nav.cu-pills, nav.cu-pills-canonical");
    var main = document.querySelector("main");
    if (campus && campus.parentNode) {
      if (campus.nextSibling) campus.parentNode.insertBefore(nav, campus.nextSibling);
      else campus.parentNode.appendChild(nav);
    } else if (main) {
      main.insertBefore(nav, main.firstChild);
    } else {
      document.body.insertBefore(nav, document.body.firstChild);
    }
  }

  function boot() {
    ensureCss();
    inject();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
