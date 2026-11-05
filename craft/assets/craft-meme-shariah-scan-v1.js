/*! craft-meme-shariah-scan-v1 · adapted for Craft
 * Educational only — not a fatwa. Scenery / geometry only.
 */
(function (w) {
  "use strict";
  if (w.__CRAFT_MEME_SHARIAH_SCAN_V1__) return;
  w.__CRAFT_MEME_SHARIAH_SCAN_V1__ = true;

  var BLOCK = /\b(nude|naked|lingerie|bikini|swimwear|porn|xxx|sensual|erotic|kiss|romance-couple|beer|wine|alcohol|party-crowd|tattoo-body|idol|statue-buddha|crucifix|christmas-party|halloween-costume|gambling|casino)\b/i;
  var PEOPLE = /\b(portrait|selfie|face-closeup|woman-model|man-model|girl-boy|fashion-model|celebrity|actress|actor)\b/i;
  var ALLOW = /\b(nature|landscape|mountain|forest|sky|cloud|flower|garden|mosque|minaret|islamic|geometry|arabesque|pattern|tile|architecture|ocean|river|lake|desert|sunrise|sunset|night-sky|waterfall|abstract-geometry|kaaba|haram|nabawi)\b/i;

  w.clarityShariahScanUrl = function (url, meta) {
    var blob = String(url || "") + " " + String(meta || "");
    blob = blob.toLowerCase().replace(/[_\-\/]/g, " ");
    if (BLOCK.test(blob)) return { ok: false, reason: "blocked-theme" };
    if (PEOPLE.test(blob) && !ALLOW.test(blob)) return { ok: false, reason: "people-focus" };
    return { ok: true, reason: ALLOW.test(blob) ? "allow-theme" : "neutral" };
  };

  w.clarityShariahFilterUrls = function (urls, metaList) {
    var out = [];
    (urls || []).forEach(function (u, i) {
      var meta = (metaList && metaList[i]) || "";
      if (w.clarityShariahScanUrl(u, meta).ok) out.push(u);
    });
    return out;
  };

  function wrapLoader() {
    var _load = w.memeLoadImageFromUrl;
    if (typeof _load !== "function" || _load._craftShariah) return;
    w.memeLoadImageFromUrl = function (url, onFailMsg) {
      var scan = w.clarityShariahScanUrl(url, "");
      if (!scan.ok) {
        try {
          var el = document.getElementById("meme-fetch-status");
          if (el) el.textContent = "Skipped non-compliant image — try another…";
        } catch (e) {}
        if (typeof w.__memeOnlineFetch === "function") {
          setTimeout(function () { w.__memeOnlineFetch("nature"); }, 120);
        }
        return;
      }
      return _load(url, onFailMsg);
    };
    w.memeLoadImageFromUrl._craftShariah = true;
  }

  wrapLoader();
  setTimeout(wrapLoader, 500);
})(window);
