/*! craft-meme-scale-wire-v1 · C19MEME11
 * Guarantees scale sliders update canvas text via paint-standard
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_SCALE_WIRE_V1__) return;
  w.__CRAFT_MEME_SCALE_WIRE_V1__ = true;

  var STORE = "clarity.craft.meme.scale.v1";

  function $(id) { return d.getElementById(id); }

  function readScale() {
    var ar = parseInt(($("meme-scale-ar") || {}).value, 10);
    var en = parseInt(($("meme-scale-en") || {}).value, 10);
    if (!isFinite(ar)) ar = 100;
    if (!isFinite(en)) en = 100;
    ar = Math.min(140, Math.max(50, ar));
    en = Math.min(140, Math.max(50, en));
    return { ar: ar / 100, en: en / 100, ref: 1 };
  }

  function writeLabels(s) {
    var arv = $("meme-scale-ar-val");
    var env = $("meme-scale-en-val");
    if (arv) arv.textContent = Math.round(s.ar * 100) + "%";
    if (env) env.textContent = Math.round(s.en * 100) + "%";
  }

  function applyToEngine(s) {
    try {
      if (typeof w.craftMemeSetScale === "function") {
        w.craftMemeSetScale(s.ar, s.en);
        return;
      }
    } catch (e) {}
    try {
      localStorage.setItem(STORE, JSON.stringify(s));
    } catch (e2) {}
    if (typeof w.memeDraw === "function") {
      try { w.memeDraw(); } catch (e3) {}
    }
  }

  function onSlide() {
    var s = readScale();
    writeLabels(s);
    try { localStorage.setItem(STORE, JSON.stringify(s)); } catch (e) {}
    applyToEngine(s);
  }

  function bind() {
    ["meme-scale-ar", "meme-scale-en"].forEach(function (id) {
      var el = $(id);
      if (!el || el._scaleWire) return;
      el._scaleWire = true;
      el.addEventListener("input", onSlide);
      el.addEventListener("change", onSlide);
    });
    function click(id, fn) {
      var el = $(id);
      if (!el || el._scaleWire) return;
      el._scaleWire = true;
      el.addEventListener("click", fn);
    }
    click("meme-scale-apply", onSlide);
    click("meme-scale-reset", function () {
      var ar = $("meme-scale-ar");
      var en = $("meme-scale-en");
      if (ar) ar.value = "100";
      if (en) en.value = "100";
      onSlide();
    });
    click("meme-scale-auto", function () {
      if (typeof w.memeAutoScaleLines === "function") w.memeAutoScaleLines();
      else if (typeof w.craftMemeSetScale === "function") {
        /* leave engine auto if available via memeDraw after reset flags */
        onSlide();
      } else onSlide();
    });
    click("meme-auto-scale", function () {
      if (typeof w.memeAutoScaleLines === "function") w.memeAutoScaleLines();
      else onSlide();
    });
    /* restore saved into sliders */
    try {
      var saved = JSON.parse(localStorage.getItem(STORE) || "null");
      if (saved && typeof saved.ar === "number") {
        var ar = $("meme-scale-ar");
        var en = $("meme-scale-en");
        if (ar) ar.value = String(Math.round(saved.ar * 100));
        if (en) en.value = String(Math.round((saved.en || 1) * 100));
        writeLabels({ ar: saved.ar, en: saved.en || 1 });
      }
    } catch (e4) {}
  }

  function boot() { bind(); }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(bind, 300); setTimeout(bind, 900); });
})(window, document);
