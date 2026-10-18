/* ---- cu-theme-v1.js ---- */
/* University theme: day / night / system — localStorage */
(function (g) {
  "use strict";
  if (g.__CU_THEME_V1__) return;
  g.__CU_THEME_V1__ = true;

  var KEY = "clarity_univ_theme_v1";

  function get() {
    try {
      return localStorage.getItem(KEY) || "system";
    } catch (e) {
      return "system";
    }
  }

  function apply(mode) {
    var m = mode === "light" || mode === "dark" || mode === "system" ? mode : "system";
    try {
      document.documentElement.setAttribute("data-theme", m);
    } catch (e) {}
    try {
      localStorage.setItem(KEY, m);
    } catch (e2) {}
    document.querySelectorAll(".cu-theme-ctl button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-theme-set") === m ? "true" : "false");
    });
  }

  function injectControl() {
    var banner = document.querySelector("header.cu-banner");
    if (!banner || banner.querySelector(".cu-theme-ctl")) return;
    var wrap = document.createElement("div");
    wrap.className = "cu-theme-ctl";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Color theme");
    [
      ["light", "Day"],
      ["dark", "Night"],
      ["system", "Auto"]
    ].forEach(function (pair) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("data-theme-set", pair[0]);
      b.textContent = pair[1];
      b.title = pair[1] + " theme";
      b.addEventListener("click", function () {
        apply(pair[0]);
      });
      wrap.appendChild(b);
    });
    var right = banner.querySelector(".cu-main-link");
    if (right && right.parentNode === banner) {
      banner.insertBefore(wrap, right);
    } else {
      banner.appendChild(wrap);
    }
  }

  function boot() {
    apply(get());
    injectControl();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  g.ClarityUnivTheme = { apply: apply, get: get };
})(typeof window !== "undefined" ? window : this);

/* ---- cu-nuclear-chrome-v1.js ---- */
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

