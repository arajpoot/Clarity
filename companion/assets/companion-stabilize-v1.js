/*! companion-stabilize-v1 · one layout pass · meme bg rewire · no jump loop */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_STABILIZE_V1__) return;
  w.__CLARITY_STABILIZE_V1__ = true;

  var LOG = (w.__STABILIZE_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  function layoutOnce() {
    var ov = d.querySelector(".banner-overlay");
    if (!ov) return;
    var left = ov.querySelector(".banner-side.left");
    var center = ov.querySelector(".banner-center");
    var right = ov.querySelector(".banner-side.right");
    var salah = ov.querySelector(".salah-times-section");
    var cal = ov.querySelector(".hijri-cal-section");
    if (salah && right && salah.parentElement !== right) right.appendChild(salah);
    if (cal && left && cal.parentElement !== left) left.appendChild(cal);
    if (left && center && right) {
      ov.appendChild(left);
      ov.appendChild(center);
      ov.appendChild(right);
    }
    log("layout-once");
  }

  /* Ensure meme online bg is available and not clobbered */
  function ensureMemeBg() {
    function injectOnlineBg() {
      if (w.__CLARITY_MEME_ONLINE_BG_V2__) {
        log("meme-bg-already");
        return;
      }
      if (d.querySelector('script[data-meme-online-bg]')) return;
      var s = d.createElement("script");
      s.src = "/companion/modules/inline-clarity-meme-online-bg-v1.js?v=20261104STAB";
      s.async = true;
      s.setAttribute("data-meme-online-bg", "1");
      s.onload = function () {
        log("meme-bg-loaded");
        rebindFetch();
      };
      s.onerror = function () { log("meme-bg-fail"); };
      d.head.appendChild(s);
    }

    function rebindFetch() {
      /* Prefer online implementation */
      if (typeof w.__memeOnlineFetch === "function") {
        w.memeFetchBg = w.__memeOnlineFetch;
        log("memeFetchBg=online");
      }
      /* Fallbacks if still missing */
      if (typeof w.memeFetchBg !== "function") {
        w.memeFetchBg = function (kind) {
          kind = kind || "nature";
          var seed = "clarity-" + kind + "-" + Date.now();
          var url = "https://picsum.photos/seed/" + encodeURIComponent(seed) + "/1200/900.jpg";
          var st = d.getElementById("meme-fetch-status");
          if (st) st.textContent = "Loading…";
          if (typeof w.memeLoadImageFromUrl === "function") {
            w.memeLoadImageFromUrl(url, "Could not load");
            if (st) st.textContent = "Background ready";
            return;
          }
          var im = new Image();
          im.crossOrigin = "anonymous";
          im.onload = function () {
            try {
              if (!w.memeState) w.memeState = {};
              w.memeState.img = im;
              if (typeof w.memeDraw === "function") w.memeDraw();
              else if (typeof w.clarityMemeUiSync === "function") w.clarityMemeUiSync();
            } catch (e) {}
            if (st) st.textContent = "Background ready";
          };
          im.onerror = function () {
            if (st) st.textContent = "Load failed — try another";
          };
          im.src = url;
        };
        log("memeFetchBg=picsum-fallback");
      }
      /* canvas viewport: set size from stage */
      try {
        var stage = d.getElementById("meme-stage");
        var canvas = d.getElementById("meme-canvas");
        if (stage && canvas) {
          var w0 = Math.max(320, Math.floor(stage.clientWidth || 600));
          if (w0 > 0 && canvas.width < 100) {
            canvas.width = 1200;
            canvas.height = 675;
          }
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          log("canvas-sized");
        }
      } catch (e2) {
        log("canvas " + e2);
      }
    }

    injectOnlineBg();
    rebindFetch();
    /* after A2 spine may overwrite */
    w.addEventListener("clarity-a2-spine-ready", function () {
      setTimeout(rebindFetch, 50);
      setTimeout(rebindFetch, 400);
    });
    setTimeout(rebindFetch, 1200);
  }

  function boot() {
    layoutOnce();
    ensureMemeBg();
    /* single delayed re-assert after packs settle — not a loop */
    setTimeout(function () {
      layoutOnce();
      ensureMemeBg();
    }, 900);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
