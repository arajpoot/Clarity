/*! companion-g1-integrity-v1 · G0–G1 contract lock · richness kept · campus frozen */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_G1_INTEGRITY_V1__) return;
  w.__CLARITY_G1_INTEGRITY_V1__ = true;

  var LOG = (w.__G1_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  function roomOk() {
    try {
      var p = (w.location.pathname || "");
      if (/^\/(campus|daily|amana)/.test(p)) return false;
    } catch (e) {}
    return true;
  }

  /** Tracks: place strip under banner, above main hubs */
  function placeTracks() {
    var strip = d.querySelector("#clarity-track-strip-global") || d.querySelector(".clarity-gate-switcher");
    if (!strip) {
      log("tracks-missing");
      return;
    }
    var banner = d.querySelector("#clarity-top-duo") || d.querySelector(".banner");
    var main = d.getElementById("main-content");
    strip.classList.add("clarity-gate-switcher", "rrra-sitewide");
    strip.hidden = false;
    strip.style.setProperty("display", "flex", "important");
    strip.style.setProperty("visibility", "visible", "important");
    strip.style.setProperty("opacity", "1", "important");
    strip.style.setProperty("flex-wrap", "wrap", "important");
    /* Prefer: immediately after top duo / banner */
    if (banner && banner.parentNode) {
      if (strip.parentNode !== banner.parentNode || strip.previousElementSibling !== banner) {
        try {
          banner.parentNode.insertBefore(strip, banner.nextSibling);
          log("tracks-under-banner");
        } catch (e) {
          if (main) {
            main.insertBefore(strip, main.firstChild);
            log("tracks-main-top");
          }
        }
      } else {
        log("tracks-already");
      }
    } else if (main && strip.parentNode !== main) {
      main.insertBefore(strip, main.firstChild);
      log("tracks-main-top");
    }
    strip.querySelectorAll(".cgs-btn").forEach(function (btn) {
      btn.style.setProperty("display", "inline-flex", "important");
      btn.style.setProperty("visibility", "visible", "important");
    });
  }

  function openNotes() {
    d.querySelectorAll(".tab-panel").forEach(function (p) {
      p.classList.remove("is-active", "active");
      p.setAttribute("aria-hidden", "true");
    });
    var notes = d.getElementById("tab-notes");
    if (!notes) {
      log("notes-missing");
      return;
    }
    notes.classList.add("is-active", "active");
    notes.setAttribute("aria-hidden", "false");
    notes.style.setProperty("display", "block", "important");
    try {
      localStorage.setItem("clarity_companion_tab_v1", "notes");
      history.replaceState(null, "", "#notes");
    } catch (e) {}
    log("notes-open");
  }

  function wireNotes() {
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
    log("notes-wired");
  }

  function assertOwners() {
    var flags = [
      "__CLARITY_COMPANION_ROOM_OWNER_V1__",
      "__COMPANION_PATH_GOVERNANCE_V1__"
    ];
    flags.forEach(function (f) {
      log((w[f] ? "owner-ok:" : "owner-miss:") + f);
    });
  }

  function boot() {
    if (!roomOk()) {
      log("skip-non-companion");
      return;
    }
    d.documentElement.setAttribute("data-clarity-room", "companion");
    placeTracks();
    wireNotes();
    assertOwners();
    setTimeout(placeTracks, 400);
    setTimeout(placeTracks, 1200);
    log("g1-boot");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(placeTracks, 100); });
})(window, document);