/* ---- cu-bi-flow-v1.js ---- */
/* BI-2/5 — flow: banner first, phase chrome in main, optional collapse */
(function (g) {
  "use strict";
  if (g.__CU_BI_FLOW_V1__) return;
  g.__CU_BI_FLOW_V1__ = true;

  function banner() {
    return document.querySelector("header.cu-banner");
  }

  function park(el, main) {
    if (!el || !main) return;
    if (el.parentNode !== main) {
      main.insertBefore(el, main.firstChild);
    }
  }

  function collapseHow(el) {
    if (!el || el.tagName === "DETAILS" || el.querySelector("details")) return;
    if (el.getAttribute("data-bi-collapsed") === "1") return;
    el.setAttribute("data-bi-collapsed", "1");
    var inner = el.innerHTML;
    el.innerHTML =
      "<details class=\"bi-how-details\" style=\"padding:0.65rem 0.85rem\">" +
      "<summary style=\"cursor:pointer;font-weight:700;color:inherit\">How phases work</summary>" +
      "<div class=\"bi-how-body\" style=\"margin-top:0.5rem\">" +
      inner +
      "</div></details>";
  }

  function isDesk() {
    var p = location.pathname || "";
    return p.indexOf("/campus/desk") >= 0;
  }
  function run() {
    var b = banner();
    var main = document.querySelector("main.cu-wrap, main");
    if (b && b.parentNode === document.body && document.body.firstElementChild !== b) {
      document.body.insertBefore(b, document.body.firstElementChild);
    }
    if (!main) return;
    /* Desk: single optional how-card — never invent a second layer over Junior stage */
    if (isDesk()) {
      var slot = document.getElementById("clarity-how-phases-slot");
      var existing = document.getElementById("clarity-how-phases") || document.querySelector(".cu-how-phases, [class*='how-phases']");
      if (existing && existing.children.length && slot && !slot.contains(existing)) {
        slot.appendChild(existing);
      }
      /* hide empty hosts so they do not paint grey plaques */
      ["clarity-how-phases-slot", "clarity-phase-plaque-host", "clarity-name-plaque-rail"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el && !el.children.length && !(el.textContent || "").trim()) {
          el.style.display = "none";
        }
      });
      return;
    }
    ["#clarity-how-phases", "[class*='how-phases']", "#clarity-phase-plaque-host", "#clarity-name-plaque-rail"].forEach(
      function (sel) {
        try {
          document.querySelectorAll(sel).forEach(function (el) {
            if (sel.indexOf("how-phases") >= 0 || (el.id && el.id.indexOf("how") >= 0)) {
              park(el, main);
              if (window.matchMedia && window.matchMedia("(max-width: 700px)").matches) {
                collapseHow(el);
              }
            } else {
              park(el, main);
            }
          });
        } catch (e) {}
      }
    );
    /* hide empty hosts global */
    ["clarity-how-phases-slot","clarity-phase-plaque-host","clarity-name-plaque-rail"].forEach(function(id){
      var el=document.getElementById(id);
      if(el && !el.children.length && !(el.textContent||"").trim()){ el.style.display="none"; el.setAttribute("hidden","hidden"); }
    });
    document.querySelectorAll("nav.cu-map-nav, nav.cu-tabs").forEach(function (n) {
      try {
        n.remove();
      } catch (e2) {
        n.style.display = "none";
      }
    });
  }

  function boot() {
    run();
    setTimeout(run, 300);
    setTimeout(run, 1000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);

/* ---- cu-nav-rich-v1.js ---- */
/* Rich nav: icons + aria-current + soft activate pulse */
(function (g) {
  "use strict";
  if (g.__CU_NAV_RICH_V1__) return;
  g.__CU_NAV_RICH_V1__ = true;

  var ICO = {
    map: "🗺️",
    desk: "📖",
    lab: "🎧",
    vault: "🔐",
    journey: "🧭",
    charter: "📜"
  };

  function kind(href) {
    href = String(href || "");
    if (href.indexOf("/campus/desk") >= 0) return "desk";
    if (href.indexOf("/lab") >= 0) return "lab";
    if (href.indexOf("/vault") >= 0) return "vault";
    if (href.indexOf("/journey") >= 0) return "journey";
    if (href.indexOf("/charter") >= 0) return "charter";
    if (href === "/campus/" || href.indexOf("/campus") >= 0) return "map";
    return "";
  }

  function pathKind() {
    var p = location.pathname || "";
    if (p.indexOf("/campus/desk") >= 0) return "desk";
    if (p.indexOf("/lab") >= 0) return "lab";
    if (p.indexOf("/vault") >= 0) return "vault";
    if (p.indexOf("/journey") >= 0) return "journey";
    if (p.indexOf("/charter") >= 0) return "charter";
    if (p === "/campus/" || p === "/campus" || p.indexOf("/campus") === 0) return "map";
    return "";
  }

  function enhance() {
    var pk = pathKind();
    document.querySelectorAll(".cu-pills a").forEach(function (a) {
      var k = kind(a.getAttribute("href"));
      if (!k) return;
      a.setAttribute("data-nav", k);
      if (k === pk) {
        a.classList.add("here");
        a.setAttribute("aria-current", "page");
      } else {
        a.classList.remove("here");
        a.removeAttribute("aria-current");
      }
      if (!a.querySelector(".cu-nav-ico") && ICO[k]) {
        var s = document.createElement("span");
        s.className = "cu-nav-ico";
        s.setAttribute("aria-hidden", "true");
        s.textContent = ICO[k];
        a.insertBefore(s, a.firstChild);
      }
      if (!a.__cuNavBound) {
        a.__cuNavBound = true;
        a.addEventListener("click", function () {
          a.classList.add("cu-nav-pulse");
          setTimeout(function () {
            a.classList.remove("cu-nav-pulse");
          }, 280);
        });
      }
    });
  }

  var style = document.createElement("style");
  style.textContent =
    ".cu-pills a.cu-nav-pulse{transform:scale(0.96)!important;filter:brightness(1.08)}";
  document.head.appendChild(style);

  function boot() {
    enhance();
    setTimeout(enhance, 400);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
