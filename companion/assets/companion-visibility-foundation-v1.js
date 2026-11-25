/*! §3A Visibility foundation runtime · educational only — not a fatwa */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_VISIBILITY_FOUNDATION_V1__) return;
  w.__COMPANION_VISIBILITY_FOUNDATION_V1__ = true;

  function unhideChain(el) {
    var n = 0;
    while (el && el !== d.body && n < 12) {
      if (el.nodeType === 1) {
        if (el.tagName === "DETAILS") el.open = true;
        var cs = w.getComputedStyle(el);
        if (cs.display === "none") el.style.setProperty("display", "block", "important");
        if (cs.visibility === "hidden") el.style.setProperty("visibility", "visible", "important");
        if (parseFloat(cs.opacity || "1") < 0.05) el.style.setProperty("opacity", "1", "important");
      }
      el = el.parentElement;
      n++;
    }
  }

  function fixMeme(root) {
    root = root || d.getElementById("cs-mount") || d;
    var stage = root.querySelector("#meme-stage, .meme-stage, [data-meme-stage]");
    var canvas = root.querySelector("#meme-canvas");
    var card = root.querySelector("#meme-card, #companion-meme-studio, [data-meme-host], .meme-card");
    if (card) unhideChain(card);
    if (stage) {
      unhideChain(stage);
      stage.style.setProperty("display", "block", "important");
      stage.style.setProperty("width", "100%", "important");
      stage.style.setProperty("min-height", "240px", "important");
    }
    if (canvas) {
      unhideChain(canvas);
      canvas.style.setProperty("display", "block", "important");
      canvas.style.setProperty("width", "100%", "important");
      canvas.style.setProperty("min-height", "220px", "important");
      if (!canvas.width || canvas.width < 8) canvas.width = 720;
      if (!canvas.height || canvas.height < 8) canvas.height = 404;
      try {
        if (w.ClarityMemePaintV2 && w.ClarityMemePaintV2.paint) w.ClarityMemePaintV2.paint();
        else if (typeof w.paintMeme === "function") w.paintMeme();
      } catch (e) {}
    }
  }

  function fixReflectionMedia(root) {
    root = root || d.getElementById("cs-mount") || d;
    var media = root.querySelector("#reflection-media-restored");
    if (!media) return;
    unhideChain(media);
    media.style.setProperty("display", "block", "important");
    media.querySelectorAll("details").forEach(function (det) {
      det.open = true;
      unhideChain(det);
    });
    media.querySelectorAll("iframe").forEach(function (f) {
      unhideChain(f);
      var ds = f.getAttribute("data-src");
      if (ds && (!f.getAttribute("src") || f.getAttribute("src") === "about:blank")) {
        f.setAttribute("src", ds);
      }
      f.style.setProperty("display", "block", "important");
      f.style.setProperty("width", "100%", "important");
      f.style.setProperty("min-height", "240px", "important");
      f.style.setProperty("height", "240px", "important");
      f.style.setProperty("visibility", "visible", "important");
      f.style.setProperty("opacity", "1", "important");
    });
  }

  function fixDeep(root) {
    root = root || d.getElementById("cs-mount") || d;
    var deep = root.querySelector("#r7-r8-enrichment, .cs-r7-r8");
    if (!deep) return;
    unhideChain(deep);
    deep.querySelectorAll("iframe").forEach(function (f) {
      var ds = f.getAttribute("data-src");
      if (ds && (!f.src || f.src.indexOf("about:blank") >= 0)) f.src = ds;
      f.style.setProperty("display", "block", "important");
      f.style.setProperty("min-height", "220px", "important");
      f.style.setProperty("width", "100%", "important");
    });
  }

  function fixHeroLadder(root) {
    root = root || d.getElementById("cs-mount") || d;
    root.querySelectorAll(".cs-tab-hero, [data-visual-hero], .cs-ladder-g2, [data-g2-ladder]").forEach(function (el) {
      unhideChain(el);
      el.style.setProperty("display", "block", "important");
      el.style.setProperty("visibility", "visible", "important");
    });
  }

  function run() {
    var root = d.getElementById("cs-mount") || d;
    fixHeroLadder(root);
    fixMeme(root);
    fixReflectionMedia(root);
    fixDeep(root);
  }

  function boot() {
    run();
    d.addEventListener("clarity:tab-mounted", function () {
      setTimeout(run, 40);
      setTimeout(run, 200);
    });
    var m = d.getElementById("cs-mount");
    if (m && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(run, 50);
      }).observe(m, { childList: true, subtree: true });
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityVisibilityFoundation = { run: run, version: "V1-§3A" };
})(window, document);
