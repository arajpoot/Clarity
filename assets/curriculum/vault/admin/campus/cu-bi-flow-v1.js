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
