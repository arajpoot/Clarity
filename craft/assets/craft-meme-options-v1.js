/*! craft-meme-options-v1 · C19MEME24
 * Layers removed — text always paints when content exists
 * Contrast is auto from background (see paint-standard)
 * Frame / vignette / density / fonts only
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_OPTIONS_V24__) return;
  w.__CRAFT_MEME_OPTIONS_V24__ = true;

  var OPT_KEY = "clarity.craft.meme.opts.v1";
  var opts = {
    frame: true,
    vignette: true,
    density: "standard",
    fonts: { ar: "Amiri", en: "Georgia", ur: "Noto Nastaliq Urdu", ref: "Georgia" },
    /* force all layers on — no toggle */
    autoContrast: true
  };

  function $(id) { return d.getElementById(id); }

  function load() {
    try {
      var o = JSON.parse(localStorage.getItem(OPT_KEY) || "null");
      if (!o) return;
      if (typeof o.frame === "boolean") opts.frame = o.frame;
      if (typeof o.vignette === "boolean") opts.vignette = o.vignette;
      if (o.density) opts.density = o.density;
      if (o.fonts) opts.fonts = Object.assign(opts.fonts, o.fonts);
    } catch (e) {}
  }

  function save() {
    try { localStorage.setItem(OPT_KEY, JSON.stringify(opts)); } catch (e) {}
  }

  function publish() {
    /* always show all text layers when content exists */
    w.__memeLayerFlags = { ar: true, en: true, ur: true, ref: true };
    w.__memeFrameOn = opts.frame !== false;
    w.__memeVignetteOn = opts.vignette !== false;
    w.__memeTextDensity = opts.density || "standard";
    w.__memeFonts = Object.assign({
      ar: "Amiri", en: "Georgia", ur: "Noto Nastaliq Urdu", ref: "Georgia"
    }, opts.fonts || {});
    w.__memeAutoContrast = true;
    w.__memeInkMode = "auto"; /* paint resolves from bg */
    w.__memeColors = { ar: "", en: "", ur: "", ref: "" }; /* auto owns color */
  }

  function paint() {
    publish();
    save();
    try {
      if (typeof w.craftMemeRepaintStandard === "function") w.craftMemeRepaintStandard();
      else if (typeof w.memeDraw === "function") {
        if (w.memeDraw._origDraw) w.memeDraw._origDraw();
        else w.memeDraw();
      }
    } catch (e) {}
  }

  function status(msg) {
    var el = $("meme-options-status") || $("meme-source-status");
    if (el) el.textContent = msg || "";
  }

  function stripLayerChips() {
    d.querySelectorAll("[data-layer]").forEach(function (b) {
      b.style.display = "none";
    });
    d.querySelectorAll("[data-ink]").forEach(function (b) {
      b.style.display = "none";
    });
    /* hide color pickers if present */
    var look = $("meme-look-fonts");
    if (look) {
      look.querySelectorAll('input[type="color"]').forEach(function (el) {
        el.style.display = "none";
      });
      look.querySelectorAll('[id^="meme-color-reset"]').forEach(function (el) {
        el.style.display = "none";
      });
    }
    var note = d.querySelector("#meme-layers-section .panel-note");
    if (note && !note.dataset.autoNote) {
      note.dataset.autoNote = "1";
      note.textContent =
        "Text contrast is automatic from the background (darker or lighter). All verse lines paint when present.";
    }
  }

  function injectAutoNote() {
    var host = $("meme-layers-section");
    if (!host || $("meme-auto-contrast-note")) return;
    var p = d.createElement("p");
    p.id = "meme-auto-contrast-note";
    p.className = "panel-note";
    p.innerHTML =
      "<strong>Auto contrast</strong> · text uses a black→soft gradient on light scenes and cream/gold on dark scenes · linked to background · layers always on";
    host.insertBefore(p, host.firstChild.nextSibling);
  }

  function bind() {
    stripLayerChips();
    injectAutoNote();
    d.querySelectorAll("[data-density]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-density") === opts.density);
      b.onclick = function () {
        opts.density = b.getAttribute("data-density") || "standard";
        d.querySelectorAll("[data-density]").forEach(function (x) {
          x.classList.toggle("active", x.getAttribute("data-density") === opts.density);
        });
        status("Density · " + opts.density);
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
    /* fonts still useful */
    ["ar", "en", "ur", "ref"].forEach(function (layer) {
      var sel = $("meme-font-" + layer);
      if (sel) {
        if (opts.fonts[layer]) sel.value = opts.fonts[layer];
        sel.onchange = function () {
          opts.fonts[layer] = sel.value;
          paint();
        };
      }
    });
    var ap = $("meme-apply-look");
    if (ap) ap.onclick = function () { paint(); status("Look applied · auto contrast"); };
    publish();
  }

  function boot() {
    load();
    bind();
    setTimeout(bind, 300);
    setTimeout(paint, 600);
  }

  w.CraftMemeOptions = { opts: function () { return opts; }, paint: paint, publish: publish };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
