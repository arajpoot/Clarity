/*! companion-reminder-enrich-v1 · ensure Meme Studio + Tweet desk wire after tab mount
 * Loads archive meme assets + tweet desk; calls craft rehydrate.
 * Educational only — not a fatwa. Companion only.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_REMINDER_ENRICH_V1__) return;
  w.__COMPANION_REMINDER_ENRICH_V1__ = true;

  var loaded = {};
  function loadScript(src) {
    return new Promise(function (resolve) {
      if (loaded[src]) return resolve(true);
      if (d.querySelector('script[data-enrich-src="' + src + '"]')) {
        loaded[src] = true;
        return resolve(true);
      }
      var s = d.createElement("script");
      s.src = src;
      s.async = true;
      s.setAttribute("data-enrich-src", src);
      s.onload = function () { loaded[src] = true; resolve(true); };
      s.onerror = function () { resolve(false); };
      d.head.appendChild(s);
    });
  }
  function loadCss(href) {
    if (d.querySelector('link[data-enrich-href="' + href + '"]')) return;
    var l = d.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    l.setAttribute("data-enrich-href", href);
    d.head.appendChild(l);
  }

  function enrich() {
    var root = d.getElementById("cs-mount") || d;
    var hasMeme = !!root.querySelector("#meme-card, #meme-canvas, #meme-studio-root");
    var hasTweet = !!root.querySelector("#tweet-desk-card, #td-text");
    if (!hasMeme && !hasTweet) return;

    loadCss("/assets/clarity-meme-layout-v1.css");
    var jobs = [];
    if (hasMeme) {
      jobs.push(loadScript("/assets/clarity-meme-canvas-clean-v1.js"));
      jobs.push(loadScript("/assets/clarity-meme-bg-fetch-v1.js"));
    }
    if (hasTweet) {
      jobs.push(loadScript("/companion/assets/companion-tweet-desk-v1.js?v=20261116ER1"));
      jobs.push(loadScript("/companion/modules/inline-clarity-tj-meme-tweet-revamp-js.js"));
    }
    Promise.all(jobs).then(function () {
      try {
        if (w.ClarityCompanionCraft && typeof w.ClarityCompanionCraft.rehydrate === "function") {
          w.ClarityCompanionCraft.rehydrate();
        }
      } catch (e) {}
      try {
        if (typeof w.memeFetchBg === "function") {
          /* globals ready for onclick */
        }
      } catch (e2) {}
      try {
        if (typeof w.tdLoadHandle === "function") w.tdLoadHandle();
      } catch (e3) {}
      try {
        if (typeof w.tdCount === "function") w.tdCount();
      } catch (e4) {}
      // bridge meme → tweet if missing
      if (typeof w.memeSendToTweetDesk !== "function") {
        w.memeSendToTweetDesk = function () {
          try {
            var s = w.memeState || {};
            var lines = [s.top || "", s.mid || "", s.bottom || ""].filter(Boolean);
            var ta = d.getElementById("td-text");
            if (ta) {
              ta.value = lines.join("\n").slice(0, 280);
              if (typeof w.tdCount === "function") w.tdCount();
            }
            var card = d.getElementById("tweet-desk-card");
            if (card && card.scrollIntoView) card.scrollIntoView({ behavior: "smooth", block: "nearest" });
          } catch (e5) {}
        };
      }
    });
  }

  function boot() {
    enrich();
    d.addEventListener("clarity:tab-mounted", function () {
      setTimeout(enrich, 80);
      setTimeout(enrich, 300);
    });
    var mount = d.getElementById("cs-mount");
    if (mount && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(enrich, 120);
      }).observe(mount, { childList: true });
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
