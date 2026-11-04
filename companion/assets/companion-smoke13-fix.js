/*! companion-smoke13-fix · tracks always on · Amānah → Notes hard open */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_SMOKE13_FIX__) return;
  w.__CLARITY_SMOKE13_FIX__ = true;
  var LOG = (w.__SMOKE13_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  function forceTracks() {
    var nodes = d.querySelectorAll(".clarity-gate-switcher, .clarity-gate-switcher.rrra-sitewide, .cgs-btn-row");
    nodes.forEach(function (el) {
      el.hidden = false;
      el.removeAttribute("hidden");
      el.removeAttribute("data-gate-hidden");
      el.classList.remove("gate-hidden", "hidden");
      ["display", "visibility", "opacity", "height", "max-height", "pointer-events", "position", "width"].forEach(function (p) {
        try { el.style.removeProperty(p); } catch (e) {}
      });
      el.style.setProperty("display", "flex", "important");
      el.style.setProperty("flex-wrap", "wrap", "important");
      el.style.setProperty("visibility", "visible", "important");
      el.style.setProperty("opacity", "1", "important");
      el.style.setProperty("height", "auto", "important");
      el.style.setProperty("max-height", "none", "important");
      el.style.setProperty("pointer-events", "auto", "important");
      el.style.setProperty("margin", "0.5rem 0", "important");
      el.style.setProperty("padding", "0.45rem 0.55rem", "important");
      el.style.setProperty("gap", "0.35rem", "important");
      el.style.setProperty("border-radius", "14px", "important");
      el.style.setProperty("border", "1px solid rgba(212,180,90,0.28)", "important");
      el.style.setProperty("background", "rgba(15,76,58,0.14)", "important");
    });
    d.querySelectorAll(".cgs-btn").forEach(function (btn) {
      btn.style.setProperty("display", "inline-flex", "important");
      btn.style.setProperty("visibility", "visible", "important");
      btn.style.setProperty("opacity", "1", "important");
      btn.style.setProperty("pointer-events", "auto", "important");
    });
    log("tracks-forced:" + nodes.length);
  }

  /** Clone track strip to top of main so visible even when not on Reminder */
  function ensureSitewideTracks() {
    if (d.getElementById("clarity-track-strip-global")) {
      forceTracks();
      return;
    }
    var src = d.querySelector(".clarity-gate-switcher");
    var main = d.getElementById("main-content");
    if (!src || !main) {
      log("tracks-no-src");
      return;
    }
    var clone = src.cloneNode(true);
    clone.id = "clarity-track-strip-global";
    clone.classList.add("clarity-gate-switcher", "rrra-sitewide", "track-strip-global");
    clone.setAttribute("data-global-track", "1");
    /* re-bind onclick from data-gate */
    clone.querySelectorAll(".cgs-btn[data-gate]").forEach(function (btn) {
      var g = btn.getAttribute("data-gate");
      btn.onclick = function () {
        try {
          if (typeof w.claritySwitchGate === "function") w.claritySwitchGate(g);
        } catch (e) {}
      };
    });
    main.insertBefore(clone, main.firstChild);
    forceTracks();
    log("tracks-global");
  }

  function openNotes() {
    d.querySelectorAll(".tab-panel").forEach(function (p) {
      p.classList.remove("is-active", "active");
      p.setAttribute("aria-hidden", "true");
      try { p.style.removeProperty("display"); } catch (e) {}
    });
    var notes = d.getElementById("tab-notes");
    if (!notes) {
      log("notes-missing");
      return false;
    }
    notes.classList.add("is-active", "active");
    notes.setAttribute("aria-hidden", "false");
    notes.removeAttribute("hidden");
    notes.style.setProperty("display", "block", "important");
    notes.style.setProperty("visibility", "visible", "important");
    notes.style.setProperty("height", "auto", "important");
    notes.style.setProperty("opacity", "1", "important");
    notes.querySelectorAll(".notes-hub-v35, .nh-card, textarea").forEach(function (el) {
      el.style.setProperty("display", "block", "important");
      el.style.setProperty("visibility", "visible", "important");
    });
    d.querySelectorAll("[data-rail-tab],[data-rrra]").forEach(function (b) {
      var t = (b.getAttribute("data-rail-tab") || b.getAttribute("data-rrra") || "").toLowerCase();
      b.classList.toggle("is-active", t === "notes");
    });
    try {
      localStorage.setItem("clarity_companion_tab_v1", "notes");
      history.replaceState(null, "", "#notes");
    } catch (e) {}
    try {
      notes.scrollIntoView({ block: "start", behavior: "smooth" });
    } catch (e2) {}
    log("notes-open");
    return true;
  }

  w.clarityOpenNotes = openNotes;

  function wireDoor() {
    var prev = w.clarityOpenSectionDoor;
    w.clarityOpenSectionDoor = function (id) {
      id = String(id || "").toLowerCase();
      if (id === "notes" || id === "amana" || id === "vault") {
        openNotes();
        return;
      }
      if (typeof prev === "function") {
        try { return prev.apply(this, arguments); } catch (e) {}
      }
    };
    d.querySelectorAll('[data-rail-tab="notes"], .rrra-rail-notes').forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        try { ev.preventDefault(); } catch (e) {}
        openNotes();
      });
    });
    log("door-wired");
  }

  function boot() {
    ensureSitewideTracks();
    forceTracks();
    wireDoor();
    if ((w.location.hash || "").toLowerCase() === "#notes") openNotes();
    setTimeout(function () {
      ensureSitewideTracks();
      forceTracks();
    }, 500);
    setTimeout(forceTracks, 1200);
    log("boot");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("clarity-allowlist-ready", function () {
    forceTracks();
    ensureSitewideTracks();
  });
})(window, document);
