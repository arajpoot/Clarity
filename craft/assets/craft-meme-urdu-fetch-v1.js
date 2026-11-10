/*! craft-meme-urdu-fetch-v1 · C19MEME17
 * STRICT online Urdu only — alquran.cloud editions
 * NO local bank fallback for painted Urdu
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_URDU_FETCH_V17__) return;
  w.__CRAFT_MEME_URDU_FETCH_V17__ = true;

  var cache = {};
  var EDITIONS = ["ur.jalandhry", "ur.maududi", "ur.ahmedali"];
  var inflight = {};
  var lastError = "";

  function normRef(ref) {
    var m = String(ref || "").match(/(\d{1,3})\s*[:：]\s*(\d{1,3})/);
    return m ? m[1] + ":" + m[2] : "";
  }

  function status(msg) {
    var el = d.getElementById("meme-source-status") || d.getElementById("meme-audit-status");
    if (el) el.textContent = msg || "";
  }

  function fetchEdition(ref, edition) {
    var url =
      "https://api.alquran.cloud/v1/ayah/" +
      encodeURIComponent(ref) +
      "/" +
      encodeURIComponent(edition);
    return fetch(url, { mode: "cors" }).then(function (r) {
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

    status("Urdu · fetching authentic edition for " + key + "…");
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
        status("Urdu · " + res.edition + " · " + key + " · educational only");
        return res.text;
      })
      .catch(function (err) {
        delete inflight[key];
        lastError = String(err && err.message || err || "fetch-failed");
        status("Urdu · online fetch failed · no bank fallback · " + lastError);
        /* STRICT: do not return bank text */
        return "";
      });
    return inflight[key];
  }

  function applyUrdu(text) {
    if (!w.__memeLayers) w.__memeLayers = { ar: "", en: "", ur: "", ref: "" };
    w.__memeLayers.ur = text || "";
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
      applyUrdu("");
      if (thenPaint && typeof w.memeDraw === "function") {
        try {
          if (w.memeDraw._origDraw) w.memeDraw._origDraw();
          else w.memeDraw();
        } catch (e2) {}
      }
      return Promise.resolve("");
    }
    return fetchUrdu(ref).then(function (ur) {
      applyUrdu(ur);
      if (thenPaint && typeof w.memeDraw === "function") {
        try {
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
    normRef: normRef,
    lastError: function () { return lastError; },
    strictOnline: true
  };
})(window, document);
