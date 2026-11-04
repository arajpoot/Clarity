/*! companion-tab-persist-v35 · N1 single path · default Reminder · campus untouched */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_TAB_PERSIST_V35__) return;
  w.__CLARITY_TAB_PERSIST_V35__ = true;

  var KEY = "clarity_companion_tab_v1";
  var VALID = {
    reminder: "tab-reminder",
    reality: "tab-reality",
    reflection: "tab-reflection",
    action: "tab-action",
    notes: "tab-notes",
    about: "tab-about"
  };

  function normalize(id) {
    id = String(id || "").toLowerCase().replace(/^#/, "");
    if (id === "journey" || id === "commands" || id === "seerah") id = "reminder";
    if (id === "tajweed" || id === "callig" || id === "calligraphy" || id === "meme") id = "action";
    if (!VALID[id]) return null;
    return id;
  }

  function showTab(id, write) {
    id = normalize(id) || "reminder";
    var panelId = VALID[id];
    d.querySelectorAll(".tab-panel").forEach(function (p) {
      var on = p.id === panelId;
      p.classList.toggle("is-active", on);
      p.classList.toggle("active", on);
      p.setAttribute("aria-hidden", on ? "false" : "true");
      if (on) p.removeAttribute("hidden");
    });
    d.querySelectorAll("[data-rail-tab], [data-rrra]").forEach(function (btn) {
      var t = (btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || "").toLowerCase();
      btn.classList.toggle("is-active", t === id);
    });
    if (write !== false) {
      try { localStorage.setItem(KEY, id); } catch (e) {}
      try {
        var want = "#" + id;
        if ((w.location.hash || "") !== want) history.replaceState(null, "", want);
      } catch (e2) {}
    }
  }

  function resolveInitial() {
    var fromHash = normalize((w.location.hash || "").replace(/^#/, ""));
    if (fromHash) return fromHash;
    try {
      var saved = normalize(localStorage.getItem(KEY));
      if (saved) return saved;
    } catch (e) {}
    return "reminder";
  }

  w.clarityShowCompanionTab = showTab;

  function wrapDoor() {
    var prev = w.clarityOpenSectionDoor;
    w.clarityOpenSectionDoor = function (id) {
      var n = normalize(id);
      if (n) showTab(n, true);
      if (typeof prev === "function") {
        try { return prev.apply(this, arguments); } catch (e) {}
      }
    };
  }

  function boot() {
    wrapDoor();
    showTab(resolveInitial(), true);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("hashchange", function () {
    var id = normalize((w.location.hash || "").replace(/^#/, ""));
    if (id) showTab(id, true);
  });
})(window, document);
