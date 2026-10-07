/**
 * Curriculum Tools Bridge v1 — wires Notes, Calligraphy, Tajweed into pathway use
 * Shared shell: notes always available (lazy). Daily: tajweed LMR + callig practice cues.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_CURRICULUM_TOOLS_V1__) return;
  w.__CLARITY_CURRICULUM_TOOLS_V1__ = true;
  var VER = "20261006FD";

  function inject(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src*="' + src.replace(/^\.\//, "") + '"]')) {
        resolve("already");
        return;
      }
      var s = document.createElement("script");
      s.src = src + (src.indexOf("?") >= 0 ? "&" : "?") + "v=" + VER;
      s.defer = true;
      s.onload = function () { resolve("loaded"); };
      s.onerror = function () { reject(new Error("fail " + src)); };
      (document.head || document.documentElement).appendChild(s);
    });
  }

  function pathI() {
    try {
      var n = parseInt(document.documentElement.getAttribute("data-path-i") || "0", 10);
      return isNaN(n) ? 0 : n;
    } catch (e) { return 0; }
  }

  var notesLoaded = false, tjLoaded = false;

  function ensureNotes() {
    if (notesLoaded || w.__CLARITY_NOTES_RECOVERY_V1__) {
      notesLoaded = true;
      return Promise.resolve("ready");
    }
    return inject("./assets/clarity-notes-recovery-v1.js").then(function () {
      notesLoaded = true;
      try { w.dispatchEvent(new CustomEvent("clarity-tool-ready", { detail: { tool: "notes" } })); } catch (e) {}
      return "loaded";
    }).catch(function () { return "fail"; });
  }

  function ensureTajweed() {
    if (pathI() < 2) return Promise.resolve("gated");
    if (tjLoaded || w.__CLARITY_TJ_LMR__) {
      tjLoaded = true;
      return Promise.resolve("ready");
    }
    return inject("./assets/nx-tj-lmr-js-v1.js").then(function () {
      tjLoaded = true;
      try { w.dispatchEvent(new CustomEvent("clarity-tool-ready", { detail: { tool: "tajweed" } })); } catch (e) {}
      return "loaded";
    }).catch(function () { return "fail"; });
  }

  function bindNotesOpen() {
    // Load notes script when user opens notes shell or clicks notes nav
    document.addEventListener("click", function (ev) {
      var t = ev.target;
      if (!t) return;
      var el = t.closest && t.closest("#notes-shell, [data-open-notes], [href*='notes'], button[aria-controls*='notes']");
      if (el || (t.id && /notes/i.test(t.id))) ensureNotes();
    }, true);
    // Intersection: notes-shell enters viewport
    try {
      var ns = document.getElementById("notes-shell");
      if (ns && "IntersectionObserver" in w) {
        var io = new IntersectionObserver(function (ents) {
          ents.forEach(function (e) { if (e.isIntersecting) { ensureNotes(); io.disconnect(); } });
        }, { rootMargin: "80px" });
        io.observe(ns);
      }
    } catch (e) {}
  }

  function bindTajweedCards() {
    var ids = ["tajweed-path-card", "tj-lmr-score-card", "tj-deep-studio", "tajweed-live-card"];
    try {
      if (!("IntersectionObserver" in w)) return;
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          if (e.isIntersecting && pathI() >= 2) {
            ensureTajweed();
            io.disconnect();
          }
        });
      }, { rootMargin: "100px" });
      ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) io.observe(el);
      });
    } catch (e) {}
    document.addEventListener("clarity-path-changed", function () {
      if (pathI() >= 2) ensureTajweed();
    });
  }

  function calligCue() {
    // Soft utilization tip when callig card is visible on Daily+
    if (pathI() < 2) return;
    var card = document.getElementById("callig-lab-card");
    if (!card || card.querySelector(".clarity-tool-cue")) return;
    try {
      var cue = document.createElement("p");
      cue.className = "clarity-tool-cue";
      cue.style.cssText = "margin:.5rem 0 0;font-size:.85rem;opacity:.9;line-height:1.4";
      cue.textContent = "Practice path: one letter today · EN→AR · mark Practiced. Pair with Tajweed makhārij.";
      var tools = card.querySelector(".callig-canvas-tools, .callig-topbar, h2, h3");
      if (tools && tools.parentNode) tools.parentNode.insertBefore(cue, tools.nextSibling);
      else card.appendChild(cue);
    } catch (e) {}
  }

  function notesCue() {
    var card = document.getElementById("notes-shell");
    if (!card || card.querySelector(".clarity-tool-cue")) return;
    try {
      var cue = document.createElement("p");
      cue.className = "clarity-tool-cue";
      cue.style.cssText = "margin:.4rem 0;font-size:.85rem;opacity:.9";
      cue.textContent = "On-device only · use for lesson notes, wasiyyah drafts, and reflections. Export often.";
      var h = card.querySelector("h2, h3, .card-title");
      if (h && h.parentNode) h.parentNode.insertBefore(cue, h.nextSibling);
      else card.insertBefore(cue, card.firstChild);
    } catch (e) {}
  }

  function boot() {
    bindNotesOpen();
    bindTajweedCards();
    setTimeout(notesCue, 900);
    setTimeout(calligCue, 1200);
    w.addEventListener("clarity-path-changed", function () {
      setTimeout(calligCue, 400);
      if (pathI() >= 2) ensureTajweed();
    });
    // Shared path always may preload notes on idle
    if ("requestIdleCallback" in w) {
      requestIdleCallback(function () { if (pathI() >= 0) ensureNotes(); }, { timeout: 8000 });
    } else {
      setTimeout(function () { ensureNotes(); }, 6000);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  w.ClarityCurriculumTools = {
    version: VER,
    ensureNotes: ensureNotes,
    ensureTajweed: ensureTajweed,
    pathI: pathI
  };
})(typeof window !== "undefined" ? window : this);
