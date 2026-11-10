/*! craft-meme-urdu-fetch-v1 · C19MEME18
 * Strict online Urdu (alquran.cloud) · no bank paint
 * Hardened: always writes __memeLayers.ur and forces paint-standard
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_URDU_FETCH_V18__) return;
  w.__CRAFT_MEME_URDU_FETCH_V18__ = true;

  var cache = {};
  var EDITIONS = ["ur.jalandhry", "ur.maududi", "ur.ahmedali", "ur.jawadi"];
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
    return fetch(url, { mode: "cors", credentials: "omit", cache: "default" }).then(function (r) {
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
        status("Urdu · " + res.edition + " · " + key + " · educational only");
        return res.text;
      })
      .catch(function (err) {
        delete inflight[key];
        lastError = String((err && err.message) || err || "fetch-failed");
        status("Urdu · online fetch failed · " + lastError + " · no bank");
        return "";
      });
    return inflight[key];
  }

  function applyUrdu(text) {
    if (!w.__memeLayers) w.__memeLayers = { ar: "", en: "", ur: "", ref: "" };
    w.__memeLayers.ur = text || "";
    w.__memeUrduOnline = text || "";
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
      status("Urdu · waiting for verse ref…");
      if (thenPaint) paintNow();
      return Promise.resolve("");
    }
    return fetchUrdu(ref).then(function (ur) {
      applyUrdu(ur);
      if (thenPaint) {
        paintNow();
        setTimeout(paintNow, 120);
      }
      return ur;
    });
  }

  w.CraftMemeUrduFetch = {
    fetchUrdu: fetchUrdu,
    loadForCurrentLayers: loadForCurrentLayers,
    applyUrdu: applyUrdu,
    cache: cache,
    normRef: normRef,
    lastError: function () { return lastError; },
    strictOnline: true
  };
})(window, document);
