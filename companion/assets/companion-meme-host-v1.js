/*! companion-meme-host-v1 · Phase 2 · banner-style embed · educational only */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_HOST_V2__) return;
  w.__COMPANION_MEME_HOST_V2__ = true;

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
  function status(msg) {
    var el = d.getElementById("cs-meme-host-status");
    if (el) el.textContent = msg || "";
  }
  function frame() {
    return d.getElementById("cs-meme-frame");
  }
  function mount() {
    return d.getElementById("cs-meme-mount");
  }
  function ensureSrc() {
    var fr = frame();
    if (!fr) return;
    var want = "/companion/meme/?embed=1";
    var cur = fr.getAttribute("src") || "";
    if (!cur || cur.indexOf("/companion/meme/") < 0) {
      fr.setAttribute("src", want);
    }
  }
  function setHeightMode(mode) {
    var m = mount();
    if (!m) return;
    m.classList.remove("is-expanded", "is-compact");
    if (mode === "expand") m.classList.add("is-expanded");
    if (mode === "compact") m.classList.add("is-compact");
    status(mode === "expand" ? "Studio expanded" : mode === "compact" ? "Studio compact" : "Studio default height");
  }
  function gate() {
    var sec = d.getElementById("meme-section");
    var m = mount();
    if (!sec) return;
    if (allowed()) {
      sec.setAttribute("data-path-gate", "open");
      if (m) m.style.removeProperty("display");
      ensureSrc();
      status("Path · Daily/Daʿī · studio available");
    } else {
      sec.setAttribute("data-path-gate", "locked");
      if (m) m.style.setProperty("display", "none", "important");
      status("Path · Seeker/New · open isolated studio link when ready · Daily/Daʿī unlock in-section host");
    }
  }
  function onMessage(ev) {
    // Same-origin soft protocol for future height handshake
    try {
      if (!ev || !ev.data || typeof ev.data !== "object") return;
      if (ev.data.source !== "clarity-companion-meme") return;
      if (ev.data.type === "ready") status("Studio ready");
      if (ev.data.type === "height" && typeof ev.data.px === "number") {
        var fr = frame();
        if (fr && ev.data.px > 400 && ev.data.px < 1600) {
          fr.style.height = Math.round(ev.data.px) + "px";
        }
      }
    } catch (e) {}
  }
  function boot() {
    gate();
    d.addEventListener(
      "click",
      function (ev) {
        var t = ev.target;
        if (!t || !t.closest) return;
        var actBtn = t.closest("[data-meme-host-act]");
        if (actBtn) {
          var act = actBtn.getAttribute("data-meme-host-act");
          if (act === "expand") setHeightMode("expand");
          if (act === "compact") setHeightMode("compact");
          return;
        }
        if (t.closest("[data-cs-path],[data-rail-tab]")) setTimeout(gate, 50);
      },
      true
    );
    w.addEventListener("message", onMessage);
    var m = d.getElementById("cs-mount");
    if (m) {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(gate, 60);
      }).observe(m, { childList: true, subtree: true });
    }
    var fr = frame();
    if (fr) {
      fr.addEventListener("load", function () {
        status("Studio frame loaded");
        try {
          fr.contentWindow.postMessage({ source: "clarity-companion-host", type: "embed" }, "*");
        } catch (e) {}
      });
    }
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityMemeHost = { gate: gate, setHeightMode: setHeightMode, version: "P2" };
})(window, document);
