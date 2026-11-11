/*! craft-meme-boot-v1 · C19MEME25
 * Always load verse + scene; never leave text blank after scenery
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_BOOT_V25__) return;
  w.__CRAFT_MEME_BOOT_V25__ = true;

  var STATE = "clarity.craft.meme.state.v1";
  function $(id) { return d.getElementById(id); }

  function loadState() {
    try { return JSON.parse(localStorage.getItem(STATE) || "null") || {}; }
    catch (e) { return {}; }
  }
  function paint() {
    try {
      if (typeof w.craftMemeRepaintStandard === "function") w.craftMemeRepaintStandard();
      else if (typeof w.memeDraw === "function") w.memeDraw();
    } catch (e) {}
  }
  function ensureVerse() {
    var L = w.__memeLayers || {};
    if (L.ar || L.en) return true;
    if (w.CraftMemeSource && typeof w.CraftMemeSource.loadSection === "function") {
      w.CraftMemeSource.loadSection("reminder", true);
      return true;
    }
    /* last resort local line */
    w.__memeLayers = {
      ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      en: "Verily, in the remembrance of Allah do hearts find rest.",
      ur: "",
      ref: "Qur’an 13:28"
    };
    if (w.CraftMemeUrduFetch) {
      try { w.CraftMemeUrduFetch.loadForCurrentLayers(true); } catch (e) {}
    }
    return true;
  }
  function fetchScene(kind) {
    kind = kind || "nature";
    try {
      if (typeof w.__memeOnlineFetch === "function") w.__memeOnlineFetch(kind);
      else if (typeof w.memeFetchBg === "function") w.memeFetchBg(kind);
    } catch (e) {}
  }
  function bind() {
    d.querySelectorAll("[data-meme-section], [data-rrra]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        d.querySelectorAll("[data-meme-section], [data-rrra]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var sec = btn.getAttribute("data-meme-section") || btn.getAttribute("data-rrra") || "reminder";
        if (w.CraftMemeSource && w.CraftMemeSource.loadSection) w.CraftMemeSource.loadSection(sec, true);
        setTimeout(paint, 200);
      });
    });
    ["meme-wire-preview", "meme-daily-pack", "meme-full-surprise", "meme-refresh-source"].forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.addEventListener("click", function () {
        ensureVerse();
        setTimeout(paint, 100);
        setTimeout(paint, 500);
      });
    });
    var next = $("meme-next-bg") || $("meme-surprise-bg");
    if (next) {
      next.addEventListener("click", function () {
        ensureVerse();
        setTimeout(paint, 400);
        setTimeout(paint, 900);
      });
    }
  }
  function boot() {
    var c = $("meme-canvas") || $("mr-canvas");
    if (c && !c.width) { c.width = 1200; c.height = 675; }
    ensureVerse();
    bind();
    paint();
    setTimeout(function () {
      ensureVerse();
      paint();
      if (!(w.__memeBgImage || (w.memeState && w.memeState.img))) fetchScene("nature");
    }, 400);
    setTimeout(paint, 1200);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(boot, 200); });
})(window, document);
