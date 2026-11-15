/*! companion-deeplink-v1 · map legacy hashes to tabs + scroll to studios/Ḥajj
 * Educational only — not a fatwa. Companion only.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_DEEPLINK_V1__) return;
  w.__COMPANION_DEEPLINK_V1__ = true;

  var FOCUS_KEY = "clarity_companion_focus_v1";
  var TAB_ALIASES = {
    journey: "reminder",
    commands: "reminder",
    names: "reminder",
    seerah: "reality",
    lectures: "reality",
    grave: "reflection",
    tawbah: "reflection",
    tajweed: "action",
    meme: "action",
    callig: "action",
    calligraphy: "action",
    hifz: "action",
    hajj: "action",
    umrah: "action",
    ritual: "action",
    fiqh: "action",
    "fiqh-tools": "action",
    notes: "notes",
    about: "about"
  };
  var FOCUS_ANCHORS = {
    meme: ["#companion-meme-studio", "#meme-card", "#meme-stage"],
    callig: ["#callig-lab-card", "[data-studio=calligraphy]", "#companion-callig-pad"],
    calligraphy: ["#callig-lab-card", "[data-studio=calligraphy]"],
    tajweed: ["#tj-deep-studio", "#tajweed-path-card", "#tajweed-live-card"],
    hifz: ["#hifz-display", "#hifz-surah"],
    hajj: ["#hajj-guide-card"],
    umrah: ["#hajj-guide-card"],
    ritual: ["#hajj-guide-card"],
    fiqh: ["#hajj-guide-card", "#action-studios-board"]
  };

  function parseHash() {
    var raw = (w.location.hash || "").replace(/^#/, "");
    var parts = raw.split(/[/?:&]/);
    var tab = (parts[0] || "").toLowerCase();
    var focus = "";
    if (parts[1]) focus = parts[1].toLowerCase();
    try {
      var q = new URL(w.location.href).searchParams.get("focus");
      if (q) focus = q.toLowerCase();
    } catch (e) {}
    if (TAB_ALIASES[tab] && TABS_OK(TAB_ALIASES[tab])) {
      focus = focus || tab;
      tab = TAB_ALIASES[tab];
    }
    return { tab: tab, focus: focus };
  }
  function TABS_OK(t) {
    return ["reminder", "reality", "reflection", "action", "notes", "about"].indexOf(t) >= 0;
  }

  function saveFocus(focus) {
    try {
      if (focus) sessionStorage.setItem(FOCUS_KEY, focus);
      else sessionStorage.removeItem(FOCUS_KEY);
    } catch (e) {}
  }
  function readFocus() {
    try {
      return sessionStorage.getItem(FOCUS_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function scrollFocus(focus) {
    focus = (focus || readFocus() || "").toLowerCase();
    if (!focus) return;
    var sels = FOCUS_ANCHORS[focus] || ["#" + focus];
    var root = d.getElementById("cs-mount") || d;
    for (var i = 0; i < sels.length; i++) {
      var el = root.querySelector(sels[i]);
      if (el) {
        try {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (e2) {
          el.scrollIntoView(true);
        }
        el.setAttribute("data-cs-focus-hit", "1");
        saveFocus("");
        return true;
      }
    }
    return false;
  }

  function patchShell() {
    var S = w.ClarityCompanionShell;
    if (!S || S.__deeplink) return;
    var prevMount = S.mountTab;
    if (typeof prevMount !== "function") return;
    S.mountTab = function (tab) {
      var parsed = parseHash();
      var focus = parsed.focus || readFocus();
      if (parsed.tab && TABS_OK(parsed.tab)) tab = parsed.tab;
      if (TAB_ALIASES[String(tab || "").toLowerCase()]) {
        focus = focus || String(tab).toLowerCase();
        tab = TAB_ALIASES[String(tab).toLowerCase()];
      }
      if (focus) saveFocus(focus);
      var ret = prevMount.call(S, tab);
      if (ret && typeof ret.then === "function") {
        return ret.then(function () {
          setTimeout(function () {
            scrollFocus(focus);
          }, 120);
          setTimeout(function () {
            scrollFocus(focus);
          }, 400);
        });
      }
      setTimeout(function () {
        scrollFocus(focus);
      }, 150);
      return ret;
    };
    S.__deeplink = true;
    S.scrollFocus = scrollFocus;
  }

  function boot() {
    patchShell();
    // Legacy redirects: #meme → action + focus meme
    var parsed = parseHash();
    if (parsed.focus) saveFocus(parsed.focus);
    setTimeout(patchShell, 0);
    setTimeout(patchShell, 300);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("hashchange", function () {
    patchShell();
    var p = parseHash();
    if (p.focus) saveFocus(p.focus);
  });
})(window, document);
