/* NUC2 — relocate phase chrome under banner; strip duplicate nav */
(function (g) {
  "use strict";
  if (g.__CU_NUCLEAR_CHROME_V1__) return;
  g.__CU_NUCLEAR_CHROME_V1__ = true;

  function banner() {
    return document.querySelector("header.cu-banner");
  }

  function ensureAfterBanner(el) {
    if (!el || !el.parentNode) return;
    var b = banner();
    if (!b) return;
    /* If element is before banner in DOM, move after banner */
    if (b.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING) {
      if (b.nextSibling) b.parentNode.insertBefore(el, b.nextSibling);
      else b.parentNode.appendChild(el);
    }
  }

  function relocate() {
    var b = banner();
    if (!b) return;
    /* Banner must be first element child of body when possible */
    if (b.parentNode === document.body && document.body.firstElementChild !== b) {
      document.body.insertBefore(b, document.body.firstElementChild);
    }
    [
      "#clarity-how-phases",
      "[class*='how-phases']",
      "#clarity-phase-plaque-host",
      "#clarity-phase-plaque-rail",
      "#clarity-name-plaque-rail"
    ].forEach(function (sel) {
      try {
        document.querySelectorAll(sel).forEach(ensureAfterBanner);
      } catch (e) {}
    });
    /* Prefer park phase hosts inside main if present */
    var main = document.querySelector("main.cu-wrap, main");
    var host = document.getElementById("clarity-phase-plaque-host");
    if (main && host && host.parentNode !== main) {
      var first = main.firstChild;
      main.insertBefore(host, first);
    }
    var how = document.getElementById("clarity-how-phases");
    if (main && how && how.parentNode === document.body) {
      main.insertBefore(how, main.firstChild);
    }
  }

  function stripDupNav() {
    document.querySelectorAll("nav.cu-map-nav, nav.cu-tabs").forEach(function (n) {
      try {
        n.remove();
      } catch (e) {
        n.style.display = "none";
      }
    });
  }

  function boot() {
    relocate();
    stripDupNav();
    setTimeout(function () {
      relocate();
      stripDupNav();
    }, 400);
    setTimeout(relocate, 1200);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  /* Observe late injections (campus shell / foundation) */
  try {
    var mo = new MutationObserver(function () {
      relocate();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () {
      try {
        mo.disconnect();
      } catch (e) {}
    }, 8000);
  } catch (e2) {}
})(typeof window !== "undefined" ? window : this);

;(function(g){
  function hideEmptyDeskHosts(){
    if((location.pathname||"").indexOf("/campus/desk")<0) return;
    ["clarity-how-phases-slot","clarity-phase-plaque-host","clarity-name-plaque-rail"].forEach(function(id){
      var el=document.getElementById(id);
      if(el && !el.children.length){ el.setAttribute("hidden","hidden"); el.style.display="none"; }
    });
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", hideEmptyDeskHosts);
  else hideEmptyDeskHosts();
  setTimeout(hideEmptyDeskHosts, 500);
})(typeof window!=="undefined"?window:this);
