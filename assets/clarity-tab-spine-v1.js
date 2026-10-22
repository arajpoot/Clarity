/**
 * Phase A — tab spine · 20261022AB
 * Guarantees switchTab + hash tabs before chunk-8 idle load.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_TAB_SPINE_V1__) return;
  w.__CLARITY_TAB_SPINE_V1__ = "20261022AB";

  var TABS = ["reminder", "reality", "reflection", "action", "notes"];

  function normalize(tab) {
    tab = (tab || "").toLowerCase().replace(/^#/, "");
    if (tab === "vault" || tab === "amanah" || tab === "amana") tab = "notes";
    if (TABS.indexOf(tab) < 0) tab = "reminder";
    return tab;
  }

  function showTab(tab) {
    tab = normalize(tab);
    try {
      document.body.setAttribute("data-active-tab", tab);
      document.documentElement.setAttribute("data-active-tab", tab);
    } catch (e) {}

    TABS.forEach(function (id) {
      var panel = document.getElementById("tab-" + id);
      if (!panel) return;
      var on = id === tab;
      panel.style.display = on ? "" : "none";
      panel.setAttribute("aria-hidden", on ? "false" : "true");
      if (on) panel.classList.add("active");
      else panel.classList.remove("active");
    });

    /* bottom nav buttons if present */
    try {
      document.querySelectorAll("[data-tab], [data-rrra-tab], .tab-btn, .rrra-tab").forEach(function (btn) {
        var t = btn.getAttribute("data-tab") || btn.getAttribute("data-rrra-tab") || "";
        if (!t && btn.getAttribute("href")) {
          t = (btn.getAttribute("href") || "").replace(/^#/, "");
        }
        if (!t) return;
        t = normalize(t);
        if (t === tab) btn.classList.add("active");
        else btn.classList.remove("active");
      });
    } catch (e2) {}
  }

  function scrollToId(sid) {
    if (!sid) return;
    setTimeout(function () {
      var el = document.getElementById(sid);
      if (el && el.scrollIntoView) {
        try {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (e) {
          el.scrollIntoView(true);
        }
      }
    }, 120);
  }

  /**
   * Public API — chunk-8 may overwrite with richer version later
   */
  function switchTab(tab, scrollId) {
    tab = normalize(tab);
    showTab(tab);
    try {
      if (w.history && w.history.replaceState) {
        w.history.replaceState(null, "", "#" + tab);
      } else {
        w.location.hash = tab;
      }
    } catch (e) {}
    if (scrollId) scrollToId(scrollId);
    try {
      w.dispatchEvent(new CustomEvent("clarity-tab", { detail: { tab: tab } }));
    } catch (e3) {}
    return tab;
  }

  /* Only install if missing — allow chunk-8 to replace */
  if (typeof w.switchTab !== "function") {
    w.switchTab = switchTab;
  } else {
    var prev = w.switchTab;
    w.switchTab = function (tab, scrollId) {
      var r = prev.apply(this, arguments);
      if (scrollId) scrollToId(scrollId);
      return r;
    };
  }
  w.claritySwitchTab = w.claritySwitchTab || w.switchTab;
  w.clarityScrollToId = scrollToId;

  function fromHash() {
    var h = (w.location.hash || "").replace(/^#/, "");
    if (h && TABS.indexOf(normalize(h)) >= 0) showTab(h);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fromHash);
  } else fromHash();
  w.addEventListener("hashchange", fromHash);
})(typeof window !== "undefined" ? window : this);
