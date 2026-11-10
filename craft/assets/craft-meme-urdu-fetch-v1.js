/*! craft-meme-urdu-fetch-v1 · C19MEME15
 * Authentic Urdu from alquran.cloud (Jalandhry / Maududi) by verse ref
 * Bank is fallback only when API unavailable
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_URDU_FETCH_V1__) return;
  w.__CRAFT_MEME_URDU_FETCH_V1__ = true;

  var cache = {};
  var EDITIONS = ["ur.jalandhry", "ur.maududi", "ur.ahmedali"];
  var inflight = {};

  function normRef(ref) {
    var m = String(ref || "").match(/(\d{1,3})\s*[:：]\s*(\d{1,3})/);
    return m ? m[1] + ":" + m[2] : "";
  }

  function bankFallback(ref) {
    try {
      if (w.CraftMemeAuditor && w.CraftMemeAuditor.VERSE_BANK) {
        var k = normRef(ref);
        var e = w.CraftMemeAuditor.VERSE_BANK[k];
        if (e && e.ur) return e.ur;
      }
    } catch (e) {}
    return "";
  }

  function fetchEdition(ref, edition) {
    var url = "https://api.alquran.cloud/v1/ayah/" + encodeURIComponent(ref) + "/" + encodeURIComponent(edition);
    return fetch(url, { mode: "cors" })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var t = j && j.data && j.data.text;
        if (!t || j.code !== 200) throw new Error("no text");
        return String(t).replace(/\s+/g, " ").trim();
      });
  }

  function fetchUrdu(ref) {
    var key = normRef(ref);
    if (!key) return Promise.resolve("");
    if (cache[key]) return Promise.resolve(cache[key]);
    if (inflight[key]) return inflight[key];

    var chain = Promise.reject();
    EDITIONS.forEach(function (ed) {
      chain = chain.catch(function () { return fetchEdition(key, ed); });
    });
    inflight[key] = chain
      .then(function (text) {
        cache[key] = text;
        delete inflight[key];
        return text;
      })
      .catch(function () {
        delete inflight[key];
        var fb = bankFallback(key);
        if (fb) cache[key] = fb;
        return fb || "";
      });
    return inflight[key];
  }

  function applyUrdu(text) {
    if (!text) return;
    if (!w.__memeLayers) w.__memeLayers = {};
    w.__memeLayers.ur = text;
    try {
      if (w.CraftMemeSource && w.CraftMemeSource.saveState) {
        w.CraftMemeSource.saveState({ layers: w.__memeLayers });
      }
    } catch (e) {}
  }

  function loadForCurrentLayers(thenPaint) {
    var L = w.__memeLayers || {};
    var ref = normRef(L.ref);
    if (!ref && w.CraftMemeAuditor) {
      try {
        ref =
          w.CraftMemeAuditor.detectRefFromArabic(L.ar || "") ||
          w.CraftMemeAuditor.detectRefFromEnglish(L.en || "") ||
          "";
      } catch (e) {}
    }
    if (!ref) {
      if (thenPaint && typeof w.memeDraw === "function") {
        try { w.memeDraw(); } catch (e2) {}
      }
      return Promise.resolve("");
    }
    return fetchUrdu(ref).then(function (ur) {
      if (ur) applyUrdu(ur);
      if (thenPaint && typeof w.memeDraw === "function") {
        try {
          /* paint after urdu set — audit runs inside wrapped draw */
          if (w.memeDraw._origDraw) w.memeDraw._origDraw();
          else w.memeDraw();
        } catch (e3) {}
      }
      return ur;
    });
  }

  w.CraftMemeUrduFetch = {
    fetchUrdu: fetchUrdu,
    loadForCurrentLayers: loadForCurrentLayers,
    cache: cache,
    normRef: normRef
  };
})(window, document);
