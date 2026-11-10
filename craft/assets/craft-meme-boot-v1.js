/*! craft-meme-boot-v1 · C19MEME11
 * Default X post canvas 16:9 · restore state on refresh · else auto reminder + matching scene
 * Single paint owner only
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_BOOT_V1__) return;
  w.__CRAFT_MEME_BOOT_V1__ = true;

  var X_W = 1200, X_H = 675; /* X landscape post-friendly */

  function $(id) { return d.getElementById(id); }

  function setCanvasSize(w0, h0) {
    var c = $("meme-canvas") || $("mr-canvas");
    if (!c) return;
    c.width = w0 || X_W;
    c.height = h0 || X_H;
  }

  function markRatioActive(ratio) {
    d.querySelectorAll("#meme-ratio-chips [data-ratio]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-ratio") === ratio);
    });
    var st = $("meme-ratio-status");
    if (st) st.textContent = "Ratio " + ratio + " · X default";
  }

  function loadBgUrl(url, thenPaint) {
    if (!url) return;
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      w.__memeBgImage = img;
      w.__memeBgImg = img;
      w.__memeBgUrl = url;
      if (thenPaint && typeof w.memeDraw === "function") {
        try { w.memeDraw(); } catch (e) {}
      }
      var st = $("meme-fetch-status");
      if (st) st.textContent = "Background restored · educational scenery";
    };
    img.onerror = function () {
      var st = $("meme-fetch-status");
      if (st) st.textContent = "Background restore failed · try Fetch scenery";
    };
    img.src = url;
  }

  function fetchMatchingScene() {
    try {
      if (typeof w.__memeOnlineFetch === "function") {
        w.__memeOnlineFetch(w.__memeSceneKind || "nature");
        return;
      }
      if (typeof w.memeFetchBg === "function") {
        w.memeFetchBg(w.__memeSceneKind || "nature");
        return;
      }
      var btn = $("meme-scene-for-text") || $("meme-surprise-bg");
      if (btn) btn.click();
    } catch (e) {}
  }

  function restoreOrFresh() {
    setCanvasSize(X_W, X_H);
    markRatioActive("16:9");

    var state = null;
    try {
      if (w.CraftMemeSource && w.CraftMemeSource.loadState) state = w.CraftMemeSource.loadState();
      else state = JSON.parse(localStorage.getItem("clarity.craft.meme.state.v1") || "null");
    } catch (e) {}

    if (state && state.layers && (state.layers.ar || state.layers.en)) {
      w.__memeLayers = state.layers;
      if (state.sceneKind) w.__memeSceneKind = state.sceneKind;
      if (state.section) {
        d.querySelectorAll("[data-rrra], [data-meme-section]").forEach(function (b) {
          var id = b.getAttribute("data-rrra") || b.getAttribute("data-meme-section");
          b.classList.toggle("active", id === state.section);
        });
      }
      if (state.text && w.CraftMemeSource && w.CraftMemeSource.applyToDesks) {
        w.CraftMemeSource.applyToDesks(state.text);
      } else if (state.layers) {
        var parts = [];
        if (state.layers.ar) parts.push(state.layers.ar);
        if (state.layers.en) parts.push(state.layers.en);
        if (state.layers.ref) parts.push("(" + state.layers.ref + ")");
        parts.push("— clarity-dawah.fyi · educational only");
        if (w.CraftMemeSource) w.CraftMemeSource.applyToDesks(parts.join("\n"));
      }
      if (state.bgUrl) loadBgUrl(state.bgUrl, true);
      else {
        if (typeof w.memeDraw === "function") try { w.memeDraw(); } catch (e2) {}
        setTimeout(fetchMatchingScene, 500);
      }
      var st = $("meme-source-status");
      if (st) st.textContent = "Restored last session · refresh-safe · educational only";
      return;
    }

    /* Fresh visit: reminder + matching scene */
    w.__memeSceneKind = "nature";
    if (w.CraftMemeSource && w.CraftMemeSource.loadSection) {
      w.CraftMemeSource.loadSection("reminder", true);
    } else if (w.CraftMemeSource && w.CraftMemeSource.fetchSection) {
      var r = w.CraftMemeSource.fetchSection("reminder");
      if (w.CraftMemeSource.applyToDesks) w.CraftMemeSource.applyToDesks(r.text);
      w.__memeLayers = { ar: r.line.ar || "", en: r.line.en || "", ur: "", ref: r.line.ref || "" };
      if (typeof w.memeDraw === "function") try { w.memeDraw(); } catch (e3) {}
    }
    setTimeout(fetchMatchingScene, 600);
    var st2 = $("meme-source-status");
    if (st2) st2.textContent = "Auto · Reminder + scenery · educational only";
  }

  function persistBgHooks() {
    /* when online-bg sets image, remember URL if exposed */
    var prev = w.__memeOnlineFetch;
    if (typeof prev === "function" && !prev._bootWrap) {
      w.__memeOnlineFetch = function (kind) {
        var ret = prev.apply(this, arguments);
        setTimeout(function () {
          try {
            if (w.CraftMemeSource && w.CraftMemeSource.saveState) w.CraftMemeSource.saveState({});
          } catch (e) {}
        }, 1500);
        return ret;
      };
      w.__memeOnlineFetch._bootWrap = true;
    }
  }

  function boot() {
    restoreOrFresh();
    persistBgHooks();
    setTimeout(persistBgHooks, 800);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 300); });
  else setTimeout(boot, 300);
  w.addEventListener("load", function () { setTimeout(boot, 700); });
})(window, document);
