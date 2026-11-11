/*! craft-meme-boot-v1 · C19MEME27
 * One ensureVerse · limited paint cycles · less flash
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_BOOT_V27__) return;
  w.__CRAFT_MEME_BOOT_V27__ = true;

  function $(id) { return d.getElementById(id); }
  function paint() {
    try {
      if (typeof w.craftMemeRepaintStandard === "function") w.craftMemeRepaintStandard();
      else if (typeof w.memeDraw === "function") w.memeDraw();
    } catch (e) {}
  }
  function ensureVerse() {
    var L = w.__memeLayers || {};
    if (L.ar || L.en) return;
    if (w.CraftMemeSource && w.CraftMemeSource.loadSection) {
      try { w.CraftMemeSource.loadSection("reminder", true); return; } catch (e) {}
    }
    w.__memeLayers = {
      ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      en: "Verily, in the remembrance of Allah do hearts find rest.",
      ur: "",
      ref: "Qur’an 13:28"
    };
    if (w.CraftMemeUrduFetch) {
      try { w.CraftMemeUrduFetch.loadForCurrentLayers(false); } catch (e2) {}
    }
  }
  function boot() {
    var c = $("meme-canvas") || $("mr-canvas");
    if (c && !c.width) { c.width = 1200; c.height = 675; }
    ensureVerse();
    paint();
    setTimeout(function () {
      ensureVerse();
      paint();
      try {
        if (!(w.__memeBgImage || (w.memeState && w.memeState.img))) {
          if (typeof w.__memeOnlineFetch === "function") w.__memeOnlineFetch("nature");
          else if (typeof w.memeFetchBg === "function") w.memeFetchBg("nature");
        }
      } catch (eF) {}
    }, 500);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
