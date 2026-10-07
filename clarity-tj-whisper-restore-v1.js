/**
 * Clarity Tajweed + Whisper Restore v1
 * - Loads nx-tj-lmr when tajweed UI is shown / rail clicked
 * - Ensures Whisper CDN is allowed path; soft fallback to Web Speech API
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_TJ_WHISPER_RESTORE_V1__) return;
  g.__CLARITY_TJ_WHISPER_RESTORE_V1__ = true;

  function loadTj() {
    if (g.__tjLmrLoaded) return Promise.resolve(true);
    if (g.ClarityLazy && typeof g.ClarityLazy.tjLmr === "function") {
      return g.ClarityLazy.tjLmr().then(function () {
        g.__tjLmrLoaded = true;
        try {
          if (typeof g.nurosStartLmrMeter === "function") { /* ready */ }
        } catch (e) {}
        return true;
      }).catch(function () { return false; });
    }
    return new Promise(function (res) {
      if (document.querySelector('script[data-clarity-lazy="tj-lmr"]')) {
        g.__tjLmrLoaded = true;
        res(true);
        return;
      }
      var s = document.createElement("script");
      s.src = "./assets/nx-tj-lmr-js-v1.js?v=20261006C";
      s.defer = true;
      s.dataset.clarityLazy = "tj-lmr";
      s.onload = function () { g.__tjLmrLoaded = true; res(true); };
      s.onerror = function () { res(false); };
      (document.body || document.documentElement).appendChild(s);
    });
  }

  function maybeLoadFromClick(ev) {
    try {
      var t = ev.target;
      if (!t || !t.closest) return;
      var hit = t.closest(
        "#tj-lmr, #tj-lmr-panel, #tj-deep-studio, #tajweed-path-card, #tajweed-live-card, [data-rail-tab='tajweed'], .door-rail-btn[data-rail-tab='tajweed'], #callig-lab-card"
      );
      if (hit) loadTj();
    } catch (e) {}
  }

  document.addEventListener("click", maybeLoadFromClick, true);
  document.addEventListener("pointerdown", maybeLoadFromClick, true);

  /* Prefetch when path allows practicing+ */
  function prefetchIfReady() {
    try {
      var max = parseInt(document.documentElement.getAttribute("data-clarity-unlocked-max") || "0", 10);
      if (max >= 2) {
        if ("requestIdleCallback" in g)
          requestIdleCallback(function () { loadTj(); }, { timeout: 8000 });
        else setTimeout(loadTj, 5000);
      }
    } catch (e) {}
  }
  g.addEventListener("load", function () { setTimeout(prefetchIfReady, 2000); });
  g.addEventListener("clarity-path-changed", function () { setTimeout(prefetchIfReady, 500); });

  /* Whisper: wrap ensure to fall back to webkitSpeechRecognition */
  function installWhisperFallback() {
    var prev = g.clarityVoiceEnsureWhisper;
    if (typeof prev !== "function" || prev.__restored) return false;
    g.clarityVoiceEnsureWhisper = async function () {
      try {
        return await prev.apply(this, arguments);
      } catch (e) {
        console.warn("Whisper load failed, using Web Speech if available", e);
        return null;
      }
    };
    g.clarityVoiceEnsureWhisper.__restored = true;
    return true;
  }

  /* Soft speech recognition helper for studio */
  g.claritySpeechCapture = function (opts) {
    opts = opts || {};
    return new Promise(function (resolve, reject) {
      var SR = g.SpeechRecognition || g.webkitSpeechRecognition;
      if (!SR) {
        reject(new Error("Speech recognition unavailable"));
        return;
      }
      var rec = new SR();
      rec.lang = opts.lang || "ar-SA";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      var done = false;
      rec.onresult = function (ev) {
        done = true;
        try {
          resolve((ev.results[0][0].transcript || "").trim());
        } catch (e) {
          reject(e);
        }
      };
      rec.onerror = function (ev) {
        if (!done) reject(new Error((ev && ev.error) || "speech-error"));
      };
      rec.onend = function () {
        if (!done) reject(new Error("no-speech"));
      };
      try { rec.start(); } catch (e2) { reject(e2); }
    });
  };

  function boot() {
    installWhisperFallback();
    setTimeout(installWhisperFallback, 1500);
    setTimeout(installWhisperFallback, 4000);
    /* If tajweed panel already in DOM and visible, load */
    try {
      var panel = document.getElementById("tj-lmr-panel");
      if (panel && panel.open) loadTj();
    } catch (e) {}
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", boot);

  g.ClarityTjRestore = { load: loadTj, speech: g.claritySpeechCapture };
})(typeof window !== "undefined" ? window : this);
