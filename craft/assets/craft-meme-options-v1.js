/*! craft-meme-options-v1 · C19MEME22
 * Layers · ink · density · fonts · colors — all wired to canvas
 * Apply Look forces publish + paint
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_OPTIONS_V22__) return;
  w.__CRAFT_MEME_OPTIONS_V22__ = true;

  var OPT_KEY = "clarity.craft.meme.opts.v1";
  var opts = {
    section: "reminder",
    layers: { ar: true, en: true, ur: true, ref: true },
    ink: "light",
    frame: true,
    vignette: true,
    density: "standard",
    fonts: {
      ar: "Amiri",
      en: "Georgia",
      ur: "Noto Nastaliq Urdu",
      ref: "Georgia"
    },
    colors: { ar: "", en: "", ur: "", ref: "" }
  };

  function $(id) { return d.getElementById(id); }

  function load() {
    try {
      var o = JSON.parse(localStorage.getItem(OPT_KEY) || "null");
      if (o) {
        if (o.layers) opts.layers = Object.assign(opts.layers, o.layers);
        if (o.ink) opts.ink = o.ink;
        if (typeof o.frame === "boolean") opts.frame = o.frame;
        if (typeof o.vignette === "boolean") opts.vignette = o.vignette;
        if (o.density) opts.density = o.density;
        if (o.fonts) opts.fonts = Object.assign(opts.fonts, o.fonts);
        if (o.colors) opts.colors = Object.assign(opts.colors, o.colors);
      }
    } catch (e) {}
  }

  function save() {
    try { localStorage.setItem(OPT_KEY, JSON.stringify(opts)); } catch (e) {}
  }

  function publish() {
    w.__memeLayerFlags = {
      ar: !!opts.layers.ar,
      en: !!opts.layers.en,
      ur: !!opts.layers.ur,
      ref: !!opts.layers.ref
    };
    w.__memeInkMode = opts.ink || "light";
    w.__memeFrameOn = opts.frame !== false;
    w.__memeVignetteOn = opts.vignette !== false;
    w.__memeTextDensity = opts.density || "standard";
    w.__memeFonts = {
      ar: (opts.fonts && opts.fonts.ar) || "Amiri",
      en: (opts.fonts && opts.fonts.en) || "Georgia",
      ur: (opts.fonts && opts.fonts.ur) || "Noto Nastaliq Urdu",
      ref: (opts.fonts && opts.fonts.ref) || "Georgia"
    };
    w.__memeColors = {
      ar: (opts.colors && opts.colors.ar) || "",
      en: (opts.colors && opts.colors.en) || "",
      ur: (opts.colors && opts.colors.ur) || "",
      ref: (opts.colors && opts.colors.ref) || ""
    };
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

  function applyLook() {
    /* read current control values then paint */
    ["ar", "en", "ur", "ref"].forEach(function (layer) {
      var sel = $("meme-font-" + layer);
      if (sel && sel.value) opts.fonts[layer] = sel.value;
      var col = $("meme-color-" + layer);
      if (col && col.value) {
        /* only store if user moved from pure default handling — always store picker value when Apply */
        opts.colors[layer] = col.value;
      }
    });
    var fr = $("meme-opt-frame");
    if (fr) opts.frame = !!fr.checked;
    var vg = $("meme-opt-vignette");
    if (vg) opts.vignette = !!vg.checked;
    paint();
    status("Look applied · fonts/colors/layers on canvas");
  }

  function status(msg) {
    var el = $("meme-options-status") || $("meme-source-status");
    if (el) el.textContent = msg || "";
  }

  function toggleLayer(key) {
    opts.layers[key] = !opts.layers[key];
    var b = d.querySelector('[data-layer="' + key + '"]');
    if (b) b.classList.toggle("active", !!opts.layers[key]);
    status("Layer " + key + " · " + (opts.layers[key] ? "on" : "off"));
    paint();
  }

  function setInk(mode) {
    opts.ink = mode || "light";
    d.querySelectorAll("[data-ink]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-ink") === opts.ink);
    });
    /* clearing custom colors lets ink mode drive defaults */
    status("Ink · " + opts.ink);
    paint();
  }

  function setDensity(mode) {
    opts.density = mode || "standard";
    d.querySelectorAll("[data-density]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-density") === opts.density);
    });
    status("Density · " + opts.density);
    paint();
  }

  function setFont(layer, family) {
    if (!opts.fonts) opts.fonts = {};
    opts.fonts[layer] = family;
    status("Font · " + layer + " · " + family);
    paint();
  }

  function setColor(layer, color) {
    if (!opts.colors) opts.colors = {};
    opts.colors[layer] = color || "";
    status("Color · " + layer);
    paint();
  }

  function injectLookPanel() {
    var host = $("meme-layers-section");
    if (!host) return;
    if (!$("meme-look-fonts")) {
      var box = d.createElement("div");
      box.id = "meme-look-fonts";
      box.style.cssText = "display:grid;gap:0.55rem;margin-top:0.75rem;max-width:36rem";
      box.innerHTML =
        '<p class="panel-note">Fonts &amp; colors · all layers · saved on this device</p>' +
        '<div style="display:grid;gap:0.45rem">' +
        row("ar", "Arabic", ["Amiri", "Noto Naskh Arabic", "Scheherazade New", "serif"]) +
        row("en", "English", ["Georgia", "Cormorant Garamond", "Times New Roman", "serif"]) +
        row("ur", "Urdu", ["Noto Nastaliq Urdu", "Noto Naskh Arabic", "Amiri", "serif"]) +
        row("ref", "Reference", ["Georgia", "Quicksand", "system-ui", "serif"]) +
        "</div>" +
        '<div class="wire-actions" style="margin-top:0.5rem">' +
        '<button type="button" class="btn primary" id="meme-apply-look">Apply look</button>' +
        '<button type="button" class="btn" id="meme-reset-look">Reset look</button>' +
        "</div>" +
        '<p class="panel-note" id="meme-options-status" aria-live="polite"></p>';
      host.appendChild(box);
    }
    ["ar", "en", "ur", "ref"].forEach(function (layer) {
      var sel = $("meme-font-" + layer);
      if (sel) {
        if (opts.fonts[layer]) sel.value = opts.fonts[layer];
        if (!sel._bound) {
          sel._bound = true;
          sel.addEventListener("change", function () { setFont(layer, sel.value); });
        }
      }
      var col = $("meme-color-" + layer);
      if (col) {
        if (opts.colors[layer]) col.value = opts.colors[layer];
        if (!col._bound) {
          col._bound = true;
          col.addEventListener("input", function () { setColor(layer, col.value); });
          col.addEventListener("change", function () { setColor(layer, col.value); });
        }
      }
      var reset = $("meme-color-reset-" + layer);
      if (reset && !reset._bound) {
        reset._bound = true;
        reset.addEventListener("click", function () {
          if (col) col.value = "#f5e6c8";
          setColor(layer, "");
        });
      }
    });
    var ap = $("meme-apply-look");
    if (ap && !ap._bound) {
      ap._bound = true;
      ap.addEventListener("click", applyLook);
    }
    var rs = $("meme-reset-look");
    if (rs && !rs._bound) {
      rs._bound = true;
      rs.addEventListener("click", function () {
        opts.fonts = { ar: "Amiri", en: "Georgia", ur: "Noto Nastaliq Urdu", ref: "Georgia" };
        opts.colors = { ar: "", en: "", ur: "", ref: "" };
        opts.ink = "light";
        opts.density = "standard";
        ["ar", "en", "ur", "ref"].forEach(function (layer) {
          var sel = $("meme-font-" + layer);
          if (sel) sel.value = opts.fonts[layer];
          var col = $("meme-color-" + layer);
          if (col) col.value = "#f5e6c8";
        });
        d.querySelectorAll("[data-ink]").forEach(function (b) {
          b.classList.toggle("active", b.getAttribute("data-ink") === "light");
        });
        paint();
        status("Look reset · light ink defaults");
      });
    }
  }

  function row(id, label, fonts) {
    var optsHtml = fonts.map(function (f) {
      return '<option value="' + f + '">' + f + "</option>";
    }).join("");
    return (
      '<label style="display:grid;grid-template-columns:5.5rem 1fr auto auto;gap:0.4rem;align-items:center;font-size:0.8rem">' +
      "<span>" + label + "</span>" +
      '<select id="meme-font-' + id + '">' + optsHtml + "</select>" +
      '<input type="color" id="meme-color-' + id + '" value="#f5e6c8" title="Text color" style="width:2rem;height:1.6rem;border:none;background:transparent;cursor:pointer"/>' +
      '<button type="button" class="btn" id="meme-color-reset-' + id + '" style="font-size:0.7rem;padding:0.15rem 0.4rem">Ink</button>' +
      "</label>"
    );
  }

  function bind() {
    d.querySelectorAll("[data-layer]").forEach(function (b) {
      if (b._optBound) return;
      b._optBound = true;
      var k = b.getAttribute("data-layer");
      b.classList.toggle("active", !!opts.layers[k]);
      b.addEventListener("click", function () { toggleLayer(k); });
    });
    d.querySelectorAll("[data-ink]").forEach(function (b) {
      if (b._optBound) return;
      b._optBound = true;
      b.classList.toggle("active", b.getAttribute("data-ink") === opts.ink);
      b.addEventListener("click", function () { setInk(b.getAttribute("data-ink")); });
    });
    d.querySelectorAll("[data-density]").forEach(function (b) {
      if (b._optBound) return;
      b._optBound = true;
      b.classList.toggle("active", b.getAttribute("data-density") === opts.density);
      b.addEventListener("click", function () { setDensity(b.getAttribute("data-density")); });
    });
    var fr = $("meme-opt-frame");
    if (fr && !fr._optBound) {
      fr._optBound = true;
      fr.checked = !!opts.frame;
      fr.addEventListener("change", function () {
        opts.frame = !!fr.checked;
        paint();
      });
    }
    var vg = $("meme-opt-vignette");
    if (vg && !vg._optBound) {
      vg._optBound = true;
      vg.checked = !!opts.vignette;
      vg.addEventListener("change", function () {
        opts.vignette = !!vg.checked;
        paint();
      });
    }
    injectLookPanel();
    publish();
  }

  function boot() {
    load();
    bind();
    setTimeout(bind, 300);
    setTimeout(publish, 500);
  }

  w.CraftMemeOptions = {
    opts: function () { return opts; },
    paint: paint,
    applyLook: applyLook,
    setFont: setFont,
    setColor: setColor,
    setInk: setInk,
    publish: publish
  };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
