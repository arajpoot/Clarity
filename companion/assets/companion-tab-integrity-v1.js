/*! companion-tab-integrity-v1 · Phase 1
 * Bottom nav + tab panels wiring for companion room only.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_COMPANION_TAB_INTEGRITY_V1__) return;
  w.__CLARITY_COMPANION_TAB_INTEGRITY_V1__ = true;

  function roomOk() {
    try {
      var p = (w.location && w.location.pathname) || "";
      return p.indexOf("/companion") === 0;
    } catch (e) { return false; }
  }

  function ensureSwitchTab() {
    if (typeof w.switchTab === "function") return;
    w.switchTab = function (id) {
      id = String(id || "reminder").replace(/^tab-/, "");
      d.querySelectorAll(".tab-panel").forEach(function (t) {
        var on = (t.id === "tab-" + id) || (t.getAttribute("data-rrra-hub") === id);
        t.classList.toggle("active", on);
        t.style.display = on ? "block" : "none";
        t.setAttribute("aria-hidden", on ? "false" : "true");
      });
      d.querySelectorAll("[data-tab],[data-rrra-nav]").forEach(function (b) {
        var t = b.getAttribute("data-tab") || b.getAttribute("data-rrra-nav");
        b.classList.toggle("active", t === id);
      });
      try { localStorage.setItem("clarity_active_tab", id); } catch (e) {}
    };
  }

  function bindNav() {
    d.querySelectorAll(".bottom-nav a, .bottom-nav button, .rrra-bottom-nav a, .rrra-bottom-nav button, [data-tab], [data-rrra-nav]").forEach(function (el) {
      if (el.__tabBound) return;
      el.__tabBound = true;
      el.addEventListener("click", function (ev) {
        var id = el.getAttribute("data-tab") || el.getAttribute("data-rrra-nav");
        if (!id) {
          var href = el.getAttribute("href") || "";
          var m = href.match(/#?(reminder|reality|reflection|action|notes|about)/i);
          if (m) id = m[1].toLowerCase();
        }
        if (!id) return;
        ev.preventDefault();
        ensureSwitchTab();
        w.switchTab(id);
      });
    });
  }

  function showDefault() {
    var id = "reminder";
    try { id = localStorage.getItem("clarity_active_tab") || "reminder"; } catch (e) {}
    ensureSwitchTab();
    w.switchTab(id);
  }

  function boot() {
    if (!roomOk()) return;
    ensureSwitchTab();
    bindNav();
    showDefault();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 30); });
  else setTimeout(boot, 30);
  w.addEventListener("load", function () { setTimeout(boot, 200); });
  d.addEventListener("clarity-core-ready", function () { setTimeout(boot, 50); });
  d.addEventListener("clarity-a2-spine-ready", function () { setTimeout(boot, 50); });
})(window, document);
