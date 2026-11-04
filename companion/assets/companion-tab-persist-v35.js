/*! companion-tab-persist-v35 · hash + localStorage · no force-reminder on refresh */
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
    if (id === "journey" || id === "commands") id = "reminder";
    if (id === "callig" || id === "calligraphy") id = "action";
    if (id === "tajweed" || id === "meme") id = id; /* may map to sections inside hubs */
    if (!VALID[id] && id !== "tajweed" && id !== "meme" && id !== "calligraphy") {
      /* tajweed/meme often live under hubs — keep as action/reality if unknown panel */
      if (id === "tajweed") id = "action";
      if (id === "meme" || id === "calligraphy") id = "action";
    }
    return VALID[id] ? id : null;
  }

  function showTab(id, write) {
    id = normalize(id) || "reminder";
    var panelId = VALID[id] || "tab-reminder";
    d.querySelectorAll(".tab-panel").forEach(function (p) {
      var on = p.id === panelId;
      p.classList.toggle("is-active", on);
      p.classList.toggle("active", on);
      p.setAttribute("aria-hidden", on ? "false" : "true");
      if (on) {
        p.removeAttribute("hidden");
        p.style.removeProperty("display");
      }
    });
    d.querySelectorAll("[data-rail-tab], [data-rrra]").forEach(function (btn) {
      var t = btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra");
      btn.classList.toggle("is-active", t === id);
    });
    if (write !== false) {
      try { localStorage.setItem(KEY, id); } catch (e) {}
      try {
        var want = "#" + id;
        if ((w.location.hash || "") !== want) {
          history.replaceState(null, "", want);
        }
      } catch (e2) {}
    }
    try {
      if (typeof w.clarityLoadCraft === "function") {
        if (id === "action") {
          w.clarityLoadCraft("tajweed");
          w.clarityLoadCraft("calligraphy");
          w.clarityLoadCraft("meme");
        }
        if (id === "notes") w.clarityLoadCraft("notes");
      }
    } catch (e3) {}
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

  var prevDoor = w.clarityOpenSectionDoor;
  w.clarityOpenSectionDoor = function (id) {
    var n = normalize(id) || id;
    if (VALID[n] || n === "reminder") showTab(n, true);
    if (typeof prevDoor === "function") {
      try { return prevDoor.apply(this, arguments); } catch (e) {}
    }
  };

  function boot() {
    showTab(resolveInitial(), true);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("hashchange", function () {
    var id = normalize((w.location.hash || "").replace(/^#/, ""));
    if (id) showTab(id, true);
  });
})(window, document);
