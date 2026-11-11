/*! craft-meme-urdu-fetch-v1 · C19MEME27
 * Short meme lines → Urdu from LOCAL English (same scope as canvas)
 * Long / full-ayah English → authentic alquran.cloud edition
 * Never paint a long tarjuma under a short Arabic/English card
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_URDU_FETCH_V27__) return;
  w.__CRAFT_MEME_URDU_FETCH_V27__ = true;

  var cache = {};
  var enCache = {};
  var EDITIONS = ["ur.jalandhry", "ur.maududi", "ur.ahmedali"];
  var inflight = {};
  var lastError = "";
  var lastRef = "";
  var lastSource = "";

  var AR_REF = [
    { k: "تَطْمَئِنُّ الْقُلُوبُ", ref: "13:28" },
    { k: "تطمئن القلوب", ref: "13:28" },
    { k: "فَاذْكُرُونِي", ref: "2:152" },
    { k: "الذِّكْرَىٰ تَنفَعُ", ref: "51:55" },
    { k: "ذَائِقَةُ الْمَوْتِ", ref: "3:185" },
    { k: "كُلُّ مَنْ عَلَيْهَا فَانٍ", ref: "55:26" },
    { k: "عَلَيْهَا فَان", ref: "55:26" },
    { k: "اتَّقُوا اللَّهَ", ref: "59:18" },
    { k: "اتقوا الله", ref: "59:18" },
    { k: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا", ref: "59:18" },
    { k: "اعْمَلُوا فَسَيَرَى", ref: "9:105" },
    { k: "تُرْجَعُونَ فِيهِ إِلَى اللَّهِ", ref: "2:281" },
    { k: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ", ref: "2:156" },
    { k: "خَلَقْنَاكُمْ عَبَثًا", ref: "23:115" },
    { k: "خَلْقِ السَّمَاوَاتِ", ref: "3:190" },
    { k: "فَاسْتَبِقُوا الْخَيْرَاتِ", ref: "2:148" },
    { k: "مَعَ الصَّابِرِينَ", ref: "2:153" }
  ];

  function strip(s) {
    return String(s || "").replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "").replace(/\s+/g, " ").trim();
  }
  function normRef(ref) {
    var m = String(ref || "").match(/(\d{1,3})\s*[:：]\s*(\d{1,3})/);
    return m ? m[1] + ":" + m[2] : "";
  }
  function refFromArabic(ar) {
    var n = strip(ar);
    if (!n) return "";
    for (var i = 0; i < AR_REF.length; i++) {
      if (n.indexOf(strip(AR_REF[i].k)) !== -1) return AR_REF[i].ref;
    }
    return "";
  }
  function resolveRef(L) {
    L = L || w.__memeLayers || {};
    return refFromArabic(L.ar || "") || normRef(L.ref) || "";
  }
  function isShortLine(en, ar) {
    var words = String(en || "").trim().split(/\s+/).filter(Boolean);
    if (words.length > 0 && words.length <= 16) return true;
    if (String(ar || "").length > 0 && String(ar || "").length < 80) return true;
    return false;
  }
  function status(msg) {
    var el = d.getElementById("meme-source-status") || d.getElementById("meme-audit-status");
    if (el) el.textContent = msg || "";
  }
  function paintNow() {
    try {
      if (typeof w.craftMemeRepaintStandard === "function") w.craftMemeRepaintStandard();
      else if (typeof w.memeDraw === "function") w.memeDraw();
    } catch (e) {}
  }
  function applyUrdu(text, meta) {
    meta = meta || {};
    if (!w.__memeLayers) w.__memeLayers = { ar: "", en: "", ur: "", ref: "" };
    w.__memeLayers.ur = text || "";
    w.__memeUrduOnline = text || "";
    w.__memeUrduSource = meta.source || "";
    w.__memeUrduRef = meta.ref || "";
  }

  function fetchEdition(ref, edition) {
    var url = "https://api.alquran.cloud/v1/ayah/" + encodeURIComponent(ref) + "/" + encodeURIComponent(edition);
    return fetch(url, { mode: "cors", credentials: "omit" }).then(function (r) {
      if (!r.ok) throw new Error("http " + r.status);
      return r.json();
    }).then(function (j) {
      if (!j || j.code !== 200 || !j.data || !j.data.text) throw new Error("empty");
      return String(j.data.text).replace(/\s+/g, " ").trim();
    });
  }

  function fetchAuthentic(ref) {
    var key = normRef(ref);
    if (!key) return Promise.reject(new Error("no-ref"));
    if (cache[key]) return Promise.resolve({ text: cache[key], edition: "cache", ref: key });
    var chain = Promise.reject(new Error("start"));
    EDITIONS.forEach(function (ed) {
      chain = chain.catch(function () {
        return fetchEdition(key, ed).then(function (text) {
          return { text: text, edition: ed, ref: key };
        });
      });
    });
    return chain.then(function (res) {
      cache[key] = res.text;
      return res;
    });
  }

  function translateEnglish(en) {
    en = String(en || "").trim();
    if (!en) return Promise.reject(new Error("no-en"));
    var key = en.slice(0, 200).toLowerCase();
    if (enCache[key]) return Promise.resolve(enCache[key]);
    var url =
      "https://api.mymemory.translated.net/get?q=" +
      encodeURIComponent(en.slice(0, 400)) +
      "&langpair=en|ur";
    return fetch(url, { mode: "cors", credentials: "omit" })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var out = (j && j.responseData && j.responseData.translatedText) || "";
        out = String(out).trim();
        if (!out || /INVALID|MYMEMORY|ERROR|QUERY LENGTH/i.test(out)) throw new Error("mt-empty");
        enCache[key] = out;
        return out;
      });
  }

  /** Clip long authentic Urdu to ~2 lines worth for short cards */
  function clipUrdu(text, maxChars) {
    text = String(text || "").replace(/\s+/g, " ").trim();
    if (!maxChars || text.length <= maxChars) return text;
    var cut = text.slice(0, maxChars);
    var sp = cut.lastIndexOf(" ");
    if (sp > maxChars * 0.5) cut = cut.slice(0, sp);
    return cut.replace(/[،,؛;]+$/, "").trim() + "…";
  }

  function loadForCurrentLayers(thenPaint) {
    var L = w.__memeLayers || {};
    var en = String(L.en || "").trim();
    var ar = String(L.ar || "").trim();
    var ref = resolveRef(L);
    var short = isShortLine(en, ar);

    /* SHORT CARD: Urdu must match English scope — not full ayah tarjuma */
    if (short && en) {
      status("Urdu · matching short English line…");
      return translateEnglish(en)
        .then(function (ur) {
          lastSource = "en-mt-short";
          lastRef = ref || "";
          applyUrdu(ur, { source: "en-mt-short", ref: ref });
          status("Urdu · short line (matches English) · educational only — not tarjuma");
          if (thenPaint) paintNow();
          return ur;
        })
        .catch(function () {
          if (!ref) {
            applyUrdu("", {});
            status("Urdu · blank");
            if (thenPaint) paintNow();
            return "";
          }
          return fetchAuthentic(ref).then(function (res) {
            var clipped = clipUrdu(res.text, 110);
            lastSource = "api-clipped";
            lastRef = res.ref;
            applyUrdu(clipped, { source: "api-clipped", ref: res.ref });
            status("Urdu · authentic clipped to card · " + res.ref + " · educational only");
            if (thenPaint) paintNow();
            return clipped;
          });
        })
        .catch(function (err) {
          lastError = String(err && err.message || err);
          applyUrdu("", {});
          status("Urdu · unavailable · blank");
          if (thenPaint) paintNow();
          return "";
        });
    }

    /* LONG card: authentic full edition */
    if (ref) {
      status("Urdu · authentic " + ref + "…");
      return fetchAuthentic(ref)
        .then(function (res) {
          lastSource = "api";
          lastRef = res.ref;
          applyUrdu(res.text, { source: "api", ref: res.ref, edition: res.edition });
          status("Urdu · " + res.edition + " · " + res.ref + " · educational only");
          if (thenPaint) paintNow();
          return res.text;
        })
        .catch(function () {
          if (!en) {
            applyUrdu("", {});
            if (thenPaint) paintNow();
            return "";
          }
          return translateEnglish(en).then(function (ur) {
            lastSource = "en-mt";
            applyUrdu(ur, { source: "en-mt", ref: ref });
            status("Urdu · EN→UR fallback · educational only — not official tarjuma");
            if (thenPaint) paintNow();
            return ur;
          });
        })
        .catch(function () {
          applyUrdu("", {});
          if (thenPaint) paintNow();
          return "";
        });
    }

    applyUrdu("", {});
    if (thenPaint) paintNow();
    return Promise.resolve("");
  }

  w.CraftMemeUrduFetch = {
    loadForCurrentLayers: loadForCurrentLayers,
    resolveRef: resolveRef,
    refFromArabic: refFromArabic,
    cache: cache,
    enCache: enCache,
    lastSource: function () { return lastSource; },
    lastRef: function () { return lastRef; },
    lastError: function () { return lastError; }
  };
})(window, document);
