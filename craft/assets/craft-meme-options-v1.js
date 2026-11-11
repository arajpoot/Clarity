/*! craft-meme-options-v1 · C19MEME27
 * Density · frame · vignette only · auto contrast in paint
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_OPTIONS_V26__) return;
  w.__CRAFT_MEME_OPTIONS_V26__ = true;

  var OPT_KEY = "clarity.craft.meme.opts.v1";
  var opts = { frame: true, vignette: true, density: "standard" };

  function $(id) { return d.getElementById(id); }
  function load() {
    try {
      var o = JSON.parse(localStorage.getItem(OPT_KEY) || "null");
      if (o) {
        if (typeof o.frame === "boolean") opts.frame = o.frame;
        if (typeof o.vignette === "boolean") opts.vignette = o.vignette;
        if (o.density) opts.density = o.density;
      }
    } catch (e) {}
  }
  function save() {
    try { localStorage.setItem(OPT_KEY, JSON.stringify(opts)); } catch (e) {}
  }
  function publish() {
    w.__memeLayerFlags = { ar: true, en: true, ur: true, ref: true };
    w.__memeFrameOn = opts.frame !== false;
    w.__memeVignetteOn = opts.vignette !== false;
    w.__memeTextDensity = opts.density || "standard";
    w.__memeAutoContrast = true;
  }
  function paint() {
    publish();
    save();
    try {
      if (typeof w.craftMemeRepaintStandard === "function") w.craftMemeRepaintStandard();
      else if (typeof w.memeDraw === "function") w.memeDraw();
    } catch (e) {}
  }
  function cleanSection5() {
    var host = $("meme-layers-section");
    if (!host) return;
    host.querySelectorAll("[data-layer], [data-ink]").forEach(function (el) {
      el.style.display = "none";
    });
    var look = $("meme-look-fonts");
    if (look) look.remove();
    var inkLabel = host.querySelector(".opt-chips");
    /* leave density chips visible */
    var notes = host.querySelectorAll(".panel-note");
    notes.forEach(function (n, i) {
      if (i > 0) n.style.display = "none";
    });
    var first = host.querySelector(".panel-note");
    if (first) {
      first.textContent =
        "Auto contrast from scenery · readable type with outline · scale in section 6.";
    }
  }
  function bind() {
    cleanSection5();
    d.querySelectorAll("[data-density]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-density") === opts.density);
      b.onclick = function () {
        opts.density = b.getAttribute("data-density") || "standard";
        d.querySelectorAll("[data-density]").forEach(function (x) {
          x.classList.toggle("active", x.getAttribute("data-density") === opts.density);
        });
        paint();
      };
    });
    var fr = $("meme-opt-frame");
    if (fr) {
      fr.checked = !!opts.frame;
      fr.onchange = function () { opts.frame = !!fr.checked; paint(); };
    }
    var vg = $("meme-opt-vignette");
    if (vg) {
      vg.checked = !!opts.vignette;
      vg.onchange = function () { opts.vignette = !!vg.checked; paint(); };
    }
    publish();
  }
  function boot() {
    load();
    bind();
    setTimeout(bind, 300);
  }
  w.CraftMemeOptions = { paint: paint, publish: publish };
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
