/*! companion-meme-host-v1 · Phase 1 host surface · educational only */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_HOST_V1__) return;
  w.__COMPANION_MEME_HOST_V1__ = true;

  function norm(p) {
    p = String(p || "dai").toLowerCase().replace(/\s+/g, "_");
    if (p === "daily" || p === "daily_muslim") return "practicing";
    if (p === "new" || p === "newmuslim") return "new_muslim";
    return p;
  }
  function path() {
    try {
      var b = d.querySelector("[data-cs-path].is-active");
      if (b) return norm(b.getAttribute("data-cs-path"));
    } catch (e) {}
    try {
      return norm(localStorage.getItem("cu_companion_path_v1") || "dai");
    } catch (e2) {}
    return "dai";
  }
  function allowed() {
    var p = path();
    return p === "practicing" || p === "dai";
  }
  function gate() {
    var sec = d.getElementById("meme-section");
    var mount = d.getElementById("cs-meme-mount");
    var frame = d.getElementById("cs-meme-frame");
    if (!sec) return;
    if (allowed()) {
      sec.style.removeProperty("display");
      sec.removeAttribute("hidden");
      if (mount) {
        mount.style.removeProperty("display");
        if (frame && !frame.getAttribute("src")) frame.setAttribute("src", "/companion/meme/");
      }
    } else {
      /* Phase 1: still show plaque + open link; hide heavy iframe for seeker/new */
      if (mount) mount.style.setProperty("display", "none", "important");
      sec.style.removeProperty("display");
      sec.removeAttribute("hidden");
    }
  }
  function boot() {
    gate();
    d.addEventListener(
      "click",
      function (ev) {
        if (ev.target && ev.target.closest && ev.target.closest("[data-cs-path],[data-rail-tab]"))
          setTimeout(gate, 40);
      },
      true
    );
    var m = d.getElementById("cs-mount");
    if (m) {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(gate, 50);
      }).observe(m, { childList: true, subtree: true });
    }
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityMemeHost = { gate: gate, version: "P1" };
})(window, document);
