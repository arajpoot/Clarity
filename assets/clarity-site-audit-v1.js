/**
 * Clarity Site Audit v1 — runtime verification for media, banner, meme, voice, sections
 * Enable: localStorage.setItem('clarity_audit','1') then reload, or ?audit=1
 * Console: ClarityAudit.run()
 */
(function (root) {
  "use strict";
  if (root.__CLARITY_SITE_AUDIT_V1__) return;
  root.__CLARITY_SITE_AUDIT_V1__ = true;

  var VER = "20261006L3";
  var results = [];

  function ok(name, detail) { results.push({ status: "ok", name: name, detail: detail || "" }); }
  function warn(name, detail) { results.push({ status: "warn", name: name, detail: detail || "" }); }
  function fail(name, detail) { results.push({ status: "fail", name: name, detail: detail || "" }); }

  function checkDom(ids, group) {
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) ok(group + ":" + id, "present");
      else warn(group + ":" + id, "missing");
    });
  }

  function run() {
    results = [];
    // Core shell
    checkDom(["clarity-global-nav", "banner-media", "banner-live"], "shell");
    // Path
    if (root.ClarityPathway) ok("pathway", "ClarityPathway live");
    else warn("pathway", "ClarityPathway missing");
    if (root.__CLARITY_PATH_PROGRESS_V6__) ok("path-progress", "v6");
    else warn("path-progress", "flag missing");
    // Vault
    if (root.AmanaVault) ok("vault", "AmanaVault API");
    else warn("vault", "AmanaVault not loaded yet (lazy OK)");
    if (root.ClarityLazy) ok("lazy", "ClarityLazy present");
    else fail("lazy", "ClarityLazy missing");
    // Media safety
    if (root.__CLARITY_MEDIA_SAFETY__) ok("media-safety", "play/countapi/iframe guards");
    else warn("media-safety", "not injected");
    // Meme
    checkDom(["meme-card", "meme-canvas"], "meme");
    if (typeof root.memeFetchBg === "function") ok("meme:fetchBg", "function");
    else warn("meme:fetchBg", "missing");
    if (typeof root.memeDraw === "function") ok("meme:draw", "function");
    else warn("meme:draw", "missing");
    // Banner live
    var bl = document.getElementById("banner-live");
    if (bl) {
      ok("banner:iframe", "id present");
      if (bl.getAttribute("allow") || bl.allow) ok("banner:allow", "attrs");
    }
    if (typeof root.tryBannerLiveEmbed === "function") ok("banner:tryLive", "function");
    else warn("banner:tryLive", "missing");
    if (typeof root.stopBannerLiveEmbed === "function") ok("banner:stopLive", "function");
    // Voice / Whisper
    if (typeof root.clarityVoiceEnsureWhisper === "function" || typeof root.vtEnsureWhisper === "function")
      ok("voice:ensure", "present");
    else warn("voice:ensure", "not yet loaded");
    if (typeof root.clarityVoiceSearch === "function") ok("voice:search", "present");
    // Lecture players (fixed ids)
    ["asma-lecture-player", "sealed-yt-frame", "tajweed-player", "yaqeen-player",
     "farhat-player", "ishaq-player", "tajalliyat-player", "hajj-yt-frame"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) { warn("player:" + id, "missing"); return; }
      var ds = el.getAttribute("data-src") || "";
      if (/youtube\.com|youtube-nocookie\.com|spotify\.com/.test(ds) || el.src && el.src.indexOf("youtube") >= 0)
        ok("player:" + id, "src ready");
      else warn("player:" + id, "no data-src");
    });
    // No -dup1 leftovers
    if (document.querySelector("[id$='-dup1']")) fail("dup-ids", "still present");
    else ok("dup-ids", "clean");
    // SW
    if ("serviceWorker" in navigator) ok("sw:api", "available");
    // Summary
    var fails = results.filter(function (r) { return r.status === "fail"; });
    var warns = results.filter(function (r) { return r.status === "warn"; });
    var oks = results.filter(function (r) { return r.status === "ok"; });
    var summary = { ok: oks.length, warn: warns.length, fail: fails.length, results: results, ver: VER };
    try { console.table(results); } catch (e) {}
    try { console.log("[ClarityAudit]", summary.ok, "ok ·", summary.warn, "warn ·", summary.fail, "fail"); } catch (e) {}
    return summary;
  }

  root.ClarityAudit = { run: run, version: VER };

  function auto() {
    try {
      var q = new URLSearchParams(location.search);
      if (q.get("audit") === "1" || (root.localStorage && root.localStorage.getItem("clarity_audit") === "1")) {
        setTimeout(function () { run(); }, 1800);
      }
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto);
  else auto();
})(typeof window !== "undefined" ? window : this);
