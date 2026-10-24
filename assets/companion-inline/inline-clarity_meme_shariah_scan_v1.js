(function(){
"use strict";
if (window.__CLARITY_MEME_SHARIAH_SCAN_V1__) return;
window.__CLARITY_MEME_SHARIAH_SCAN_V1__ = true;

/** Auto-scan URLs / metadata before applying meme backgrounds */
var BLOCK = /\b(nude|naked|lingerie|bikini|swimwear|porn|xxx|sensual|erotic|kiss|romance-couple|beer|wine|alcohol|party-crowd|tattoo-body|idol|statue-buddha|crucifix|christmas-party|halloween-costume|gambling|casino)\b/i;
var PEOPLE = /\b(portrait|selfie|face-closeup|woman-model|man-model|girl-boy|fashion-model|celebrity|actress|actor)\b/i;
var ALLOW = /\b(nature|landscape|mountain|forest|sky|cloud|flower|garden|mosque|minaret|islamic|geometry|arabesque|pattern|tile|architecture|ocean|river|lake|desert|sunrise|sunset|night-sky|waterfall|abstract-geometry)\b/i;

window.clarityShariahScanUrl = function(url, meta){
  var blob = String(url || "") + " " + String(meta || "");
  blob = blob.toLowerCase().replace(/[_\-\/]/g, " ");
  if (BLOCK.test(blob)) return { ok: false, reason: "blocked-theme" };
  if (PEOPLE.test(blob) && !ALLOW.test(blob)) return { ok: false, reason: "people-focus" };
  /* Prefer allow keywords when present; neutral landscape URLs still OK */
  return { ok: true, reason: ALLOW.test(blob) ? "allow-theme" : "neutral" };
};

window.clarityShariahFilterUrls = function(urls, metaList){
  var out = [];
  (urls || []).forEach(function(u, i){
    var meta = (metaList && metaList[i]) || "";
    var r = window.clarityShariahScanUrl(u, meta);
    if (r.ok) out.push(u);
  });
  return out;
};

/* Wrap image loader */
var _load = window.memeLoadImageFromUrl;
if (typeof _load === "function") {
  window.memeLoadImageFromUrl = function(url, onFailMsg){
    var scan = window.clarityShariahScanUrl(url, "");
    if (!scan.ok) {
      try {
        if (typeof memeFetchStatus === "function") memeFetchStatus("Skipped non-compliant image — fetching another…");
      } catch(e){}
      try {
        if (typeof window.__memeOnlineFetch === "function") {
          setTimeout(function(){ window.__memeOnlineFetch("nature"); }, 120);
        }
      } catch(e2){}
      return;
    }
    return _load(url, onFailMsg);
  };
}

/* Patch commons/flickr caches through filter when engine exposes cache */
var _applyFilterToCache = function(){
  try {
    var c = window._memeOnlineCache;
    if (!c) return;
    Object.keys(c).forEach(function(k){
      if (Array.isArray(c[k])) c[k] = window.clarityShariahFilterUrls(c[k]);
    });
  } catch(e){}
};
setInterval(_applyFilterToCache, 4000);
})();