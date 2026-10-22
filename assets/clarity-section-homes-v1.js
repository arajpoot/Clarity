/**
 * Phase 3 — canonical section homes · 20261022P17
 * Tajweed* → reminder · craft studios → action · vault → notes
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_SECTION_HOMES_V1__) return;
  w.__CLARITY_SECTION_HOMES_V1__ = "20261022P17";

  var HOME = {
    tajweed: "reminder",
    "tajweed-live-card": "reminder",
    "tajweed-path-card": "reminder",
    "tj-deep-studio": "reminder",
    meme: "action",
    "meme-card": "action",
    callig: "action",
    "callig-lab-card": "action",
    tweet: "action",
    "tweet-desk-card": "action",
    facebook: "action",
    "facebook-desk-card": "action",
    vault: "notes",
    notes: "notes",
    amana: "notes"
  };

  function resolve(name) {
    name = (name || "").toLowerCase().replace(/^#/, "");
    return HOME[name] || name;
  }

  function go(name, scrollId) {
    var tab = resolve(name);
    if (["reminder", "reality", "reflection", "action", "notes"].indexOf(tab) < 0) {
      tab = "reminder";
    }
    var sid = scrollId;
    if (!sid && HOME[name] && name.indexOf("-") >= 0) sid = name;
    try {
      if (typeof w.switchTab === "function") w.switchTab(tab, sid);
      else w.location.hash = tab;
    } catch (e) {}
  }

  /* Override openMemeStudio if defined late — poll briefly */
  function patchOpenMeme() {
    w.openMemeStudio = function () {
      go("action", "meme-card");
    };
  }
  patchOpenMeme();
  setTimeout(patchOpenMeme, 800);
  setTimeout(patchOpenMeme, 2500);

  var prevDoor = w.clarityOpenSectionDoor;
  w.clarityOpenSectionDoor = function (name) {
    var n = (name || "").toLowerCase();
    if (n === "tajweed" || n.indexOf("tajweed") === 0) {
      go("reminder", "tajweed-live-card");
      return;
    }
    if (n === "meme" || n === "tabligh" || n === "action") {
      go("action", n === "meme" ? "meme-card" : undefined);
      return;
    }
    if (typeof prevDoor === "function") {
      try {
        return prevDoor.apply(this, arguments);
      } catch (e) {}
    }
    go(n);
  };

  w.clarityGoHome = go;
  w.claritySectionHome = resolve;
})(typeof window !== "undefined" ? window : this);
