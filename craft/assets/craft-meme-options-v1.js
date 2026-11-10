/*! craft-meme-options-v1 · C19MEME8
 * Full richness controls — RRRA section chips, layer toggles, ink, frame, density
 * Always delegates paint to memeDraw / paint-standard (single owner)
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_OPTIONS_V1__) return;
  w.__CRAFT_MEME_OPTIONS_V1__ = true;

  var OPT_KEY = "clarity.craft.meme.opts.v1";
  var opts = {
    section: "reminder",
    layers: { ar: true, en: true, ur: true, ref: true },
    ink: "light",
    frame: true,
    vignette: true,
    density: "standard"
  };

  function load() {
    try {
      var o = JSON.parse(localStorage.getItem(OPT_KEY) || "{}");
      if (o && typeof o === "object") {
        if (o.section) opts.section = o.section;
        if (o.layers) opts.layers = Object.assign(opts.layers, o.layers);
        if (o.ink) opts.ink = o.ink;
        if (typeof o.frame === "boolean") opts.frame = o.frame;
        if (typeof o.vignette === "boolean") opts.vignette = o.vignette;
        if (o.density) opts.density = o.density;
      }
    } catch (e) {}
    w.__craftMemeOpts = opts;
  }
  function save() {
    try { localStorage.setItem(OPT_KEY, JSON.stringify(opts)); } catch (e) {}
    w.__craftMemeOpts = opts;
  }
  function $(id) { return d.getElementById(id); }
  function status(msg) {
    var el = $("meme-options-status") || $("meme-source-status");
    if (el) el.textContent = msg || "";
  }
  function paint() {
    if (typeof w.memeDraw === "function") {
      try { w.memeDraw(); } catch (e) {}
    }
  }

  function setSection(sec) {
    opts.section = sec;
    save();
    d.querySelectorAll("[data-rrra]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-rrra") === sec);
    });
    /* try source API */
    try {
      if (w.CraftMemeSource && typeof w.CraftMemeSource.pick === "function") {
        w.CraftMemeSource.pick(sec);
      } else if (typeof w.craftMemeLoadSection === "function") {
        w.craftMemeLoadSection(sec);
      } else {
        var btn = d.querySelector('[data-section="' + sec + '"]');
        if (btn) btn.click();
      }
    } catch (e) {}
    status("Section · " + sec);
    paint();
  }

  function toggleLayer(key) {
    opts.layers[key] = !opts.layers[key];
    save();
    var b = d.querySelector('[data-layer="' + key + '"]');
    if (b) b.classList.toggle("active", !!opts.layers[key]);
    /* expose for paint-standard consumers */
    w.__memeLayerFlags = opts.layers;
    status("Layer " + key + " · " + (opts.layers[key] ? "on" : "off"));
    paint();
  }

  function setInk(mode) {
    opts.ink = mode;
    save();
    d.querySelectorAll("[data-ink]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-ink") === mode);
    });
    w.__memeInkMode = mode;
    status("Ink · " + mode);
    paint();
  }

  function setDensity(mode) {
    opts.density = mode;
    save();
    d.querySelectorAll("[data-density]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-density") === mode);
    });
    w.__memeTextDensity = mode;
    status("Density · " + mode);
    paint();
  }

  function bind() {
    d.querySelectorAll("[data-rrra]").forEach(function (b) {
      if (b._opt) return;
      b._opt = true;
      b.addEventListener("click", function () {
        setSection(b.getAttribute("data-rrra"));
      });
      b.classList.toggle("active", b.getAttribute("data-rrra") === opts.section);
    });
    d.querySelectorAll("[data-layer]").forEach(function (b) {
      if (b._opt) return;
      b._opt = true;
      var k = b.getAttribute("data-layer");
      b.classList.toggle("active", !!opts.layers[k]);
      b.addEventListener("click", function () { toggleLayer(k); });
    });
    d.querySelectorAll("[data-ink]").forEach(function (b) {
      if (b._opt) return;
      b._opt = true;
      b.classList.toggle("active", b.getAttribute("data-ink") === opts.ink);
      b.addEventListener("click", function () { setInk(b.getAttribute("data-ink")); });
    });
    d.querySelectorAll("[data-density]").forEach(function (b) {
      if (b._opt) return;
      b._opt = true;
      b.classList.toggle("active", b.getAttribute("data-density") === opts.density);
      b.addEventListener("click", function () { setDensity(b.getAttribute("data-density")); });
    });
    var fr = $("meme-opt-frame");
    if (fr && !fr._opt) {
      fr._opt = true;
      fr.checked = !!opts.frame;
      fr.addEventListener("change", function () {
        opts.frame = !!fr.checked;
        w.__memeFrameOn = opts.frame;
        save();
        paint();
      });
    }
    var vg = $("meme-opt-vignette");
    if (vg && !vg._opt) {
      vg._opt = true;
      vg.checked = !!opts.vignette;
      vg.addEventListener("change", function () {
        opts.vignette = !!vg.checked;
        w.__memeVignetteOn = opts.vignette;
        save();
        paint();
      });
    }
    w.__memeFrameOn = opts.frame;
    w.__memeVignetteOn = opts.vignette;
    w.__memeLayerFlags = opts.layers;
    w.__memeInkMode = opts.ink;
    w.__memeTextDensity = opts.density;
  }

  function boot() {
    load();
    bind();
  }
  w.CraftMemeOptions = { opts: function () { return opts; }, paint: paint, setSection: setSection };
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(boot, 200); });
})(window, document);
