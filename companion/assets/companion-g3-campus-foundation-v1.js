/*! companion-g3-campus-foundation-v1 · path tiles · hide meme peek · stable */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_G3_FOUNDATION_V1__) return;
  w.__CLARITY_G3_FOUNDATION_V1__ = true;
  var LOG = (w.__G3_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  function hideMemePeek() {
    ["meme-card", "meme-studio-root"].forEach(function (id) {
      var el = d.getElementById(id);
      if (!el) return;
      el.style.setProperty("display", "none", "important");
      el.setAttribute("hidden", "hidden");
      log("hide-" + id);
    });
    d.querySelectorAll(".meme-card-realigned, .meme-studio").forEach(function (el) {
      if (el.id === "meme-card-bridge" || el.classList.contains("craft-bridge-inline")) return;
      el.style.setProperty("display", "none", "important");
    });
  }

  function ensurePathTiles() {
    var g = d.querySelector(".clarity-gate-switcher");
    if (!g) {
      log("no-gate");
      return;
    }
    g.classList.add("path-tiles");
    g.style.setProperty("display", "grid", "important");
    log("path-tiles");
  }

  function boot() {
    hideMemePeek();
    ensurePathTiles();
    setTimeout(function () {
      hideMemePeek();
      ensurePathTiles();
    }, 500);
    log("g3-boot");
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
