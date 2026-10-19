/**
 * Clarity Lab · network translate fallbacks (GTX → MyMemory → Libre)
 * Educational only. Soft-fail when offline.
 */
(function (g) {
  "use strict";
  if (g.__CU_LINGUA_API_V1__) return;
  g.__CU_LINGUA_API_V1__ = true;

  async function apiTranslate(text, sl, tl) {
    var src = sl === "auto" ? "en" : sl;
    var q = String(text || "").slice(0, 450);
    var pair = src + "|" + tl;
    if (!q.trim()) return "";

    try {
      var gUrl =
        "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +
        encodeURIComponent(src) +
        "&tl=" +
        encodeURIComponent(tl) +
        "&dt=t&q=" +
        encodeURIComponent(q);
      var gRes = await fetch(gUrl);
      if (gRes.ok) {
        var gData = await gRes.json();
        if (Array.isArray(gData) && Array.isArray(gData[0])) {
          var out = gData[0]
            .filter(Boolean)
            .map(function (row) {
              return row[0];
            })
            .join("");
          if (out && out.trim()) return out.trim();
        }
      }
    } catch (_) {}

    try {
      var url =
        "https://api.mymemory.translated.net/get?q=" +
        encodeURIComponent(q) +
        "&langpair=" +
        encodeURIComponent(pair);
      var res = await fetch(url);
      if (res.ok) {
        var data = await res.json();
        var translated = data && data.responseData && data.responseData.translatedText;
        if (translated && translated.trim().toLowerCase() !== q.trim().toLowerCase()) {
          return translated.trim();
        }
      }
    } catch (_) {}

    try {
      var res2 = await fetch("https://libretranslate.com/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: q, source: src, target: tl, format: "text" })
      });
      if (res2.ok) {
        var data2 = await res2.json();
        if (data2 && data2.translatedText) return String(data2.translatedText).trim();
      }
    } catch (_) {}

    return "";
  }

  async function translateSmart(text, sl, tl) {
    var off = g.CuLinguaOffline && g.CuLinguaOffline.translate(text, sl, tl);
    if (off) return { text: off, source: "offline" };
    var net = await apiTranslate(text, sl, tl);
    if (net) return { text: net, source: "network" };
    return { text: "", source: "none" };
  }

  g.CuLinguaApi = {
    apiTranslate: apiTranslate,
    translateSmart: translateSmart
  };
})(window);
