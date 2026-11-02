/**
 * Clarity Shariah Source Guard v1 — educational authenticity layer
 * - Allowlists Qur'an / timed / graded hadith hosts
 * - Blocks anonymous random hadith & ungraded dua APIs
 * - Does not issue fatwas; forces educational labels on soft sources
 * Educational only — not a fatwa. Verify with a local scholar.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_SHARIAH_SOURCE_GUARD_V1__) return;
  w.__CLARITY_SHARIAH_SOURCE_GUARD_V1__ = "20261025";

  var ALLOW_HOSTS = [
    "api.alquran.cloud",
    "api.quran.com",
    "cdn.qurancdn.com",
    "everyayah.com",
    "api.aladhan.com",
    "cdn.jsdelivr.net", // only for fawazahmed0/hadith-api editions (checked below)
    "fonts.googleapis.com",
    "fonts.gstatic.com",
    "upload.wikimedia.org",
    "www.youtube.com",
    "www.youtube-nocookie.com",
    "open.spotify.com",
    "ipapi.co",
    "ipwho.is",
    "api.open-meteo.com"
  ];

  /** Hosts never used for deen text (random / ungraded) */
  var BLOCK_HOSTS = [
    "ummahapi.com",
    "dua-data-api.vercel.app",
    "api.countapi.xyz",
    "countapi.mileshilliard.com"
  ];

  /** Path must match for jsDelivr hadith */
  var HADITH_PATH_OK = /\/gh\/fawazahmed0\/hadith-api@[^/]+\/editions\/(eng|ara)-(bukhari|muslim|abudawud|nasai|ibnmajah|tirmidhi)\b/i;

  var GRADE_SOFT = /daif|da'if|weak|mawdu|fabricat|no\s*grade|ungraded/i;
  var GRADE_OK = /sahih|hasan|muttafaq|authentic/i;

  function hostOf(url) {
    try { return new URL(url, w.location && w.location.href).hostname.toLowerCase(); }
    catch (e) { return ""; }
  }

  function isBlocked(url) {
    var h = hostOf(url);
    if (!h) return true;
    for (var i = 0; i < BLOCK_HOSTS.length; i++) {
      if (h === BLOCK_HOSTS[i] || h.endsWith("." + BLOCK_HOSTS[i])) return true;
    }
    return false;
  }

  function isAllowHost(url) {
    var h = hostOf(url);
    for (var i = 0; i < ALLOW_HOSTS.length; i++) {
      if (h === ALLOW_HOSTS[i] || h.endsWith("." + ALLOW_HOSTS[i])) return true;
    }
    return false;
  }

  function hadithPathOk(url) {
    try {
      var u = new URL(url, w.location && w.location.href);
      if (u.hostname.indexOf("jsdelivr") === -1) return true;
      return HADITH_PATH_OK.test(u.pathname);
    } catch (e) { return false; }
  }

  /**
   * Returns { ok, reason, educationalOnly }
   */
  w.clarityShariahCheckUrl = function (url) {
    url = String(url || "");
    if (!url || url.indexOf("data:") === 0 || url.indexOf("blob:") === 0) {
      return { ok: true, reason: "local", educationalOnly: true };
    }
    if (isBlocked(url)) {
      return { ok: false, reason: "blocked-host-ungraded-or-metrics", educationalOnly: true };
    }
    if (!isAllowHost(url)) {
      return { ok: false, reason: "host-not-allowlisted", educationalOnly: true };
    }
    if (!hadithPathOk(url)) {
      return { ok: false, reason: "hadith-edition-not-in-kutub-sittah-path", educationalOnly: true };
    }
    return { ok: true, reason: "allow", educationalOnly: true };
  };

  /** Soft grade check on JSON/text payloads */
  w.clarityShariahScanPayload = function (text) {
    text = String(text || "");
    if (GRADE_SOFT.test(text) && !GRADE_OK.test(text)) {
      return { soft: true, label: "Contains weak/ungraded wording — educational only; verify isnād with a scholar." };
    }
    return { soft: false, label: "" };
  };

  /** Wrap fetch: block bad hosts; tag responses */
  var _fetch = w.fetch;
  if (typeof _fetch === "function" && !_fetch.__clarityShariah) {
    w.fetch = function (input, init) {
      var url = typeof input === "string" ? input : (input && input.url) || "";
      var chk = w.clarityShariahCheckUrl(url);
      if (!chk.ok) {
        try {
          console.info("[Clarity Shariah Guard] blocked fetch:", url, chk.reason);
        } catch (e) {}
        return Promise.reject(new Error("Shariah source guard: " + chk.reason));
      }
      return _fetch.apply(this, arguments).then(function (res) {
        try {
          res.headers && res.headers.get; // keep Response as-is
        } catch (e) {}
        return res;
      });
    };
    w.fetch.__clarityShariah = true;
  }

  /** Public allowlist for other modules */
  w.CLARITY_SHARIAH_ALLOW_HOSTS = ALLOW_HOSTS.slice();
  w.CLARITY_SHARIAH_BLOCK_HOSTS = BLOCK_HOSTS.slice();

  /** Stamp educational footer once */
  function stamp() {
    if (document.getElementById("clarity-shariah-stamp")) return;
    var d = document.createElement("div");
    d.id = "clarity-shariah-stamp";
    d.setAttribute("role", "note");
    d.style.cssText = "font-size:0.72rem;opacity:0.75;text-align:center;padding:0.35rem 0.75rem;max-width:52rem;margin:0.5rem auto;";
    d.textContent = "Educational companion — Qur’ān & reported Sunnah sources only where gated. Not a fatwa. Verify with a local scholar.";
    var host = document.getElementById("main-content") || document.body;
    if (host) host.appendChild(d);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(stamp, 400); });
  else setTimeout(stamp, 400);
})(typeof window !== "undefined" ? window : this);
