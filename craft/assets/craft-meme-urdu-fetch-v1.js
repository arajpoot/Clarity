/*! craft-meme-urdu-fetch-v1 · C19MEME19
 * STRICT online Urdu only — alquran.cloud
 * Ref resolved from Arabic text first (never stale ref / never bank)
 * If fetch fails or ref unknown → blank Urdu (no fallback text)
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_URDU_FETCH_V19__) return;
  w.__CRAFT_MEME_URDU_FETCH_V19__ = true;

  var cache = {};
  var EDITIONS = ["ur.jalandhry", "ur.maududi", "ur.ahmedali", "ur.jawadi"];
  var inflight = {};
  var lastError = "";
  var lastRef = "";

  /* Distinctive Arabic fingerprints → ayah (no Urdu stored here) */
  var AR_REF = [
    { k: "تَطْمَئِنُّ الْقُلُوبُ", ref: "13:28" },
    { k: "تطمئن القلوب", ref: "13:28" },
    { k: "فَاذْكُرُونِي", ref: "2:152" },
    { k: "فاذكروني", ref: "2:152" },
    { k: "الذِّكْرَىٰ تَنفَعُ", ref: "51:55" },
    { k: "الذكرى تنفع", ref: "51:55" },
    { k: "ذَائِقَةُ الْمَوْتِ", ref: "3:185" },
    { k: "ذائقة الموت", ref: "3:185" },
    { k: "كُلُّ مَنْ عَلَيْهَا فَانٍ", ref: "55:26" },
    { k: "كل من عليها فان", ref: "55:26" },
    { k: "عَلَيْهَا فَان", ref: "55:26" },
    { k: "خَلَقْنَاكُمْ عَبَثًا", ref: "23:115" },
    { k: "تُرْجَعُونَ فِيهِ إِلَى اللَّهِ", ref: "2:281" },
    { k: "ترجعون فيه الى الله", ref: "2:281" },
    { k: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ", ref: "2:156" },
    { k: "اعْمَلُوا فَسَيَرَى", ref: "9:105" },
    { k: "اتَّقُوا اللَّهَ", ref: "59:18" },
    { k: "اتقوا الله", ref: "59:18" },
    { k: "خَلْقِ السَّمَاوَاتِ", ref: "3:190" },
    { k: "فَاسْتَبِقُوا الْخَيْرَاتِ", ref: "2:148" },
    { k: "مَعَ الصَّابِرِينَ", ref: "2:153" },
    { k: "عَلَى الْبِرِّ وَالتَّقْوَىٰ", ref: "5:2" },
    { k: "تَوْفِيقِي إِلَّا بِاللَّهِ", ref: "11:88" },
    { k: "وَفِي أَنفُسِكُمْ", ref: "51:21" },
    { k: "مَتَاعُ الْغُرُورِ", ref: "3:185" }
  ];

  function strip(s) {
    return String(s || "")
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
      .replace(/\s+/g, " ")
      .trim();
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
    /* 1) Arabic wins */
    var fromAr = refFromArabic(L.ar || "");
    if (fromAr) return fromAr;
    /* 2) explicit ref on layers */
    var fromL = normRef(L.ref);
    if (fromL) return fromL;
    /* 3) auditor helpers if present */
    try {
      if (w.CraftMemeAuditor) {
        if (w.CraftMemeAuditor.detectRefFromArabic) {
          var a = w.CraftMemeAuditor.detectRefFromArabic(L.ar || "");
          if (a) return a;
        }
        if (w.CraftMemeAuditor.detectRefFromEnglish) {
          var e = w.CraftMemeAuditor.detectRefFromEnglish(L.en || "");
          if (e) return e;
        }
      }
    } catch (err) {}
    return "";
  }

  function status(msg) {
    var el = d.getElementById("meme-source-status") || d.getElementById("meme-audit-status");
    if (el) el.textContent = msg || "";
  }

  function paintNow() {
    try {
      if (typeof w.craftMemeRepaintStandard === "function") {
        w.craftMemeRepaintStandard();
        return;
      }
    } catch (e) {}
    try {
      if (typeof w.memeDraw === "function") {
        if (w.memeDraw._origDraw) w.memeDraw._origDraw();
        else w.memeDraw();
      }
    } catch (e2) {}
  }

  function fetchEdition(ref, edition) {
    var url =
      "https://api.alquran.cloud/v1/ayah/" +
      encodeURIComponent(ref) +
      "/" +
      encodeURIComponent(edition);
    return fetch(url, { mode: "cors", credentials: "omit" }).then(function (r) {
      if (!r.ok) throw new Error("http " + r.status);
      return r.json();
    }).then(function (j) {
      if (!j || j.code !== 200 || !j.data || !j.data.text) throw new Error("empty");
      return String(j.data.text).replace(/\s+/g, " ").trim();
    });
  }

  function fetchUrdu(ref) {
    var key = normRef(ref);
    if (!key) {
      lastError = "no-ref";
      return Promise.resolve("");
    }
    if (cache[key]) return Promise.resolve(cache[key]);
    if (inflight[key]) return inflight[key];

    status("Urdu · fetching " + key + "…");
    var chain = Promise.reject(new Error("start"));
    EDITIONS.forEach(function (ed) {
      chain = chain.catch(function () {
        return fetchEdition(key, ed).then(function (text) {
          return { text: text, edition: ed };
        });
      });
    });

    inflight[key] = chain
      .then(function (res) {
        cache[key] = res.text;
        delete inflight[key];
        lastError = "";
        lastRef = key;
        status("Urdu · " + res.edition + " · " + key + " · educational only");
        return res.text;
      })
      .catch(function (err) {
        delete inflight[key];
        lastError = String((err && err.message) || err || "fetch-failed");
        status("Urdu · fetch failed for " + key + " · blank Urdu · " + lastError);
        return "";
      });
    return inflight[key];
  }

  function applyUrdu(text, ref) {
    if (!w.__memeLayers) w.__memeLayers = { ar: "", en: "", ur: "", ref: "" };
    w.__memeLayers.ur = text || "";
    w.__memeUrduOnline = text || "";
    w.__memeUrduRef = ref || "";
    if (ref && !normRef(w.__memeLayers.ref)) {
      w.__memeLayers.ref = "Qur’an " + ref;
    }
    /* if Arabic says a different ref than previous urdu, clear until match */
    var arRef = refFromArabic(w.__memeLayers.ar || "");
    if (arRef && ref && arRef !== ref) {
      w.__memeLayers.ur = "";
      w.__memeUrduOnline = "";
    }
  }

  function loadForCurrentLayers(thenPaint) {
    var L = w.__memeLayers || {};
    var ref = resolveRef(L);
    if (!ref) {
      applyUrdu("", "");
      status("Urdu · no ayah ref from Arabic · blank");
      if (thenPaint) paintNow();
      return Promise.resolve("");
    }
    /* stale-guard: if layers.ref disagrees with Arabic, Arabic wins */
    var stated = normRef(L.ref);
    if (stated && stated !== ref) {
      status("Urdu · ref corrected " + stated + " → " + ref);
      if (!w.__memeLayers) w.__memeLayers = {};
      w.__memeLayers.ref = "Qur’an " + ref;
    }
    return fetchUrdu(ref).then(function (ur) {
      applyUrdu(ur, ref);
      if (thenPaint) {
        paintNow();
        setTimeout(paintNow, 100);
      }
      return ur;
    });
  }

  w.CraftMemeUrduFetch = {
    fetchUrdu: fetchUrdu,
    loadForCurrentLayers: loadForCurrentLayers,
    applyUrdu: applyUrdu,
    resolveRef: resolveRef,
    refFromArabic: refFromArabic,
    cache: cache,
    normRef: normRef,
    lastError: function () { return lastError; },
    lastRef: function () { return lastRef; },
    strictOnline: true,
    noBank: true
  };
})(window, document);
