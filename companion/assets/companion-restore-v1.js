/*! companion-restore-v1 · gates · notes · banner sides · meme top */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_RESTORE_V1__) return;
  w.__CLARITY_RESTORE_V1__ = true;
  var LOG = (w.__RESTORE_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  function showGates() {
    var g = d.querySelector(".clarity-gate-switcher");
    if (!g) return;
    g.style.setProperty("display", "flex", "important");
    g.hidden = false;
    g.removeAttribute("hidden");
    log("gates-on");
  }

  function bannerSides() {
    var ov = d.querySelector(".banner-overlay");
    if (!ov) return;
    var left = ov.querySelector(".banner-side.left");
    var right = ov.querySelector(".banner-side.right");
    var center = ov.querySelector(".banner-center");
    var salah = d.querySelector(".salah-times-section");
    var cal = d.querySelector(".hijri-cal-section");
    if (!right) {
      right = d.createElement("div");
      right.className = "banner-side right";
      ov.appendChild(right);
    }
    if (cal && left) left.appendChild(cal);
    if (salah) right.appendChild(salah);
    if (left) {
      left.style.cssText = "position:absolute;left:0.45rem;top:0.45rem;width:min(38vw,10.5rem);z-index:3;";
    }
    if (right) {
      right.style.cssText = "position:absolute;right:0.45rem;top:0.45rem;width:min(38vw,10.5rem);z-index:3;left:auto;";
    }
    log("sides");
  }

  function wireNotesDoor() {
    /* ensure clarityOpenSectionDoor handles notes */
    var prev = w.clarityOpenSectionDoor;
    w.clarityOpenSectionDoor = function (id) {
      id = String(id || "").toLowerCase();
      if (id === "notes" || id === "amana" || id === "vault") {
        d.querySelectorAll(".tab-panel").forEach(function (p) {
          p.classList.remove("is-active", "active");
          p.setAttribute("aria-hidden", "true");
        });
        var notes = d.getElementById("tab-notes");
        if (notes) {
          notes.classList.add("is-active", "active");
          notes.setAttribute("aria-hidden", "false");
          notes.style.display = "block";
          try { history.replaceState(null, "", "#notes"); } catch (e) {}
          log("notes-open");
          return;
        }
      }
      if (typeof prev === "function") {
        try { return prev.apply(this, arguments); } catch (e2) {}
      }
    };
  }

  function memeTopTools() {
    /* Scene / Frame / Grid / 4x4 — bind if present */
    d.querySelectorAll("[data-meme-tool], .meme-tool-scene, .meme-tool-frame").forEach(function (btn) {
      if (btn.__restore) return;
      btn.addEventListener("click", function () {
        var t = btn.getAttribute("data-meme-tool") || btn.textContent || "";
        t = String(t).toLowerCase();
        try {
          if (t.indexOf("scene") >= 0 && typeof w.memeFetchBg === "function") w.memeFetchBg("nature");
          if (t.indexOf("frame") >= 0 && typeof w.memeSetRatio === "function") w.memeSetRatio("twitter");
          if (t.indexOf("4") >= 0 && typeof w.memeSetRatio === "function") w.memeSetRatio("square");
        } catch (e) {}
      });
      btn.__restore = true;
    });
    /* text buttons injected by packs */
    d.querySelectorAll("button").forEach(function (btn) {
      var t = (btn.textContent || "").trim();
      if (btn.__restoreTop) return;
      if (t === "Scene" || t === "Frame" || t === "Grid" || t === "4×4" || t === "4x4") {
        btn.addEventListener("click", function () {
          try {
            if (t === "Scene" && w.memeFetchBg) w.memeFetchBg("nature");
            if ((t === "Frame" || t === "Grid") && w.memeSetRatio) w.memeSetRatio("twitter");
            if ((t === "4×4" || t === "4x4") && w.memeSetRatio) w.memeSetRatio("square");
            log("meme-top:" + t);
          } catch (e) {}
        });
        btn.__restoreTop = true;
      }
    });
  }

  function boot() {
    showGates();
    bannerSides();
    wireNotesDoor();
    memeTopTools();
    setTimeout(function () {
      showGates();
      bannerSides();
      memeTopTools();
    }, 600);
    setTimeout(function () {
      bannerSides();
      memeTopTools();
    }, 1500);
    log("restore-boot");
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("clarity-a2-spine-ready", function () {
    setTimeout(function () {
      showGates();
      bannerSides();
      memeTopTools();
    }, 100);
  });
})(window, document);
