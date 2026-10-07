/**
 * Clarity curriculum stamp
 * Source of truth: assets/curriculum/card-map.json
 *
 * Browser: ClarityCurriculumStamp.stamp(document)
 * Node:    node assets/curriculum/stamp-curriculum.js [--write]
 *
 * Sets data-min-i / data-always on cards for CSS-first phase activation:
 *   focus N → html[data-path-i=N] shows min-i <= N (+ always)
 */
(function (root) {
  "use strict";

  var PHASE_INDEX = {
    seeker: 0,
    "new-muslim": 1,
    daily: 2,
    dai: 3
  };

  /** Fallback map if fetch/fs unavailable (kept in sync with card-map.json) */
  var FALLBACK_MAP = {
    version: 1,
    folders: {
      shared: [
        "about-clarity-card",
        "cw-card",
        "user-family-tree-card",
        "faraid-card",
        "wasiyyah-card",
        "notes-shell"
      ],
      seeker: [
        "about-clarity-card",
        "commands-card",
        "creation-tongue-reflection",
        "cw-card",
        "grave-path-card",
        "hell-sins-card",
        "ilm-pathway-card",
        "night-breath-card",
        "samina-card",
        "samina-verse-card",
        "seerah-live-card",
        "soul-compass-card"
      ],
      "new-muslim": [
        "fiqh-quiz-card",
        "hajj-guide-card",
        "new-muslim-foundations-card",
        "salah-starter-card",
        "tibbe-nabwi-card"
      ],
      daily: [
        "asma-names-lecture-card",
        "callig-lab-card",
        "daily-deed-ledger-card",
        "deepen-study-card",
        "hajj-checklist-card",
        "meme-card",
        "najiha-tafseer-card",
        "seerah-mirror-card",
        "tafseer-live-card",
        "tafseer-resources-card",
        "tajweed-live-card",
        "tajweed-path-card",
        "tj-deep-studio",
        "tj-lmr-score-card",
        "tweet-desk-card",
        "weekly-review-card"
      ],
      dai: [
        "dai-transmit-card",
        "israeliyat-card",
        "sealed-nectar-card",
        "tajalliyat-lecture-card",
        "voice-translator-card"
      ]
    }
  };

  function buildLookup(map) {
    var min = {};
    var always = {};
    var folders = (map && map.folders) || FALLBACK_MAP.folders;
    Object.keys(folders).forEach(function (folder) {
      var list = folders[folder] || [];
      if (folder === "shared") {
        list.forEach(function (id) {
          always[id] = 1;
          if (min[id] === undefined) min[id] = 0;
        });
        return;
      }
      var i = PHASE_INDEX[folder];
      if (i === undefined) return;
      list.forEach(function (id) {
        if (min[id] === undefined || i < min[id]) min[id] = i;
      });
    });
    return { min: min, always: always };
  }

  function stampInDocument(doc, map) {
    doc = doc || (typeof document !== "undefined" ? document : null);
    if (!doc) return { ok: false, reason: "no document" };
    var look = buildLookup(map || FALLBACK_MAP);
    var stamped = 0;
    var missing = [];
    var seen = {};

    Object.keys(look.min).forEach(function (id) {
      seen[id] = 1;
      var el = doc.getElementById(id);
      if (!el) {
        missing.push(id);
        return;
      }
      el.setAttribute("data-min-i", String(look.min[id]));
      if (look.always[id]) el.setAttribute("data-always", "1");
      else el.removeAttribute("data-always");
      el.setAttribute("data-curriculum-folder", folderFor(look, id));
      stamped++;
    });

    /* Also stamp any -card nodes not in map (conservative: daily tier) */
    var extra = 0;
    try {
      var nodes = doc.querySelectorAll(".card[id], [id$='-card']");
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (!n.id || seen[n.id]) continue;
        if (!n.hasAttribute("data-min-i")) {
          n.setAttribute("data-min-i", "2");
          n.setAttribute("data-curriculum-folder", "unmapped");
          extra++;
        }
      }
    } catch (e) {}

    return {
      ok: true,
      stamped: stamped,
      missing: missing,
      extra: extra,
      min: look.min,
      always: look.always
    };
  }

  function folderFor(look, id) {
    if (look.always[id]) return "shared";
    var i = look.min[id];
    if (i === 0) return "seeker";
    if (i === 1) return "new-muslim";
    if (i === 2) return "daily";
    if (i === 3) return "dai";
    return "unmapped";
  }

  var api = {
    FALLBACK_MAP: FALLBACK_MAP,
    buildLookup: buildLookup,
    stamp: stampInDocument,
    PHASE_INDEX: PHASE_INDEX
  };

  root.ClarityCurriculumStamp = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
