/**
 * cu-campus-nav-v1.js — Unified University nav with Journey
 * Injects/normalizes Map · Desk · Journey · Lab · Library · Faculty · Vault · Charter
 */
(function (g) {
  "use strict";
  if (g.__CU_CAMPUS_NAV_V1__) return;
  g.__CU_CAMPUS_NAV_V1__ = true;

  var LINKS = [
    { href: "/campus/", label: "Map", match: /^\/campus\/?$/ },
    { href: "/campus/desk/", label: "Desk", match: /\/desk\// },
    { href: "/campus/journey/", label: "Journey", match: /\/journey/ },
    { href: "/campus/lab/", label: "Lab", match: /\/lab\// },
    { href: "/campus/library/", label: "Library", match: /\/library/ },
    { href: "/campus/faculty.html", label: "Faculty", match: /faculty/ },
    { href: "/campus/vault/", label: "Vault", match: /\/vault/ },
    { href: "/campus/charter/", label: "Charter", match: /\/charter/ }
  ];

  function path() {
    return (location.pathname || "/").replace(/\/index\.html$/, "/");
  }

  function isHere(link) {
    var p = path();
    if (link.match) return link.match.test(p);
    return p === link.href || p === link.href.replace(/\.html$/, "");
  }

  function buildNav() {
    var html = LINKS.map(function (L) {
      var here = isHere(L);
      return (
        '<a href="' +
        L.href +
        '"' +
        (here ? ' class="here" aria-current="page"' : "") +
        ">" +
        L.label +
        "</a>"
      );
    }).join("");
    return html;
  }

  function enhance(el) {
    if (!el || el.getAttribute("data-cu-nav") === "1") return;
    el.setAttribute("data-cu-nav", "1");
    el.innerHTML = buildNav();
  }

  function boot() {
    var nodes = document.querySelectorAll(
      "nav.uni-nav, nav.cu-pills, nav.lab-pills, nav[aria-label='Campus'], nav[aria-label='University'], #cu-campus-nav"
    );
    if (!nodes.length) {
      var main = document.querySelector("main") || document.body;
      var nav = document.createElement("nav");
      nav.className = "cu-pills";
      nav.setAttribute("aria-label", "Campus");
      nav.id = "cu-campus-nav";
      main.insertBefore(nav, main.firstChild);
      enhance(nav);
    } else {
      nodes.forEach(enhance);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
