/*! craft-meme-verse-cycle-v1.js · VC3
 * Verse change ALWAYS pulls a new scenery (do not preserve BG).
 * Scene-only still changes BG only.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  w.__CRAFT_MEME_VERSE_CYCLE_V1__ = true;
  w.__CRAFT_MEME_VERSE_CYCLE_V3__ = true;

  var LAST_REF = "clarity.craft.meme.last_ref.v1";
  var LAST_BG = "clarity.craft.meme.last_bg.v1";

  function status(msg) {
    var el = d.getElementById("meme-source-status") || d.getElementById("meme-fetch-status");
    if (el) el.textContent = msg || "";
  }
  function getLastRef() {
    try { return w.localStorage.getItem(LAST_REF) || ""; } catch (e) { return ""; }
  }
  function setLastRef(ref) {
    try { w.localStorage.setItem(LAST_REF, ref || ""); } catch (e) {}
  }
  function getLastBg() {
    try { return w.localStorage.getItem(LAST_BG) || w.__memeBgUrl || ""; } catch (e) { return w.__memeBgUrl || ""; }
  }
  function setLastBg(url) {
    try {
      if (url) {
        w.__memeBgUrl = url;
        w.localStorage.setItem(LAST_BG, url);
      }
    } catch (e) {}
  }

  function paintOnly() {
    try {
      if (typeof w.craftMemeRepaintStandard === "function") w.craftMemeRepaintStandard();
      else if (typeof w.memeDraw === "function") w.memeDraw();
    } catch (e) {}
  }

  function pickRotating(lines) {
    if (!lines || !lines.length) return null;
    var last = getLastRef();
    var pool = lines.filter(function (L) { return (L.ref || "") !== last; });
    if (!pool.length) pool = lines.slice();
    var line = pool[Math.floor(Math.random() * pool.length)];
    setLastRef(line.ref || line.en || "");
    return line;
  }

  function activeSection() {
    var active = d.querySelector("[data-meme-section].active, [data-rrra].active");
    if (active)
      return active.getAttribute("data-meme-section") || active.getAttribute("data-rrra") || "reminder";
    return "reminder";
  }

  function bank(sectionId) {
    var secs = w.CraftMemeSource && w.CraftMemeSource.sections;
    var lines = secs && secs[sectionId] && secs[sectionId].lines;
    if (lines && lines.length) return lines;
    return [
      { ar: "فَاذْكُرُونِي أَذْكُرْكُمْ", en: "So remember Me; I will remember you.", ref: "Qur’an 2:152" },
      { ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", en: "Verily, in the remembrance of Allah do hearts find rest.", ref: "Qur’an 13:28" },
      { ar: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", en: "Every soul will taste death.", ref: "Qur’an 3:185" },
      { ar: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", en: "Indeed, Allah is with the patient.", ref: "Qur’an 2:153" },
      { ar: "فَاسْتَبِقُوا الْخَيْرَاتِ", en: "So race to [all that is] good.", ref: "Qur’an 2:148" },
      { ar: "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ", en: "And the life of this world is only the enjoyment of deception.", ref: "Qur’an 3:185" }
    ];
  }

  function applyLine(line, sectionId) {
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
    paintOnly();
    status("Verse · " + (line.ref || sectionId) + " · educational only");
  }

  function fetchNewBg() {
    var prev = getLastBg();
    var kinds = ["nature", "water", "mountain", "sky", "forest", "ocean", "surprise"];
    var kind = kinds[Math.floor(Math.random() * kinds.length)];
    try {
      if (typeof w.memeFetchBg === "function") w.memeFetchBg(kind === "surprise" ? "surprise" : kind);
      else if (typeof w.__memeOnlineFetch === "function") w.__memeOnlineFetch(kind === "surprise" ? "nature" : kind);
    } catch (e) {}
    setTimeout(function () {
      var now = w.__memeBgUrl || "";
      try {
        var img = w.__memeBgImage || w.__memeBgImg;
        if (img && img.src) now = img.src;
      } catch (e2) {}
      if (now) setLastBg(now);
      if (prev && now && prev === now) {
        try {
          if (typeof w.memeFetchBg === "function") w.memeFetchBg("nature");
          else if (typeof w.__memeOnlineFetch === "function") w.__memeOnlineFetch("water");
        } catch (e3) {}
        setTimeout(function () {
          try {
            var img2 = w.__memeBgImage;
            if (img2 && img2.src) setLastBg(img2.src);
          } catch (e4) {}
        }, 600);
      }
    }, 650);
  }

  function loadFreshVerse(sectionId, withNewBg) {
    sectionId = sectionId || activeSection();
    var line = pickRotating(bank(sectionId));
    applyLine(line, sectionId);
    if (withNewBg !== false) {
      setTimeout(fetchNewBg, 40);
      status("Verse · " + (line && line.ref ? line.ref : sectionId) + " + new scenery · educational only");
    }
    return line;
  }

  function patchSource() {
    if (!w.CraftMemeSource) return;
    w.CraftMemeSource.fetchSection = function (sectionId) {
      sectionId = sectionId || "reminder";
      var line = pickRotating(bank(sectionId));
      return {
        section: sectionId,
        label: sectionId,
        line: line,
        text: w.CraftMemeSource.formatLine ? w.CraftMemeSource.formatLine(line) : (line.en || "")
      };
    };
    w.CraftMemeSource.fetchSection.__cycle = true;
    w.CraftMemeSource.loadSection = function (sectionId, paint) {
      var result = w.CraftMemeSource.fetchSection(sectionId || "reminder");
      if (result && result.line) {
        applyLine(result.line, result.section);
        if (paint !== false) setTimeout(fetchNewBg, 40);
      }
      return result;
    };
    w.CraftMemeSource.loadSection.__cycle = true;
  }

  function rebind(id, handler) {
    var el = d.getElementById(id);
    if (!el || !el.parentNode) return;
    var clone = el.cloneNode(true);
    el.parentNode.replaceChild(clone, el);
    clone.addEventListener("click", handler);
  }

  function bind() {
    patchSource();
    rebind("meme-refresh-source", function () { loadFreshVerse(activeSection(), true); });
    rebind("meme-surprise-verse-only", function () { loadFreshVerse(activeSection(), true); });
    rebind("meme-full-surprise", function () { loadFreshVerse(activeSection(), true); });
    rebind("meme-surprise-scene-only", function () {
      fetchNewBg();
      status("Scene only · verse held · educational only");
    });
    rebind("meme-next-bg", function () {
      fetchNewBg();
      status("Next background · verse held");
    });
    rebind("meme-surprise-bg", function () {
      fetchNewBg();
      status("Scenery · verse held");
    });
    d.querySelectorAll("[data-meme-section], [data-rrra]").forEach(function (btn) {
      if (btn.__cycle_v3) return;
      btn.__cycle_v3 = true;
      btn.addEventListener("click", function () {
        setTimeout(function () {
          var id = btn.getAttribute("data-meme-section") || btn.getAttribute("data-rrra") || "reminder";
          loadFreshVerse(id, true);
        }, 0);
      }, true);
    });
    setInterval(function () {
      try {
        var img = w.__memeBgImage;
        if (img && img.src) setLastBg(img.src);
      } catch (e) {}
    }, 1200);
  }

  function boot() { bind(); }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 300);
  setTimeout(boot, 1000);
})(window, document);
