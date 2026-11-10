/*! craft-meme-boot-v1 · C19MEME16-CLEAN
 * Single orchestrator — no competing wires
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_BOOT_CLEAN__) return;
  w.__CRAFT_MEME_BOOT_CLEAN__ = true;

  var STATE = "clarity.craft.meme.state.v1";

  function $(id) { return d.getElementById(id); }

  function loadState() {
    try { return JSON.parse(localStorage.getItem(STATE) || "null") || {}; }
    catch (e) { return {}; }
  }
  function saveState(patch) {
    try {
      var s = Object.assign(loadState(), patch || {});
      localStorage.setItem(STATE, JSON.stringify(s));
    } catch (e) {}
  }

  function paint() {
    if (typeof w.memeDraw === "function") {
      try { w.memeDraw(); } catch (e) {}
    }
  }

  function setCanvasRatio(ratio) {
    var c = $("meme-canvas") || $("mr-canvas");
    if (!c) return;
    var parts = String(ratio || "16:9").split(":");
    var a = +parts[0] || 16, b = +parts[1] || 9;
    c.width = 1200;
    c.height = Math.max(400, Math.round(1200 * b / a));
    saveState({ ratio: a + ":" + b });
    paint();
  }

  function loadSection(sec) {
    sec = sec || "reminder";
    if (w.CraftMemeSource && typeof w.CraftMemeSource.loadSection === "function") {
      w.CraftMemeSource.loadSection(sec, true);
    }
    if (w.CraftMemeUrduFetch) {
      try { w.CraftMemeUrduFetch.loadForCurrentLayers(true); } catch (e) {}
    } else paint();
  }

  function fetchScene(kind) {
    kind = kind || w.__memeSceneKind || "nature";
    w.__memeSceneKind = kind;
    try {
      if (typeof w.__memeOnlineFetch === "function") w.__memeOnlineFetch(kind);
      else if (typeof w.memeFetchBg === "function") w.memeFetchBg(kind);
      else if (typeof w.memeFetchNature === "function") w.memeFetchNature();
    } catch (e) {}
  }

  function bindOnce(el, key, fn) {
    if (!el || el[key]) return;
    el[key] = true;
    el.addEventListener("click", fn);
  }

  function bind() {
    d.querySelectorAll("[data-meme-section], [data-rrra]").forEach(function (btn) {
      bindOnce(btn, "_cleanSec", function () {
        d.querySelectorAll("[data-meme-section], [data-rrra]").forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        var sec = btn.getAttribute("data-meme-section") || btn.getAttribute("data-rrra") || "reminder";
        loadSection(sec);
      });
    });

    d.querySelectorAll("#meme-scene-chips [data-scene]").forEach(function (btn) {
      bindOnce(btn, "_cleanScene", function () {
        d.querySelectorAll("#meme-scene-chips [data-scene]").forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        w.__memeSceneKind = btn.getAttribute("data-scene") || "nature";
      });
    });

    d.querySelectorAll("#meme-ratio-chips [data-ratio]").forEach(function (btn) {
      bindOnce(btn, "_cleanRatio", function () {
        d.querySelectorAll("#meme-ratio-chips [data-ratio]").forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        setCanvasRatio(btn.getAttribute("data-ratio"));
      });
    });

    bindOnce($("meme-daily-pack"), "_c", function () { loadSection("reminder"); setTimeout(function () { fetchScene("nature"); }, 400); });
    bindOnce($("meme-refresh-source"), "_c", function () {
      var a = d.querySelector("[data-meme-section].active, [data-rrra].active");
      loadSection(a ? (a.getAttribute("data-meme-section") || a.getAttribute("data-rrra")) : "reminder");
    });
    bindOnce($("meme-full-surprise"), "_c", function () {
      loadSection("reminder");
      setTimeout(function () { fetchScene(w.__memeSceneKind || "nature"); }, 400);
    });
    bindOnce($("meme-surprise-verse-only"), "_c", function () { loadSection("reminder"); });
    bindOnce($("meme-surprise-scene-only"), "_c", function () { fetchScene(w.__memeSceneKind || "nature"); });
    bindOnce($("meme-surprise-bg"), "_c", function () { fetchScene(w.__memeSceneKind || "nature"); });
    bindOnce($("meme-next-bg"), "_c", function () { fetchScene(w.__memeSceneKind || "nature"); });
    bindOnce($("meme-scene-for-text"), "_c", function () { fetchScene(w.__memeSceneKind || "nature"); });
    bindOnce($("meme-wire-preview"), "_c", function () { paint(); });
    bindOnce($("meme-fill-desks"), "_c", function () {
      if (w.CraftMemeSource && w.__memeLayers) {
        var L = w.__memeLayers;
        var parts = [L.ar, L.en, L.ref && "(" + L.ref + ")", "— clarity-dawah.fyi · educational only"].filter(Boolean);
        w.CraftMemeSource.applyToDesks(parts.join("\n"));
      }
    });
    bindOnce($("meme-push-desks"), "_c", function () {
      if ($("meme-fill-desks")) $("meme-fill-desks").click();
    });
  }

  function boot() {
    setCanvasRatio((loadState().ratio) || "16:9");
    bind();
    var st = loadState();
    if (st.layers && st.layers.ar) {
      w.__memeLayers = st.layers;
      if (w.CraftMemeUrduFetch) w.CraftMemeUrduFetch.loadForCurrentLayers(true);
      else paint();
    } else {
      loadSection("reminder");
      setTimeout(function () { fetchScene("nature"); }, 500);
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(bind, 300); });
})(window, document);
