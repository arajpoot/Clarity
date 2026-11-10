/*! craft-meme-options-v1 · C19MEME20
 * Layers · ink · fonts · colors · frame · density
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_OPTIONS_V20__) return;
  w.__CRAFT_MEME_OPTIONS_V20__ = true;

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
    colors: {
      ar: "",
      en: "",
      ur: "",
      ref: ""
    }
  };

  function $(id) { return d.getElementById(id); }

  function load() {
    try {
      var o = JSON.parse(localStorage.getItem(OPT_KEY) || "null");
      if (o) {
        if (o.section) opts.section = o.section;
        if (o.layers) opts.layers = Object.assign(opts.layers, o.layers);
        if (o.ink) opts.ink = o.ink;
        if (typeof o.frame === "boolean") opts.frame = o.frame;
        if (typeof o.vignette === "boolean") opts.vignette = o.vignette;
        if (o.density) opts.density = o.density;
        if (o.fonts) opts.fonts = Object.assign(opts.fonts, o.fonts);
        if (o.colors) opts.colors = Object.assign(opts.colors, o.colors);
      }
    } catch (e) {}
    publish();
  }

  function save() {
    try { localStorage.setItem(OPT_KEY, JSON.stringify(opts)); } catch (e) {}
  }

  function paint() {
    publish();
    if (typeof w.memeDraw === "function") {
      try { w.memeDraw(); } catch (e) {}
    }
  }

  function publish() {
    w.__memeLayerFlags = Object.assign({}, opts.layers);
    w.__memeInkMode = opts.ink;
    w.__memeFrameOn = opts.frame;
    w.__memeVignetteOn = opts.vignette;
    w.__memeTextDensity = opts.density;
    w.__memeFonts = Object.assign({}, opts.fonts);
    w.__memeColors = Object.assign({}, opts.colors);
  }

  function status(msg) {
    var el = $("meme-options-status");
    if (el) el.textContent = msg || "";
  }

  function toggleLayer(key) {
    opts.layers[key] = !opts.layers[key];
    save();
    var b = d.querySelector('[data-layer="' + key + '"]');
    if (b) b.classList.toggle("active", !!opts.layers[key]);
    status("Layer " + key + " · " + (opts.layers[key] ? "on" : "off"));
    paint();
  }

  function setInk(mode) {
    opts.ink = mode || "light";
    save();
    d.querySelectorAll("[data-ink]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-ink") === opts.ink);
    });
    status("Ink · " + opts.ink);
    paint();
  }

  function setDensity(mode) {
    opts.density = mode || "standard";
    save();
    d.querySelectorAll("[data-density]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-density") === opts.density);
    });
    status("Density · " + opts.density);
    paint();
  }

  function setFont(layer, family) {
    if (!opts.fonts) opts.fonts = {};
    opts.fonts[layer] = family;
    save();
    status("Font · " + layer + " · " + family);
    paint();
  }

  function setColor(layer, color) {
    if (!opts.colors) opts.colors = {};
    opts.colors[layer] = color;
    save();
    status("Color · " + layer + " · " + (color || "ink default"));
    paint();
  }

  function injectLookPanel() {
    if ($("meme-look-fonts")) return;
    var host = $("meme-layers-section") || $("meme-scale-host") || d.querySelector(".tool-section");
    var box = d.createElement("div");
    box.id = "meme-look-fonts";
    box.style.cssText = "display:grid;gap:0.55rem;margin-top:0.75rem;max-width:36rem";
    box.innerHTML =
      '<p class="panel-note">Fonts &amp; colors · all layers · saved on this device</p>' +
      '<div class="opt-row" style="display:grid;gap:0.45rem">' +
      layerRow("ar", "Arabic", ["Amiri", "Noto Naskh Arabic", "Scheherazade New", "serif"]) +
      layerRow("en", "English", ["Georgia", "Cormorant Garamond", "Times New Roman", "serif"]) +
      layerRow("ur", "Urdu", ["Noto Nastaliq Urdu", "Noto Naskh Arabic", "Amiri", "serif"]) +
      layerRow("ref", "Reference", ["Georgia", "Quicksand", "system-ui", "serif"]) +
      "</div>";
    var layersSec = $("meme-layers-section");
    if (layersSec) layersSec.appendChild(box);
    else if (host) host.appendChild(box);

    ["ar", "en", "ur", "ref"].forEach(function (layer) {
      var sel = $("meme-font-" + layer);
      if (sel) {
        sel.value = (opts.fonts && opts.fonts[layer]) || sel.value;
        sel.addEventListener("change", function () { setFont(layer, sel.value); });
      }
      var col = $("meme-color-" + layer);
      if (col) {
        if (opts.colors && opts.colors[layer]) col.value = opts.colors[layer];
        col.addEventListener("input", function () { setColor(layer, col.value); });
      }
      var reset = $("meme-color-reset-" + layer);
      if (reset) {
        reset.addEventListener("click", function () {
          if (col) col.value = "#f5e6c8";
          setColor(layer, "");
        });
      }
    });
  }

  function layerRow(id, label, fonts) {
    var optsHtml = fonts.map(function (f) {
      return '<option value="' + f + '">' + f + "</option>";
    }).join("");
    return (
      '<label style="display:grid;grid-template-columns:5.5rem 1fr auto auto;gap:0.4rem;align-items:center;font-size:0.8rem">' +
      "<span>" + label + "</span>" +
      '<select id="meme-font-' + id + '" style="max-width:12rem">' + optsHtml + "</select>" +
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
        save();
        paint();
      });
    }
    var vg = $("meme-opt-vignette");
    if (vg && !vg._optBound) {
      vg._optBound = true;
      vg.checked = !!opts.vignette;
      vg.addEventListener("change", function () {
        opts.vignette = !!vg.checked;
        save();
        paint();
      });
    }
    injectLookPanel();
    publish();
  }

  function boot() {
    load();
    bind();
    setTimeout(bind, 400);
  }

  w.CraftMemeOptions = {
    opts: function () { return opts; },
    paint: paint,
    setFont: setFont,
    setColor: setColor,
    setInk: setInk
  };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
