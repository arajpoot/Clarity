(function () {
  "use strict";
  if (window.__CLARITY_COMPANION_POLISH_V1__) return;
  window.__CLARITY_COMPANION_POLISH_V1__ = true;

  function showTab(id) {
    id = String(id || "reminder").replace(/^tab-/, "");
    document.querySelectorAll(".tab-panel").forEach(function (p) {
      var on = p.id === "tab-" + id || p.getAttribute("data-tab") === id;
      p.classList.toggle("active", on);
      p.classList.toggle("is-active", on);
      try { p.hidden = !on; } catch (e) {}
      if (on) {
        p.style.removeProperty("display");
        p.style.opacity = "1";
      }
    });
    try { document.body.setAttribute("data-active-tab", id); } catch (e) {}
    document.querySelectorAll("#clarity-door-rail .door-rail-btn[data-rail-tab]").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-rail-tab") === id);
    });
  }

  if (typeof window.switchTab === "function" && !window.switchTab.__compPolish) {
    var prev = window.switchTab;
    window.switchTab = function (tabId) {
      var r;
      try { r = prev.apply(this, arguments); } catch (e) { console.warn("[Companion]", e); }
      try { showTab(tabId); } catch (e2) {}
      return r;
    };
    window.switchTab.__compPolish = true;
  }

  function scrub() {
    document.querySelectorAll("#nuros-storage-chip").forEach(function (el) {
      try { el.remove(); } catch (e) {}
    });
    var fills = document.querySelectorAll("[id^='tj-lmr-meter-fill']");
    for (var i = 1; i < fills.length; i++) {
      try { fills[i].id = "tj-lmr-meter-fill-x" + i; } catch (e) {}
    }
  }

  function boot() {
    scrub();
    showTab(document.body.getAttribute("data-active-tab") || "reminder");
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 200); });
  else setTimeout(boot, 200);
  window.addEventListener("load", function () { setTimeout(boot, 500); });
  window.clarityCompanionShowTab = showTab;
})();