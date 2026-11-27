/*! craft-meme-sync-nuke-v1.js
 * Single owner: verse ↔ scenery ↔ paint
 * - Verse actions → new line + new BG + paint text after BG loads
 * - Scene actions → new BG + repaint current verse on top
 * Capture-phase handlers so other scripts cannot steal clicks.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_SYNC_NUKE_V1__) return;
  w.__CRAFT_MEME_SYNC_NUKE_V1__ = true;

  var LAST_REF = "clarity.craft.meme.nuke.last_ref";
  var LAST_BG = "clarity.craft.meme.nuke.last_bg";
  var busy = false;

  var POOLS = {
    nature: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1400&q=80"
    ],
    mountain: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6ca91f?auto=format&fit=crop&w=1400&q=80"
    ],
    sky: [
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1400&q=80"
    ],
    water: [
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1400&q=80"
    ],
    forest: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1400&q=80"
    ]
  };

  var FALLBACK_BANK = {
    reminder: [
      { ar: "فَاذْكُرُونِي أَذْكُرْكُمْ", en: "So remember Me; I will remember you.", ref: "Qur’an 2:152" },
      { ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", en: "Verily, in the remembrance of Allah do hearts find rest.", ref: "Qur’an 13:28" },
      { ar: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", en: "Every soul will taste death.", ref: "Qur’an 3:185" }
    ],
    reality: [
      { ar: "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ", en: "And the life of this world is only the enjoyment of deception.", ref: "Qur’an 3:185" },
      { ar: "وَاتَّقُوا يَوْمًا تُرْجَعُونَ فِيهِ إِلَى اللَّهِ", en: "And fear a Day when you will be returned to Allah.", ref: "Qur’an 2:281" },
      { ar: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ", en: "Indeed we belong to Allah, and indeed to Him we will return.", ref: "Qur’an 2:156" }
    ],
    reflection: [
      { ar: "إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ لَآيَاتٍ", en: "Indeed, in the creation of the heavens and the earth are signs.", ref: "Qur’an 3:190" },
      { ar: "وَفِي أَنفُسِكُمْ ۚ أَفَلَا تُبْصِرُونَ", en: "And in yourselves. Then will you not see?", ref: "Qur’an 51:21" }
    ],
    action: [
      { ar: "فَاسْتَبِقُوا الْخَيْرَاتِ", en: "So race to [all that is] good.", ref: "Qur’an 2:148" },
      { ar: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", en: "Indeed, Allah is with the patient.", ref: "Qur’an 2:153" },
      { ar: "وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ", en: "And say, 'Do [as you will], for Allah will see your deeds.'", ref: "Qur’an 9:105" }
    ]
  };

  function $(id) { return d.getElementById(id); }

  function status(msg) {
    var el = $("meme-fetch-status") || $("meme-source-status");
    if (el) el.textContent = msg || "";
  }

  function lastRef() {
    try { return w.localStorage.getItem(LAST_REF) || ""; } catch (e) { return ""; }
  }
  function setRef(r) {
    try { w.localStorage.setItem(LAST_REF, r || ""); } catch (e) {}
  }
  function lastBg() {
    try { return w.localStorage.getItem(LAST_BG) || w.__memeBgUrl || ""; } catch (e) { return w.__memeBgUrl || ""; }
  }
  function setBgUrl(u) {
    try {
      if (u) {
        w.__memeBgUrl = u;
        w.localStorage.setItem(LAST_BG, u);
      }
    } catch (e) {}
  }

  function sectionId() {
    var a = d.querySelector("[data-meme-section].active, [data-rrra].active");
    if (a) return a.getAttribute("data-meme-section") || a.getAttribute("data-rrra") || "reminder";
    return "reminder";
  }

  function linesFor(sec) {
    try {
      var S = w.CraftMemeSource && w.CraftMemeSource.sections;
      if (S && S[sec] && S[sec].lines && S[sec].lines.length) return S[sec].lines;
    } catch (e) {}
    return FALLBACK_BANK[sec] || FALLBACK_BANK.reminder;
  }

  function pickLine(sec) {
    var lines = linesFor(sec);
    var lr = lastRef();
    var pool = lines.filter(function (L) { return (L.ref || "") !== lr; });
    if (!pool.length) pool = lines.slice();
    var line = pool[Math.floor(Math.random() * pool.length)];
    setRef(line.ref || line.en || "");
    return line;
  }

  function pickUrl(kind) {
    kind = kind || "nature";
    var pool = POOLS[kind] || POOLS.nature;
    var all = [];
    Object.keys(POOLS).forEach(function (k) { all = all.concat(POOLS[k]); });
    if (kind === "surprise") pool = all;
    var prev = lastBg();
    var candidates = pool.filter(function (u) { return u !== prev; });
    if (!candidates.length) candidates = pool.slice();
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function remember(img, url) {
    w.__memeBgImage = img;
    w.__memeBgImg = img;
    w.__memeBgUrl = url || (img && img.src) || "";
    if (!w.memeState) w.memeState = {};
    w.memeState.img = img;
    w.memeState.bgImage = img;
    var c = $("meme-canvas") || $("mr-canvas");
    if (c) c._craftBgImage = img;
    setBgUrl(w.__memeBgUrl);
  }

  function paint() {
    try {
      if (typeof w.craftMemeRepaintStandard === "function") return w.craftMemeRepaintStandard();
      if (typeof w.memeDraw === "function") return w.memeDraw();
    } catch (e) {}
    return false;
  }

  function setLayers(line) {
    if (!line) return;
    w.__memeLayers = {
      ar: line.ar || "",
      en: line.en || "",
      ur: "",
      ref: line.ref || ""
    };
    try {
      if (w.CraftMemeSource && w.CraftMemeSource.formatLine && w.CraftMemeSource.applyToDesks) {
        w.CraftMemeSource.applyToDesks(w.CraftMemeSource.formatLine(line));
      }
    } catch (e) {}
    try {
      if (w.CraftMemeUrduFetch) w.CraftMemeUrduFetch.loadForCurrentLayers(false);
    } catch (e2) {}
  }

  function loadBgThenPaint(url, doneMsg) {
    if (!url) {
      paint();
      return;
    }
    status("Loading scenery…");
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      remember(img, url);
      paint();
      /* second paint after urdu may arrive */
      setTimeout(paint, 200);
      setTimeout(paint, 600);
      status(doneMsg || "Ready · educational only — not a fatwa");
      busy = false;
    };
    img.onerror = function () {
      /* try one alternate */
      var alt = pickUrl("nature");
      if (alt && alt !== url) {
        loadBgThenPaint(alt, doneMsg);
        return;
      }
      paint();
      status("Scenery failed · verse painted · educational only");
      busy = false;
    };
    img.src = url;
  }

  /** NEW verse + NEW bg + paint after bg */
  function doVerseAndScene() {
    if (busy) return;
    busy = true;
    var sec = sectionId();
    var line = pickLine(sec);
    setLayers(line);
    paint(); /* show text quickly even before bg */
    var url = pickUrl("surprise");
    loadBgThenPaint(url, "Verse + scenery · " + (line.ref || sec) + " · educational only");
  }

  /** NEW bg only, keep layers, paint after bg */
  function doSceneOnly() {
    if (busy) return;
    busy = true;
    var url = pickUrl("surprise");
    loadBgThenPaint(url, "Scenery updated · verse held · educational only");
  }

  function onClickCapture(ev) {
    var t = ev.target;
    if (!t || !t.closest) return;
    var btn = t.closest("button, [data-meme-section], [data-rrra]");
    if (!btn) return;

    var id = btn.id || "";
    var sec = btn.getAttribute("data-meme-section") || btn.getAttribute("data-rrra");

    /* verse family */
    if (
      id === "meme-refresh-source" ||
      id === "meme-surprise-verse-only" ||
      id === "meme-full-surprise" ||
      id === "meme-daily-pack" ||
      (btn.classList && btn.classList.contains("btn") && /refresh source|verse/i.test(btn.textContent || "") && !/scene only/i.test(btn.textContent || ""))
    ) {
      /* Scene only text excluded above partially */
      if (/scene only/i.test(btn.textContent || "") && id !== "meme-full-surprise") {
        /* fall through to scene */
      } else if (id === "meme-surprise-scene-only") {
        /* scene */
      } else {
        ev.preventDefault();
        ev.stopPropagation();
        doVerseAndScene();
        return;
      }
    }

    if (sec && (btn.hasAttribute("data-meme-section") || btn.hasAttribute("data-rrra"))) {
      ev.preventDefault();
      ev.stopPropagation();
      /* activate chip visually */
      d.querySelectorAll("[data-meme-section], [data-rrra]").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      doVerseAndScene();
      return;
    }

    if (
      id === "meme-surprise-scene-only" ||
      id === "meme-next-bg" ||
      id === "meme-surprise-bg" ||
      id === "meme-scene-for-text"
    ) {
      ev.preventDefault();
      ev.stopPropagation();
      doSceneOnly();
      return;
    }

    /* scenery kind chips */
    if (btn.closest && btn.closest("#meme-scene-chips")) {
      ev.preventDefault();
      ev.stopPropagation();
      var kind = (btn.textContent || "nature").trim().toLowerCase().split(/\s+/)[0];
      if (!POOLS[kind]) kind = "nature";
      if (busy) return;
      busy = true;
      loadBgThenPaint(pickUrl(kind), kind + " · educational only");
      return;
    }
  }

  function boot() {
    d.addEventListener("click", onClickCapture, true);
    /* ensure canvas has layers once */
    if (!(w.__memeLayers && (w.__memeLayers.ar || w.__memeLayers.en))) {
      setLayers(pickLine("reminder"));
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
