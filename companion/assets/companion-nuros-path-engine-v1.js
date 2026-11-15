/*! companion-nuros-path-engine-v1 · NurOS Path Intelligence
 * Shariah-aligned path routing + daily routine priority + on-device learning
 * Educational only — not a fatwa. Does not issue rulings. Companion only.
 *
 * Principles:
 * 1) Qurʾān first, then graded ḥadīth, then seerah/character, then tools
 * 2) Enrichment never deleted — reorder / emphasize / soft-defer only
 * 3) Path gates complexity, not īmān grade
 * 4) Learns locally from dwell + opens (no server)
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_NUROS_PATH_ENGINE_V1__) return;
  w.__COMPANION_NUROS_PATH_ENGINE_V1__ = true;

  var PATHS = ["seeker", "new_muslim", "practicing", "dai"];
  var PATH_RANK = { seeker: 0, new_muslim: 1, practicing: 2, dai: 3 };
  var KEY_PATH = "clarity_gate_v1";
  var KEY_LEARN = "cu_nuros_path_learn_v1";
  var KEY_ROUTINE = "cu_nuros_routine_priorities_v1";

  /** Shariah-aware catalog: id or title match → routing metadata */
  var CATALOG = [
    // Reminder — waḥy & commands
    { match: /commands-card|Allah.?s Commands/i, tab: "reminder", src: "quran", min: 0, slot: ["fajr", "day", "anytime"], weight: 100, adab: "primary" },
    { match: /samina-verse|Samiʿnā|command-verse/i, tab: "reminder", src: "quran", min: 0, slot: ["fajr", "day"], weight: 95, adab: "primary" },
    { match: /card-hadith|Saying of the Prophet/i, tab: "reminder", src: "hadith", min: 0, slot: ["day", "anytime"], weight: 90, adab: "primary" },
    { match: /prophet-name|Name of the Prophet/i, tab: "reminder", src: "seerah", min: 0, slot: ["day"], weight: 70, adab: "secondary" },
    { match: /ilm-pathway/i, tab: "reminder", src: "educational", min: 1, slot: ["day"], weight: 60, adab: "secondary" },
    { match: /tafseer|Tafseer/i, tab: "reminder", src: "educational", min: 2, slot: ["day", "night"], weight: 55, adab: "secondary" },
    { match: /meme-card|Meme Studio|companion-meme/i, tab: "reminder", src: "craft", min: 1, slot: ["day"], weight: 40, adab: "tool" },
    { match: /callig-lab|Calligraphy/i, tab: "reminder", src: "craft", min: 1, slot: ["day"], weight: 40, adab: "tool" },
    // Reality — what happened
    { match: /seerah-live|Daily Seerah|Seerah timeline|Stories of the Prophets/i, tab: "reality", src: "seerah", min: 0, slot: ["day", "night"], weight: 88, adab: "primary" },
    { match: /israeliyat|Previous Nations/i, tab: "reality", src: "quran", min: 1, slot: ["day"], weight: 75, adab: "secondary" },
    { match: /Life Events|tibbe-nabwi|Ṭibb/i, tab: "reality", src: "educational", min: 1, slot: ["day"], weight: 50, adab: "secondary" },
    { match: /Janāzah|funeral/i, tab: "reality", src: "educational", min: 2, slot: ["anytime"], weight: 65, adab: "secondary" },
    { match: /weekly-review|Deepen your study/i, tab: "reality", src: "educational", min: 1, slot: ["night"], weight: 55, adab: "secondary" },
    // Reflection — heart
    { match: /night-breath|If I die tonight|Soul Compass/i, tab: "reflection", src: "educational", min: 0, slot: ["night", "maghrib"], weight: 92, adab: "primary" },
    { match: /Character Lesson|Beautiful Names|Asmā/i, tab: "reflection", src: "quran", min: 0, slot: ["night", "day"], weight: 85, adab: "primary" },
    { match: /tawbah|My Journey/i, tab: "reflection", src: "educational", min: 0, slot: ["night", "maghrib"], weight: 90, adab: "primary" },
    { match: /Verse from the Quran/i, tab: "reflection", src: "quran", min: 0, slot: ["fajr", "night"], weight: 93, adab: "primary" },
    // Action — practice
    { match: /Guarding the tongue|One pause|Small deeds/i, tab: "action", src: "hadith", min: 0, slot: ["day", "anytime"], weight: 88, adab: "primary" },
    { match: /Building on Pillars|Teach what you live|Daʿi path/i, tab: "action", src: "educational", min: 1, slot: ["day"], weight: 70, adab: "secondary" },
    { match: /hifz|Hifẓ|Memorization/i, tab: "action", src: "quran", min: 1, slot: ["fajr", "day"], weight: 90, adab: "primary" },
    { match: /tj-deep|Tajweed|tajweed-path/i, tab: "action", src: "quran", min: 1, slot: ["fajr", "day"], weight: 85, adab: "primary" },
    { match: /hajj-guide|Hajj Ritual/i, tab: "action", src: "educational", min: 2, slot: ["anytime"], weight: 60, adab: "secondary" },
    { match: /Warnings of the Fire|Hell/i, tab: "action", src: "hadith", min: 2, slot: ["night"], weight: 50, adab: "secondary" },
    { match: /action-studios-board|Studios & rites/i, tab: "action", src: "craft", min: 0, slot: ["day"], weight: 45, adab: "tool" },
    { match: /Voice translator|Guided search|Sharia IQ/i, tab: "action", src: "tool", min: 2, slot: ["day"], weight: 35, adab: "tool" },
    // Notes / About
    { match: /ledger|Quick note|Notes/i, tab: "notes", src: "educational", min: 0, slot: ["night", "anytime"], weight: 70, adab: "secondary" },
    { match: /Write to Clarity|About this Companion|About Companion/i, tab: "about", src: "meta", min: 0, slot: ["anytime"], weight: 40, adab: "meta" }
  ];

  function getPath() {
    try {
      var p = (localStorage.getItem(KEY_PATH) || "seeker").toLowerCase();
      if (p.indexOf("new") >= 0) return "new_muslim";
      if (p.indexOf("dai") >= 0 || p.indexOf("da'i") >= 0) return "dai";
      if (p.indexOf("practic") >= 0 || p.indexOf("daily") >= 0) return "practicing";
      if (p.indexOf("seeker") >= 0) return "seeker";
      return PATH_RANK[p] != null ? p : "seeker";
    } catch (e) {
      return "seeker";
    }
  }

  function routineSlot() {
    var h = new Date().getHours();
    if (h >= 4 && h < 8) return "fajr";
    if (h >= 8 && h < 16) return "day";
    if (h >= 16 && h < 19) return "maghrib";
    return "night";
  }

  function learnState() {
    try {
      return JSON.parse(localStorage.getItem(KEY_LEARN) || "{}");
    } catch (e) {
      return {};
    }
  }
  function saveLearn(s) {
    try {
      localStorage.setItem(KEY_LEARN, JSON.stringify(s));
    } catch (e) {}
  }

  function userPriorities() {
    try {
      var p = JSON.parse(localStorage.getItem(KEY_ROUTINE) || "null");
      if (p && typeof p === "object") return p;
    } catch (e) {}
    // defaults by path
    var path = getPath();
    if (path === "seeker") return { quran: 1.2, hadith: 1.1, seerah: 1.0, educational: 0.9, craft: 0.7, tool: 0.5 };
    if (path === "new_muslim") return { quran: 1.3, hadith: 1.0, seerah: 1.1, educational: 1.1, craft: 0.6, tool: 0.5 };
    if (path === "practicing") return { quran: 1.2, hadith: 1.1, seerah: 0.9, educational: 1.0, craft: 1.0, tool: 0.8 };
    return { quran: 1.1, hadith: 1.1, seerah: 1.0, educational: 1.0, craft: 0.9, tool: 1.0 }; // dai
  }

  function classify(el) {
    var id = el.id || "";
    var title = "";
    var h = el.querySelector("h2, h3, summary");
    if (h) title = h.textContent || "";
    var blob = id + " " + title + " " + (el.className || "");
    for (var i = 0; i < CATALOG.length; i++) {
      if (CATALOG[i].match.test(blob)) return CATALOG[i];
    }
    return {
      match: null,
      tab: null,
      src: "educational",
      min: 0,
      slot: ["anytime"],
      weight: 30,
      adab: "secondary"
    };
  }

  function score(meta, path, slot, learn) {
    var rank = PATH_RANK[path] || 0;
    var s = meta.weight || 30;
    // path fitness
    if (rank < (meta.min || 0)) s *= 0.35; // defer advanced — do not remove
    else s *= 1 + Math.min(0.25, (rank - (meta.min || 0)) * 0.08);
    // routine slot
    var slots = meta.slot || ["anytime"];
    if (slots.indexOf(slot) >= 0 || slots.indexOf("anytime") >= 0) s *= 1.25;
    else s *= 0.85;
    // source priority (Shariah ordering)
    var srcBoost = { quran: 1.3, hadith: 1.2, seerah: 1.1, educational: 1.0, craft: 0.9, tool: 0.85, meta: 0.7 };
    s *= srcBoost[meta.src] || 1;
    // user path priorities
    var pr = userPriorities();
    s *= pr[meta.src] || 1;
    // self-learn boost
    var lid = meta._id || "";
    if (learn[lid] && learn[lid].opens) s *= 1 + Math.min(0.4, learn[lid].opens * 0.03);
    return s;
  }

  function cardsIn(root) {
    return Array.prototype.slice.call(
      root.querySelectorAll(
        ".card, section.cs-plaque.cs-card, section.cs-plaque[id], [data-rrra].card, [data-nuros-card]"
      )
    ).filter(function (el) {
      // avoid tiny nested
      return el.children && el.children.length && !el.closest(".card .card");
    });
  }

  function alignMount(root) {
    if (!root) return;
    var path = getPath();
    var slot = routineSlot();
    var learn = learnState();
    var list = cardsIn(root);
    if (!list.length) return;

    var scored = list.map(function (el, idx) {
      var meta = classify(el);
      meta._id = el.id || "auto-" + idx;
      el.setAttribute("data-nuros-src", meta.src);
      el.setAttribute("data-nuros-min", String(meta.min || 0));
      el.setAttribute("data-nuros-score", "0");
      var sc = score(meta, path, slot, learn);
      el.setAttribute("data-nuros-score", String(Math.round(sc)));
      // soft defer advanced content for lower paths — visible but ordered down + dim
      var deferred = (PATH_RANK[path] || 0) < (meta.min || 0);
      el.classList.toggle("nuros-deferred", deferred);
      el.classList.toggle("nuros-priority", sc >= 100);
      return { el: el, sc: sc, meta: meta };
    });

    scored.sort(function (a, b) {
      return b.sc - a.sc;
    });

    // Re-append in score order within common parent when safe
    var parent = scored[0].el.parentNode;
    var sameParent = scored.every(function (x) {
      return x.el.parentNode === parent;
    });
    if (sameParent && parent) {
      scored.forEach(function (x) {
        parent.appendChild(x.el);
      });
    }

    // Focus plaque message
    paintFocusRibbon(path, slot, scored[0] && scored[0].meta);

    // Track opens for learning
    scored.forEach(function (x) {
      if (x.el.__nurosLearn) return;
      x.el.__nurosLearn = true;
      x.el.addEventListener(
        "click",
        function () {
          var st = learnState();
          var id = x.meta._id;
          st[id] = st[id] || { opens: 0 };
          st[id].opens = (st[id].opens || 0) + 1;
          st[id].last = Date.now();
          saveLearn(st);
        },
        true
      );
    });

    w.__NUROS_LAST_ALIGN__ = {
      path: path,
      slot: slot,
      count: scored.length,
      top: scored.slice(0, 5).map(function (x) {
        return { id: x.meta._id, src: x.meta.src, sc: Math.round(x.sc) };
      })
    };
  }

  function paintFocusRibbon(path, slot, topMeta) {
    var msg = d.getElementById("cs-focus-msg");
    var pathEl = d.getElementById("cs-focus-path");
    var labels = {
      seeker: "Seeker · wake the heart",
      new_muslim: "New Muslim · pillars first",
      practicing: "Daily · consistency",
      dai: "Daʿi · transmission with adab"
    };
    if (pathEl) pathEl.textContent = (labels[path] || path) + " · " + slot;
    if (!msg) return;
    var tips = {
      fajr: "Before the day widens: one āyah or short wird — quality over volume.",
      day: "One command lived is heavier than ten unread.",
      maghrib: "Return the heart: istighfār, then one steady deed.",
      night: "If this were the last night: what light did you send ahead?"
    };
    var srcNote = topMeta && topMeta.src === "quran" ? " Qurʾān-first ordering active." : "";
    msg.textContent = (tips[slot] || tips.day) + srcNote + " Educational only — not a fatwa.";
  }

  function bindPathButtons() {
    d.querySelectorAll("[data-cs-path]").forEach(function (btn) {
      if (btn.__nurosPath) return;
      btn.__nurosPath = true;
      btn.addEventListener("click", function () {
        setTimeout(function () {
          alignMount(d.getElementById("cs-mount"));
        }, 200);
      });
    });
  }

  function boot() {
    bindPathButtons();
    alignMount(d.getElementById("cs-mount"));
    var mount = d.getElementById("cs-mount");
    if (mount && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(function () {
          bindPathButtons();
          alignMount(mount);
        }, 80);
      }).observe(mount, { childList: true, subtree: false });
    }
    // realign on hour change lightly
    setInterval(function () {
      alignMount(d.getElementById("cs-mount"));
    }, 15 * 60 * 1000);
  }

  w.ClarityNurosPathEngine = {
    align: function () {
      alignMount(d.getElementById("cs-mount"));
    },
    getPath: getPath,
    slot: routineSlot,
    catalogSize: CATALOG.length,
    setRoutinePriorities: function (obj) {
      try {
        localStorage.setItem(KEY_ROUTINE, JSON.stringify(obj || {}));
      } catch (e) {}
      alignMount(d.getElementById("cs-mount"));
    }
  };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
