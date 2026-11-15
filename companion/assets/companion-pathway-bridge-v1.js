/*! companion-pathway-bridge-v1
 * Load pre-shell pathway packs when a tab mounts (shell form-factor)
 * Restores meme/callig/tajweed engines for Daily + Daʿi richness
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_PATHWAY_BRIDGE_V1__) return;
  w.__COMPANION_PATHWAY_BRIDGE_V1__ = true;

  var PACK = {
    reminder: "/companion/assets/pathways/reminder/pack-v1.js",
    reality: "/companion/assets/pathways/reality/pack-v1.js",
    reflection: "/companion/assets/pathways/reflection/pack-v1.js",
    action: "/companion/assets/pathways/action/pack-v1.js"
  };
  var loaded = {};
  var V = "20261114CW1";

  function loadPack(id) {
    if (!PACK[id]) return Promise.resolve(null);
    if (loaded[id]) return loaded[id];
    loaded[id] = new Promise(function (resolve) {
      var s = d.createElement("script");
      s.src = PACK[id] + (PACK[id].indexOf("?") >= 0 ? "&" : "?") + "v=" + V;
      s.async = true;
      s.setAttribute("data-pathway-bridge", id);
      s.onload = function () {
        resolve(id);
        setTimeout(function () {
          try {
            d.dispatchEvent(new CustomEvent("clarity-companion-pathway-ready", { detail: { id: id } }));
          } catch (e) {}
          fixStages();
        }, 120);
        setTimeout(fixStages, 600);
      };
      s.onerror = function () {
        resolve(null);
        fixStages();
      };
      d.body.appendChild(s);
    });
    return loaded[id];
  }

  function fixStages() {
    var root = d.getElementById("cs-mount") || d;
    /* Meme stage */
    root.querySelectorAll("#meme-studio-root, .meme-studio, #meme-stage-wrap, .meme-stage-wrap").forEach(function (el) {
      el.style.minHeight = el.id === "meme-studio-root" || el.classList.contains("meme-studio") ? "280px" : "220px";
      el.style.width = "100%";
      el.style.maxWidth = "100%";
      el.style.display = "block";
      el.style.boxSizing = "border-box";
    });
    root.querySelectorAll("#meme-studio-root canvas, .meme-stage canvas, canvas[id*='meme']").forEach(function (c) {
      c.style.width = "100%";
      c.style.maxWidth = "100%";
      c.style.minHeight = "220px";
      c.style.display = "block";
      c.style.background = "rgba(0,0,0,0.35)";
      c.style.borderRadius = "12px";
      try {
        if (!c.getAttribute("width")) c.setAttribute("width", "900");
        if (!c.getAttribute("height")) c.setAttribute("height", "500");
      } catch (e) {}
    });
    /* Calligraphy */
    root.querySelectorAll("#callig-stage-wrap, .callig-stage-wrap, .callig-lab-stage").forEach(function (el) {
      el.style.minHeight = "240px";
      el.style.width = "100%";
      el.style.display = "block";
      el.style.position = "relative";
      el.style.background = "rgba(0,0,0,0.28)";
      el.style.borderRadius = "12px";
      el.style.border = "1px solid rgba(201,162,39,0.3)";
    });
    root.querySelectorAll("#callig-canvas, canvas[id*='callig']").forEach(function (c) {
      c.style.width = "100%";
      c.style.maxWidth = "100%";
      c.style.minHeight = "220px";
      c.style.display = "block";
      c.style.touchAction = "none";
    });
    /* Tajweed deep studio frames */
    root.querySelectorAll("#tj-deep-studio, .tj-deep-studio, [id*='tajweed'] canvas").forEach(function (el) {
      el.style.minHeight = el.tagName === "CANVAS" ? "180px" : "200px";
      el.style.width = "100%";
      el.style.maxWidth = "100%";
    });
    /* Full width cards */
    root.querySelectorAll(".cs-rich-legacy .card, .cs-rich-legacy [id$='-card']").forEach(function (el) {
      el.style.maxWidth = "none";
      el.style.width = "100%";
      el.style.boxSizing = "border-box";
    });
  }

  function onMount() {
    var mount = d.getElementById("cs-mount");
    if (!mount) return;
    var node = mount.querySelector("[data-cs-mounted]");
    var tab = node ? node.getAttribute("data-cs-mounted") : null;
    if (tab && PACK[tab]) loadPack(tab);
    fixStages();
  }

  function watch() {
    var mount = d.getElementById("cs-mount");
    if (!mount) return;
    var t = null;
    new MutationObserver(function () {
      if (t) clearTimeout(t);
      t = setTimeout(onMount, 50);
    }).observe(mount, { childList: true });
    onMount();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", watch);
  else watch();
  w.ClarityPathwayBridge = { loadPack: loadPack, fixStages: fixStages };
})(window, document);
