/*! craft-meme-urdu-fetch-v1 · C19MEME22
 * Urdu pipeline (strict order):
 *  1) Authentic online ayah edition (alquran.cloud) by Arabic-resolved ref
 *  2) Fallback: translate the LOCAL English line (bundled with verse) → Urdu
 *  3) If both fail → blank Urdu
 * Fallback is labeled educational EN→UR of the English rendering — not an official tarjuma.
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_URDU_FETCH_V21__) return;
  w.__CRAFT_MEME_URDU_FETCH_V21__ = true;

  var cache = {};       /* ref → authentic urdu */
  var enCache = {};     /* en hash → mt urdu */
  var EDITIONS = ["ur.jalandhry", "ur.maududi", "ur.ahmedali", "ur.jawadi"];
  var inflight = {};
  var lastError = "";
  var lastRef = "";
  var lastSource = ""; /* "api" | "en-mt" | "" */

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
    var fromAr = refFromArabic(L.ar || "");
    if (fromAr) return fromAr;
    var fromL = normRef(L.ref);
    if (fromL) return fromL;
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

  function fetchAuthenticUrdu(ref) {
    var key = normRef(ref);
    if (!key) return Promise.reject(new Error("no-ref"));
    if (cache[key]) return Promise.resolve({ text: cache[key], edition: "cache", ref: key });
    if (inflight[key]) return inflight[key];

    var chain = Promise.reject(new Error("start"));
    EDITIONS.forEach(function (ed) {
      chain = chain.catch(function () {
        return fetchEdition(key, ed).then(function (text) {
          return { text: text, edition: ed, ref: key };
        });
      });
    });

    inflight[key] = chain
      .then(function (res) {
        cache[key] = res.text;
        delete inflight[key];
        return res;
      })
      .catch(function (err) {
        delete inflight[key];
        throw err;
      });
    return inflight[key];
  }

  /** Fallback: MT of the local English line (same verse object) */
  function translateEnglishToUrdu(en) {
    en = String(en || "").trim();
    if (!en || en.length < 3) return Promise.reject(new Error("no-english"));
    var key = en.slice(0, 240).toLowerCase();
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
        if (!out || /INVALID|QUERY LENGTH|MYMEMORY|ERROR|PLEASE SELECT/i.test(out)) {
          throw new Error("mt-empty");
        }
        /* soft reject if MT clearly looks like a different famous ayah theme vs en */
        enCache[key] = out;
        return out;
      });
  }

  function applyUrdu(text, meta) {
    meta = meta || {};
    if (!w.__memeLayers) w.__memeLayers = { ar: "", en: "", ur: "", ref: "" };
    w.__memeLayers.ur = text || "";
    w.__memeUrduOnline = text || "";
    w.__memeUrduRef = meta.ref || "";
    w.__memeUrduSource = meta.source || ""; /* api | en-mt */
    if (meta.ref && !normRef(w.__memeLayers.ref)) {
      w.__memeLayers.ref = "Qur’an " + meta.ref;
    }
    try {
      if (w.CraftMemeSource && w.CraftMemeSource.saveState) {
        w.CraftMemeSource.saveState({ layers: w.__memeLayers, urduSource: meta.source });
      }
    } catch (e) {}
  }

  function loadForCurrentLayers(thenPaint) {
    var L = w.__memeLayers || {};
    var ref = resolveRef(L);
    var en = String(L.en || "").trim();

    if (ref) {
      var stated = normRef(L.ref);
      if (stated && stated !== ref) {
        if (!w.__memeLayers) w.__memeLayers = {};
        w.__memeLayers.ref = "Qur’an " + ref;
        status("Urdu · ref corrected " + stated + " → " + ref);
      }
    }

    status(ref ? ("Urdu · authentic fetch " + ref + "…") : "Urdu · no ref · trying English fallback…");

    var path = Promise.resolve();
    if (ref) {
      path = fetchAuthenticUrdu(ref).then(function (res) {
        lastError = "";
        lastRef = res.ref;
        lastSource = "api";
        applyUrdu(res.text, { ref: res.ref, source: "api", edition: res.edition });
        status("Urdu · " + res.edition + " · " + res.ref + " · authentic edition · educational only");
        return res.text;
      });
    } else {
      path = Promise.reject(new Error("no-ref"));
    }

    return path
      .catch(function (err) {
        lastError = String((err && err.message) || err || "api-failed");
        if (!en) {
          applyUrdu("", {});
          lastSource = "";
          status("Urdu · no authentic edition & no English · blank");
          return "";
        }
        status("Urdu · authentic miss · translating local English…");
        return translateEnglishToUrdu(en).then(function (ur) {
          lastSource = "en-mt";
          lastRef = ref || "";
          applyUrdu(ur, { ref: ref || "", source: "en-mt" });
          status(
            "Urdu · EN→UR fallback of local English" +
              (ref ? " (" + ref + ")" : "") +
              " · educational only — not official tarjuma"
          );
          return ur;
        });
      })
      .catch(function (err2) {
        lastError = String((err2 && err2.message) || err2 || "all-failed");
        lastSource = "";
        applyUrdu("", {});
        status("Urdu · all sources failed · blank · " + lastError);
        return "";
      })
      .then(function (ur) {
        if (thenPaint) {
          paintNow();
          setTimeout(paintNow, 100);
        }
        return ur;
      });
  }

  w.CraftMemeUrduFetch = {
    fetchUrdu: function (ref) {
      return fetchAuthenticUrdu(ref).then(function (r) { return r.text; });
    },
    loadForCurrentLayers: loadForCurrentLayers,
    translateEnglishToUrdu: translateEnglishToUrdu,
    applyUrdu: applyUrdu,
    resolveRef: resolveRef,
    refFromArabic: refFromArabic,
    cache: cache,
    enCache: enCache,
    normRef: normRef,
    lastError: function () { return lastError; },
    lastRef: function () { return lastRef; },
    lastSource: function () { return lastSource; },
    strictOnline: true,
    enFallback: true
  };
})(window, document);
