/*! companion-unity-v2 · rails cleanup · salah right · meme bg · notes */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_UNITY_V2__) return;
  w.__CLARITY_UNITY_V2__ = true;
  var LOG = (w.__UNITY_LOG = w.__UNITY_LOG || []);
  function log(m) { try { LOG.push("v2:" + m); } catch (e) {} }

  function killSurfaceDoors() {
    var el = d.getElementById("clarity-surface-doors");
    if (el && el.parentNode) el.parentNode.removeChild(el);
    d.querySelectorAll(".clarity-surface-doors").forEach(function (n) {
      try { n.parentNode.removeChild(n); } catch (e) {}
    });
    /* second room-nav only */
    var navs = d.querySelectorAll("nav.clarity-room-nav");
    if (navs.length > 1) {
      for (var i = 1; i < navs.length; i++) {
        try { navs[i].parentNode.removeChild(navs[i]); } catch (e) {}
      }
    }
    log("rails-clean");
  }

  function layoutBanner() {
    var ov = d.querySelector(".banner-overlay");
    if (!ov) return;
    var left = ov.querySelector(".banner-side.left");
    var center = ov.querySelector(".banner-center");
    var right = ov.querySelector(".banner-side.right");
    if (!right) {
      right = d.createElement("div");
      right.className = "banner-side right";
      ov.appendChild(right);
    }
    var salah = ov.querySelector(".salah-times-section") || d.querySelector(".salah-times-section");
    var cal = ov.querySelector(".hijri-cal-section");
    if (salah) right.appendChild(salah);
    if (cal && left) left.appendChild(cal);
    if (left) ov.appendChild(left);
    if (center) ov.appendChild(center);
    ov.appendChild(right);
    log("salah-right");
  }

  function picsum(kind) {
    return "https://picsum.photos/seed/c-" + (kind || "nature") + "-" + (Date.now() % 9999) + "/1200/900.jpg";
  }
  function status(msg) {
    var el = d.getElementById("meme-fetch-status") || d.getElementById("meme-rrra-status");
    if (el) el.textContent = msg || "";
  }
  function loadBg(url) {
    status("Loading…");
    if (typeof w.memeLoadImageFromUrl === "function") {
      try { w.memeLoadImageFromUrl(url); status("Background ready"); return; } catch (e) {}
    }
    var im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = function () {
      try {
        if (!w.memeState) w.memeState = {};
        w.memeState.img = im;
        if (typeof w.memeDraw === "function") w.memeDraw();
        if (typeof w.clarityMemeUiSync === "function") w.clarityMemeUiSync();
      } catch (e) {}
      status("Background ready");
    };
    im.onerror = function () { status("Load failed — try another"); };
    im.src = url;
  }
  w.memeFetchBg = function (kind) {
    if (typeof w.__memeOnlineFetch === "function") {
      try { return w.__memeOnlineFetch(kind); } catch (e) {}
    }
    loadBg(picsum(kind || "nature"));
  };
  if (typeof w.memeDailyVerse !== "function") {
    w.memeDailyVerse = function () {
      var lines = [
        { ar: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", en: "Every soul will taste death.", ref: "Qur'an 3:185" },
        { ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", en: "Verily, in the remembrance of Allah do hearts find rest.", ref: "Qur'an 13:28" }
      ];
      var line = lines[Math.floor(Math.random() * lines.length)];
      if (typeof w.clarityMemeFill === "function") w.clarityMemeFill(line.ar, line.en, line.ref);
      else if (typeof w.clarityMemeSetCanvas === "function") w.clarityMemeSetCanvas(line.ar, line.en, "", line.ref);
      w.memeFetchBg("holy");
      status((line.ref) + " · applied");
    };
  }

  function loadMemeBgModule() {
    if (w.__CLARITY_MEME_ONLINE_BG_V2__) return;
    if (d.querySelector("script[data-unity-meme-bg]")) return;
    var s = d.createElement("script");
    s.src = "/companion/modules/inline-clarity-meme-online-bg-v1.js?v=20261104U2";
    s.async = true;
    s.setAttribute("data-unity-meme-bg", "1");
    s.onload = function () {
      if (typeof w.__memeOnlineFetch === "function") {
        w.memeFetchBg = function (k) {
          try { w.__memeOnlineFetch(k); } catch (e) { loadBg(picsum(k)); }
        };
      }
      log("meme-bg-mod");
    };
    d.head.appendChild(s);
  }

  function boot() {
    killSurfaceDoors();
    layoutBanner();
    loadMemeBgModule();
    setTimeout(function () {
      killSurfaceDoors();
      layoutBanner();
    }, 500);
    setTimeout(function () {
      killSurfaceDoors();
      layoutBanner();
    }, 1200);
    log("boot-v2");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("clarity-a2-spine-ready", function () {
    setTimeout(function () {
      killSurfaceDoors();
      layoutBanner();
      loadMemeBgModule();
    }, 80);
  });
})(window, document);
